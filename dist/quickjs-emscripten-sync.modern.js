let _Symbol$iterator;

_Symbol$iterator = Symbol.iterator;
class VMMap {
  constructor(vm) {
    this.vm = void 0;
    this._map1 = new Map();
    this._map2 = new Map();
    this._map3 = new Map();
    this._map4 = new Map();
    this._counterMap = new Map();
    this._disposables = new Set();
    this._mapGet = void 0;
    this._mapSet = void 0;
    this._mapDelete = void 0;
    this._mapClear = void 0;
    this._counter = 0;
    this.vm = vm;
    const result = vm.unwrapResult(vm.evalCode(`() => {
        const mapSym = new Map();
        let map = new WeakMap();
        let map2 = new WeakMap();
        const isObj = o => typeof o === "object" && o !== null || typeof o === "function";
        return {
          get: key => mapSym.get(key) ?? map.get(key) ?? map2.get(key) ?? -1,
          set: (key, value, key2) => {
            if (typeof key === "symbol") mapSym.set(key, value);
            if (isObj(key)) map.set(key, value);
            if (isObj(key2)) map2.set(key2, value);
          },
          delete: (key, key2) => {
            mapSym.delete(key);
            map.delete(key);
            map2.delete(key2);
          },
          clear: () => {
            mapSym.clear();
            map = new WeakMap();
            map2 = new WeakMap();
          }
        };
      }`)).consume(fn => this._call(fn, undefined));
    this._mapGet = vm.getProp(result, "get");
    this._mapSet = vm.getProp(result, "set");
    this._mapDelete = vm.getProp(result, "delete");
    this._mapClear = vm.getProp(result, "clear");
    result.dispose();

    this._disposables.add(this._mapGet);

    this._disposables.add(this._mapSet);

    this._disposables.add(this._mapDelete);

    this._disposables.add(this._mapClear);
  }

  set(key, handle, key2, handle2) {
    var _this$get;

    if (!handle.alive || handle2 && !handle2.alive) return false;
    const v = (_this$get = this.get(key)) != null ? _this$get : this.get(key2);

    if (v) {
      // handle and handle2 are unused so they should be disposed
      return v === handle || v === handle2;
    }

    const counter = this._counter++;

    this._map1.set(key, counter);

    this._map3.set(counter, handle);

    this._counterMap.set(counter, key);

    if (key2) {
      this._map2.set(key2, counter);

      if (handle2) {
        this._map4.set(counter, handle2);
      }
    }

    this.vm.newNumber(counter).consume(c => {
      this._call(this._mapSet, undefined, handle, c, handle2 != null ? handle2 : this.vm.undefined);
    });
    return true;
  }

  merge(iteratable) {
    if (!iteratable) return;

    for (const iter of iteratable) {
      if (!iter) continue;

      if (iter[1]) {
        this.set(iter[0], iter[1], iter[2], iter[3]);
      }
    }
  }

  get(key) {
    var _this$_map1$get;

    const num = (_this$_map1$get = this._map1.get(key)) != null ? _this$_map1$get : this._map2.get(key);
    const handle = typeof num === "number" ? this._map3.get(num) : undefined;
    if (!handle) return;

    if (!handle.alive) {
      this.delete(key);
      return;
    }

    return handle;
  }

  getByHandle(handle) {
    if (!handle.alive) {
      return;
    }

    return this._counterMap.get(this.vm.getNumber(this._call(this._mapGet, undefined, handle)));
  }

  has(key) {
    return !!this.get(key);
  }

  hasHandle(handle) {
    return typeof this.getByHandle(handle) !== "undefined";
  }

  delete(key, dispose) {
    var _this$_map1$get2;

    const num = (_this$_map1$get2 = this._map1.get(key)) != null ? _this$_map1$get2 : this._map2.get(key);
    if (typeof num === "undefined") return;

    const handle = this._map3.get(num);

    const handle2 = this._map4.get(num);

    this._call(this._mapDelete, undefined, ...[handle, handle2].filter(h => !!(h != null && h.alive)));

    this._map1.delete(key);

    this._map2.delete(key);

    this._map3.delete(num);

    this._map4.delete(num);

    for (const [k, v] of this._map1) {
      if (v === num) {
        this._map1.delete(k);

        break;
      }
    }

    for (const [k, v] of this._map2) {
      if (v === num) {
        this._map2.delete(k);

        break;
      }
    }

    for (const [k, v] of this._counterMap) {
      if (v === key) {
        this._counterMap.delete(k);

        break;
      }
    }

    if (dispose) {
      if (handle != null && handle.alive) handle.dispose();
      if (handle2 != null && handle2.alive) handle2.dispose();
    }
  }

  deleteByHandle(handle, dispose) {
    const key = this.getByHandle(handle);

    if (typeof key !== "undefined") {
      this.delete(key, dispose);
    }
  }

  clear() {
    this._counter = 0;

    this._map1.clear();

    this._map2.clear();

    this._map3.clear();

    this._map4.clear();

    this._counterMap.clear();

    if (this._mapClear.alive) {
      this._call(this._mapClear, undefined);
    }
  }

  dispose() {
    for (const v of this._disposables.values()) {
      if (v.alive) {
        v.dispose();
      }
    }

    for (const v of this._map3.values()) {
      if (v.alive) {
        v.dispose();
      }
    }

    for (const v of this._map4.values()) {
      if (v.alive) {
        v.dispose();
      }
    }

    this._disposables.clear();

    this.clear();
  }

  get size() {
    return this._map1.size;
  }

  [_Symbol$iterator]() {
    const keys = this._map1.keys();

    return {
      next: () => {
        while (true) {
          const k1 = keys.next();
          if (k1.done) return {
            value: undefined,
            done: true
          };

          const n = this._map1.get(k1.value);

          if (typeof n === "undefined") continue;

          const v1 = this._map3.get(n);

          const v2 = this._map4.get(n);

          if (!v1) continue;

          const k2 = this._get2(n);

          return {
            value: [k1.value, v1, k2, v2],
            done: false
          };
        }
      }
    };
  }

  _get2(num) {
    for (const [k, v] of this._map2) {
      if (v === num) return k;
    }
  }

  _call(fn, thisArg, ...args) {
    return this.vm.unwrapResult(this.vm.callFunction(fn, typeof thisArg === "undefined" ? this.vm.undefined : thisArg, ...args));
  }

}

function isES2015Class(cls) {
  return typeof cls === "function" && /^class\s/.test(Function.prototype.toString.call(cls));
}
function isObject(value) {
  return typeof value === "function" || typeof value === "object" && value !== null;
}
function walkObject(value, callback) {
  const set = new Set();

  const walk = v => {
    if (!isObject(v) || set.has(v) || (callback == null ? void 0 : callback(v, set)) === false) return;
    set.add(v);

    if (Array.isArray(v)) {
      for (const e of v) {
        walk(e);
      }

      return;
    }

    if (typeof v === "object") {
      const proto = Object.getPrototypeOf(v);

      if (proto && proto !== Object.prototype) {
        walk(proto);
      }
    }

    for (const d of Object.values(Object.getOwnPropertyDescriptors(v))) {
      if ("value" in d) walk(d.value);
      if ("get" in d) walk(d.get);
      if ("set" in d) walk(d.set);
    }
  };

  walk(value);
  return set;
}
/**
 * Measure the complexity of an object as you traverse the field and prototype chain. If max is specified, when the complexity reaches max, the traversal is terminated and it returns the max. In this function, one object and function are counted as a complexity of 1, and primitives are not counted as a complexity.
 */

function complexity(value, max) {
  return walkObject(value, max ? (_, set) => set.size < max : undefined).size;
}

function call(vm, code, thisArg, ...args) {
  return vm.unwrapResult(vm.evalCode(code)).consume(f => {
    if (typeof thisArg === "undefined" && args.length === 0) return f;
    return vm.unwrapResult(vm.callFunction(f, thisArg != null ? thisArg : vm.undefined, ...args));
  });
}
function eq(vm, a, b) {
  return vm.dump(call(vm, "Object.is", undefined, a, b));
}
function isHandleObject(vm, a) {
  return vm.dump(call(vm, `a => typeof a === "object" && a !== null || typeof a === "function"`, undefined, a));
}
function send(vm, target) {
  const json = JSON.stringify(target);
  if (!json) return vm.undefined;
  return call(vm, `JSON.parse`, undefined, vm.newString(json));
}
function consumeAll(handles, cb) {
  try {
    return cb(handles);
  } finally {
    for (const h of handles) {
      if (h.alive) h.dispose();
    }
  }
}

function marshalProperties(vm, target, handle, marshal) {
  const descs = vm.newObject();

  const cb = (key, desc) => {
    const keyHandle = marshal(key);
    const valueHandle = typeof desc.value === "undefined" ? undefined : marshal(desc.value);
    const getHandle = typeof desc.get === "undefined" ? undefined : marshal(desc.get);
    const setHandle = typeof desc.set === "undefined" ? undefined : marshal(desc.set);
    vm.newObject().consume(descObj => {
      Object.entries(desc).forEach(([k, v]) => {
        const v2 = k === "value" ? valueHandle : k === "get" ? getHandle : k === "set" ? setHandle : v ? vm.true : vm.false;

        if (v2) {
          vm.setProp(descObj, k, v2);
        }
      });
      vm.setProp(descs, keyHandle, descObj);
    });
  };

  const desc = Object.getOwnPropertyDescriptors(target);
  Object.entries(desc).forEach(([k, v]) => cb(k, v));
  Object.getOwnPropertySymbols(desc).forEach(k => cb(k, desc[k]));
  call(vm, `Object.defineProperties`, undefined, handle, descs).dispose();
  descs.dispose();
}

function marshalFunction(vm, target, marshal, unmarshal, preMarshal, preApply) {
  var _preMarshal;

  if (typeof target !== "function") return;
  const raw = vm.newFunction(target.name, function (...argHandles) {
    const that = unmarshal(this);
    const args = argHandles.map(a => unmarshal(a));

    if (isES2015Class(target) && isObject(that)) {
      // Class constructors cannot be invoked without new expression, and new.target is not changed
      const result = new target(...args);
      Object.entries(result).forEach(([key, value]) => {
        vm.setProp(this, key, marshal(value));
      });
      return this;
    }

    return marshal(preApply ? preApply(target, that, args) : target.apply(that, args));
  }).consume(handle2 => // fucntions created by vm.newFunction are not callable as a class constrcutor
  call(vm, `Cls => {
          const fn = function(...args) { return Cls.apply(this, args); };
          fn.name = Cls.name;
          fn.length = Cls.length;
          return fn;
        }`, undefined, handle2));
  const handle = (_preMarshal = preMarshal(target, raw)) != null ? _preMarshal : raw;
  marshalProperties(vm, target, raw, marshal);
  return handle;
}

function marshalObject(vm, target, marshal, preMarshal) {
  var _preMarshal;

  if (typeof target !== "object" || target === null) return;
  const raw = Array.isArray(target) ? vm.newArray() : vm.newObject();
  const handle = (_preMarshal = preMarshal(target, raw)) != null ? _preMarshal : raw; // prototype

  const prototype = Object.getPrototypeOf(target);
  const prototypeHandle = prototype && prototype !== Object.prototype && prototype !== Array.prototype ? marshal(prototype) : undefined;

  if (prototypeHandle) {
    call(vm, "Object.setPrototypeOf", undefined, handle, prototypeHandle).dispose();
  }

  marshalProperties(vm, target, raw, marshal);
  return handle;
}

// import { call } from "../vmutil";
function marshalPrimitive(vm, target) {
  switch (typeof target) {
    case "undefined":
      return vm.undefined;

    case "number":
      return vm.newNumber(target);

    case "string":
      return vm.newString(target);

    case "boolean":
      return target ? vm.true : vm.false;

    case "object":
      return target === null ? vm.null : undefined;
    // BigInt is not supported by quickjs-emscripten
    // case "bigint":
    //   return call(
    //     vm,
    //     `s => BigInt(s)`,
    //     undefined,
    //     vm.newString(target.toString())
    //   );
  }

  return undefined;
}

function marshalSymbol(vm, target, preMarshal) {
  var _preMarshal;

  if (typeof target !== "symbol") return;
  const handle = call(vm, "d => Symbol(d)", undefined, target.description ? vm.newString(target.description) : vm.undefined);
  return (_preMarshal = preMarshal(target, handle)) != null ? _preMarshal : handle;
}

function marshal(target, options) {
  var _ref, _ref2, _marshalSymbol;

  const {
    vm,
    unmarshal,
    isMarshalable,
    find,
    pre
  } = options;
  {
    const primitive = marshalPrimitive(vm, target);

    if (primitive) {
      return primitive;
    }
  }
  {
    const handle = find(target);
    if (handle) return handle;
  }

  if ((isMarshalable == null ? void 0 : isMarshalable(target)) === false) {
    return vm.undefined;
  }

  const marshal2 = t => marshal(t, options);

  const result = (_ref = (_ref2 = (_marshalSymbol = marshalSymbol(vm, target, pre)) != null ? _marshalSymbol : marshalFunction(vm, target, marshal2, unmarshal, pre, options.preApply)) != null ? _ref2 : marshalObject(vm, target, marshal2, pre)) != null ? _ref : vm.undefined;
  return result;
}

function unmarshalProperties(vm, handle, target, unmarshal) {
  vm.newFunction("", (key, value) => {
    const [keyName] = unmarshal(key);
    if (typeof keyName !== "string" && typeof keyName !== "number" && typeof keyName !== "symbol") return;
    const desc = [["value", true], ["get", true], ["set", true], ["configurable", false], ["enumerable", false], ["writable", false]].reduce((desc, [key, unmarshable]) => {
      const h = vm.getProp(value, key);
      const ty = vm.typeof(h);
      if (ty === "undefined") return desc;

      if (!unmarshable && ty === "boolean") {
        desc[key] = vm.dump(vm.getProp(value, key));
        return desc;
      }

      const [v, alreadyExists] = unmarshal(h);

      if (alreadyExists) {
        h.dispose();
      }

      desc[key] = v;
      return desc;
    }, {});
    Object.defineProperty(target, keyName, desc);
  }).consume(fn => {
    call(vm, `(o, fn) => {
        const descs = Object.getOwnPropertyDescriptors(o);
        Object.entries(descs).forEach(([k, v]) => fn(k, v));
        Object.getOwnPropertySymbols(descs).forEach(k => fn(k, descs[k]));
      }`, undefined, handle, fn).dispose();
  });
}

function unmarshalFunction(vm, handle, marshal, unmarshal, preUnmarshal) {
  var _preUnmarshal;

  if (vm.typeof(handle) !== "function") return;

  const raw = function raw(...args) {
    const thisHandle = marshal(this);
    const argHandles = args.map(a => marshal(a));

    if (new.target) {
      const [instance] = unmarshal(call(vm, `(Cls, ...args) => new Cls(...args)`, thisHandle, handle, ...argHandles));
      Object.defineProperties(this, Object.getOwnPropertyDescriptors(instance));
      return this;
    }

    const resultHandle = vm.unwrapResult(vm.callFunction(handle, thisHandle, ...argHandles));
    const [result, alreadyExists] = unmarshal(resultHandle);
    if (alreadyExists) resultHandle.dispose();
    return result;
  };

  const func = (_preUnmarshal = preUnmarshal(raw, handle)) != null ? _preUnmarshal : raw;
  unmarshalProperties(vm, handle, raw, unmarshal);
  return func;
}

function unmarshalObject(vm, handle, unmarshal, preUnmarshal) {
  var _preUnmarshal;

  if (vm.typeof(handle) !== "object" || // null check
  vm.unwrapResult(vm.evalCode("o => o === null")).consume(n => vm.dump(vm.unwrapResult(vm.callFunction(n, vm.undefined, handle))))) return;
  const raw = call(vm, "Array.isArray", undefined, handle).consume(r => vm.dump(r)) ? [] : {};
  const obj = (_preUnmarshal = preUnmarshal(raw, handle)) != null ? _preUnmarshal : raw;
  const prototype = call(vm, `o => {
      const p = Object.getPrototypeOf(o);
      return !p || p === Object.prototype || p === Array.prototype ? undefined : p;
    }`, undefined, handle).consume(prototype => {
    if (vm.typeof(prototype) === "undefined") return;
    const [proto] = unmarshal(prototype);
    return proto;
  });

  if (typeof prototype === "object") {
    Object.setPrototypeOf(obj, prototype);
  }

  unmarshalProperties(vm, handle, raw, unmarshal);
  return obj;
}

function unmarshalPrimitive(vm, handle) {
  const ty = vm.typeof(handle);

  if (ty === "undefined" || ty === "number" || ty === "string" || ty === "boolean") {
    return [vm.dump(handle), true];
  } else if (ty === "object") {
    const isNull = vm.unwrapResult(vm.evalCode("a => a === null")).consume(n => vm.dump(vm.unwrapResult(vm.callFunction(n, vm.undefined, handle))));

    if (isNull) {
      return [null, true];
    }
  } // BigInt is not supported by quickjs-emscripten
  // if (ty === "bigint") {
  //   const str = vm
  //     .getProp(handle, "toString")
  //     .consume(toString => vm.unwrapResult(vm.callFunction(toString, handle)))
  //     .consume(str => vm.getString(str));
  //   const bi = BigInt(str);
  //   return [bi, true];
  // }


  return [undefined, false];
}

function unmarshalSymbol(vm, handle, preUnmarshal) {
  var _preUnmarshal;

  if (vm.typeof(handle) !== "symbol") return;
  const desc = vm.getString(vm.getProp(handle, "description"));
  const sym = Symbol(desc);
  return (_preUnmarshal = preUnmarshal(sym, handle)) != null ? _preUnmarshal : sym;
}

function unmarshal(handle, options) {
  const [result] = unmarshalInner(handle, options);
  return result;
}

function unmarshalInner(handle, options) {
  var _ref, _unmarshalSymbol;

  const {
    vm,
    marshal,
    find,
    pre
  } = options;
  {
    const [target, ok] = unmarshalPrimitive(vm, handle);
    if (ok) return [target, false];
  }
  {
    const target = find(handle);

    if (target) {
      return [target, true];
    }
  }

  const unmarshal2 = h => unmarshalInner(h, options);

  const result = (_ref = (_unmarshalSymbol = unmarshalSymbol(vm, handle, pre)) != null ? _unmarshalSymbol : unmarshalFunction(vm, handle, marshal, unmarshal2, pre)) != null ? _ref : unmarshalObject(vm, handle, unmarshal2, pre);
  return [result, false];
}

function wrap(vm, target, proxyKeySymbol, proxyKeySymbolHandle, marshal, syncMode) {
  if (!isObject(target)) return undefined;
  if (isWrapped(target, proxyKeySymbol)) return target;
  const rec = new Proxy(target, {
    get(obj, key) {
      return key === proxyKeySymbol ? obj : Reflect.get(obj, key);
    },

    set(obj, key, value, receiver) {
      var _syncMode;

      const v = unwrap(value, proxyKeySymbol);
      const sync = (_syncMode = syncMode == null ? void 0 : syncMode(receiver)) != null ? _syncMode : "host";

      if (sync === "vm" || Reflect.set(obj, key, v, receiver)) {
        if (sync === "host") return true;
        const [handle2, unwrapped] = unwrapHandle(vm, marshal(receiver), proxyKeySymbolHandle);

        if (unwrapped) {
          handle2.consume(h => vm.setProp(h, marshal(key), marshal(v)));
        } else {
          vm.setProp(handle2, marshal(key), marshal(v));
        }
      }

      return true;
    },

    deleteProperty(obj, key) {
      var _syncMode2;

      const sync = (_syncMode2 = syncMode == null ? void 0 : syncMode(rec)) != null ? _syncMode2 : "host";
      const [handle2, unwrapped] = unwrapHandle(vm, marshal(rec), proxyKeySymbolHandle);

      if (sync === "vm" || Reflect.deleteProperty(obj, key)) {
        if (sync === "host") return true;

        if (unwrapped) {
          handle2.consume(h => call(vm, `(a, b) => delete a[b]`, undefined, h, marshal(key)));
        } else {
          call(vm, `(a, b) => delete a[b]`, undefined, handle2, marshal(key));
        }
      }

      return true;
    }

  });
  return rec;
}
function wrapHandle(vm, handle, proxyKeySymbol, proxyKeySymbolHandle, unmarshal, syncMode) {
  if (!isHandleObject(vm, handle)) return [undefined, false];
  if (isHandleWrapped(vm, handle, proxyKeySymbolHandle)) return [handle, false];
  return consumeAll([vm.newFunction("getSyncMode", h => {
    const res = syncMode == null ? void 0 : syncMode(unmarshal(h));
    if (typeof res === "string") return vm.newString(res);
    return vm.undefined;
  }), vm.newFunction("setter", (h, keyHandle, valueHandle) => {
    const target = unmarshal(h);
    if (!target) return;
    const key = unmarshal(keyHandle);
    if (key === "__proto__") return; // for security

    const value = unmarshal(valueHandle);
    unwrap(target, proxyKeySymbol)[key] = value;
  }), vm.newFunction("deleter", (h, keyHandle) => {
    const target = unmarshal(h);
    if (!target) return;
    const key = unmarshal(keyHandle);
    delete unwrap(target, proxyKeySymbol)[key];
  })], args => [call(vm, `(target, sym, getSyncMode, setter, deleter) => {
          const rec =  new Proxy(target, {
            get(obj, key, receiver) {
              return key === sym ? obj : Reflect.get(obj, key, receiver)
            },
            set(obj, key, value, receiver) {
              const v = typeof value === "object" && value !== null || typeof value === "function"
                ? value[sym] ?? value
                : value;
              const sync = getSyncMode(receiver) ?? "vm";
              if (sync === "host" || Reflect.set(obj, key, v, receiver)) {
                if (sync !== "vm") {
                  setter(receiver, key, v);
                }
              }
              return true;
            },
            deleteProperty(obj, key) {
              const sync = getSyncMode(rec) ?? "vm";
              if (sync === "host" || Reflect.deleteProperty(obj, key)) {
                if (sync !== "vm") {
                  deleter(rec, key);
                }
              }
              return true;
            },
          });
          return rec;
        }`, undefined, handle, proxyKeySymbolHandle, ...args), true]);
}
function unwrap(obj, key) {
  var _obj$key;

  return isObject(obj) ? (_obj$key = obj[key]) != null ? _obj$key : obj : obj;
}
function unwrapHandle(vm, handle, key) {
  if (!isHandleWrapped(vm, handle, key)) return [handle, false];
  return [vm.getProp(handle, key), true];
}
function isWrapped(obj, key) {
  return isObject(obj) && !!obj[key];
}
function isHandleWrapped(vm, handle, key) {
  return !!vm.dump(call(vm, `(a, s) => (typeof a === "object" && a !== null || typeof a === "function") && !!a[s]`, undefined, handle, key));
}

/**
 * Default value of registeredObjects option of the Arena class constructor.
 */
const defaultRegisteredObjects = [// basic objects
[Symbol, "Symbol"], [Symbol.prototype, "Symbol.prototype"], [Object, "Object"], [Object.prototype, "Object.prototype"], [Function, "Function"], [Function.prototype, "Function.prototype"], [Boolean, "Boolean"], [Boolean.prototype, "Boolean.prototype"], [Array, "Array"], [Array.prototype, "Array.prototype"], // [BigInt, "BigInt"],
// [BigInt.prototype, "BigInt.prototype"],
// errors
[Error, "Error"], [Error.prototype, "Error.prototype"], [EvalError, "EvalError"], [EvalError.prototype, "EvalError.prototype"], [RangeError, "RangeError"], [RangeError.prototype, "RangeError.prototype"], [ReferenceError, "ReferenceError"], [ReferenceError.prototype, "ReferenceError.prototype"], [SyntaxError, "SyntaxError"], [SyntaxError.prototype, "SyntaxError.prototype"], [TypeError, "TypeError"], [TypeError.prototype, "TypeError.prototype"], [URIError, "URIError"], [URIError.prototype, "URIError.prototype"], // built-in symbols
...Object.getOwnPropertyNames(Symbol).filter(k => typeof Symbol[k] === "symbol").map(k => [Symbol[k], `Symbol.${k}`])];

/**
 * The Arena class manages all generated handles at once by quickjs-emscripten and automatically converts objects between the host and the QuickJS VM.
 */

class Arena {
  /** Constructs a new Arena instance. It requires a quickjs-emscripten VM initialized with `quickjs.createVM()`. */
  constructor(vm, options) {
    var _options$registeredOb;

    this.vm = void 0;
    this._map = void 0;
    this._registeredMap = void 0;
    this._registeredMapDispose = new Set();
    this._sync = new Set();
    this._temporalSync = new Set();
    this._symbol = Symbol();
    this._symbolHandle = void 0;
    this._options = void 0;
    this.vm = vm;
    this._options = options;
    this._symbolHandle = vm.unwrapResult(vm.evalCode(`Symbol()`));
    this._map = new VMMap(vm);
    this._registeredMap = new VMMap(vm);
    this.registerAll((_options$registeredOb = options == null ? void 0 : options.registeredObjects) != null ? _options$registeredOb : defaultRegisteredObjects);
  }
  /**
   * Dispose of the arena and managed handles. This method won't dispose the VM itself, so the VM has to be disposed of manually.
   */


  dispose() {
    this._map.dispose();

    this._registeredMap.dispose();

    this._symbolHandle.dispose();
  }
  /**
   * Evaluate JS code in the VM and get the result as an object on the host side. It also converts and re-throws error objects when an error is thrown during evaluation.
   */


  evalCode(code) {
    const handle = this.vm.evalCode(code);
    return this._unwrapResultAndUnmarshal(handle);
  }
  /**
   * Almost same as `vm.executePendingJobs()`, but it converts and re-throws error objects when an error is thrown during evaluation.
   */


  executePendingJobs(maxJobsToExecute) {
    const result = this.vm.executePendingJobs(maxJobsToExecute);

    if ("value" in result) {
      return result.value;
    }

    throw result.error.consume(err => this._unmarshal(err));
  }
  /**
   * Expose objects as global objects in the VM.
   *
   * By default, exposed objects are not synchronized between the host and the VM.
   * If you want to sync an objects, first wrap the object with sync method, and then expose the wrapped object.
   */


  expose(obj) {
    for (const [key, value] of Object.entries(obj)) {
      const handle = this._marshal(value);

      this.vm.setProp(this.vm.global, key, handle);
    }
  }
  /**
   * Enables sync for the object between the host and the VM and returns objects wrapped with proxies.
   *
   * The return value is necessary in order to reflect changes to the object from the host to the VM. Please note that setting a value in the field or deleting a field in the original object will not synchronize it.
   */


  sync(target) {
    const wrapped = this._wrap(target);

    if (typeof wrapped === "undefined") return target;
    walkObject(wrapped, v => {
      this._sync.add(this._unwrap(v));
    });
    return wrapped;
  }
  /**
   * Register a pair of objects that will be considered the same between the host and the QuickJS VM.
   *
   * Instead of a string, you can also pass a QuickJSHandle directly. In that case, however, when  you have to dispose them manually when destroying the VM.
   */


  register(target, handleOrCode) {
    if (this._registeredMap.has(target)) return;
    const handle = typeof handleOrCode === "string" ? this._unwrapResult(this.vm.evalCode(handleOrCode)) : handleOrCode;
    if (eq(this.vm, handle, this.vm.undefined)) return;

    if (typeof handleOrCode === "string") {
      this._registeredMapDispose.add(target);
    }

    this._registeredMap.set(target, handle);
  }
  /**
   * Execute `register` methods for each pair.
   */


  registerAll(map) {
    for (const [k, v] of map) {
      this.register(k, v);
    }
  }
  /**
   * Unregister a pair of objects that were registered with `registeredObjects` option and `register` method.
   */


  unregister(target, dispose) {
    this._registeredMap.delete(target, this._registeredMapDispose.has(target) || dispose);

    this._registeredMapDispose.delete(target);
  }
  /**
   * Execute `unregister` methods for each target.
   */


  unregisterAll(targets, dispose) {
    for (const t of targets) {
      this.unregister(t, dispose);
    }
  }

  startSync(target) {
    if (!isObject(target)) return;

    this._sync.add(this._unwrap(target));
  }

  endSync(target) {
    this._sync.delete(this._unwrap(target));
  }

  _unwrapResult(result) {
    if ("value" in result) {
      return result.value;
    }

    throw result.error.consume(err => this._unmarshal(err));
  }

  _unwrapResultAndUnmarshal(result) {
    if (!result) return;
    return this._unwrapResult(result).consume(h => this._unmarshal(h));
  }

  _marshal(target) {
    var _this$_wrap;

    const registered = this._registeredMap.get(target);

    if (registered) {
      return registered;
    }

    const handle = marshal((_this$_wrap = this._wrap(target)) != null ? _this$_wrap : target, {
      vm: this.vm,
      unmarshal: h => this._unmarshal(h),
      isMarshalable: t => {
        var _this$_options$isMars, _this$_options;

        return (_this$_options$isMars = (_this$_options = this._options) == null ? void 0 : _this$_options.isMarshalable == null ? void 0 : _this$_options.isMarshalable(this._unwrap(t))) != null ? _this$_options$isMars : true;
      },
      find: t => {
        var _this$_registeredMap$;

        return (_this$_registeredMap$ = this._registeredMap.get(t)) != null ? _this$_registeredMap$ : this._map.get(t);
      },
      pre: (t, h) => {
        var _this$_register;

        return (_this$_register = this._register(t, h, this._map)) == null ? void 0 : _this$_register[1];
      },
      preApply: (target, that, args) => {
        const unwrapped = isObject(that) ? this._unwrap(that) : undefined; // override sync mode of this object while calling the function

        if (unwrapped) this._temporalSync.add(unwrapped);

        try {
          return target.apply(that, args);
        } finally {
          // restore sync mode
          if (unwrapped) this._temporalSync.delete(unwrapped);
        }
      }
    });
    return handle;
  }

  _unmarshal(handle) {
    const registered = this._registeredMap.getByHandle(handle);

    if (typeof registered !== "undefined") {
      return registered;
    }

    const [wrappedHandle] = this._wrapHandle(handle);

    return unmarshal(wrappedHandle != null ? wrappedHandle : handle, {
      vm: this.vm,
      marshal: v => this._marshal(v),
      find: h => {
        var _this$_registeredMap$2;

        return (_this$_registeredMap$2 = this._registeredMap.getByHandle(h)) != null ? _this$_registeredMap$2 : this._map.getByHandle(h);
      },
      pre: (t, h) => {
        var _this$_register2;

        return (_this$_register2 = this._register(t, h, undefined, true)) == null ? void 0 : _this$_register2[0];
      }
    });
  }

  _register(t, h, map = this._map, sync) {
    if (this._registeredMap.has(t) || this._registeredMap.hasHandle(h)) {
      return;
    }

    const wrappedT = this._wrap(t);

    const [wrappedH] = this._wrapHandle(h);

    if (!wrappedT || !wrappedH) return; // t or h is not an object

    const unwrappedT = this._unwrap(t);

    const [unwrappedH, unwrapped] = this._unwrapHandle(h);

    const res = map.set(wrappedT, wrappedH, unwrappedT, unwrappedH);

    if (!res) {
      // already registered
      if (unwrapped) unwrappedH.dispose();
      throw new Error("already registered");
    } else if (sync) {
      this._sync.add(unwrappedT);
    }

    return [wrappedT, wrappedH];
  }

  _syncMode(obj) {
    const obj2 = this._unwrap(obj);

    return this._sync.has(obj2) || this._temporalSync.has(obj2) ? "both" : undefined;
  }

  _wrap(target) {
    return wrap(this.vm, target, this._symbol, this._symbolHandle, t => this._marshal(t), t => this._syncMode(t));
  }

  _unwrap(target) {
    return unwrap(target, this._symbol);
  }

  _wrapHandle(handle) {
    return wrapHandle(this.vm, handle, this._symbol, this._symbolHandle, h => this._unmarshal(h), t => this._syncMode(t));
  }

  _unwrapHandle(target) {
    return unwrapHandle(this.vm, target, this._symbolHandle);
  }

}

export { Arena, VMMap, call, complexity, consumeAll, defaultRegisteredObjects, eq, isES2015Class, isHandleObject, isObject, marshal, send, unmarshal, walkObject };
//# sourceMappingURL=quickjs-emscripten-sync.modern.js.map
