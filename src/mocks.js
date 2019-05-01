const objComplex = {
  string: "string",
  number: 35,
  boolean: false,
  null: null,
  numberArray: [0,1,2,3],
  objectArray: [{
    prop1: "prop1",
    prop2: 4,
    prop3: { a: "a"}
  }],
  emptyArray: [],
  address: {
    city: "mntview",
    street: "earth",
    number: 4,
    status: {
      good: true
    }
  }
};

const objComplexJSdoc = `/**
 * @typedef {Object} addressType
 * @property {String} city
 * @property {String} street
 * @property {Number} number
 * @property {statusType} status
 */
/**
 * @typedef {Object} statusType
 * @property {Boolean} good
 */
/**
 * @typedef {Object} objectArrayType
 * @property {String} prop1
 * @property {Number} prop2
 * @property {prop3Type} prop3
 */
/**
 * @typedef {Object} prop3Type
 * @property {String} a
 */
/**
 * @typedef {Object} TYPE
 * @property {String} string
 * @property {Number} number
 * @property {Boolean} boolean
 * @property {Null} null
 * @property {Number[]} numberArray
 * @property {objectArrayType[]} objectArray
 * @property {Array} emptyArray
 * @property {addressType} address
 */`;

 const objPrimitives = {
   string: "string",
   number: 0,
   boolean: true,
   null: null
 }

 const objPrimitivesJSdoc = `/**
 * @typedef {Object} TYPE
 * @property {String} string
 * @property {Number} number
 * @property {Boolean} boolean
 * @property {Null} null
 */`;

 const objList = [{
  number: 4
 }];

 const objListResult = `/**
 * @typedef {Object} TYPE1
 * @property {Number} number
 */
/**
 * @typedef {TYPE1[]} TYPE
 */`;

 export {
   objComplex, objComplexJSdoc,
   objPrimitives, objPrimitivesJSdoc,
   objList, objListResult
  };