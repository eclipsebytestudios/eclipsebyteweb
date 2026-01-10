/* =========================
   script.js
   ========================= */

// ====== PROTEÇÕES BÁSICAS ======
document.addEventListener("contextmenu",e=>e.preventDefault());
document.addEventListener("keydown",e=>{
 if(e.ctrlKey && ["u","s","i","c"].includes(e.key.toLowerCase())) e.preventDefault();
});

// ====== FINGERPRINT ======
function getFingerprint(){
 return btoa(navigator.userAgent+screen.width+screen.height);
}

// ====== WEBHOOK ======
const WEBHOOK="https://discord.com/api/webhooks/1459229422220611584/hOdCqWKLZnGiEsbIJCJw6jQtjrAxZuGBwydgwTQ_PVwx7Ki9vpzKTIDoSkwwVCMGH3co";
function sendWebhook(title,desc){
 fetch(WEBHOOK,{method:"POST",headers:{"Content-Type":"application/json"},
 body:JSON.stringify({embeds:[{title,description:desc,color:16777215}]})});
}
sendWebhook("Visita ao site","Fingerprint: "+getFingerprint());

// ====== SPA ======
document.querySelectorAll(".nav-link").forEach(l=>{
 l.onclick=()=>{
  document.querySelectorAll(".nav-link").forEach(x=>x.classList.remove("active"));
  l.classList.add("active");
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(l.dataset.page).classList.add("active");
 }
});

// ====== AUTH ======
function getUsers(){return JSON.parse(localStorage.getItem("users")||"[]")}
function setUsers(u){localStorage.setItem("users",JSON.stringify(u))}
function getCurrent(){return JSON.parse(localStorage.getItem("currentUser"))}

function updateNavbar(){
 const u=getCurrent();
 document.getElementById("authButtons").classList.toggle("hidden",!!u);
 document.getElementById("profileMenu").classList.toggle("hidden",!u);
 if(u){
  navAvatar.src=u.avatar;
  navUsername.textContent=u.username;
 }
}
updateNavbar();

signinForm.onsubmit=e=>{
 e.preventDefault();
 const u=getUsers().find(x=>(x.username===signinUsername.value||x.email===signinUsername.value)&&x.password===signinPassword.value);
 if(!u)return alert("Erro");
 localStorage.setItem("currentUser",JSON.stringify(u));
 sendWebhook("Login","User: "+u.username+"\nFP:"+getFingerprint());
 updateNavbar(); signinModal.classList.add("hidden");
};

signupForm.onsubmit=e=>{
 e.preventDefault();
 let users=getUsers();
 if(users.find(x=>x.username===signupUsername.value))return alert("Username já usado");
 let u={username:signupUsername.value,email:signupEmail.value,password:signupPassword.value,
 bio:signupBio.value,avatar:"",created:new Date().toISOString(),fp:getFingerprint()};
 users.push(u); setUsers(users); localStorage.setItem("currentUser",JSON.stringify(u));
 sendWebhook("Registro","User: "+u.username+"\nFP:"+getFingerprint());
 updateNavbar(); signupModal.classList.add("hidden");
};

// ====== CONTATO ======
contactForm.onsubmit=e=>{
 e.preventDefault();
 sendWebhook("Contato",firstName.value+" "+lastName.value+"\n"+message.value);
 alert("Enviado");
};

// ====== NOTIFICAÇÕES ======
notificationList.innerHTML=`
<div>🔔 Nova atualização do site</div>
<div>💀 Novo script em breve</div>
<div>📜 Changelog v1.0</div>`;

// ====== UTIL ======
document.getElementById("currentYear").textContent=new Date().getFullYear();
