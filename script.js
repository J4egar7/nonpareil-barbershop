/* Nonpareil Barbershop — interactions (shared by all pages) */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var sheet = document.getElementById("sheet");

  /* sticky nav */
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("nav--solid", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* mobile sheet */
  if (burger && sheet) {
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
  }

  /* scroll reveal */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var sibs = Array.prototype.slice.call(el.parentElement ? el.parentElement.children : []);
          var i = Math.min(sibs.indexOf(el), 6);
          el.style.transitionDelay = (i > 0 ? i * 65 : 0) + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* cursor glow */
  var glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(hover: hover)").matches) {
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy;
    window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
      requestAnimationFrame(loop);
    })();
  }

  /* simple parallax on the home hero image */
  var art = document.querySelector(".hero__frame img");
  if (art && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("scroll", function () {
      var y = Math.min(window.scrollY, 700);
      art.style.transform = "scale(1.02) translateY(" + y * 0.05 + "px)";
    }, { passive: true });
  }

  /* ── lightbox ── */
  var lb = document.getElementById("lightbox");
  if (lb) {
    var lbImg = lb.querySelector("img");
    var closeBtn = lb.querySelector(".lightbox__close");
    var close = function () {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
    };
    document.querySelectorAll("[data-lightbox]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var inner = a.querySelector("img");
        lbImg.src = a.getAttribute("href");
        lbImg.alt = inner ? inner.alt : "";
        lb.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
