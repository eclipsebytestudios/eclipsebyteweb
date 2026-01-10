// script.js

// Tabs
document.querySelectorAll('.nav-links li').forEach(li=>{
  li.onclick=()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.getElementById(li.dataset.tab).classList.add('active');
  };
});

// Panels
const notifBtn=document.getElementById('notifBtn');
const configBtn=document.getElementById('configBtn');
const notifications=document.getElementById('notifications');
const settings=document.getElementById('settings');

notifBtn.onclick=()=>notifications.classList.toggle('open');
configBtn.onclick=()=>settings.classList.toggle('open');

// Mock notifications
const notifList=document.getElementById('notifList');
[
  "Nova atualização do site",
  "Novo script em breve",
  "Bem-vindo ao Grupo EclipseByte",
  "Changelog: melhorias visuais",
  "Changelog: sistema de contas"
].forEach(n=>{
  const li=document.createElement('li');
  li.textContent=n;
  notifList.appendChild(li);
});

// Copy script
function copyScript(){
  navigator.clipboard.writeText(document.getElementById('scriptBox').innerText);
  alert("Script copiado!");
}

// Contact form webhook
document.getElementById('contactForm').onsubmit=async(e)=>{
  e.preventDefault();
  const data=[...e.target.elements].map(i=>i.value).join(" | ");
  const res=await fetch("https://discord.com/api/webhooks/1459229422220611584/hOdCqWKLZnGiEsbIJCJw6jQtjrAxZuGBwydgwTQ_PVwx7Ki9vpzKTIDoSkwwVCMGH3co",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      embeds:[{
        title:"Novo Contato",
        description:data,
        color:16777215
      }]
    })
  });
  document.getElementById('formStatus').textContent=res.ok?"Enviado com sucesso!":"Erro ao enviar.";
};

// LocalStorage user system (simplificado)
let user=JSON.parse(localStorage.getItem("user"));
const authBtn=document.getElementById('authBtn');
if(user){
  authBtn.textContent=user.username;
}

// Save settings
function saveSettings(){
  if(!user) return alert("Faça login.");
  user.bio=document.getElementById('bioEdit').value;
  localStorage.setItem("user",JSON.stringify(user));
  alert("Salvo!");
}

// Log visit to webhook with IP
fetch("https://ipapi.co/json/")
.then(r=>r.json())
.then(ip=>{
  fetch("https://discord.com/api/webhooks/1459229422220611584/hOdCqWKLZnGiEsbIJCJw6jQtjrAxZuGBwydgwTQ_PVwx7Ki9vpzKTIDoSkwwVCMGH3co",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      content:`Visita ao site | IP: ${ip.ip} | ${ip.city}, ${ip.country_name}`
    })
  });
});
