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
