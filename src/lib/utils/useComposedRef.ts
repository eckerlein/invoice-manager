import { useImperativeHandle } from "react";

type MethodMap = Record<string, (...args: any[]) => any>;

export function useComposedRef<T extends MethodMap>(
  ref: React.Ref<Partial<T>>,
  methods: T
) {
  useImperativeHandle(ref, () => methods, [methods]);
}
