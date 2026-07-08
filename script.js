/* ============================================================
   HELLO? TRANSMISSION LOST — site behavior
   Vanilla JS, no dependencies. Honors prefers-reduced-motion.
   ============================================================ */

/* ---- ONE place to set your real links. Edit these values. ---- */
const DOWNLOAD_URL = "https://hellotransimissionlost.itch.io/hellotransmissionlost"; // PC demo (MEGA)
const SOCIAL = {
  threads: "https://www.threads.com/@looooop_hk",
  xhs:     "https://www.xiaohongshu.com/user/profile/6565c6e2000000001103ea43",
  youtube: "https://www.youtube.com/@JCYTprj",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Wire every download button + social link from the config above. */
document.querySelectorAll("[data-download]").forEach((el) => {
  el.href = DOWNLOAD_URL; el.target = "_blank"; el.rel = "noopener";
});
document.querySelectorAll("[data-social]").forEach((el) => {
  const url = SOCIAL[el.getAttribute("data-social")];
  if (url) { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
});

/* ============================================================
   MOBILE MENU DRAWER (works on every page)
   ============================================================ */
const menuBtn = document.getElementById("navMenuBtn");
const navDrawer = document.getElementById("navDrawer");
if (menuBtn && navDrawer) {
  const setMenu = (open) => {
    navDrawer.classList.toggle("drawer--open", open);
    navDrawer.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
  };
  menuBtn.addEventListener("click", () => setMenu(!navDrawer.classList.contains("drawer--open")));
  navDrawer.addEventListener("click", (e) => {
    if (e.target === navDrawer || e.target.closest("a") || e.target.closest(".drawer__close")) setMenu(false);
  });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
}

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
const BOOT_LINES = [
  "PROJECT CHRONICLE // bootloader v0.41  (est. 197X)",
  "POST .......................... OK",
  "memory check ................. 64K OK",
  "mounting /dev/surveillance ... OK",
  "reactivating prediction core . [ ONLINE ]",
  "decrypting recovered log ..... FAILED",
  "  > integrity 41% :: proceeding anyway",
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

function armDismiss() {
  bootSkip.style.opacity = "1";
  window.addEventListener("keydown", dismissBoot, { once: true });
  boot.addEventListener("click", dismissBoot, { once: true });
}

function runBoot() {
  if (reduceMotion) {
    bootLog.textContent = BOOT_LINES.join("\n");
    armDismiss();
    setTimeout(dismissBoot, 1400);
    return;
  }
  let i = 0;
  (function typeLine() {
    if (i >= BOOT_LINES.length) { armDismiss(); setTimeout(dismissBoot, 1100); return; }
    bootLog.textContent += BOOT_LINES[i] + "\n";
    i++;
    setTimeout(typeLine, 130 + Math.floor(i % 3) * 90);
  })();
}
if (boot && bootLog && bootSkip) runBoot();

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
function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

const COMMANDS = {
  help() {
    print("available commands:", "muted");
    print("  download   get the PC demo");
    print("  watch      play the gameplay video");
    print("  story      read the recovered log");
    print("  features   what is inside the game");
    print("  stills     view screenshots");
    print("  crew       who made this");
    print("  whoami     ?");
    print("  clear      wipe this terminal");
  },
  download() { print("opening download (MEGA) ...", "muted"); window.open(DOWNLOAD_URL, "_blank", "noopener"); },
  play()     { this.download(); },
  watch()    { print("loading footage ...", "muted"); scrollToId("watch"); },
  story()    { print("routing to recovered log ...", "muted"); scrollToId("signal"); },
  features() { print("listing features.txt ...", "muted"); scrollToId("features"); },
  stills()   { print("loading /stills ...", "muted"); scrollToId("gallery"); },
  crew()     {
    print("team Looooop:", "muted");
    print("  Cheng Yu Tung (Janet), Xu Huicong, Zhou Yunxin, Huang Zijuan, Zhou Jingyi");
    print("  supervisors: Hossein Najafi, Rhys Jones", "muted");
  },
  whoami()   { print("you are the one who answered. the system was already expecting you.", "err"); },
  clear()    { out.innerHTML = ""; },
  ls()       { print("signal/  features.txt  footage/  stills/  crew  README"); },
};

if (form && input && out) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;
    print("guest@chronicle:~$ " + raw, "echo");
    const cmd = raw.toLowerCase().split(/\s+/)[0];
    if (COMMANDS[cmd]) COMMANDS[cmd]();
    else print(`command not found: ${cmd}. type 'help'.`, "err");
    out.scrollTop = out.scrollHeight;
  });
  document.getElementById("consoleWindow").addEventListener("click", () => input.focus());
}

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

if (lightbox && lightboxImg && lightboxClose) {
  document.querySelectorAll(".shot img").forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add("lightbox--open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove("lightbox--open");
    lightbox.setAttribute("aria-hidden", "true");
  };
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
}
