// ========== SMOOTH SCROLL ==========
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========== MOBILE NAV ==========
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileNav = document.getElementById('mobileNav');
const mobileNavClose = document.getElementById('mobileNavClose');

hamburgerBtn.addEventListener('click', () => {
  mobileNav.classList.add('open');
  document.body.style.overflow = 'hidden';
});

function closeMobileNav() {
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
}
mobileNavClose.addEventListener('click', closeMobileNav);

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + id) a.classList.add('active');
      });
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

// ========== NAVBAR SHRINK ON SCROLL ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.padding = '8px 0';
    navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
  } else {
    navbar.style.padding = '';
    navbar.style.boxShadow = '';
  }
});

// ========== SKILLS TABS ==========
const skillTabs = document.querySelectorAll('.skill-tab');
const skillPanels = document.querySelectorAll('.skill-panel');

skillTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');

    skillTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    skillPanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === 'panel-' + target) {
        panel.classList.add('active');
        // Animate tags in
        const tags = panel.querySelectorAll('.skill-tag');
        tags.forEach((tag, i) => {
          tag.style.opacity = '0';
          tag.style.transform = 'translateY(10px)';
          setTimeout(() => {
            tag.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          }, i * 40);
        });
      }
    });
  });
});

// ========== SCROLL REVEAL (fade-up) ==========
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// ========== CONTACT FORM ==========
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.btn-send');
  const originalText = btn.textContent;
  
  const name = form.querySelector('#fullName').value.trim();
  const email = form.querySelector('#email').value.trim();
  const message = form.querySelector('#message').value.trim();

  // Basic validation
  if (!name || !email || !message) {
    alert('Please fill in all fields.');
    return;
  }

  // Loading state
  btn.textContent = 'Sending...';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  // Send to FormSubmit
  fetch('https://formsubmit.co/ajax/chrishtoberuiux@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      email: email,
      message: message
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      btn.textContent = '✓ Message Sent!';
      btn.style.opacity = '1';
      btn.style.background = '#10b981';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    } else {
      throw new Error('Form submission failed');
    }
  })
  .catch(error => {
    console.error(error);
    btn.textContent = 'Error! Try Again.';
    btn.style.opacity = '1';
    btn.style.background = '#ef4444';

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  });
}

// ========== HERO STATS COUNTER ANIMATION ==========
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const target = parseInt(counter.textContent);
    if (isNaN(target)) return;
    let current = 0;
    const increment = Math.max(1, Math.floor(target / 40));
    const suffix = counter.textContent.replace(/[0-9]/g, '');
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = (current < 10 ? '0' : '') + current + suffix;
    }, 30);
  });
}

// Trigger counter animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      heroObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const heroSection = document.querySelector('.hero');
if (heroSection) heroObserver.observe(heroSection);

// ========== WORK CARD TILT ON HOVER ==========
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ========== SERVICE CARD HOVER GLOW ==========
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.1)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// ========== NAV LINKS SMOOTH SCROLL ==========
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    scrollToSection(targetId);
  });
});

// ========== TYPED EFFECT ON ROLE ==========
const roleEl = document.querySelector('.hero-text .role');
if (roleEl) {
  const text = roleEl.textContent;
  roleEl.textContent = '';
  roleEl.style.borderRight = '2px solid var(--accent)';
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      roleEl.textContent += text[i];
      i++;
      setTimeout(typeChar, 60);
    } else {
      // Blink cursor then remove
      let blinks = 0;
      const blinkInterval = setInterval(() => {
        roleEl.style.borderRight = blinks % 2 === 0 ? '2px solid transparent' : '2px solid var(--accent)';
        blinks++;
        if (blinks > 6) {
          clearInterval(blinkInterval);
          roleEl.style.borderRight = 'none';
        }
      }, 400);
    }
  }
  setTimeout(typeChar, 600);
}

// ========== NEWSLETTER SUBSCRIBE ==========
function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  const btn = document.querySelector('.newsletter-btn');
  const email = input.value.trim();

  if (!email || !email.includes('@')) {
    input.style.borderColor = '#ff716c';
    input.placeholder = 'Enter a valid email';
    setTimeout(() => {
      input.style.borderColor = '';
      input.placeholder = 'Enter your email';
    }, 2000);
    return;
  }

  const icon = btn.querySelector('.material-symbols-outlined');
  icon.textContent = 'hourglass_empty';
  btn.disabled = true;

  setTimeout(() => {
    icon.textContent = 'check_circle';
    btn.style.background = '#10b981';
    input.value = '';
    input.placeholder = 'Subscribed! ✓';

    setTimeout(() => {
      icon.textContent = 'send';
      btn.style.background = '';
      btn.disabled = false;
      input.placeholder = 'Enter your email';
    }, 2500);
  }, 1000);
}

// ========== FOOTER LINKS SMOOTH SCROLL ==========
document.querySelectorAll('.footer-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    scrollToSection(targetId);
  });
});
