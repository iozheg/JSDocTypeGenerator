/** @type {{name: string, object: object}[]} */
const typeObjectList = [];
/** @type {{name: string, jsdoc: string, children: array}} */
const treeOfTypes = {};
let lastCommonTypeNumber = 0;

function objectToJSDoc(object, typeName) {
  let outputString = "";
  const keys = Object.keys(object);

  for (const key of keys) {
    outputString += ` * @property {${object[key]}} ${key}\n`;
  }
  
  outputString = `/**\n * @typedef {Object} ${typeName || 'TYPE'
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
  if (Object.keys(object).length === 0) return "Object";
  const newTypeName = key ? `${key.toUpperCase()}_TYPE` : `TYPE_${++lastCommonTypeNumber}`;
  typeObjectList.push({
    name: newTypeName,
    object: object,
  });
  return newTypeName;
}

function parseComplexTypes(value, key) {
  let type = getValueType(value);
  if (type === "Array") {
    type = makeDeepArrayAnalisys(value, key);
  } else if (type === "Object") {
    type = addObjectForAnalisysStack(value, key);
  }
  return type;
}

function makeDeepArrayAnalisys(array, key) {
  if (array.length > 0) {
    return `${parseComplexTypes(array[0], key)}[]`;
  }
  return "Array";
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
    type = makeDeepArrayAnalisys(data);
  } else if (type === "Object") {
    type = parseObject(data);
  }
  return type;
}





function propertyToJsdoc(property) {
  const result = {};
  if (property.children.length > 0) {
    result.newType = objectToJSDoc1(property);
  }
  result.property = ` * @property {${property.type}} ${property.name}\n`;
  return result;
}

function objectToJSDoc1(object) {
  let outputStrings = [];
  let newTypes = [];
  for (const property of object.children) {
    const result = propertyToJsdoc(property);
    if (result.newType) newTypes.push(result.newType);
    outputStrings.push(result.property);
  }

  const type = object.type.replace(/\[\]$/, "") || 'TYPE';
  return `${newTypes.join("")}/**\n * @typedef {Object} ${type}\n${
    outputStrings.join("")} */\n`;
}

function arrayToJsdoc(object) {
  let outputStrings = [];
  let newTypes = [];
  for (const property of object.children) {
    const result = propertyToJsdoc(property);
    if (result.newType) newTypes.push(result.newType);
    outputStrings.push(result.property);
  }

  const type = object.type.replace(/\[\]$/, "") || 'TYPE';
  return `${newTypes.join("")}/**\n * @typedef {Object[]} ${type}\n${
    outputStrings.join("")} */\n`;
}

function treeToJsdoc(tree) {
  let output = "";
  if (tree.children[0].children.length > 0) {
    if (tree.children[0].isArray) {
      output += arrayToJsdoc(tree.children[0]);
    } else {
      output += objectToJSDoc1(tree.children[0]);
    }
  } else {
    output += `/** @typedef {${tree.children[0].type}} ${tree.children[0].name} */`;
  }
  return output;
}

function parseData(data, name, parent) {
  let type = getValueType(data);
  const newNode = {
    name: name || "TYPE",
    type: type,
    children: [],
    isArray: false,
  };
  // parent.children.push(newNode);
  if (type === "Array") {
    const result = parseArray(data, name, newNode);
    newNode.type = result.type;
    // newNode.name = result.name;
    newNode.children = result.children;
    newNode.isArray = true;
  } else if (type === "Object") {
    parseObject1(data, newNode);
    if (newNode.children.length > 0) {
      type = name ? `${name.toUpperCase()}_TYPE` : "TYPE";
    } else {
      type = "Object";
    }
    newNode.type = type;
  }

  return newNode;
}

function parseArray(array, name, parent) {
  if (array.length > 0) {
    const result = parseData(array[0], name, parent);
    result.type += "[]";
    return result;
  }
  return {
    type: "Array",
    children: []
  };
}

function parseObject1(object, parent) {
  const keys = Object.keys(object);
  for (const key of keys) {
    const value = object[key];

    parent.children.push(parseData(value, key, parent));
  }
}

export default function json2jsdoc(inputData) {
  treeOfTypes.name = "root";
  treeOfTypes.type = null;
  treeOfTypes.children = [];
  treeOfTypes.children.push(parseData(inputData, undefined, treeOfTypes));
  console.log(treeOfTypes);
  const result = treeToJsdoc(treeOfTypes);
  console.log(result);
  // const output = getDataType(inputData);
  // const result = toJSDoc(output, "TYPE");
  return result.trim();
}