/* Nonpareil — booking form (front-end only, no backend) */
(function () {
  "use strict";

  var form = document.getElementById("bookForm");
  if (!form) return;

  var dateEl = document.getElementById("bdate");
  var slotsEl = document.getElementById("slots");
  var notice = document.getElementById("notice");
  var sumService = document.getElementById("sumService");
  var sumBarber = document.getElementById("sumBarber");
  var sumDate = document.getElementById("sumDate");
  var sumTime = document.getElementById("sumTime");
  var sumPrice = document.getElementById("sumPrice");

  var selectedTime = "";

  /* ---- date: default to today (or next open day), no past dates ---- */
  function iso(d) {
    var t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return t.toISOString().slice(0, 10);
  }
  function nextOpenDay(start) {
    var d = new Date(start);
    while (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return d;
  }
  var today = new Date();
  dateEl.min = iso(today);
  dateEl.value = iso(nextOpenDay(today));

  function prettyDate(v) {
    if (!v) return "—";
    var parts = v.split("-");
    var d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric"
    });
  }

  /* ---- time slots ---- */
  function buildSlots() {
    var v = dateEl.value;
    var parts = v ? v.split("-") : null;
    var isSat = parts ? new Date(parts[0], parts[1] - 1, parts[2]).getDay() === 6 : false;
    var isSun = parts ? new Date(parts[0], parts[1] - 1, parts[2]).getDay() === 0 : false;

    slotsEl.innerHTML = "";
    selectedTime = "";
    sumTime.textContent = "—";

    if (isSun) {
      var p = document.createElement("p");
      p.className = "hint";
      p.style.gridColumn = "1 / -1";
      p.textContent = "We’re closed on Sundays — pick another day and times will appear.";
      slotsEl.appendChild(p);
      return;
    }

    var start = isSat ? 8 : 9;
    var end = 16.5;
    for (var t = start; t <= end; t += 0.5) {
      var h = Math.floor(t);
      var m = t % 1 === 0 ? "00" : "30";
      var label = ((h + 11) % 12) + 1 + ":" + m + (h < 12 ? " AM" : " PM");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot";
      btn.textContent = label;
      btn.addEventListener("click", function () {
        slotsEl.querySelectorAll(".slot").forEach(function (s) { s.classList.remove("is-on"); });
        this.classList.add("is-on");
        selectedTime = this.textContent;
        sumTime.textContent = selectedTime;
      });
      slotsEl.appendChild(btn);
    }
  }
  buildSlots();
  dateEl.addEventListener("change", function () {
    buildSlots();
    sumDate.textContent = prettyDate(dateEl.value);
  });
  sumDate.textContent = prettyDate(dateEl.value);

  /* ---- live summary ---- */
  function updateService() {
    var checked = form.querySelector('input[name="service"]:checked');
    if (!checked) return;
    sumService.textContent = checked.value;
    var price = checked.getAttribute("data-price");
    sumPrice.textContent = price ? "$" + price : "Ask";
  }
  function updateBarber() {
    var checked = form.querySelector('input[name="barber"]:checked');
    if (checked) sumBarber.textContent = checked.value;
  }
  form.querySelectorAll('input[name="service"]').forEach(function (r) {
    r.addEventListener("change", updateService);
  });
  form.querySelectorAll('input[name="barber"]').forEach(function (r) {
    r.addEventListener("change", updateBarber);
  });
  updateService();
  updateBarber();

  /* ---- submit: preview only ---- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nameEl = document.getElementById("bname");
    var name = nameEl && nameEl.value.trim() ? nameEl.value.trim().split(" ")[0] : "";
    var price = sumPrice.textContent;

    var msg = "Thanks" + (name ? ", " + name : "") + " — this booking page is a preview, so nothing was sent. ";
    if (selectedTime) {
      msg += "You picked <b>" + sumService.textContent + "</b> with <b>" + sumBarber.textContent +
        "</b> on <b>" + sumDate.textContent + "</b> at <b>" + selectedTime + "</b>" +
        (price !== "Ask" ? " (" + price + ")" : "") +
        ". Call <b>(254) 577-5515</b> to lock that time in, or use the live booking system above.";
    } else {
      msg += "Pick a time above, then call <b>(254) 577-5515</b> to lock it in.";
    }

    notice.innerHTML = msg;
    notice.classList.add("is-on");
    notice.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
