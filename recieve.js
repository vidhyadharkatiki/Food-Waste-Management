let logout = document.querySelector("#logout");
let selection = document.querySelector("#selection");
let header = document.querySelector("#head");
let arr = [];

logout.addEventListener("click",()=>{
    window.location.href = 'dashboard.html';
});

function fetchdata(data,latitude,longitude){
    const container = document.querySelector('#contain');
    let val = 1;
    data.forEach((element,index) => {
        console.log(index);
        if(check(element.latitude,element.longitude,latitude,longitude)){
            const div  = document.createElement('div');
            arr[val-1] = index;
            div.className = 'contain';
            div.innerHTML = `
            <div id = "sno">${val}</div>
            <div id = "order">${element.order1}</div>
            <div id = "contact">${element.contact1}</div>
            <div id = "accept">Accept</div>`
            ;
            container.appendChild(div);
            val = val + 1;
            // console.log(index);
        }
    });
    let vals = (val - 1)*60;
    selection.style.bottom = `${vals}px`;
}

    function check(a,b,x,y){


        const toRadians = (degrees) => degrees * (Math.PI / 180);

        const dlon = toRadians(x - a);
        const dlat = toRadians(y - b);

        const dis = Math.sin(dlat / 2) ** 2 +
                Math.cos(toRadians(a)) * Math.cos(toRadians(x)) * Math.sin(dlon / 2) ** 2;
        const c = 2 * Math.asin(Math.sqrt(dis));
        const r = 6371;
        // console.log(r*c)
        if((r*c)<5){
            // console.log(c);  
            return true;
        }else{
            return false;
        }
    }

function topvalue(){
    header.style.display = 'hidden';
    return;
}
window.onload = function async(){
    display();
    setupbutton();  
};

function display(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async(position)=>{
            const { latitude, longitude } = position.coords;
            try{
                const r = await fetch('/donate_html');
                const d = await r.json();
                if(d.success){
                    console.log(d.data);
                    if(d.data.length === 0){
                        // topvalue();
                    }
                    
                    const val = d.data;
                    // console.log(val);
                    console.log(latitude);
                    console.log(longitude);

                    fetchdata(val,latitude,longitude);

                }else{
                    alert("unsuccess");
                }
            }catch(err){
                console.log(err);
            }
        },(error)=>{
            console.error('Error getting location:', error);
            alert('Unable to retrieve your location. Please enable location services.');
        }
    );
    }else{
        alert('Geolocation is not supported by this browser.');
    }
}

function setupbutton(){
    let select = document.querySelector("#contain");
select.addEventListener("click",async(event)=>{
    selection.style.visibility = 'visible';
    let cancel = document.querySelector("#cancel");
    let accepted = document.querySelector("#done");
    if (event.target.id =="accept"){
        const packageDiv = event.target.parentElement;
    const value = packageDiv.querySelector("#sno").textContent;  
    console.log(value);
    cancel.addEventListener("click",()=>{
        selection.style.visibility = 'hidden';
        return;
    });
    accepted.addEventListener("click",async()=>{
        let tag = document.querySelector("#tag");
        tag.style.visibility = 'visible';
    try{
        const r = await fetch('/extract_html');
        const d = await r.json();
        if(d.success){
            const val1 = (d.data)[arr[value - 1]].latitude;
            const val2 = (d.data)[arr[value - 1]].longitude;
            const val3 = (d.data)[arr[value - 1]].order1;
            const val4 = (d.data)[arr[value - 1]].contact1;
            const email = window.localStorage.getItem('email');
            console.log(email);
            // const address = getAddress(val1,val2);

            try{
                const a = await fetch('/send_mail',{
                    method:'POST',
                    headers:{"Content-Type": "application/x-www-form-urlencoded"},
                    body: new URLSearchParams({val1,val2,val3,val4,email})
                });
                const s = await a.json();
                if(s.success){
                    alert("Donor details send to your email");
                    selection.style.visibility = 'hidden';
                    tag.style.visibility = 'hidden';
                    try{
                        const ans = await fetch('/delete_data',{
                            method:'POST',
                            headers:{"Content-Type":"application/x-www-form-urlencoded"},
                            body:new URLSearchParams({val1,val2,val3,val4})
                        });
                        const ans1 = await ans.json();
                        if(ans1.success){
                            alert("data deleted")
                        }
                        else{
                            alert("database error")
                        }
                    }catch(err){
                        alert("url error");
                    }
                    location.reload();
                }
                else{
                    alert("error in sending details to email");
                }
            }catch(error){
                console.log("error",error);
            }
        }else{
            alert("unsuccess");
        }
    }catch(err){
        console.log(err);
    }
  });
 }

});
}