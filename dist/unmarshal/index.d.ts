import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export declare type Options = {
    vm: QuickJSVm;
    marshal: (target: unknown) => QuickJSHandle;
    find: (handle: QuickJSHandle) => unknown | undefined;
    pre: <T>(target: T, handle: QuickJSHandle) => T | undefined;
};
export declare function unmarshal(handle: QuickJSHandle, options: Options): any;
export default unmarshal;
