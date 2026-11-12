// Bozza v2: porte che si aprono e respiro guidato. Nessun dato raccolto, nessun cookie.
document.documentElement.classList.add("js");

// Porte: una aperta alla volta, il percorso compare sotto
var porte = document.querySelectorAll(".porta");
porte.forEach(function (porta) {
  porta.addEventListener("click", function () {
    var giaAperta = porta.getAttribute("aria-expanded") === "true";
    porte.forEach(function (p) {
      p.setAttribute("aria-expanded", "false");
      document.getElementById(p.getAttribute("aria-controls")).classList.remove("aperto");
    });
    if (!giaAperta) {
      porta.setAttribute("aria-expanded", "true");
      var pannello = document.getElementById(porta.getAttribute("aria-controls"));
      pannello.classList.add("aperto");
      setTimeout(function () { pannello.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 350);
    }
  });
});

// Respiro: 4 secondi dentro, 6 fuori, per un minuto
var avvio = document.getElementById("respira-avvio");
var cerchio = document.getElementById("cerchio");
if (avvio && cerchio) {
  var timer = null, fine = null;
  function fase(dentro) {
    cerchio.style.transitionDuration = dentro ? "4s" : "6s";
    cerchio.classList.toggle("dentro-aria", dentro);
    cerchio.textContent = dentro ? "inspira" : "espira";
    timer = setTimeout(function () { fase(!dentro); }, dentro ? 4000 : 6000);
  }
  function ferma() {
    clearTimeout(timer); clearTimeout(fine); timer = null;
    cerchio.classList.remove("dentro-aria");
    cerchio.textContent = "quando vuoi";
    avvio.textContent = "Respira con me per un minuto";
  }
  avvio.addEventListener("click", function () {
    if (timer) { ferma(); return; }
    avvio.textContent = "Ferma";
    fase(true);
    fine = setTimeout(ferma, 60000);
  });
}

// Comparsa degli elementi allo scorrere. I gruppi con classe "scaglia" entrano uno dopo l'altro.
document.querySelectorAll(".scaglia").forEach(function (gruppo) {
  Array.prototype.forEach.call(gruppo.children, function (figlio, i) {
    if (!figlio.hasAttribute("data-anim")) figlio.setAttribute("data-anim", "");
    figlio.style.transitionDelay = (i * 140) + "ms";
  });
});
var animati = document.querySelectorAll("[data-anim]");
if ("IntersectionObserver" in window) {
  var oss = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) {
      if (v.isIntersecting) { v.target.classList.add("visto"); oss.unobserve(v.target); }
    });
  }, { threshold: 0.1 });
  animati.forEach(function (el) { oss.observe(el); });
} else {
  animati.forEach(function (el) { el.classList.add("visto"); });
}

// Rete di sicurezza: dopo 2,5 secondi mostra comunque cio' che e' gia' nello schermo
setTimeout(function () {
  animati.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("visto");
  });
}, 2500);
