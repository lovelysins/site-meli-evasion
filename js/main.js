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

  /* ---------- Carte interactive des excursions ----------
     Coordonnées vérifiées (Wikipedia / sources géographiques publiques).
     Nosy Fanihy n'a pas de coordonnées fiables trouvées : elle reste
     dans le catalogue des destinations mais n'apparaît pas sur la carte. */
  var EXCURSIONS_MAP_DATA = [
    {
      coords: [-13.4828, 48.2367],
      icon: "icon-mask",
      tag: "Snorkeling",
      title: "Nosy Tanikely",
      meta: "Journée ou demi-journée",
      desc: "Réserve marine : tortues, poissons tropicaux et fonds coralliens protégés.",
      price: "à partir de 70 €/pers.",
      anchor: "#excursion-tanikely",
      waMsg: "Bonjour, je suis intéressé(e) par l'excursion à Nosy Tanikely. Pouvez-vous m'indiquer les disponibilités ?"
    },
    {
      coords: [-13.4667, 48.355],
      icon: "icon-compass",
      tag: "Facile",
      title: "Tour de Nosy Komba",
      meta: "Demi-journée",
      desc: "Village, parc à lémuriens en semi-liberté et snorkeling à deux pas du port d'attache.",
      price: "à partir de 35 €/pers.",
      anchor: "#excursion-komba",
      waMsg: "Bonjour, je suis intéressé(e) par le tour de Nosy Komba. Pouvez-vous m'indiquer les disponibilités ?"
    },
    {
      coords: [-13.4249, 48.3633],
      icon: "icon-compass",
      tag: "Facile",
      title: "Nosy Vorona",
      meta: "Demi-journée",
      desc: "Le petit îlot au phare entre Nosy Be et Nosy Komba, sanctuaire d'oiseaux marins.",
      price: "Tarif sur demande",
      anchor: "#excursion-vorona",
      waMsg: "Bonjour, je suis intéressé(e) par l'excursion à Nosy Vorona. Pouvez-vous m'indiquer les disponibilités ?"
    },
    {
      coords: [-13.7167, 48.2],
      icon: "icon-leaf",
      tag: "Atypique",
      title: "Nosy Mamoko",
      meta: "Journée complète",
      desc: "Tortues terrestres et cascade sur la grande terre : une sortie loin des sentiers battus.",
      price: "Tarif sur demande",
      anchor: "#excursion-mamoko",
      waMsg: "Bonjour, je suis intéressé(e) par l'excursion à Nosy Mamoko. Pouvez-vous m'indiquer les disponibilités ?"
    },
    {
      coords: [-13.5833, 47.8167],
      icon: "icon-compass",
      tag: "Aventure",
      title: "Nosy Iranja",
      meta: "Journée complète (départ tôt)",
      desc: "Sa langue de sable de 2 km entre deux îlots, l'une des plus belles vues de l'archipel.",
      price: "Tarif sur demande",
      anchor: "#excursion-iranja",
      waMsg: "Bonjour, je suis intéressé(e) par l'excursion à Nosy Iranja. Pouvez-vous m'indiquer les disponibilités ?"
    },
    {
      coords: [-12.9, 48.6],
      icon: "icon-mask",
      tag: "Aventure",
      title: "Nosy Mitsio",
      meta: "Journée complète (départ tôt)",
      desc: "Un archipel plus au nord aux fonds marins spectaculaires : notre sortie la plus aventureuse.",
      price: "Tarif sur demande",
      anchor: "#excursion-mitsio",
      waMsg: "Bonjour, je suis intéressé(e) par l'excursion à Nosy Mitsio. Pouvez-vous m'indiquer les disponibilités ?"
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

    var map = L.map(mapEl, { scrollWheelZoom: false });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).addTo(map);

    var markers = [];

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

      var marker = L.marker(spot.coords, { icon: divIcon })
        .addTo(map)
        .bindPopup(popupHtml, { closeButton: true, maxWidth: 260 });
      markers.push(marker);
    });

    if (markers.length) {
      var group = L.featureGroup(markers);
      map.fitBounds(group.getBounds(), { padding: [30, 30] });
    }
  }

  /* ---------- Filtres de destinations (Pépites, Aventures, Faciles...) ---------- */
  function wireDestinationFilters() {
    var buttons = document.querySelectorAll(".dest-filter");
    if (!buttons.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var filter = btn.getAttribute("data-filter");
        // Requête faite au moment du clic (pas mise en cache) : reste valable
        // même si les cartes ont été recréées par le rendu dynamique du CMS.
        var cards = document.querySelectorAll("[data-categories]");
        cards.forEach(function (card) {
          var cats = (card.getAttribute("data-categories") || "").split(" ");
          var show = filter === "toutes" || cats.indexOf(filter) !== -1;
          card.style.display = show ? "" : "none";
          if (show) card.classList.add("is-visible");
        });
      });
    });
  }

  /* ---------- Contenu éditable via le panneau d'administration (/admin) ----------
     Les fichiers content/*.json sont éditables sans code via Decap CMS.
     Si un fichier est absent ou vide, le texte déjà présent dans le HTML reste
     affiché tel quel : ce script ne fait que le remplacer quand une valeur existe. */
  function setCmsText(root, selector, value, isHtml) {
    if (!value) return;
    var el = root.querySelector(selector);
    if (!el) return;
    if (isHtml) el.innerHTML = value;
    else el.textContent = value;
  }

  function setCmsImg(root, selector, value) {
    if (!value) return;
    var el = root.querySelector(selector);
    if (el) el.src = value;
  }

  function escapeHtml(str) {
    if (str == null) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------- Rendu dynamique (permet le vrai ajout/suppression via le CMS) ---------- */
  function renderDestinations(items) {
    var grid = document.getElementById("destinations-grid");
    if (!grid || !items || !items.length) return;
    grid.innerHTML = items.map(function (item) {
      if (!item || !item.id) return "";
      var cats = Array.isArray(item.categories) ? item.categories.join(" ") : (item.categories || "");
      var waMsg = "Bonjour, je suis intéressé(e) par l'excursion " + (item.title || "") +
        ". Pouvez-vous m'indiquer les disponibilités ?";
      return (
        '<article class="card reveal" id="excursion-' + escapeHtml(item.id) + '" data-categories="' + escapeHtml(cats) + '" data-dest="' + escapeHtml(item.id) + '">' +
          '<div class="card-media" data-fallback-icon="icon-mask">' +
            '<img src="' + escapeHtml(item.photo || "") + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
            (item.tag ? '<span class="card-tag">' + escapeHtml(item.tag) + '</span>' : "") +
          '</div>' +
          '<div class="card-body">' +
            '<h3>' + escapeHtml(item.title) + '</h3>' +
            '<p class="card-meta"><svg width="16" height="16"><use href="#icon-clock"/></svg> <span>' + escapeHtml(item.meta) + '</span></p>' +
            '<p>' + escapeHtml(item.desc) + '</p>' +
            '<div class="card-footer">' +
              '<span class="price">' + escapeHtml(item.price) + '</span>' +
              '<a href="#" class="btn btn-whatsapp btn-small" data-wa-msg="' + escapeHtml(waMsg) + '">' +
                '<svg width="16" height="16"><use href="#icon-whatsapp"/></svg><span>Réserver</span>' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</article>'
      );
    }).join("");
  }

  function renderGallery(items) {
    var grid = document.querySelector(".gallery-grid");
    if (!grid || !items || !items.length) return;
    grid.innerHTML = items.map(function (entry) {
      var photo = entry && entry.photo ? entry.photo : "";
      return (
        '<div class="gallery-item reveal" data-fallback-icon="icon-boat">' +
          '<img src="' + escapeHtml(photo) + '" alt="Photo Meli Évasion" loading="lazy">' +
        '</div>'
      );
    }).join("");
  }

  function renderFaq(items) {
    var list = document.querySelector(".faq-list");
    if (!list || !items || !items.length) return;
    list.innerHTML = items.map(function (entry, i) {
      if (!entry) return "";
      return (
        '<details class="faq-item reveal"' + (i === 0 ? " open" : "") + '>' +
          '<summary>' + escapeHtml(entry.q) + '</summary>' +
          '<p>' + escapeHtml(entry.a) + '</p>' +
        '</details>'
      );
    }).join("");
  }

  function applyContentOverlay(data) {
    if (data.hero) {
      setCmsText(document, "[data-cms='hero.title']", data.hero.title);
      setCmsText(document, "[data-cms='hero.lead']", data.hero.lead);
    }
    if (data.histoire) {
      setCmsImg(document, "[data-cms='histoire.photo']", data.histoire.photo);
      var text1El = document.querySelector("[data-cms='histoire.text1']");
      if (text1El && data.histoire.text1) text1El.innerHTML = data.histoire.text1;
      setCmsText(document, "[data-cms='histoire.text2']", data.histoire.text2);
    }
    if (data.destinations && data.destinations.items) renderDestinations(data.destinations.items);
    if (data.gallery && data.gallery.items) renderGallery(data.gallery.items);
    if (data.faq && data.faq.items) renderFaq(data.faq.items);
    if (data.misc) {
      setCmsText(document, "[data-cms='misc.profil_pecheur_text']", data.misc.profil_pecheur_text);
      setCmsText(document, "[data-cms='misc.testimonial_title']", data.misc.testimonial_title);
      setCmsText(document, "[data-cms='misc.testimonial_note']", data.misc.testimonial_note);
    }
    // Le rendu dynamique remplace des blocs entiers du DOM : on ré-applique
    // les comportements qui dépendent des éléments (liens WhatsApp, repli
    // photo, apparition au scroll) sur les nouveaux éléments créés.
    wireWhatsappLinks();
    wireImageFallbacks();
    wireRevealOnScroll();
  }

  function wireContentOverlay() {
    var files = ["hero", "histoire", "destinations", "gallery", "faq", "misc"];
    Promise.all(
      files.map(function (name) {
        return fetch("content/" + name + ".json", { cache: "no-store" })
          .then(function (r) { return r.ok ? r.json() : null; })
          .catch(function () { return null; });
      })
    ).then(function (results) {
      var data = {};
      files.forEach(function (name, i) { if (results[i]) data[name] = results[i]; });
      applyContentOverlay(data);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireContentOverlay();
    wireWhatsappLinks();
    wireHeaderScroll();
    wireMobileNav();
    wireRevealOnScroll();
    wireImageFallbacks();
    wireFooterYear();
    wireCarousels();
    wireExcursionMap();
    wireDestinationFilters();
  });
})();
