export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  const storedValue = useState<T>(key, () => {
    // Load from localStorage on client-side only
    if (process.client) {
      try {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
          return JSON.parse(stored) as T;
        }
      } catch (error) {
        console.error(`Failed to load ${key} from localStorage:`, error);
      }
    }
    return defaultValue;
  });

  const saveToLocalStorage = (value: T) => {
    if (process.client) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error);
      }
    }
  };

  const setValue = (value: T) => {
    storedValue.value = value;
    saveToLocalStorage(value);
  };

  const clearValue = () => {
    storedValue.value = defaultValue;
    if (process.client) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove ${key} from localStorage:`, error);
      }
    }
  };

  // Watch for changes and save automatically
  watch(
    storedValue,
    (newValue) => {
      saveToLocalStorage(newValue);
    },
    { deep: true },
  );

  return {
    value: storedValue,
    setValue,
    clearValue,
  };
};
