const form = document.querySelector('form')
const usernameError = document.querySelector('.username.error')
const emailError = document.querySelector('.email.error')
const passwordError = document.querySelector('.password.error')

// Focus class
let inputs = document.querySelectorAll(".input-group input")
// console.log(inputs)
inputs.forEach(input => {
    input.addEventListener('input', function () {
        if (this.value.trim() !== '') {
          this.classList.add('focused');
        } else {
          this.classList.remove('focused');
        }
      });
})


form.addEventListener('submit', async (e) => {
  e.preventDefault()

  //Reset errors
  usernameError.innerText = '';
  emailError.innerText = '';
  passwordError.innerText = '';

  //get values = form.name_attribute.value
  const username = form.username.value
  const email = form.email.value
  const password = form.password.value

  try {
    // http://localhost:4000 -- no es necesario el base url
    const res = await fetch('/signup',{
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({username,email,password})
    })
    const data = await res.json()//obtenemos el json enviado desde el servidor
    console.log(data)
    if(data.objError){
      usernameError.innerText = data.objError.username
      emailError.innerText = data.objError.email;
      passwordError.innerText = data.objError.password;
    }
    if(data.user){
      // you can omit the window object to redirect
      location.assign('/')
    }
  } catch (err) {
    console.log(err)
  }
})