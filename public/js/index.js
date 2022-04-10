const signup = document.querySelector(".btn-sign")
const leftContent = document.querySelector(".left-content")
const leftParent = document.querySelector(".left")
const signupDiv = document.querySelector(".signup-div")
const close = document.querySelector(".close")

signup.addEventListener('click' , ()=>{
    leftContent.classList.add('hide-left')
    leftParent.style.flex = "0 0 100%"
    signupDiv.classList.remove('signup-div')

})

close.addEventListener('click',()=>{
    leftContent.classList.remove('hide-left')
    leftParent.style.flex = "0 0 30%"
    signupDiv.classList.add('signup-div')
})