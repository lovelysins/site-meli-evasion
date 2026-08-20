/* Aperçu en direct pour le panneau d'administration Meli Évasion.
   Utilise l'API officielle de Decap CMS (window.h, CMS.registerPreviewTemplate)
   pour afficher, à côté du formulaire, une version stylée comme le vrai site. */
(function () {
  "use strict";
  if (typeof CMS === "undefined") return;

  CMS.registerPreviewStyle(
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Poppins:wght@300;400;500;600;700&display=swap"
  );
  CMS.registerPreviewStyle("../css/style.css");

  var h = window.h;

  function wrap(children) {
    return h(
      "div",
      { style: { padding: "28px", background: "#faf5f0", minHeight: "100%" } },
      children
    );
  }

  function text(map, key) {
    return map && map.get ? map.get(key) || "" : "";
  }

  CMS.registerPreviewTemplate("hero", function (props) {
    var d = props.entry.get("data");
    return wrap(
      h(
        "div",
        { className: "hero-copy" },
        h("h1", { style: { color: "#fff", background: "#12797c", padding: "24px", borderRadius: "12px" } }, text(d, "title")),
        h("p", { className: "hero-lead" }, text(d, "lead"))
      )
    );
  });

  CMS.registerPreviewTemplate("histoire", function (props) {
    var d = props.entry.get("data");
    var photo = text(d, "photo");
    return wrap(
      h(
        "div",
        { className: "split-copy" },
        photo ? h("img", { src: photo, style: { maxWidth: "220px", borderRadius: "16px", marginBottom: "16px", display: "block" } }) : null,
        h("div", { dangerouslySetInnerHTML: { __html: text(d, "text1") } }),
        h("p", null, text(d, "text2"))
      )
    );
  });

  CMS.registerPreviewTemplate("destinations", function (props) {
    var items = props.entry.getIn(["data", "items"]);
    if (!items || !items.size) return wrap(h("p", null, "Ajoutez une destination pour voir l'aperçu."));
    return wrap(
      h(
        "div",
        { className: "card-grid", style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "18px" } },
        items
          .map(function (item, i) {
            var photo = text(item, "photo");
            var tag = text(item, "tag");
            return h(
              "article",
              { className: "card", key: i },
              h(
                "div",
                { className: "card-media", style: { position: "relative", aspectRatio: "4/3", background: "#12797c" } },
                photo ? h("img", { src: photo, style: { width: "100%", height: "100%", objectFit: "cover" } }) : null,
                tag ? h("span", { className: "card-tag" }, tag) : null
              ),
              h(
                "div",
                { className: "card-body" },
                h("h3", null, text(item, "title")),
                h("p", { className: "card-meta" }, text(item, "meta")),
                h("p", null, text(item, "desc")),
                h("div", { className: "card-footer" }, h("span", { className: "price" }, text(item, "price")))
              )
            );
          })
          .toArray()
      )
    );
  });

  CMS.registerPreviewTemplate("gallery", function (props) {
    var items = props.entry.getIn(["data", "items"]);
    if (!items || !items.size) return wrap(h("p", null, "Ajoutez une photo pour voir l'aperçu."));
    return wrap(
      h(
        "div",
        { className: "gallery-grid", style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" } },
        items
          .map(function (entry, i) {
            var photo = text(entry, "photo");
            return h(
              "div",
              { className: "gallery-item", key: i, style: { aspectRatio: "1/1", background: "#12797c" } },
              photo ? h("img", { src: photo, style: { width: "100%", height: "100%", objectFit: "cover" } }) : null
            );
          })
          .toArray()
      )
    );
  });

  CMS.registerPreviewTemplate("faq", function (props) {
    var items = props.entry.getIn(["data", "items"]);
    if (!items || !items.size) return wrap(h("p", null, "Ajoutez une question pour voir l'aperçu."));
    return wrap(
      h(
        "div",
        { className: "faq-list" },
        items
          .map(function (entry, i) {
            return h(
              "details",
              { className: "faq-item", key: i, open: i === 0 },
              h("summary", null, text(entry, "q")),
              h("p", null, text(entry, "a"))
            );
          })
          .toArray()
      )
    );
  });

  CMS.registerPreviewTemplate("misc", function (props) {
    var d = props.entry.get("data");
    return wrap(
      h(
        "div",
        null,
        h("div", { className: "profile-banner" }, h("p", null, text(d, "profil_pecheur_text"))),
        h(
          "div",
          { className: "testimonial-placeholder", style: { marginTop: "24px" } },
          h("p", null, text(d, "testimonial_title")),
          h("span", null, text(d, "testimonial_note"))
        )
      )
    );
  });
})();
