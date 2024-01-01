;(async () => {
	const simpleCrypto = new SimpleCrypto('cosmic')
	const content = document.querySelector('main')
	const gameID = new URLSearchParams(window.location.search).get('id')
	const gameData = await getGame(gameID)

	let throttleTimer

	function throttle(callback, time) {
		if (throttleTimer) return

		throttleTimer = true

		setTimeout(() => {
			callback()
			throttleTimer = false
		}, time)
	}

	async function getGame(id) {
		let data = await (await fetch('../db/jogos.json')).json()

		return data.games.find((game) => game.id === id) || null
	}

	async function getVideoStream(url) {
		url = url.split('/')
		const videoId = url[url.length - 1]
		const URL_YT_HTML = 'https://yt2html5.com/?id='

		let res = await fetch(`${URL_YT_HTML}${videoId}`)
		res = await res.json()

		return await res.data.formats.find((f) => f.quality.includes('hd'))
	}

	function setBackgroundVideo(stream) {
		const player = document.getElementById('video-bg')
		player.src = stream.url
		player.currentTime = 6

		player.addEventListener('timeupdate', () => {
			if (player.currentTime < 6) player.currentTime = 6
		})
	}

	function addCategories(categories) {
		const container = document.querySelector('#categories')

		categories.forEach((category) => {
			const link = document.createElement('a')
			link.textContent = category
			const formatedCategory = category.toLowerCase().replace('+', 'maior-')
			link.href = `.././../index.html?categoria=${formatedCategory}`

			container.appendChild(link)
		})
	}

	function whenHeaderTouchContent(event) {
		throttle(() => {
			const scrollContent = event.target.scrollTop
			const header = document.querySelector('header')
			const headerHeight = header.clientHeight
			const contentTop = document.querySelector('#game-details').offsetTop

			if (scrollContent >= contentTop - headerHeight) {
				header.classList.add('bg-active')
			} else {
				header.classList.remove('bg-active')
			}
		}, 300)
	}

	function addInfo(game) {
		const card = document.querySelector('#card img')
		card.src = `../${game.info.image.replace('assets/', '')}`

		const btnDownload = document.querySelector('#download')

		const loginWarning = document.querySelector('#login-warning')

		if (localStorage.getItem('login')) {
			btnDownload.href = simpleCrypto.decrypt(game.details['link-download'])
			loginWarning.style.display = 'none'
		} else {
			btnDownload.style.display = 'none'
		}

		const title = document.querySelector('#title')
		title.textContent = game.title

		const release = document.querySelector('#release')
		release.textContent = game.info.release

		const platform = document.querySelector('#platform')
		platform.textContent = game.info.platform

		const dubbing = document.querySelector('#dubbing')
		dubbing.textContent = game.details.dubbing.toLowerCase()

		const language = document.querySelector('#language')
		language.textContent = game.details.language.toLowerCase()

		const size = document.querySelector('#size')
		size.textContent = game.info.size

		const cracker = document.querySelector('#cracker')
		cracker.textContent = game.info['cracked-by']

		const synopsis = document.querySelector('#synopsis')
		synopsis.textContent = game.details.description

		const trailer = document.querySelector('#video iframe')
		trailer.src = game.details.trailer
	}

	if (gameData) {
		document.title = `Cosmic Games | ${gameData.title}`
		addCategories(gameData.details.category)
		addInfo(gameData)
	}

	content.addEventListener('scroll', whenHeaderTouchContent)

	const videoStream = await getVideoStream(gameData.details.trailer)
	setBackgroundVideo(videoStream)
})()
