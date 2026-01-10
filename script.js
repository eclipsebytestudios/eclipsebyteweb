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
  await trackVisit()

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
  const bannedIPs = JSON.parse(localStorage.getItem("eclipsebyte_banned_ips") || "[]")
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
    const ip = document.getElementById("banIpInput").value.trim()
    if (ip) {
      banIP(ip)
      document.getElementById("banIpInput").value = ""
    }
  })
}

function loadAdminData() {
  const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")
  const bannedIPs = JSON.parse(localStorage.getItem("eclipsebyte_banned_ips") || "[]")

  // Load users list
  const usersList = document.getElementById("adminUsersList")
  usersList.innerHTML = users
    .map(
      (user) => `
    <div class="admin-user-item">
      <div class="admin-user-info">
        <img src="${user.avatar || generateDefaultAvatar(user.username)}" class="admin-user-avatar" alt="${user.username}">
        <div>
          <div class="admin-user-name">${user.username}</div>
          <div class="admin-user-ip">IP: ${user.registeredIP || "Unknown"}</div>
        </div>
      </div>
      ${user.username !== ADMIN_USERNAME ? `<button class="btn btn-sm btn-danger" onclick="banUserByIP('${user.registeredIP}', '${user.username}')">Banir</button>` : ""}
    </div>
  `,
    )
    .join("")

  // Load banned IPs
  const bannedList = document.getElementById("bannedIpsList")
  bannedList.innerHTML =
    bannedIPs
      .map(
        (ip) => `
    <div class="banned-ip-item">
      <span>${ip}</span>
      <button class="btn btn-sm btn-outline" onclick="unbanIP('${ip}')">Desbanir</button>
    </div>
  `,
      )
      .join("") || '<p style="color: #666; font-size: 0.85rem;">Nenhum IP banido</p>'
}

function banIP(ip) {
  const bannedIPs = JSON.parse(localStorage.getItem("eclipsebyte_banned_ips") || "[]")
  if (!bannedIPs.includes(ip)) {
    bannedIPs.push(ip)
    localStorage.setItem("eclipsebyte_banned_ips", JSON.stringify(bannedIPs))
    showToast(`IP ${ip} banido com sucesso`, "success")
    loadAdminData()
  } else {
    showToast("Este IP já está banido", "error")
  }
}

function banUserByIP(ip, username) {
  if (ip && ip !== "Unknown") {
    banIP(ip)
    // Remove user
    const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")
    const filteredUsers = users.filter((u) => u.username !== username)
    localStorage.setItem("eclipsebyte_users", JSON.stringify(filteredUsers))
    loadAdminData()
  } else {
    showToast("IP do usuário desconhecido", "error")
  }
}

function unbanIP(ip) {
  const bannedIPs = JSON.parse(localStorage.getItem("eclipsebyte_banned_ips") || "[]")
  const filtered = bannedIPs.filter((i) => i !== ip)
  localStorage.setItem("eclipsebyte_banned_ips", JSON.stringify(filtered))
  showToast(`IP ${ip} desbanido`, "success")
  loadAdminData()
}

// Make functions available globally for onclick handlers
window.banUserByIP = banUserByIP
window.unbanIP = unbanIP

// ==================== SISTEMA DE AUTENTICAÇÃO ====================
function initAuth() {
  const signinForm = document.getElementById("signinForm")
  const signupForm = document.getElementById("signupForm")

  signinForm.addEventListener("submit", async (e) => {
    e.preventDefault()

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
      signinForm.reset()

      await sendLoginWebhook(user.username)
    } else {
      showToast("Credenciais inválidas", "error")
    }
  })

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("signupUsername").value.trim()
    const email = document.getElementById("signupEmail").value
    const password = document.getElementById("signupPassword").value
    const bio = document.getElementById("signupBio").value
    const avatarInput = document.getElementById("signupAvatar")

    const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")

    if (users.find((u) => u.username.toLowerCase() === username.toLowerCase())) {
      showToast("Este username já está em uso", "error")
      return
    }

    if (users.find((u) => u.email === email)) {
      showToast("Este email já está cadastrado", "error")
      return
    }

    let avatar = generateDefaultAvatar(username)
    if (avatarInput.files[0]) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        avatar = event.target.result
        await completeSignup(username, email, password, bio, avatar)
      }
      reader.readAsDataURL(avatarInput.files[0])
    } else {
      await completeSignup(username, email, password, bio, avatar)
    }
  })

  updateNavbarProfile()
}

async function completeSignup(username, email, password, bio, avatar) {
  const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")

  const newUser = {
    username,
    email,
    password,
    bio,
    avatar,
    banner: null,
    createdAt: new Date().toISOString(),
    registeredIP: userIP, // Store IP for recovery
  }

  users.push(newUser)
  localStorage.setItem("eclipsebyte_users", JSON.stringify(users))
  localStorage.setItem("eclipsebyte_current_user", JSON.stringify(newUser))

  document.getElementById("signupModal").classList.add("hidden")
  document.getElementById("signupForm").reset()
  document.getElementById("avatarPreview").classList.add("hidden")
  document.getElementById("usernameStatus").textContent = ""

  updateNavbarProfile()
  showToast(`Conta criada com sucesso! Bem-vindo, ${username}!`, "success")

  await sendRegisterWebhook(username, email)
}

async function sendLoginWebhook(username) {
  const embed = {
    embeds: [
      {
        title: "🔐 Login Realizado",
        color: 5763719,
        fields: [
          { name: "👤 Usuário", value: username, inline: true },
          { name: "🌐 IP", value: userIP || "Unknown", inline: true },
          { name: "📍 Localização", value: userLocation || "Unknown", inline: true },
          { name: "🕐 Data/Hora", value: new Date().toLocaleString("pt-BR"), inline: false },
        ],
        footer: { text: "EclipseByte Studios - Sistema de Auth" },
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

async function sendRegisterWebhook(username, email) {
  const embed = {
    embeds: [
      {
        title: "📝 Novo Registro",
        color: 15844367,
        fields: [
          { name: "👤 Usuário", value: username, inline: true },
          { name: "📧 Email", value: email, inline: true },
          { name: "🌐 IP", value: userIP || "Unknown", inline: true },
          { name: "📍 Localização", value: userLocation || "Unknown", inline: false },
          { name: "🕐 Data/Hora", value: new Date().toLocaleString("pt-BR"), inline: false },
        ],
        footer: { text: "EclipseByte Studios - Sistema de Auth" },
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

    if (currentUser.username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
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
  showToast("Você saiu da sua conta", "success")

  const navLinks = document.querySelectorAll(".nav-link")
  const pages = document.querySelectorAll(".page")

  navLinks.forEach((l) => l.classList.remove("active"))
  document.querySelector('[data-page="home"]').classList.add("active")

  pages.forEach((p) => p.classList.remove("active"))
  document.getElementById("home").classList.add("active")
}

function generateDefaultAvatar(username) {
  const initial = username.charAt(0).toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#262626"/>
        <text x="50" y="50" font-family="Arial, sans-serif" font-size="40" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${initial}</text>
    </svg>`
  return "data:image/svg+xml;base64," + btoa(svg)
}

function getUserBadges(username) {
  const badges = []

  if (username.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
    badges.push({
      name: "Desenvolvedor",
      class: "developer",
      image:
        "data:image/svg+xml;base64," +
        btoa(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="4" fill="#fff"/><path d="M10 12l-4 4 4 4M22 12l4 4-4 4M18 10l-4 12" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
        ),
    })
    badges.push({
      name: "Owner",
      class: "owner",
      image:
        "data:image/svg+xml;base64," +
        btoa(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="4" fill="#262626"/><path d="M16 6l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-6z" fill="#fff"/></svg>`,
        ),
    })
  }

  badges.push({
    name: "Assinante VIP",
    class: "vip",
    image:
      "data:image/svg+xml;base64," +
      btoa(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="4" fill="#404040"/><path d="M16 8l2 4h5l-4 3 2 5-5-3-5 3 2-5-4-3h5l2-4z" fill="#fff"/></svg>`,
      ),
  })

  return badges
}

function createBadgeElement(badge) {
  if (badge.image) {
    const container = document.createElement("div")
    container.className = "badge-img"
    container.innerHTML = `
      <img src="${badge.image}" alt="${badge.name}">
      <span class="badge-tooltip">${badge.name}</span>
    `
    return container
  } else {
    const badgeEl = document.createElement("span")
    badgeEl.className = `badge ${badge.class}`
    badgeEl.textContent = badge.name
    return badgeEl
  }
}

function updateProfilePage() {
  const currentUser = getCurrentUser()
  if (!currentUser) return

  document.getElementById("profileImg").src = currentUser.avatar || generateDefaultAvatar(currentUser.username)
  document.getElementById("profileUsername").textContent = currentUser.username
  document.getElementById("profileBio").textContent = currentUser.bio || "Sem bio definida."

  const profileBanner = document.getElementById("profileBanner")
  if (currentUser.banner) {
    profileBanner.style.backgroundImage = `url(${currentUser.banner})`
  }

  const createdAt = new Date(currentUser.createdAt)
  const formattedDate = createdAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  document.getElementById("profileMemberSince").textContent = `Membro desde: ${formattedDate}`

  const badgesContainer = document.getElementById("profileBadges")
  badgesContainer.innerHTML = ""

  const badges = getUserBadges(currentUser.username)
  badges.forEach((badge) => {
    const badgeEl = createBadgeElement(badge)
    badgesContainer.appendChild(badgeEl)
  })
}

// ==================== FORMULÁRIO DE CONTATO ====================
function initContactForm() {
  const contactForm = document.getElementById("contactForm")
  const formStatus = document.getElementById("formStatus")
  const submitBtn = document.getElementById("submitBtn")

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    submitBtn.disabled = true
    submitBtn.innerHTML = "<span>Enviando...</span>"

    const formData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      subject: document.getElementById("subject").value,
      message: document.getElementById("message").value,
      contactMethod: document.getElementById("contactMethod").value,
      contactInfo: document.getElementById("contactInfo").value,
      reason: document.getElementById("reason").value,
      sector: document.getElementById("sector").value,
    }

    const reasonTranslations = {
      partnership: "Parceria",
      support: "Suporte Técnico",
      bug: "Reportar Bug",
      suggestion: "Sugestão",
      dmca: "Remoção de Conteúdo (DMCA)",
      question: "Dúvida Geral",
      other: "Outro",
    }

    const contactMethodTranslations = {
      email: "Email",
      phone: "Número de Telefone",
      discord: "Discord",
    }

    const embed = {
      embeds: [
        {
          title: "📩 Nova Mensagem de Contato",
          color: 16777215,
          fields: [
            { name: "👤 Nome Completo", value: `${formData.firstName} ${formData.lastName}`, inline: true },
            { name: "📧 Email", value: formData.email, inline: true },
            { name: "🏢 Setor", value: formData.sector, inline: true },
            { name: "📋 Assunto", value: formData.subject, inline: false },
            { name: "🎯 Motivo", value: reasonTranslations[formData.reason] || formData.reason, inline: true },
            {
              name: "📱 Meio de Contato",
              value: `${contactMethodTranslations[formData.contactMethod]}: ${formData.contactInfo}`,
              inline: true,
            },
            { name: "💬 Mensagem", value: formData.message, inline: false },
          ],
          footer: { text: "EclipseByte Studios - Sistema de Contato" },
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
        formStatus.innerHTML = "✅ Mensagem enviada com sucesso! Entraremos em contato em breve."
        formStatus.classList.remove("hidden")
        contactForm.reset()
        showToast("Mensagem enviada com sucesso!", "success")
      } else {
        throw new Error("Erro ao enviar")
      }
    } catch (error) {
      formStatus.className = "form-status error"
      formStatus.innerHTML = "❌ Erro ao enviar mensagem. Por favor, tente novamente."
      formStatus.classList.remove("hidden")
      showToast("Erro ao enviar mensagem", "error")
    }

    submitBtn.disabled = false
    submitBtn.innerHTML = `<span>Enviar Mensagem</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>`

    setTimeout(() => {
      formStatus.classList.add("hidden")
    }, 5000)
  })
}

// ==================== NOTIFICAÇÕES ====================
function initNotifications() {
  loadNotifications()
}

function loadNotifications() {
  const notificationList = document.getElementById("notificationList")
  const currentUser = getCurrentUser()

  // Default notifications (changelogs)
  const defaultNotifications = [
    {
      title: "📢 Changelog v2.0",
      message: "Nova página de Projetos com Havana Roleplay! Sistema de contas melhorado.",
      icon: "🆕",
      time: "Hoje",
      unread: true,
    },
    {
      title: "🎮 Havana Roleplay",
      message: "Nosso novo projeto principal está disponível! Confira na aba Projetos.",
      icon: "🎮",
      time: "Hoje",
      unread: true,
    },
    {
      title: "🔐 Sistema de Segurança",
      message: "Novo sistema de recuperação de senha implementado.",
      icon: "🔒",
      time: "Recente",
      unread: false,
    },
    {
      title: "👥 Grupo Roblox",
      message: "Entre no nosso grupo oficial do Roblox! Link disponível na aba Links.",
      icon: "👥",
      time: "1 dia atrás",
      unread: false,
    },
    {
      title: "Bem-vindo ao EclipseByte",
      message: "Obrigado por fazer parte da nossa comunidade!",
      icon: "🎉",
      time: "Sempre",
      unread: false,
    },
  ]

  // Get user-specific notifications
  let userNotifications = []
  if (currentUser) {
    userNotifications = JSON.parse(localStorage.getItem(`eclipsebyte_notifications_${currentUser.username}`) || "[]")
  }

  const allNotifications = [...userNotifications, ...defaultNotifications]

  // Update badge count
  const unreadCount = allNotifications.filter((n) => n.unread).length
  const notifBadge = document.getElementById("notifBadge")
  notifBadge.textContent = unreadCount > 0 ? unreadCount : allNotifications.length

  notificationList.innerHTML = allNotifications
    .map(
      (notif) => `
    <div class="notification-item ${notif.unread ? "unread" : ""}">
      <div class="notification-icon">${notif.icon}</div>
      <div class="notification-content">
        <h4>${notif.title}</h4>
        <p>${notif.message}</p>
        <span class="notification-time">${notif.time}</span>
      </div>
    </div>
  `,
    )
    .join("")
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer")

  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.textContent = message

  container.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// ==================== ANO ATUAL ====================
function updateYear() {
  document.getElementById("currentYear").textContent = new Date().getFullYear()
}

// ==================== TECLAS DE ATALHO ====================
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay").forEach((m) => m.classList.add("hidden"))
    closePanels()
  }
})
