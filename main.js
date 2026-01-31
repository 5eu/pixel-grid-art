// Canvas setup
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d', { willReadFrequently: true })

// State
let gridSize = 32
let pixelSize = 16
let currentColor = '#000000'
let currentTool = 'draw'
let isDrawing = false
let history = []
let historyStep = 0

// Quick palette colors
const paletteColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00',
  '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#FF8800', '#88FF00', '#0088FF', '#8800FF',
  '#808080', '#C0C0C0', '#800000', '#008000'
]

// Initialize
function init() {
  setupCanvas()
  setupEventListeners()
  setupPalette()
  saveState()
}

function setupCanvas() {
  canvas.width = gridSize * pixelSize
  canvas.height = gridSize * pixelSize
  
  // Fill with white background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  drawGrid()
}

function drawGrid() {
  ctx.strokeStyle = '#E0E0E0'
  ctx.lineWidth = 1
  
  for (let i = 0; i <= gridSize; i++) {
    // Vertical lines
    ctx.beginPath()
    ctx.moveTo(i * pixelSize, 0)
    ctx.lineTo(i * pixelSize, canvas.height)
    ctx.stroke()
    
    // Horizontal lines
    ctx.beginPath()
    ctx.moveTo(0, i * pixelSize)
    ctx.lineTo(canvas.width, i * pixelSize)
    ctx.stroke()
  }
}

function setupEventListeners() {
  // Mouse events
  canvas.addEventListener('mousedown', startDrawing)
  canvas.addEventListener('mousemove', draw)
  canvas.addEventListener('mouseup', stopDrawing)
  canvas.addEventListener('mouseleave', stopDrawing)
  
  // Controls
  document.getElementById('gridSize').addEventListener('change', (e) => {
    gridSize = parseInt(e.target.value)
    setupCanvas()
    saveState()
  })
  
  document.getElementById('pixelSize').addEventListener('input', (e) => {
    pixelSize = parseInt(e.target.value)
    document.getElementById('pixelSizeValue').textContent = pixelSize + 'px'
    setupCanvas()
    saveState()
  })
  
  document.getElementById('colorPicker').addEventListener('input', (e) => {
    currentColor = e.target.value
  })
  
  document.getElementById('tool').addEventListener('change', (e) => {
    currentTool = e.target.value
  })
  
  document.getElementById('clearBtn').addEventListener('click', clearCanvas)
  document.getElementById('downloadBtn').addEventListener('click', downloadImage)
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault()
      undo()
    } else {
      switch(e.key.toLowerCase()) {
        case 'd': currentTool = 'draw'; updateToolSelect(); break
        case 'e': currentTool = 'erase'; updateToolSelect(); break
        case 'f': currentTool = 'fill'; updateToolSelect(); break
        case 'i': currentTool = 'eyedropper'; updateToolSelect(); break
        case 'c': clearCanvas(); break
        case 'z': if (!e.ctrlKey) undo(); break
      }
    }
  })
}

function updateToolSelect() {
  document.getElementById('tool').value = currentTool
}

function setupPalette() {
  const paletteContainer = document.getElementById('paletteColors')
  paletteColors.forEach(color => {
    const colorBox = document.createElement('div')
    colorBox.className = 'palette-color'
    colorBox.style.backgroundColor = color
    colorBox.addEventListener('click', () => {
      currentColor = color
      document.getElementById('colorPicker').value = color
    })
    paletteContainer.appendChild(colorBox)
  })
}

function getPixelCoords(e) {
  const rect = canvas.getBoundingClientRect()
  const x = Math.floor((e.clientX - rect.left) / pixelSize)
  const y = Math.floor((e.clientY - rect.top) / pixelSize)
  return { x, y }
}

function startDrawing(e) {
  isDrawing = true
  const coords = getPixelCoords(e)
  
  if (currentTool === 'fill') {
    floodFill(coords.x, coords.y)
    saveState()
  } else if (currentTool === 'eyedropper') {
    pickColor(coords.x, coords.y)
  } else {
    drawPixel(coords.x, coords.y)
  }
}

function draw(e) {
  if (!isDrawing) return
  if (currentTool === 'fill' || currentTool === 'eyedropper') return
  
  const coords = getPixelCoords(e)
  drawPixel(coords.x, coords.y)
}

function stopDrawing() {
  if (isDrawing && (currentTool === 'draw' || currentTool === 'erase')) {
    saveState()
  }
  isDrawing = false
}

function drawPixel(x, y) {
  if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return
  
  const color = currentTool === 'erase' ? '#FFFFFF' : currentColor
  
  ctx.fillStyle = color
  ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
  
  // Redraw grid lines
  ctx.strokeStyle = '#E0E0E0'
  ctx.lineWidth = 1
  ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize)
}

function pickColor(x, y) {
  if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return
  
  const imageData = ctx.getImageData(x * pixelSize + 1, y * pixelSize + 1, 1, 1)
  const [r, g, b] = imageData.data
  const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  
  currentColor = hex
  document.getElementById('colorPicker').value = hex
  currentTool = 'draw'
  updateToolSelect()
}

function floodFill(startX, startY) {
  if (startX < 0 || startX >= gridSize || startY < 0 || startY >= gridSize) return
  
  // Get target color
  const imageData = ctx.getImageData(startX * pixelSize + 1, startY * pixelSize + 1, 1, 1)
  const targetColor = Array.from(imageData.data.slice(0, 3))
  
  // Get replacement color
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.fillStyle = currentColor
  tempCtx.fillRect(0, 0, 1, 1)
  const replaceData = tempCtx.getImageData(0, 0, 1, 1)
  const replaceColor = Array.from(replaceData.data.slice(0, 3))
  
  // If colors are the same, do nothing
  if (targetColor.every((val, i) => val === replaceColor[i])) return
  
  // Flood fill algorithm
  const stack = [[startX, startY]]
  const visited = new Set()
  
  while (stack.length > 0) {
    const [x, y] = stack.pop()
    const key = `${x},${y}`
    
    if (visited.has(key)) continue
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) continue
    
    // Check color
    const pixelData = ctx.getImageData(x * pixelSize + 1, y * pixelSize + 1, 1, 1)
    const pixelColor = Array.from(pixelData.data.slice(0, 3))
    
    if (!pixelColor.every((val, i) => Math.abs(val - targetColor[i]) < 5)) continue
    
    visited.add(key)
    drawPixel(x, y)
    
    // Add neighbors
    stack.push([x + 1, y])
    stack.push([x - 1, y])
    stack.push([x, y + 1])
    stack.push([x, y - 1])
  }
}

function clearCanvas() {
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  drawGrid()
  saveState()
}

function saveState() {
  // Remove any states after current step
  history = history.slice(0, historyStep + 1)
  
  // Save current state
  history.push(canvas.toDataURL())
  historyStep++
  
  // Limit history to 50 states
  if (history.length > 50) {
    history.shift()
    historyStep--
  }
}

function undo() {
  if (historyStep > 0) {
    historyStep--
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      drawGrid()
    }
    img.src = history[historyStep]
  }
}

function downloadImage() {
  // Create a clean canvas with 4x scale (readable size)
  const scale = 4
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = gridSize * scale
  tempCanvas.height = gridSize * scale
  const tempCtx = tempCanvas.getContext('2d')
  
  // Disable image smoothing for crisp pixels
  tempCtx.imageSmoothingEnabled = false
  
  // Extract pure pixel data and scale up 4x
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      // Sample color from center of grid cell to avoid grid lines
      const centerX = x * pixelSize + Math.floor(pixelSize / 2)
      const centerY = y * pixelSize + Math.floor(pixelSize / 2)
      const pixelData = ctx.getImageData(centerX, centerY, 1, 1)
      
      // Create ImageData for the scaled pixel (4x4)
      const scaledData = tempCtx.createImageData(scale, scale)
      for (let i = 0; i < scaledData.data.length; i += 4) {
        scaledData.data[i] = pixelData.data[0]     // Red
        scaledData.data[i + 1] = pixelData.data[1] // Green
        scaledData.data[i + 2] = pixelData.data[2] // Blue
        scaledData.data[i + 3] = pixelData.data[3] // Alpha
      }
      
      // Place the scaled pixel on the canvas
      tempCtx.putImageData(scaledData, x * scale, y * scale)
    }
  }
  
  // Download crisp 4x scaled pixel art
  const link = document.createElement('a')
  link.download = `pixel-art-${Date.now()}.png`
  link.href = tempCanvas.toDataURL()
  link.click()
}

// Initialize app
init()
