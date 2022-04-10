const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const Notes = require('./models/notes');
const passport = require('passport');
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
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Login/Signup Page
app.get('/', (req, res) => {
    res.render('landing.ejs');
})

//Login route logic
app.post('/', passport.authenticate('local', { failureRedirect: '/' }), async (req, res) => {
    res.redirect('/notes');
})

//Register route logic
app.post('/register', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({
            email,
            username
        })
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, e => {
            if (e) {
                return next(e);
            } res.redirect('/notes');
        })

    } catch (e) {
        next(e);
    }
})
app.get('/notes', isLoggedIn, async (req, res) => {
    const notes = await Notes.find({});
    res.render('notes.ejs', { notes });
})

app.get('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const notes = await Notes.find({});
    const thisNote = await Notes.findById(id).exec();
    //console.log(noted);
    res.render('show.ejs', { notes, thisNote });
})
//edit form
app.get('/notes/:id/edit', async (req, res) => {
    const { id } = req.params;
    const thisNote = await Notes.findById(id).exec();
    res.render('edit.ejs', { thisNote });
})
app.get('/new', (req, res) => {
    res.render('new.ejs');
})
//add new
app.post('/new', async (req, res) => {
    const { title, note } = req.body;
    //res.send(req.body);
    const newNote = new Notes({ title, note });
    const noteess = await newNote.save()
    //console.log(noteess);
    res.redirect('/notes');
})
//edit a note
app.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const {note, title} = req.body;
    const newNote = await Notes.findByIdAndUpdate(id,{note , title});
    res.redirect(`/notes/${id}`);
})
//delete a note
app.delete('/notes/:id', async(req,res)=>{
    const {id} = req.params;
    await Notes.findByIdAndDelete(id);
    res.redirect('/notes');
})

//Catch all
app.get('*', (req, res) => {
    res.send("Webpage does not exist!")
})

// error handling


app.listen(3000, () => {
    console.log("On 3000!");
})
