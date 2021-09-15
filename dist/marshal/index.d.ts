import { QuickJSHandle, QuickJSVm } from "quickjs-emscripten";
export declare type Options = {
    vm: QuickJSVm;
    unmarshal: (handle: QuickJSHandle) => unknown;
    isMarshalable?: (target: unknown) => boolean;
    find: (target: unknown) => QuickJSHandle | undefined;
    pre: (target: unknown, handle: QuickJSHandle) => QuickJSHandle | undefined;
    preApply?: (target: Function, thisArg: unknown, args: unknown[]) => any;
};
export declare function marshal(target: unknown, options: Options): QuickJSHandle;
export default marshal;
