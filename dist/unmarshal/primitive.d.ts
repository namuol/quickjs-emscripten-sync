import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export default function unmarshalPrimitive(vm: QuickJSVm, handle: QuickJSHandle): [any, boolean];
