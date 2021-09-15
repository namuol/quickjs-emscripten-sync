import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export default class VMMap {
    vm: QuickJSVm;
    _map1: Map<any, number>;
    _map2: Map<any, number>;
    _map3: Map<number, QuickJSHandle>;
    _map4: Map<number, QuickJSHandle>;
    _counterMap: Map<number, any>;
    _disposables: Set<QuickJSHandle>;
    _mapGet: QuickJSHandle;
    _mapSet: QuickJSHandle;
    _mapDelete: QuickJSHandle;
    _mapClear: QuickJSHandle;
    _counter: number;
    constructor(vm: QuickJSVm);
    set(key: any, handle: QuickJSHandle, key2?: any, handle2?: QuickJSHandle): boolean;
    merge(iteratable: Iterable<[any, QuickJSHandle | undefined] | [any, QuickJSHandle | undefined, any, QuickJSHandle | undefined]> | undefined): void;
    get(key: any): QuickJSHandle | undefined;
    getByHandle(handle: QuickJSHandle): any;
    has(key: any): boolean;
    hasHandle(handle: QuickJSHandle): boolean;
    delete(key: any, dispose?: boolean): void;
    deleteByHandle(handle: QuickJSHandle, dispose?: boolean): void;
    clear(): void;
    dispose(): void;
    get size(): number;
    [Symbol.iterator](): Iterator<[
        any,
        QuickJSHandle,
        any,
        QuickJSHandle | undefined
    ]>;
    _get2(num: number): any;
    _call(fn: QuickJSHandle, thisArg: QuickJSHandle | undefined, ...args: QuickJSHandle[]): QuickJSHandle;
}
