import "./style.css";

const inputTextArea = document.getElementById("input-textarea");
const outputArea = document.getElementById("output-textarea");
/** @type {{name: string, object: object}[]} */
const typeObjectList = [];

function objectToJSDoc(object, typeName) {
  let outputString = "";
  const keys = Object.keys(object);

  for (const key of keys) {
    outputString += ` * @property {${object[key]}} ${key}\n`;
  }
  
  outputString = `/**\n * @typedef {object} ${typeName || 'type1'
    }\n${outputString} */`;
  return outputString;
}

function toJSDoc(data, typeName) {
  if (typeof data === "object") return objectToJSDoc(data, typeName);
  return `/**\n * @typedef ${data} ${typeName || 'TYPE'}\n*/`;
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
  const value = array[0];
  let type = getValueType(value);
    if (type === "array") {
      if (value.length > 0) type = `${getArrayElementType(value)}[]`;
    } else if (type === "object") {
      const newTypeName = `TYPE${typeObjectList.length}`;
      typeObjectList.push({
        name: newTypeName,
        object: value,
      });
      type = newTypeName;
}
  return type;
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
    } else if (type === "object") {
      const newTypeName = `TYPE${typeObjectList.length}`;
      typeObjectList.push({
        name: newTypeName,
        object: value,
      });
      type = newTypeName;
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

  outputArea.innerHTML = "";
  let inputData;
  let result;
  try {
    if (!inputTextArea.value || inputTextArea.value.length === 0) {
      result = "Empty JSON!";
    } else {
      inputData = JSON.parse(inputTextArea.value);
      const output = getDataType(inputData);
      result = toJSDoc(output, "TYPE");
    }
  } catch (e) {
    console.log(e);
    result = "Error in JSON!";
  }
  parseAllObjects();
  outputArea.innerHTML += `${result}\n`;
}

function parseAllObjects() {
  while (true) {
    const currentTypeObject = typeObjectList.pop();
    if (!currentTypeObject) break;

    const parsedObject = parseObject(currentTypeObject.object);
    const result = toJSDoc(parsedObject, currentTypeObject.name);

  outputArea.innerHTML += `${result}\n`;

  }
}

function getDataType(data) {
  let type = getValueType(data);
  if (type === "array") {
    if (data.length > 0) type = `${getArrayElementType(data)}[]`;
  } else if (type === "object") {
    type = parseObject(data);
  }
  return type;
}

function component() {

  const button = document.getElementById("parse-button");
  button.onclick = parse;
}
component();