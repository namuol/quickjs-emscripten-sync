function e(t,r){return e=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},e(t,r)}function t(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}function r(n,o,i){return r=t()?Reflect.construct:function(t,r,n){var o=[null];o.push.apply(o,r);var i=new(Function.bind.apply(t,o));return n&&e(i,n.prototype),i},r.apply(null,arguments)}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function o(e,t){var r="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(r)return(r=r.call(e)).next.bind(r);if(Array.isArray(e)||(r=function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){r&&(e=r);var o=0;return function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i=function(e){function t(e){var t=this;this.vm=void 0,this._map1=new Map,this._map2=new Map,this._map3=new Map,this._map4=new Map,this._counterMap=new Map,this._disposables=new Set,this._mapGet=void 0,this._mapSet=void 0,this._mapDelete=void 0,this._mapClear=void 0,this._counter=0,this.vm=e;var r=e.unwrapResult(e.evalCode('() => {\n        const mapSym = new Map();\n        let map = new WeakMap();\n        let map2 = new WeakMap();\n        const isObj = o => typeof o === "object" && o !== null || typeof o === "function";\n        return {\n          get: key => mapSym.get(key) ?? map.get(key) ?? map2.get(key) ?? -1,\n          set: (key, value, key2) => {\n            if (typeof key === "symbol") mapSym.set(key, value);\n            if (isObj(key)) map.set(key, value);\n            if (isObj(key2)) map2.set(key2, value);\n          },\n          delete: (key, key2) => {\n            mapSym.delete(key);\n            map.delete(key);\n            map2.delete(key2);\n          },\n          clear: () => {\n            mapSym.clear();\n            map = new WeakMap();\n            map2 = new WeakMap();\n          }\n        };\n      }')).consume(function(e){return t._call(e,void 0)});this._mapGet=e.getProp(r,"get"),this._mapSet=e.getProp(r,"set"),this._mapDelete=e.getProp(r,"delete"),this._mapClear=e.getProp(r,"clear"),r.dispose(),this._disposables.add(this._mapGet),this._disposables.add(this._mapSet),this._disposables.add(this._mapDelete),this._disposables.add(this._mapClear)}var r,n=t.prototype;return n.set=function(e,t,r,n){var o,i=this;if(!t.alive||n&&!n.alive)return!1;var a=null!=(o=this.get(e))?o:this.get(r);if(a)return a===t||a===n;var s=this._counter++;return this._map1.set(e,s),this._map3.set(s,t),this._counterMap.set(s,e),r&&(this._map2.set(r,s),n&&this._map4.set(s,n)),this.vm.newNumber(s).consume(function(e){i._call(i._mapSet,void 0,t,e,null!=n?n:i.vm.undefined)}),!0},n.merge=function(e){if(e)for(var t,r=o(e);!(t=r()).done;){var n=t.value;n&&n[1]&&this.set(n[0],n[1],n[2],n[3])}},n.get=function(e){var t,r=null!=(t=this._map1.get(e))?t:this._map2.get(e),n="number"==typeof r?this._map3.get(r):void 0;if(n){if(n.alive)return n;this.delete(e)}},n.getByHandle=function(e){if(e.alive)return this._counterMap.get(this.vm.getNumber(this._call(this._mapGet,void 0,e)))},n.has=function(e){return!!this.get(e)},n.hasHandle=function(e){return void 0!==this.getByHandle(e)},n.delete=function(e,t){var r,n=null!=(r=this._map1.get(e))?r:this._map2.get(e);if(void 0!==n){var i=this._map3.get(n),a=this._map4.get(n);this._call.apply(this,[this._mapDelete,void 0].concat([i,a].filter(function(e){return!(null==e||!e.alive)}))),this._map1.delete(e),this._map2.delete(e),this._map3.delete(n),this._map4.delete(n);for(var s,u=o(this._map1);!(s=u()).done;){var l=s.value;if(l[1]===n){this._map1.delete(l[0]);break}}for(var p,c=o(this._map2);!(p=c()).done;){var f=p.value;if(f[1]===n){this._map2.delete(f[0]);break}}for(var v,d=o(this._counterMap);!(v=d()).done;){var y=v.value;if(y[1]===e){this._counterMap.delete(y[0]);break}}t&&(null!=i&&i.alive&&i.dispose(),null!=a&&a.alive&&a.dispose())}},n.deleteByHandle=function(e,t){var r=this.getByHandle(e);void 0!==r&&this.delete(r,t)},n.clear=function(){this._counter=0,this._map1.clear(),this._map2.clear(),this._map3.clear(),this._map4.clear(),this._counterMap.clear(),this._mapClear.alive&&this._call(this._mapClear,void 0)},n.dispose=function(){for(var e,t=o(this._disposables.values());!(e=t()).done;){var r=e.value;r.alive&&r.dispose()}for(var n,i=o(this._map3.values());!(n=i()).done;){var a=n.value;a.alive&&a.dispose()}for(var s,u=o(this._map4.values());!(s=u()).done;){var l=s.value;l.alive&&l.dispose()}this._disposables.clear(),this.clear()},n[e]=function(){var e=this,t=this._map1.keys();return{next:function(){for(;;){var r=t.next();if(r.done)return{value:void 0,done:!0};var n=e._map1.get(r.value);if(void 0!==n){var o=e._map3.get(n),i=e._map4.get(n);if(o){var a=e._get2(n);return{value:[r.value,o,a,i],done:!1}}}}}}},n._get2=function(e){for(var t,r=o(this._map2);!(t=r()).done;){var n=t.value;if(n[1]===e)return n[0]}},n._call=function(e,t){var r;return this.vm.unwrapResult((r=this.vm).callFunction.apply(r,[e,void 0===t?this.vm.undefined:t].concat([].slice.call(arguments,2))))},(r=[{key:"size",get:function(){return this._map1.size}}])&&function(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}(t.prototype,r),t}(Symbol.iterator);function a(e){return"function"==typeof e&&/^class\s/.test(Function.prototype.toString.call(e))}function s(e){return"function"==typeof e||"object"==typeof e&&null!==e}function u(e,t){var r=new Set;return function e(n){if(s(n)&&!r.has(n)&&!1!==(null==t?void 0:t(n,r)))if(r.add(n),Array.isArray(n))for(var i,a=o(n);!(i=a()).done;)e(i.value);else{if("object"==typeof n){var u=Object.getPrototypeOf(n);u&&u!==Object.prototype&&e(u)}for(var l=0,p=Object.values(Object.getOwnPropertyDescriptors(n));l<p.length;l++){var c=p[l];"value"in c&&e(c.value),"get"in c&&e(c.get),"set"in c&&e(c.set)}}}(e),r}function l(e,t,r){var n=[].slice.call(arguments,3);return e.unwrapResult(e.evalCode(t)).consume(function(t){return void 0===r&&0===n.length?t:e.unwrapResult(e.callFunction.apply(e,[t,null!=r?r:e.undefined].concat(n)))})}function p(e,t,r){return e.dump(l(e,"Object.is",void 0,t,r))}function c(e,t){return e.dump(l(e,'a => typeof a === "object" && a !== null || typeof a === "function"',void 0,t))}function f(e,t){try{return t(e)}finally{for(var r,n=o(e);!(r=n()).done;){var i=r.value;i.alive&&i.dispose()}}}function v(e,t,r,n){var o=e.newObject(),i=function(t,r){var i=n(t),a=void 0===r.value?void 0:n(r.value),s=void 0===r.get?void 0:n(r.get),u=void 0===r.set?void 0:n(r.set);e.newObject().consume(function(t){Object.entries(r).forEach(function(r){var n=r[0],o="value"===n?a:"get"===n?s:"set"===n?u:r[1]?e.true:e.false;o&&e.setProp(t,n,o)}),e.setProp(o,i,t)})},a=Object.getOwnPropertyDescriptors(t);Object.entries(a).forEach(function(e){return i(e[0],e[1])}),Object.getOwnPropertySymbols(a).forEach(function(e){return i(e,a[e])}),l(e,"Object.defineProperties",void 0,r,o).dispose(),o.dispose()}function d(e,t){var n,o,i,u=t.vm,p=t.unmarshal,c=t.isMarshalable,f=t.find,y=t.pre,h=function(e,t){switch(typeof t){case"undefined":return e.undefined;case"number":return e.newNumber(t);case"string":return e.newString(t);case"boolean":return t?e.true:e.false;case"object":return null===t?e.null:void 0}}(u,e);if(h)return h;var m=f(e);if(m)return m;if(!1===(null==c?void 0:c(e)))return u.undefined;var _=function(e){return d(e,t)},b=null!=(n=null!=(o=null!=(i=function(e,t,r){var n;if("symbol"==typeof t){var o=l(e,"d => Symbol(d)",void 0,t.description?e.newString(t.description):e.undefined);return null!=(n=r(t,o))?n:o}}(u,e,y))?i:function(e,t,n,o,i,u){var p;if("function"==typeof t){var c=e.newFunction(t.name,function(){var i=this,l=o(this),p=[].slice.call(arguments).map(function(e){return o(e)});if(a(t)&&s(l)){var c=r(t,p);return Object.entries(c).forEach(function(t){e.setProp(i,t[0],n(t[1]))}),this}return n(u?u(t,l,p):t.apply(l,p))}).consume(function(t){return l(e,"Cls => {\n          const fn = function(...args) { return Cls.apply(this, args); };\n          fn.name = Cls.name;\n          fn.length = Cls.length;\n          return fn;\n        }",void 0,t)}),f=null!=(p=i(t,c))?p:c;return v(e,t,c,n),f}}(u,e,_,p,y,t.preApply))?o:function(e,t,r,n){var o;if("object"==typeof t&&null!==t){var i=Array.isArray(t)?e.newArray():e.newObject(),a=null!=(o=n(t,i))?o:i,s=Object.getPrototypeOf(t),u=s&&s!==Object.prototype&&s!==Array.prototype?r(s):void 0;return u&&l(e,"Object.setPrototypeOf",void 0,a,u).dispose(),v(e,t,i,r),a}}(u,e,_,y))?n:u.undefined;return b}function y(e,t,r,n){e.newFunction("",function(t,o){var i=n(t)[0];if("string"==typeof i||"number"==typeof i||"symbol"==typeof i){var a=[["value",!0],["get",!0],["set",!0],["configurable",!1],["enumerable",!1],["writable",!1]].reduce(function(t,r){var i=r[0],a=r[1],s=e.getProp(o,i),u=e.typeof(s);if("undefined"===u)return t;if(!a&&"boolean"===u)return t[i]=e.dump(e.getProp(o,i)),t;var l=n(s),p=l[0];return l[1]&&s.dispose(),t[i]=p,t},{});Object.defineProperty(r,i,a)}}).consume(function(r){l(e,"(o, fn) => {\n        const descs = Object.getOwnPropertyDescriptors(o);\n        Object.entries(descs).forEach(([k, v]) => fn(k, v));\n        Object.getOwnPropertySymbols(descs).forEach(k => fn(k, descs[k]));\n      }",void 0,t,r).dispose()})}function h(e,t){return m(e,t)[0]}function m(e,t){var r,n,o=t.vm,i=t.marshal,a=t.find,s=t.pre,u=function(e,t){var r=e.typeof(t);return"undefined"===r||"number"===r||"string"===r||"boolean"===r?[e.dump(t),!0]:"object"===r&&e.unwrapResult(e.evalCode("a => a === null")).consume(function(r){return e.dump(e.unwrapResult(e.callFunction(r,e.undefined,t)))})?[null,!0]:[void 0,!1]}(o,e);if(u[1])return[u[0],!1];var p=a(e);if(p)return[p,!0];var c=function(e){return m(e,t)},f=null!=(r=null!=(n=function(e,t,r){var n;if("symbol"===e.typeof(t)){var o=e.getString(e.getProp(t,"description")),i=Symbol(o);return null!=(n=r(i,t))?n:i}}(o,e,s))?n:function(e,t,r,n,o){var i;if("function"===e.typeof(t)){var a=function o(){var i=r(this),a=[].slice.call(arguments).map(function(e){return r(e)});if(this instanceof o?this.constructor:void 0){var s=n(l.apply(void 0,[e,"(Cls, ...args) => new Cls(...args)",i,t].concat(a)));return Object.defineProperties(this,Object.getOwnPropertyDescriptors(s[0])),this}var u=e.unwrapResult(e.callFunction.apply(e,[t,i].concat(a))),p=n(u),c=p[0];return p[1]&&u.dispose(),c},s=null!=(i=o(a,t))?i:a;return y(e,t,a,n),s}}(o,e,i,c,s))?r:function(e,t,r,n){var o;if("object"===e.typeof(t)&&!e.unwrapResult(e.evalCode("o => o === null")).consume(function(r){return e.dump(e.unwrapResult(e.callFunction(r,e.undefined,t)))})){var i=l(e,"Array.isArray",void 0,t).consume(function(t){return e.dump(t)})?[]:{},a=null!=(o=n(i,t))?o:i,s=l(e,"o => {\n      const p = Object.getPrototypeOf(o);\n      return !p || p === Object.prototype || p === Array.prototype ? undefined : p;\n    }",void 0,t).consume(function(t){if("undefined"!==e.typeof(t))return r(t)[0]});return"object"==typeof s&&Object.setPrototypeOf(a,s),y(e,t,i,r),a}}(o,e,c,s);return[f,!1]}function _(e,t){var r;return s(e)&&null!=(r=e[t])?r:e}function b(e,t,r){return g(e,t,r)?[e.getProp(t,r),!0]:[t,!1]}function g(e,t,r){return!!e.dump(l(e,'(a, s) => (typeof a === "object" && a !== null || typeof a === "function") && !!a[s]',void 0,t,r))}var w=[[Symbol,"Symbol"],[Symbol.prototype,"Symbol.prototype"],[Object,"Object"],[Object.prototype,"Object.prototype"],[Function,"Function"],[Function.prototype,"Function.prototype"],[Boolean,"Boolean"],[Boolean.prototype,"Boolean.prototype"],[Array,"Array"],[Array.prototype,"Array.prototype"],[Error,"Error"],[Error.prototype,"Error.prototype"],[EvalError,"EvalError"],[EvalError.prototype,"EvalError.prototype"],[RangeError,"RangeError"],[RangeError.prototype,"RangeError.prototype"],[ReferenceError,"ReferenceError"],[ReferenceError.prototype,"ReferenceError.prototype"],[SyntaxError,"SyntaxError"],[SyntaxError.prototype,"SyntaxError.prototype"],[TypeError,"TypeError"],[TypeError.prototype,"TypeError.prototype"],[URIError,"URIError"],[URIError.prototype,"URIError.prototype"]].concat(Object.getOwnPropertyNames(Symbol).filter(function(e){return"symbol"==typeof Symbol[e]}).map(function(e){return[Symbol[e],"Symbol."+e]}));exports.Arena=function(){function e(e,t){var r;this.vm=void 0,this._map=void 0,this._registeredMap=void 0,this._registeredMapDispose=new Set,this._sync=new Set,this._temporalSync=new Set,this._symbol=Symbol(),this._symbolHandle=void 0,this._options=void 0,this.vm=e,this._options=t,this._symbolHandle=e.unwrapResult(e.evalCode("Symbol()")),this._map=new i(e),this._registeredMap=new i(e),this.registerAll(null!=(r=null==t?void 0:t.registeredObjects)?r:w)}var t=e.prototype;return t.dispose=function(){this._map.dispose(),this._registeredMap.dispose(),this._symbolHandle.dispose()},t.evalCode=function(e){var t=this.vm.evalCode(e);return this._unwrapResultAndUnmarshal(t)},t.executePendingJobs=function(e){var t=this,r=this.vm.executePendingJobs(e);if("value"in r)return r.value;throw r.error.consume(function(e){return t._unmarshal(e)})},t.expose=function(e){for(var t=0,r=Object.entries(e);t<r.length;t++){var n=r[t],o=n[0],i=this._marshal(n[1]);this.vm.setProp(this.vm.global,o,i)}},t.sync=function(e){var t=this,r=this._wrap(e);return void 0===r?e:(u(r,function(e){t._sync.add(t._unwrap(e))}),r)},t.register=function(e,t){if(!this._registeredMap.has(e)){var r="string"==typeof t?this._unwrapResult(this.vm.evalCode(t)):t;p(this.vm,r,this.vm.undefined)||("string"==typeof t&&this._registeredMapDispose.add(e),this._registeredMap.set(e,r))}},t.registerAll=function(e){for(var t,r=o(e);!(t=r()).done;){var n=t.value;this.register(n[0],n[1])}},t.unregister=function(e,t){this._registeredMap.delete(e,this._registeredMapDispose.has(e)||t),this._registeredMapDispose.delete(e)},t.unregisterAll=function(e,t){for(var r,n=o(e);!(r=n()).done;)this.unregister(r.value,t)},t.startSync=function(e){s(e)&&this._sync.add(this._unwrap(e))},t.endSync=function(e){this._sync.delete(this._unwrap(e))},t._unwrapResult=function(e){var t=this;if("value"in e)return e.value;throw e.error.consume(function(e){return t._unmarshal(e)})},t._unwrapResultAndUnmarshal=function(e){var t=this;if(e)return this._unwrapResult(e).consume(function(e){return t._unmarshal(e)})},t._marshal=function(e){var t,r=this,n=this._registeredMap.get(e);if(n)return n;var o=d(null!=(t=this._wrap(e))?t:e,{vm:this.vm,unmarshal:function(e){return r._unmarshal(e)},isMarshalable:function(e){var t,n;return null==(t=null==(n=r._options)||null==n.isMarshalable?void 0:n.isMarshalable(r._unwrap(e)))||t},find:function(e){var t;return null!=(t=r._registeredMap.get(e))?t:r._map.get(e)},pre:function(e,t){var n;return null==(n=r._register(e,t,r._map))?void 0:n[1]},preApply:function(e,t,n){var o=s(t)?r._unwrap(t):void 0;o&&r._temporalSync.add(o);try{return e.apply(t,n)}finally{o&&r._temporalSync.delete(o)}}});return o},t._unmarshal=function(e){var t=this,r=this._registeredMap.getByHandle(e);if(void 0!==r)return r;var n=this._wrapHandle(e)[0];return h(null!=n?n:e,{vm:this.vm,marshal:function(e){return t._marshal(e)},find:function(e){var r;return null!=(r=t._registeredMap.getByHandle(e))?r:t._map.getByHandle(e)},pre:function(e,r){var n;return null==(n=t._register(e,r,void 0,!0))?void 0:n[0]}})},t._register=function(e,t,r,n){if(void 0===r&&(r=this._map),!this._registeredMap.has(e)&&!this._registeredMap.hasHandle(t)){var o=this._wrap(e),i=this._wrapHandle(t)[0];if(o&&i){var a=this._unwrap(e),s=this._unwrapHandle(t),u=s[0],l=s[1];if(!r.set(o,i,a,u))throw l&&u.dispose(),new Error("already registered");return n&&this._sync.add(a),[o,i]}}},t._syncMode=function(e){var t=this._unwrap(e);return this._sync.has(t)||this._temporalSync.has(t)?"both":void 0},t._wrap=function(e){var t=this;return function(e,t,r,n,o,i){if(s(t)){if(u=r,s(a=t)&&a[u])return t;var a,u,p=new Proxy(t,{get:function(e,t){return t===r?e:Reflect.get(e,t)},set:function(t,a,s,u){var l,p=_(s,r),c=null!=(l=null==i?void 0:i(u))?l:"host";if("vm"===c||Reflect.set(t,a,p,u)){if("host"===c)return!0;var f=b(e,o(u),n),v=f[0];f[1]?v.consume(function(t){return e.setProp(t,o(a),o(p))}):e.setProp(v,o(a),o(p))}return!0},deleteProperty:function(t,r){var a,s=null!=(a=null==i?void 0:i(p))?a:"host",u=b(e,o(p),n),c=u[0],f=u[1];if("vm"===s||Reflect.deleteProperty(t,r)){if("host"===s)return!0;f?c.consume(function(t){return l(e,"(a, b) => delete a[b]",void 0,t,o(r))}):l(e,"(a, b) => delete a[b]",void 0,c,o(r))}return!0}});return p}}(this.vm,e,this._symbol,this._symbolHandle,function(e){return t._marshal(e)},function(e){return t._syncMode(e)})},t._unwrap=function(e){return _(e,this._symbol)},t._wrapHandle=function(e){var t=this;return function(e,t,r,n,o,i){return c(e,t)?g(e,t,n)?[t,!1]:f([e.newFunction("getSyncMode",function(t){var r=null==i?void 0:i(o(t));return"string"==typeof r?e.newString(r):e.undefined}),e.newFunction("setter",function(e,t,n){var i=o(e);if(i){var a=o(t);if("__proto__"!==a){var s=o(n);_(i,r)[a]=s}}}),e.newFunction("deleter",function(e,t){var n=o(e);if(n){var i=o(t);delete _(n,r)[i]}})],function(r){return[l.apply(void 0,[e,'(target, sym, getSyncMode, setter, deleter) => {\n          const rec =  new Proxy(target, {\n            get(obj, key, receiver) {\n              return key === sym ? obj : Reflect.get(obj, key, receiver)\n            },\n            set(obj, key, value, receiver) {\n              const v = typeof value === "object" && value !== null || typeof value === "function"\n                ? value[sym] ?? value\n                : value;\n              const sync = getSyncMode(receiver) ?? "vm";\n              if (sync === "host" || Reflect.set(obj, key, v, receiver)) {\n                if (sync !== "vm") {\n                  setter(receiver, key, v);\n                }\n              }\n              return true;\n            },\n            deleteProperty(obj, key) {\n              const sync = getSyncMode(rec) ?? "vm";\n              if (sync === "host" || Reflect.deleteProperty(obj, key)) {\n                if (sync !== "vm") {\n                  deleter(rec, key);\n                }\n              }\n              return true;\n            },\n          });\n          return rec;\n        }',void 0,t,n].concat(r)),!0]}):[void 0,!1]}(this.vm,e,this._symbol,this._symbolHandle,function(e){return t._unmarshal(e)},function(e){return t._syncMode(e)})},t._unwrapHandle=function(e){return b(this.vm,e,this._symbolHandle)},e}(),exports.VMMap=i,exports.call=l,exports.complexity=function(e,t){return u(e,t?function(e,r){return r.size<t}:void 0).size},exports.consumeAll=f,exports.defaultRegisteredObjects=w,exports.eq=p,exports.isES2015Class=a,exports.isHandleObject=c,exports.isObject=s,exports.marshal=d,exports.send=function(e,t){var r=JSON.stringify(t);return r?l(e,"JSON.parse",void 0,e.newString(r)):e.undefined},exports.unmarshal=h,exports.walkObject=u;
//# sourceMappingURL=quickjs-emscripten-sync.cjs.map
