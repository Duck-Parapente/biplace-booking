import type { EquipmentDto, EquipmentNoteDto } from 'shared';

const BASE_PATH = '/equipments';

export const useEquipment = () => {
  const { callApi } = useApi();

  const equipments = useState<EquipmentDto[]>('equipments', () => []);
  const loading = useState<boolean>('equipmentsLoading', () => false);
  const error = useState<string | null>('equipmentsError', () => null);

  const getEquipments = async (): Promise<EquipmentDto[]> => {
    try {
      loading.value = true;
      error.value = null;
      const fetched = await callApi<EquipmentDto[]>(BASE_PATH);
      equipments.value = fetched;
      return fetched;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Impossible de charger les équipements';
      error.value = errorMessage;
      console.error('Failed to fetch equipments:', err);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const setHolder = async (equipmentId: string, holderId: string | null): Promise<void> => {
    await callApi(`${BASE_PATH}/${equipmentId}/holder`, {
      method: 'PATCH',
      body: JSON.stringify({ holderId }),
    });
  };

  const getEquipmentNotes = async (equipmentId: string): Promise<EquipmentNoteDto[]> => {
    return callApi<EquipmentNoteDto[]>(`${BASE_PATH}/${equipmentId}/notes`);
  };

  const createEquipmentNote = async (equipmentId: string, content: string): Promise<void> => {
    await callApi(`${BASE_PATH}/${equipmentId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  };

  const updateEquipmentNote = async (
    equipmentId: string,
    noteId: string,
    content: string,
  ): Promise<void> => {
    await callApi(`${BASE_PATH}/${equipmentId}/notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  };

  return {
    equipments,
    loading,
    error,
    getEquipments,
    setHolder,
    getEquipmentNotes,
    createEquipmentNote,
    updateEquipmentNote,
  };
};
