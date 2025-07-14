const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const penBtn = document.getElementById("penBtn");
const eraserBtn = document.getElementById("eraserBtn");

let isDrawing = false;
let color = document.getElementById("colorPicker").value;
let lineWidth = document.getElementById("lineWidth").value;
let alpha = document.getElementById("alpha").value;
let isErasing = false;
let history = [];

function updatePenPreview() {
  const preview = document.getElementById("penPreview");
  preview.style.backgroundColor = isErasing ? "#ffffff" : color;
  preview.style.opacity = alpha;
  preview.style.width = `${lineWidth}px`;
  preview.style.height = `${lineWidth}px`;
}

// 描画イベント
canvas.addEventListener("mousedown", (e) => {
  saveHistory();
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDrawing) return;
  ctx.strokeStyle = isErasing ? "#ffffff" : color;
  ctx.lineWidth = lineWidth;
  ctx.globalAlpha = alpha;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
  ctx.closePath();
});

// 入力系のイベント
document.getElementById("colorPicker").addEventListener("change", (e) => {
  color = e.target.value;
  updatePenPreview();
});
document.getElementById("lineWidth").addEventListener("input", (e) => {
  lineWidth = e.target.value;
  updatePenPreview();
});
document.getElementById("alpha").addEventListener("input", (e) => {
  alpha = e.target.value;
  updatePenPreview();
});

// 操作関数
function clearCanvas() {
  saveHistory();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function enableEraser() {
  isErasing = true;
  eraserBtn.classList.add("active-button");
  penBtn.classList.remove("active-button");
  
  updatePenPreview();
}

function disableEraser() {
  isErasing = false;
  penBtn.classList.add("active-button");
  eraserBtn.classList.remove("active-button");

  updatePenPreview();
}

function saveHistory() {
  if (history.length >= 10) history.shift();
  history.push(canvas.toDataURL());
}

function undo() {
  if (history.length === 0) return;
  const img = new Image();
  img.src = history.pop();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
    ctx.drawImage(img, 0, 0);
  };
}

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    undo();
  }
});

updatePenPreview(); // 初期表示
