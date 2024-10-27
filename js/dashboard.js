const backendUrl = "http://localhost:3000"

let project_id
let selectedFileId
// Logout
document.getElementById("logout-btn").onclick = async () => {
	const response = await fetch(`${backendUrl}/account/logout`, {
		method: "POST",
	})
	if (response.ok) {
		alert("Logged out successfully!")
		window.location.href = "home.html"
	}
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

	if (response.ok) {
		loadProjects()
		document.getElementById("add-project-btn").click()
	}
}
loadProjects()
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
    
      <button class="project-button" onclick="selectProject('${p.id}', '${p.name}')">${p.name}</button>
    
  `
		)
		.join("")
}

// Define the function on the window object
window.selectProject = function (p_id, p_name) {
	document.getElementById("project-heading").innerText = p_name
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
      <div class="image-card" >
		<div class="image-card-img-container">	
        <img src="${file.downloadURL}" alt="${file.addedBy}" style="max-width: 300px; max-height: 300px;" />
		</div>	
		<div class="image-actions">
			<button class="image-button" onclick="toggleImageAction(this)">
				<img src="./images/open.png" alt="📂" class="file_tool_icon" />
			</button>
			<button
				class="image-button"
				alt="✏️"
				onclick="toggleImageAction(this)"
			>
				<img src="./images/edit.png" alt="📂" class="file_tool_icon" />
			</button>
			<button
				class="image-button"
				alt="🗑️"
				onclick="toggleImageAction(this)"
			>
				<img src="./images/trash.png" alt="📂" class="file_tool_icon" />
			</button>
		</div>
      </div>
    `
			)
			.join("")
	} else {
		alert("Failed to load files.")
	}
}
