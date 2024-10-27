const backendUrl = "http://localhost:3000"

// Function to check if user is authenticated
const isAuthenticated = async () => {
	const response = await fetch(`${backendUrl}/account/verify`, {
		method: "GET",
		credentials: "include",
	})

	return response.ok
}

window.onload = async () => {
	const authenticated = await isAuthenticated()

	if (!authenticated) {
		alert("You are not authenticated. Redirecting to login page.")
		window.location.href = "login.html"
	} else {
		console.log("User is authenticated.")
	}
}

// User Login
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

// Logout
document.getElementById("logout-btn").onclick = async () => {
	const response = await fetch(`${backendUrl}/account/logout`, {
		method: "POST",
	})
	if (response.ok) alert("Logged out successfully!")
}
