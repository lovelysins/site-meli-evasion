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

  /* ---------- Carte interactive des excursions ---------- */
  var EXCURSIONS_MAP_DATA = [
    {
      coords: [-13.4828, 48.2367],
      icon: "icon-mask",
      tag: "Journée complète",
      title: "Nosy Komba & Tanikely",
      meta: "Environ 6 à 7 heures",
      desc: "Snorkeling dans la réserve marine de Tanikely, visite du village et du parc à lémuriens.",
      price: "à partir de 70 €/pers.",
      anchor: "#excursion-tanikely",
      waMsg: "Bonjour, je suis intéressé(e) par l'excursion Nosy Komba & Tanikely (journée complète). Pouvez-vous m'indiquer les disponibilités ?"
    },
    {
      coords: [-13.4667, 48.355],
      icon: "icon-compass",
      tag: "Demi-journée",
      title: "Rencontre avec les lémuriens",
      meta: "Environ 3 heures",
      desc: "Balade dans la réserve communautaire, observation des lémuriens en semi-liberté.",
      price: "à partir de 35 €/pers.",
      anchor: "#excursion-lemuriens",
      waMsg: "Bonjour, je suis intéressé(e) par l'excursion Rencontre avec les lémuriens (demi-journée). Pouvez-vous m'indiquer les disponibilités ?"
    },
    {
      coords: [-13.475, 48.295],
      icon: "icon-mask",
      tag: "Demi-journée",
      title: "Snorkeling & fonds marins",
      meta: "Environ 4 heures",
      desc: "Deux à trois spots de snorkeling autour de l'archipel, matériel fourni.",
      price: "à partir de 45 €/pers.",
      anchor: "#excursion-snorkeling",
      waMsg: "Bonjour, je suis intéressé(e) par l'excursion Snorkeling & fonds marins (demi-journée). Pouvez-vous m'indiquer les disponibilités ?"
    },
    {
      coords: [-13.46, 48.34],
      icon: "icon-sun",
      tag: "Fin de journée",
      title: "Coucher de soleil en mer",
      meta: "Environ 2 heures",
      desc: "Sortie courte et conviviale pour profiter du coucher de soleil sur l'océan.",
      price: "à partir de 30 €/pers.",
      anchor: "#excursion-coucher-soleil",
      waMsg: "Bonjour, je suis intéressé(e) par la croisière Coucher de soleil en mer. Pouvez-vous m'indiquer les disponibilités ?"
    },
    {
      coords: [-13.47, 48.35],
      icon: "icon-boat",
      tag: "Sur-mesure",
      title: "Excursion privée sur-mesure",
      meta: "Durée flexible",
      desc: "Bateau privatisé et itinéraire personnalisé pour votre groupe.",
      price: "Tarif sur demande",
      anchor: "#excursion-prive",
      waMsg: "Bonjour, je souhaiterais organiser une excursion privée sur-mesure avec Meli Évasion. Pouvez-vous me donner plus d'informations ?"
    }
  ];

  function wireExcursionMap() {
    var mapEl = document.getElementById("excursion-map");
    if (!mapEl || typeof L === "undefined") return;

    var map = L.map(mapEl, { scrollWheelZoom: false }).setView([-13.472, 48.31], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).addTo(map);

    EXCURSIONS_MAP_DATA.forEach(function (spot) {
      var iconHtml =
        '<span class="map-pin">' +
        '<svg width="20" height="20"><use href="#' + spot.icon + '"/></svg>' +
        "</span>";
      var divIcon = L.divIcon({
        html: iconHtml,
        className: "map-pin-wrap",
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -16]
      });

      var waUrl = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(spot.waMsg);
      var popupHtml =
        '<div class="map-popup">' +
        '<span class="map-popup-tag">' + spot.tag + "</span>" +
        "<h3>" + spot.title + "</h3>" +
        '<p class="map-popup-meta">' + spot.meta + "</p>" +
        "<p>" + spot.desc + "</p>" +
        '<div class="map-popup-footer">' +
        '<span class="map-popup-price">' + spot.price + "</span>" +
        '<a href="' + waUrl + '" target="_blank" rel="noopener" class="btn btn-whatsapp btn-small">' +
        '<svg width="16" height="16"><use href="#icon-whatsapp"/></svg><span>Je réserve</span>' +
        "</a>" +
        "</div>" +
        '<a href="' + spot.anchor + '" class="map-popup-more">Voir le détail de l’excursion</a>' +
        "</div>";

      L.marker(spot.coords, { icon: divIcon })
        .addTo(map)
        .bindPopup(popupHtml, { closeButton: true, maxWidth: 260 });
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
    wireExcursionMap();
  });
})();
