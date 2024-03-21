import { useEffect, useState } from "react";

/**
 * Custom hook for accessing Zustand store state and subscribing to updates. (After Rendering - SSR Behavior)
 * @template T - The type of the store state.
 * @template F - The return type of the callback function.
 * @param {function} store - The store function provided by Zustand.
 * @param {function} callback - The callback function to extract desired state from the store.
 * @returns {F | undefined} The extracted state from the store, or undefined if not available.
 */
const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useStore;
