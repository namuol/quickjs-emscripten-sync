function e(t,n){return e=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e},e(t,n)}function t(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}function n(r,o,i){return n=t()?Reflect.construct:function(t,n,r){var o=[null];o.push.apply(o,n);var i=new(Function.bind.apply(t,o));return r&&e(i,r.prototype),i},n.apply(null,arguments)}function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function o(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(n)return(n=n.call(e)).next.bind(n);if(Array.isArray(e)||(n=function(e,t){if(e){if("string"==typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var o=0;return function(){return o>=e.length?{done:!0}:{done:!1,value:e[o++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i=function(e){function t(e){var t=this;this.vm=void 0,this._map1=new Map,this._map2=new Map,this._map3=new Map,this._map4=new Map,this._counterMap=new Map,this._disposables=new Set,this._mapGet=void 0,this._mapSet=void 0,this._mapDelete=void 0,this._mapClear=void 0,this._counter=0,this.vm=e;var n=e.unwrapResult(e.evalCode('() => {\n        const mapSym = new Map();\n        let map = new WeakMap();\n        let map2 = new WeakMap();\n        const isObj = o => typeof o === "object" && o !== null || typeof o === "function";\n        return {\n          get: key => mapSym.get(key) ?? map.get(key) ?? map2.get(key) ?? -1,\n          set: (key, value, key2) => {\n            if (typeof key === "symbol") mapSym.set(key, value);\n            if (isObj(key)) map.set(key, value);\n            if (isObj(key2)) map2.set(key2, value);\n          },\n          delete: (key, key2) => {\n            mapSym.delete(key);\n            map.delete(key);\n            map2.delete(key2);\n          },\n          clear: () => {\n            mapSym.clear();\n            map = new WeakMap();\n            map2 = new WeakMap();\n          }\n        };\n      }')).consume(function(e){return t._call(e,void 0)});this._mapGet=e.getProp(n,"get"),this._mapSet=e.getProp(n,"set"),this._mapDelete=e.getProp(n,"delete"),this._mapClear=e.getProp(n,"clear"),n.dispose(),this._disposables.add(this._mapGet),this._disposables.add(this._mapSet),this._disposables.add(this._mapDelete),this._disposables.add(this._mapClear)}var n,r=t.prototype;return r.set=function(e,t,n,r){var o,i=this;if(!t.alive||r&&!r.alive)return!1;var a=null!=(o=this.get(e))?o:this.get(n);if(a)return a===t||a===r;var s=this._counter++;return this._map1.set(e,s),this._map3.set(s,t),this._counterMap.set(s,e),n&&(this._map2.set(n,s),r&&this._map4.set(s,r)),this.vm.newNumber(s).consume(function(e){i._call(i._mapSet,void 0,t,e,null!=r?r:i.vm.undefined)}),!0},r.merge=function(e){if(e)for(var t,n=o(e);!(t=n()).done;){var r=t.value;r&&r[1]&&this.set(r[0],r[1],r[2],r[3])}},r.get=function(e){var t,n=null!=(t=this._map1.get(e))?t:this._map2.get(e),r="number"==typeof n?this._map3.get(n):void 0;if(r){if(r.alive)return r;this.delete(e)}},r.getByHandle=function(e){if(e.alive)return this._counterMap.get(this.vm.getNumber(this._call(this._mapGet,void 0,e)))},r.has=function(e){return!!this.get(e)},r.hasHandle=function(e){return void 0!==this.getByHandle(e)},r.delete=function(e,t){var n,r=null!=(n=this._map1.get(e))?n:this._map2.get(e);if(void 0!==r){var i=this._map3.get(r),a=this._map4.get(r);this._call.apply(this,[this._mapDelete,void 0].concat([i,a].filter(function(e){return!(null==e||!e.alive)}))),this._map1.delete(e),this._map2.delete(e),this._map3.delete(r),this._map4.delete(r);for(var s,u=o(this._map1);!(s=u()).done;){var l=s.value;if(l[1]===r){this._map1.delete(l[0]);break}}for(var p,c=o(this._map2);!(p=c()).done;){var f=p.value;if(f[1]===r){this._map2.delete(f[0]);break}}for(var v,d=o(this._counterMap);!(v=d()).done;){var y=v.value;if(y[1]===e){this._counterMap.delete(y[0]);break}}t&&(null!=i&&i.alive&&i.dispose(),null!=a&&a.alive&&a.dispose())}},r.deleteByHandle=function(e,t){var n=this.getByHandle(e);void 0!==n&&this.delete(n,t)},r.clear=function(){this._counter=0,this._map1.clear(),this._map2.clear(),this._map3.clear(),this._map4.clear(),this._counterMap.clear(),this._mapClear.alive&&this._call(this._mapClear,void 0)},r.dispose=function(){for(var e,t=o(this._disposables.values());!(e=t()).done;){var n=e.value;n.alive&&n.dispose()}for(var r,i=o(this._map3.values());!(r=i()).done;){var a=r.value;a.alive&&a.dispose()}for(var s,u=o(this._map4.values());!(s=u()).done;){var l=s.value;l.alive&&l.dispose()}this._disposables.clear(),this.clear()},r[e]=function(){var e=this,t=this._map1.keys();return{next:function(){for(;;){var n=t.next();if(n.done)return{value:void 0,done:!0};var r=e._map1.get(n.value);if(void 0!==r){var o=e._map3.get(r),i=e._map4.get(r);if(o){var a=e._get2(r);return{value:[n.value,o,a,i],done:!1}}}}}}},r._get2=function(e){for(var t,n=o(this._map2);!(t=n()).done;){var r=t.value;if(r[1]===e)return r[0]}},r._call=function(e,t){var n;return this.vm.unwrapResult((n=this.vm).callFunction.apply(n,[e,void 0===t?this.vm.undefined:t].concat([].slice.call(arguments,2))))},(n=[{key:"size",get:function(){return this._map1.size}}])&&function(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}(t.prototype,n),t}(Symbol.iterator);function a(e){return"function"==typeof e&&/^class\s/.test(Function.prototype.toString.call(e))}function s(e){return"function"==typeof e||"object"==typeof e&&null!==e}function u(e,t){var n=new Set;return function e(r){if(s(r)&&!n.has(r)&&!1!==(null==t?void 0:t(r,n)))if(n.add(r),Array.isArray(r))for(var i,a=o(r);!(i=a()).done;)e(i.value);else{if("object"==typeof r){var u=Object.getPrototypeOf(r);u&&u!==Object.prototype&&e(u)}for(var l=0,p=Object.values(Object.getOwnPropertyDescriptors(r));l<p.length;l++){var c=p[l];"value"in c&&e(c.value),"get"in c&&e(c.get),"set"in c&&e(c.set)}}}(e),n}function l(e,t){return u(e,t?function(e,n){return n.size<t}:void 0).size}function p(e,t,n){var r=[].slice.call(arguments,3);return e.unwrapResult(e.evalCode(t)).consume(function(t){return void 0===n&&0===r.length?t:e.unwrapResult(e.callFunction.apply(e,[t,null!=n?n:e.undefined].concat(r)))})}function c(e,t,n){return e.dump(p(e,"Object.is",void 0,t,n))}function f(e,t){return e.dump(p(e,'a => typeof a === "object" && a !== null || typeof a === "function"',void 0,t))}function v(e,t){var n=JSON.stringify(t);return n?p(e,"JSON.parse",void 0,e.newString(n)):e.undefined}function d(e,t){try{return t(e)}finally{for(var n,r=o(e);!(n=r()).done;){var i=n.value;i.alive&&i.dispose()}}}function y(e,t,n,r){var o=e.newObject(),i=function(t,n){var i=r(t),a=void 0===n.value?void 0:r(n.value),s=void 0===n.get?void 0:r(n.get),u=void 0===n.set?void 0:r(n.set);e.newObject().consume(function(t){Object.entries(n).forEach(function(n){var r=n[0],o="value"===r?a:"get"===r?s:"set"===r?u:n[1]?e.true:e.false;o&&e.setProp(t,r,o)}),e.setProp(o,i,t)})},a=Object.getOwnPropertyDescriptors(t);Object.entries(a).forEach(function(e){return i(e[0],e[1])}),Object.getOwnPropertySymbols(a).forEach(function(e){return i(e,a[e])}),p(e,"Object.defineProperties",void 0,n,o).dispose(),o.dispose()}function h(e,t){var r,o,i,u=t.vm,l=t.unmarshal,c=t.isMarshalable,f=t.find,v=t.pre,d=function(e,t){switch(typeof t){case"undefined":return e.undefined;case"number":return e.newNumber(t);case"string":return e.newString(t);case"boolean":return t?e.true:e.false;case"object":return null===t?e.null:void 0}}(u,e);if(d)return d;var m=f(e);if(m)return m;if(!1===(null==c?void 0:c(e)))return u.undefined;var _=function(e){return h(e,t)},b=null!=(r=null!=(o=null!=(i=function(e,t,n){var r;if("symbol"==typeof t){var o=p(e,"d => Symbol(d)",void 0,t.description?e.newString(t.description):e.undefined);return null!=(r=n(t,o))?r:o}}(u,e,v))?i:function(e,t,r,o,i,u){var l;if("function"==typeof t){var c=e.newFunction(t.name,function(){var i=this,l=o(this),p=[].slice.call(arguments).map(function(e){return o(e)});if(a(t)&&s(l)){var c=n(t,p);return Object.entries(c).forEach(function(t){e.setProp(i,t[0],r(t[1]))}),this}return r(u?u(t,l,p):t.apply(l,p))}).consume(function(t){return p(e,"Cls => {\n          const fn = function(...args) { return Cls.apply(this, args); };\n          fn.name = Cls.name;\n          fn.length = Cls.length;\n          return fn;\n        }",void 0,t)}),f=null!=(l=i(t,c))?l:c;return y(e,t,c,r),f}}(u,e,_,l,v,t.preApply))?o:function(e,t,n,r){var o;if("object"==typeof t&&null!==t){var i=Array.isArray(t)?e.newArray():e.newObject(),a=null!=(o=r(t,i))?o:i,s=Object.getPrototypeOf(t),u=s&&s!==Object.prototype&&s!==Array.prototype?n(s):void 0;return u&&p(e,"Object.setPrototypeOf",void 0,a,u).dispose(),y(e,t,i,n),a}}(u,e,_,v))?r:u.undefined;return b}function m(e,t,n,r){e.newFunction("",function(t,o){var i=r(t)[0];if("string"==typeof i||"number"==typeof i||"symbol"==typeof i){var a=[["value",!0],["get",!0],["set",!0],["configurable",!1],["enumerable",!1],["writable",!1]].reduce(function(t,n){var i=n[0],a=n[1],s=e.getProp(o,i),u=e.typeof(s);if("undefined"===u)return t;if(!a&&"boolean"===u)return t[i]=e.dump(e.getProp(o,i)),t;var l=r(s),p=l[0];return l[1]&&s.dispose(),t[i]=p,t},{});Object.defineProperty(n,i,a)}}).consume(function(n){p(e,"(o, fn) => {\n        const descs = Object.getOwnPropertyDescriptors(o);\n        Object.entries(descs).forEach(([k, v]) => fn(k, v));\n        Object.getOwnPropertySymbols(descs).forEach(k => fn(k, descs[k]));\n      }",void 0,t,n).dispose()})}function _(e,t){return b(e,t)[0]}function b(e,t){var n,r,o=t.vm,i=t.marshal,a=t.find,s=t.pre,u=function(e,t){var n=e.typeof(t);return"undefined"===n||"number"===n||"string"===n||"boolean"===n?[e.dump(t),!0]:"object"===n&&e.unwrapResult(e.evalCode("a => a === null")).consume(function(n){return e.dump(e.unwrapResult(e.callFunction(n,e.undefined,t)))})?[null,!0]:[void 0,!1]}(o,e);if(u[1])return[u[0],!1];var l=a(e);if(l)return[l,!0];var c=function(e){return b(e,t)},f=null!=(n=null!=(r=function(e,t,n){var r;if("symbol"===e.typeof(t)){var o=e.getString(e.getProp(t,"description")),i=Symbol(o);return null!=(r=n(i,t))?r:i}}(o,e,s))?r:function(e,t,n,r,o){var i;if("function"===e.typeof(t)){var a=function o(){var i=n(this),a=[].slice.call(arguments).map(function(e){return n(e)});if(this instanceof o?this.constructor:void 0){var s=r(p.apply(void 0,[e,"(Cls, ...args) => new Cls(...args)",i,t].concat(a)));return Object.defineProperties(this,Object.getOwnPropertyDescriptors(s[0])),this}var u=e.unwrapResult(e.callFunction.apply(e,[t,i].concat(a))),l=r(u),c=l[0];return l[1]&&u.dispose(),c},s=null!=(i=o(a,t))?i:a;return m(e,t,a,r),s}}(o,e,i,c,s))?n:function(e,t,n,r){var o;if("object"===e.typeof(t)&&!e.unwrapResult(e.evalCode("o => o === null")).consume(function(n){return e.dump(e.unwrapResult(e.callFunction(n,e.undefined,t)))})){var i=p(e,"Array.isArray",void 0,t).consume(function(t){return e.dump(t)})?[]:{},a=null!=(o=r(i,t))?o:i,s=p(e,"o => {\n      const p = Object.getPrototypeOf(o);\n      return !p || p === Object.prototype || p === Array.prototype ? undefined : p;\n    }",void 0,t).consume(function(t){if("undefined"!==e.typeof(t))return n(t)[0]});return"object"==typeof s&&Object.setPrototypeOf(a,s),m(e,t,i,n),a}}(o,e,c,s);return[f,!1]}function g(e,t){var n;return s(e)&&null!=(n=e[t])?n:e}function w(e,t,n){return j(e,t,n)?[e.getProp(t,n),!0]:[t,!1]}function j(e,t,n){return!!e.dump(p(e,'(a, s) => (typeof a === "object" && a !== null || typeof a === "function") && !!a[s]',void 0,t,n))}var O=[[Symbol,"Symbol"],[Symbol.prototype,"Symbol.prototype"],[Object,"Object"],[Object.prototype,"Object.prototype"],[Function,"Function"],[Function.prototype,"Function.prototype"],[Boolean,"Boolean"],[Boolean.prototype,"Boolean.prototype"],[Array,"Array"],[Array.prototype,"Array.prototype"],[Error,"Error"],[Error.prototype,"Error.prototype"],[EvalError,"EvalError"],[EvalError.prototype,"EvalError.prototype"],[RangeError,"RangeError"],[RangeError.prototype,"RangeError.prototype"],[ReferenceError,"ReferenceError"],[ReferenceError.prototype,"ReferenceError.prototype"],[SyntaxError,"SyntaxError"],[SyntaxError.prototype,"SyntaxError.prototype"],[TypeError,"TypeError"],[TypeError.prototype,"TypeError.prototype"],[URIError,"URIError"],[URIError.prototype,"URIError.prototype"]].concat(Object.getOwnPropertyNames(Symbol).filter(function(e){return"symbol"==typeof Symbol[e]}).map(function(e){return[Symbol[e],"Symbol."+e]})),S=function(){function e(e,t){var n;this.vm=void 0,this._map=void 0,this._registeredMap=void 0,this._registeredMapDispose=new Set,this._sync=new Set,this._temporalSync=new Set,this._symbol=Symbol(),this._symbolHandle=void 0,this._options=void 0,this.vm=e,this._options=t,this._symbolHandle=e.unwrapResult(e.evalCode("Symbol()")),this._map=new i(e),this._registeredMap=new i(e),this.registerAll(null!=(n=null==t?void 0:t.registeredObjects)?n:O)}var t=e.prototype;return t.dispose=function(){this._map.dispose(),this._registeredMap.dispose(),this._symbolHandle.dispose()},t.evalCode=function(e){var t=this.vm.evalCode(e);return this._unwrapResultAndUnmarshal(t)},t.executePendingJobs=function(e){var t=this,n=this.vm.executePendingJobs(e);if("value"in n)return n.value;throw n.error.consume(function(e){return t._unmarshal(e)})},t.expose=function(e){for(var t=0,n=Object.entries(e);t<n.length;t++){var r=n[t],o=r[0],i=this._marshal(r[1]);this.vm.setProp(this.vm.global,o,i)}},t.sync=function(e){var t=this,n=this._wrap(e);return void 0===n?e:(u(n,function(e){t._sync.add(t._unwrap(e))}),n)},t.register=function(e,t){if(!this._registeredMap.has(e)){var n="string"==typeof t?this._unwrapResult(this.vm.evalCode(t)):t;c(this.vm,n,this.vm.undefined)||("string"==typeof t&&this._registeredMapDispose.add(e),this._registeredMap.set(e,n))}},t.registerAll=function(e){for(var t,n=o(e);!(t=n()).done;){var r=t.value;this.register(r[0],r[1])}},t.unregister=function(e,t){this._registeredMap.delete(e,this._registeredMapDispose.has(e)||t),this._registeredMapDispose.delete(e)},t.unregisterAll=function(e,t){for(var n,r=o(e);!(n=r()).done;)this.unregister(n.value,t)},t.startSync=function(e){s(e)&&this._sync.add(this._unwrap(e))},t.endSync=function(e){this._sync.delete(this._unwrap(e))},t._unwrapResult=function(e){var t=this;if("value"in e)return e.value;throw e.error.consume(function(e){return t._unmarshal(e)})},t._unwrapResultAndUnmarshal=function(e){var t=this;if(e)return this._unwrapResult(e).consume(function(e){return t._unmarshal(e)})},t._marshal=function(e){var t,n=this,r=this._registeredMap.get(e);if(r)return r;var o=h(null!=(t=this._wrap(e))?t:e,{vm:this.vm,unmarshal:function(e){return n._unmarshal(e)},isMarshalable:function(e){var t,r;return null==(t=null==(r=n._options)||null==r.isMarshalable?void 0:r.isMarshalable(n._unwrap(e)))||t},find:function(e){var t;return null!=(t=n._registeredMap.get(e))?t:n._map.get(e)},pre:function(e,t){var r;return null==(r=n._register(e,t,n._map))?void 0:r[1]},preApply:function(e,t,r){var o=s(t)?n._unwrap(t):void 0;o&&n._temporalSync.add(o);try{return e.apply(t,r)}finally{o&&n._temporalSync.delete(o)}}});return o},t._unmarshal=function(e){var t=this,n=this._registeredMap.getByHandle(e);if(void 0!==n)return n;var r=this._wrapHandle(e)[0];return _(null!=r?r:e,{vm:this.vm,marshal:function(e){return t._marshal(e)},find:function(e){var n;return null!=(n=t._registeredMap.getByHandle(e))?n:t._map.getByHandle(e)},pre:function(e,n){var r;return null==(r=t._register(e,n,void 0,!0))?void 0:r[0]}})},t._register=function(e,t,n,r){if(void 0===n&&(n=this._map),!this._registeredMap.has(e)&&!this._registeredMap.hasHandle(t)){var o=this._wrap(e),i=this._wrapHandle(t)[0];if(o&&i){var a=this._unwrap(e),s=this._unwrapHandle(t),u=s[0],l=s[1];if(!n.set(o,i,a,u))throw l&&u.dispose(),new Error("already registered");return r&&this._sync.add(a),[o,i]}}},t._syncMode=function(e){var t=this._unwrap(e);return this._sync.has(t)||this._temporalSync.has(t)?"both":void 0},t._wrap=function(e){var t=this;return function(e,t,n,r,o,i){if(s(t)){if(u=n,s(a=t)&&a[u])return t;var a,u,l=new Proxy(t,{get:function(e,t){return t===n?e:Reflect.get(e,t)},set:function(t,a,s,u){var l,p=g(s,n),c=null!=(l=null==i?void 0:i(u))?l:"host";if("vm"===c||Reflect.set(t,a,p,u)){if("host"===c)return!0;var f=w(e,o(u),r),v=f[0];f[1]?v.consume(function(t){return e.setProp(t,o(a),o(p))}):e.setProp(v,o(a),o(p))}return!0},deleteProperty:function(t,n){var a,s=null!=(a=null==i?void 0:i(l))?a:"host",u=w(e,o(l),r),c=u[0],f=u[1];if("vm"===s||Reflect.deleteProperty(t,n)){if("host"===s)return!0;f?c.consume(function(t){return p(e,"(a, b) => delete a[b]",void 0,t,o(n))}):p(e,"(a, b) => delete a[b]",void 0,c,o(n))}return!0}});return l}}(this.vm,e,this._symbol,this._symbolHandle,function(e){return t._marshal(e)},function(e){return t._syncMode(e)})},t._unwrap=function(e){return g(e,this._symbol)},t._wrapHandle=function(e){var t=this;return function(e,t,n,r,o,i){return f(e,t)?j(e,t,r)?[t,!1]:d([e.newFunction("getSyncMode",function(t){var n=null==i?void 0:i(o(t));return"string"==typeof n?e.newString(n):e.undefined}),e.newFunction("setter",function(e,t,r){var i=o(e);if(i){var a=o(t);if("__proto__"!==a){var s=o(r);g(i,n)[a]=s}}}),e.newFunction("deleter",function(e,t){var r=o(e);if(r){var i=o(t);delete g(r,n)[i]}})],function(n){return[p.apply(void 0,[e,'(target, sym, getSyncMode, setter, deleter) => {\n          const rec =  new Proxy(target, {\n            get(obj, key, receiver) {\n              return key === sym ? obj : Reflect.get(obj, key, receiver)\n            },\n            set(obj, key, value, receiver) {\n              const v = typeof value === "object" && value !== null || typeof value === "function"\n                ? value[sym] ?? value\n                : value;\n              const sync = getSyncMode(receiver) ?? "vm";\n              if (sync === "host" || Reflect.set(obj, key, v, receiver)) {\n                if (sync !== "vm") {\n                  setter(receiver, key, v);\n                }\n              }\n              return true;\n            },\n            deleteProperty(obj, key) {\n              const sync = getSyncMode(rec) ?? "vm";\n              if (sync === "host" || Reflect.deleteProperty(obj, key)) {\n                if (sync !== "vm") {\n                  deleter(rec, key);\n                }\n              }\n              return true;\n            },\n          });\n          return rec;\n        }',void 0,t,r].concat(n)),!0]}):[void 0,!1]}(this.vm,e,this._symbol,this._symbolHandle,function(e){return t._unmarshal(e)},function(e){return t._syncMode(e)})},t._unwrapHandle=function(e){return w(this.vm,e,this._symbolHandle)},e}();export{S as Arena,i as VMMap,p as call,l as complexity,d as consumeAll,O as defaultRegisteredObjects,c as eq,a as isES2015Class,f as isHandleObject,s as isObject,h as marshal,v as send,_ as unmarshal,u as walkObject};
//# sourceMappingURL=quickjs-emscripten-sync.esm.js.map
