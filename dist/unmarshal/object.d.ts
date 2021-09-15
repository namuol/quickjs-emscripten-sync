import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export default function unmarshalObject(vm: QuickJSVm, handle: QuickJSHandle, unmarshal: (handle: QuickJSHandle) => [unknown, boolean], preUnmarshal: <T>(target: T, handle: QuickJSHandle) => T | undefined): object | undefined;
