/** Renders a device's parameters into the parameter list. */

const parameterList = document.querySelector("#parameter-rows");
const parameterTemplate = document.querySelector("#parameter-row");

function createRow(parameter) {
  const row = parameterTemplate.content.firstElementChild.cloneNode(true);

  for (const input of row.querySelectorAll("[data-field]")) {
    const value = parameter[input.dataset.field];

    if (input.type === "checkbox") {
      input.checked = value;
    } else {
      input.value = value;
    }
  }

  return row;
}

export function renderParameters(parameters) {
  parameterList.replaceChildren(...parameters.map(createRow));
}
