(function () {
  "use strict";

  var nav = document.getElementById("mainNav");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("contactForm");
  var feedback = document.getElementById("formFeedback");

  /* Footer year */
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Navbar: transparent → solid on scroll */
  function onScrollNav() {
    if (!nav) return;
    if (window.scrollY > 48) {
      nav.classList.add("nav-scrolled");
    } else {
      nav.classList.remove("nav-scrolled");
    }
  }

  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* Hero: respect stagger delays from CSS variables */
  document.querySelectorAll(".animate-hero").forEach(function (el) {
    var d = el.style.getPropertyValue("--delay");
    if (d) el.style.animationDelay = d;
  });

  /* Intersection Observer — scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* Lead form — client-side success (no backend) */
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }
      form.classList.remove("was-validated");
      if (feedback) {
        feedback.textContent = "Thanks — we’ll get back to you shortly with a quote.";
        feedback.classList.remove("d-none", "text-danger");
        feedback.classList.add("text-success");
      }
      form.reset();
    });
  }

  /* Contractor onboarding — opens email client with application body */
  var onboardForm = document.getElementById("onboardingForm");
  var onboardEmail = "hello@cflbz.com";
  if (onboardForm) {
    onboardForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!onboardForm.checkValidity()) {
        onboardForm.classList.add("was-validated");
        return;
      }
      onboardForm.classList.remove("was-validated");
      var lines = [];
      var els = onboardForm.elements;
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (!el.name || el.type === "submit" || el.type === "button") continue;
        if (el.type === "checkbox") {
          lines.push(el.name + ": " + (el.checked ? "yes" : "no"));
        } else {
          lines.push(el.name + ": " + el.value);
        }
      }
      var body = encodeURIComponent(lines.join("\n"));
      var subj = encodeURIComponent("Contractor onboarding application");
      window.location.href =
        "mailto:" + onboardEmail + "?subject=" + subj + "&body=" + body;
    });
  }

  /* Smooth offset for fixed navbar when using hash links */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });

  /* Bootstrap carousel: ensure ride (auto) after DOM ready */
  var heroCarousel = document.getElementById("heroCarousel");
  if (heroCarousel && typeof bootstrap !== "undefined" && bootstrap.Carousel) {
    var carousel = bootstrap.Carousel.getOrCreateInstance(heroCarousel, {
      interval: 6000,
      ride: "carousel",
      pause: false,
      wrap: true,
    });
    carousel.cycle();
  }
})();
