// =============================================
// GAMESTEC - SCRIPT PRINCIPAL
// =============================================

/**
 * CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
 */
const Config = {
    splashDuration: 3000,
    fadeDuration: 500,
    defaultVolume: 0.7
};

// Elementos DOM - CORREGIDO
const elements = {
    splash: document.getElementById('splash'),
    enterBtn: document.getElementById('enter-btn'),
    mainContent: document.getElementById('main-content'),
    audio: document.getElementById('audio-player'), // ← CORREGIDO: audio-player, no audio
    songTitle: document.getElementById('song-title'),
    cover: document.querySelector('.music-player .cover') // ← CORREGIDO
};

// Lista de canciones - CORREGIDA (usa solo UN array)
const songs = [
    { 
        title: "Take it easy", 
        src: "music/Take it easy background-1.mpt", 
        cover: "img/covers/FASSOUNDS-Cover.jpg",
        background: {
            type: "video",
            src: "img/backgrounds/anime-girl-watching-falling-stars-city-moewalls-com.mpv"
        }
    },
    { 
        title: "Lo-Fi Background Beats", 
        src: "music/Lo-Fi Background Music - 2.mpt", 
        cover: "img/covers/Lo-fi Background-2.jpg",
        background: {
            type: "video", 
            src: "img/backgrounds/child-watching-the-stars-moewalls-com.mpv"
        }
    },
    { 
        title: "Maybe it was Love", 
        src: "music/Maybe it was love.mpt", 
        cover: "img/covers/Lo-Fi Nostalgic - 3.jpg",
        background: {
            type: "video",
            src: "img/backgrounds/maybe-love-bg.mpv"
        }
    },
    { 
        title: "Japan Lo-fi", 
        src: "music/Cutie Japan Lofi.mpt", 
        cover: "img/covers/FASSOUNDS-Cover.jpg",
        background: {
            type: "video",
            src: "img/backgrounds/japan-lofi-bg.mpv"
        }
    },
    { 
        title: "Sakura", 
        src: "music/Sakura - 2.mp3", 
        cover: "img/covers/Sakura - 2.jpg",
        background: {
            type: "video",
            src: "img/backgrounds/sakura-bg.mpv"
        }
    }
];

// Estado global
const state = {
    currentSong: 0,
    isLoop: false,
    isPlaying: false,
    volume: Config.defaultVolume
};

// =============================================
// SISTEMA DE FONDOS
// =============================================

/**
 * Cambia el fondo de video según la canción
 */
function changeBackground(backgroundConfig) {
    console.log('🎬 Cambiando fondo:', backgroundConfig);
    
    const container = document.querySelector('.background-container');
    if (!container) {
        console.error('❌ No se encuentra .background-container');
        return;
    }
    
    // Remover video anterior
    const oldVideo = container.querySelector('.background-video');
    if (oldVideo) {
        oldVideo.classList.remove('active');
        setTimeout(() => {
            if (oldVideo.parentNode) {
                oldVideo.parentNode.removeChild(oldVideo);
            }
        }, 1000);
    }
    
    if (backgroundConfig.type === "video" && backgroundConfig.src) {
        // Crear nuevo elemento video
        const newVideo = document.createElement('video');
        newVideo.className = 'background-video';
        newVideo.autoplay = true;
        newVideo.muted = true;
        newVideo.loop = true;
        
        const source = document.createElement('source');
        source.src = backgroundConfig.src;
        source.type = 'video/mp4';
        newVideo.appendChild(source);
        
        // Manejar errores
        newVideo.addEventListener('error', () => {
            console.warn('❌ Error cargando video:', backgroundConfig.src);
            container.style.background = 'linear-gradient(135deg, #000010, #0a0028, #020024)';
        });
        
        // Agregar al contenedor
        container.appendChild(newVideo);
        
        // Activar después de un breve delay
        setTimeout(() => {
            newVideo.classList.add('active');
        }, 50);
    }
}

// =============================================
// SPLASH SCREEN
// =============================================

function initSplash() {
    if (!elements.splash) return;
    
    if (elements.mainContent) {
        elements.mainContent.style.display = 'none';
    }
    
    if (elements.enterBtn) {
        elements.enterBtn.addEventListener('click', hideSplash);
    }
    
    elements.splash.addEventListener('click', (e) => {
        if (e.target === elements.splash) {
            hideSplash();
        }
    });
    
    setTimeout(hideSplash, Config.splashDuration);
}

function hideSplash() {
    if (!elements.splash) return;
    
    elements.splash.style.opacity = '0';
    elements.splash.style.transition = `opacity ${Config.fadeDuration}ms ease`;
    
    setTimeout(() => {
        elements.splash.style.display = 'none';
        
        if (elements.mainContent) {
            elements.mainContent.style.display = 'block';
        }
        
        document.body.style.overflow = 'auto';
        initMusicPlayer();
    }, Config.fadeDuration);
}

// =============================================
// REPRODUCTOR DE MÚSICA - SIMPLIFICADO
// =============================================

function initMusicPlayer() {
    if (!elements.audio) {
        console.warn('Reproductor de audio no encontrado');
        return;
    }
    
    elements.audio.volume = state.volume;
    loadSong(state.currentSong);
    setupKeyboardControls();
}

function setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch(e.key) {
            case 'ArrowRight':
                nextSong();
                break;
            case 'ArrowLeft':
                prevSong();
                break;
        }
    });
}

/**
 * Carga y reproduce una canción CON FONDO
 */
function loadSong(index) {
    if (index < 0 || index >= songs.length) return;
    
    const song = songs[index];
    state.currentSong = index;
    
    // Actualizar UI
    if (elements.songTitle) {
        elements.songTitle.textContent = song.title;
    }
    
    if (elements.cover) {
        elements.cover.src = song.cover;
        elements.cover.alt = `Portada de ${song.title}`;
    }
    
    // 🎬 CAMBIAR FONDO - LÍNEA CRUCIAL
    if (song.background) {
        changeBackground(song.background);
    }
    
    // Cargar y reproducir audio
    elements.audio.src = song.src;
    elements.audio.load();
    
    elements.audio.play().catch(error => {
        console.log('Reproducción automática bloqueada:', error);
    });
}

function nextSong() {
    const nextIndex = (state.currentSong + 1) % songs.length;
    loadSong(nextIndex);
}

function prevSong() {
    const prevIndex = (state.currentSong - 1 + songs.length) % songs.length;
    loadSong(prevIndex);
}

// Cambiar automáticamente al terminar la canción
document.getElementById('audio-player').addEventListener('ended', () => {
    if (!state.isLoop) {
        nextSong();
    }
});

// Cargar primera canción cuando la página esté lista
window.addEventListener('load', () => {
    setTimeout(() => {
        loadSong(state.currentSong);
    }, 1000);
});

// =============================================
// INICIALIZACIÓN
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 GamesTec - Inicializando aplicación...');
    initSplash();
});

window.addEventListener('error', (event) => {
    console.error('❌ Error en GamesTec:', event.error);
});