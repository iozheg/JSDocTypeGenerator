/**
 * @typedef {Object} TYPEOBJECT
 * @property {String} name
 * @property {String} type
 * @property {TYPEOBJECT[]} children
 * @property {Boolean} isArray
 */

/**
 * Returns new JSDoc type if property has children.
 *
 * @param {TYPEOBJECT} property
 * @returns {String} JSDoc string.
 */
function getPropertyNewType(property) {
  if (property.children.length > 0) {
    return typeObjectToJSDoc(property);
  }
}

/**
 * Creates JSDoc 'property' string.
 *
 * @param {TYPEOBJECT} property
 * @returns JSDoc string.
 */
function createJsdocProperty(property) {
  return ` * @property {${property.type}} ${property.name}\n`;
}

/**
 * Creates JSDoc 'typedef' string for JS object.
 *
 * @param {String} type
 * @returns JSDoc string.
 */
function createJsdocObjectTypedef(type) {
  const modifiedType = type.replace(/\[\]$/, "") || 'TYPE';
  return ` * @typedef {Object} ${modifiedType}\n`;
}

/**
 * Creates JSDoc 'typedef' string for array. Used only if tree root element
 * is array.
 *
 * @param {String} type
 * @param {String} name
 * @returns JSDoc string.
 */
function createJsdocArrayTypedef(type, name) {
  const modifiedType = type.replace(/TYPE/, "Object") || 'TYPE';
  return ` * @typedef {${modifiedType}} ${name}\n`;
}

/**
 * Returns JSDoc string for tree branch.
 *
 * @param {TYPEOBJECT} typeObject
 * @param {boolean} [rootIsArray=false]
 * @returns {String} JSDoc string.
 */
function typeObjectToJSDoc(typeObject, rootIsArray = false) {
  let outputStrings = [];
  let newTypes = [];
  for (const property of typeObject.children) {
    const newType = getPropertyNewType(property);
    if (newType) newTypes.unshift(newType);
    outputStrings.push(createJsdocProperty(property));
  }

  return `${newTypes.join("")}/**\n${
    rootIsArray
    ? createJsdocArrayTypedef(typeObject.type, typeObject.name)
    : createJsdocObjectTypedef(typeObject.type)
  }${outputStrings.join("")} */\n`;
}

/**
 * Starts tree traversal to build JSDoc string.
 * tree.children[0] - tree root
 * Depending on root element type uses different approaches for primitive
 * types, JS objects and arrays.
 * If root hasn't children than it has primitive type.
 *
 * @param {TYPEOBJECT} tree
 * @returns {String} whole JSDoc string.
 */
function treeToJsdoc(tree) {
  let output = "";
  if (tree.children[0].children.length > 0) {
    output += typeObjectToJSDoc(tree.children[0], tree.children[0].isArray);
  } else {
    output += `/** @typedef {${tree.children[0].type}} ${
      tree.children[0].name} */`;
  }
  return output;
}

/**
 * Returns value's type.
 *
 * @param {*} value
 * @returns value's type.
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

/**
 * Parses array. Array don't become new type itself. Instead used it's
 * first element to determine array type if it exists.
 *
 * @param {Array} array
 * @param {String} name
 * @returns {TYPEOBJECT}
 */
function parseArray(array, name) {
  if (array.length > 0) {
    const result = parseData(array[0], name);
    result.type += "[]";
    result.isArray = true;
    return result;
  }
  return {
    name: name,
    type: "Array",
    children: [],
    isArray: true
  };
}

/**
 * Returns tree node with type object. Parses object's children.
 *
 * @param {*} object
 * @param {String} name
 * @returns {TYPEOBJECT}
 */
function parseObject(object, name) {
  const node = {
    name: name,
    type: "Object",
    children: [],
    isArray: false,
  }

  const keys = Object.keys(object);
  for (const key of keys) {
    node.children.push(parseData(object[key], key));
  }
  
  if (node.children.length > 0) {
    node.type = (node.name && node.name !== "TYPE")
      ? `${node.name.toUpperCase()}_TYPE` : "TYPE";
  }

  return node;
}
/**
 * Determines data type.
 * Parses complex types. Creates tree of types.
 *
 * @param {*} data
 * @param {String} name
 * @returns {TYPEOBJECT}
 */
function parseData(data, name) {
  let type = getValueType(data);
  let newNode = {
    name: name || "TYPE",
    type: type,
    children: [],
    isArray: false,
  };

  if (type === "Array") {
    newNode = parseArray(data, newNode.name);
  } else if (type === "Object") {
    newNode = parseObject(data, newNode.name);
  }

  return newNode;
}

export default function json2jsdoc(inputData) {
  /** @type {{name: string, type: string, children: array}} */
  const treeOfTypes = {
    name: "root",
    type: null,
    children: []
  }
  treeOfTypes.children.push(parseData(inputData));
  const result = treeToJsdoc(treeOfTypes);
  return result.trim();
}