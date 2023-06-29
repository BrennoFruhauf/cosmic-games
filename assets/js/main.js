;(async () => {
	const html = document.querySelector('html')
	const categoriesContainer = document.querySelector('#category-list')
	const logo = document.getElementById('logo')
	const bgModalFilter = document.querySelector('#bg-modal-filter')
	const btnOpenFilter = document.querySelector('#btn-filter')
	const btnCloseFilter = document.querySelector('#close-filter')
	const inputSearch = document.querySelector('#search-input')
	const btnSearch = document.querySelector('#search-icon')
	const btnToggle = document.querySelector('#btn-theme')
	const urlPath = window.location.pathname.replace('/cosmic-torrent', '')
	const urlDataBase = checkPathToUrl('./assets/db', '../db')
	const gameData = await (await fetch(`${urlDataBase}/jogos.json`)).json()
	const gameList = gameData.games

	let urlMenu = checkPathToUrl('./index.html', '.././../index.html')

	function checkPathToUrl(pathIndex, pathOthersPage) {
		if (urlPath === '/' || urlPath === '/index.html') return pathIndex
		else return pathOthersPage
	}

	function toggleLogo() {
		let pathDarkLogo = checkPathToUrl(
			'./assets/img/others/logo-dark.svg',
			'../img/others/logo-dark.svg'
		)
		let pathLightLogo = checkPathToUrl(
			'./assets/img/others/logo-light.svg',
			'../img/others/logo-light.svg'
		)

		if (html.classList.contains('dark')) {
			logo.src = pathDarkLogo
		} else {
			logo.src = pathLightLogo
		}
	}

	function setTheme() {
		const theme = localStorage.getItem('theme')
		const moon = document.querySelector('#moon')
		const sun = document.querySelector('#sun')

		if (theme && theme === 'light') {
			moon.classList.replace('active', 'disabled')
			sun.classList.replace('disabled', 'active')
			document.querySelector('html').classList.remove('dark')
		}
		toggleLogo()
	}

	function toggleTheme() {
		const moon = document.querySelector('#moon')
		const sun = document.querySelector('#sun')

		if (moon.classList.contains('active')) {
			localStorage.setItem('theme', 'light')
			moon.classList.replace('active', 'disabled')
			sun.classList.replace('disabled', 'active')
			html.classList.remove('dark')
		} else {
			localStorage.setItem('theme', 'dark')
			moon.classList.replace('disabled', 'active')
			sun.classList.replace('active', 'disabled')
			html.classList.add('dark')
		}
		toggleLogo()
	}

	function loadCategories(games) {
		const categoryList = []
		games.forEach((game) => {
			const gameCategories = game.details.category
			gameCategories.forEach((category) => {
				if (!categoryList.includes(category)) categoryList.push(category)
			})
		})

		const list = document.createElement('ul')

		for (let i = 0; i < categoryList.length; i++) {
			const listItem = document.createElement('li')
			const itemLink = document.createElement('a')
			listItem.textContent = categoryList[i]
			itemLink.href = `${urlMenu}?categoria=${categoryList[i]
				.replace('+', 'maior-')
				.toLowerCase()}`
			itemLink.appendChild(listItem)
			list.appendChild(itemLink)
		}

		categoriesContainer.appendChild(list)
	}

	function openCloseFilter(event) {
		event.stopPropagation()

		if (event.target.id === 'btn-filter') {
			categoriesContainer.style.display = 'flex'
			bgModalFilter.style.display = 'block'
			if (!categoriesContainer.classList.contains('fade-out-top')) {
				categoriesContainer.classList.add('fade-in-top')
				bgModalFilter.classList.add('fade-in')
			} else {
				categoriesContainer.classList.toggle('fade-in-top')
				categoriesContainer.classList.toggle('fade-out-top')
				bgModalFilter.classList.toggle('fade-in')
				bgModalFilter.classList.toggle('fade-out')
			}
			return
		} else {
			const el = event.target
			const isElValid =
				el.id === 'close-filter' ||
				el.id === 'bg-modal-filter' ||
				el.tagName === 'LI'
					? true
					: false

			if (isElValid) {
				categoriesContainer.classList.toggle('fade-in-top')
				categoriesContainer.classList.toggle('fade-out-top')
				bgModalFilter.classList.toggle('fade-in')
				bgModalFilter.classList.toggle('fade-out')
				setTimeout(() => {
					categoriesContainer.style.display = 'none'
					bgModalFilter.style.display = 'none'
				}, 700)
			}
		}
	}

	function search(event) {
		if (
			(event.key === 'Enter' || event.type === 'click') &&
			inputSearch.value
		) {
			window.location.href = `${urlMenu}?busca=${inputSearch.value.toLowerCase()}`
		}
	}

	btnOpenFilter.addEventListener('click', openCloseFilter)
	btnCloseFilter.addEventListener('click', openCloseFilter)
	bgModalFilter.addEventListener('click', openCloseFilter)
	inputSearch.addEventListener('keydown', search)
	btnSearch.addEventListener('click', search)
	btnToggle.addEventListener('click', toggleTheme)

	setTheme()
	loadCategories(gameList)
})()
