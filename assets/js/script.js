document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const loadingScreen = document.getElementById('loadingScreen');
  const themeToggle = document.getElementById('themeToggle');
  const backToTop = document.getElementById('backToTop');
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const nav = document.querySelector('.navbar');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (window.AOS) {
    AOS.init({ duration: 650, once: true, easing: 'ease-out-cubic', offset: 30, disable: prefersReducedMotion });
  }

  if (loadingScreen) {
    window.addEventListener('load', () => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => loadingScreen.remove(), 500);
    });
  }

  const savedTheme = localStorage.getItem('ibanga-theme');
  if (savedTheme === 'light') body.classList.add('light-theme');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('light-theme');
      const isLight = body.classList.contains('light-theme');
      localStorage.setItem('ibanga-theme', isLight ? 'light' : 'dark');
      themeToggle.innerHTML = isLight ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop?.classList.add('show');
      nav?.classList.add('shadow-sm');
    } else {
      backToTop?.classList.remove('show');
      nav?.classList.remove('shadow-sm');
    }
  });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  if (!prefersReducedMotion) {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = Number(counter.dataset.target || 0);
      const duration = 1600;
      const start = performance.now();
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = value + (counter.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(update);
      };
      const seen = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            requestAnimationFrame(update);
            obs.disconnect();
          }
        });
      }, { threshold: 0.7 });
      seen.observe(counter);
    });

    const typingElements = document.querySelectorAll('.typing');
    typingElements.forEach((element, idx) => {
      const text = element.getAttribute('data-words');
      const words = text.split(',');
      let wordIndex = 0;
      let charIndex = 0;
      const type = () => {
        element.textContent = words[wordIndex].slice(0, charIndex);
        charIndex++;
        if (charIndex > words[wordIndex].length) {
          setTimeout(() => {
            charIndex = 0;
            wordIndex = (wordIndex + 1) % words.length;
            type();
          }, 1200);
          return;
        }
        setTimeout(type, 80);
      };
      if (idx === 0) type();
    });
  }

  const portfolioItems = document.querySelectorAll('.portfolio-card');
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      portfolioItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? 'block' : 'none';
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImage.src = img.src;
      lightbox.classList.add('show');
    });
  });
  lightbox?.addEventListener('click', () => lightbox.classList.remove('show'));

  const testimonials = document.querySelectorAll('.testimonial-card');
  let testimonialIndex = 0;
  if (testimonials.length) {
    setInterval(() => {
      testimonials.forEach((card, idx) => {
        card.classList.toggle('active', idx === testimonialIndex);
      });
      testimonialIndex = (testimonialIndex + 1) % testimonials.length;
    }, 5000);
  }

  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your message has been received. We will contact you shortly.');
      form.reset();
    });
  });

  if (!localStorage.getItem('ibanga-cookie')) cookieBanner.style.display = 'block';
  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('ibanga-cookie', 'accepted');
    cookieBanner.style.display = 'none';
  });
});
