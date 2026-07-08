function initFeaturedVideo() {
    const featuredVideoSlot = document.getElementById("featured-video-slot");
    const mobileFeaturedQuery = window.matchMedia("(max-width: 480px)");
    const videoModal = document.getElementById("video-modal");
    const videoModalIframe = document.getElementById("video-modal-iframe");

    function openVideoModal(youtubeId) {
        videoModalIframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
        videoModal.hidden = false;
    }

    function closeVideoModal() {
        videoModal.hidden = true;
        videoModalIframe.src = "";
    }

    document.getElementById("video-modal-close").addEventListener("click", closeVideoModal);
    videoModal.querySelector(".video-modal-backdrop").addEventListener("click", closeVideoModal);
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !videoModal.hidden) {
            closeVideoModal();
        }
    });

    function createFeaturedVideo(video) {
        const youtubeId = typeof video.youtubeId === "string" ? video.youtubeId.trim() : "";

        const card = document.createElement("button");
        card.type = "button";
        card.className = "featured-video";
        card.addEventListener("click", () => {
            if (youtubeId) {
                openVideoModal(youtubeId);
            } else {
                window.open(video.url, "_blank", "noopener,noreferrer");
            }
        });

        if (youtubeId) {
            const thumb = document.createElement("div");
            thumb.className = "featured-video-thumb";

            const img = document.createElement("img");
            img.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
            img.alt = video.title;
            img.loading = "lazy";
            img.decoding = "async";

            thumb.appendChild(img);
            card.appendChild(thumb);
        }

        const badge = document.createElement("span");
        badge.className = "featured-video-badge";
        badge.textContent = "Featured Video";

        const badgeRow = document.createElement("div");
        badgeRow.className = "featured-video-badge-row";

        const channel = document.createElement("span");
        channel.className = "featured-video-channel";
        channel.textContent = typeof video.channel === "string" && video.channel.trim() ? video.channel.trim() : "";

        const mobileDate = document.createElement("span");
        mobileDate.className = "featured-video-date";
        mobileDate.textContent = typeof video.date === "string" && video.date.trim() ? ` · ${video.date.trim()}` : "";

        const head = document.createElement("div");
        head.className = "featured-video-head";

        const icon = document.createElement("span");
        icon.className = "icon";
        icon.setAttribute("aria-hidden", "true");

        const iconGlyph = document.createElement("i");
        iconGlyph.className = "fa-brands fa-youtube fa-fw";
        icon.appendChild(iconGlyph);

        const copy = document.createElement("span");
        copy.className = "featured-video-copy";

        const title = document.createElement("span");
        title.className = "featured-video-title";
        title.textContent = video.title;

        const meta = document.createElement("span");
        meta.className = "featured-video-meta";
        meta.textContent = [video.channel, video.date].filter(Boolean).join(" · ");

        copy.append(title, meta);
        head.append(icon, copy);

        badgeRow.append(badge, channel, mobileDate);

        card.append(badgeRow, head);
        return card;
    }

    function createFeaturedVideoToggle() {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "featured-video-toggle";

        const label = document.createElement("span");
        label.className = "featured-video-toggle-label";
        label.textContent = "Featured Video";

        button.append(label);

        button.addEventListener("click", () => {
            const expanded = featuredVideoSlot.getAttribute("data-expanded") === "true";
            featuredVideoSlot.setAttribute("data-expanded", expanded ? "false" : "true");
            button.setAttribute("aria-expanded", expanded ? "false" : "true");
        });

        return button;
    }

    return function renderFeaturedVideo(featuredVideo) {
        if (!featuredVideo || typeof featuredVideo.url !== "string" || !featuredVideo.url.trim()) {
            featuredVideoSlot.hidden = true;
            return;
        }

        const featuredCard = createFeaturedVideo(featuredVideo);
        featuredCard.classList.add("featured-video-card");
        featuredVideoSlot.replaceChildren(createFeaturedVideoToggle(), featuredCard);
        featuredVideoSlot.hidden = false;

        const shouldCollapse = mobileFeaturedQuery.matches;
        featuredVideoSlot.setAttribute("data-expanded", shouldCollapse ? "false" : "true");
        const toggle = featuredVideoSlot.querySelector(".featured-video-toggle");
        if (toggle) {
            toggle.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");
        }
    };
}

window.renderFeaturedVideo = initFeaturedVideo();
