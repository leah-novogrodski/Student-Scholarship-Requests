import { useState, useEffect } from "react";

export const getSessionStorageValue = (key) => {
  const item = sessionStorage.getItem(key);
  return JSON.parse(item);
};

function useSessionStorage(key, initialValue) {
  const readValue = () => {
    return getSessionStorageValue(key) || initialValue;
  };

  const [storedValue, setStoredValue] = useState(readValue);

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    if (typeof window !== "undefined") {
      if (typeof valueToStore === "undefined") {
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    }
  };

  const remove = () => {
    sessionStorage.removeItem(key);
    setStoredValue(undefined);
  };

  return [storedValue, setValue, remove];
}

export default useSessionStorage;
