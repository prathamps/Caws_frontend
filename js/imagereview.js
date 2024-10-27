let canvas, context, canvaso, contexto
let tool
const toolDefault = "line"
const diagrams = []
let originalWidth, originalHeight
let ratio
let viewportImage
const SHRINK_SCALE = 0.3
const img = new Image()

function init() {
	canvaso = document.getElementById("lower_canvas")
	contexto = canvaso.getContext("2d")

	img.src = "./images/collaboration.jpg"
	viewportImage = document.getElementById("viewport_image")
	viewportImage.src = img.src

	img.onload = function () {
		ratio = img.width / img.height
		resizeImage()

		// Set up canvas
		canvas = setupCanvas()
		context = canvas.getContext("2d")

		// Draw the initial image onto the canvas
		contexto.drawImage(img, 0, 0, canvaso.width, canvaso.height)

		img.addEventListener("dragstart", function (e) {
			e.preventDefault()
		})

		canvaso.addEventListener("dragstart", function (e) {
			e.preventDefault()
		})

		setupToolSelection()
		setupCanvasOptions()

		canvas.addEventListener("mousedown", evCanvas, false)
		canvas.addEventListener("mousemove", evCanvas, false)
		canvas.addEventListener("mouseup", evCanvas, false)

		window.addEventListener("resize", resizeCanvas)
	}
}

function resizeImage() {
	const availableHeight = window.innerHeight - window.innerHeight * SHRINK_SCALE
	const availableWidth = window.innerWidth - window.innerWidth * SHRINK_SCALE

	if (img.height > img.width) {
		originalHeight = availableHeight
		originalWidth = originalHeight * ratio

		if (originalWidth > availableWidth) {
			originalWidth = availableWidth
			originalHeight = originalWidth / ratio
		}
	} else {
		originalWidth = availableWidth
		originalHeight = originalWidth / ratio

		if (originalHeight > availableHeight) {
			originalHeight = availableHeight
			originalWidth = originalHeight * ratio
		}
	}

	viewportImage.style.height = `${originalHeight}px`
	viewportImage.style.width = `${originalWidth}px`
	canvaso.width = originalWidth
	canvaso.height = originalHeight
}

function setupCanvas() {
	const container = canvaso.parentNode
	const canvas = document.createElement("canvas")
	canvas.id = "imageTemp"
	container.appendChild(canvas)

	canvas.width = canvaso.width
	canvas.height = canvaso.height

	return canvas
}

function setupCanvasOptions() {
	const canvasOptions = document.querySelectorAll(".coptions")
	canvasOptions.forEach((btn) =>
		btn.addEventListener("click", canvasOptionHandler)
	)
}

function resizeCanvas() {
	resizeImage()
	canvas.width = originalWidth
	canvas.height = originalHeight

	context.lineWidth = originalWidth / canvaso.width
	contexto.lineWidth = originalWidth / canvaso.width

	contexto.drawImage(img, 0, 0, canvaso.width, canvaso.height)
	redrawDiagrams()
}

function redrawDiagrams() {
	contexto.clearRect(0, 0, canvaso.width, canvaso.height)
	contexto.drawImage(img, 0, 0, canvaso.width, canvaso.height)

	diagrams.forEach((diagram) => {
		const savedImage = new Image()
		savedImage.src = diagram
		savedImage.onload = function () {
			contexto.drawImage(savedImage, 0, 0, canvaso.width, canvaso.height)
		}
	})

	viewportImage.style.height = `${canvaso.height}px`
	viewportImage.style.width = `${canvaso.width}px`
}

function canvasOptionHandler(ev) {
	switch (ev.target.id) {
		case "clear":
			context.clearRect(0, 0, canvas.width, canvas.height)
			contexto.clearRect(0, 0, canvaso.width, canvaso.height)
			break

		case "save":
			const dataURL = canvaso.toDataURL()
			diagrams.push(dataURL)
			break

		case "add":
			if (diagrams.length > 0) {
				const img = new Image()
				img.src = diagrams[0]
				img.onload = function () {
					contexto.drawImage(img, 0, 0, canvaso.width, canvaso.height)
				}
			}
			break
	}
}

function setupToolSelection() {
	const toolSelect = document.querySelectorAll('input[name="dtool"]')
	toolSelect.forEach((radio) =>
		radio.addEventListener("change", toolSelectionHandler)
	)

	if (tools[toolDefault]) tool = new tools[toolDefault]()
}

function toolSelectionHandler(ev) {
	if (tools[this.value]) tool = new tools[this.value]()
}

function evCanvas(ev) {
	ev._x = ev.layerX || ev.offsetX
	ev._y = ev.layerY || ev.offsetY

	const func = tool[ev.type]
	if (func) func(ev)
}

const tools = {}

// Pencil tool.
tools.pencil = function () {
	const tool = this // Keep reference to the tool
	this.started = false

	this.mousedown = function (ev) {
		// context.lineWidth = (originalWidth / canvaso.width) * 4
		context.lineWidth = 3

		context.beginPath()
		context.moveTo(ev._x, ev._y)
		tool.started = true
	}

	this.mousemove = function (ev) {
		if (tool.started) {
			context.lineTo(ev._x, ev._y)
			context.stroke()
		}
	}

	this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev)
			tool.started = false
			updateImage()
		}
	}
}

// Rectangle tool.
tools.rect = function () {
	const tool = this
	this.started = false

	this.mousedown = function (ev) {
		tool.started = true
		tool.x0 = ev._x
		tool.y0 = ev._y
	}

	this.mousemove = function (ev) {
		if (!tool.started) return

		const x = Math.min(ev._x, tool.x0),
			y = Math.min(ev._y, tool.y0),
			w = Math.abs(ev._x - tool.x0),
			h = Math.abs(ev._y - tool.y0)

		context.clearRect(0, 0, canvas.width, canvas.height)
		context.lineWidth = (originalWidth / canvaso.width) * 4
		if (w && h) context.strokeRect(x, y, w, h)
	}

	this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev)
			tool.started = false
			updateImage()
		}
	}
}

// Line tool.
tools.line = function () {
	const tool = this
	this.started = false

	this.mousedown = function (ev) {
		tool.started = true
		tool.x0 = ev._x
		tool.y0 = ev._y
	}

	this.mousemove = function (ev) {
		if (!tool.started) return

		context.clearRect(0, 0, canvas.width, canvas.height)
		context.lineWidth = (originalWidth / canvaso.width) * 4
		context.beginPath()
		context.moveTo(tool.x0, tool.y0)
		context.lineTo(ev._x, ev._y)
		context.stroke()
		context.closePath()
	}

	this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev)
			tool.started = false
			updateImage()
		}
	}
}

function updateImage() {
	contexto.drawImage(canvas, 0, 0, canvaso.width, canvaso.height)
	context.clearRect(0, 0, canvas.width, canvas.height)
}

init()

window.addEventListener("resize", resizeCanvas)

const popoverTriggerList = document.querySelectorAll(
	'[data-bs-toggle="popover"]'
)
const popoverList = [...popoverTriggerList].map(
	(popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
)

const popover = new bootstrap.Popover(".popover-dismiss", {
	trigger: "focus",
})
