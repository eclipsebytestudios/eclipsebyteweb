// Estado da aplicação
let currentUser = null
let notifications = []
let isLoginMode = true

// Webhook Discord (substitua pela sua URL)
const DISCORD_WEBHOOK = "YOUR_DISCORD_WEBHOOK_URL_HERE"

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  loadUserData()
  initNavigation()
  initAuth()
  initModals()
  initContactForm()
  updateUI()
})

// Carregar dados do usuário
function loadUserData() {
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    addNotification("Bem-vindo de volta!", `Olá, ${currentUser.username}!`)
  }

  const savedNotifications = localStorage.getItem("notifications")
  if (savedNotifications) {
    notifications = JSON.parse(savedNotifications)
  }
}

// Salvar dados do usuário
function saveUserData() {
  if (currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
  } else {
    localStorage.removeItem("currentUser")
  }
  localStorage.setItem("notifications", JSON.stringify(notifications))
}

// Navegação entre abas
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link")
  const tabs = document.querySelectorAll(".tab-content")

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const tabId = link.getAttribute("data-tab")

      // Atualizar links ativos
      navLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      // Atualizar tabs ativos
      tabs.forEach((tab) => tab.classList.remove("active"))
      document.getElementById(`${tabId}-tab`).classList.add("active")
    })
  })
}

// Sistema de autenticação
function initAuth() {
  const authBtn = document.getElementById("authBtn")
  const authModal = document.getElementById("authModal")
  const closeAuthModal = document.getElementById("closeAuthModal")
  const authForm = document.getElementById("authForm")
  const authSwitch = document.getElementById("authSwitch")

  authBtn.addEventListener("click", () => {
    if (currentUser) {
      // Se estiver logado, fazer logout
      currentUser = null
      saveUserData()
      updateUI()
      showToast("Logout realizado com sucesso!")
    } else {
      // Se não estiver logado, abrir modal
      authModal.classList.add("active")
    }
  })

  closeAuthModal.addEventListener("click", () => {
    authModal.classList.remove("active")
  })

  authModal.addEventListener("click", (e) => {
    if (e.target === authModal) {
      authModal.classList.remove("active")
    }
  })

  authForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById("authUsername").value
    const password = document.getElementById("authPassword").value

    if (isLoginMode) {
      // Login
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      if (users[username] && users[username] === password) {
        currentUser = {
          username,
          bio: localStorage.getItem(`bio_${username}`) || "",
          createdAt: Date.now(),
        }
        saveUserData()
        authModal.classList.remove("active")
        updateUI()
        showToast(`Bem-vindo, ${username}!`)
        addNotification("Login realizado", "Você entrou na sua conta")
        authForm.reset()
      } else {
        showToast("Usuário ou senha incorretos!")
      }
    } else {
      // Registro
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      if (users[username]) {
        showToast("Usuário já existe!")
      } else {
        users[username] = password
        localStorage.setItem("users", JSON.stringify(users))
        currentUser = {
          username,
          bio: "",
          createdAt: Date.now(),
        }
        saveUserData()
        authModal.classList.remove("active")
        updateUI()
        showToast(`Conta criada! Bem-vindo, ${username}!`)
        addNotification("Conta criada", "Sua conta foi criada com sucesso")
        authForm.reset()
      }
    }
  })

  authSwitch.addEventListener("click", (e) => {
    e.preventDefault()
    isLoginMode = !isLoginMode
    updateAuthModal()
  })
}

function updateAuthModal() {
  const title = document.getElementById("authModalTitle")
  const switchText = document.getElementById("authSwitchText")
  const switchLink = document.getElementById("authSwitch")

  if (isLoginMode) {
    title.textContent = "Entrar"
    switchText.textContent = "Não tem uma conta?"
    switchLink.textContent = "Criar conta"
  } else {
    title.textContent = "Criar Conta"
    switchText.textContent = "Já tem uma conta?"
    switchLink.textContent = "Entrar"
  }
}

// Modais de perfil e notificações
function initModals() {
  // Profile Modal
  const profileBtn = document.getElementById("profileBtn")
  const profileModal = document.getElementById("profileModal")
  const closeProfileModal = document.getElementById("closeProfileModal")
  const saveProfile = document.getElementById("saveProfile")
  const logoutBtn = document.getElementById("logoutBtn")

  profileBtn.addEventListener("click", () => {
    if (currentUser) {
      updateProfileModal()
      profileModal.classList.add("active")
    } else {
      showToast("Faça login para acessar o perfil")
    }
  })

  closeProfileModal.addEventListener("click", () => {
    profileModal.classList.remove("active")
  })

  profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) {
      profileModal.classList.remove("active")
    }
  })

  saveProfile.addEventListener("click", () => {
    if (currentUser) {
      const bio = document.getElementById("profileBio").value
      currentUser.bio = bio
      localStorage.setItem(`bio_${currentUser.username}`, bio)
      saveUserData()
      showToast("Perfil atualizado com sucesso!")
      profileModal.classList.remove("active")
    }
  })

  logoutBtn.addEventListener("click", () => {
    currentUser = null
    saveUserData()
    profileModal.classList.remove("active")
    updateUI()
    showToast("Logout realizado com sucesso!")
  })

  // Notifications Modal
  const notifBtn = document.getElementById("notifBtn")
  const notifModal = document.getElementById("notifModal")
  const closeNotifModal = document.getElementById("closeNotifModal")
  const clearNotif = document.getElementById("clearNotif")

  notifBtn.addEventListener("click", () => {
    updateNotificationsModal()
    notifModal.classList.add("active")
  })

  closeNotifModal.addEventListener("click", () => {
    notifModal.classList.remove("active")
  })

  notifModal.addEventListener("click", (e) => {
    if (e.target === notifModal) {
      notifModal.classList.remove("active")
    }
  })

  clearNotif.addEventListener("click", () => {
    notifications = []
    saveUserData()
    updateNotificationsModal()
    updateNotificationBadge()
    showToast("Notificações limpas!")
  })
}

function updateProfileModal() {
  const username = document.getElementById("profileUsername")
  const badges = document.getElementById("profileBadges")
  const bio = document.getElementById("profileBio")

  username.textContent = currentUser.username
  bio.value = currentUser.bio || ""

  // Limpar badges
  badges.innerHTML = ""

  // Adicionar badges especiais para silva777only
  if (currentUser.username.toLowerCase() === "silva777only") {
    const specialBadges = [
      { text: "👑 Fundador", special: true },
      { text: "⭐ VIP", special: true },
      { text: "🛡️ Admin", special: true },
    ]
    specialBadges.forEach((badge) => {
      const badgeEl = document.createElement("span")
      badgeEl.className = badge.special ? "badge special" : "badge"
      badgeEl.textContent = badge.text
      badges.appendChild(badgeEl)
    })
  } else {
    const defaultBadge = document.createElement("span")
    defaultBadge.className = "badge"
    defaultBadge.textContent = "👤 Membro"
    badges.appendChild(defaultBadge)
  }
}

function updateNotificationsModal() {
  const notifList = document.getElementById("notifList")

  if (notifications.length === 0) {
    notifList.innerHTML = '<p class="empty-state">Nenhuma notificação</p>'
  } else {
    notifList.innerHTML = ""
    notifications.forEach((notif) => {
      const item = document.createElement("div")
      item.className = "notif-item"
      item.innerHTML = `
                <h4>${notif.title}</h4>
                <p>${notif.message}</p>
            `
      notifList.appendChild(item)
    })
  }
}

// Formulário de contato
function initContactForm() {
  const contactForm = document.getElementById("contactForm")

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const message = document.getElementById("message").value

    // Enviar para Discord (se webhook configurado)
    if (DISCORD_WEBHOOK && DISCORD_WEBHOOK !== "YOUR_DISCORD_WEBHOOK_URL_HERE") {
      try {
        await fetch(DISCORD_WEBHOOK, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            embeds: [
              {
                title: "📨 Nova Mensagem de Contato",
                fields: [
                  { name: "Nome", value: name, inline: true },
                  { name: "Email", value: email, inline: true },
                  { name: "Mensagem", value: message },
                ],
                color: 16777215,
                timestamp: new Date().toISOString(),
              },
            ],
          }),
        })
        showToast("Mensagem enviada com sucesso!")
        addNotification("Mensagem enviada", "Entraremos em contato em breve")
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error)
        showToast("Erro ao enviar mensagem. Tente novamente.")
      }
    } else {
      // Simular envio se webhook não configurado
      showToast("Mensagem enviada com sucesso!")
      addNotification("Mensagem enviada", "Entraremos em contato em breve")
    }

    contactForm.reset()
  })
}

// Sistema de notificações
function addNotification(title, message) {
  notifications.unshift({ title, message, timestamp: Date.now() })
  if (notifications.length > 20) {
    notifications = notifications.slice(0, 20)
  }
  saveUserData()
  updateNotificationBadge()
}

function updateNotificationBadge() {
  const badge = document.getElementById("notifBadge")
  badge.textContent = notifications.length
}

// Toast
function showToast(message) {
  const toast = document.getElementById("toast")
  toast.textContent = message
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

// Atualizar UI
function updateUI() {
  const authBtn = document.getElementById("authBtn")

  if (currentUser) {
    authBtn.textContent = "Sair"
  } else {
    authBtn.textContent = "Entrar"
  }

  updateNotificationBadge()
}
