import json2jsdoc from "./json2JSDocParser";
import "./style.css";

const inputTextArea = document.getElementById("input-textarea");
const outputArea = document.getElementById("output-textarea");

function getParsedInput(inputData) {
  const inputString = inputData || inputTextArea.value;

  if (!inputString || inputString.length === 0) {
    throw "Empty JSON!";
  }
  try {
    return JSON.parse(inputTextArea.value);
  } catch (e) {
    console.log(e);
    throw "Error in JSON!";
  }
}

function parseJson() {
  let result;
  try {
    const inputData = getParsedInput();
    result = json2jsdoc(inputData);
  } catch (e) {
    result = e;
  }

  if (outputArea) {
    outputArea.innerHTML = "";
    outputArea.innerHTML += `${result}\n`;
  } else {
    return result;
  }
}
function component() {

  const button = document.getElementById("parse-button");
  button.onclick = parseJson;
}
component();