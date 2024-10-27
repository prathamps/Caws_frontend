const backendUrl = "http://localhost:3000"

// User Registration
if (document.getElementById("signup-form") !== null) {
	document.getElementById("signup-form").onsubmit = async (e) => {
		e.preventDefault()

		const email = document.getElementById("signup-email").value
		const name = document.getElementById("signup-name").value
		const password = document.getElementById("signup-password").value

		try {
			const response = await fetch(`${backendUrl}/account/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, name, password }),
			})

			if (response.ok) {
				const data = await response.json()
				alert(data.message)
				window.location.href = "login.html"
			} else {
				const errorData = await response.json()
				alert(errorData.error || "Failed to register.")
			}
		} catch (error) {
			console.error("Error during registration:", error)
			alert("An error occurred during registration. Please try again.")
		}
	}
}

// User Login
if (document.getElementById("login-form") !== null) {
	console.log("HEllo")
	document.getElementById("login-form").onsubmit = async (e) => {
		e.preventDefault()
		const email = document.getElementById("email").value
		const password = document.getElementById("password").value

		const response = await fetch(`${backendUrl}/account/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, password }),
		})

		if (response.ok) {
			alert("Logged in successfully!")
			window.location.href = "dashboard.html"
		} else {
			alert("Failed to login.")
		}
	}
}
// Logout
if (document.getElementById("logout-btn") !== null)
	document.getElementById("logout-btn").onclick = async () => {
		const response = await fetch(`${backendUrl}/account/logout`, {
			method: "POST",
		})
		if (response.ok) alert("Logged out successfully!")
	}
