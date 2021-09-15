import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export default function unmarshalFunction(vm: QuickJSVm, handle: QuickJSHandle, marshal: (value: unknown) => QuickJSHandle, unmarshal: (handle: QuickJSHandle) => [unknown, boolean], preUnmarshal: <T>(target: T, handle: QuickJSHandle) => T | undefined): Function | undefined;
