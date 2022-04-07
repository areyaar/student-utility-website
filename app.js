const express = require('express');
const app =  express();

app.set('view engine', 'ejs');

app.get('/', (req,res)=>{
    res.render('index.ejs');
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
