import type { CreatePackDto, PackDto, UpdatePackDto } from 'shared';

export const usePack = () => {
  const { callApi } = useApi();

  const packs = ref<PackDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const showCreateModal = ref(false);
  const showEditModal = ref(false);
  const creating = ref(false);
  const editing = ref(false);
  const createError = ref<string | null>(null);
  const editError = ref<string | null>(null);
  const createSuccess = ref(false);
  const editSuccess = ref(false);
  const editingPackId = ref<string | null>(null);

  const packForm = ref<CreatePackDto>({
    label: '',
    ownerId: '',
    flightsHours: undefined,
    flightsCount: undefined,
  });

  const editPackForm = ref<UpdatePackDto>({
    label: '',
    ownerId: '',
    flightsHours: undefined,
    flightsCount: undefined,
  });

  const openCreatePackModal = () => {
    showCreateModal.value = true;
    createError.value = null;
    createSuccess.value = false;
    // Reset form
    packForm.value = {
      label: '',
      ownerId: '',
      flightsHours: undefined,
      flightsCount: undefined,
    };
  };

  const closeCreatePackModal = () => {
    showCreateModal.value = false;
  };

  const openEditPackModal = (pack: PackDto) => {
    editingPackId.value = pack.id;
    editPackForm.value = {
      label: pack.label,
      ownerId: pack.ownerId,
      flightsHours: pack.flightsHours,
      flightsCount: pack.flightsCount,
    };
    showEditModal.value = true;
    editError.value = null;
    editSuccess.value = false;
  };

  const closeEditPackModal = () => {
    showEditModal.value = false;
    editingPackId.value = null;
  };

  const getPacks = async (): Promise<PackDto[]> => {
    try {
      loading.value = true;
      error.value = null;
      const fetchedPacks = await callApi<PackDto[]>('/packs');
      packs.value = fetchedPacks;
      return fetchedPacks;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Impossible de charger la liste des packs';
      error.value = errorMessage;
      console.error('Failed to fetch packs:', err);
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const createPack = async () => {
    try {
      creating.value = true;
      createError.value = null;
      createSuccess.value = false;

      // Prepare the payload - only include optional fields if they have values
      const payload: CreatePackDto = {
        label: packForm.value.label,
        ownerId: packForm.value.ownerId,
        flightsHours: packForm.value.flightsHours,
        flightsCount: packForm.value.flightsCount,
      };

      await callApi('/pack/create', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      createSuccess.value = true;

      // Reload packs after creation
      await getPacks();

      // Close modal after a short delay
      setTimeout(() => {
        closeCreatePackModal();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Impossible de créer le pack';
      createError.value = errorMessage;
      console.error('Failed to create pack:', err);
    } finally {
      creating.value = false;
    }
  };

  const updatePack = async () => {
    if (!editingPackId.value) return;

    try {
      editing.value = true;
      editError.value = null;
      editSuccess.value = false;

      // Prepare the payload - only include fields that have values
      const payload: UpdatePackDto = {
        label: editPackForm.value.label,
        ownerId: editPackForm.value.ownerId,
        flightsHours: editPackForm.value.flightsHours,
        flightsCount: editPackForm.value.flightsCount,
      };

      await callApi(`/pack/${editingPackId.value}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      editSuccess.value = true;

      // Reload packs after update
      await getPacks();

      // Close modal after a short delay
      setTimeout(() => {
        closeEditPackModal();
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Impossible de modifier le pack';
      editError.value = errorMessage;
      console.error('Failed to update pack:', err);
    } finally {
      editing.value = false;
    }
  };

  const initializePacks = async () => {
    await getPacks();
  };

  return {
    packs,
    loading,
    error,
    showCreateModal,
    showEditModal,
    creating,
    editing,
    createError,
    editError,
    createSuccess,
    editSuccess,
    packForm,
    editPackForm,
    getPacks,
    openCreatePackModal,
    closeCreatePackModal,
    openEditPackModal,
    closeEditPackModal,
    createPack,
    updatePack,
    initializePacks,
  };
};
