const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'PLAYER'

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'A Little Love',
            singer: 'Fiona Fung',
            path: './music/A-Little-Love-Yao-Si-Ting.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/b/5/b557eb964cc7986b6186f0d40799310b_1328010721.jpg'
        },
        {
            name: 'Beautiful In White',
            singer: 'Shane Filan',
            path: './music/Beautiful-In-White-Shayne-Ward.mp3',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMfZPaFPR34WhESXGYAgDzK1NsXQk9wbO9aQ&usqp=CAU'
        },
        {
            name: 'Broken Angel',
            singer: 'Arash',
            path: './music/Broken-Angel-Arash-Helena.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/0/d/0d5b1c4c7f720f698946c7f6ab08f687_1327048132.jpg'
        },
        {
            name: 'Cry On My Shoulder',
            singer: 'Super Stars',
            path: './music/Cry-On-My-Shoulder-Super-Stars.mp3',
            image: 'https://ngochaiviolin.com/wp-content/uploads/2021/05/Cry-On-My-Shoulder1.jpg'
        },
        {
            name: 'I Do',
            singer: '911',
            path: './music/I-Do-911.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/5/6/563ca309d4a94c965db573643a08bc52_1392802860.jpg'
        },
        {
            name: 'My Love',
            singer: 'Westlife',
            path: './music/My-Love-Westlife.mp3',
            image: 'https://1.bp.blogspot.com/-1lrlbBhhl9s/X_qxOD4d2qI/AAAAAAAA_6g/ICRar6vGFZQ4vCEbZ1auF_9C3R4NX3ecQCLcBGAsYHQ/s16000/2cUyspM.jpg'
        },
        {
            name: 'Nothing\'s Gonna Change My Love For You',
            singer: 'Westlife',
            path: './music/Nothing-s-Gonna-Change-My-Love-For-You-Westlife.mp3',
            image: 'https://1.bp.blogspot.com/-1lrlbBhhl9s/X_qxOD4d2qI/AAAAAAAA_6g/ICRar6vGFZQ4vCEbZ1auF_9C3R4NX3ecQCLcBGAsYHQ/s16000/2cUyspM.jpg'
        },
        {
            name: 'Reality',
            singer: 'Lost Frequencies',
            path: './music/Reality-Lost-Frequencies-Janieck-Devy.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_png/avatars/c/7/c7adb27c2df9dd8001dddf9b16bd62d7_1460436708.png'
        },
        {
            name: 'Take Me To Your Heart',
            singer: 'Michael Learns To Rock',
            path: './music/Take-Me-To-Your-Heart-Original-Version-Michael-Learns-To-Rock.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/b/e/7/f/be7fb33f3ec76ee0efe882df5fb5a80c.jpg'
        },
        {
            name: 'Way Back Home',
            singer: 'Shaun',
            path: './music/Way-Back-Home-Acoustic-Version-Shaun.mp3',
            image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/7/b/9/3/7b932ec50083cb362b51d19aca2f5988.jpg'
        },

    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playList.innerHTML = htmls.join('\n')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xoay 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            interations: Infinity
        })

        cdThumbAnimate.pause()

        // xử lý zoom in / zoom out
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // Khi  bai hat chay
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent =
                    Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // khi tua
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        // khi next
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi prev
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()

        }
        // xử lý random
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // xử lý lặp lại 1 song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // xử lý next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click()
            }
        }
        // lắng nghe click
        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            // xử lý khi click vào song
            if(songNode || e.target.closest('option')) {
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                if(e.target.closest('option')) {

                }
            }

        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.song.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        // gán cấu hình từ config
        this.loadConfig()

        // định nghĩa các thuộc tính cho object
        this.defineProperties()

        // lắng nghe và xửa lý sự kiện
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi ứng dụng chạy
        this.loadCurrentSong()

        // render playlist
        this.render()

        // hiển thị trạng ban đầu của button
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()