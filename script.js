/* Nonpareil Barbershop — interactions */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var sheet = document.getElementById("sheet");

  /* sticky nav state */
  var onScroll = function () {
    if (window.scrollY > 40) nav.classList.add("nav--solid");
    else nav.classList.remove("nav--solid");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* mobile sheet */
  var closeSheet = function () {
    sheet.classList.remove("is-open");
    nav.classList.remove("nav--open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  burger.addEventListener("click", function () {
    var open = sheet.classList.toggle("is-open");
    nav.classList.toggle("nav--open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  });
  sheet.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeSheet);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSheet();
  });

  /* scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var siblings = Array.prototype.slice.call(
            el.parentElement ? el.parentElement.children : []
          );
          var i = Math.min(siblings.indexOf(el), 6);
          el.style.transitionDelay = (i > 0 ? i * 65 : 0) + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* cursor glow */
  var glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(hover: hover)").matches) {
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    var tx = gx, ty = gy;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });
    (function loop() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
      requestAnimationFrame(loop);
    })();
  }

  /* subtle parallax on hero art */
  var art = document.querySelector(".hero__frame img");
  if (art && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      var y = Math.min(window.scrollY, 700);
      art.style.transform = "scale(1.02) translateY(" + y * 0.05 + "px)";
    }, { passive: true });
  }

  /* year */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
