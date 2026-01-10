function $(id){return document.getElementById(id)}

document.addEventListener("DOMContentLoaded", () => {

  // GARANTE HOME ATIVA
  const pages = document.querySelectorAll(".page")
  if (![...pages].some(p=>p.classList.contains("active"))) {
    $("home").classList.add("active")
  }

  // NAVEGAÇÃO
  document.querySelectorAll(".nav-link").forEach(link=>{
    link.addEventListener("click", e=>{
      e.preventDefault()
      const target = link.dataset.page
      pages.forEach(p=>p.classList.remove("active"))
      $(target)?.classList.add("active")
    })
  })

  // MOBILE
  $("mobileMenuBtn")?.addEventListener("click",()=>{
    $("navbarMenu")?.classList.toggle("active")
  })

  // COPY
  document.querySelectorAll(".copy-btn").forEach(btn=>{
    btn.onclick=()=>{
      navigator.clipboard.writeText(btn.dataset.script)
      alert("Copiado!")
    }
  })

  // ANTI CTRL+U
  document.addEventListener("keydown",e=>{
    if(e.ctrlKey && ["u","s","i"].includes(e.key.toLowerCase())){
      e.preventDefault()
      alert("Acesso bloqueado.")
    }
  })

  $("currentYear").textContent=new Date().getFullYear()
})
