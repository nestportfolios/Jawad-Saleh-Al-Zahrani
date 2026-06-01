/**
 * Jawad Saleh Al-Zahrani Portfolio Interactive Scripts
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Define All Global Elements
  const html = document.documentElement;
  const preloader = document.getElementById("preloader");
  const body = document.body;
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
  const nav = document.querySelector(".navbar");

  // Add temporary preloading class to prevent initial jumps
  body.classList.add("preloading");

  /* ==========================================================================
     1. PRELOADER LOGIC
     ========================================================================== */
  window.addEventListener("load", () => {
    // Minimum 2-second preloader showcase
    setTimeout(() => {
      preloader.style.opacity = "0";
      preloader.style.transform = "scale(1.05)";
      
      setTimeout(() => {
        preloader.style.display = "none";
        body.classList.remove("preloading");
        
        // Start typing and entering layout animations
        triggerHeroTypingEffect();
        triggerRoleRotator();
      }, 600); // Transitions matched to style.css definitions
    }, 2000);
  });

  /* ==========================================================================
     2. DUAL THEME CONTROLLER
     ========================================================================== */
  const savedTheme = localStorage.getItem("jaz-theme") || "dark";
  html.setAttribute("data-theme", savedTheme);
  updateThemeButtonUI(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    
    // Smooth transition trigger
    html.setAttribute("data-theme", nextTheme);
    localStorage.setItem("jaz-theme", nextTheme);
    updateThemeButtonUI(nextTheme);

    // Update bubbles colors dynamically
    if (window.updateBubblesColors) {
      window.updateBubblesColors();
    }

    // Refresh icons inside theme toggle
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  });

  function updateThemeButtonUI(theme) {
    if (theme === "dark") {
      themeToggleBtn.setAttribute("aria-label", "Switch to Light Theme");
    } else {
      themeToggleBtn.setAttribute("aria-label", "Switch to Dark Theme");
    }
  }

  /* ==========================================================================
     3. FLOATING BUBBLES CANVAS ENGINE
     ========================================================================== */
  const canvas = document.getElementById("bubbles-canvas");
  const ctx = canvas.getContext("2d");

  let bubbles = [];
  const bubbleCount = 42;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Retrieve bubble dynamic styles from current active theme variables
  function getBubbleColors() {
    const style = getComputedStyle(html);
    return [
      style.getPropertyValue("--bubble-color-1").trim() || "rgba(249, 128, 171, 0.05)",
      style.getPropertyValue("--bubble-color-2").trim() || "rgba(189, 56, 82, 0.03)",
      style.getPropertyValue("--bubble-color-3").trim() || "rgba(255, 182, 193, 0.07)"
    ];
  }

  class Bubble {
    constructor() {
      this.reset(true);
    }

    reset(init = false) {
      this.radius = Math.random() * 50 + 8; // 8px to 58px radii
      this.x = Math.random() * canvas.width;
      this.y = init ? Math.random() * canvas.height : canvas.height + this.radius + 10;
      this.speed = Math.random() * 0.35 + 0.08; // Super organic, slow upward drift
      this.wobbleSpeed = Math.random() * 0.01 + 0.003;
      this.wobbleAngle = Math.random() * Math.PI * 2;
      this.wobbleDistance = Math.random() * 1.5 + 0.5;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulseAngle = Math.random() * Math.PI * 2;
      this.baseRadius = this.radius;
      
      const colors = getBubbleColors();
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y -= this.speed;
      this.wobbleAngle += this.wobbleSpeed;
      this.x += Math.sin(this.wobbleAngle) * this.wobbleDistance;
      
      // Radius pulsation
      this.pulseAngle += this.pulseSpeed;
      this.radius = this.baseRadius + Math.sin(this.pulseAngle) * (this.baseRadius * 0.08);

      if (this.y < -this.radius) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, this.color);
      grad.addColorStop(0.4, this.color);
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize bubbles array
  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push(new Bubble());
  }

  // Dynamic color updating interface for theme toggle hook
  window.updateBubblesColors = () => {
    bubbles.forEach(b => {
      const colors = getBubbleColors();
      b.color = colors[Math.floor(Math.random() * colors.length)];
    });
  };

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bubbles.forEach(b => {
      b.update();
      b.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();

  /* ==========================================================================
     4. TYPING & ROLE ROTATION INTERACTIONS
     ========================================================================== */
  function triggerHeroTypingEffect() {
    const element = document.getElementById("typing-hero-name");
    const nameText = "Jawad Saleh Al-Zahrani";
    element.textContent = "";
    
    let index = 0;
    function type() {
      if (index < nameText.length) {
        element.textContent += nameText.charAt(index);
        index++;
        setTimeout(type, 65);
      }
    }
    type();
  }

  function triggerRoleRotator() {
    const rotator = document.getElementById("role-rotator");
    const roles = [
      { text: "Mechanical Engineer", anim: "anim-typewriter" },
      { text: "Maintenance Engineer", anim: "anim-handwrite" },
      { text: "HVAC Engineer", anim: "anim-slide" },
      { text: "Manufacturing Engineer", anim: "anim-flip" },
      { text: "Quality Assurance Engineer", anim: "anim-wave" },
      { text: "Energy Systems Engineer", anim: "anim-scale" },
      { text: "Power Plant Engineer", anim: "anim-underline" },
      { text: "Inspection Engineer", anim: "anim-sketch" }
    ];

    let currentIndex = 0;
    let rotInterval = null;

    function renderRole(index) {
      const role = roles[index];
      // Clear previous animation classes
      rotator.className = '';
      rotator.classList.add('role-anim', role.anim);

      // Build per-character spans so each can animate differently
      rotator.innerHTML = '';
      const text = role.text;
      for (let i = 0; i < text.length; i++) {
        const ch = text.charAt(i);
        const span = document.createElement('span');
        span.className = 'char';
        span.style.setProperty('--i', i);
        span.innerHTML = ch === ' ' ? '&nbsp;' : ch;
        rotator.appendChild(span);
      }
    }

    function startRotation() {
      // render initial
      renderRole(currentIndex);
      rotInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % roles.length;
        renderRole(currentIndex);
      }, 3800);
    }

    function stopRotation() {
      if (rotInterval) clearInterval(rotInterval);
      rotInterval = null;
    }

    // Pause rotation on hover and replay animation
    rotator.addEventListener('mouseenter', () => {
      stopRotation();
      // replay current role animation
      const idx = currentIndex;
      renderRole(idx);
    });

    rotator.addEventListener('mouseleave', () => {
      // restart rotation after a short delay
      if (!rotInterval) {
        setTimeout(() => {
          startRotation();
        }, 700);
      }
    });

    startRotation();
  }

  /* ==========================================================================
     5. NAVIGATION & HAMBURGER SYSTEM
     ========================================================================== */
  hamburgerBtn.addEventListener("click", () => {
    hamburgerBtn.classList.toggle("open");
    mobileMenuOverlay.classList.toggle("open");
    body.classList.toggle("preloading"); // Lock scroll when menu overlay is up
  });

  // Handle overlay link actions
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  mobileNavLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      // Close Hamburger Overlay
      hamburgerBtn.classList.remove("open");
      mobileMenuOverlay.classList.remove("open");
      body.classList.remove("preloading");

      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    });
  });

  // Header Box-Shadow transition on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  /* ==========================================================================
     6. SCROLL REVEAL & INTERSECTION OBSERVERS
     ========================================================================== */
  const animatedElements = document.querySelectorAll(".animate-in");
  const langBars = document.querySelectorAll(".lang-bar-segment");

  const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        
        // Custom hook for language segments triggers
        if (entry.target.id === "skills") {
          langBars.forEach(segment => segment.classList.add("animate"));
        }
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  animatedElements.forEach(el => scrollRevealObserver.observe(el));

  // Auto Active Class Updater for Desktop Links on Scroll
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, {
    rootMargin: "-28% 0px -68% 0px" // Center-weighted viewport detection
  });

  sections.forEach(sec => activeSectionObserver.observe(sec));

  /* ==========================================================================
     7. PREMIUM PARALLAX DRIFT (IMAGE HOVER)
     ========================================================================== */
  const driftContainer = document.querySelector(".image-parallax-drift");
  const driftImage = driftContainer ? driftContainer.querySelector(".profile-placeholder, .profile-img") : null;
  const reflection = driftContainer ? driftContainer.querySelector(".image-reflection") : null;

  if (driftContainer) {
    driftContainer.addEventListener("mousemove", (e) => {
    const rect = driftContainer.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within container
    const y = e.clientY - rect.top;  // y position within container

    // Normalize coordinates around absolute center (0,0)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normX = (x - centerX) / centerX; // Range: -1 to 1
    const normY = (y - centerY) / centerY; // Range: -1 to 1

    // Tilt limits: Max ±7.5deg rotation
    const tiltX = -normY * 7.5;
    const tiltY = normX * 7.5;

    // Opposite parallax shifts: Max ±9px
    const shiftX = -normX * 9;
    const shiftY = -normY * 9;

    driftContainer.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`;
    driftImage.style.transform = `translate(${shiftX}px, ${shiftY}px) scale(1.08)`;

    // Update reflection point dynamically
    reflection.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.18) 0%, transparent 60%)`;
  });

    driftContainer.addEventListener("mouseleave", () => {
      driftContainer.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      if (driftImage) driftImage.style.transform = "translate(0, 0) scale(1)";
    });
  }
});
