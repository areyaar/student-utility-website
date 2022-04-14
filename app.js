const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const Notes = require('./models/notes');
const passport = require('passport');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const methodOverride = require('method-override');
const { isLoggedIn } = require('./middleware');
const { notDeepEqual } = require('assert');
const { redirect } = require('express/lib/response');
//const popup = require('popups');



mongoose.connect('mongodb://localhost:27017/notes', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR")
        console.log(err)
    })


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Login/Signup Page
app.get('/', (req, res) => {
    res.render('landing.ejs');
});

//Login route logic
app.post('/', passport.authenticate('local', { failureRedirect: '/' }), catchAsync(async (req, res) => {
    res.redirect('/notes');
}));

//Register route logic
app.post('/register', catchAsync(async (req, res, next) => {
        const { email, username, password } = req.body;
        const user = new User({
            email,
            username
        })
        const registeredUser = await User.register(user, password);
        //Making a Welcome Note
        const n1 = new Notes({
            title:'Welcome!',
            note:'Welcome to NoteHub, This is an Example Note.',
            author: registeredUser._id
        })
        await n1.save();
        req.login(registeredUser, e => {
            if (e) {
                return next(e);
            } res.redirect('/notes');
        })
}));
app.get('/notes', isLoggedIn, catchAsync(async (req, res) => {
    const notes = await Notes.find({author : req.user._id});
    res.render('notes.ejs', { notes });
}));

app.get('/notes/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const notes = await Notes.find({author : req.user._id});
    const thisNote = await Notes.findById(id).exec();
    //console.log(noted);
    res.render('show.ejs', { notes, thisNote });
}));
//edit form
app.get('/notes/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const thisNote = await Notes.findById(id).exec();
    res.render('edit.ejs', { thisNote });
}));
app.get('/new', (req, res) => {
    res.render('new.ejs');
});
//add new
app.post('/new', catchAsync(async (req, res) => {
    const { title, note } = req.body;
    //res.send(req.body);
    const newNote = new Notes({ title, note });
    newNote.author = req.user._id;
    const noteess = await newNote.save()
    res.redirect('/notes');
}));
//edit a note
app.put('/notes/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const {note, title} = req.body;
    const newNote = await Notes.findByIdAndUpdate(id,{note , title});
    res.redirect(`/notes/${id}`);
}));
//delete a note
app.delete('/notes/:id', catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Notes.findByIdAndDelete(id);
    res.redirect('/notes');
}));
app.get('/logout', (req,res)=>{
    req.logout();
    res.redirect('/');
});

//Catch all
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// error handling
app.use((err,req,res,next)=>{
    const {statusCode = 500, message = 'Something Went Wrong!'} = err;
    res.status(statusCode).send(message);
});

app.listen(3000, () => {
    console.log("On 3000!");
});
