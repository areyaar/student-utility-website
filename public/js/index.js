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


let passwordInput = document.getElementById('txtPassword'),
    toggle = document.getElementById('btnToggle'),
    icon =  document.getElementById('eyeIcon');

function togglePassword() {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.add("fa-eye-slash");
    //toggle.innerHTML = 'hide';
  } else {
    passwordInput.type = 'password';
    icon.classList.remove("fa-eye-slash");
    //toggle.innerHTML = 'show';
  }
}

function checkInput() {
  //if (passwordInput.value === '') {
  //toggle.style.display = 'none';
  //toggle.innerHTML = 'show';
  //  passwordInput.type = 'password';
  //} else {
  //  toggle.style.display = 'block';
  //}
}

toggle.addEventListener('click', togglePassword, false);
passwordInput.addEventListener('keyup', checkInput, false);
