const objComplex = {
  string: "string",
  number: 35,
  boolean: false,
  null: null,
  emptyArray: [],
  numberArray: [0,1,2,3],
  emptyObjectArray: [{}],
  objectArray: [{
    prop1: "prop1",
    prop2: 4,
    prop3: { a: "a"}
  }],
  address: {
    city: "mntview",
    street: "earth",
    number: 4,
    status: {
      good: true
    },
    residents: ["Max", "Alex"]
  },
  complexObject: {
    cmpxObjArray: [{
      innerArray: [4]
    }]
  }
};

const objComplexJSdoc = `/**
 * @typedef {Object} CMPXOBJARRAY_TYPE
 * @property {Number[]} innerArray
 */
/**
 * @typedef {Object} COMPLEXOBJECT_TYPE
 * @property {CMPXOBJARRAY_TYPE[]} cmpxObjArray
 */
/**
 * @typedef {Object} STATUS_TYPE
 * @property {Boolean} good
 */
/**
 * @typedef {Object} ADDRESS_TYPE
 * @property {String} city
 * @property {String} street
 * @property {Number} number
 * @property {STATUS_TYPE} status
 * @property {String[]} residents
 */
/**
 * @typedef {Object} PROP3_TYPE
 * @property {String} a
 */
/**
 * @typedef {Object} OBJECTARRAY_TYPE
 * @property {String} prop1
 * @property {Number} prop2
 * @property {PROP3_TYPE} prop3
 */
/**
 * @typedef {Object} TYPE
 * @property {String} string
 * @property {Number} number
 * @property {Boolean} boolean
 * @property {Null} null
 * @property {Array} emptyArray
 * @property {Number[]} numberArray
 * @property {Object[]} emptyObjectArray
 * @property {OBJECTARRAY_TYPE[]} objectArray
 * @property {ADDRESS_TYPE} address
 * @property {COMPLEXOBJECT_TYPE} complexObject
 */`;

 const objComplexJSdocUntyped = `/**
 * @typedef {Object} TYPE
 * @property {String} string
 * @property {Number} number
 * @property {Boolean} boolean
 * @property {Null} null
 * @property {Array} emptyArray
 * @property {Number[]} numberArray
 * @property {Object[]} emptyObjectArray
 * @property {Object[]} objectArray
 * @property {String} objectArray.prop1
 * @property {Number} objectArray.prop2
 * @property {Object} objectArray.prop3
 * @property {String} objectArray.prop3.a
 * @property {Object} address
 * @property {String} address.city
 * @property {String} address.street
 * @property {Number} address.number
 * @property {Object} address.status
 * @property {Boolean} address.status.good
 * @property {String[]} address.residents
 * @property {Object} complexObject
 * @property {Object[]} complexObject.cmpxObjArray
 * @property {Number[]} complexObject.cmpxObjArray.innerArray
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
 * @typedef {Object[]} TYPE
 * @property {Number} number
 */`;

const complexArray = [[{
  prop: "string"
}]];

const complexArrayResult = `/**
 * @typedef {Object[][]} TYPE
 * @property {String} prop
 */`;

export {
  objComplex, objComplexJSdoc,
  objPrimitives, objPrimitivesJSdoc,
  objList, objListResult,
  complexArray, complexArrayResult,
  objComplexJSdocUntyped
};