let throttleTimer

export function throttle(callback, time) {
	if (throttleTimer) return

	throttleTimer = true

	setTimeout(() => {
		callback()
		throttleTimer = false
	}, time)
}
