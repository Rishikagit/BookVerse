function login()
{
    let email=document.getElementById('email').value;
    let password=document.getElementById('password').value;
    let error=document.getElementById('error');

    if(email==="admin@1234" && password==="1234")//input takes string input by default
    {
        localStorage.setItem("isLoggedIn","true"); //why??
        localStorage.setItem("user",email);

        window.location.href= "home.html";
    }
    else{
        error.innerHTML="Invalid email or password";
    }
}

function togglePassword() 
{
    let passwordInput = document.getElementById("password");
    
    if (passwordInput.type === "password") 
    {
        passwordInput.type = "text";
    }
    else
    {
        passwordInput.type = "password";
    }
}

function toggleMenu()
{
   let navMenu = document.getElementById("navMenu");
   let menuIcon = document.getElementById("menuIcon");
   navMenu.classList.toggle("show");
   if(navMenu.classList.contains("show"))
   {
       menuIcon.classList.remove("fa-bars");
       menuIcon.classList.add("fa-xmark");
   }
   else
   {
       menuIcon.classList.remove("fa-xmark");
       menuIcon.classList.add("fa-bars");
   }
}