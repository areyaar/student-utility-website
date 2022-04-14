const edit = document.querySelector('.btn-yellow')
const save = document.querySelector('.btn-green')
const note = document.querySelector('.note')
const textArea = document.querySelector('.note-edit')
const text = note.innerText



const burger = document.querySelector('.burger-cont')
const burgerCont = document.querySelector('.burger-cont-super')


const main = document.querySelector('.main')

edit.addEventListener('click' , ()=>{
     textArea.innerText = text
     note.style.display = "none"
     textArea.style.display = "block"
})

burgerCont.addEventListener('click',()=>{
     burger.classList.toggle('open')
     main.classList.toggle('nav')
})





