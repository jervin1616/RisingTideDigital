/* ============================================================
   Rising Tide Digital, LLC — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Navbar: scroll effect ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const navClose  = document.getElementById('navMobileClose');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navMobile.classList.toggle('open');
      document.body.style.overflow = navMobile.classList.contains('open') ? 'hidden' : '';
    });

    if (navClose) {
      navClose.addEventListener('click', closeNav);
    }

    // Close on link click
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    function closeNav() {
      navToggle.classList.remove('open');
      navMobile.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ---------- Active nav link ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const linkPath = link.getAttribute('href');
    if (
      linkPath === currentPath ||
      (currentPath === '' && linkPath === 'index.html') ||
      (currentPath === 'index.html' && linkPath === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Pricing toggle (builds vs maintenance) ---------- */
  const pricingToggle = document.getElementById('pricingToggle');
  if (pricingToggle) {
    const buildsPanel      = document.getElementById('pricingBuilds');
    const maintenancePanel = document.getElementById('pricingMaintenance');
    const labelLeft        = document.getElementById('toggleLabelLeft');
    const labelRight       = document.getElementById('toggleLabelRight');

    pricingToggle.addEventListener('change', () => {
      const showMaintenance = pricingToggle.checked;
      buildsPanel.style.display      = showMaintenance ? 'none'  : 'grid';
      maintenancePanel.style.display = showMaintenance ? 'grid'  : 'none';
      labelLeft.classList.toggle('active',  !showMaintenance);
      labelRight.classList.toggle('active',  showMaintenance);
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- Contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn  = contactForm.querySelector('[type="submit"]');
      const formWrap   = document.getElementById('contactFormWrap');
      const formSuccess = document.getElementById('formSuccess');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

      // Replace this fetch with your actual form endpoint
      // e.g. Formspree, EmailJS, or your own backend
      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          formWrap.style.display = 'none';
          formSuccess.style.display = 'block';
        } else {
          throw new Error('Server error');
        }
      } catch {
        // Show inline error
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showFormError(contactForm);
      }
    });
  }

  function showFormError(form) {
    let err = form.querySelector('.form-error-msg');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form-error-msg';
      err.style.cssText = 'color:#c0392b;font-size:0.85rem;margin-top:0.75rem;text-align:center;';
      form.appendChild(err);
    }
    err.textContent = 'Something went wrong. Please email us directly or try again.';
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
