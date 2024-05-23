const drawGrid = (ctx, xScale, yScale, width, height) => {
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;

  ctx.beginPath();

  for (let x = 0; x < width; x += xScale) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  for (let y = 0; y < height; y += yScale) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.stroke();
}

const plotFunction = (ctx, xScale, yScale, width, height, f) => {
  ctx.strokeStyle = "#FF0000";
  ctx.lineWidth = 3;

  const step = 1 / xScale;

  ctx.beginPath();

  for (let x = 0; x < width; x += 1) {
    const x0 = (x - width / 2) * step;
    const x1 = x0 + step;

    const y0 = height / 2 - yScale * f(x0);
    const y1 = height / 2 - yScale * f(x1);

    ctx.moveTo(x, y0);
    ctx.lineTo(x + 1, y1);
  }

  ctx.stroke();
}

const parseSignal = (xs) => {
  const signalType = xs[0];
  const signalAmp = parseFloat(xs[1]);
  const signalFreq = parseFloat(xs[2]);
  const signalShift = parseFloat(xs[3]);

  if (signalType == "s") {
    return (x) => signalAmp * Math.sin(signalFreq * x + signalShift);
  }
  else if (signalType == "c") {
    return (x) => signalAmp * Math.cos(signalFreq * x + signalShift);
  }
}

const parseSignals = (xs) => {
  const fs = [(x) => 0]

  for (let i = 0; i < xs.length; i += 1) {
    const signal = xs[i].split(',');
    if (signal.length == 4) {
      fs[i + 1] = (x) => fs[i](x) + parseSignal(signal)(x);
    }
  }

  return fs[fs.length - 1];
}

const redraw = (text, xScale, yScale) => {
  const canvas = document.getElementById("signal_canvas");
  const width = canvas.width;
  const height = canvas.height;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);

  const xdist = width / (2 * xScale);
  const ydist = height / (2 * yScale);

  drawGrid(ctx, xdist, ydist, width, height);

  plotFunction(ctx, xdist, ydist, width, height, parseSignals(text.split(";")));
}

const signals_input = document.getElementById("signals_input");
let signals = "s,1,1,0;";

const xscale_input = document.getElementById("xscale_input");
let xscale = 4;

const yscale_input = document.getElementById("yscale_input");
let yscale = 2;

const update = () => {
  signals = signals_input.value;
  
  const xs = parseFloat(xscale_input.value);
  xs != 0 && (xscale = xs);

  const ys = parseFloat(yscale_input.value);
  ys != 0 && (yscale = ys);

  redraw(signals, xscale, yscale);
}

signals_input.oninput = update;
xscale_input.oninput = update;
yscale_input.oninput = update;

window.addEventListener("load", () => {
  signals_input.value = signals;
  xscale_input.value = xscale.toString();
  yscale_input.value = yscale.toString();

  update();
});