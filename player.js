const playing = document.querySelector(".playing")
const volume = document.querySelector(".volume")
const video = document.querySelector("video")
const playingTrack = playing.querySelector(".track")
const playingThumb = playing.querySelector(".thumb")
const volumeTrack = volume.querySelector(".volume-track")
const volumeThumb = volume.querySelector(".volume-thumb")
const timecode = document.querySelector(".timecode")
const controls = document.querySelector(".controls")
const progressBar = document.querySelector(".progress")
const volumeLevel = document.querySelector(".volume-level")

let isTimeDragging = false
let isVolumeDragging = false

function setHoverClassToVideoControls() {
    if (!controls.classList.contains("hover")) {
        controls.classList.add("hover")
        controls.classList.remove("hide-mouse")
    }
    setTimeout(() => {
        unsetHoverClassToVideoControls()
    }, 7000)
}

function unsetHoverClassToVideoControls() {
    if (controls.classList.contains("hover")) {
        controls.classList.remove("hover")
        controls.classList.add("hide-mouse")
    }
}

function nextEpisode() {
    document
}

function previousEpisode() {
    
}

function goBack(seconds) {
    video.currentTime = Math.max(video.currentTime - seconds, 0)
}

function goForward(seconds) {
    video.currentTime = Math.min(video.currentTime + seconds, video.duration)
}

function toggleVideo() {
    const playButton = document.querySelector("button[data-control-type='toggleVideo']")
    const playIcon = playButton.querySelector("i[data-mode='play']")
    const pauseIcon = playButton.querySelector("i[data-mode='pause']")

    if (video.paused || video.ended) {
        video.play()
        playButton.setAttribute("title", playButton.getAttribute("data-play-title"))
        playIcon.classList.add("invisible")
        pauseIcon.classList.remove("invisible")
    } else {
        video.pause()
        playButton.setAttribute("title", playButton.getAttribute("data-pause-title"))
        playIcon.classList.remove("invisible")
        pauseIcon.classList.add("invisible")
    }
}

function toggleFullScreen() {
    const fullScreenButton = document.querySelector("button[data-control-type='toggleFullScreen']")
    const enterIcon = fullScreenButton.querySelector("i[data-mode='enter']")
    const exitIcon = fullScreenButton.querySelector("i[data-mode='exit']")

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
        fullScreenButton.setAttribute("title", fullScreenButton.getAttribute("data-exit-title"))
        enterIcon.classList.add("invisible")
        exitIcon.classList.remove("invisible")
    } else {
        document.exitFullscreen();
        fullScreenButton.setAttribute("title", fullScreenButton.getAttribute("data-enter-title"))
        enterIcon.classList.remove("invisible")
        exitIcon.classList.add("invisible")
    }
}

function changeTitles(element) {
    const type = element.getAttribute("data-control-type")
    switch (type) {
        case "toggleVideo":
            const playTitle = element.getAttribute("data-play-title")
            const pauseTitle = element.getAttribute("data-pause-title")
            const isPlaying = element.querySelector("i[data-mode='pause']").classList.contains("invisible")
            element.setAttribute("title", isPlaying ? pauseTitle : playTitle)
            break
        case "toggleFullScreen":
            const enterFullScreenTitle = element.getAttribute("data-enter-title")
            const exitFullScreenTitle = element.getAttribute("data-exit-title")
            const isFullscreen = element.querySelector("i[data-mode='exit']").classList.contains("invisible")
            element.setAttribute("title", isFullscreen ? exitFullScreenTitle : enterFullScreenTitle)
            break
        default:
            break
    }
}

function updateProgress() {
    if (!isTimeDragging) {
        const percentage = (video.currentTime / video.duration) * 100
        timecode.textContent = formatTime(video.duration - video.currentTime)
        playingTrack.style.width = `${percentage}%`
        playingThumb.style.marginLeft = `${percentage}%`
        if (video.ended) {
            const playButton = document.querySelector("button[data-control-type='toggleVideo']")
            const playIcon = playButton.querySelector("i[data-mode='play']")
            const pauseIcon = playButton.querySelector("i[data-mode='pause']")

            pauseIcon.classList.add("invisible")
            playIcon.classList.remove("invisible")
        }
    }
}

function formatTime(time) {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function toggleVideoIfClickedOverControls(event) {
    if (event.target.classList.contains("controls")) {
        toggleVideo()
    }
}

function toggleFullscreenIfDoubleClickedOverControls(event) {
    if (event.target.classList.contains("controls")) {
        toggleFullScreen()
    }
}

function onTimeRangeDrag(event) {
    if (!isTimeDragging) return
    const rect = progressBar.getBoundingClientRect()
    let offsetX = event.clientX - rect.left
    offsetX = Math.max(0, Math.min(offsetX, rect.width))
    const percent = (offsetX / rect.width) * 100
    playingTrack.style.width = percent + "%"
    playingThumb.style.marginLeft = percent + "%"
    video.currentTime = (percent / 100) * video.duration
}

function onVolumeRegulatorDrag(event) {
    if (!isVolumeDragging) return
    const rect = volumeLevel.getBoundingClientRect()
    let offsetY = rect.bottom - event.clientY
    offsetY = Math.max(0, Math.min(offsetY, rect.height))
    const percent = (offsetY / rect.height) * 100
    volumeTrack.style.height = `calc(100% - ${percent}%)`
    volumeThumb.style.bottom = `${percent}%`
    video.volume = percent / 100
}

function stopTimeRangeDrag() {
    isTimeDragging = false
    document.removeEventListener("mousemove", onTimeRangeDrag)
    document.removeEventListener("mouseup", stopTimeRangeDrag)
}

function stopVolumeRegulatorDrag() {
    isDragging = false
    document.removeEventListener("mousemove", onVolumeRegulatorDrag)
    document.removeEventListener("mouseup", stopVolumeRegulatorDrag)
    toggleVolumeRegulator()
}

function handleKeyboardShortcuts(event) {
    if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
        return
    }
    switch (event.code) {
        case "Space":
            event.preventDefault()
            toggleVideo()
            break
        case "KeyK":
            event.preventDefault()
            toggleVideo()
            break
        case "ArrowRight":
            goForward(10)
            break
        case "ArrowLeft": 
            goBack(10)
            break
        case "Escape":
            closeSettings()
            break

        default:
            break
    }
}

function toggleVolume() {
    const volumeButton = document.querySelector("button[data-control-type='volume']")
    const volumeIcon = volumeButton.querySelector("i[data-mode='volume']")
    const mutedVolumeIcon = volumeButton.querySelector("i[data-mode='volumeMuted']")
    if (video.muted) {
        video.muted = false
        volumeIcon.classList.add("invisible")
        mutedVolumeIcon.classList.remove("invisible")
    } else {
        video.muted = true
        volumeIcon.classList.remove("invisible")
        mutedVolumeIcon.classList.add("invisible")
    }
}

function toggleVolumeRegulator(show = undefined) {
    const volumeLevel = document.querySelector(".volume")
    if (show == true) {
        volumeLevel.classList.remove("invisible")
    } else if (show == false) {
        volumeLevel.classList.add("invisible")
    } else {
        volumeLevel.classList.toggle("invisible")
    }
}

function toggleSettings() {
    const settings = document.querySelector("article.settings")
    settings.classList.toggle("invisible")
}

function closeSettings() {
    const settings = document.querySelector("article.settings")
    settings.classList.add("invisible")
}

function changeVideoSource(source) {
    const list = document.querySelector("div.selector.video").querySelector("div.list")
    for (let item of list.children) {
        item.classList.remove("selected")
        if (item.value == source) {
            if (source) {
                item.classList.add("selected")
                video.src = source
                video.play()
            }
        }
    }
}

function changeSubtitlesSource(source) {
    const list = document.querySelector("div.selector.subtitles").querySelector("div.list")
    for (let item of list.children) {
        item.classList.remove("selected")
        if (item.value == source) {
            if (source) {
                item.classList.add("selected")
                const newTrack = document.createElement("track")
                newTrack.kind = "subtitles"
                newTrack.src = source
                newTrack.srclang = item.getAttribute("data-srclang") || "en"
                newTrack.label = item.textContent
                newTrack.default = true
                video.appendChild(newTrack)
                if (video.textTracks && video.textTracks[0]) {
                    video.textTracks[0].mode = "showing"
                }
            }
        }
    }
}


video.addEventListener("timeupdate", updateProgress)
document.addEventListener("keydown", handleKeyboardShortcuts)

progressBar.addEventListener("click", (event) => {
    const rect = progressBar.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const percentage = offsetX / rect.width
    video.currentTime = percentage * video.duration
})

playingThumb.addEventListener("mousedown", (event) => {
    isTimeDragging = true
    document.addEventListener("mousemove", onTimeRangeDrag)
    document.addEventListener("mouseup", stopTimeRangeDrag)
})

volumeThumb.addEventListener("mousedown", (event) => {
    isVolumeDragging = true
    document.addEventListener("mousemove", onVolumeRegulatorDrag)
    document.addEventListener("mouseup", stopVolumeRegulatorDrag)
})

toggleVolumeRegulator(false)
toggleSettings()