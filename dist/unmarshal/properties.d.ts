import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
export default function unmarshalProperties(vm: QuickJSVm, handle: QuickJSHandle, target: object | Function, unmarshal: (handle: QuickJSHandle) => [unknown, boolean]): void;
