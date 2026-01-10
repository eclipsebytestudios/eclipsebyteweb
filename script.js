/* ===========================================
   ECLIPSEBYTE STUDIOS - JAVASCRIPT
   Sistema completo de navegação, autenticação
   e funcionalidades do site
   =========================================== */

// ==================== INICIALIZAÇÃO ====================
document.addEventListener("DOMContentLoaded", () => {
  initNavigation()
  initScrollEffects()
  initModals()
  initPanels()
  initAuth()
  initContactForm()
  initCopyButtons()
  initNotifications()
  updateYear()
})

// ==================== NAVEGAÇÃO ====================
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-link")
  const pages = document.querySelectorAll(".page")
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const navbarMenu = document.getElementById("navbarMenu")

  // Navegação entre páginas
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetPage = link.getAttribute("data-page")

      // Atualiza links ativos
      navLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      // Mostra página correspondente
      pages.forEach((page) => {
        page.classList.remove("active")
        if (page.id === targetPage) {
          page.classList.add("active")
          // Reinicia animações
          restartAnimations(page)
        }
      })

      // Fecha menu mobile
      navbarMenu.classList.remove("active")
      mobileMenuBtn.classList.remove("active")

      // Scroll para o topo
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  })

  // Menu mobile
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenuBtn.classList.toggle("active")
    navbarMenu.classList.toggle("active")
  })

  // Botão de perfil
  const profileBtn = document.getElementById("profileBtn")
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      showProfilePage()
    })
  }
}

// Função para mostrar página de perfil
function showProfilePage() {
  const pages = document.querySelectorAll(".page")
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((l) => l.classList.remove("active"))
  pages.forEach((page) => page.classList.remove("active"))

  document.getElementById("profile").classList.add("active")
  updateProfilePage()
  window.scrollTo({ top: 0, behavior: "smooth" })
}

// Reinicia animações de uma página
function restartAnimations(page) {
  const animatedElements = page.querySelectorAll('[class*="animate-"]')
  animatedElements.forEach((el) => {
    el.style.animation = "none"
    el.offsetHeight // Trigger reflow
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
  // Sign In Modal
  const signinBtn = document.getElementById("signinBtn")
  const signinModal = document.getElementById("signinModal")
  const closeSignin = document.getElementById("closeSignin")

  // Sign Up Modal
  const signupBtn = document.getElementById("signupBtn")
  const signupModal = document.getElementById("signupModal")
  const closeSignup = document.getElementById("closeSignup")

  // Switch entre modais
  const switchToSignup = document.getElementById("switchToSignup")
  const switchToSignin = document.getElementById("switchToSignin")

  // Abrir Sign In
  signinBtn.addEventListener("click", () => {
    signinModal.classList.remove("hidden")
  })

  // Fechar Sign In
  closeSignin.addEventListener("click", () => {
    signinModal.classList.add("hidden")
  })

  // Abrir Sign Up
  signupBtn.addEventListener("click", () => {
    signupModal.classList.remove("hidden")
  })

  // Fechar Sign Up
  closeSignup.addEventListener("click", () => {
    signupModal.classList.add("hidden")
  })

  // Switch para Sign Up
  switchToSignup.addEventListener("click", (e) => {
    e.preventDefault()
    signinModal.classList.add("hidden")
    signupModal.classList.remove("hidden")
  })

  // Switch para Sign In
  switchToSignin.addEventListener("click", (e) => {
    e.preventDefault()
    signupModal.classList.add("hidden")
    signinModal.classList.remove("hidden")
  })

  // Fechar ao clicar fora
  ;[signinModal, signupModal].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden")
      }
    })
  })

  // Preview de avatar no signup
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

// ==================== PAINÉIS LATERAIS ====================
function initPanels() {
  const notificationBtn = document.getElementById("notificationBtn")
  const notificationPanel = document.getElementById("notificationPanel")
  const closeNotifications = document.getElementById("closeNotifications")

  const settingsBtn = document.getElementById("settingsBtn")
  const settingsPanel = document.getElementById("settingsPanel")
  const closeSettings = document.getElementById("closeSettings")

  const panelOverlay = document.getElementById("panelOverlay")

  // Abrir notificações
  notificationBtn.addEventListener("click", () => {
    closePanels()
    notificationPanel.classList.remove("hidden")
    notificationPanel.classList.add("active")
    panelOverlay.classList.remove("hidden")
  })

  // Fechar notificações
  closeNotifications.addEventListener("click", closePanels)

  // Abrir configurações
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

  // Fechar configurações
  closeSettings.addEventListener("click", closePanels)

  // Fechar ao clicar no overlay
  panelOverlay.addEventListener("click", closePanels)

  // Configurações de avatar
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

  // Configurações de banner
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

  // Formulário de configurações
  const settingsForm = document.getElementById("settingsForm")
  settingsForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveSettings()
  })

  // Logout
  const logoutBtn = document.getElementById("logoutBtn")
  logoutBtn.addEventListener("click", () => {
    logout()
    closePanels()
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

  // Emblemas
  const badgesContainer = document.getElementById("settingsBadges")
  badgesContainer.innerHTML = ""

  const badges = getUserBadges(currentUser.username)
  badges.forEach((badge) => {
    const badgeEl = document.createElement("span")
    badgeEl.className = `badge ${badge.class}`
    badgeEl.textContent = badge.name
    badgesContainer.appendChild(badgeEl)
  })
}

function saveSettings() {
  const currentUser = getCurrentUser()
  if (!currentUser) return

  const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")
  const userIndex = users.findIndex((u) => u.username === currentUser.username)

  if (userIndex === -1) return

  // Atualiza bio
  users[userIndex].bio = document.getElementById("editBio").value

  // Atualiza avatar se foi alterado
  const avatarImg = document.getElementById("settingsAvatar")
  if (avatarImg.src && !avatarImg.src.includes("placeholder")) {
    users[userIndex].avatar = avatarImg.src
  }

  // Atualiza banner se foi alterado
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

// ==================== SISTEMA DE AUTENTICAÇÃO ====================
function initAuth() {
  const signinForm = document.getElementById("signinForm")
  const signupForm = document.getElementById("signupForm")

  // Sign In
  signinForm.addEventListener("submit", (e) => {
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
    } else {
      showToast("Credenciais inválidas", "error")
    }
  })

  // Sign Up
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const username = document.getElementById("signupUsername").value
    const email = document.getElementById("signupEmail").value
    const password = document.getElementById("signupPassword").value
    const bio = document.getElementById("signupBio").value
    const avatarInput = document.getElementById("signupAvatar")

    const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")

    // Verifica se usuário já existe
    if (users.find((u) => u.username === username)) {
      showToast("Este username já está em uso", "error")
      return
    }

    if (users.find((u) => u.email === email)) {
      showToast("Este email já está cadastrado", "error")
      return
    }

    // Processa avatar
    let avatar = generateDefaultAvatar(username)
    if (avatarInput.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        avatar = event.target.result
        completeSignup(username, email, password, bio, avatar)
      }
      reader.readAsDataURL(avatarInput.files[0])
    } else {
      completeSignup(username, email, password, bio, avatar)
    }
  })

  // Verifica se há usuário logado
  updateNavbarProfile()
}

function completeSignup(username, email, password, bio, avatar) {
  const users = JSON.parse(localStorage.getItem("eclipsebyte_users") || "[]")

  const newUser = {
    username,
    email,
    password,
    bio,
    avatar,
    banner: null,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem("eclipsebyte_users", JSON.stringify(users))
  localStorage.setItem("eclipsebyte_current_user", JSON.stringify(newUser))

  document.getElementById("signupModal").classList.add("hidden")
  document.getElementById("signupForm").reset()
  document.getElementById("avatarPreview").classList.add("hidden")

  updateNavbarProfile()
  showToast(`Conta criada com sucesso! Bem-vindo, ${username}!`, "success")
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

  if (currentUser) {
    authButtons.classList.add("hidden")
    profileMenu.classList.remove("hidden")
    navAvatar.src = currentUser.avatar || generateDefaultAvatar(currentUser.username)
    navUsername.textContent = currentUser.username
  } else {
    authButtons.classList.remove("hidden")
    profileMenu.classList.add("hidden")
  }
}

function logout() {
  localStorage.removeItem("eclipsebyte_current_user")
  updateNavbarProfile()
  showToast("Você saiu da sua conta", "success")

  // Volta para Home
  const navLinks = document.querySelectorAll(".nav-link")
  const pages = document.querySelectorAll(".page")

  navLinks.forEach((l) => l.classList.remove("active"))
  document.querySelector('[data-page="home"]').classList.add("active")

  pages.forEach((p) => p.classList.remove("active"))
  document.getElementById("home").classList.add("active")
}

function generateDefaultAvatar(username) {
  // Gera um avatar SVG simples com a inicial do usuário
  const initial = username.charAt(0).toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="#262626"/>
        <text x="50" y="50" font-family="Arial, sans-serif" font-size="40" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${initial}</text>
    </svg>`
  return "data:image/svg+xml;base64," + btoa(svg)
}

function getUserBadges(username) {
  const badges = []

  // Badges especiais para silva777only
  if (username.toLowerCase() === "silva777only") {
    badges.push({ name: "Desenvolvedor", class: "developer" })
    badges.push({ name: "Owner", class: "owner" })
  }

  // Badge VIP para todos (visual)
  badges.push({ name: "Assinante VIP", class: "vip" })

  return badges
}

function updateProfilePage() {
  const currentUser = getCurrentUser()
  if (!currentUser) return

  document.getElementById("profileImg").src = currentUser.avatar || generateDefaultAvatar(currentUser.username)
  document.getElementById("profileUsername").textContent = currentUser.username
  document.getElementById("profileBio").textContent = currentUser.bio || "Sem bio definida."

  // Banner
  const profileBanner = document.getElementById("profileBanner")
  if (currentUser.banner) {
    profileBanner.style.backgroundImage = `url(${currentUser.banner})`
  }

  // Data de criação
  const createdAt = new Date(currentUser.createdAt)
  const formattedDate = createdAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
  document.getElementById("profileMemberSince").textContent = `Membro desde: ${formattedDate}`

  // Badges
  const badgesContainer = document.getElementById("profileBadges")
  badgesContainer.innerHTML = ""

  const badges = getUserBadges(currentUser.username)
  badges.forEach((badge) => {
    const badgeEl = document.createElement("span")
    badgeEl.className = `badge ${badge.class}`
    badgeEl.textContent = badge.name
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

    // Desabilita botão
    submitBtn.disabled = true
    submitBtn.innerHTML = "<span>Enviando...</span>"

    // Coleta dados
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

    // Traduz motivo
    const reasonTranslations = {
      partnership: "Parceria",
      support: "Suporte Técnico",
      bug: "Reportar Bug",
      suggestion: "Sugestão",
      dmca: "Remoção de Conteúdo (DMCA)",
      question: "Dúvida Geral",
      other: "Outro",
    }

    // Traduz meio de contato
    const contactMethodTranslations = {
      email: "Email",
      phone: "Número de Telefone",
      discord: "Discord",
    }

    // Prepara embed para Discord
    const embed = {
      embeds: [
        {
          title: "📩 Nova Mensagem de Contato",
          color: 16777215, // Branco
          fields: [
            {
              name: "👤 Nome Completo",
              value: `${formData.firstName} ${formData.lastName}`,
              inline: true,
            },
            {
              name: "📧 Email",
              value: formData.email,
              inline: true,
            },
            {
              name: "🏢 Setor",
              value: formData.sector,
              inline: true,
            },
            {
              name: "📋 Assunto",
              value: formData.subject,
              inline: false,
            },
            {
              name: "🎯 Motivo",
              value: reasonTranslations[formData.reason] || formData.reason,
              inline: true,
            },
            {
              name: "📱 Meio de Contato",
              value: `${contactMethodTranslations[formData.contactMethod]}: ${formData.contactInfo}`,
              inline: true,
            },
            {
              name: "💬 Mensagem",
              value: formData.message,
              inline: false,
            },
          ],
          footer: {
            text: "EclipseByte Studios - Sistema de Contato",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }

    try {
      const response = await fetch(
        "https://discord.com/api/webhooks/1459229422220611584/hOdCqWKLZnGiEsbIJCJw6jQtjrAxZuGBwydgwTQ_PVwx7Ki9vpzKTIDoSkwwVCMGH3co",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(embed),
        },
      )

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

    // Reabilita botão
    submitBtn.disabled = false
    submitBtn.innerHTML = `<span>Enviar Mensagem</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>`

    // Esconde mensagem após 5 segundos
    setTimeout(() => {
      formStatus.classList.add("hidden")
    }, 5000)
  })
}

// ==================== BOTÕES DE COPIAR ====================
function initCopyButtons() {
  const copyButtons = document.querySelectorAll(".copy-btn")

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const script = btn.getAttribute("data-script")

      try {
        await navigator.clipboard.writeText(script)
        btn.classList.add("copied")
        btn.querySelector("span").textContent = "Copiado!"
        showToast("Script copiado para a área de transferência!", "success")

        setTimeout(() => {
          btn.classList.remove("copied")
          btn.querySelector("span").textContent = "Copiar Script"
        }, 2000)
      } catch (error) {
        showToast("Erro ao copiar script", "error")
      }
    })
  })
}

// ==================== NOTIFICAÇÕES ====================
function initNotifications() {
  const notificationList = document.getElementById("notificationList")

  // Notificações mockadas
  const notifications = [
    {
      title: "Nova atualização do site",
      message: "Confira as novas funcionalidades!",
      icon: "🔔",
      time: "Agora",
    },
    {
      title: "Novo script em breve",
      message: "Fique ligado para novos lançamentos.",
      icon: "💀",
      time: "1h atrás",
    },
    {
      title: "Bem-vindo ao Grupo EclipseByte",
      message: "Obrigado por fazer parte da nossa comunidade!",
      icon: "🎉",
      time: "2h atrás",
    },
  ]

  notificationList.innerHTML = notifications
    .map(
      (notif) => `
        <div class="notification-item">
            <div class="notification-icon">${notif.icon}</div>
            <div class="notification-content">
                <h4>${notif.title}</h4>
                <p>${notif.message}</p>
                <span style="font-size: 0.7rem; color: var(--color-gray-600);">${notif.time}</span>
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
  // ESC fecha modais e painéis
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay").forEach((m) => m.classList.add("hidden"))
    closePanels()
  }
})
