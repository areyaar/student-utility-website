const express = require('express');
const app =  express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const Note = require('./models/notes');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');



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
        email:"saketsoni@gmail.com",
        username:"saket1234"
    })
    const newUser = await User.register(user, 'saketsoni');
    res.send(newUser);
    
})

app.get('/', (req,res)=>{
    res.render('landing.ejs');
})
app.get('/notes', (req, res)=>{
    res.render('notes.ejs');
})
app.get('/notes/:id', (req, res)=>{
    const {id} = req.params;

    res.send(`note number ${id}`);
})
app.get('/todo', (req,res)=>{
    res.send("ToDo app!")
})
app.get('/search', (req,res)=>{
    console.log(req.query);
    res.send("Hi!");
})
//Catch all
app.get('*', (req,res)=>{
    res.send("Webpage does not exist!")
})

app.listen(3000, ()=>{
    console.log("On 3000!");
})
