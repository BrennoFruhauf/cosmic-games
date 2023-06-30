;(() => {
	const btnMoveToSignUp = document.querySelector('#sign-up')
	const btnMoveToSignIn = document.querySelector('#sign-in')
	const btnSignUp = document.querySelector('#btn-register')
	const btnSignIn = document.querySelector('#btn-login')
	const container = document.querySelector('#container')
	const accessParameter = new URLSearchParams(window.location.search).get(
		'cadastro'
	)

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

			allElements.forEach(
				(el) => (el.style = 'transition: none; animation: none')
			)
			container.classList.add('right-panel-active')

			setTimeout(() => {
				allElements.forEach((el) => el.removeAttribute('style'))
			}, 800)
		}

		btnMoveToSignUp.addEventListener('click', (e) => {
			container.classList.add('right-panel-active')
			clearAllInputs()
		})

		btnMoveToSignIn.addEventListener('click', (e) => {
			container.classList.remove('right-panel-active')
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
			btnMoveToSignIn.click()
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
				btnMoveToSignIn.click()
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

			console.log(errors)
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

	isSignUpPage()
})()
