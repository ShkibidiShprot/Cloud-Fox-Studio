document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.custom-cursor');
  const backToTopBtn = document.getElementById('back-to-top');
  const bead = document.getElementById('scroll-bead');
  const form = document.getElementById('contact-form');

  if (window.innerWidth >= 768) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    });

    const hoverTargets = document.querySelectorAll('a, button, .paper-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  }

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  let isTicking = false;
  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }

        if (window.innerWidth >= 768 && bead) {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPos = window.scrollY;
          const pct = Math.min(scrollPos / docHeight, 1);
          bead.style.top = `${pct * 100}%`;
        }
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.reveal-item').forEach(el => observer.observe(el));

  document.querySelectorAll('.animate-float').forEach(el => {
    el.style.animationDelay = `-${Math.random() * 5}s`;
  });

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const status = document.getElementById('form-status');
      const btn = document.getElementById('form-btn');
      const originalBtnText = btn.innerText;

      btn.innerText = "Sending...";
      btn.disabled = true;

      const finish = (success) => {
        btn.innerText = originalBtnText;
        btn.disabled = false;
        if (success) {
          form.reset();
          status.classList.remove('hidden');
          setTimeout(() => status.classList.add('hidden'), 5000);
        } else {
          alert("Oops! There was a problem sending your form.");
        }
      };

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        finish(response.ok);
      } catch {
        finish(false);
      }
    });
  }
});