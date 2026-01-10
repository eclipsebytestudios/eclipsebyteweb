/* ===========================================
   ECLIPSEBYTE STUDIOS - JAVASCRIPT
   Sistema completo de navegação, autenticação
   e funcionalidades do site
   =========================================== */

// ==================== CONSTANTES ====================
const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1459229422220611584/hOdCqWKLZnGiEsbIJCJw6jQtjrAxZuGBwydgwTQ_PVwx7Ki9vpzKTIDoSkwwVCMGH3co"
const ADMIN_USERNAME = "silva777only"

// ==================== ANTI-DEVTOOLS ====================
;(() => {
  // Bloqueia Ctrl+U (View Source)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "u") {
      e.preventDefault()
      showToast("Ação bloqueada", "error")
      return false
    }
    // Bloqueia Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === "I") {
      e.preventDefault()
      showToast("Ação bloqueada", "error")
      return false
    }
    // Bloqueia Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === "J") {
      e.preventDefault()
      showToast("Ação bloqueada", "error")
      return false
    }
    // Bloqueia Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === "C") {
      e.preventDefault()
      showToast("Ação bloqueada", "error")
      return false
    }
    // Bloqueia F12
    if (e.key === "F12") {
      e.preventDefault()
      showToast("Ação bloqueada", "error")
      return false
    }
  })

  // Bloqueia clique direito
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    showToast("Clique direito desabilitado", "error")
    return false
  })
})()

// ==================== INICIALIZAÇÃO ====================
document.addEventListener("DOMContentLoaded", async () => {
  initNavigation()
  initScrollEffects()
  initModals()
  initPanels()
  initAuth()
  initContactForm()
  initNotifications()
  initSettingsTabs()
  initAdminPanel()
  initUsernameCheck()
  updateYear()

  await trackVisit()
  checkBannedIP()
})

// ==================== IP & TRACKING ====================
let userIP = null
let userLocation = null

async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    userIP = data.ip
    return userIP
  } catch (error) {
    userIP = "Unknown"
    return userIP
  }
}

async function getUserLocation() {
  try {
    if (!userIP || userIP === "Unknown") await getUserIP()
    const response = await fetch(`https://ipapi.co/${userIP}/json/`)
    const data = await response.json()
    userLocation = `${data.city || "Unknown"}, ${data.region || ""}, ${data.country_name || "Unknown"}`
    return userLocation
  } catch (error) {
    userLocation = "Unknown"
    return userLocation
  }
}

async function trackVisit() {
  await getUserIP()
  await getUserLocation()

  // Armazena IP para recuperação de senha
  localStorage.setItem("eclipsebyte_visitor_ip", userIP)

  // Envia webhook de visita
  const embed = {
    embeds: [
      {
        title: "👁️ Nova Visita ao Site",
        color: 3447003,
        fields: [
          { name: "🌐 IP", value: userIP || "Unknown", inline: true },
          { name: "📍 Localização", value: userLocation || "Unknown", inline: true },
          { name: "🕐 Data/Hora", value: new Date().toLocaleString("pt-BR"), inline: false },
        ],
        footer: { text: "EclipseByte Studios - Sistema de Tracking" },
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    })
  } catch (error) {
    console.log("Webhook error")
  }
}

// ==================== VERIFICAÇÃO DE BAN ====================
function checkBannedIP() {
  // Se não conseguiu obter o IP, não bloqueia
  if (!userIP || userIP === "Unknown" || userIP === null) {
    return
  }

  const bannedIPs = JSON.parse(localStorage.getItem("eclipsebyte_banned_ips") || "[]")

  // Verifica se é um array válido e se o IP está na lista
  if (!Array.isArray(bannedIPs) || bannedIPs.length === 0) {
    return
  }

  if (bannedIPs.includes(userIP)) {
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #000; color: #fff; text-align: center; padding: 20px;">
        <div>
          <h1 style="font-size: 2rem; margin-bottom: 1rem;">Acesso Bloqueado</h1>
          <p style="color: #888;">Seu IP foi banido do EclipseByte Studios.</p>
        </div>
      </div>
    `
  }
}

// ==================== NAVEGAÇÃO ====================
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link")
  const pages = document.querySelectorAll(".page")
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navbarMenu = document.getElementById("navbarMenu")

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetPage = link.getAttribute("data-page")

      navLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      pages.forEach((page) => {
        page.classList.remove("active")
        if (page.id === targetPage) {
          page.classList.add("active")
          restartAnimations(page)
        }
      })

      navbarMenu.classList.remove("active")
      mobileMenuBtn.classList.remove("active")
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  })

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenuBtn.classList.toggle("active")
    navbarMenu.classList.toggle("active")
  })

  const profileBtn = document.getElementById("profileBtn")
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      showProfilePage()
    })
  }
}

function showProfilePage() {
  const pages = document.querySelectorAll(".page")
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((l) => l.classList.remove("active"))
  pages.forEach((page) => page.classList.remove("active"))

  document.getElementById("profile").classList.add("active")
  updateProfilePage()
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function restartAnimations(page) {
  const animatedElements = page.querySelectorAll('[class*="animate-"]')
  animatedElements.forEach((el) => {
    el.style.animation = "none"
    el.offsetHeight
    el.style.animation = null
  })
}

// ==================== EFEITOS DE SCROLL ====================
function initScrollEffects() {
  const navbar = document.getElementById("navbar")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })
}

// ==================== MODAIS ====================
function initModals() {
  const signinBtn = document.getElementById("signinBtn")
  const signinModal = document.getElementById("signinModal")
  const closeSignin = document.getElementById("closeSignin")

  const signupBtn = document.getElementById("signupBtn")
  const signupModal = document.getElementById("signupModal")
  const closeSignup = document.getElementById("closeSignup")

  const switchToSignup = document.getElementById("switchToSignup")
  const switchToSignin = document.getElementById("switchToSignin")

  const forgotPasswordLink = document.getElementById("forgotPasswordLink")
  const forgotPasswordModal = document.getElementById("forgotPasswordModal")
  const closeForgotPassword = document.getElementById("closeForgotPassword")
  const backToSignin = document.getElementById("backToSignin")

  signinBtn.addEventListener("click", () => {
    signinModal.classList.remove("hidden")
  })

  closeSignin.addEventListener("click", () => {
    signinModal.classList.add("hidden")
  })

  signupBtn.addEventListener("click", () => {
    signupModal.classList.remove("hidden")
  })

  closeSignup.addEventListener("click", () => {
    signupModal.classList.add("hidden")
  })

  switchToSignup.addEventListener("click", (e) => {
    e.preventDefault()
    signinModal.classList.add("hidden")
    signupModal.classList.remove("hidden")
  })

  switchToSignin.addEventListener("click", (e) => {
    e.preventDefault()
    signupModal.classList.add("hidden")
    signinModal.classList.remove("hidden")
  })

  // Forgot password
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault()
    signinModal.classList.add("hidden")
    forgotPasswordModal.classList.remove("hidden")
  })

  closeForgotPassword.addEventListener("click", () => {
    forgotPasswordModal.classList.add("hidden")
  })

  backToSignin.addEventListener("click", (e) => {
    e.preventDefault()
    forgotPasswordModal.classList.add("hidden")
    signinModal.classList.remove("hidden")
  })

  // Forgot password form
  const forgotPasswordForm = document.getElementById("forgotPasswordForm")
  forgotPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault()
    handlePasswordRecovery()
  })
  ;[signinModal, signupModal, forgotPasswordModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden")
      }
    })
  })

  const signupAvatar = document.getElementById("signupAvatar")
  const avatarPreview = document.getElementById("avatarPreview")
  const avatarPreviewImg = document.getElementById("avatarPreviewImg")

  signupAvatar.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        avatarPreviewImg.src = event.target.result
        avatarPreview.classList.remove("hidden")
      }
      reader.readAsDataURL(file)
    }
  })
}

function handlePasswordRecovery() {
  const recoveryInput = document.getElementById("recoveryInput").value
  const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")
  const currentIP = localStorage.getItem("eclipsebyte_visitor_ip")

  const user = users.find((u) => u.username === recoveryInput || u.email === recoveryInput)

  if (!user) {
    showToast("Usuário não encontrado", "error")
    return
  }

  // Verifica se o IP é o mesmo do registro
  if (user.registeredIP === currentIP) {
    // Permite recuperar a senha
    const newPassword = prompt("Digite sua nova senha:")
    if (newPassword && newPassword.length >= 4) {
      const userIndex = users.findIndex((u) => u.username === user.username)
      users[userIndex].password = newPassword
      localStorage.setItem("eclipsebyte_users", JSON.stringify(users))
      showToast("Senha alterada com sucesso!", "success")
      document.getElementById("forgotPasswordModal").classList.add("hidden")
      document.getElementById("signinModal").classList.remove("hidden")
    } else {
      showToast("Senha deve ter pelo menos 4 caracteres", "error")
    }
  } else {
    // Envia notificação ao dono da conta
    addNotificationToUser(user.username, {
      title: "Tentativa de recuperação de senha",
      message: `Alguém tentou recuperar sua senha de um IP diferente (${currentIP}). Se não foi você, ignore esta mensagem.`,
      icon: "⚠️",
      time: "Agora",
    })
    showToast("IP não reconhecido. O dono da conta foi notificado.", "error")
  }
}

function addNotificationToUser(username, notification) {
  const userNotifications = JSON.parse(localStorage.getItem(`eclipsebyte_notifications_${username}`) || "[]")
  userNotifications.unshift(notification)
  localStorage.setItem(`eclipsebyte_notifications_${username}`, JSON.stringify(userNotifications))
}

// ==================== USERNAME CHECK ====================
function initUsernameCheck() {
  const usernameInput = document.getElementById("signupUsername")
  const usernameStatus = document.getElementById("usernameStatus")

  usernameInput.addEventListener("input", () => {
    const username = usernameInput.value.trim()
    if (username.length < 3) {
      usernameStatus.textContent = ""
      return
    }

    const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")
    const isTaken = users.some((u) => u.username.toLowerCase() === username.toLowerCase())

    if (isTaken) {
      usernameStatus.textContent = "(indisponível)"
      usernameStatus.className = "username-status taken"
    } else {
      usernameStatus.textContent = "(disponível)"
      usernameStatus.className = "username-status available"
    }
  })
}

// ==================== PAINÉIS LATERAIS ====================
function initPanels() {
  const notificationBtn = document.getElementById("notificationBtn")
  const notificationPanel = document.getElementById("notificationPanel")
  const closeNotifications = document.getElementById("closeNotifications")

  const settingsBtn = document.getElementById("settingsBtn")
  const settingsPanel = document.getElementById("settingsPanel")
  const closeSettings = document.getElementById("closeSettings")

  const panelOverlay = document.getElementById("panelOverlay")

  notificationBtn.addEventListener("click", () => {
    closePanels()
    notificationPanel.classList.remove("hidden")
    notificationPanel.classList.add("active")
    panelOverlay.classList.remove("hidden")
    loadNotifications()
  })

  closeNotifications.addEventListener("click", closePanels)

  settingsBtn.addEventListener("click", () => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      showToast("Faça login para acessar as configurações", "error")
      return
    }
    closePanels()
    settingsPanel.classList.remove("hidden")
    settingsPanel.classList.add("active")
    panelOverlay.classList.remove("hidden")
    loadSettingsData()
  })

  closeSettings.addEventListener("click", closePanels)
  panelOverlay.addEventListener("click", closePanels)

  const changeAvatar = document.getElementById("changeAvatar")
  changeAvatar.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        document.getElementById("settingsAvatar").src = event.target.result
      }
      reader.readAsDataURL(file)
    }
  })

  const changeBanner = document.getElementById("changeBanner")
  changeBanner.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        document.getElementById("bannerPreview").style.backgroundImage = `url(${event.target.result})`
      }
      reader.readAsDataURL(file)
    }
  })

  const settingsForm = document.getElementById("settingsForm")
  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveSettings()
  })

  const privacyForm = document.getElementById("privacyForm")
  privacyForm.addEventListener("submit", (e) => {
    e.preventDefault()
    savePrivacySettings()
  })

  const logoutBtn = document.getElementById("logoutBtn")
  logoutBtn.addEventListener("click", () => {
    logout()
    closePanels()
  })
}

function initSettingsTabs() {
  const tabs = document.querySelectorAll(".settings-tab")
  const tabContents = {
    profile: document.getElementById("profileSettingsTab"),
    privacy: document.getElementById("privacySettingsTab"),
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.getAttribute("data-tab")

      tabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      Object.values(tabContents).forEach((content) => content.classList.remove("active"))
      tabContents[targetTab].classList.add("active")
    })
  })
}

function closePanels() {
  const panels = document.querySelectorAll(".side-panel")
  const overlay = document.getElementById("panelOverlay")

  panels.forEach((panel) => {
    panel.classList.remove("active")
    setTimeout(() => {
      if (!panel.classList.contains("active")) {
        panel.classList.add("hidden")
      }
    }, 300)
  })

  overlay.classList.add("hidden")
}

function loadSettingsData() {
  const currentUser = getCurrentUser()
  if (!currentUser) return

  document.getElementById("settingsAvatar").src = currentUser.avatar || generateDefaultAvatar(currentUser.username)
  document.getElementById("bannerPreview").style.backgroundImage = currentUser.banner
    ? `url(${currentUser.banner})`
    : ""
  document.getElementById("editBio").value = currentUser.bio || ""

  // Load privacy data
  document.getElementById("newEmail").value = ""
  document.getElementById("currentPassword").value = ""
  document.getElementById("newPassword").value = ""
  document.getElementById("confirmPassword").value = ""

  const badgesContainer = document.getElementById("settingsBadges")
  badgesContainer.innerHTML = ""

  const badges = getUserBadges(currentUser.username)
  badges.forEach((badge) => {
    const badgeEl = createBadgeElement(badge)
    badgesContainer.appendChild(badgeEl)
  })
}

function saveSettings() {
  const currentUser = getCurrentUser()
  if (!currentUser) return

  const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")
  const userIndex = users.findIndex((u) => u.username === currentUser.username)

  if (userIndex === -1) return

  users[userIndex].bio = document.getElementById("editBio").value

  const avatarImg = document.getElementById("settingsAvatar")
  if (avatarImg.src && !avatarImg.src.includes("placeholder")) {
    users[userIndex].avatar = avatarImg.src
  }

  const bannerPreview = document.getElementById("bannerPreview")
  const bannerBg = bannerPreview.style.backgroundImage
  if (bannerBg && bannerBg !== "none") {
    users[userIndex].banner = bannerBg.replace(/^url$$['"]?/, "").replace(/['"]?$$$/, "")
  }

  localStorage.setItem("eclipsebyte_users", JSON.stringify(users))
  localStorage.setItem("eclipsebyte_current_user", JSON.stringify(users[userIndex]))

  updateNavbarProfile()
  showToast("Configurações salvas com sucesso!", "success")
  closePanels()
}

function savePrivacySettings() {
  const currentUser = getCurrentUser()
  if (!currentUser) return

  const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")
  const userIndex = users.findIndex((u) => u.username === currentUser.username)

  if (userIndex === -1) return

  const newEmail = document.getElementById("newEmail").value
  const currentPassword = document.getElementById("currentPassword").value
  const newPassword = document.getElementById("newPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  // Update email
  if (newEmail && newEmail !== currentUser.email) {
    const emailExists = users.some((u) => u.email === newEmail && u.username !== currentUser.username)
    if (emailExists) {
      showToast("Este email já está em uso", "error")
      return
    }
    users[userIndex].email = newEmail
  }

  // Update password
  if (newPassword) {
    if (currentPassword !== currentUser.password) {
      showToast("Senha atual incorreta", "error")
      return
    }
    if (newPassword !== confirmPassword) {
      showToast("As senhas não coincidem", "error")
      return
    }
    if (newPassword.length < 4) {
      showToast("A senha deve ter pelo menos 4 caracteres", "error")
      return
    }
    users[userIndex].password = newPassword
  }

  localStorage.setItem("eclipsebyte_users", JSON.stringify(users))
  localStorage.setItem("eclipsebyte_current_user", JSON.stringify(users[userIndex]))

  showToast("Configurações de privacidade salvas!", "success")

  // Clear fields
  document.getElementById("newEmail").value = ""
  document.getElementById("currentPassword").value = ""
  document.getElementById("newPassword").value = ""
  document.getElementById("confirmPassword").value = ""
}

// ==================== ADMIN PANEL ====================
function initAdminPanel() {
  const adminBtn = document.getElementById("adminBtn")
  const adminPanel = document.getElementById("adminPanel")
  const closeAdmin = document.getElementById("closeAdmin")
  const panelOverlay = document.getElementById("panelOverlay")
  const banIpBtn = document.getElementById("banIpBtn")

  adminBtn.addEventListener("click", () => {
    closePanels()
    adminPanel.classList.remove("hidden")
    adminPanel.classList.add("active")
    panelOverlay.classList.remove("hidden")
    loadAdminData()
  })

  closeAdmin.addEventListener("click", closePanels)

  banIpBtn.addEventListener("click", () => {
    const ipInput = document.getElementById("banIpInput")
    const ip = ipInput.value.trim()

    if (!ip) {
      showToast("Digite um IP para banir", "error")
      return
    }

    const bannedIPs = JSON.parse(localStorage.getItem("eclipsebyte_banned_ips") || "[]")
    if (!bannedIPs.includes(ip)) {
      bannedIPs.push(ip)
      localStorage.setItem("eclipsebyte_banned_ips", JSON.stringify(bannedIPs))
      showToast(`IP ${ip} foi banido`, "success")
      ipInput.value = ""
      loadAdminData()

      // Envia webhook
      sendAdminWebhook("ban", ip)
    } else {
      showToast("Este IP já está banido", "error")
    }
  })
}

function loadAdminData() {
  const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")
  const bannedIPs = JSON.parse(localStorage.getItem("eclipsebyte_banned_ips") || "[]")

  const usersList = document.getElementById("adminUsersList")
  usersList.innerHTML = ""

  users.forEach((user) => {
    const userItem = document.createElement("div")
    userItem.className = "admin-user-item"
    userItem.innerHTML = `
      <div class="admin-user-info">
        <span class="admin-user-name">${user.username}</span>
        <span class="admin-user-ip">${user.registeredIP || "N/A"}</span>
      </div>
      <button class="btn btn-sm btn-danger" onclick="banUserByIP('${user.registeredIP}', '${user.username}')">
        Banir IP
      </button>
    `
    usersList.appendChild(userItem)
  })

  const bannedList = document.getElementById("bannedIpsList")
  bannedList.innerHTML = ""

  if (bannedIPs.length === 0) {
    bannedList.innerHTML = '<p class="empty-text">Nenhum IP banido</p>'
  } else {
    bannedIPs.forEach((ip) => {
      const ipItem = document.createElement("div")
      ipItem.className = "banned-ip-item"
      ipItem.innerHTML = `
        <span>${ip}</span>
        <button class="btn btn-sm btn-outline" onclick="unbanIP('${ip}')">Desbanir</button>
      `
      bannedList.appendChild(ipItem)
    })
  }
}

function banUserByIP(ip, username) {
  if (!ip || ip === "N/A") {
    showToast("Este usuário não tem IP registrado", "error")
    return
  }

  const bannedIPs = JSON.parse(localStorage.getItem("eclipsebyte_banned_ips") || "[]")
  if (!bannedIPs.includes(ip)) {
    bannedIPs.push(ip)
    localStorage.setItem("eclipsebyte_banned_ips", JSON.stringify(bannedIPs))
    showToast(`Usuário ${username} banido (IP: ${ip})`, "success")
    loadAdminData()
    sendAdminWebhook("ban", ip, username)
  } else {
    showToast("Este IP já está banido", "error")
  }
}

function unbanIP(ip) {
  const bannedIPs = JSON.parse(localStorage.getItem("eclipsebyte_banned_ips") || "[]")
  const index = bannedIPs.indexOf(ip)
  if (index > -1) {
    bannedIPs.splice(index, 1)
    localStorage.setItem("eclipsebyte_banned_ips", JSON.stringify(bannedIPs))
    showToast(`IP ${ip} foi desbanido`, "success")
    loadAdminData()
    sendAdminWebhook("unban", ip)
  }
}

async function sendAdminWebhook(action, ip, username = null) {
  const embed = {
    embeds: [
      {
        title: action === "ban" ? "🔨 Usuário Banido" : "✅ Usuário Desbanido",
        color: action === "ban" ? 15158332 : 3066993,
        fields: [
          { name: "IP", value: ip, inline: true },
          { name: "Usuário", value: username || "N/A", inline: true },
          { name: "Admin", value: ADMIN_USERNAME, inline: true },
          { name: "Data/Hora", value: new Date().toLocaleString("pt-BR"), inline: false },
        ],
        footer: { text: "EclipseByte Studios - Admin Panel" },
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    })
  } catch (error) {
    console.log("Webhook error")
  }
}

// ==================== AUTENTICAÇÃO ====================
function initAuth() {
  const signinForm = document.getElementById("signinForm")
  const signupForm = document.getElementById("signupForm")

  signinForm.addEventListener("submit", (e) => {
    e.preventDefault()
    handleSignin()
  })

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault()
    handleSignup()
  })

  // Verifica se já está logado
  const currentUser = getCurrentUser()
  if (currentUser) {
    updateNavbarProfile()
  }
}

async function handleSignin() {
  const usernameOrEmail = document.getElementById("signinUsername").value
  const password = document.getElementById("signinPassword").value

  const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")
  const user = users.find(
    (u) => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password,
  )

  if (user) {
    localStorage.setItem("eclipsebyte_current_user", JSON.stringify(user))
    document.getElementById("signinModal").classList.add("hidden")
    updateNavbarProfile()
    showToast(`Bem-vindo de volta, ${user.username}!`, "success")

    // Webhook de login
    const embed = {
      embeds: [
        {
          title: "🔑 Login Realizado",
          color: 3066993,
          fields: [
            { name: "👤 Usuário", value: user.username, inline: true },
            { name: "📧 Email", value: user.email, inline: true },
            { name: "🌐 IP", value: userIP || "Unknown", inline: true },
            { name: "📍 Localização", value: userLocation || "Unknown", inline: true },
            { name: "🕐 Data/Hora", value: new Date().toLocaleString("pt-BR"), inline: false },
          ],
          footer: { text: "EclipseByte Studios - Sistema de Login" },
          timestamp: new Date().toISOString(),
        },
      ],
    }

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed),
      })
    } catch (error) {
      console.log("Webhook error")
    }

    // Reset form
    document.getElementById("signinForm").reset()
  } else {
    showToast("Credenciais inválidas", "error")
  }
}

async function handleSignup() {
  const username = document.getElementById("signupUsername").value.trim()
  const email = document.getElementById("signupEmail").value.trim()
  const password = document.getElementById("signupPassword").value
  const bio = document.getElementById("signupBio").value
  const avatarInput = document.getElementById("signupAvatar")

  // Verifica username único
  const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")
  const usernameTaken = users.some((u) => u.username.toLowerCase() === username.toLowerCase())

  if (usernameTaken) {
    showToast("Este username já está em uso", "error")
    return
  }

  const emailTaken = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  if (emailTaken) {
    showToast("Este email já está em uso", "error")
    return
  }

  let avatar = null
  if (avatarInput.files[0]) {
    avatar = await readFileAsDataURL(avatarInput.files[0])
  }

  const newUser = {
    username,
    email,
    password,
    bio,
    avatar,
    banner: null,
    registeredIP: userIP,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem("eclipsebyte_users", JSON.stringify(users))
  localStorage.setItem("eclipsebyte_current_user", JSON.stringify(newUser))

  document.getElementById("signupModal").classList.add("hidden")
  updateNavbarProfile()
  showToast(`Conta criada com sucesso! Bem-vindo, ${username}!`, "success")

  // Webhook de registro
  const embed = {
    embeds: [
      {
        title: "📝 Novo Registro",
        color: 5763719,
        fields: [
          { name: "👤 Usuário", value: username, inline: true },
          { name: "📧 Email", value: email, inline: true },
          { name: "🌐 IP", value: userIP || "Unknown", inline: true },
          { name: "📍 Localização", value: userLocation || "Unknown", inline: true },
          { name: "🕐 Data/Hora", value: new Date().toLocaleString("pt-BR"), inline: false },
        ],
        footer: { text: "EclipseByte Studios - Sistema de Registro" },
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    })
  } catch (error) {
    console.log("Webhook error")
  }

  // Reset form
  document.getElementById("signupForm").reset()
  document.getElementById("avatarPreview").classList.add("hidden")
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("eclipsebyte_current_user"))
}

function updateNavbarProfile() {
  const currentUser = getCurrentUser()
  const authButtons = document.getElementById("authButtons")
  const profileMenu = document.getElementById("profileMenu")
  const navAvatar = document.getElementById("navAvatar")
  const navUsername = document.getElementById("navUsername")
  const adminBtn = document.getElementById("adminBtn")

  if (currentUser) {
    authButtons.classList.add("hidden")
    profileMenu.classList.remove("hidden")
    navAvatar.src = currentUser.avatar || generateDefaultAvatar(currentUser.username)
    navUsername.textContent = currentUser.username

    // Mostra botão admin se for o admin
    if (currentUser.username === ADMIN_USERNAME) {
      adminBtn.classList.remove("hidden")
    } else {
      adminBtn.classList.add("hidden")
    }
  } else {
    authButtons.classList.remove("hidden")
    profileMenu.classList.add("hidden")
    adminBtn.classList.add("hidden")
  }
}

function logout() {
  localStorage.removeItem("eclipsebyte_current_user")
  updateNavbarProfile()
  showToast("Você saiu da conta", "success")

  // Volta para home
  const navLinks = document.querySelectorAll(".nav-link")
  const pages = document.querySelectorAll(".page")

  navLinks.forEach((l) => l.classList.remove("active"))
  pages.forEach((p) => p.classList.remove("active"))

  document.querySelector('[data-page="home"]').classList.add("active")
  document.getElementById("home").classList.add("active")
}

function generateDefaultAvatar(username) {
  const letter = username.charAt(0).toUpperCase()
  const canvas = document.createElement("canvas")
  canvas.width = 100
  canvas.height = 100
  const ctx = canvas.getContext("2d")

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 100, 100)
  gradient.addColorStop(0, "#333")
  gradient.addColorStop(1, "#111")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 100, 100)

  // Letter
  ctx.fillStyle = "#fff"
  ctx.font = "bold 50px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(letter, 50, 50)

  return canvas.toDataURL()
}

// ==================== NOTIFICAÇÕES ====================
function initNotifications() {
  loadNotifications()
}

function loadNotifications() {
  const currentUser = getCurrentUser()
  const notificationList = document.getElementById("notificationList")
  const notifBadge = document.getElementById("notifBadge")

  // Changelogs globais
  const globalNotifications = [
    {
      title: "🚀 Site Lançado!",
      message: "Bem-vindo ao novo site do EclipseByte Studios!",
      icon: "🎉",
      time: "10/01/2026",
    },
    {
      title: "🎮 Havana Roleplay",
      message: "Nosso projeto principal está disponível para jogar!",
      icon: "🎮",
      time: "09/01/2026",
    },
    {
      title: "💀 EclipseXPloits",
      message: "Nova seção de scripts adicionada ao site.",
      icon: "💀",
      time: "08/01/2026",
    },
    {
      title: "🔧 Sistema de Contas",
      message: "Agora você pode criar sua conta e personalizar seu perfil!",
      icon: "👤",
      time: "07/01/2026",
    },
  ]

  let userNotifications = []
  if (currentUser) {
    userNotifications = JSON.parse(localStorage.getItem(`eclipsebyte_notifications_${currentUser.username}`) || "[]")
  }

  const allNotifications = [...userNotifications, ...globalNotifications]

  notificationList.innerHTML = ""

  if (allNotifications.length === 0) {
    notificationList.innerHTML = '<p class="empty-notifications">Nenhuma notificação</p>'
    notifBadge.textContent = "0"
    notifBadge.style.display = "none"
    return
  }

  notifBadge.textContent = userNotifications.length > 0 ? userNotifications.length : ""
  notifBadge.style.display = userNotifications.length > 0 ? "flex" : "none"

  allNotifications.forEach((notif, index) => {
    const notifItem = document.createElement("div")
    notifItem.className = "notification-item"
    if (index < userNotifications.length) {
      notifItem.classList.add("unread")
    }
    notifItem.innerHTML = `
      <div class="notification-icon">${notif.icon || "📢"}</div>
      <div class="notification-content">
        <h4>${notif.title}</h4>
        <p>${notif.message}</p>
        <span class="notification-time">${notif.time}</span>
      </div>
    `
    notificationList.appendChild(notifItem)
  })
}

// ==================== PERFIL ====================
function updateProfilePage() {
  const currentUser = getCurrentUser()
  if (!currentUser) return

  document.getElementById("profileUsername").textContent = currentUser.username
  document.getElementById("profileBio").textContent = currentUser.bio || "Sem bio definida."
  document.getElementById("profileImg").src = currentUser.avatar || generateDefaultAvatar(currentUser.username)

  // Banner
  const profileBanner = document.getElementById("profileBanner")
  if (currentUser.banner) {
    profileBanner.style.backgroundImage = `url(${currentUser.banner})`
    profileBanner.style.backgroundSize = "cover"
    profileBanner.style.backgroundPosition = "center"
  }

  // Member since
  const createdAt = new Date(currentUser.createdAt)
  document.getElementById("profileMemberSince").textContent = `Membro desde: ${createdAt.toLocaleDateString("pt-BR")}`

  // Badges
  const badgesContainer = document.getElementById("profileBadges")
  badgesContainer.innerHTML = ""

  const badges = getUserBadges(currentUser.username)
  badges.forEach((badge) => {
    const badgeEl = createBadgeElement(badge)
    badgesContainer.appendChild(badgeEl)
  })
}

function getUserBadges(username) {
  const badges = []

  // Badge de membro
  badges.push({
    name: "Membro",
    icon: "👤",
    color: "#666",
    tooltip: "Membro do EclipseByte Studios",
  })

  // Badges especiais para silva777only
  if (username === ADMIN_USERNAME) {
    badges.unshift({
      name: "Owner",
      icon: "👑",
      color: "#FFD700",
      tooltip: "Dono do EclipseByte Studios",
    })
    badges.splice(1, 0, {
      name: "Desenvolvedor",
      icon: "💻",
      color: "#00D4FF",
      tooltip: "Desenvolvedor do Site",
    })
    badges.push({
      name: "VIP",
      icon: "⭐",
      color: "#FF6B6B",
      tooltip: "Assinante VIP",
    })
  }

  return badges
}

function createBadgeElement(badge) {
  const badgeEl = document.createElement("div")
  badgeEl.className = "badge-item"
  badgeEl.setAttribute("data-tooltip", badge.tooltip)
  badgeEl.innerHTML = `
    <span class="badge-icon" style="background: ${badge.color}20; border-color: ${badge.color};">${badge.icon}</span>
    <span class="badge-name">${badge.name}</span>
  `
  return badgeEl
}

// ==================== FORMULÁRIO DE CONTATO ====================
function initContactForm() {
  const contactForm = document.getElementById("contactForm")

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    await handleContactSubmit()
  })
}

async function handleContactSubmit() {
  const submitBtn = document.getElementById("submitBtn")
  const formStatus = document.getElementById("formStatus")

  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value
  const email = document.getElementById("email").value
  const subject = document.getElementById("subject").value
  const message = document.getElementById("message").value
  const contactMethod = document.getElementById("contactMethod").value
  const contactInfo = document.getElementById("contactInfo").value
  const reason = document.getElementById("reason").value
  const sector = document.getElementById("sector").value

  submitBtn.disabled = true
  submitBtn.innerHTML = "<span>Enviando...</span>"

  const embed = {
    embeds: [
      {
        title: "📩 Nova Mensagem de Contato",
        color: 16777215,
        fields: [
          { name: "👤 Nome Completo", value: `${firstName} ${lastName}`, inline: true },
          { name: "📧 Email", value: email, inline: true },
          { name: "🏢 Setor", value: sector, inline: true },
          { name: "📋 Motivo", value: reason, inline: true },
          { name: "💬 Meio de Contato", value: `${contactMethod}: ${contactInfo}`, inline: true },
          { name: "📝 Assunto", value: subject, inline: false },
          { name: "💭 Mensagem", value: message, inline: false },
        ],
        footer: { text: "EclipseByte Studios - Formulário de Contato" },
        timestamp: new Date().toISOString(),
      },
    ],
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    })

    if (response.ok) {
      formStatus.className = "form-status success"
      formStatus.textContent = "Mensagem enviada com sucesso! Entraremos em contato em breve."
      formStatus.classList.remove("hidden")
      document.getElementById("contactForm").reset()
      showToast("Mensagem enviada com sucesso!", "success")
    } else {
      throw new Error("Erro ao enviar")
    }
  } catch (error) {
    formStatus.className = "form-status error"
    formStatus.textContent = "Erro ao enviar mensagem. Tente novamente mais tarde."
    formStatus.classList.remove("hidden")
    showToast("Erro ao enviar mensagem", "error")
  }

  submitBtn.disabled = false
  submitBtn.innerHTML = `
    <span>Enviar Mensagem</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  `

  setTimeout(() => {
    formStatus.classList.add("hidden")
  }, 5000)
}

// ==================== COPIAR SCRIPT ====================
function copyScript() {
  const scriptText = document.getElementById("flickScript").textContent
  navigator.clipboard
    .writeText(scriptText)
    .then(() => {
      showToast("Script copiado para a área de transferência!", "success")
      const copyBtn = document.getElementById("copyScriptBtn")
      copyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copiado!
    `
      setTimeout(() => {
        copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copiar Script
      `
      }, 2000)
    })
    .catch(() => {
      showToast("Erro ao copiar script", "error")
    })
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer")
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`

  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  }

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `

  container.appendChild(toast)

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 10)

  // Remove toast
  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => toast.remove(), 300)
  }, 3000)
}

// ==================== UPDATE YEAR ====================
function updateYear() {
  document.getElementById("currentYear").textContent = new Date().getFullYear()
}

// Make functions globally available
window.copyScript = copyScript
window.banUserByIP = banUserByIP
window.unbanIP = unbanIP
