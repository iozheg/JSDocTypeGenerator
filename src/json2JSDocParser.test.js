import json2jsdoc from "./json2JSDocParser";
import {
  objComplex, objComplexJSdoc,
  objPrimitives, objPrimitivesJSdoc,
  objList, objListResult
} from "./mocks";

test("should parse primitive types", () => {
  expect(json2jsdoc("string")).toBe("/**\n * @typedef {String} TYPE\n */");
  expect(json2jsdoc(4)).toBe("/**\n * @typedef {Number} TYPE\n */");
  expect(json2jsdoc(true)).toBe("/**\n * @typedef {Boolean} TYPE\n */");
  expect(json2jsdoc(null)).toBe("/**\n * @typedef {Null} TYPE\n */");
});

test("should parse empty array", () => {
  expect(json2jsdoc([])).toBe("/**\n * @typedef {Array} TYPE\n */");
});

test("should parse array with primitives", () => {
  expect(json2jsdoc(["s"])).toBe("/**\n * @typedef {String[]} TYPE\n */");
  expect(json2jsdoc([4])).toBe("/**\n * @typedef {Number[]} TYPE\n */");
  expect(json2jsdoc([true])).toBe("/**\n * @typedef {Boolean[]} TYPE\n */");
  expect(json2jsdoc([null])).toBe("/**\n * @typedef {Null[]} TYPE\n */");
});

test("should parse array with object", () => {
  expect(json2jsdoc(objList)).toBe(objListResult);
});


test("should get array's element type from first element", () => {
  expect(json2jsdoc([4, "string"])).toBe("/**\n * @typedef {Number[]} TYPE\n */");
  expect(json2jsdoc(["string", 4])).toBe("/**\n * @typedef {String[]} TYPE\n */");
});

test("should parse empty object", () => {
  expect(json2jsdoc({})).toBe("/**\n * @typedef {Object} TYPE\n */");
});

test("should parse object with primitives", () => {
  expect(json2jsdoc(objPrimitives)).toBe(objPrimitivesJSdoc);
});

test("should parse complex object", () => {
  expect(json2jsdoc(objComplex)).toBe(objComplexJSdoc);
});
