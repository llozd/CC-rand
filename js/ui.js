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

/**
 * Reports edits to the parameter rows as (index, field, value). The row's
 * position is read at event time, so it stays correct as rows come and go.
 */
export function onParameterEdit(handler) {
  parameterList.addEventListener("input", (event) => {
    const input = event.target;
    const field = input.dataset.field;

    if (!field) {
      return;
    }

    const row = input.closest(".parameter");
    const index = [...parameterList.children].indexOf(row);

    handler(index, field, input.type === "checkbox" ? input.checked : input.value);
  });
}
