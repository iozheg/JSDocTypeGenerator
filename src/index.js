import hljs from 'highlight.js/lib/highlight';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css';
import json2jsdoc from "./json2JSDocParser";
import "./style.css";


hljs.registerLanguage('json', json);
hljs.initHighlightingOnLoad();

const inputTextArea = document.getElementById("input-textarea");
const outputArea = document.getElementById("output-textarea");

function highlightJsdoc(jsdocString) {
  return jsdocString
    .replace(/(@[\S]+)/g, "<span class='jsdoc-tag'>$1</span>")
    .replace(/({[\S]+})/g, "<span class='jsdoc-type'>$1</span>");
}

/**
 * Clears text formatting and prettifies JSON.
 * Div with 'contenteditable' receives formatting with text so we
 * need remove this formatting using div.innerText that returns only text.
 * Than we try prettify input using JSON methods and <pre>.
 * After this call highlight.js to highlight syntax.
 */
function formatInputText(event) {
  if (event.inputType !== "insertFromPaste") return;

  let inputText = this.innerText;
  try {
    inputText = JSON.stringify(JSON.parse(inputText), null, 2);
  } catch (e) {}

  this.innerHTML = "<pre>" + inputText + "</pre>";
  hljs.highlightBlock(inputTextArea);
}

function getParsedInput(inputData) {
  const inputString = inputData || inputTextArea.innerText;

  if (!inputString || inputString.length === 0) {
    throw "Empty JSON!";
  }
  try {
    return JSON.parse(inputString);
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
    outputArea.innerHTML += highlightJsdoc(`${result}\n`);
  } else {
    return result;
  }
}
function component() {
  const button = document.getElementById("parse-button");
  button.onclick = parseJson;

  inputTextArea.addEventListener("input", formatInputText);
  hljs.highlightBlock(inputTextArea);
}
component();