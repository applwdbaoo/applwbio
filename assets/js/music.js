const songs = [
    "vo-tinh.mp3",
    "em-con-nho-anh-khong.mp3",
    "co-em-cho.mp3",
    "dung-yeu-nua-em-met-roi.mp3",
    "moshi-moshi.mp3",
    "12.mp3",
    "sau-bao-nhieu-lan-sai.mp3",
    "co-em.mp3",
    "anh-da-drill-voi-co-don.mp3",
    "thuc-giac.mp3",
    "em-xinh-nhu-mot-thien-than.mp3",
    "hay-cho-con-chiu-dau-kho-thay-em.mp3",
    "hon-ca-may-troi.mp3",
    "lan-hen-ho-dau-tien.mp3",
    "ai-dua-em-ve.mp3",
    "em-khong-hieu.mp3",
    "may.mp3",
    "tabun.mp3",
    "ca-phe.mp3",
    "phong.mp3",
    "anh-la-ai,mp3",
    "ngo-loi.mp3",
    "giau-troi-mang-di.mp3",
    "thap-drill-tu-do.mp3",
    "nang-ther.mp3",
    "kjkjkj-chiuuie.mp3",
    "cho-anh-mot-chut-hy-vong.mp3",
    "de-drill-mot-minh.mp3"
];

let currentSongIndex = 0;
let isPlaying = false;
const audio = new Audio();

audio.volume = 1.0;

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

let shuffledSongs = shuffleArray(songs);

function initMusicPlayer() {
    loadSong(currentSongIndex);
    audio.addEventListener('ended', nextSong);
}

function startMusicAfterTerminal() {
    isPlaying = true;
    audio.play()
        .catch(error => {
            console.error("Music playback error:", error);
            setTimeout(() => {
                audio.play().catch(e => console.error("Retry error:", e));
            }, 1000);
        });
}

function loadSong(index) {
    audio.src = `./assets/music/${shuffledSongs[index]}`;
    
    if (isPlaying) {
        audio.play().catch(error => console.error("Play error:", error));
    }
}

function nextSong() {
    currentSongIndex = Math.floor(Math.random() * shuffledSongs.length);
    loadSong(currentSongIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    shuffledSongs = shuffleArray([...songs]);
    initMusicPlayer();
});

window.MusicPlayer = {
    start: startMusicAfterTerminal,
    getAudio: () => audio
};