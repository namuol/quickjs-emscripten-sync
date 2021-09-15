import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export default function marshalObject(vm: QuickJSVm, target: unknown, marshal: (target: unknown) => QuickJSHandle, preMarshal: (target: unknown, handle: QuickJSHandle) => QuickJSHandle | undefined): QuickJSHandle | undefined;
