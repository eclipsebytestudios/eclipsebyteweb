// Navegação SPA
document.querySelectorAll(".nav-links li").forEach(li=>{
  li.onclick=()=> {
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(li.dataset.page).classList.add("active");
  }
});

// Copiar script
function copyScript(){
  navigator.clipboard.writeText(document.getElementById("scriptBox").innerText);
  alert("Script copiado!");
}

// Anti Ctrl+U (básico)
document.addEventListener("keydown",e=>{
  if(e.ctrlKey && (e.key==="u"||e.key==="U"||e.key==="s")){
    e.preventDefault();
    alert("Ação bloqueada.");
  }
});
