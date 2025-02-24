import { getQuickJS, QuickJSHandle } from "quickjs-emscripten";
import unmarshalObject from "./object";

test("normal object", async () => {
  const vm = (await getQuickJS()).createVm();
  const unmarshal = jest.fn((v: QuickJSHandle): [unknown, boolean] => [
    vm.dump(v),
    false,
  ]);
  const preUnmarshal = jest.fn((a) => a);

  const handle = vm.unwrapResult(vm.evalCode(`({ a: 1, b: true })`));
  const obj = unmarshalObject(vm, handle, unmarshal, preUnmarshal);
  if (!obj) throw new Error("obj is undefined");
  expect(obj).toEqual({ a: 1, b: true });
  expect(unmarshal).toReturnTimes(4);
  expect(unmarshal).toReturnWith(["a", false]);
  expect(unmarshal).toReturnWith([1, false]);
  expect(unmarshal).toReturnWith(["b", false]);
  expect(unmarshal).toReturnWith([true, false]);
  expect(preUnmarshal).toBeCalledTimes(1);
  expect(preUnmarshal).toBeCalledWith(obj, handle);

  handle.dispose();
  vm.dispose();
});

test("properties", async () => {
  const vm = (await getQuickJS()).createVm();
  const disposables: QuickJSHandle[] = [];
  const unmarshal = jest.fn((v: QuickJSHandle): [unknown, boolean] => {
    disposables.push(v);
    return [vm.typeof(v) === "function" ? () => {} : vm.dump(v), false];
  });
  const preUnmarshal = jest.fn((a) => a);

  const handle = vm.unwrapResult(
    vm.evalCode(`{
      const obj = {};
      Object.defineProperties(obj, {
        a: { value: 1, writable: true, configurable: true, enumerable: true },
        b: { value: 2 },
        c: { get: () => {}, set: () => {} },
      });
      obj
    }`)
  );
  const obj = unmarshalObject(vm, handle, unmarshal, preUnmarshal);
  if (!obj) throw new Error("obj is undefined");
  expect(obj).toEqual({
    a: 1,
  });
  expect(Object.getOwnPropertyDescriptors(obj)).toEqual({
    a: { value: 1, writable: true, configurable: true, enumerable: true },
    b: { value: 2, writable: false, configurable: false, enumerable: false },
    c: {
      get: expect.any(Function),
      set: expect.any(Function),
      configurable: false,
      enumerable: false,
    },
  });
  expect(unmarshal).toBeCalledTimes(7); // a.value, b.value, c.get, c.set
  expect(unmarshal).toReturnWith(["a", false]);
  expect(unmarshal).toReturnWith([1, false]);
  expect(unmarshal).toReturnWith(["b", false]);
  expect(unmarshal).toReturnWith([2, false]);
  expect(unmarshal).toReturnWith(["c", false]);
  expect(unmarshal).toReturnWith([expect.any(Function), false]); // get, set
  expect(preUnmarshal).toBeCalledTimes(1);
  expect(preUnmarshal).toBeCalledWith(obj, handle);

  disposables.forEach((d) => d.dispose());
  handle.dispose();
  vm.dispose();
});

test("array", async () => {
  const vm = (await getQuickJS()).createVm();
  const unmarshal = jest.fn((v: QuickJSHandle): [unknown, boolean] => [
    vm.dump(v),
    false,
  ]);
  const preUnmarshal = jest.fn((a) => a);

  const handle = vm.unwrapResult(vm.evalCode(`[1, true, "a"]`));
  const array = unmarshalObject(vm, handle, unmarshal, preUnmarshal);
  expect((array as any)[0]).toEqual(1);
  expect(Array.isArray(array)).toBe(true);
  expect(unmarshal.mock.results[0].value).toEqual(["0", false]);
  expect(unmarshal.mock.results[1].value).toEqual([1, false]);
  expect(unmarshal.mock.results[2].value).toEqual(["1", false]);
  expect(unmarshal.mock.results[3].value).toEqual([true, false]);
  expect(unmarshal.mock.results[4].value).toEqual(["2", false]);
  expect(unmarshal.mock.results[5].value).toEqual(["a", false]);
  expect(unmarshal.mock.results[6].value).toEqual(["length", false]);
  expect(unmarshal.mock.results[7].value).toEqual([3, false]);
  expect(preUnmarshal).toBeCalledWith(array, handle);

  handle.dispose();
  vm.dispose();
});

test("prototype", async () => {
  const vm = (await getQuickJS()).createVm();
  const unmarshal = jest.fn((v: QuickJSHandle): [unknown, boolean] => [
    vm.typeof(v) === "object" ? { a: () => 1 } : vm.dump(v),
    false,
  ]);
  const preUnmarshal = jest.fn((a) => a);

  const handle = vm.unwrapResult(vm.evalCode(`Object.create({ a: () => 1 })`));
  const obj = unmarshalObject(vm, handle, unmarshal, preUnmarshal) as any;
  if (!obj) throw new Error("obj is undefined");
  expect(Object.getPrototypeOf(obj)).toEqual({ a: expect.any(Function) });
  expect(obj.a()).toBe(1);
  expect(unmarshal.mock.calls.length).toBe(1);
  expect(unmarshal).toReturnWith([Object.getPrototypeOf(obj), false]);
  expect(preUnmarshal).toBeCalledTimes(1);
  expect(preUnmarshal).toBeCalledWith(obj, handle);

  handle.dispose();
  vm.dispose();
});

test("undefined", async () => {
  const vm = (await getQuickJS()).createVm();
  const f = jest.fn();

  expect(unmarshalObject(vm, vm.undefined, f, f)).toEqual(undefined);
  expect(unmarshalObject(vm, vm.true, f, f)).toEqual(undefined);
  expect(unmarshalObject(vm, vm.false, f, f)).toEqual(undefined);
  expect(unmarshalObject(vm, vm.null, f, f)).toEqual(undefined);
  expect(unmarshalObject(vm, vm.newString("hoge"), f, f)).toEqual(undefined);
  expect(unmarshalObject(vm, vm.newNumber(-10), f, f)).toEqual(undefined);

  const func = vm.newFunction("", () => {});
  expect(unmarshalObject(vm, func, f, f)).toEqual(undefined);

  expect(f).toBeCalledTimes(0);

  func.dispose();
  vm.dispose();
});
