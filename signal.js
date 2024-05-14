const drawGrid = (ctx, width, height) => {
  ctx.strokeStyle = "#000000";

  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);

  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);

  ctx.stroke();
}

const plotFunction = (ctx, scale, width, height, f) => {
  ctx.strokeStyle = "#FF0000";

  ctx.beginPath();
  for (let x = -width / 2; x < width / 2 - 1; x += 1) {
    ctx.moveTo(x + width / 2, height / 2 + -(f(x / (2 * Math.PI)) * scale));
    ctx.lineTo(x + width / 2 + 1, height / 2 + -(f((x + 1) / (2 * Math.PI)) * scale));
  }
  ctx.stroke();
}

const parseSignal = (xs) => {
  const signalType = xs[0];
  const signalAmp = xs[1];
  const signalFreq = xs[2];

  if (signalType == "s") {
    return (x) => parseInt(signalAmp) * Math.sin(signalFreq * x);
  }
  else if (signalType == "c") {
    return (x) => parseInt(signalAmp) * Math.cos(signalFreq * x);
  }
}

const parseSignals = (signalsText) => {
  const fs = [(x) => 0]

  const signals = signalsText.split(';');
  for (let i = 0; i < signals.length; i += 1) {
    const signal = signals[i].split(',');
    if (signal.length == 3) {
      fs[i + 1] = (x) => fs[i](x) + parseSignal(signal)(x);
    }
  }

  return fs[fs.length - 1];
}

const draw = (f) => {
  const canvas = document.getElementById("signal_canvas");
  const width = canvas.width;
  const height = canvas.height;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);

  drawGrid(ctx, width, height);
  plotFunction(ctx, 20, width, height, f);
}

const input = document.getElementById("signal_input");
input.oninput = () => {
  const text = input.value;
  console.log(text);

  draw(parseSignals(text));
}