document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));

  if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.getAttribute('id');
        var link = navAnchors.filter(function (a) { return a.getAttribute('href') === '#' + id; })[0];
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) { a.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- contact form (front-end only) ---------- */
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');

  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // No backend is wired up yet — see README to connect this to
      // Formspree, EmailJS, or your own endpoint.
      success.classList.add('show');
      form.querySelector('button[type="submit"]').setAttribute('disabled', 'true');
    });
  }

  var branchData = {
    mohammadpur: {
      name: 'Asad Avenue',
      address: '31/A Asad Avenue, Mohammadpur, Dhaka 1207',
      map: '31%2FA+Asad+Avenue%2C+Dhaka'
    },
    gulshan: {
      name: 'Gulshan North',
      address: 'House 18, Road 71, Gulshan 2, Dhaka 1212',
      map: 'House+18%2C+Road+71%2C+Gulshan+2%2C+Dhaka'
    },
    dhanmondi: {
      name: 'Dhanmondi Lake',
      address: 'Road 8A, Dhanmondi, Dhaka 1209',
      map: 'Road+8A%2C+Dhanmondi%2C+Dhaka'
    }
  };

  var branchCards = document.querySelectorAll('[data-branch]');
  var mapDetail = document.getElementById('mapDetail');

  if (branchCards.length && mapDetail) {
    branchCards.forEach(function (control) {
      control.addEventListener('click', function () {
        var key = control.getAttribute('data-branch');
        var branch = branchData[key];
        if (!branch) return;
        document.querySelectorAll('[data-branch]').forEach(function (item) {
          item.classList.toggle('is-selected', item.getAttribute('data-branch') === key);
        });
        mapDetail.querySelector('h3').textContent = branch.name;
        mapDetail.querySelector('p').textContent = branch.address;
        mapDetail.querySelector('a').href = 'https://www.google.com/maps/search/?api=1&query=' + branch.map;
      });
    });
  }

  var authForm = document.getElementById('authForm');
  var authCard = document.querySelector('.auth-card');
  var authSubmit = document.getElementById('authSubmit');
  var authSuccess = document.getElementById('authSuccess');

  document.querySelectorAll('[data-auth-mode]').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var isSignup = tab.getAttribute('data-auth-mode') === 'signup';
      document.querySelectorAll('[data-auth-mode]').forEach(function (item) { item.classList.remove('is-active'); });
      tab.classList.add('is-active');
      if (authCard) authCard.classList.toggle('signup-mode', isSignup);
      if (authSubmit) authSubmit.textContent = isSignup ? 'Create account' : 'Sign in';
    });
  });

  if (authForm && authSuccess) {
    authForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!authForm.checkValidity()) { authForm.reportValidity(); return; }
      authSuccess.classList.add('show');
      authSubmit.setAttribute('disabled', 'true');
      window.setTimeout(function () { window.location.href = 'checkout.html'; }, 900);
    });
  }

  document.querySelectorAll('[data-social]').forEach(function (button) {
    button.addEventListener('click', function () {
      window.alert(button.getAttribute('data-social') + ' sign-in is ready to connect to your provider.');
    });
  });

  var paymentForm = document.getElementById('paymentForm');
  var paymentSuccess = document.getElementById('paymentSuccess');
  var payTotal = document.getElementById('payTotal');
  var selectedPlan = new URLSearchParams(window.location.search).get('plan');
  var planButtons = document.querySelectorAll('.checkout-plan');

  if (planButtons.length) {
    var activatePlan = function (button) {
      planButtons.forEach(function (item) { item.classList.remove('is-selected'); });
      button.classList.add('is-selected');
      if (payTotal) payTotal.textContent = '$' + button.getAttribute('data-price');
    };
    planButtons.forEach(function (button) {
      if (button.getAttribute('data-plan') === selectedPlan) activatePlan(button);
      button.addEventListener('click', function () { activatePlan(button); });
    });
  }

  if (paymentForm && paymentSuccess) {
    paymentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!paymentForm.checkValidity()) { paymentForm.reportValidity(); return; }
      paymentSuccess.classList.add('show');
      paymentForm.querySelector('button[type="submit"]').setAttribute('disabled', 'true');
    });
  }

  var railSelectors = '.program-grid, .feature-grid, .trainer-grid, .membership-grid, .testimonial-grid, .gallery-grid';
  var mobileRails = Array.prototype.slice.call(document.querySelectorAll(railSelectors));

  mobileRails.forEach(function (rail) {
    var railCards = Array.prototype.slice.call(rail.children);
    if (railCards.length < 2) return;
    var railTimer;
    var railIndex = 0;
    var restartRail = function () {
      window.clearInterval(railTimer);
      if (window.innerWidth > 760 || reduceMotion) return;
      railTimer = window.setInterval(function () {
        railIndex = railIndex >= railCards.length - 1 ? 0 : railIndex + 1;
        rail.scrollTo({ left: railCards[railIndex].offsetLeft, behavior: 'smooth' });
      }, 3000);
    };
    rail.addEventListener('pointerenter', function () { window.clearInterval(railTimer); });
    rail.addEventListener('pointerleave', restartRail);
    rail.addEventListener('touchstart', function () { window.clearInterval(railTimer); }, { passive: true });
    rail.addEventListener('touchend', function () { window.setTimeout(restartRail, 1800); }, { passive: true });
    window.addEventListener('resize', restartRail);
    restartRail();
  });

  if (window.matchMedia('(pointer: fine)').matches) {
    var siteCursor = document.createElement('div');
    siteCursor.className = 'site-cursor';
    siteCursor.innerHTML = '<span>Forge</span>';
    document.body.appendChild(siteCursor);
    document.body.classList.add('has-site-cursor');

    document.addEventListener('pointermove', function (event) {
      siteCursor.style.left = event.clientX + 'px';
      siteCursor.style.top = event.clientY + 'px';
      siteCursor.classList.add('is-visible');
    });
    document.addEventListener('pointerleave', function () { siteCursor.classList.remove('is-visible'); });
    document.querySelectorAll('a, button, input, select, textarea, [role="button"]').forEach(function (control) {
      control.addEventListener('pointerenter', function () { siteCursor.classList.add('is-action'); });
      control.addEventListener('pointerleave', function () { siteCursor.classList.remove('is-action'); });
    });
    document.querySelectorAll('.program-grid').forEach(function (rail) {
      rail.addEventListener('pointerenter', function () {
        siteCursor.classList.add('is-program');
        siteCursor.querySelector('span').textContent = 'View';
      });
      rail.addEventListener('pointerleave', function () {
        siteCursor.classList.remove('is-program');
        siteCursor.querySelector('span').textContent = 'Forge';
      });
    });
  }
});
