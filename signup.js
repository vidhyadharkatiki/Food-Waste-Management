let email = document.querySelector("#email");
let pass = document.querySelector("#pass");
let pass1 = document.querySelector("#pass1");
let wrong = document.querySelector("#feed");
let generate = document.querySelector("#otpg")
let otp = document.querySelector("#otp1");
let verify = document.querySelector("#verify");
let next = document.querySelector("#log");

let btn=document.querySelector("#sign-in");
btn.addEventListener("click",()=>{
    window.location.href = 'loginpage.html';
});

generate.addEventListener("click",async()=>{
    let e = email.value;
    if(e.length === 0){
        alert("email field must not be empty");
        return;
    }
    try{
        const r = await fetch('/ver_html',{
            method:'POST',
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body: new URLSearchParams({e})
        });
        const d = await r.json();
        console.log(d);
        if(d.success){
            alert("email already exists");
            }
            else{
                try{
                    const l = await fetch('/send_otp.html',{
                        method:'POST',
                        headers:{"Content-Type": "application/x-www-form-urlencoded"},
                        body:new URLSearchParams({e})
                    });
                    const m=await l.json();
                    if(m.success){
                        // console.log(m);
                        alert("otp sent");
                    }else{
                        alert("error in otp generation");
                    }
                }
                catch(error){
                    console.log(error);
                        alert("error");
                    }
         }
        }catch(err){
            alert("error");
    }
});

verify.addEventListener("click",async()=>{
    let otp1 = otp.value;
    let e = email.value;
    if(e.length === 0){
        alert("Please provide email and click generate otp above");
        return;
    }
    console.log("data");
    try{
        const r = await fetch('verify_html',{
            method:'POST',
            headers:{"Content-Type":"application/x-www-form-urlencoded"},
            body: new URLSearchParams({e,otp1})
        });
        const d = await r.json();
        if(d.success){
            alert("verification done");
            next.addEventListener("click",async ()=>{
            let e=email.value;
            let p=pass.value;
            let p1=pass1.value;
            if(p1.length===0||p.length===0||e.length === 0){
                wrong.innerHTML="All fields must  be filled";
            }else if(p1 !== p){
                wrong.innerHTML = "password not matched";
            }else if(p1.length<8){
                wrong.innerHTML = "password length must be greater than 8";
            }else{
                try{
                    const r=await fetch("signup_html",{
                    method : "POST",
                    headers:{"Content-Type": "application/x-www-form-urlencoded"},
                    body:new URLSearchParams({e,p1})
                });
                const d=await r.json();
                console.log(d);
                if(d.success){
                    window.location.href='loginpage.html';
                }else{
                    alert("gone wrong "+d.msg);
                }
                }catch(err){
                    alert("error in signup");
                }
        }});  
        }else{
            alert("invalid otp or email");
            
        }
    }
    catch(error){
        console.log(error);
        alert("error");
    }
});



let password = document.querySelector("#eye");

password.addEventListener("click",()=>{
    let p = document.querySelector("#pass");
    let t = p.getAttribute("type")==="password"?"text":"password";
    p.setAttribute("type",t);
    if(t=="password"){
        password.innerHTML='<i style = " position: relative;top : 45px;right:31px; color:rgba(255, 165, 0,1); cursor: pointer; padding-left:2px"class = "fa-solid fa-eye"></i>';
    }
    else{
        password.innerHTML='<i style = " position: relative; top:45px;right:30px; color:rgba(255, 165, 0,1); cursor: pointer;"  class = "fa-solid fa-eye-slash"></i>';
    }
});

let password1 = document.querySelector("#eye1");