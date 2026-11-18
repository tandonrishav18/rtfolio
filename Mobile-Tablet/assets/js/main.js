/**
 * EcoFolio — Minimal Accessible Navigation Controller
 * Essential vanilla JS only: handles mobile menu disclosure & keyboard support.
 */
(function () {
  // Always start from scratch at top on reload / refresh / BFCache restore
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function resetScrollToTop() {
    window.scrollTo(0, 0);
  }

  resetScrollToTop();
  window.addEventListener("pageshow", function (event) {
    resetScrollToTop();
    if (event.persisted) {
      var pInput = document.getElementById("hero-note-input");
      var pField = document.querySelector(".prompt-field");
      var pPrefix = document.querySelector(".prompt-prefix");
      if (pInput) pInput.value = "";
      if (pField) pField.setAttribute("data-value", "");
      if (pPrefix && !mq.matches && !reducedMotion) {
        prefixDone = false;
        startTypewriter();
      }
    }
  });
  window.addEventListener("beforeunload", resetScrollToTop);
  window.addEventListener("load", resetScrollToTop);

  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("primary-nav");

  if (!toggle || !nav) return;

  var mq = window.matchMedia("(min-width: 810px)");

  function setMenuState(isOpen) {
    var open = !mq.matches && isOpen;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
    if (open) {
      nav.setAttribute("data-open", "true");
    } else {
      nav.removeAttribute("data-open");
    }
  }

  var resumeLink = document.querySelector(".btn-resume");
  function syncResumeLink() {
    if (!resumeLink) return;
    if (mq.matches) {
      resumeLink.setAttribute("target", "_blank");
      resumeLink.setAttribute("rel", "noopener noreferrer");
    } else {
      resumeLink.removeAttribute("target");
      resumeLink.removeAttribute("rel");
    }
  }

  setMenuState(false);
  syncResumeLink();

  toggle.addEventListener("click", function () {
    var expanded = toggle.getAttribute("aria-expanded") === "true";
    setMenuState(!expanded);
  });

  nav.addEventListener("click", function (event) {
    if (event.target.closest("a") && !mq.matches) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenuState(false);
      toggle.focus();
    }
  });

  mq.addEventListener("change", function () {
    setMenuState(false);
    syncResumeLink();
  });

  var promptField = document.querySelector(".prompt-field");
  var promptInput = document.getElementById("hero-note-input");
  if (promptInput) promptInput.value = "";
  if (promptField) promptField.setAttribute("data-value", "");
  var promptLabel = document.querySelector(".hero-prompt");
  var promptPrefix = document.querySelector(".prompt-prefix");
  var promptCaret = document.querySelector(".prompt-caret");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targetPrefix = "hello.....";
  var typeTimer = null;

  var isTypingActive = false;
  var prefixDone = false;

  function finishPrefix() {
    prefixDone = true;
    isTypingActive = false;
    if (typeTimer) {
      clearTimeout(typeTimer);
      typeTimer = null;
    }
    if (promptPrefix) promptPrefix.textContent = targetPrefix;
    if (promptLabel) promptLabel.classList.add("is-typing");
  }

  function startTypewriter() {
    if (prefixDone || !promptPrefix || mq.matches || reducedMotion) {
      finishPrefix();
      return;
    }
    var charIdx = 0;
    promptPrefix.textContent = "";
    if (promptLabel) promptLabel.classList.add("is-typing");

    function typeNext() {
      if (prefixDone) return;
      if (charIdx < targetPrefix.length) {
        isTypingActive = true;
        charIdx += 1;
        promptPrefix.textContent = targetPrefix.slice(0, charIdx);
        if (promptCaret) promptCaret.classList.remove("is-caret-off");
        var ch = targetPrefix.charAt(charIdx - 1);
        var delay = ch === "." ? 230 : 170;
        typeTimer = setTimeout(typeNext, delay);
      } else {
        prefixDone = true;
        isTypingActive = false;
        typeTimer = null;
      }
    }

    typeTimer = setTimeout(typeNext, 420);
  }

  if (promptPrefix && !mq.matches && !reducedMotion) {
    promptPrefix.textContent = "";
    if (promptLabel) promptLabel.classList.add("is-typing");
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(startTypewriter);
    } else {
      startTypewriter();
    }
  } else {
    finishPrefix();
  }

  if (promptCaret && !reducedMotion) {
    setInterval(function () {
      if (mq.matches || isTypingActive || (promptLabel && promptLabel.classList.contains("is-focused"))) return;
      promptCaret.classList.toggle("is-caret-off");
    }, 530);
  }

  if (promptField && promptInput) {
    promptInput.addEventListener("input", function () {
      if (promptInput.value.length > 20) {
        promptInput.value = promptInput.value.slice(0, 20);
      }
      promptField.setAttribute("data-value", promptInput.value);
    });

    promptInput.addEventListener("focus", function () {
      finishPrefix();
      if (promptCaret) promptCaret.classList.remove("is-caret-off");
      if (promptLabel) promptLabel.classList.add("is-focused");
    });

    promptInput.addEventListener("blur", function () {
      if (promptCaret) promptCaret.classList.remove("is-caret-off");
      if (promptLabel) promptLabel.classList.remove("is-focused");
    });

    promptInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        promptInput.blur();
      }
    });
  }
})();
