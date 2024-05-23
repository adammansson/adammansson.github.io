const serversInput = document.getElementById("servers_input");
const trafficInput = document.getElementById("traffic_input");
const calculateButton = document.getElementById("calculate_button");
const resultTextfield = document.getElementById("result_textfield");

let serversText = "0";
let trafficText = "0.0";
let resultText = "0";

const calculateErlang = (servers, traffic) => {
  if (servers === 0) {
    return 1;
  }

  const next = calculateErlang(servers - 1, traffic);
  const numerator = traffic * next;
  const denominator = servers + numerator;

  return numerator / denominator;
};

const update = () => {
  serversInput.value = serversText;
  trafficInput.value = trafficText;
  resultTextfield.textContent = resultText;
};

const calculate = () => {
  serversNumber = parseFloat(serversInput.value);
  trafficNumber = parseFloat(trafficInput.value);

  if (isNaN(serversNumber) || !Number.isInteger(serversNumber)) {
    serversText = "0";
    resultText = "ERROR";
  } else if (isNaN(trafficNumber)) {
    trafficText = "0.0";
    resultText = "ERROR";
  }
  else {
    serversText = serversNumber;
    trafficText = trafficNumber;
    resultText = calculateErlang(serversNumber, trafficNumber).toFixed(5);
  }

  update();
};

const handleEnter = (e) => {
  if (e.key === "Enter") {
    calculateButton.click();
  }
};

calculateButton.onclick = calculate;
serversInput.onclick = () => serversInput.value = "";
serversInput.onkeyup = handleEnter;
trafficInput.onclick = () => trafficInput.value = "";
trafficInput.onkeyup = handleEnter;

window.addEventListener("load", () => {
  update();
});