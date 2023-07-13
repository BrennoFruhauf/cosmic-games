import { throttle } from '../shared.js'
;(async () => {
	const mainContent = document.querySelector('#main-content')
	const searchByCategory = new URLSearchParams(window.location.search).get(
		'categoria'
	)
	const searchBySearch = new URLSearchParams(window.location.search).get(
		'busca'
	)
	const object = await (await fetch('./assets/db/jogos.json')).json()
	const cardsContainer = document.querySelector('#cards')
	const loader = document.querySelector('#loader')

	// let throttleTimer

	// function throttle(callback, time) {
	// 	if (throttleTimer) return

	// 	throttleTimer = true

	// 	setTimeout(() => {
	// 		callback()
	// 		throttleTimer = false
	// 	}, time)
	// }

	function splitArray(array, size) {
		return new Array(Math.ceil(array.length / size))
			.fill()
			.map(() => array.splice(0, size))
	}

	function isEndOfPage() {
		const headerHeight = document.querySelector('header').offsetHeight
		const footerHeight = document.querySelector('footer').offsetHeight
		const mainHeight = mainContent.scrollHeight
		const mainPositionTop = mainContent.scrollTop
		const scrollThreshold = 5

		const variation = headerHeight + footerHeight - scrollThreshold
		const mainBottom = mainPositionTop + window.innerHeight - variation

		return mainBottom >= mainHeight
	}

	function capitalizeString(string, exceptions) {
		const lowercaseStr = string.toLowerCase()
		const words = lowercaseStr.split(' ')

		const capitalizedWords = words.map((word) => {
			if (exceptions.includes(word)) {
				return word.toUpperCase()
			} else {
				return word.charAt(0).toUpperCase() + word.slice(1)
			}
		})

		const capitalizedStr = capitalizedWords.join(' ')
		return capitalizedStr
	}

	function loadGames(games) {
		games.forEach((game) => {
			const card = document.createElement('div')
			card.classList.add('card')
			card.setAttribute('data-title', game.title)

			const link = document.createElement('a')
			link.href = `./assets/pages/details.html?id=${game.id}`
			card.appendChild(link)

			const img = document.createElement('img')
			img.src = `./${game.info.image}`
			link.appendChild(img)

			cardsContainer.appendChild(card)
		})
	}

	function showLoading(gameList) {
		loader.style.display = 'flex'
		loader.classList.add('fade-in')

		setTimeout(() => {
			loader.classList.remove('fade-in')
			loader.classList.add('fade-out')

			setTimeout(() => {
				loader.style.display = 'none'
				loader.classList.remove('fade-out')

				loadGames(gameList)
			}, 300)
		}, 1500)
	}

	function displayGames(games) {
		const splitedGames = splitArray(games, 24)
		loadGames(splitedGames.shift())

		const handleInfiniteScroll = () => {
			throttle(() => {
				if (isEndOfPage() && splitedGames.length !== 0) {
					showLoading(splitedGames.shift())

					if (splitedGames.length === 0) {
						mainContent.removeEventListener('scroll', handleInfiniteScroll)
					}
				}
			}, 300)
		}

		mainContent.addEventListener('scroll', handleInfiniteScroll)
	}

	function findGamesByCategory(category, games) {
		let filteredGames = []

		games.forEach((game) => {
			const gameCategories = game.details.category.map((el) =>
				el.toLowerCase().replace('+', 'maior-')
			)

			if (gameCategories.includes(category.toLowerCase()))
				filteredGames.push(game)
		})

		return filteredGames
	}

	function loadGamesByCategory(category, games) {
		const categoryExceptions = ['rpg', 'lol', 'fps', 'nsw', 'jrpg', '2d', '3d']
		document.title = `Cosmic Games | ${capitalizeString(
			category,
			categoryExceptions
		)}`
		const foundGames = findGamesByCategory(category, games)
		const h3Element = document.createElement('h3')

		if (foundGames.length === 0) {
			h3Element.textContent = 'Categoria não existe!'
		} else {
			h3Element.textContent = `Jogos da categoria: `
			const spanElement = document.createElement('span')
			spanElement.textContent = category
			h3Element.appendChild(spanElement)
		}

		h3Element.setAttribute('id', 'info')
		mainContent.insertBefore(h3Element, mainContent.firstElementChild)

		displayGames(foundGames)
	}

	function findGamesBySearch(search, games) {
		let filteredGames = []

		games.forEach((game) => {
			if (game.title.toLowerCase().includes(search)) filteredGames.push(game)
		})

		return filteredGames
	}

	function loadGamesBySearch(search, games) {
		const foundGames = findGamesBySearch(search, games)
		const h3Element = document.createElement('h3')
		const spanElement = document.createElement('span')
		spanElement.textContent = search

		if (foundGames.length === 0)
			h3Element.textContent = `Nenhum jogo encontrado na pesquisa: `
		else h3Element.textContent = `Resultado da pesquisa: `

		h3Element.setAttribute('id', 'info')
		h3Element.appendChild(spanElement)
		mainContent.insertBefore(h3Element, mainContent.firstElementChild)

		displayGames(foundGames)
	}

	if (searchByCategory) loadGamesByCategory(searchByCategory, object.games)
	else if (searchBySearch) loadGamesBySearch(searchBySearch, object.games)
	else displayGames(object.games)
})()
