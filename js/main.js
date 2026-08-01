(function () {
  "use strict";

  // Numéro WhatsApp de Meli Évasion (format international, sans "+" ni espaces)
  var WHATSAPP_NUMBER = "261327308289";

  /* ---------- Construction des liens WhatsApp à partir de data-wa-msg ---------- */
  function wireWhatsappLinks() {
    var links = document.querySelectorAll("[data-wa-msg]");
    links.forEach(function (link) {
      var message = link.getAttribute("data-wa-msg") || "";
      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    });
  }

  /* ---------- Header : fond plein au scroll ---------- */
  function wireHeaderScroll() {
    var header = document.getElementById("site-header");
    if (!header) return;
    function update() {
      if (window.scrollY > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ---------- Menu mobile ---------- */
  function wireMobileNav() {
    var header = document.getElementById("site-header");
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("main-nav");
    if (!header || !toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Apparition au scroll ---------- */
  function wireRevealOnScroll() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || items.length === 0) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Repli propre des images manquantes (photos à venir) ---------- */
  function wireImageFallbacks() {
    var containers = document.querySelectorAll("[data-fallback-icon]");
    containers.forEach(function (container) {
      var img = container.querySelector("img");
      if (!img) return;
      function showFallback() {
        container.classList.add("img-error");
        if (!container.querySelector(".fallback-icon")) {
          var iconId = container.getAttribute("data-fallback-icon");
          var svgNS = "http://www.w3.org/2000/svg";
          var svg = document.createElementNS(svgNS, "svg");
          svg.setAttribute("width", "46");
          svg.setAttribute("height", "46");
          svg.setAttribute("class", "fallback-icon");
          var use = document.createElementNS(svgNS, "use");
          use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + iconId);
          use.setAttribute("href", "#" + iconId);
          svg.appendChild(use);
          container.appendChild(svg);
        }
      }
      if (img.complete && img.naturalWidth === 0) {
        showFallback();
      } else {
        img.addEventListener("error", showFallback, { once: true });
      }
    });
  }

  /* ---------- Année du footer ---------- */
  function wireFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------- Carrousels (flèches précédent/suivant) ---------- */
  function wireCarousels() {
    var carousels = document.querySelectorAll("[data-carousel]");
    carousels.forEach(function (carousel) {
      var track = carousel.querySelector(".carousel-track");
      var prev = carousel.querySelector(".carousel-prev");
      var next = carousel.querySelector(".carousel-next");
      if (!track) return;
      function scrollByAmount(sign) {
        var amount = track.clientWidth * 0.8 * sign;
        track.scrollBy({ left: amount, behavior: "smooth" });
      }
      if (prev) prev.addEventListener("click", function () { scrollByAmount(-1); });
      if (next) next.addEventListener("click", function () { scrollByAmount(1); });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireWhatsappLinks();
    wireHeaderScroll();
    wireMobileNav();
    wireRevealOnScroll();
    wireImageFallbacks();
    wireFooterYear();
    wireCarousels();
  });
})();
