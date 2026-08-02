import {
  getOutputs,
  isSupported,
  onPortsChanged,
  requestAccess,
} from "./midi.js";

const outputSelect = document.querySelector("#midi-output");
const refreshButton = document.querySelector("#refresh-ports");
const statusLine = document.querySelector("#midi-status");

let connected = false;

function setStatus(message) {
  statusLine.textContent = message;
}

function placeholderOption(label) {
  const option = document.createElement("option");
  option.value = "";
  option.textContent = label;
  return option;
}

function renderOutputs() {
  const outputs = getOutputs();

  if (outputs.length === 0) {
    outputSelect.replaceChildren(placeholderOption("No ports available"));
    setStatus("No MIDI output ports found. Connect a device and refresh.");
    return;
  }

  // Keep the current selection if that port is still present.
  const selected = outputSelect.value;

  outputSelect.replaceChildren(
    ...outputs.map((output) => {
      const option = document.createElement("option");
      option.value = output.id;
      option.textContent = output.name;
      return option;
    }),
  );

  if (outputs.some((output) => output.id === selected)) {
    outputSelect.value = selected;
  }

  setStatus(`${outputs.length} MIDI output port(s) available.`);
}

async function connect() {
  if (!isSupported()) {
    setStatus("Web MIDI is not supported in this browser. Use Chrome or Edge.");
    outputSelect.disabled = true;
    refreshButton.disabled = true;
    return;
  }

  try {
    await requestAccess();
  } catch (error) {
    setStatus(`Could not access MIDI: ${error.message}`);
    return;
  }

  connected = true;
  onPortsChanged(renderOutputs);
  renderOutputs();
}

refreshButton.addEventListener("click", () => {
  if (connected) {
    renderOutputs();
  } else {
    connect();
  }
});

connect();
