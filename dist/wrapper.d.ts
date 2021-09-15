import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export declare type SyncMode = "both" | "vm" | "host";
export declare type Wrapped<T> = T & {
    __qes_wrapped: never;
};
export declare function wrap<T = any>(vm: QuickJSVm, target: T, proxyKeySymbol: symbol, proxyKeySymbolHandle: QuickJSHandle, marshal: (target: any) => QuickJSHandle, syncMode?: (target: T) => SyncMode | undefined): Wrapped<T> | undefined;
export declare function wrapHandle(vm: QuickJSVm, handle: QuickJSHandle, proxyKeySymbol: symbol, proxyKeySymbolHandle: QuickJSHandle, unmarshal: (handle: QuickJSHandle) => any, syncMode?: (target: QuickJSHandle) => SyncMode | undefined): [Wrapped<QuickJSHandle> | undefined, boolean];
export declare function unwrap<T>(obj: T, key: string | symbol): T;
export declare function unwrapHandle(vm: QuickJSVm, handle: QuickJSHandle, key: QuickJSHandle): [QuickJSHandle, boolean];
export declare function isWrapped<T>(obj: T, key: string | symbol): obj is Wrapped<T>;
export declare function isHandleWrapped(vm: QuickJSVm, handle: QuickJSHandle, key: QuickJSHandle): handle is Wrapped<QuickJSHandle>;
