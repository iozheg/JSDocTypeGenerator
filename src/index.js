import hljs from 'highlight.js/lib/highlight';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/github.css';

import json2jsdoc from "./json2JSDocParser";
import { objComplex } from "./mocks";
import "./style.css";


hljs.registerLanguage('json', json);
hljs.initHighlightingOnLoad();

const inputTextArea = document.getElementById("input-textarea");
const outputArea = document.getElementById("output-textarea");

function highlightJsdoc(jsdocString) {
  const formattedString = jsdocString
    .replace(/(@[\S]+)/g, "<span class='jsdoc-tag'>$1</span>")
    .replace(/({[\S]+})/g, "<span class='jsdoc-type'>$1</span>");
  return `<pre>${formattedString}</pre>`;
}

/**
 * Clears text formatting and prettifies JSON.
 * Div with 'contenteditable' receives formatting with text so we
 * need remove this formatting using div.innerText that returns only text.
 * Than we try prettify input using JSON methods and <pre>.
 * After this call highlight.js to highlight syntax.
 */
function formatInputText(event) {
  if (event && event.inputType !== "insertFromPaste") return;

  let inputText = this.innerText;
  try {
    inputText = JSON.stringify(JSON.parse(inputText), null, 2);
  } catch (e) {}

  this.innerHTML = `<pre>${inputText}</pre>`;
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

function CopyToClipboard(containerid) {
  if (document.selection) { 
    const range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select().createTextRange();
    document.execCommand("copy"); 
    range
  } else if (window.getSelection) {
    const range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
  }
}

function component() {
  const parseButton = document.getElementById("parse-button");
  parseButton.onclick = parseJson;

  const clearButton = document.getElementById("clear-button");
  clearButton.onclick = () => {
    inputTextArea.innerText = "";
    outputArea.innerHTML = "";
  };

  const sampleButton = document.getElementById("sample-button");
  sampleButton.onclick = () => {
    inputTextArea.innerText = JSON.stringify(objComplex);
    formatInputText.call(inputTextArea);
  }

  const clipboardButton = document.getElementById("clipboard-button");
  clipboardButton.onclick = () => {
    CopyToClipboard(outputArea.id);
  }

  inputTextArea.addEventListener("input", formatInputText);
  hljs.highlightBlock(inputTextArea);
}
component();