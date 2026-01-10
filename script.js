// SPA
document.querySelectorAll(".nav-links li").forEach(li=>{
  li.onclick=()=>{
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(li.dataset.page).classList.add("active");
  }
});

// Copiar script
function copyScript(){
  navigator.clipboard.writeText(document.getElementById("scriptBox").innerText);
  alert("Script copiado");
}

// Fingerprint (IP simulado)
function fingerprint(){
  return btoa(navigator.userAgent + screen.width + screen.height);
}

// Webhook básico
const WEBHOOK="https://discord.com/api/webhooks/1459229422220611584/hOdCqWKLZnGiEsbIJCJw6jQtjrAxZuGBwydgwTQ_PVwx7Ki9vpzKTIDoSkwwVCMGH3co";

// Enviar contato
document.getElementById("contactForm").onsubmit=e=>{
  e.preventDefault();
  fetch(WEBHOOK,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      embeds:[{
        title:"Novo Contato",
        description:"IP_SIMULADO: "+fingerprint(),
        color:0xffffff
      }]
    })
  });
  alert("Enviado");
};

// Anti Ctrl+U
document.addEventListener("keydown",e=>{
  if(e.ctrlKey && ["u","s","c"].includes(e.key.toLowerCase())){
    e.preventDefault();
    alert("Bloqueado");
  }
});
