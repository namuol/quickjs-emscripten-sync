import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export default function marshalSymbol(vm: QuickJSVm, target: unknown, preMarshal: (target: unknown, handle: QuickJSHandle) => QuickJSHandle | undefined): QuickJSHandle | undefined;
