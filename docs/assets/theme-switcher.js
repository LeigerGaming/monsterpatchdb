const THEME_ICONS = { light: "fa-sun", dark: "fa-moon" };
const THEME_LABELS = { light: "Theme: Light", dark: "Theme: Dark" };

const toggle = document.getElementById("theme-toggle");
const toggleIcon = toggle.querySelector("i");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function getStoredMode() {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : null;
}

function getEffectiveMode() {
    return getStoredMode() || (prefersDark.matches ? "dark" : "light");
}

function updateIcon(mode) {
    toggleIcon.className = `fa-solid ${THEME_ICONS[mode]}`;
    toggle.setAttribute("aria-label", `${THEME_LABELS[mode]} (click to switch)`);
}

toggle.addEventListener("click", () => {
    const nextMode = getEffectiveMode() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextMode);
    localStorage.setItem("theme", nextMode);
    updateIcon(nextMode);
});

prefersDark.addEventListener("change", () => {
    if (!getStoredMode()) {
        updateIcon(getEffectiveMode());
    }
});

updateIcon(getEffectiveMode());
