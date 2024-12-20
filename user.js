let logout = document.querySelector("#logout");
let select = document.querySelector("#selection");
let order = document.querySelector("#orders1");
let contact = document.querySelector("#contact1");
let wrong = document.querySelector("#feed");
let exit = document.querySelector("#cross");
let recive = document.querySelector("#recive");
let cancel = document.querySelector("#cancel");
let done = document.querySelector("#done");



logout.addEventListener("click",()=>{
    window.location.href = 'dashboard.html';
});

let donate = document.querySelector("#donate");

let d = document.querySelector("#donatepage");

donate.addEventListener("click",()=>{
    d.style.zIndex = '1';
    d.style.visibility = 'visible';
        recive.addEventListener("click",()=>{
            makeBackgroundUnresponsive();

    })

});
exit.addEventListener("click",()=>{
    d.style.zIndex = '0';
    d.style.visibility = 'hidden';
});
let b = document.querySelector("#fil")
let submit = document.querySelector("#submit");
submit.addEventListener("click",async()=>{
    if((order.value).length === 0 ||(contact.value)=== 0){
        alert("your didnt provide any information");
    }else if((contact.value).length !== 10){
        alert("contact number must not be wrong");
    }
    else{
        select.style.visibility = 'visible';
        cancel.addEventListener("click",()=>{
            select.style.visibility = 'hidden';
        });
        done.addEventListener("click",async()=>{

    try{
        const r = await fetch('/transfer-data');
        const d = await r.json();
        if(d.success){
            // console.log(d.data);
            const res = d.data;
            const lat = res[0].latitude;
            const lon = res[0].longitude;
            const ord = res[0].order1;
            const con = res[0].contact1;
            try{
                const l = await fetch('/transfer-data-store',{
                    method : "POST",
                    headers:{"Content-Type": "application/x-www-form-urlencoded"},
                    body:new URLSearchParams({lat,lon,con,ord})
                });
                const m = await l.json();
                if(m.success){
                    alert("Thank You for the Donation");
                    select.style.visibility = 'hidden';
                }
            }catch(err){
                alert("error");
                select.style.visibility = 'hidden';
            }
        }
        else{
            alert("some problem");
            select.style.visibility = 'hidden';
        }
    }catch(err){
        alert("Make sure you provide location");       
        select.style.visibility = 'hidden';
    }
  })
}});

recive.addEventListener("click",()=>{
    window.location.href='recieve.html';
});

document.getElementById('cur-location').addEventListener("click",()=>{
    let contact1 = contact.value;
    let order1 = order.value;
    if(!contact1||!order1){
        wrong.innerHTML = 'contact and orders must not empty';
    }else if(contact1.length !== 10){
        wrong.innerHTML = 'contact number must be in length of 10';
    }
    else if(contact1.length !== 0|| order1.length !== 0){
        wrong.innerHTML = '';
        console.log(order1);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async(position) => {
            const { latitude, longitude } = position.coords;
            console.log(latitude);
            console.log(longitude);
            try{
                const r=await fetch("location_html",{
                method : "POST",
                headers:{"Content-Type": "application/x-www-form-urlencoded"},
                body:new URLSearchParams({latitude,longitude,contact1,order1})
            });
                const d = await r.json();
                if(d.success){
                    alert("information recorded");
                }else{
                    alert("error",msg);
                    console.log("error");
                }
            }catch{
                alert("error");
            }
            alert("location accepted");
        }, (error) => {
            console.error('Error getting location:', error);
            alert('Unable to retrieve your location. Please enable location services.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }}
}
);

