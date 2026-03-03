const STORAGE_KEY = 'selectedPacks';

export const useSelectedPacks = () => {
  const selectedPacks = useState<Set<string>>('selectedPacks', () => {
    // Load from localStorage on client-side only
    if (process.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const packIds = JSON.parse(stored) as string[];
          return new Set(packIds);
        }
      } catch (error) {
        console.error('Failed to load selected packs from localStorage:', error);
      }
    }
    return new Set<string>();
  });

  const saveToLocalStorage = () => {
    if (process.client) {
      try {
        const packIds = Array.from(selectedPacks.value);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(packIds));
      } catch (error) {
        console.error('Failed to save selected packs to localStorage:', error);
      }
    }
  };

  const togglePack = (packId: string) => {
    const set = selectedPacks.value;
    if (set.has(packId)) {
      set.delete(packId);
    } else {
      set.add(packId);
    }
    saveToLocalStorage();
  };

  const setSelectedPacks = (packIds: string[]) => {
    selectedPacks.value = new Set(packIds);
    saveToLocalStorage();
  };

  const clearSelectedPacks = () => {
    selectedPacks.value.clear();
    saveToLocalStorage();
  };

  return {
    selectedPacks,
    togglePack,
    setSelectedPacks,
    clearSelectedPacks,
  };
};
