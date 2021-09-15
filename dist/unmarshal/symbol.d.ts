import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export default function unmarshalSymbol(vm: QuickJSVm, handle: QuickJSHandle, preUnmarshal: <T>(target: T, handle: QuickJSHandle) => T | undefined): symbol | undefined;
