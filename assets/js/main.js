;(async () => {
	let pathLogoDark = './assets/img/others/logo-dark.svg'
	let pathLogoLight = './assets/img/others/logo-light.svg'

	if (document.URL.includes('details.html')) {
		pathLogoDark = '../img/others/logo-dark.svg'
		pathLogoLight = '../img/others/logo-light.svg'
	}

	const html = document.querySelector('html')

	function trocarLogo() {
		const logo = document.getElementById('logo')

		if (html.classList.contains('dark')) {
			logo.src = pathLogoDark
		} else {
			logo.src = pathLogoLight
		}
	}

	function colocarTema() {
		const tema = localStorage.getItem('tema')
		const moon = document.querySelector('#moon')
		const sun = document.querySelector('#sun')

		if (tema && tema === 'light') {
			moon.classList.replace('active', 'disabled')
			sun.classList.replace('disabled', 'active')
			document.querySelector('html').classList.remove('dark')
		}
		trocarLogo()
	}

	function trocarTema() {
		const moon = document.querySelector('#moon')
		const sun = document.querySelector('#sun')

		if (moon.classList.contains('active')) {
			localStorage.setItem('tema', 'light')
			moon.classList.replace('active', 'disabled')
			sun.classList.replace('disabled', 'active')
			html.classList.remove('dark')
			trocarLogo()
		} else {
			localStorage.setItem('tema', 'dark')
			moon.classList.replace('disabled', 'active')
			sun.classList.replace('active', 'disabled')
			html.classList.add('dark')
			trocarLogo()
		}
	}

	const json = await (await fetch('/assets/db/jogos.json')).json()
	const jogos = json.games

	function carregarCategorias(jogos) {
		const listaDeCategorias = []
		jogos.forEach((jogo) => {
			const categorias = jogo.details.category
			categorias.forEach((categoria) => {
				if (!listaDeCategorias.includes(categoria))
					listaDeCategorias.push(categoria)
			})
		})

		const containerLista = document.querySelector('#lista-categorias')
		const lista = document.createElement('ul')
		for (let i = 0; i < listaDeCategorias.length; i++) {
			const itemDaLista = document.createElement('li')
			const linkItem = document.createElement('a')
			itemDaLista.textContent = listaDeCategorias[i]
			linkItem.href = `/index.html?categoria=${listaDeCategorias[i]
				.replace('+', 'maior-')
				.toLowerCase()}`
			linkItem.appendChild(itemDaLista)
			lista.appendChild(linkItem)
		}
		containerLista.appendChild(lista)
	}

	const listaCategoria = document.getElementById('lista-categorias')
	const fundo = document.querySelector('#fundo')
	document.querySelector('#btn-filtro').addEventListener('click', () => {
		listaCategoria.style.display = 'flex'
		fundo.style.display = 'block'
		if (!listaCategoria.classList.contains('fade-out-top')) {
			listaCategoria.classList.add('fade-in-top')
			fundo.classList.add('fade-in')
		} else {
			listaCategoria.classList.toggle('fade-in-top')
			listaCategoria.classList.toggle('fade-out-top')
			fundo.classList.toggle('fade-in')
			fundo.classList.toggle('fade-out')
		}
	})

	document
		.querySelector('#close-filtro')
		.addEventListener('click', (evento) => {
			evento.stopPropagation()
			listaCategoria.classList.toggle('fade-in-top')
			listaCategoria.classList.toggle('fade-out-top')
			fundo.classList.toggle('fade-in')
			fundo.classList.toggle('fade-out')
			setTimeout(() => {
				listaCategoria.style.display = 'none'
				fundo.style.display = 'none'
			}, 700)
		})

	fundo.addEventListener('click', (evento) => {
		evento.stopPropagation()
		listaCategoria.classList.toggle('fade-in-top')
		listaCategoria.classList.toggle('fade-out-top')
		fundo.classList.toggle('fade-in')
		fundo.classList.toggle('fade-out')
		setTimeout(() => {
			listaCategoria.style.display = 'none'
			fundo.style.display = 'none'
		}, 700)
	})

	// const inputSearch = document.querySelector('#buscar__input')
	// const btnSearch = document.querySelector('#buscar__icon')

	// inputSearch.addEventListener('keydown', (e) => {
	// 	if (e.key === 'Enter' && e.target.value) {
	// 		window.location.href = `/index.html?busca=${e.target.value.toLowerCase()}`
	// 	}
	// })

	// btnSearch.addEventListener('click', () => {
	// 	if (inputSearch.value)
	// 		window.location.href = `/index.html?busca=${inputSearch.value.toLowerCase()}`
	// })

	const btnToggle = document.querySelector('#btn-tema')
	btnToggle.addEventListener('click', trocarTema)

	colocarTema()
	carregarCategorias(jogos)
})()
