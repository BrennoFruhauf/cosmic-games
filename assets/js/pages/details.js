let videoId
;(async () => {
	const simpleCrypto = new SimpleCrypto('cosmic')
	const gameID = new URLSearchParams(window.location.search).get('id')
	const gameData = await getGame(gameID)
	videoId = gameData.details.trailer.replace(
		'https://www.youtube.com/embed/',
		''
	)

	async function getGame(id) {
		let data = await (await fetch('../db/jogos.json')).json()

		return data.games.find((game) => game.id === id) || null
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

	function addInfo(game) {
		const card = document.querySelector('#card img')
		card.src = `../${game.info.image.replace('assets/', '')}`

		const btnDownload = document.querySelector('#download')
		btnDownload.href = simpleCrypto.decrypt(game.details['link-download'])

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

	document.addEventListener('DOMContentLoaded', function () {
		const header = document.querySelector('header')
		const conteudo = document.querySelector('#conteudo')

		window.addEventListener('scroll', function () {
			const rect1 = header.getBoundingClientRect()
			const rect2 = conteudo.getBoundingClientRect()

			if (
				rect1.bottom >= rect2.top &&
				rect1.top <= rect2.bottom &&
				rect1.right >= rect2.left &&
				rect1.left <= rect2.right
			) {
				header.classList.add('encostando')
				conteudo.classList.add('encostando')
			} else {
				header.classList.remove('encostando')
				conteudo.classList.remove('encostando')
			}
		})
	})

	if (gameData) {
		document.title = `Cosmic Torrent | ${gameData.title}`
		addCategories(gameData.details.category)
		addInfo(gameData)
	}
})()

const tag = document.createElement('script')
const firstScriptTag = document.getElementsByTagName('script')[0]
tag.src = 'https://www.youtube.com/iframe_api'
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

function onYouTubeIframeAPIReady() {
	new YT.Player('video-bg', {
		height: '360',
		width: '640',
		videoId: videoId,
		playerVars: {
			autoplay: 1,
			loop: 1,
			disablekb: 1,
			mute: 1,
			modestbranding: 1,
			showinfo: 0,
			rel: 0,
			playlist: videoId,
			start: 6,
		},
	})
}
