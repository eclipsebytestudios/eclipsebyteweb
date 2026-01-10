let currentUser = null
let notifications = []
let isSignUp = false
const reservedUsernames = new Set()
const DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/1459229422220611584/hOdCqWKLZnGiEsbIJCJw6jQtjrAxZuGBwydgwTQ_PVwx7Ki9vpzKTIDoSkwwVCMGH3co"

document.addEventListener("DOMContentLoaded", () => {
  loadUserData()
  initNavigation()
  initAuth()
  initSettings()
  initNotifications()
  initContact()
  initCopyScript()
  updateUI()
})

function loadUserData() {
  const saved = localStorage.getItem("currentUser")
  if (saved) {
    currentUser = JSON.parse(saved)
    addNotification("Bem-vindo de volta!", `Olá, ${currentUser.username}!`)
  }
  const savedNotifs = localStorage.getItem("notifications")
  if (savedNotifs) {
    notifications = JSON.parse(savedNotifs)
  }
  const savedReserved = localStorage.getItem("reservedUsernames")
  if (savedReserved) {
    JSON.parse(savedReserved).forEach((name) => reservedUsernames.add(name))
  }
}

function saveUserData() {
  if (currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser))
  } else {
    localStorage.removeItem("currentUser")
  }
  localStorage.setItem("notifications", JSON.stringify(notifications))
  localStorage.setItem("reservedUsernames", JSON.stringify([...reservedUsernames]))
}

function initNavigation() {
  const links = document.querySelectorAll(".nav-link")
  const tabs = document.querySelectorAll(".tab-content")

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const tab = link.getAttribute("data-tab")

      links.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      tabs.forEach((t) => t.classList.remove("active"))
      document.getElementById(tab).classList.add("active")
    })
  })
}

function initAuth() {
  const authBtn = document.getElementById("authBtn")
  const authModal = document.getElementById("authModal")
  const closeAuthModal = document.getElementById("closeAuthModal")
  const authForm = document.getElementById("authForm")
  const switchMode = document.getElementById("switchMode")
  const overlay = authModal.querySelector(".modal-overlay")

  authBtn.addEventListener("click", () => {
    if (currentUser) {
      showSettings()
    } else {
      authModal.classList.add("active")
    }
  })

  closeAuthModal.addEventListener("click", () => authModal.classList.remove("active"))
  overlay.addEventListener("click", () => authModal.classList.remove("active"))

  switchMode.addEventListener("click", (e) => {
    e.preventDefault()
    isSignUp = !isSignUp
    document.getElementById("authTitle").textContent = isSignUp ? "Sign Up" : "Sign In"
    document.getElementById("switchText").textContent = isSignUp ? "Já tem uma conta?" : "Não tem uma conta?"
    switchMode.textContent = isSignUp ? "Fazer login" : "Criar conta"
  })

  authForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const username = document.getElementById("authUsername").value.trim()
    const email = document.getElementById("authEmail").value.trim()
    const password = document.getElementById("authPassword").value

    if (isSignUp) {
      if (localStorage.getItem(`user_${username}`)) {
        showToast("Nome de usuário já existe!")
        return
      }

      const normalizedUsername = username.toLowerCase()
      if (normalizedUsername !== "silva777only" && reservedUsernames.has(normalizedUsername)) {
        showToast("Este nome de usuário está reservado!")
        return
      }

      reservedUsernames.add(normalizedUsername)

      currentUser = {
        username,
        email,
        password,
        bio: "",
        profilePic: "",
        banner: "",
        createdAt: Date.now(),
      }

      localStorage.setItem(`user_${username}`, JSON.stringify(currentUser))
      saveUserData()
      authModal.classList.remove("active")
      authForm.reset()
      showToast(`Conta criada! Bem-vindo, ${username}!`)
      addNotification("Conta criada", "Sua conta foi criada com sucesso!")
      updateUI()
    } else {
      const savedUser = localStorage.getItem(`user_${username}`)
      if (savedUser) {
        const user = JSON.parse(savedUser)
        if (user.password === password) {
          currentUser = user
          saveUserData()
          authModal.classList.remove("active")
          authForm.reset()
          showToast(`Bem-vindo de volta, ${username}!`)
          addNotification("Login realizado", "Você entrou na sua conta")
          updateUI()
        } else {
          showToast("Senha incorreta!")
        }
      } else {
        showToast("Usuário não encontrado!")
      }
    }
  })
}

function initSettings() {
  const settingsBtn = document.getElementById("settingsBtn")
  const settingsModal = document.getElementById("settingsModal")
  const closeSettings = document.getElementById("closeSettingsModal")
  const saveSettings = document.getElementById("saveSettings")
  const logoutBtn = document.getElementById("logoutBtn")
  const profilePicInput = document.getElementById("profilePicInput")
  const bannerInput = document.getElementById("bannerInput")
  const overlay = settingsModal.querySelector(".modal-overlay")

  settingsBtn.addEventListener("click", showSettings)
  closeSettings.addEventListener("click", () => settingsModal.classList.remove("active"))
  overlay.addEventListener("click", () => settingsModal.classList.remove("active"))

  profilePicInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        document.getElementById("profilePicture").style.backgroundImage = `url(${event.target.result})`
      }
      reader.readAsDataURL(file)
    }
  })

  bannerInput.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        document.getElementById("profileBanner").style.backgroundImage = `url(${event.target.result})`
      }
      reader.readAsDataURL(file)
    }
  })

  saveSettings.addEventListener("click", () => {
    if (currentUser) {
      currentUser.bio = document.getElementById("bioInput").value

      const profilePic = document.getElementById("profilePicture").style.backgroundImage
      if (profilePic && profilePic !== "none") {
        currentUser.profilePic = profilePic
      }

      const banner = document.getElementById("profileBanner").style.backgroundImage
      if (banner && banner !== "none") {
        currentUser.banner = banner
      }

      localStorage.setItem(`user_${currentUser.username}`, JSON.stringify(currentUser))
      saveUserData()
      showToast("Configurações salvas!")
      addNotification("Perfil atualizado", "Suas alterações foram salvas")
    }
  })

  logoutBtn.addEventListener("click", () => {
    currentUser = null
    saveUserData()
    settingsModal.classList.remove("active")
    updateUI()
    showToast("Logout realizado!")
  })
}

function showSettings() {
  if (!currentUser) {
    showToast("Faça login para acessar as configurações")
    return
  }

  const settingsModal = document.getElementById("settingsModal")
  document.getElementById("usernameDisplay").textContent = currentUser.username
  document.getElementById("bioInput").value = currentUser.bio || ""

  if (currentUser.profilePic) {
    document.getElementById("profilePicture").style.backgroundImage = currentUser.profilePic
  }

  if (currentUser.banner) {
    document.getElementById("profileBanner").style.backgroundImage = currentUser.banner
  }

  const badgesDisplay = document.getElementById("badgesDisplay")
  badgesDisplay.innerHTML = ""

  if (currentUser.username.toLowerCase() === "silva777only") {
    badgesDisplay.innerHTML = `
            <span class="badge special">👑 Owner</span>
            <span class="badge special">💎 Desenvolvedor</span>
            <span class="badge special">⭐ Assinante VIP</span>
        `
  } else {
    badgesDisplay.innerHTML = '<span class="badge">👤 Membro</span>'
  }

  settingsModal.classList.add("active")
}

function initNotifications() {
  const notifBtn = document.getElementById("notifBtn")
  const notifModal = document.getElementById("notifModal")
  const closeNotif = document.getElementById("closeNotifModal")
  const clearNotif = document.getElementById("clearNotif")
  const overlay = notifModal.querySelector(".modal-overlay")

  notifBtn.addEventListener("click", () => {
    updateNotifList()
    notifModal.classList.add("active")
  })

  closeNotif.addEventListener("click", () => notifModal.classList.remove("active"))
  overlay.addEventListener("click", () => notifModal.classList.remove("active"))

  clearNotif.addEventListener("click", () => {
    notifications = []
    saveUserData()
    updateNotifList()
    updateNotifBadge()
    showToast("Notificações limpas!")
  })

  addNotification("Nova atualização do site", "Confira as novidades!")
  addNotification("Novo script em breve", "Fique atento às atualizações")
  addNotification("Bem-vindo ao EclipseByte Web", "Explore todas as funcionalidades")
}

function updateNotifList() {
  const list = document.getElementById("notifList")

  if (notifications.length === 0) {
    list.innerHTML = '<p class="empty-notif">Nenhuma notificação</p>'
  } else {
    list.innerHTML = notifications
      .map(
        (notif) => `
            <div class="notif-item">
                <h4>${notif.title}</h4>
                <p>${notif.message}</p>
            </div>
        `,
      )
      .join("")
  }
}

function addNotification(title, message) {
  notifications.unshift({ title, message, time: Date.now() })
  if (notifications.length > 50) {
    notifications = notifications.slice(0, 50)
  }
  saveUserData()
  updateNotifBadge()
}

function updateNotifBadge() {
  document.getElementById("notifBadge").textContent = notifications.length
}

function initContact() {
  const form = document.getElementById("contactForm")

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const data = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      sector: document.getElementById("sector").value,
      reason: document.getElementById("reason").value,
      contactMethod: document.getElementById("contactMethod").value,
      contactInfo: document.getElementById("contactInfo").value,
      message: document.getElementById("message").value,
    }

    try {
      await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          embeds: [
            {
              title: "📩 Nova Mensagem de Contato",
              color: 16777215,
              fields: [
                { name: "Nome", value: `${data.firstName} ${data.lastName}`, inline: true },
                { name: "Email", value: data.email, inline: true },
                { name: "Assunto", value: data.subject },
                { name: "Setor", value: data.sector, inline: true },
                { name: "Motivo", value: data.reason, inline: true },
                { name: "Meio de Contato", value: `${data.contactMethod}: ${data.contactInfo}` },
                { name: "Mensagem", value: data.message },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      })

      showToast("Mensagem enviada com sucesso!")
      addNotification("Mensagem enviada", "Entraremos em contato em breve")
      form.reset()
    } catch (error) {
      showToast("Erro ao enviar mensagem. Tente novamente.")
      console.error("Erro:", error)
    }
  })
}

function initCopyScript() {
  const copyBtn = document.getElementById("copyScriptBtn")
  const scriptCode = document.getElementById("scriptCode")

  copyBtn.addEventListener("click", () => {
    const text = scriptCode.textContent
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("Script copiado!")
        copyBtn.textContent = "Copiado!"
        setTimeout(() => {
          copyBtn.textContent = "Copiar Script"
        }, 2000)
      })
      .catch(() => {
        showToast("Erro ao copiar script")
      })
  })
}

function showToast(message) {
  const toast = document.getElementById("toast")
  toast.textContent = message
  toast.classList.add("show")
  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

function updateUI() {
  const authBtn = document.getElementById("authBtn")
  if (currentUser) {
    authBtn.textContent = currentUser.username
  } else {
    authBtn.textContent = "Sign In / Sign Up"
  }
  updateNotifBadge()
}
