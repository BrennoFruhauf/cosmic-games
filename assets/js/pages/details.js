let videoId
;(async () => {
	async function obterJogo(id) {
		let json = await (await fetch('/assets/db/jogos.json')).json()

		for (let index = 0; index < json.games.length; index++) {
			if (json.games[index].id == id) return json.games[index]
		}

		return null
	}

	const simpleCrypto = new SimpleCrypto('cosmic')
	const jogoId = new URLSearchParams(window.location.search).get('id')
	const jogo = await obterJogo(jogoId)
	videoId = jogo.details.trailer.replace('https://www.youtube.com/embed/', '')

	function addCategorias(categorias) {
		const container = document.querySelector('#categorias')

		for (let i = 0; i < categorias.length; i++) {
			const link = document.createElement('a')
			link.textContent = categorias[i]
			link.href = `./index.html?categoria=${categorias[i]
				.toLowerCase()
				.replace('+', 'maior-')}`

			container.appendChild(link)
		}
	}

	function addInfo(jogo) {
		const card = document.querySelector('#card img')
		card.src = `../${jogo.info.image.replace('assets/', '')}`

		const btnDownload = document.querySelector('#download')
		btnDownload.href = simpleCrypto.decrypt(jogo.details['link-download'])

		const titulo = document.querySelector('#titulo')
		titulo.textContent = jogo.title

		const lancamento = document.querySelector('#lancamento')
		lancamento.textContent = jogo.info.release

		const plataforma = document.querySelector('#plataforma')
		plataforma.textContent = jogo.info.platform

		const dublagem = document.querySelector('#dublagem')
		dublagem.textContent = jogo.details.dubbing.toLowerCase()

		const idioma = document.querySelector('#idioma')
		idioma.textContent = jogo.details.language.toLowerCase()

		const tamanho = document.querySelector('#tamanho')
		tamanho.textContent = jogo.info.size

		const cracker = document.querySelector('#cracker')
		cracker.textContent = jogo.info['cracked-by']

		const sinopse = document.querySelector('#sinopse')
		sinopse.textContent = jogo.details.description

		const trailer = document.querySelector('#video iframe')
		trailer.src = jogo.details.trailer
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

	addCategorias(jogo.details.category)
	addInfo(jogo)
})()

const tag = document.createElement('script')

tag.src = 'https://www.youtube.com/iframe_api'
const firstScriptTag = document.getElementsByTagName('script')[0]
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
