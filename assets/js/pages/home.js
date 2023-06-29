;(async () => {
	function separarArray(array, tamanho) {
		return new Array(Math.ceil(array.length / tamanho))
			.fill()
			.map(() => array.splice(0, tamanho))
	}

	function isElementInViewport(el) {
		const rect = el.getBoundingClientRect()

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				(window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		)
	}

	function carregarJogos(jogos) {
		jogos.forEach((jogo) => {
			const card = document.createElement('div')
			card.classList.add('card')
			card.setAttribute('data-titulo', jogo.title)

			const link = document.createElement('a')
			link.href = `./assets/pages/details.html?id=${jogo.id}`
			card.appendChild(link)

			const img = document.createElement('img')
			img.src = `./${jogo.info.image}`
			link.appendChild(img)

			containerDosCards.appendChild(card)
		})
	}

	function exibindoJogos(jogos) {
		const jogosSeparados = separarArray(jogos, 24)
		carregarJogos(jogosSeparados.shift())

		const handleFimDoScroll = () => {
			const ultimoCard = document.querySelector('.card:last-of-type')

			if (isElementInViewport(ultimoCard) && jogosSeparados.length !== 0)
				carregarJogos(jogosSeparados.shift())
			else if (jogosSeparados.length === 0)
				// conteudoPrincipal.removeEventListener('scrollend', handleFimDoScroll)
				conteudoPrincipal.removeEventListener('scrollend', handleFimDoScroll)
		}

		// conteudoPrincipal.addEventListener('scrollend', handleFimDoScroll)
		conteudoPrincipal.addEventListener('scrollend', handleFimDoScroll)
	}

	function buscarJogosPorCategoria(categoria, jogos) {
		let jogosFiltrado = []

		for (let i = 0; i < jogos.length; i++) {
			if (
				jogos[i].details.category
					.map((item) => item.toLowerCase().replace('+', 'maior-'))
					.includes(categoria.toLowerCase())
			) {
				jogosFiltrado.push(jogos[i])
			}
		}

		return jogosFiltrado
	}

	function carregarJogosPorCategoria(categoria, jogos) {
		const jogosPorCategoria = buscarJogosPorCategoria(categoria, jogos)
		const elementoH3 = document.createElement('h3')
		if (jogosPorCategoria.length === 0) {
			elementoH3.setAttribute('id', 'info')
			elementoH3.innerHTML = `Categoria não existe!`
			conteudoPrincipal.insertBefore(
				elementoH3,
				conteudoPrincipal.lastElementChild
			)
			return
		}

		elementoH3.setAttribute('id', 'info')
		elementoH3.innerHTML = `Jogos da categoria: <span>${categoria}</span>`
		conteudoPrincipal.insertBefore(
			elementoH3,
			conteudoPrincipal.lastElementChild
		)
		exibindoJogos(jogosPorCategoria)
	}

	function buscarJogosPorPesquisa(pesquisa, jogos) {
		let jogosFiltrado = []

		for (let i = 0; i < jogos.length; i++) {
			if (jogos[i].title.toLowerCase().includes(pesquisa)) {
				jogosFiltrado.push(jogos[i])
			}
		}

		return jogosFiltrado
	}

	function carregarJogosPorPesquisa(pesquisa, jogos) {
		const jogosPorPesquisa = buscarJogosPorPesquisa(pesquisa, jogos)
		const elementoH3 = document.createElement('h3')
		if (jogosPorPesquisa.length === 0) {
			elementoH3.setAttribute('id', 'info')
			elementoH3.innerHTML = `Nenhum jogo encontrado na pesquisa: <span>${pesquisa}</span>`
			conteudoPrincipal.insertBefore(
				elementoH3,
				conteudoPrincipal.lastElementChild
			)
			return
		}

		elementoH3.setAttribute('id', 'info')
		elementoH3.innerHTML = `Resultado da pesquisa: <span>${pesquisa}</span>`
		conteudoPrincipal.insertBefore(
			elementoH3,
			conteudoPrincipal.lastElementChild
		)
		exibindoJogos(jogosPorPesquisa)
	}

	const categoria = new URLSearchParams(window.location.search).get('categoria')
	const busca = new URLSearchParams(window.location.search).get('busca')
	const json = await (await fetch('./assets/db/jogos.json')).json()
	const conteudoPrincipal = document.querySelector('#conteudo-principal')
	const containerDosCards = document.querySelector('#cards')

	if (categoria) carregarJogosPorCategoria(categoria, json.games)
	else if (busca) carregarJogosPorPesquisa(busca, json.games)
	else exibindoJogos(json.games)
})()
