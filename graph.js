let points = [];

const canvas = document.getElementById("graph_canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

const regenerateButton = document.getElementById("regenerate_button");

const pointEquals = (p0, p1) => (p0[0] == p1[0]) && (p0[1] == p1[1]);

const generatePoints = (nbr) => {
  for (let i = 0; i < nbr; i += 1) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    points.push([x, y]);
  }
}

const drawGrid = () => {
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;

  ctx.beginPath();

  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);

  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);

  ctx.stroke();
}

const drawPoints = () => {
  for (let i = 0; i < points.length; i += 1) {
    const p = points[i];

    ctx.beginPath();

    ctx.arc(p[0], p[1], 5, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}

const jarvisCheck = (p0, p1, p2) => {
  const u = [p1[0] - p0[0], p1[1] - p0[1]];
  const v = [p2[0] - p0[0], p2[1] - p0[1]];

  return (u[0] * v[1] - u[1] * v[0]) > 0;
}

const drawHull = () => {
  const convexHull = [];

  let hullPoint = points[0];

  points.forEach(p => {
    if (p[0] < hullPoint[0]) {
      hullPoint = p;
    }
  });

  let i = 0;
  while (true) {
    convexHull.push(hullPoint);

    let endpoint = points[0];

    points.forEach(otherPoint => {
      if (pointEquals(endpoint, hullPoint) || jarvisCheck(hullPoint, otherPoint, endpoint) > 0) {
        endpoint = otherPoint;
      }
    });

    i += 1;

    hullPoint = endpoint;

    if (pointEquals(endpoint, convexHull[0])) {
      break;
    }
  }

  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;

  ctx.beginPath();

  for (let j = 0; j < i; j += 1) {
    const p0 = convexHull[j % i];
    const p1 = convexHull[(j + 1) % i];
    ctx.moveTo(p0[0], p0[1]);

    ctx.lineTo(p1[0], p1[1]);
  }

  ctx.stroke();
}

const redraw = () => {
  ctx.clearRect(0, 0, width, height);

  drawGrid();
  drawPoints();

  drawHull();
}

window.addEventListener("load", () => {
  points = [];
  generatePoints(5);
  redraw();
});

canvas.onclick = (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  points.push([x, y])
  redraw()
}

regenerateButton.onclick = () => {
  points = [];
  generatePoints(10);
  redraw();
}