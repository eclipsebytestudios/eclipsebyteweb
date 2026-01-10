// ═══════════════════════════════════════════════════════════════
// NAVEGAÇÃO ENTRE ABAS
// ═══════════════════════════════════════════════════════════════
const navLinks = document.querySelectorAll(".nav-link")
const tabContents = document.querySelectorAll(".tab-content")

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const targetTab = link.getAttribute("data-tab")

    // Remove active class de todos os links e abas
    navLinks.forEach((l) => l.classList.remove("active"))
    tabContents.forEach((tab) => tab.classList.remove("active"))

    // Adiciona active class ao link e aba clicados
    link.classList.add("active")
    document.getElementById(targetTab).classList.add("active")

    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: "smooth" })
  })
})

// ═══════════════════════════════════════════════════════════════
// COPIAR SCRIPT
// ═══════════════════════════════════════════════════════════════
function copyScript(scriptId) {
  const scriptElement = document.getElementById(scriptId)
  const scriptText = scriptElement.textContent

  navigator.clipboard
    .writeText(scriptText)
    .then(() => {
      const btn = event.target
      const originalText = btn.textContent
      btn.textContent = "Copiado!"
      btn.style.backgroundColor = "#00ff00"

      setTimeout(() => {
        btn.textContent = originalText
        btn.style.backgroundColor = ""
      }, 2000)
    })
    .catch((err) => {
      alert("Erro ao copiar: " + err)
    })
}

// ═══════════════════════════════════════════════════════════════
// SISTEMA DE AUTENTICAÇÃO (LOCALSTORAGE)
// ═══════════════════════════════════════════════════════════════
const authBtn = document.getElementById("authBtn")
const authModal = document.getElementById("authModal")
const closeAuth = document.getElementById("closeAuth")
const signInForm = document.getElementById("signInForm")
const signUpForm = document.getElementById("signUpForm")
const switchToSignUp = document.getElementById("switchToSignUp")
const switchToSignIn = document.getElementById("switchToSignIn")
const profileModal = document.getElementById("profileModal")
const closeProfile = document.getElementById("closeProfile")
const logoutBtn = document.getElementById("logoutBtn")

// Verificar se usuário está logado ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus()
  loadNotifications()
})

function checkAuthStatus() {
  const currentUser = localStorage.getItem("currentUser")
  if (currentUser) {
    const user = JSON.parse(currentUser)
    authBtn.textContent = user.username
    authBtn.onclick = () => showProfile(user)
  }
}

// Abrir modal de auth
authBtn.addEventListener("click", () => {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) {
    authModal.classList.add("active")
  }
})

// Fechar modal de auth
closeAuth.addEventListener("click", () => {
  authModal.classList.remove("active")
})

// Alternar entre Sign In e Sign Up
switchToSignUp.addEventListener("click", (e) => {
  e.preventDefault()
  signInForm.classList.add("hidden")
  signUpForm.classList.remove("hidden")
  document.getElementById("authModalTitle").textContent = "Criar Conta"
})

switchToSignIn.addEventListener("click", (e) => {
  e.preventDefault()
  signUpForm.classList.add("hidden")
  signInForm.classList.remove("hidden")
  document.getElementById("authModalTitle").textContent = "Entrar"
})

// Sign In
signInForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const username = document.getElementById("signInUsername").value
  const password = document.getElementById("signInPassword").value

  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const user = users.find((u) => (u.username === username || u.email === username) && u.password === password)

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
    authModal.classList.remove("active")
    authBtn.textContent = user.username
    authBtn.onclick = () => showProfile(user)
    signInForm.reset()
  } else {
    alert("Credenciais inválidas!")
  }
})

// Sign Up
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const username = document.getElementById("signUpUsername").value
  const email = document.getElementById("signUpEmail").value
  const password = document.getElementById("signUpPassword").value
  const confirmPassword = document.getElementById("signUpConfirmPassword").value
  const bio = document.getElementById("signUpBio").value
  const profilePicInput = document.getElementById("signUpProfilePic")

  if (password !== confirmPassword) {
    alert("As senhas não correspondem!")
    return
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]")

  if (users.find((u) => u.username === username)) {
    alert("Username já existe!")
    return
  }

  if (users.find((u) => u.email === email)) {
    alert("Email já cadastrado!")
    return
  }

  // Processar foto de perfil
  if (profilePicInput.files[0]) {
    const reader = new FileReader()
    reader.onload = (event) => {
      const newUser = {
        username,
        email,
        password,
        bio,
        profilePic: event.target.result,
        banner: null,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      authModal.classList.remove("active")
      authBtn.textContent = username
      authBtn.onclick = () => showProfile(newUser)
      signUpForm.reset()
    }
    reader.readAsDataURL(profilePicInput.files[0])
  } else {
    const newUser = {
      username,
      email,
      password,
      bio,
      profilePic: null,
      banner: null,
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify(newUser))

    authModal.classList.remove("active")
    authBtn.textContent = username
    authBtn.onclick = () => showProfile(newUser)
    signUpForm.reset()
  }
})

// Mostrar perfil
function showProfile(user) {
  document.getElementById("profileUsername").textContent = user.username
  document.getElementById("profileBio").textContent = user.bio || "Sem bio definida"

  const avatar = document.getElementById("profileAvatar")
  if (user.profilePic) {
    avatar.src = user.profilePic
  } else {
    avatar.src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120"%3E%3Crect fill="%23333" width="120" height="120"/%3E%3Ctext fill="%23fff" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-size="48"%3E' +
      user.username.charAt(0).toUpperCase() +
      "%3C/text%3E%3C/svg%3E"
  }

  const banner = document.getElementById("profileBanner")
  if (user.banner) {
    banner.style.backgroundImage = `url(${user.banner})`
    banner.style.backgroundSize = "cover"
    banner.style.backgroundPosition = "center"
  }

  // Badges
  const badgesContainer = document.getElementById("profileBadges")
  badgesContainer.innerHTML = ""

  // Badges especiais para silva777only
  if (user.username === "silva777only") {
    badgesContainer.innerHTML += '<span class="badge developer">👨‍💻 Desenvolvedor</span>'
    badgesContainer.innerHTML += '<span class="badge owner">👑 Owner</span>'
  }

  profileModal.classList.add("active")
}

// Fechar perfil
closeProfile.addEventListener("click", () => {
  profileModal.classList.remove("active")
})

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser")
  authBtn.textContent = "Sign In / Sign Up"
  authBtn.onclick = () => authModal.classList.add("active")
  profileModal.classList.remove("active")
})

// ═══════════════════════════════════════════════════════════════
// CONFIGURAÇÕES
// ═══════════════════════════════════════════════════════════════
const settingsBtn = document.getElementById("settingsBtn")
const settingsModal = document.getElementById("settingsModal")
const closeSettings = document.getElementById("closeSettings")
const saveSettingsBtn = document.getElementById("saveSettingsBtn")
const profilePicInput = document.getElementById("profilePicInput")
const bannerInput = document.getElementById("bannerInput")
const bioInput = document.getElementById("bioInput")

settingsBtn.addEventListener("click", () => {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) {
    alert("Você precisa estar logado para acessar as configurações!")
    return
  }

  const user = JSON.parse(currentUser)
  bioInput.value = user.bio || ""
  settingsModal.classList.add("active")
})

closeSettings.addEventListener("click", () => {
  settingsModal.classList.remove("active")
})

saveSettingsBtn.addEventListener("click", () => {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) return

  const user = JSON.parse(currentUser)
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const userIndex = users.findIndex((u) => u.username === user.username)

  // Atualizar bio
  user.bio = bioInput.value

  // Processar nova foto de perfil
  if (profilePicInput.files[0]) {
    const reader = new FileReader()
    reader.onload = (event) => {
      user.profilePic = event.target.result
      updateUserData(user, users, userIndex)
    }
    reader.readAsDataURL(profilePicInput.files[0])
  }

  // Processar novo banner
  if (bannerInput.files[0]) {
    const reader = new FileReader()
    reader.onload = (event) => {
      user.banner = event.target.result
      updateUserData(user, users, userIndex)
    }
    reader.readAsDataURL(bannerInput.files[0])
  }

  // Se não houver arquivos novos, apenas atualizar
  if (!profilePicInput.files[0] && !bannerInput.files[0]) {
    updateUserData(user, users, userIndex)
  }
})

function updateUserData(user, users, userIndex) {
  users[userIndex] = user
  localStorage.setItem("users", JSON.stringify(users))
  localStorage.setItem("currentUser", JSON.stringify(user))
  settingsModal.classList.remove("active")
  alert("Configurações salvas com sucesso!")
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICAÇÕES
// ═══════════════════════════════════════════════════════════════
const notificationsBtn = document.getElementById("notificationsBtn")
const notificationsPanel = document.getElementById("notificationsPanel")
const closeNotifications = document.getElementById("closeNotifications")
const notificationsList = document.getElementById("notificationsList")

notificationsBtn.addEventListener("click", () => {
  notificationsPanel.classList.toggle("active")
})

closeNotifications.addEventListener("click", () => {
  notificationsPanel.classList.remove("active")
})

function loadNotifications() {
  const notifications = [
    {
      title: "Bem-vindo ao EclipseByte!",
      message: "Obrigado por visitar nosso site. Explore nossos projetos!",
      time: "Agora",
    },
    {
      title: "Novo script disponível",
      message: "Confira o novo script para Flick na aba EclipseXPloits.",
      time: "Há 2 horas",
    },
    {
      title: "Atualização do site",
      message: "Implementamos melhorias no sistema de notificações.",
      time: "Há 1 dia",
    },
  ]

  notificationsList.innerHTML = ""
  notifications.forEach((notif) => {
    const notifElement = document.createElement("div")
    notifElement.className = "notification-item"
    notifElement.innerHTML = `
            <h4>${notif.title}</h4>
            <p>${notif.message}</p>
            <small>${notif.time}</small>
        `
    notificationsList.appendChild(notifElement)
  })
}

// ═══════════════════════════════════════════════════════════════
// FORMULÁRIO DE CONTATO
// ═══════════════════════════════════════════════════════════════
const contactForm = document.getElementById("contactForm")
const formMessage = document.getElementById("formMessage")

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault()

  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value
  const email = document.getElementById("email").value
  const subject = document.getElementById("subject").value
  const sector = document.getElementById("sector").value
  const reason = document.getElementById("reason").value
  const contactMethod = document.getElementById("contactMethod").value
  const contactInfo = document.getElementById("contactInfo").value
  const message = document.getElementById("message").value

  const webhookURL =
    "https://discord.com/api/webhooks/1459229422220611584/hOdCqWKLZnGiEsbIJCJw6jQtjrAxZuGBwydgwTQ_PVwx7Ki9vpzKTIDoSkwwVCMGH3co"

  const embed = {
    embeds: [
      {
        title: "📩 Novo Contato Recebido",
        color: 0xffffff,
        fields: [
          { name: "👤 Nome Completo", value: `${firstName} ${lastName}`, inline: false },
          { name: "📧 Email", value: email, inline: false },
          { name: "📝 Assunto", value: subject, inline: false },
          { name: "🏢 Setor", value: sector, inline: true },
          { name: "📋 Motivo", value: reason, inline: true },
          { name: "📞 Meio de Contato", value: `${contactMethod}: ${contactInfo}`, inline: false },
          { name: "💬 Mensagem", value: message, inline: false },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: "EclipseByte Studios - Sistema de Contato" },
      },
    ],
  }

  try {
    const response = await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    })

    if (response.ok) {
      formMessage.textContent = "✓ Mensagem enviada com sucesso! Entraremos em contato em breve."
      formMessage.className = "form-message success"
      contactForm.reset()

      setTimeout(() => {
        formMessage.style.display = "none"
      }, 5000)
    } else {
      throw new Error("Erro no envio")
    }
  } catch (error) {
    formMessage.textContent = "✗ Erro ao enviar mensagem. Tente novamente mais tarde."
    formMessage.className = "form-message error"

    setTimeout(() => {
      formMessage.style.display = "none"
    }, 5000)
  }
})

// ═══════════════════════════════════════════════════════════════
// FECHAR MODAIS AO CLICAR FORA
// ═══════════════════════════════════════════════════════════════
window.addEventListener("click", (e) => {
  if (e.target === authModal) {
    authModal.classList.remove("active")
  }
  if (e.target === profileModal) {
    profileModal.classList.remove("active")
  }
  if (e.target === settingsModal) {
    settingsModal.classList.remove("active")
  }
})

// ═══════════════════════════════════════════════════════════════
// FECHAR PAINEL DE NOTIFICAÇÕES AO CLICAR FORA
// ═══════════════════════════════════════════════════════════════
document.addEventListener("click", (e) => {
  if (
    !notificationsPanel.contains(e.target) &&
    !notificationsBtn.contains(e.target) &&
    notificationsPanel.classList.contains("active")
  ) {
    notificationsPanel.classList.remove("active")
  }
})
