import { QuickJSVm, QuickJSHandle } from "quickjs-emscripten";
import { call } from "../vmutil";
import unmarshalProperties from "./properties";

export default function unmarshalFunction(
  vm: QuickJSVm,
  handle: QuickJSHandle,
  marshal: (value: unknown) => QuickJSHandle,
  unmarshal: (handle: QuickJSHandle) => [unknown, boolean],
  preUnmarshal: <T>(target: T, handle: QuickJSHandle) => T | undefined
): Function | undefined {
  if (vm.typeof(handle) !== "function") return;

  const raw = function (this: any, ...args: any[]) {
    const thisHandle = marshal(this);
    const argHandles = args.map((a) => marshal(a));

    if (new.target) {
      const [instance] = unmarshal(
        call(
          vm,
          `(Cls, ...args) => new Cls(...args)`,
          thisHandle,
          handle,
          ...argHandles
        )
      );
      Object.defineProperties(this, Object.getOwnPropertyDescriptors(instance));
      return this;
    }

    const resultHandle = vm.unwrapResult(
      vm.callFunction(handle, thisHandle, ...argHandles)
    );
    const [result, alreadyExists] = unmarshal(resultHandle);
    if (alreadyExists) resultHandle.dispose();
    return result;
  };

  const func = preUnmarshal(raw, handle) ?? raw;
  unmarshalProperties(vm, handle, raw, unmarshal);

  return func;
}
