import "./style.css";

const inputTextArea = document.getElementById("input-textarea");
const outputArea = document.getElementById("output-textarea");

function toJSDoc(object) {
  let outputString = "";
  const keys = Object.keys(object);

  for (const key of keys) {
    outputString += ` * @property {${object[key]}} ${key}\n`;
  }
  
  outputString = `/**\n * @typedef {object} type1\n${outputString} */`;
  return outputString;
}

/**
 *
 *
 * @param {*} value
 * @returns
 */
function getValueType(value) {
  switch (typeof value) {
    case "string":
      if(value.length > 0 && !isNaN(Number(value))) return "number";
      return "string";
    case "number":
      return "number";
    case "object":
      if (Array.isArray(value)) return "array";
      return "object";
    case "function":
      return "function";
    case "boolean":
      return "boolean";
    case "undefined":
      return undefined;
    default:
      return undefined;
  }
}

function getArrayElementType(array) {
  return getValueType(array[0]);
}

function parseObject(object) {
  const output = {};

  const keys = Object.keys(object);
  for (const key of keys) {
    const value = object[key];
    console.log(key, value);

    let type = getValueType(value);
    if (type === "array") {
      if (value.length > 0) type = `${getArrayElementType(value)}[]`;
    }
    output[key] = type;
  }

  return output;
}

function parse() {
  const object = {
    name: "Вася",
    age: 35,
    isAdmin: false,
    friends: [0,1,2,3],
    objects: [{}],
    array: [],
    address: {
      city: "mntview",
      street: "google",
      number: 4
    }
  };
  const stringg = '{"name":"Вася","age":35,"isAdmin":false,"friends":[0,1,2,3],"objects":[{}],"array":[],"address":{"city":"mntview","street":"google","number":4}}';
  const json = JSON.stringify(object);
  console.log(json);

  let parsedObject;
  let result;
  try {
    if (!inputTextArea.value || inputTextArea.value.length === 0) {
      result = "Empty JSON!";
    } else {
      parsedObject = JSON.parse(inputTextArea.value);
      const output = parseObject(parsedObject);
      result = toJSDoc(output);
    }
  } catch (e) {
    console.log(e);
    result = "Error in JSON!";
  }
  outputArea.innerHTML =result;
}

function component() {

  const button = document.getElementById("parse-button");
  button.onclick = parse;
}
component();