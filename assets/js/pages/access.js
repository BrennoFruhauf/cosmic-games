import { throttle } from '../shared.js'
;(() => {
	const btnMoveToSignUp = document.querySelector('#sign-up')
	const btnMoveToSignIn = document.querySelector('#sign-in')
	const btnSignUp = document.querySelector('#btn-register')
	const btnSignIn = document.querySelector('#btn-login')
	const container = document.querySelector('#container')
	const hasAccessParameter = new URLSearchParams(window.location.search).has(
		'cadastro'
	)

	const signupContainer = document.querySelector('.sign-up-container')
	const signinContainer = document.querySelector('.sign-in-container')

	const signupUsername = document.querySelector('#signup-username')
	const signupName = document.querySelector('#signup-name')
	const signupEmail = document.querySelector('#signup-email')
	const signupPassword = document.querySelector('#signup-password')

	const signinUsername = document.querySelector('#signin-username')
	const signinPassword = document.querySelector('#signin-password')

	function clearAllInputs() {
		const allInputs = [
			signupUsername,
			signupName,
			signupEmail,
			signupPassword,
			signinUsername,
			signinPassword,
		]

		allInputs.forEach((input) => {
			input.value = ''
			input.removeAttribute('style')
		})
	}

	function isSignUpPage() {
		if (hasAccessParameter && window.innerWidth > 700) {
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

			allElements.forEach(
				(el) => (el.style = 'transition: none; animation: none')
			)
			container.classList.add('right-panel-active')

			setTimeout(() => {
				allElements.forEach((el) => el.removeAttribute('style'))
			}, 800)
		}

		function addParameter(parameter) {
			const url = window.location.href

			const newUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + parameter
			window.history.pushState({ path: newUrl }, '', newUrl)
		}

		function removeParameter(parameter) {
			const url = window.location.href

			const newUrl = url.replace(new RegExp('[?&]' + parameter), '')
			window.history.replaceState({ path: newUrl }, '', newUrl)
		}

		btnMoveToSignUp.addEventListener('click', (e) => {
			container.classList.add('right-panel-active')
			addParameter('cadastro')
			clearAllInputs()
		})

		btnMoveToSignIn.addEventListener('click', (e) => {
			container.classList.remove('right-panel-active')
			removeParameter('cadastro')
			clearAllInputs()
		})
	}

	function showValidateInput(isValid, element) {
		if (isValid) {
			element.style = 'border: 1px solid green'
			return true
		}

		element.style = 'border: 1px solid red'
		return false
	}

	function validateUsername(username) {
		if (username.length < 3 || username.length > 16) return false

		if (!/^[a-zA-Z0-9_.]+$/.test(username)) return false

		if (/^[_.]|[_\.]$/.test(username)) return false

		return true
	}

	function validateName(name) {
		if (name.length < 2) return false

		if (!/^[a-zA-Z\s]+$/.test(name)) return false

		return true
	}

	function validateEmail(email) {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		return regex.test(email)
	}

	function validatePassword(password) {
		if (password.length < 8) return false

		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

		return regex.test(password)
	}

	const errorMessages = {
		userNotFound: 'Usuário não encontrado',
		wrongPassword: 'Senha incorreta',
		usernameTaken: 'Nome de usuário já existe',
		emailTaken: 'E-mail já existe',
	}

	function goToSignIn() {
		if (window.innerWidth > 700) btnMoveToSignIn.click()
		else window.location.href = './access.html'
	}

	function signUp() {
		const newAccount = {
			username: signupUsername.value,
			name: signupName.value,
			email: signupEmail.value,
			password: signupPassword.value,
		}

		const errors = []

		if (localStorage.getItem('accounts') === null) {
			const accounts = [newAccount]
			localStorage.setItem('accounts', JSON.stringify(accounts))
			goToSignIn()
		} else {
			const registeredAccounts = localStorage.getItem('accounts')
			const registeredAccountsObj = JSON.parse(registeredAccounts)

			const hasSameInfo = registeredAccountsObj.find((account) => {
				if (account.username == newAccount.username)
					errors.push(errorMessages.usernameTaken)
				if (account.email == newAccount.email)
					errors.push(errorMessages.emailTaken)
				if (errors.length > 0) return true
			})

			if (hasSameInfo) {
				document.querySelector('.sign-up-container .errors').innerHTML = errors
					.map((e) => `<li>${e}</li>`)
					.join('\n')
			} else {
				registeredAccountsObj.push(newAccount)
				localStorage.setItem('accounts', JSON.stringify(registeredAccountsObj))

				goToSignIn()
			}
		}
	}

	function signIn(userInfo) {
		localStorage.setItem('login', JSON.stringify(userInfo))
	}

	btnSignUp.addEventListener('click', (e) => {
		e.preventDefault()

		const username = showValidateInput(
			validateUsername(signupUsername.value),
			signupUsername
		)
		const name = showValidateInput(validateName(signupName.value), signupName)
		const email = showValidateInput(
			validateEmail(signupEmail.value),
			signupEmail
		)
		const password = showValidateInput(
			validatePassword(signupPassword.value),
			signupPassword
		)

		const isValidRegister = username && name && email && password

		if (isValidRegister) {
			signUp()
		}
	})

	btnSignIn.addEventListener('click', (e) => {
		e.preventDefault()

		const isUsernameValid = showValidateInput(
			validateUsername(signinUsername.value),
			signinUsername
		)
		const isPasswordValid = showValidateInput(
			validatePassword(signinPassword.value),
			signinPassword
		)

		if (isUsernameValid && isPasswordValid) {
			const errors = []

			const jsonAccounts = localStorage.getItem('accounts')

			if (jsonAccounts) {
				const accounts = JSON.parse(jsonAccounts)

				const userInfo = accounts.find((account) => {
					if (account.username == signinUsername.value) {
						if (account.password == signinPassword.value) {
							return account
						}

						errors.push(errorMessages.wrongPassword)
					}
				})

				if (userInfo) {
					signIn(userInfo)
					window.location.href = '.././../index.html'
				} else if (!errors.includes(errorMessages.wrongPassword)) {
					errors.push(errorMessages.userNotFound)
				}
			} else {
				errors.push(errorMessages.userNotFound)
			}

			document.querySelector('.sign-in-container .errors').innerHTML =
				errors.map((e) => `<li>${e}</li>`)
		}
	})

	const fieldsToValidateOnInput = [
		[signupUsername, validateUsername],
		[signupName, validateName],
		[signupEmail, validateEmail],
		[signupPassword, validatePassword],
		[signinUsername, validateUsername],
		[signinPassword, validatePassword],
	]

	fieldsToValidateOnInput.forEach(([element, validateFn]) => {
		element.addEventListener('input', () => {
			showValidateInput(validateFn(element.value), element)
		})
	})

	function isMobileWidth() {
		throttle(() => {
			const hasParameter = new URLSearchParams(window.location.search).has(
				'cadastro'
			)

			if (window.innerWidth <= 700) {
				if (hasParameter) signupContainer.style.display = 'block'
				else signinContainer.style.display = 'block'
			} else {
				signupContainer.removeAttribute('style')
				signinContainer.removeAttribute('style')
			}
		}, 300)
	}

	window.addEventListener('resize', isMobileWidth)

	isSignUpPage()
	isMobileWidth()
})()
