import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export default function marshalProperties(vm: QuickJSVm, target: object | Function, handle: QuickJSHandle, marshal: (target: unknown) => QuickJSHandle): void;
