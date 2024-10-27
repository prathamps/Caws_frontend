let project_id
let selectedFileId
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
