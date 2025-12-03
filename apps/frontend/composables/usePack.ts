import type { CreatePackDto, PackDto, UpdatePackDto } from 'shared';

const BASE_PATH = '/packs';

enum PackOperationMode {
  CREATE = 'create',
  EDIT = 'edit',
}

interface PackOperationConfig {
  endpoint: (id?: string) => string;
  method: 'POST' | 'PATCH';
  errorMessage: string;
  modalTitle: string;
  submitButton: string;
  submittingButton: string;
  successMessage: string;
}

const PACK_OPERATION_CONFIG: Record<PackOperationMode, PackOperationConfig> = {
  [PackOperationMode.CREATE]: {
    endpoint: () => BASE_PATH,
    method: 'POST',
    errorMessage: 'Impossible de créer le pack',
    successMessage: '✓ Pack créé avec succès',
    modalTitle: 'Ajouter un pack',
    submitButton: 'Créer',
    submittingButton: 'Création...',
  },
  [PackOperationMode.EDIT]: {
    endpoint: (id?: string) => `${BASE_PATH}/${id}`,
    method: 'PATCH',
    errorMessage: 'Impossible de modifier le pack',
    successMessage: '✓ Pack modifié avec succès',
    modalTitle: 'Modifier le pack',
    submitButton: 'Modifier',
    submittingButton: 'Modification...',
  },
};

export const usePack = () => {
  const { callApi } = useApi();

  const packs = useState<PackDto[]>('packs', () => []);
  const loading = useState<boolean>('packsLoading', () => false);
  const error = useState<string | null>('packsError', () => null);

  // Unified modal state
  const showModal = useState<boolean>('packShowModal', () => false);
  const modalMode = useState<PackOperationMode>('packModalMode', () => PackOperationMode.CREATE);
  const submitting = useState<boolean>('packSubmitting', () => false);
  const submitError = useState<string | null>('packSubmitError', () => null);
  const submitSuccess = useState<boolean>('packSubmitSuccess', () => false);
  const editingPackId = useState<string | null>('packEditingId', () => null);

  const packForm = useState<CreatePackDto | UpdatePackDto>('packForm', () => ({
    label: '',
    ownerId: '',
    flightsHours: undefined,
    flightsCount: undefined,
  }));

  const openCreatePackModal = () => {
    modalMode.value = PackOperationMode.CREATE;
    showModal.value = true;
    submitError.value = null;
    submitSuccess.value = false;
    editingPackId.value = null;
    // Reset form
    packForm.value = {
      label: '',
      ownerId: '',
      flightsHours: undefined,
      flightsCount: undefined,
    };
  };

  const closeModal = () => {
    showModal.value = false;
    editingPackId.value = null;
  };

  const openEditPackModal = (pack: PackDto) => {
    modalMode.value = PackOperationMode.EDIT;
    editingPackId.value = pack.id;
    packForm.value = {
      label: pack.label,
      ownerId: pack.ownerId,
      flightsHours: pack.flightsHours,
      flightsCount: pack.flightsCount,
    };
    showModal.value = true;
    submitError.value = null;
    submitSuccess.value = false;
  };

  const getPacks = async (): Promise<PackDto[]> => {
    try {
      loading.value = true;
      error.value = null;
      const fetchedPacks = await callApi<PackDto[]>(BASE_PATH);
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

  const submitPack = async () => {
    try {
      submitting.value = true;
      submitError.value = null;
      submitSuccess.value = false;

      const config = PACK_OPERATION_CONFIG[modalMode.value];

      // Validate pack ID for edit mode
      if (modalMode.value === PackOperationMode.EDIT && !editingPackId.value) {
        throw new Error('No pack ID for update');
      }

      await callApi(config.endpoint(editingPackId.value ?? undefined), {
        method: config.method,
        body: JSON.stringify(packForm.value),
      });

      submitSuccess.value = true;

      // Reload packs after creation/update
      await getPacks();

      // Keep submitting true until modal closes
      setTimeout(() => {
        closeModal();
        submitting.value = false;
      }, 1000);
    } catch (err) {
      const config = PACK_OPERATION_CONFIG[modalMode.value];
      const errorMessage = err instanceof Error ? err.message : config.errorMessage;
      submitError.value = errorMessage;
      console.error(`Failed to ${modalMode.value} pack:`, err);
      submitting.value = false;
    }
  };

  // Computed wording based on current mode
  const currentOperationConfig = computed(() => PACK_OPERATION_CONFIG[modalMode.value]);

  return {
    packs,
    loading,
    error,
    showModal,
    modalMode,
    submitting,
    submitError,
    submitSuccess,
    packForm,
    currentOperationConfig,
    getPacks,
    openCreatePackModal,
    openEditPackModal,
    closeModal,
    submitPack,
  };
};

export { PackOperationMode, type PackOperationConfig };
