import json2jsdoc from "./json2JSDocParser";
import {
  objComplex, objComplexJSdoc,
  objPrimitives, objPrimitivesJSdoc,
  objList, objListResult
} from "./mocks";

const template = type => `/**\n * @typedef {${type}} TYPE\n */`;

test("should parse primitive types", () => {
  expect(json2jsdoc("string")).toBe(template("String"));
  expect(json2jsdoc(4)).toBe(template("Number"));
  expect(json2jsdoc(true)).toBe(template("Boolean"));
  expect(json2jsdoc(null)).toBe(template("Null"));
});

describe("should parse array", () => {
  test("empty array", () => {
    expect(json2jsdoc([])).toBe(template("Array"));
  });
  
  test("array with primitives", () => {
    expect(json2jsdoc(["s"])).toBe(template("String[]"));
    expect(json2jsdoc([4])).toBe(template("Number[]"));
    expect(json2jsdoc([true])).toBe(template("Boolean[]"));
    expect(json2jsdoc([null])).toBe(template("Null[]"));
  });
  
  test("array with empty object without creating new type", () => {
    expect(json2jsdoc([{}])).toBe(template("Object[]"));
  });
  
  test("array with object with creating new type", () => {
    expect(json2jsdoc(objList)).toBe(objListResult);
  });
  
  
  test("should get array's element type from first element", () => {
    expect(json2jsdoc([4, "string"])).toBe(template("Number[]"));
    expect(json2jsdoc(["string", 4])).toBe(template("String[]"));
  });
});

describe("should parse object", () => {
  test("empty object", () => {
    expect(json2jsdoc({})).toBe(template("Object"));
  });
  
  test("object with primitives", () => {
    expect(json2jsdoc(objPrimitives)).toBe(objPrimitivesJSdoc);
  });
  
  test("complex object", () => {
    expect(json2jsdoc(objComplex)).toBe(objComplexJSdoc);
  });  
});
