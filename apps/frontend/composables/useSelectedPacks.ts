const STORAGE_KEY = 'selectedPacks';

export const useSelectedPacks = () => {
  // Use generic localStorage composable for storing array of pack IDs
  const { value: packIdsArray, setValue: setPackIds } = useLocalStorage<string[]>(STORAGE_KEY, []);

  // Convert to Set for easier manipulation
  const selectedPacks = computed<Set<string>>({
    get: () => new Set(packIdsArray.value),
    set: (newSet) => {
      setPackIds(Array.from(newSet));
    },
  });

  const togglePack = (packId: string) => {
    const currentSet = new Set(packIdsArray.value);
    if (currentSet.has(packId)) {
      currentSet.delete(packId);
    } else {
      currentSet.add(packId);
    }
    setPackIds(Array.from(currentSet));
  };

  const setSelectedPacks = (packIds: string[]) => {
    setPackIds(packIds);
  };

  const clearSelectedPacks = () => {
    setPackIds([]);
  };

  return {
    selectedPacks,
    togglePack,
    setSelectedPacks,
    clearSelectedPacks,
  };
};
