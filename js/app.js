const backendUrl = "http://localhost:3000"

let project_id
let selectedFileId
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
		fetchUserData()
		loadProjects()
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

//Fetching User Data
async function fetchUserData() {
	try {
		const response = await fetch(`${backendUrl}/account/user`, {
			method: "GET",
			credentials: "include",
		})

		if (response.ok) {
			const userData = await response.json()
			console.log(userData)
		} else {
			alert("Failed to fetch user details. Please log in again.")
		}
	} catch (error) {
		console.error("Error fetching user details:", error)
	}
}

// Create Project
document.getElementById("create-project-form").onsubmit = async (e) => {
	e.preventDefault()
	const projectName = document.getElementById("project-name").value

	const response = await fetch(`${backendUrl}/user/project`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		credentials: "include",
		body: JSON.stringify({ name: projectName }),
	})

	if (response.ok) loadProjects()
}

// Load Projects
async function loadProjects() {
	const response = await fetch(`${backendUrl}/user/projects`, {
		method: "GET",
		credentials: "include",
	})
	const projects = await response.json()
	console.log(projects)
	document.getElementById("projects").innerHTML = projects.projects
		.map(
			(p) => `
    <div>
      <h3>${p.name}</h3>
      <button class="project" onclick="selectProject('${p.id}')">Delete</button>
    </div>
  `
		)
		.join("")
}

// Define the function on the window object
window.selectProject = function (p_id) {
	project_id = p_id
}

// Upload File
document.getElementById("file-upload-form").onsubmit = async (e) => {
	e.preventDefault()
	const fileInput = document.getElementById("file-input").files[0]
	const formData = new FormData()
	formData.append("file", fileInput)

	const response = await fetch(
		`${backendUrl}/user/project/${project_id}/file`,
		{
			method: "POST",
			body: formData,
			credentials: "include",
		}
	)

	if (response.ok) {
		loadFilesForProject()
		alert("File uploaded successfully!")
	}
}

// Fetch Files for a Selected Project
// Frontend
async function loadFilesForProject() {
	const response = await fetch(
		`${backendUrl}/user/project/${project_id}/files`,
		{
			method: "GET",
			credentials: "include",
		}
	)

	if (response.ok) {
		const files = await response.json()
		console.log(files)

		document.getElementById("files").innerHTML = files
			.map(
				(file) => `
      <div>
        <h4>File ID: ${file.id}</h4>
        <p>Added By: ${file.addedBy}</p>
        <p>Has Drawing: ${file.hasDrawing}</p>
        <img src="${file.downloadURL}" alt="Uploaded File Image" style="max-width: 300px; max-height: 300px;" />
        <button onclick="loadComments('${file.projectId}','${file.id}')">View Comments</button>
      </div>
    `
			)
			.join("")
	} else {
		alert("Failed to load files.")
	}
}

// Select File and Load Comments
window.loadComments = function (projectId, fileId) {
	selectedFileId = fileId
	project_id = projectId
	console.log(project_id)
}

// Add Comment
document.getElementById("add-comment-form").onsubmit = async (e) => {
	e.preventDefault()
	const content = document.getElementById("comment-input").value
	const hasDrawing = document.getElementById("has-drawing").checked
	let canvasToDataURL
	const response = await fetch(
		`${backendUrl}/user/projects/${project_id}/files/${selectedFileId}/addcomment`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ content, hasDrawing, canvasToDataURL }),
		}
	)

	if (response.ok) {
		alert("Comment added successfully!")
		loadCommentsForFile()
	}
}

// Fetch Comments for a Selected File
async function loadCommentsForFile() {
	const response = await fetch(
		`${backendUrl}/user/projects/${project_id}/files/${selectedFileId}/getcomments`,
		{
			method: "GET",
			credentials: "include",
		}
	)

	if (response.ok) {
		const data = await response.json()
		const comments = data.comments // Assuming the response structure contains a 'comments' property
		console.log(comments)
		document.getElementById("comments").innerHTML = comments
			.map(
				(comment) => `
      <div>
        <p>Comment: ${comment.content}</p>
        <p>Created By: ${comment.createdBy}</p>
        <p>Has Drawing: ${comment.hasDrawing ? "Yes" : "No"}</p>
        <p>Created At: ${new Date(comment.createdAt).toLocaleString()}</p>
      </div>
    `
			)
			.join("")
	} else {
		alert("Failed to load comments.")
	}
}
