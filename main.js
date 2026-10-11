// Inicializar Smooth Scrolling com Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Detect touch device
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;

// Magnetic Button Effect (Only on Desktop)
if (!isTouch && typeof gsap !== 'undefined') {
  const magneticElements = document.querySelectorAll('.magnetic');
  magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(elem, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    elem.addEventListener('mouseleave', () => {
      gsap.to(elem, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });
}

// Custom Cursor (Only on Desktop)
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
if (isTouch && cursorDot && cursorRing) {
  cursorDot.style.display = 'none';
  cursorRing.style.display = 'none';
} else if (cursorDot && cursorRing && typeof gsap !== 'undefined') {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(cursorDot, { x: mouseX, y: mouseY });
  });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    gsap.set(cursorRing, { x: ringX, y: ringY });
  });

  const hoverables = document.querySelectorAll('a, button, .bento-box, .accordion-trigger');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursorRing, { width: 60, height: 60, borderColor: 'var(--white)', duration: 0.2 });
      gsap.to(cursorDot, { scale: 0, duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursorRing, { width: 36, height: 36, borderColor: 'var(--green)', duration: 0.2 });
      gsap.to(cursorDot, { scale: 1, duration: 0.2 });
    });
  });
}

// Scroll Reveal
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => {
  observer.observe(el);
});

// Smooth scroll para links da navbar (Pill Nav)
document.querySelectorAll('a[data-scroll], .pill-links a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        lenis.scrollTo(target);
      }
    }
  });
});

// Accordion Logic
document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
});

function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const icon = item.querySelector('.acc-icon');
    
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isCurrentlyActive = item.classList.contains('active');
        
        // Fecha todos os outros itens
        accordionItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.accordion-trigger');
            const otherIcon = otherItem.querySelector('.acc-icon');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherIcon) otherIcon.textContent = '+';
          }
        });
        
        // Alterna o estado do item clicado
        if (isCurrentlyActive) {
          item.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
          if (icon) icon.textContent = '+';
        } else {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
          if (icon) icon.textContent = '-';
        }
      });
    }
  });
}

// Executa também imediatamente caso o DOM já esteja carregado
if (document.readyState !== 'loading') {
  initAccordion();
}
