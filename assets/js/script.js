document.addEventListener('DOMContentLoaded', function () {
  const body = document.body;
  const loadingScreen = document.getElementById('loadingScreen');
  const themeToggle = document.getElementById('themeToggle');
  const backToTop = document.getElementById('backToTop');
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const nav = document.querySelector('.navbar');
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const prevSlideBtn = document.getElementById('prevSlide');
  const nextSlideBtn = document.getElementById('nextSlide');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Remove loading screen
  if (loadingScreen) {
    window.addEventListener('load', () => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => loadingScreen.remove(), 600);
    });
  }

  // Theme toggle
  const savedTheme = localStorage.getItem('ibanga-theme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
    if (themeToggle) themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('light-theme');
      const isLight = body.classList.contains('light-theme');
      localStorage.setItem('ibanga-theme', isLight ? 'light' : 'dark');
      themeToggle.innerHTML = isLight ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon"></i>';
      themeToggle.style.transform = 'scale(1.1)';
      setTimeout(() => themeToggle.style.transform = 'scale(1)', 200);
    });
  }

  // Navbar scroll behavior
  let lastScrollPos = 0;
  window.addEventListener('scroll', () => {
    const currentScrollPos = window.scrollY;
    if (currentScrollPos > 100) {
      backToTop?.classList.add('show');
      nav?.classList.add('scrolled');
    } else {
      backToTop?.classList.remove('show');
      nav?.classList.remove('scrolled');
    }
    lastScrollPos = currentScrollPos;
  }, { passive: true });

  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Counter animation
  if (!prefersReducedMotion) {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = Number(counter.dataset.target || 0);
      const suffix = counter.dataset.suffix || '';
      const duration = 2000;
      let started = false;

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            counter.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target + suffix;
          };
          requestAnimationFrame(update);
          observer.disconnect();
        }
      }, { threshold: 0.5 });
      observer.observe(counter);
    });
  }

  // Background slider
  if (slides.length > 0) {
    let currentSlide = 0;
    let autoPlayInterval;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
      currentSlide = index;
    };

    const nextSlide = () => {
      const index = (currentSlide + 1) % slides.length;
      showSlide(index);
      resetAutoPlay();
    };

    const prevSlide = () => {
      const index = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(index);
      resetAutoPlay();
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      if (!prefersReducedMotion) {
        autoPlayInterval = setInterval(nextSlide, 7000);
      }
    };

    prevSlideBtn?.addEventListener('click', prevSlide);
    nextSlideBtn?.addEventListener('click', nextSlide);
    
    if (!prefersReducedMotion) {
      autoPlayInterval = setInterval(nextSlide, 7000);
    }
  }

  // Portfolio filter
  const portfolioItems = document.querySelectorAll('.portfolio-card');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      portfolioItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        if (show) {
          item.style.display = 'block';
          setTimeout(() => item.style.opacity = '1', 10);
        } else {
          item.style.opacity = '0';
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  
  document.querySelectorAll('[data-lightbox]').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      lightboxImage.src = img.src;
      lightbox?.classList.add('show');
    });
  });

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('show');
    }
  });

  // Testimonials slider
  const testimonials = document.querySelectorAll('.testimonial-card');
  let testimonialIndex = 0;
  
  if (testimonials.length) {
    const showTestimonial = (index) => {
      testimonials.forEach((card, i) => {
        card.classList.toggle('active', i === index);
      });
    };

    if (!prefersReducedMotion) {
      setInterval(() => {
        testimonialIndex = (testimonialIndex + 1) % testimonials.length;
        showTestimonial(testimonialIndex);
      }, 6000);
    }
  }

  // Form validation and submission
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const emptyFields = [];
      
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          emptyFields.push(field.name || field.placeholder || 'Field');
          field.style.borderColor = 'var(--danger)';
        } else {
          field.style.borderColor = '';
        }
      });

      if (emptyFields.length > 0) {
        alert('Please fill in: ' + emptyFields.join(', '));
        return;
      }

      // Show success message
      const button = form.querySelector('button[type="submit"]');
      const originalText = button.textContent;
      button.textContent = '✓ Sent Successfully!';
      button.style.background = 'linear-gradient(135deg, var(--success), #059669)';
      
      setTimeout(() => {
        form.reset();
        button.textContent = originalText;
        button.style.background = '';
      }, 3000);
    });
  });

  // Cookie banner
  // Form submissions with EmailJS
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = {
        fullName: contactForm.fullName.value,
        email: contactForm.email.value,
        phone: contactForm.phone.value,
        businessName: contactForm.businessName.value,
        serviceType: contactForm.serviceType.value,
        budget: contactForm.budget.value,
        projectDetails: contactForm.projectDetails.value
      };

      const success = await emailService.sendContactForm(formData);
      if (success) {
        contactForm.reset();
      }
    });
  }

  // Newsletter subscription
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = newsletterForm.subscriberEmail.value;
      const success = await emailService.subscribeNewsletter(email);
      if (success) {
        newsletterForm.reset();
      }
    });
  }
});
