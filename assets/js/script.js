(function () {
  "use strict";

  var nav = document.getElementById("mainNav");
  var yearEl = document.getElementById("year");
  var form = document.getElementById("contactForm");
  var feedback = document.getElementById("formFeedback");
  var playBtn = document.getElementById("playVideoBtn");

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

  /* Contact form — client-side success (no backend) */
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }
      form.classList.remove("was-validated");
      if (feedback) {
        feedback.textContent = "Thanks — we’ll get back to you shortly.";
        feedback.classList.remove("d-none", "text-danger");
        feedback.classList.add("text-success");
      }
      form.reset();
    });
  }

  /* Inline demo: replace with your YouTube/Vimeo embed URL */
  var VIDEO_URL =
    "https://www.youtube.com/embed/M7lc1UVf-VE?autoplay=1&rel=0&modestbranding=1";

  if (playBtn) {
    playBtn.addEventListener("click", function () {
      var wrap = playBtn.closest(".video-placeholder");
      if (!wrap) return;
      if (VIDEO_URL) {
        wrap.innerHTML =
          '<iframe class="w-100 h-100 border-0" src="' +
          VIDEO_URL +
          '" title="CFLBZ highlight reel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      } else {
        playBtn.classList.add("play-pulse");
        window.setTimeout(function () {
          playBtn.classList.remove("play-pulse");
        }, 600);
      }
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
