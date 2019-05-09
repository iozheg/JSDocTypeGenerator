import json2jsdoc from "./json2JSDocParser";
import {
  objComplex, objComplexJSdocUntyped,
  objPrimitives, objPrimitivesJSdoc,
  objList, objListResult,
  complexArray, complexArrayResult
} from "./mocks";

const template = type => `/** @typedef {${type}} TYPE */`;

test("should parse primitive types", () => {
  expect(json2jsdoc("string", false)).toBe(template("String"));
  expect(json2jsdoc(4, false)).toBe(template("Number"));
  expect(json2jsdoc(true, false)).toBe(template("Boolean"));
  expect(json2jsdoc(null, false)).toBe(template("Null"));
});

describe("should parse array", () => {
  test("empty array", () => {
    expect(json2jsdoc([])).toBe(template("Array"));
  });
  
  test("array with primitives", () => {
    expect(json2jsdoc(["s"], false)).toBe(template("String[]"));
    expect(json2jsdoc([4], false)).toBe(template("Number[]"));
    expect(json2jsdoc([true], false)).toBe(template("Boolean[]"));
    expect(json2jsdoc([null], false)).toBe(template("Null[]"));
  });

  test("array of empty arrays", () => {
    expect(json2jsdoc([[]], false)).toBe(template("Array[]"));
  });

  test("array of arrays with primitives", () => {
    expect(json2jsdoc([["s"]], false)).toBe(template("String[][]"));
    expect(json2jsdoc([[4]], false)).toBe(template("Number[][]"));
    expect(json2jsdoc([[true]], false)).toBe(template("Boolean[][]"));
    expect(json2jsdoc([[null]], false)).toBe(template("Null[][]"));
  });

  test("array of arrays with empty object", () => {
    expect(json2jsdoc([[{}]], false)).toBe(template("Object[][]"));
  });

  test("array of arrays with non-empty object", () => {
    expect(json2jsdoc(complexArray, false)).toBe(complexArrayResult);
  });
  
  test("array with empty object without creating new type", () => {
    expect(json2jsdoc([{}], false)).toBe(template("Object[]"));
  });
  
  test("array with object with creating new type", () => {
    expect(json2jsdoc(objList, false)).toBe(objListResult);
  });
  
  
  test("should get array's element type from first element", () => {
    expect(json2jsdoc([4, "string"], false)).toBe(template("Number[]"));
    expect(json2jsdoc(["string", 4], false)).toBe(template("String[]"));
  });
});

describe("should parse object", () => {
  test("empty object", () => {
    expect(json2jsdoc({}, false)).toBe(template("Object"));
  });
  
  test("object with primitives", () => {
    expect(json2jsdoc(objPrimitives, false)).toBe(objPrimitivesJSdoc);
  });
  
  test("complex object", () => {
    expect(json2jsdoc(objComplex, false)).toBe(objComplexJSdocUntyped);
  });  
});
