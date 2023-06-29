;(() => {
	const btnMoveToSignUp = document.querySelector('#signUp')
	const btnMoveToSignIn = document.querySelector('#signIn')
	const btnSignUp = document.querySelector('#btn-register')
	const btnSignIn = document.querySelector('#btn-login')
	const container = document.querySelector('#container')
	const accessParameter = new URLSearchParams(window.location.search).get(
		'cadastro'
	)

	function isSignUpPage() {
		const isRegister = accessParameter === ''
		if (isRegister) {
			const formContainers = document.querySelectorAll('.form-container')
			const overlayContainer = document.querySelector('.overlay-container')
			const overlay = document.querySelector('.overlay')
			const overlayPanels = document.querySelectorAll('.overlay-panel')
			const allElements = [
				...formContainers,
				overlayContainer,
				overlay,
				...overlayPanels,
			]

			allElements.forEach((el) => (el.style.transition = 'none'))
			container.classList.add('right-panel-active')

			setTimeout(() => {
				allElements.forEach((el) => el.removeAttribute('style'))
			}, 800)
		}

		btnMoveToSignUp.addEventListener('click', (e) => {
			container.classList.add('right-panel-active')
		})

		btnMoveToSignIn.addEventListener('click', (e) => {
			container.classList.remove('right-panel-active')
		})
	}

	function signUp() {}

	function signIn() {}

	btnSignUp.addEventListener('click', (e) => {
		e.preventDefault()
		console.log('registro')
	})

	btnSignIn.addEventListener('click', (e) => {
		e.preventDefault()
		console.log('login')
	})

	isSignUpPage()
})()
