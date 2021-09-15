import { QuickJSHandle, QuickJSVm } from "quickjs-emscripten";
import { SuccessOrFail, VmCallResult } from "quickjs-emscripten/dist/vm-interface";
import VMMap from "./vmmap";
import marshal from "./marshal";
import unmarshal from "./unmarshal";
import { Wrapped } from "./wrapper";
import { complexity, isES2015Class, isObject, walkObject } from "./util";
import { call, eq, isHandleObject, send, consumeAll } from "./vmutil";
import { defaultRegisteredObjects } from "./default";
export { VMMap, defaultRegisteredObjects, marshal, unmarshal, complexity, isES2015Class, isObject, walkObject, call, eq, isHandleObject, send, consumeAll, };
export declare type Options = {
    /** A callback that returns a boolean value that determines whether an object is marshalled or not. If false, no marshaling will be done and undefined will be passed to the QuickJS VM, otherwise marshaling will be done. By default, all objects will be marshalled. */
    isMarshalable?: (target: any) => boolean;
    /** You can pre-register a pair of objects that will be considered the same between the host and the QuickJS VM. This will be used automatically during the conversion. By default, it will be registered automatically with `defaultRegisteredObjects`.
     *
     * Instead of a string, you can also pass a QuickJSHandle directly. In that case, however, you have to dispose of them manually when destroying the VM.
     */
    registeredObjects?: Iterable<[any, QuickJSHandle | string]>;
};
/**
 * The Arena class manages all generated handles at once by quickjs-emscripten and automatically converts objects between the host and the QuickJS VM.
 */
export declare class Arena {
    vm: QuickJSVm;
    _map: VMMap;
    _registeredMap: VMMap;
    _registeredMapDispose: Set<any>;
    _sync: Set<any>;
    _temporalSync: Set<any>;
    _symbol: symbol;
    _symbolHandle: QuickJSHandle;
    _options?: Options;
    /** Constructs a new Arena instance. It requires a quickjs-emscripten VM initialized with `quickjs.createVM()`. */
    constructor(vm: QuickJSVm, options?: Options);
    /**
     * Dispose of the arena and managed handles. This method won't dispose the VM itself, so the VM has to be disposed of manually.
     */
    dispose(): void;
    /**
     * Evaluate JS code in the VM and get the result as an object on the host side. It also converts and re-throws error objects when an error is thrown during evaluation.
     */
    evalCode<T = any>(code: string): T;
    /**
     * Almost same as `vm.executePendingJobs()`, but it converts and re-throws error objects when an error is thrown during evaluation.
     */
    executePendingJobs(maxJobsToExecute?: number): number;
    /**
     * Expose objects as global objects in the VM.
     *
     * By default, exposed objects are not synchronized between the host and the VM.
     * If you want to sync an objects, first wrap the object with sync method, and then expose the wrapped object.
     */
    expose(obj: {
        [k: string]: any;
    }): void;
    /**
     * Enables sync for the object between the host and the VM and returns objects wrapped with proxies.
     *
     * The return value is necessary in order to reflect changes to the object from the host to the VM. Please note that setting a value in the field or deleting a field in the original object will not synchronize it.
     */
    sync<T>(target: T): T;
    /**
     * Register a pair of objects that will be considered the same between the host and the QuickJS VM.
     *
     * Instead of a string, you can also pass a QuickJSHandle directly. In that case, however, when  you have to dispose them manually when destroying the VM.
     */
    register(target: any, handleOrCode: QuickJSHandle | string): void;
    /**
     * Execute `register` methods for each pair.
     */
    registerAll(map: Iterable<[any, QuickJSHandle | string]>): void;
    /**
     * Unregister a pair of objects that were registered with `registeredObjects` option and `register` method.
     */
    unregister(target: any, dispose?: boolean): void;
    /**
     * Execute `unregister` methods for each target.
     */
    unregisterAll(targets: Iterable<any>, dispose?: boolean): void;
    startSync(target: any): void;
    endSync(target: any): void;
    _unwrapResult<T>(result: SuccessOrFail<T, QuickJSHandle>): T;
    _unwrapResultAndUnmarshal(result: VmCallResult<QuickJSHandle> | undefined): any;
    _marshal(target: any): QuickJSHandle;
    _unmarshal(handle: QuickJSHandle): any;
    _register(t: any, h: QuickJSHandle, map?: VMMap, sync?: boolean): [Wrapped<any>, Wrapped<QuickJSHandle>] | undefined;
    _syncMode(obj: any): "both" | undefined;
    _wrap<T>(target: T): Wrapped<T> | undefined;
    _unwrap<T>(target: T): T;
    _wrapHandle(handle: QuickJSHandle): [Wrapped<QuickJSHandle> | undefined, boolean];
    _unwrapHandle(target: QuickJSHandle): [QuickJSHandle, boolean];
}
