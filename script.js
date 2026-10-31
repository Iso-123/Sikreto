const glow = document.querySelector(".background-glow");
const card = document.querySelector(".profile-card");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let glowX = mouseX;
let glowY = mouseY;

let currentX = 0;
let currentY = 0;

const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (glow && card && !reduceMotion) {

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    function animateGlow() {

        glowX += (mouseX - glowX) * 0.05;
        glowY += (mouseY - glowY) * 0.05;

        glow.style.left = glowX + "px";
        glow.style.top = glowY + "px";

        // Subtle mouse-following card tilt
        const rect = card.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const targetX = (mouseY - centerY) * -0.008;
        const targetY = (mouseX - centerX) * 0.008;

        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        card.style.rotate =
            `${currentX}deg ${currentY}deg`;

        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

// ===== CUSTOM MUSIC PLAYER =====

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const volumeSlider = document.getElementById("volumeSlider");

const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");

// CUSTOMIZE YOUR SONG HERE
const musicSettings = {
    title: "Ako ang bagyo",
    artist: "Shean",
    volume: 50
};

// Apply song information
songTitle.textContent = musicSettings.title;
songArtist.textContent = musicSettings.artist;

music.volume = musicSettings.volume / 100;
volumeSlider.value = musicSettings.volume;

// Play / Pause
musicButton.addEventListener("click", async () => {
    if (music.paused) {
        try {
            await music.play();
        } catch (error) {
            console.error("Music playback failed:", error);
            alert("Hindi ma-play ang music. Check music.mp3.");
        }
    } else {
        music.pause();
    }
});

// Update button automatically
function updateMusicButton() {
    if (music.paused) {
        musicButton.innerHTML = '<i class="fas fa-play"></i>';
        musicButton.setAttribute("aria-label", "Play music");
    } else {
        musicButton.innerHTML = '<i class="fas fa-pause"></i>';
        musicButton.setAttribute("aria-label", "Pause music");
    }
}

music.addEventListener("play", updateMusicButton);
music.addEventListener("pause", updateMusicButton);
music.addEventListener("ended", updateMusicButton);

// Volume control
volumeSlider.addEventListener("input", () => {
    music.volume = Number(volumeSlider.value) / 100;
});

/* ===== MUSIC PROGRESS & DURATION ===== */

const progressBar = document.getElementById("progressBar");
const currentTimeText = document.getElementById("currentTime");
const durationText = document.getElementById("duration");
const player = document.querySelector(".music-player");

// Format seconds into minutes:seconds
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${String(secs).padStart(2, "0")}`;
}

// Show total duration
music.addEventListener("loadedmetadata", () => {
    if (Number.isFinite(music.duration)) {
        durationText.textContent = formatTime(music.duration);
    }
});

// Update progress while playing
music.addEventListener("timeupdate", () => {
    currentTimeText.textContent = formatTime(music.currentTime);

    if (Number.isFinite(music.duration) && music.duration > 0) {
        progressBar.value =
            (music.currentTime / music.duration) * 100;
    }
});

// Seek to another part of the song
progressBar.addEventListener("input", () => {
    if (Number.isFinite(music.duration) && music.duration > 0) {
        music.currentTime =
            (Number(progressBar.value) / 100) * music.duration;
    }
});

// Album cover glow when playing
music.addEventListener("play", () => {
    player.classList.add("playing");
});

music.addEventListener("pause", () => {
    player.classList.remove("playing");
});
