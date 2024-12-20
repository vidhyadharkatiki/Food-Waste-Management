const email = document.querySelector("#email");
const key = document.querySelector("#pass");
const submit = document.querySelector("#log");
const wrong = document.querySelector("#incorrect");

let btn=document.querySelector("#forget");
btn.addEventListener("click",()=>{
    window.location.href = '#';
}); 
let btn1=document.querySelector("#sign-up")
btn1.addEventListener("click",()=>{
    window.location.href = 'signup.html';
}); 

let password = document.querySelector("#eye");

password.addEventListener("click",()=>{
    let p = document.querySelector("#pass");
    let t = p.getAttribute("type")==="password"?"text":"password";
    p.setAttribute("type",t);
    if(t=="password"){
        password.innerHTML='<i style = " position: relative; bottom:2px;right:30px; color:rgba(255, 165, 0,1); cursor: pointer; padding-left:2px"class = "fa-solid fa-eye"></i>';
    }
    else{
        password.innerHTML='<i style = " position: relative; bottom:2px;right:30px; color:rgba(255, 165, 0,1); cursor: pointer;"  class = "fa-solid fa-eye-slash"></i>';
    }
});


submit.addEventListener("click",async()=>{
    let e = email.value;
    let pass = key.value;
    try{
        const r=await fetch("/loginform.html",{
        method : "POST",
        headers:{"Content-Type": "application/x-www-form-urlencoded"},
        body:new URLSearchParams({e,pass})
    });
        const d = await r.json();
        // console.log(d);
        if(d.success){
            console.log("done");
            window.localStorage.setItem('email', e);
            // alert("Login successful");
            window.location.href = 'user.html'; 
        }else{
            alert(d.msg);
            console.log("error",d.msg);
        }
    }catch(error){
        console.log("error in listener");
    }
})