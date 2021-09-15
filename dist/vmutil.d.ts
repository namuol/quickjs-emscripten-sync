import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export declare function call(vm: QuickJSVm, code: string, thisArg?: QuickJSHandle, ...args: QuickJSHandle[]): QuickJSHandle;
export declare function eq(vm: QuickJSVm, a: QuickJSHandle, b: QuickJSHandle): boolean;
export declare function instanceOf(vm: QuickJSVm, a: QuickJSHandle, b: QuickJSHandle): boolean;
export declare function isHandleObject(vm: QuickJSVm, a: QuickJSHandle): boolean;
export declare function send(vm: QuickJSVm, target: any): QuickJSHandle;
export declare function consumeAll<T extends QuickJSHandle[], K>(handles: T, cb: (handles: T) => K): K;
