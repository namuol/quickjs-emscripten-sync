(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.quickjsEmscriptenSync = {}));
}(this, (function (exports) {
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);

    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var _Symbol$iterator;

  _Symbol$iterator = Symbol.iterator;

  var VMMap = /*#__PURE__*/function (_Symbol$iterator2) {
    function VMMap(vm) {
      var _this = this;

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
      var result = vm.unwrapResult(vm.evalCode("() => {\n        const mapSym = new Map();\n        let map = new WeakMap();\n        let map2 = new WeakMap();\n        const isObj = o => typeof o === \"object\" && o !== null || typeof o === \"function\";\n        return {\n          get: key => mapSym.get(key) ?? map.get(key) ?? map2.get(key) ?? -1,\n          set: (key, value, key2) => {\n            if (typeof key === \"symbol\") mapSym.set(key, value);\n            if (isObj(key)) map.set(key, value);\n            if (isObj(key2)) map2.set(key2, value);\n          },\n          delete: (key, key2) => {\n            mapSym.delete(key);\n            map.delete(key);\n            map2.delete(key2);\n          },\n          clear: () => {\n            mapSym.clear();\n            map = new WeakMap();\n            map2 = new WeakMap();\n          }\n        };\n      }")).consume(function (fn) {
        return _this._call(fn, undefined);
      });
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

    var _proto = VMMap.prototype;

    _proto.set = function set(key, handle, key2, handle2) {
      var _this$get,
          _this2 = this;

      if (!handle.alive || handle2 && !handle2.alive) return false;
      var v = (_this$get = this.get(key)) != null ? _this$get : this.get(key2);

      if (v) {
        // handle and handle2 are unused so they should be disposed
        return v === handle || v === handle2;
      }

      var counter = this._counter++;

      this._map1.set(key, counter);

      this._map3.set(counter, handle);

      this._counterMap.set(counter, key);

      if (key2) {
        this._map2.set(key2, counter);

        if (handle2) {
          this._map4.set(counter, handle2);
        }
      }

      this.vm.newNumber(counter).consume(function (c) {
        _this2._call(_this2._mapSet, undefined, handle, c, handle2 != null ? handle2 : _this2.vm.undefined);
      });
      return true;
    };

    _proto.merge = function merge(iteratable) {
      if (!iteratable) return;

      for (var _iterator = _createForOfIteratorHelperLoose(iteratable), _step; !(_step = _iterator()).done;) {
        var iter = _step.value;
        if (!iter) continue;

        if (iter[1]) {
          this.set(iter[0], iter[1], iter[2], iter[3]);
        }
      }
    };

    _proto.get = function get(key) {
      var _this$_map1$get;

      var num = (_this$_map1$get = this._map1.get(key)) != null ? _this$_map1$get : this._map2.get(key);
      var handle = typeof num === "number" ? this._map3.get(num) : undefined;
      if (!handle) return;

      if (!handle.alive) {
        this["delete"](key);
        return;
      }

      return handle;
    };

    _proto.getByHandle = function getByHandle(handle) {
      if (!handle.alive) {
        return;
      }

      return this._counterMap.get(this.vm.getNumber(this._call(this._mapGet, undefined, handle)));
    };

    _proto.has = function has(key) {
      return !!this.get(key);
    };

    _proto.hasHandle = function hasHandle(handle) {
      return typeof this.getByHandle(handle) !== "undefined";
    };

    _proto["delete"] = function _delete(key, dispose) {
      var _this$_map1$get2;

      var num = (_this$_map1$get2 = this._map1.get(key)) != null ? _this$_map1$get2 : this._map2.get(key);
      if (typeof num === "undefined") return;

      var handle = this._map3.get(num);

      var handle2 = this._map4.get(num);

      this._call.apply(this, [this._mapDelete, undefined].concat([handle, handle2].filter(function (h) {
        return !!(h != null && h.alive);
      })));

      this._map1["delete"](key);

      this._map2["delete"](key);

      this._map3["delete"](num);

      this._map4["delete"](num);

      for (var _iterator2 = _createForOfIteratorHelperLoose(this._map1), _step2; !(_step2 = _iterator2()).done;) {
        var _step2$value = _step2.value,
            k = _step2$value[0],
            v = _step2$value[1];

        if (v === num) {
          this._map1["delete"](k);

          break;
        }
      }

      for (var _iterator3 = _createForOfIteratorHelperLoose(this._map2), _step3; !(_step3 = _iterator3()).done;) {
        var _step3$value = _step3.value,
            _k = _step3$value[0],
            _v = _step3$value[1];

        if (_v === num) {
          this._map2["delete"](_k);

          break;
        }
      }

      for (var _iterator4 = _createForOfIteratorHelperLoose(this._counterMap), _step4; !(_step4 = _iterator4()).done;) {
        var _step4$value = _step4.value,
            _k2 = _step4$value[0],
            _v2 = _step4$value[1];

        if (_v2 === key) {
          this._counterMap["delete"](_k2);

          break;
        }
      }

      if (dispose) {
        if (handle != null && handle.alive) handle.dispose();
        if (handle2 != null && handle2.alive) handle2.dispose();
      }
    };

    _proto.deleteByHandle = function deleteByHandle(handle, dispose) {
      var key = this.getByHandle(handle);

      if (typeof key !== "undefined") {
        this["delete"](key, dispose);
      }
    };

    _proto.clear = function clear() {
      this._counter = 0;

      this._map1.clear();

      this._map2.clear();

      this._map3.clear();

      this._map4.clear();

      this._counterMap.clear();

      if (this._mapClear.alive) {
        this._call(this._mapClear, undefined);
      }
    };

    _proto.dispose = function dispose() {
      for (var _iterator5 = _createForOfIteratorHelperLoose(this._disposables.values()), _step5; !(_step5 = _iterator5()).done;) {
        var v = _step5.value;

        if (v.alive) {
          v.dispose();
        }
      }

      for (var _iterator6 = _createForOfIteratorHelperLoose(this._map3.values()), _step6; !(_step6 = _iterator6()).done;) {
        var _v3 = _step6.value;

        if (_v3.alive) {
          _v3.dispose();
        }
      }

      for (var _iterator7 = _createForOfIteratorHelperLoose(this._map4.values()), _step7; !(_step7 = _iterator7()).done;) {
        var _v4 = _step7.value;

        if (_v4.alive) {
          _v4.dispose();
        }
      }

      this._disposables.clear();

      this.clear();
    };

    _proto[_Symbol$iterator2] = function () {
      var _this3 = this;

      var keys = this._map1.keys();

      return {
        next: function next() {
          while (true) {
            var k1 = keys.next();
            if (k1.done) return {
              value: undefined,
              done: true
            };

            var n = _this3._map1.get(k1.value);

            if (typeof n === "undefined") continue;

            var v1 = _this3._map3.get(n);

            var v2 = _this3._map4.get(n);

            if (!v1) continue;

            var k2 = _this3._get2(n);

            return {
              value: [k1.value, v1, k2, v2],
              done: false
            };
          }
        }
      };
    };

    _proto._get2 = function _get2(num) {
      for (var _iterator8 = _createForOfIteratorHelperLoose(this._map2), _step8; !(_step8 = _iterator8()).done;) {
        var _step8$value = _step8.value,
            k = _step8$value[0],
            v = _step8$value[1];
        if (v === num) return k;
      }
    };

    _proto._call = function _call(fn, thisArg) {
      var _this$vm;

      return this.vm.unwrapResult((_this$vm = this.vm).callFunction.apply(_this$vm, [fn, typeof thisArg === "undefined" ? this.vm.undefined : thisArg].concat([].slice.call(arguments, 2))));
    };

    _createClass(VMMap, [{
      key: "size",
      get: function get() {
        return this._map1.size;
      }
    }]);

    return VMMap;
  }(_Symbol$iterator);

  function isES2015Class(cls) {
    return typeof cls === "function" && /^class\s/.test(Function.prototype.toString.call(cls));
  }
  function isObject(value) {
    return typeof value === "function" || typeof value === "object" && value !== null;
  }
  function walkObject(value, callback) {
    var set = new Set();

    var walk = function walk(v) {
      if (!isObject(v) || set.has(v) || (callback == null ? void 0 : callback(v, set)) === false) return;
      set.add(v);

      if (Array.isArray(v)) {
        for (var _iterator = _createForOfIteratorHelperLoose(v), _step; !(_step = _iterator()).done;) {
          var e = _step.value;
          walk(e);
        }

        return;
      }

      if (typeof v === "object") {
        var proto = Object.getPrototypeOf(v);

        if (proto && proto !== Object.prototype) {
          walk(proto);
        }
      }

      for (var _i = 0, _Object$values = Object.values(Object.getOwnPropertyDescriptors(v)); _i < _Object$values.length; _i++) {
        var d = _Object$values[_i];
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
    return walkObject(value, max ? function (_, set) {
      return set.size < max;
    } : undefined).size;
  }

  function call(vm, code, thisArg) {
    var args = [].slice.call(arguments, 3);
    return vm.unwrapResult(vm.evalCode(code)).consume(function (f) {
      if (typeof thisArg === "undefined" && args.length === 0) return f;
      return vm.unwrapResult(vm.callFunction.apply(vm, [f, thisArg != null ? thisArg : vm.undefined].concat(args)));
    });
  }
  function eq(vm, a, b) {
    return vm.dump(call(vm, "Object.is", undefined, a, b));
  }
  function isHandleObject(vm, a) {
    return vm.dump(call(vm, "a => typeof a === \"object\" && a !== null || typeof a === \"function\"", undefined, a));
  }
  function send(vm, target) {
    var json = JSON.stringify(target);
    if (!json) return vm.undefined;
    return call(vm, "JSON.parse", undefined, vm.newString(json));
  }
  function consumeAll(handles, cb) {
    try {
      return cb(handles);
    } finally {
      for (var _iterator = _createForOfIteratorHelperLoose(handles), _step; !(_step = _iterator()).done;) {
        var h = _step.value;
        if (h.alive) h.dispose();
      }
    }
  }

  function marshalProperties(vm, target, handle, marshal) {
    var descs = vm.newObject();

    var cb = function cb(key, desc) {
      var keyHandle = marshal(key);
      var valueHandle = typeof desc.value === "undefined" ? undefined : marshal(desc.value);
      var getHandle = typeof desc.get === "undefined" ? undefined : marshal(desc.get);
      var setHandle = typeof desc.set === "undefined" ? undefined : marshal(desc.set);
      vm.newObject().consume(function (descObj) {
        Object.entries(desc).forEach(function (_ref) {
          var k = _ref[0],
              v = _ref[1];
          var v2 = k === "value" ? valueHandle : k === "get" ? getHandle : k === "set" ? setHandle : v ? vm["true"] : vm["false"];

          if (v2) {
            vm.setProp(descObj, k, v2);
          }
        });
        vm.setProp(descs, keyHandle, descObj);
      });
    };

    var desc = Object.getOwnPropertyDescriptors(target);
    Object.entries(desc).forEach(function (_ref2) {
      var k = _ref2[0],
          v = _ref2[1];
      return cb(k, v);
    });
    Object.getOwnPropertySymbols(desc).forEach(function (k) {
      return cb(k, desc[k]);
    });
    call(vm, "Object.defineProperties", undefined, handle, descs).dispose();
    descs.dispose();
  }

  function marshalFunction(vm, target, marshal, unmarshal, preMarshal, preApply) {
    var _preMarshal;

    if (typeof target !== "function") return;
    var raw = vm.newFunction(target.name, function () {
      var _this = this;

      var that = unmarshal(this);
      var args = [].slice.call(arguments).map(function (a) {
        return unmarshal(a);
      });

      if (isES2015Class(target) && isObject(that)) {
        // Class constructors cannot be invoked without new expression, and new.target is not changed
        var result = _construct(target, args);

        Object.entries(result).forEach(function (_ref) {
          var key = _ref[0],
              value = _ref[1];
          vm.setProp(_this, key, marshal(value));
        });
        return this;
      }

      return marshal(preApply ? preApply(target, that, args) : target.apply(that, args));
    }).consume(function (handle2) {
      return (// fucntions created by vm.newFunction are not callable as a class constrcutor
        call(vm, "Cls => {\n          const fn = function(...args) { return Cls.apply(this, args); };\n          fn.name = Cls.name;\n          fn.length = Cls.length;\n          return fn;\n        }", undefined, handle2)
      );
    });
    var handle = (_preMarshal = preMarshal(target, raw)) != null ? _preMarshal : raw;
    marshalProperties(vm, target, raw, marshal);
    return handle;
  }

  function marshalObject(vm, target, marshal, preMarshal) {
    var _preMarshal;

    if (typeof target !== "object" || target === null) return;
    var raw = Array.isArray(target) ? vm.newArray() : vm.newObject();
    var handle = (_preMarshal = preMarshal(target, raw)) != null ? _preMarshal : raw; // prototype

    var prototype = Object.getPrototypeOf(target);
    var prototypeHandle = prototype && prototype !== Object.prototype && prototype !== Array.prototype ? marshal(prototype) : undefined;

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
        return target ? vm["true"] : vm["false"];

      case "object":
        return target === null ? vm["null"] : undefined;
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
    var handle = call(vm, "d => Symbol(d)", undefined, target.description ? vm.newString(target.description) : vm.undefined);
    return (_preMarshal = preMarshal(target, handle)) != null ? _preMarshal : handle;
  }

  function marshal(target, options) {
    var _ref, _ref2, _marshalSymbol;

    var vm = options.vm,
        unmarshal = options.unmarshal,
        isMarshalable = options.isMarshalable,
        find = options.find,
        pre = options.pre;
    {
      var primitive = marshalPrimitive(vm, target);

      if (primitive) {
        return primitive;
      }
    }
    {
      var handle = find(target);
      if (handle) return handle;
    }

    if ((isMarshalable == null ? void 0 : isMarshalable(target)) === false) {
      return vm.undefined;
    }

    var marshal2 = function marshal2(t) {
      return marshal(t, options);
    };

    var result = (_ref = (_ref2 = (_marshalSymbol = marshalSymbol(vm, target, pre)) != null ? _marshalSymbol : marshalFunction(vm, target, marshal2, unmarshal, pre, options.preApply)) != null ? _ref2 : marshalObject(vm, target, marshal2, pre)) != null ? _ref : vm.undefined;
    return result;
  }

  function unmarshalProperties(vm, handle, target, unmarshal) {
    vm.newFunction("", function (key, value) {
      var _unmarshal = unmarshal(key),
          keyName = _unmarshal[0];

      if (typeof keyName !== "string" && typeof keyName !== "number" && typeof keyName !== "symbol") return;
      var desc = [["value", true], ["get", true], ["set", true], ["configurable", false], ["enumerable", false], ["writable", false]].reduce(function (desc, _ref) {
        var key = _ref[0],
            unmarshable = _ref[1];
        var h = vm.getProp(value, key);
        var ty = vm["typeof"](h);
        if (ty === "undefined") return desc;

        if (!unmarshable && ty === "boolean") {
          desc[key] = vm.dump(vm.getProp(value, key));
          return desc;
        }

        var _unmarshal2 = unmarshal(h),
            v = _unmarshal2[0],
            alreadyExists = _unmarshal2[1];

        if (alreadyExists) {
          h.dispose();
        }

        desc[key] = v;
        return desc;
      }, {});
      Object.defineProperty(target, keyName, desc);
    }).consume(function (fn) {
      call(vm, "(o, fn) => {\n        const descs = Object.getOwnPropertyDescriptors(o);\n        Object.entries(descs).forEach(([k, v]) => fn(k, v));\n        Object.getOwnPropertySymbols(descs).forEach(k => fn(k, descs[k]));\n      }", undefined, handle, fn).dispose();
    });
  }

  function unmarshalFunction(vm, handle, marshal, unmarshal, preUnmarshal) {
    var _preUnmarshal;

    if (vm["typeof"](handle) !== "function") return;

    var raw = function _target() {
      var thisHandle = marshal(this);
      var argHandles = [].slice.call(arguments).map(function (a) {
        return marshal(a);
      });

      if (this instanceof _target ? this.constructor : void 0) {
        var _unmarshal = unmarshal(call.apply(void 0, [vm, "(Cls, ...args) => new Cls(...args)", thisHandle, handle].concat(argHandles))),
            instance = _unmarshal[0];

        Object.defineProperties(this, Object.getOwnPropertyDescriptors(instance));
        return this;
      }

      var resultHandle = vm.unwrapResult(vm.callFunction.apply(vm, [handle, thisHandle].concat(argHandles)));

      var _unmarshal2 = unmarshal(resultHandle),
          result = _unmarshal2[0],
          alreadyExists = _unmarshal2[1];

      if (alreadyExists) resultHandle.dispose();
      return result;
    };

    var func = (_preUnmarshal = preUnmarshal(raw, handle)) != null ? _preUnmarshal : raw;
    unmarshalProperties(vm, handle, raw, unmarshal);
    return func;
  }

  function unmarshalObject(vm, handle, unmarshal, preUnmarshal) {
    var _preUnmarshal;

    if (vm["typeof"](handle) !== "object" || // null check
    vm.unwrapResult(vm.evalCode("o => o === null")).consume(function (n) {
      return vm.dump(vm.unwrapResult(vm.callFunction(n, vm.undefined, handle)));
    })) return;
    var raw = call(vm, "Array.isArray", undefined, handle).consume(function (r) {
      return vm.dump(r);
    }) ? [] : {};
    var obj = (_preUnmarshal = preUnmarshal(raw, handle)) != null ? _preUnmarshal : raw;
    var prototype = call(vm, "o => {\n      const p = Object.getPrototypeOf(o);\n      return !p || p === Object.prototype || p === Array.prototype ? undefined : p;\n    }", undefined, handle).consume(function (prototype) {
      if (vm["typeof"](prototype) === "undefined") return;

      var _unmarshal = unmarshal(prototype),
          proto = _unmarshal[0];

      return proto;
    });

    if (typeof prototype === "object") {
      Object.setPrototypeOf(obj, prototype);
    }

    unmarshalProperties(vm, handle, raw, unmarshal);
    return obj;
  }

  function unmarshalPrimitive(vm, handle) {
    var ty = vm["typeof"](handle);

    if (ty === "undefined" || ty === "number" || ty === "string" || ty === "boolean") {
      return [vm.dump(handle), true];
    } else if (ty === "object") {
      var isNull = vm.unwrapResult(vm.evalCode("a => a === null")).consume(function (n) {
        return vm.dump(vm.unwrapResult(vm.callFunction(n, vm.undefined, handle)));
      });

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

    if (vm["typeof"](handle) !== "symbol") return;
    var desc = vm.getString(vm.getProp(handle, "description"));
    var sym = Symbol(desc);
    return (_preUnmarshal = preUnmarshal(sym, handle)) != null ? _preUnmarshal : sym;
  }

  function unmarshal(handle, options) {
    var _unmarshalInner = unmarshalInner(handle, options),
        result = _unmarshalInner[0];

    return result;
  }

  function unmarshalInner(handle, options) {
    var _ref, _unmarshalSymbol;

    var vm = options.vm,
        marshal = options.marshal,
        find = options.find,
        pre = options.pre;
    {
      var _unmarshalPrimitive = unmarshalPrimitive(vm, handle),
          target = _unmarshalPrimitive[0],
          ok = _unmarshalPrimitive[1];

      if (ok) return [target, false];
    }
    {
      var _target = find(handle);

      if (_target) {
        return [_target, true];
      }
    }

    var unmarshal2 = function unmarshal2(h) {
      return unmarshalInner(h, options);
    };

    var result = (_ref = (_unmarshalSymbol = unmarshalSymbol(vm, handle, pre)) != null ? _unmarshalSymbol : unmarshalFunction(vm, handle, marshal, unmarshal2, pre)) != null ? _ref : unmarshalObject(vm, handle, unmarshal2, pre);
    return [result, false];
  }

  function wrap(vm, target, proxyKeySymbol, proxyKeySymbolHandle, marshal, syncMode) {
    if (!isObject(target)) return undefined;
    if (isWrapped(target, proxyKeySymbol)) return target;
    var rec = new Proxy(target, {
      get: function get(obj, key) {
        return key === proxyKeySymbol ? obj : Reflect.get(obj, key);
      },
      set: function set(obj, key, value, receiver) {
        var _syncMode;

        var v = unwrap(value, proxyKeySymbol);
        var sync = (_syncMode = syncMode == null ? void 0 : syncMode(receiver)) != null ? _syncMode : "host";

        if (sync === "vm" || Reflect.set(obj, key, v, receiver)) {
          if (sync === "host") return true;

          var _unwrapHandle = unwrapHandle(vm, marshal(receiver), proxyKeySymbolHandle),
              handle2 = _unwrapHandle[0],
              unwrapped = _unwrapHandle[1];

          if (unwrapped) {
            handle2.consume(function (h) {
              return vm.setProp(h, marshal(key), marshal(v));
            });
          } else {
            vm.setProp(handle2, marshal(key), marshal(v));
          }
        }

        return true;
      },
      deleteProperty: function deleteProperty(obj, key) {
        var _syncMode2;

        var sync = (_syncMode2 = syncMode == null ? void 0 : syncMode(rec)) != null ? _syncMode2 : "host";

        var _unwrapHandle2 = unwrapHandle(vm, marshal(rec), proxyKeySymbolHandle),
            handle2 = _unwrapHandle2[0],
            unwrapped = _unwrapHandle2[1];

        if (sync === "vm" || Reflect.deleteProperty(obj, key)) {
          if (sync === "host") return true;

          if (unwrapped) {
            handle2.consume(function (h) {
              return call(vm, "(a, b) => delete a[b]", undefined, h, marshal(key));
            });
          } else {
            call(vm, "(a, b) => delete a[b]", undefined, handle2, marshal(key));
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
    return consumeAll([vm.newFunction("getSyncMode", function (h) {
      var res = syncMode == null ? void 0 : syncMode(unmarshal(h));
      if (typeof res === "string") return vm.newString(res);
      return vm.undefined;
    }), vm.newFunction("setter", function (h, keyHandle, valueHandle) {
      var target = unmarshal(h);
      if (!target) return;
      var key = unmarshal(keyHandle);
      if (key === "__proto__") return; // for security

      var value = unmarshal(valueHandle);
      unwrap(target, proxyKeySymbol)[key] = value;
    }), vm.newFunction("deleter", function (h, keyHandle) {
      var target = unmarshal(h);
      if (!target) return;
      var key = unmarshal(keyHandle);
      delete unwrap(target, proxyKeySymbol)[key];
    })], function (args) {
      return [call.apply(void 0, [vm, "(target, sym, getSyncMode, setter, deleter) => {\n          const rec =  new Proxy(target, {\n            get(obj, key, receiver) {\n              return key === sym ? obj : Reflect.get(obj, key, receiver)\n            },\n            set(obj, key, value, receiver) {\n              const v = typeof value === \"object\" && value !== null || typeof value === \"function\"\n                ? value[sym] ?? value\n                : value;\n              const sync = getSyncMode(receiver) ?? \"vm\";\n              if (sync === \"host\" || Reflect.set(obj, key, v, receiver)) {\n                if (sync !== \"vm\") {\n                  setter(receiver, key, v);\n                }\n              }\n              return true;\n            },\n            deleteProperty(obj, key) {\n              const sync = getSyncMode(rec) ?? \"vm\";\n              if (sync === \"host\" || Reflect.deleteProperty(obj, key)) {\n                if (sync !== \"vm\") {\n                  deleter(rec, key);\n                }\n              }\n              return true;\n            },\n          });\n          return rec;\n        }", undefined, handle, proxyKeySymbolHandle].concat(args)), true];
    });
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
    return !!vm.dump(call(vm, "(a, s) => (typeof a === \"object\" && a !== null || typeof a === \"function\") && !!a[s]", undefined, handle, key));
  }

  /**
   * Default value of registeredObjects option of the Arena class constructor.
   */
  var defaultRegisteredObjects = [// basic objects
  [Symbol, "Symbol"], [Symbol.prototype, "Symbol.prototype"], [Object, "Object"], [Object.prototype, "Object.prototype"], [Function, "Function"], [Function.prototype, "Function.prototype"], [Boolean, "Boolean"], [Boolean.prototype, "Boolean.prototype"], [Array, "Array"], [Array.prototype, "Array.prototype"], // [BigInt, "BigInt"],
  // [BigInt.prototype, "BigInt.prototype"],
  // errors
  [Error, "Error"], [Error.prototype, "Error.prototype"], [EvalError, "EvalError"], [EvalError.prototype, "EvalError.prototype"], [RangeError, "RangeError"], [RangeError.prototype, "RangeError.prototype"], [ReferenceError, "ReferenceError"], [ReferenceError.prototype, "ReferenceError.prototype"], [SyntaxError, "SyntaxError"], [SyntaxError.prototype, "SyntaxError.prototype"], [TypeError, "TypeError"], [TypeError.prototype, "TypeError.prototype"], [URIError, "URIError"], [URIError.prototype, "URIError.prototype"]].concat(Object.getOwnPropertyNames(Symbol).filter(function (k) {
    return typeof Symbol[k] === "symbol";
  }).map(function (k) {
    return [Symbol[k], "Symbol." + k];
  }));

  /**
   * The Arena class manages all generated handles at once by quickjs-emscripten and automatically converts objects between the host and the QuickJS VM.
   */

  var Arena = /*#__PURE__*/function () {
    /** Constructs a new Arena instance. It requires a quickjs-emscripten VM initialized with `quickjs.createVM()`. */
    function Arena(vm, options) {
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
      this._symbolHandle = vm.unwrapResult(vm.evalCode("Symbol()"));
      this._map = new VMMap(vm);
      this._registeredMap = new VMMap(vm);
      this.registerAll((_options$registeredOb = options == null ? void 0 : options.registeredObjects) != null ? _options$registeredOb : defaultRegisteredObjects);
    }
    /**
     * Dispose of the arena and managed handles. This method won't dispose the VM itself, so the VM has to be disposed of manually.
     */


    var _proto = Arena.prototype;

    _proto.dispose = function dispose() {
      this._map.dispose();

      this._registeredMap.dispose();

      this._symbolHandle.dispose();
    }
    /**
     * Evaluate JS code in the VM and get the result as an object on the host side. It also converts and re-throws error objects when an error is thrown during evaluation.
     */
    ;

    _proto.evalCode = function evalCode(code) {
      var handle = this.vm.evalCode(code);
      return this._unwrapResultAndUnmarshal(handle);
    }
    /**
     * Almost same as `vm.executePendingJobs()`, but it converts and re-throws error objects when an error is thrown during evaluation.
     */
    ;

    _proto.executePendingJobs = function executePendingJobs(maxJobsToExecute) {
      var _this = this;

      var result = this.vm.executePendingJobs(maxJobsToExecute);

      if ("value" in result) {
        return result.value;
      }

      throw result.error.consume(function (err) {
        return _this._unmarshal(err);
      });
    }
    /**
     * Expose objects as global objects in the VM.
     *
     * By default, exposed objects are not synchronized between the host and the VM.
     * If you want to sync an objects, first wrap the object with sync method, and then expose the wrapped object.
     */
    ;

    _proto.expose = function expose(obj) {
      for (var _i = 0, _Object$entries = Object.entries(obj); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _Object$entries[_i],
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        var handle = this._marshal(value);

        this.vm.setProp(this.vm.global, key, handle);
      }
    }
    /**
     * Enables sync for the object between the host and the VM and returns objects wrapped with proxies.
     *
     * The return value is necessary in order to reflect changes to the object from the host to the VM. Please note that setting a value in the field or deleting a field in the original object will not synchronize it.
     */
    ;

    _proto.sync = function sync(target) {
      var _this2 = this;

      var wrapped = this._wrap(target);

      if (typeof wrapped === "undefined") return target;
      walkObject(wrapped, function (v) {
        _this2._sync.add(_this2._unwrap(v));
      });
      return wrapped;
    }
    /**
     * Register a pair of objects that will be considered the same between the host and the QuickJS VM.
     *
     * Instead of a string, you can also pass a QuickJSHandle directly. In that case, however, when  you have to dispose them manually when destroying the VM.
     */
    ;

    _proto.register = function register(target, handleOrCode) {
      if (this._registeredMap.has(target)) return;
      var handle = typeof handleOrCode === "string" ? this._unwrapResult(this.vm.evalCode(handleOrCode)) : handleOrCode;
      if (eq(this.vm, handle, this.vm.undefined)) return;

      if (typeof handleOrCode === "string") {
        this._registeredMapDispose.add(target);
      }

      this._registeredMap.set(target, handle);
    }
    /**
     * Execute `register` methods for each pair.
     */
    ;

    _proto.registerAll = function registerAll(map) {
      for (var _iterator = _createForOfIteratorHelperLoose(map), _step; !(_step = _iterator()).done;) {
        var _step$value = _step.value,
            k = _step$value[0],
            v = _step$value[1];
        this.register(k, v);
      }
    }
    /**
     * Unregister a pair of objects that were registered with `registeredObjects` option and `register` method.
     */
    ;

    _proto.unregister = function unregister(target, dispose) {
      this._registeredMap["delete"](target, this._registeredMapDispose.has(target) || dispose);

      this._registeredMapDispose["delete"](target);
    }
    /**
     * Execute `unregister` methods for each target.
     */
    ;

    _proto.unregisterAll = function unregisterAll(targets, dispose) {
      for (var _iterator2 = _createForOfIteratorHelperLoose(targets), _step2; !(_step2 = _iterator2()).done;) {
        var t = _step2.value;
        this.unregister(t, dispose);
      }
    };

    _proto.startSync = function startSync(target) {
      if (!isObject(target)) return;

      this._sync.add(this._unwrap(target));
    };

    _proto.endSync = function endSync(target) {
      this._sync["delete"](this._unwrap(target));
    };

    _proto._unwrapResult = function _unwrapResult(result) {
      var _this3 = this;

      if ("value" in result) {
        return result.value;
      }

      throw result.error.consume(function (err) {
        return _this3._unmarshal(err);
      });
    };

    _proto._unwrapResultAndUnmarshal = function _unwrapResultAndUnmarshal(result) {
      var _this4 = this;

      if (!result) return;
      return this._unwrapResult(result).consume(function (h) {
        return _this4._unmarshal(h);
      });
    };

    _proto._marshal = function _marshal(target) {
      var _this$_wrap,
          _this5 = this;

      var registered = this._registeredMap.get(target);

      if (registered) {
        return registered;
      }

      var handle = marshal((_this$_wrap = this._wrap(target)) != null ? _this$_wrap : target, {
        vm: this.vm,
        unmarshal: function unmarshal(h) {
          return _this5._unmarshal(h);
        },
        isMarshalable: function isMarshalable(t) {
          var _this5$_options$isMar, _this5$_options;

          return (_this5$_options$isMar = (_this5$_options = _this5._options) == null ? void 0 : _this5$_options.isMarshalable == null ? void 0 : _this5$_options.isMarshalable(_this5._unwrap(t))) != null ? _this5$_options$isMar : true;
        },
        find: function find(t) {
          var _this5$_registeredMap;

          return (_this5$_registeredMap = _this5._registeredMap.get(t)) != null ? _this5$_registeredMap : _this5._map.get(t);
        },
        pre: function pre(t, h) {
          var _this5$_register;

          return (_this5$_register = _this5._register(t, h, _this5._map)) == null ? void 0 : _this5$_register[1];
        },
        preApply: function preApply(target, that, args) {
          var unwrapped = isObject(that) ? _this5._unwrap(that) : undefined; // override sync mode of this object while calling the function

          if (unwrapped) _this5._temporalSync.add(unwrapped);

          try {
            return target.apply(that, args);
          } finally {
            // restore sync mode
            if (unwrapped) _this5._temporalSync["delete"](unwrapped);
          }
        }
      });
      return handle;
    };

    _proto._unmarshal = function _unmarshal(handle) {
      var _this6 = this;

      var registered = this._registeredMap.getByHandle(handle);

      if (typeof registered !== "undefined") {
        return registered;
      }

      var _this$_wrapHandle = this._wrapHandle(handle),
          wrappedHandle = _this$_wrapHandle[0];

      return unmarshal(wrappedHandle != null ? wrappedHandle : handle, {
        vm: this.vm,
        marshal: function marshal(v) {
          return _this6._marshal(v);
        },
        find: function find(h) {
          var _this6$_registeredMap;

          return (_this6$_registeredMap = _this6._registeredMap.getByHandle(h)) != null ? _this6$_registeredMap : _this6._map.getByHandle(h);
        },
        pre: function pre(t, h) {
          var _this6$_register;

          return (_this6$_register = _this6._register(t, h, undefined, true)) == null ? void 0 : _this6$_register[0];
        }
      });
    };

    _proto._register = function _register(t, h, map, sync) {
      if (map === void 0) {
        map = this._map;
      }

      if (this._registeredMap.has(t) || this._registeredMap.hasHandle(h)) {
        return;
      }

      var wrappedT = this._wrap(t);

      var _this$_wrapHandle2 = this._wrapHandle(h),
          wrappedH = _this$_wrapHandle2[0];

      if (!wrappedT || !wrappedH) return; // t or h is not an object

      var unwrappedT = this._unwrap(t);

      var _this$_unwrapHandle = this._unwrapHandle(h),
          unwrappedH = _this$_unwrapHandle[0],
          unwrapped = _this$_unwrapHandle[1];

      var res = map.set(wrappedT, wrappedH, unwrappedT, unwrappedH);

      if (!res) {
        // already registered
        if (unwrapped) unwrappedH.dispose();
        throw new Error("already registered");
      } else if (sync) {
        this._sync.add(unwrappedT);
      }

      return [wrappedT, wrappedH];
    };

    _proto._syncMode = function _syncMode(obj) {
      var obj2 = this._unwrap(obj);

      return this._sync.has(obj2) || this._temporalSync.has(obj2) ? "both" : undefined;
    };

    _proto._wrap = function _wrap(target) {
      var _this7 = this;

      return wrap(this.vm, target, this._symbol, this._symbolHandle, function (t) {
        return _this7._marshal(t);
      }, function (t) {
        return _this7._syncMode(t);
      });
    };

    _proto._unwrap = function _unwrap(target) {
      return unwrap(target, this._symbol);
    };

    _proto._wrapHandle = function _wrapHandle(handle) {
      var _this8 = this;

      return wrapHandle(this.vm, handle, this._symbol, this._symbolHandle, function (h) {
        return _this8._unmarshal(h);
      }, function (t) {
        return _this8._syncMode(t);
      });
    };

    _proto._unwrapHandle = function _unwrapHandle(target) {
      return unwrapHandle(this.vm, target, this._symbolHandle);
    };

    return Arena;
  }();

  exports.Arena = Arena;
  exports.VMMap = VMMap;
  exports.call = call;
  exports.complexity = complexity;
  exports.consumeAll = consumeAll;
  exports.defaultRegisteredObjects = defaultRegisteredObjects;
  exports.eq = eq;
  exports.isES2015Class = isES2015Class;
  exports.isHandleObject = isHandleObject;
  exports.isObject = isObject;
  exports.marshal = marshal;
  exports.send = send;
  exports.unmarshal = unmarshal;
  exports.walkObject = walkObject;

})));
//# sourceMappingURL=quickjs-emscripten-sync.umd.js.map
