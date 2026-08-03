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

/** Appends one row without rebuilding the list, so focus is left alone. */
export function appendParameter(parameter) {
  parameterList.append(createRow(parameter));
}

const rowIndex = (element) =>
  [...parameterList.children].indexOf(element.closest(".parameter"));

export function onParameterRemove(handler) {
  parameterList.addEventListener("click", (event) => {
    if (!event.target.matches(".parameter-remove")) {
      return;
    }

    const row = event.target.closest(".parameter");
    handler(rowIndex(event.target));
    row.remove();
  });
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

    handler(
      rowIndex(input),
      field,
      input.type === "checkbox" ? input.checked : input.value,
    );
  });
}
