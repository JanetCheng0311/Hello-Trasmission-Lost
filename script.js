/* ============================================================
   TRANSMISSION LOST — site behavior
   Vanilla JS, no dependencies. Honors prefers-reduced-motion.
   ============================================================ */

/* ---- ONE place to set your real links. Change these two values. ---- */
const ITCH_URL = "https://itch.io/";   // TODO: your itch.io demo page, e.g. https://yourname.itch.io/transmission-lost
const SOCIAL = {
  discord: "#",                        // TODO: invite link or "" to hide
  "x / twitter": "#",                  // TODO
  "press kit": "#",                    // TODO
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Wire every data-itch element to the itch URL in one shot. */
document.querySelectorAll("[data-itch]").forEach((el) => {
  el.href = ITCH_URL;
  el.target = "_blank";
  el.rel = "noopener";
});
document.querySelectorAll("[data-social]").forEach((el) => {
  const url = SOCIAL[el.textContent.trim()];
  if (url && url !== "#") { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
});

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
const BOOT_LINES = [
  "TRANSMISSION LOST // bootloader v0.41",
  "POST .......................... OK",
  "memory check ................. 64K OK",
  "mounting /dev/signal ......... OK",
  "decrypting recovered log ..... FAILED",
  "  > integrity 41% :: proceeding anyway",
  "establishing uplink .......... [ CONNECTED ]",
  "",
  "incoming transmission detected_",
];

const boot = document.getElementById("boot");
const bootLog = document.getElementById("bootLog");
const bootSkip = document.getElementById("bootSkip");

function dismissBoot() {
  boot.classList.add("boot--done");
  window.removeEventListener("keydown", dismissBoot);
  boot.removeEventListener("click", dismissBoot);
}

function runBoot() {
  if (reduceMotion) {
    bootLog.textContent = BOOT_LINES.join("\n");
    bootSkip.style.opacity = "1";
    window.addEventListener("keydown", dismissBoot, { once: true });
    boot.addEventListener("click", dismissBoot, { once: true });
    // auto-dismiss after a moment so reduced-motion users are not stuck
    setTimeout(dismissBoot, 1400);
    return;
  }

  let i = 0;
  function typeLine() {
    if (i >= BOOT_LINES.length) {
      bootSkip.style.opacity = "1";
      window.addEventListener("keydown", dismissBoot, { once: true });
      boot.addEventListener("click", dismissBoot, { once: true });
      setTimeout(dismissBoot, 1100);  // auto-continue if the visitor does nothing
      return;
    }
    bootLog.textContent += BOOT_LINES[i] + "\n";
    i++;
    setTimeout(typeLine, 130 + Math.floor(i % 3) * 90);
  }
  typeLine();
}
runBoot();

/* ============================================================
   TYPEABLE CONSOLE
   ============================================================ */
const form = document.getElementById("consoleForm");
const input = document.getElementById("consoleInput");
const out = document.getElementById("consoleOutput");

function print(text, cls = "") {
  const div = document.createElement("div");
  div.className = "line " + cls;
  div.textContent = text;
  out.appendChild(div);
}

const COMMANDS = {
  help() {
    print("available commands:", "muted");
    print("  play      open the demo on itch.io");
    print("  story     read the recovered transmission");
    print("  features  what is inside the game");
    print("  stills    view screenshots");
    print("  whoami    ?");
    print("  clear     wipe this terminal");
  },
  play() {
    print("opening uplink to itch.io ...", "muted");
    window.open(ITCH_URL, "_blank", "noopener");
  },
  story()    { print("routing to recovered log ...", "muted"); scrollToId("signal"); },
  features() { print("listing features.txt ...", "muted"); scrollToId("features"); },
  stills()   { print("loading /stills ...", "muted"); scrollToId("gallery"); },
  whoami()   { print("you are the one who answered. the line remembers you.", "err"); },
  clear()    { out.innerHTML = ""; },
  ls()       { print("signal/  features.txt  stills/  README"); },
};

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = input.value.trim();
  input.value = "";
  if (!raw) return;
  print("guest@transmission:~$ " + raw, "echo");
  const cmd = raw.toLowerCase().split(/\s+/)[0];
  if (COMMANDS[cmd]) {
    COMMANDS[cmd]();
  } else {
    print(`command not found: ${cmd}. type 'help'.`, "err");
  }
  out.scrollTop = out.scrollHeight;
});

/* keep focus feel: clicking anywhere in the window focuses input */
document.getElementById("consoleWindow").addEventListener("click", () => input.focus());

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".shot img").forEach((img) => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("lightbox--open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});
function closeLightbox() {
  lightbox.classList.remove("lightbox--open");
  lightbox.setAttribute("aria-hidden", "true");
}
lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
