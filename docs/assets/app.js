const status = document.getElementById("load-status");
const cardGrid = document.getElementById("card-grid");

function createLinkItem(link) {
    const anchor = document.createElement("a");
    anchor.className = "link-item";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.setAttribute("aria-hidden", "true");

    const iconGlyph = document.createElement("i");
    iconGlyph.className = `${typeof link.icon === "string" && link.icon.trim() ? link.icon.trim() : "fa-solid fa-link"} fa-fw`;
    icon.appendChild(iconGlyph);

    const copy = document.createElement("span");
    copy.className = "link-copy";

    const title = document.createElement("span");
    title.className = "link-title";
    title.textContent = link.title;

    const meta = document.createElement("span");
    meta.className = "link-meta";
    meta.textContent = link.description;

    copy.append(title, meta);
    anchor.append(icon, copy);
    return anchor;
}

function createCard(section) {
    const article = document.createElement("article");
    article.className = "card";

    if (typeof section.title === "string" && section.title.toLowerCase().includes("game")) {
        article.classList.add("games-card");
    }

    const heading = document.createElement("h2");
    heading.textContent = section.title;

    const description = document.createElement("p");
    description.textContent = section.description;

    const list = document.createElement("div");
    list.className = "link-list";

    section.links.forEach((link) => {
        list.appendChild(createLinkItem(link));
    });

    article.append(heading, description, list);
    return article;
}

async function loadLinks() {
    try {
        const response = await fetch("./links.json", { cache: "no-store" });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const sections = Array.isArray(data.sections) ? data.sections : [];
        const featuredVideo = data.featuredVideo && typeof data.featuredVideo === "object" ? data.featuredVideo : null;

        if (!sections.length) {
            throw new Error("No sections found");
        }

        const fragment = document.createDocumentFragment();
        sections.forEach((section) => {
            fragment.appendChild(createCard(section));
        });

        cardGrid.replaceChildren(fragment);
        cardGrid.hidden = false;
        renderFeaturedVideo(featuredVideo);
        status.hidden = true;
    } catch (error) {
        status.innerHTML = "<strong>Could not load links.</strong> Please let Leigerpatch know in the <a href='https://discord.gg/EmhSRUxP8Z' target='_blank'>Monsterpatch Discord server</a>.";
        console.error(error);
    }
}

loadLinks();
