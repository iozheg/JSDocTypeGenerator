/** @type {{name: string, object: object}[]} */
const typeObjectList = [];
let lastTypeNumber = 0;

function objectToJSDoc(object, typeName) {
  let outputString = "";
  const keys = Object.keys(object);

  for (const key of keys) {
    outputString += ` * @property {${object[key]}} ${key}\n`;
  }
  
  outputString = `/**\n * @typedef {Object} ${typeName || 'type1'
    }\n${outputString} */`;
  return outputString;
}

function toJSDoc(data, typeName) {
  if (typeof data === "object") return objectToJSDoc(data, typeName);
  return `/**\n * @typedef {${data}} ${typeName || 'TYPE'}\n */`;
}
/**
 *
 *
 * @param {undefined} value
 * @returns
 */
function getValueType(value) {
  switch (typeof value) {
    case "string":
      if(value.length > 0 && !isNaN(Number(value))) return "Number";
      return "String";
    case "number":
      return "Number";
    case "boolean":
      return "Boolean";
    case "object":
      if (value === null) return "Null";
      if (Array.isArray(value)) return "Array";
      return "Object";
    case "function":
      return "Function";
    default:
      return undefined;
  }
}

function addObjectForAnalisysStack(object, key) {
  const newTypeName = key ? `${key}Type` : `TYPE${++lastTypeNumber}`;
  typeObjectList.push({
    name: newTypeName,
    object: object,
  });
  return newTypeName;
}

function parseComplexTypes(value, key) {
  let type = getValueType(value);
  if (type === "Array") {
    if (value.length > 0) type = `${makeDeepArrayAnalisys(value, key)}[]`;
  } else if (type === "Object") {
    type = addObjectForAnalisysStack(value, key);
  }
  return type;
}

function makeDeepArrayAnalisys(array, key) {
  return parseComplexTypes(array[0], key);
}

function parseObject(object) {
  const output = {};

  const keys = Object.keys(object);
  for (const key of keys) {
    const value = object[key];

    output[key] = parseComplexTypes(value, key);
  }

  return output;
}

function makeDeepObjectAnalisys() {
  let outputJSDoc = "";
  while (true) {
    const currentTypeObject = typeObjectList.pop();
    if (!currentTypeObject) break;

    const parsedObject = parseObject(currentTypeObject.object);
    const result = toJSDoc(parsedObject, currentTypeObject.name);

    outputJSDoc += `${result}\n`;
  }
  return outputJSDoc;
}

function getDataType(data) {
  let type = getValueType(data);
  if (type === "Array") {
    if (data.length > 0) type = `${makeDeepArrayAnalisys(data)}[]`;
  } else if (type === "Object") {
    type = parseObject(data);
  }
  return type;
}

export default function json2jsdoc(inputData) {
  const output = getDataType(inputData);
  const result = toJSDoc(output, "TYPE");
  return makeDeepObjectAnalisys() + result;
}