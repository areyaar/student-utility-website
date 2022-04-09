const express = require('express');
const app =  express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const Notes = require('./models/notes');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
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

app.use(express.urlencoded({extended: true}));

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

app.get('/testregister',async (req,res)=>{
    const user = new User({
        
        username:"saket12334"
    })
    const newUser = await User.register(user, 'saketsoni');
    res.send(newUser);
    
})

app.get('/', (req,res)=>{
    res.render('landing.ejs');
})

//Login route logic
app.post('/', passport.authenticate('local', {failureRedirect: '/'}), async (req, res)=>{
    res.render('notes');
})

//Register route logic
app.post('/register', async (req,res,next)=>{
    try{
        const {email, username, password} = req.body;
    const user = new User({
        email,
        username
    })
    const registeredUser = await User.register(user, password);
    res.send(registeredUser);
    //res.redirect('/notes');
    } catch(e){
        next(e);
    }
    
})


app.get('/notes', async (req, res)=>{
    const notes = await Notes.find({});
    console.log(notes);
    res.render('notes.ejs',{notes});
})
app.get('/notes/:id', (req, res)=>{
    const {id} = req.params;

    res.send(`note number ${id}`);
})

//Catch all
app.get('*', (req,res)=>{
    res.send("Webpage does not exist!")
})

// error handling


app.listen(3000, ()=>{
    console.log("On 3000!");
})
