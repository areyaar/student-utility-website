const mongoose = require('mongoose');
const Note = require('./models/notes');

mongoose.connect('mongodb://localhost:27017/notes', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


const n1 = new Note({
    title:'Welcome!',
    note:'Welcome to NoteHub, This is an Example Note.',
    author:'6252b476c6c6f54ace666877'
})
n1.save()
    .then(e=>{
        console.log(e);
    })
    .catch(e=>{
        console.log(e);
    })