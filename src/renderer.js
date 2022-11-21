import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./index.css";
import { Grid } from "ag-grid-community";
import React from "react";
import { createRoot } from "react-dom/client";
import Title from "./Component/Title";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <div>
    <Title />
  </div>
);

let rowData = [];

const columnDefs = [
  { field: "task", editable: true, flex: 1 },
  {
    field: "completed",
    width: 120,
    cellRenderer(params) {
      const input = document.createElement("input");

      input.type = "checkbox";
      input.checked = params.value;
      input.classList.add("checkbox");
      input.addEventListener("change", (event) => {
        params.setValue(input.checked);
      });

      return input;
    },
  },
  {
    field: "remove",
    width: 100,
    cellRenderer(params) {
      const button = document.createElement("button");

      button.textContent = "✕";
      button.classList.add("btn", "remove-btn");
      button.addEventListener("click", () => removeTodo(params.rowIndex));

      return button;
    },
  },
];
const gridOptions = {
  columnDefs,
  rowData,
};
const saveBtn = document.getElementById("save-btn");
const restoreBtn = document.getElementById("restore-btn");
const addBtn = document.getElementById("add-btn");
const sortBtn = document.getElementById("sort");

const addTodo = () => {
  rowData = [...rowData, { task: "New Task", completed: false }];
  gridOptions.api.setRowData(rowData);
};
const removeTodo = (rowIndex) => {
  rowData = rowData.filter((value, index) => {
    return index !== rowIndex;
  });
  gridOptions.api.setRowData(rowData);
};
const saveToFile = () => {
  window.todoAPI.saveToFile(JSON.stringify(rowData));
};
const restoreFromFile = async () => {
  const result = await window.todoAPI.restoreFromFile();

  if (result.success) {
    rowData = JSON.parse(result.data);
    gridOptions.api.setRowData(rowData);
  }
};
// const filtered = () => {
//   rowData = rowData.map((obj) => {
//     if (obj.completed === false) {
//       return obj;
//     }
//   });
// };
const titleRow = [{ title: "title" }];
const titleComlumnDef = [{ field: "title", editable: true, flex: 1 }];

const titleGridOptions = {
  titleRow,
  titleComlumnDef,
};
const setupGrid = () => {
  const gridDiv = document.getElementById("grid");
  const title = document.getElementById("title");

  new Grid(gridDiv, gridOptions);
  addBtn.addEventListener("click", addTodo);
  saveBtn.addEventListener("click", saveToFile);
  restoreBtn.addEventListener("click", restoreFromFile);
  //   sortBtn.addEventListener("click", filtered);
  //   title.addEventListener("input", (event) => {
  //     placeholder = event.target.value;
  //   });
};

document.addEventListener("DOMContentLoaded", setupGrid);
