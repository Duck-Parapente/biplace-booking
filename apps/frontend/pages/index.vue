<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <!-- Status Filter Tags -->
      <div class="flex gap-2 mb-4 flex-wrap">
        <button
          v-for="status in availableStatuses"
          :key="status"
          @click="toggleStatus(status)"
          class="px-3 py-1.5 text-sm font-medium rounded-lg transition"
          :class="
            selectedStatuses.has(status)
              ? 'bg-secondary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          "
        >
          {{ getStatusConfig(status).label }}
        </button>
      </div>

      <div v-if="loading" class="text-gray-500">
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-lg">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto pb-20">
        <div class="rounded-lg shadow-sm">
          <!-- Reservation Wishes List -->
          <div v-if="filteredReservationWishes.length === 0" class="text-gray-500 text-sm">
            <p>Aucune demande de réservation pour le moment.</p>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="wish in filteredReservationWishes"
              :key="wish.id"
              class="border bg-gray-50 border-gray-300 rounded-lg hover:shadow-md transition relative"
            >
              <!-- Status Badge - Top Right Corner -->
              <div class="absolute top-3 right-3">
                <span
                  class="px-2 py-1 text-xs font-medium rounded shadow-sm"
                  :class="getStatusConfig(wish.status, wish.packChoices.length).classes"
                >
                  {{ getStatusConfig(wish.status, wish.packChoices.length).label }}
                </span>
              </div>

              <div class="p-4 pr-28">
                <div class="flex-1">
                  <div class="text-sm text-gray-600 space-y-1">
                    <p class="flex items-center">
                      <span class="font-bold">{{ formatDateLong(wish.startingDate) }}</span>
                      <BaseTooltip>Créée le {{ formatDate(wish.createdAt) }}</BaseTooltip>
                    </p>
                    <div class="flex flex-wrap gap-1 mt-1 items-center">
                      <span class="text-xs text-gray-500">
                        {{ 'Mes préférences:' }}
                      </span>
                      <BaseTag v-for="packId in wish.packChoices" :key="packId" variant="secondary">
                        {{ getPackLabel(packId) }}
                      </BaseTag>
                    </div>
                    <p v-if="wish.publicComment" class="italic text-gray-700">
                      "{{ wish.publicComment }}"
                    </p>
                    <!-- <p class="text-xs text-gray-500">Créée le {{ formatDate(wish.createdAt) }}</p> -->
                  </div>
                </div>
              </div>
              <div
                v-if="getStatusConfig(wish.status, wish.packChoices.length).infoText"
                class="w-full border-t border-gray-200 p-3 text-sm text-gray-700"
              >
                {{ getStatusConfig(wish.status, wish.packChoices.length).infoText }}
              </div>
              <button
                v-if="wish.isCancelable"
                @click="handleCancelWish(wish.id)"
                :disabled="cancelling"
                class="w-full bg-red-100 hover:bg-red-200 border-t border-red-200 p-3 text-sm font-medium text-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-b-lg"
              >
                <IconX class="w-4 h-4" />
                Annuler cette demande
              </button>
              <div
                v-if="wish.reservations && wish.reservations.length > 0"
                class="w-full bg-green-100 border-t border-green-500/30 p-3 text-center rounded-b-lg"
              >
                <div v-for="reservation in wish.reservations" :key="reservation.id" class="text-sm">
                  <p class="font-medium text-green-800">
                    ✓ Réservation confirmée pour le pack {{ getPackLabel(reservation.packId) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div class="max-w-4xl mx-auto">
        <button
          @click="openCreateModal"
          class="w-full bg-secondary-600 text-white hover:bg-secondary-700 transition text-sm px-4 py-3 rounded font-medium"
        >
          Créer une nouvelle demande
        </button>
      </div>
    </div>

    <CreateReservationWishModal
      v-model="addReservationWishForm"
      :show="showModal"
      :packs="packs"
      :submitting="submitting"
      :error="submitError"
      :success="submitSuccess"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </main>
</template>

<script setup lang="ts">
import { ReservationStatusDto } from 'shared';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Mes demandes',
});

const {
  reservationWishes,
  loading,
  error,
  submitting,
  submitError,
  submitSuccess,
  addReservationWishForm,
  cancelling,
  cancelReservationWish,
  getReservationWishes,
  submitReservationWish,
} = useReservationWish();

const { packs, getPacks } = usePack();

const showModal = ref(false);
const selectedStatuses = ref<Set<ReservationStatusDto>>(
  new Set([ReservationStatusDto.PENDING, ReservationStatusDto.CONFIRMED]),
);

const availableStatuses = computed(() => {
  return [...new Set(reservationWishes.value.map(({ status }) => status))];
});

const filteredReservationWishes = computed(() => {
  return reservationWishes.value
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .filter(({ status }) => selectedStatuses.value.has(status));
});

const toggleStatus = (status: ReservationStatusDto) => {
  const set = selectedStatuses.value;
  set.has(status) ? set.delete(status) : set.add(status);
};

const getPackLabel = (packId: string): string => {
  const pack = packs.value.find(({ id }) => id === packId);
  return pack ? pack.label : packId;
};

const openCreateModal = () => {
  showModal.value = true;
  submitError.value = null;
  submitSuccess.value = false;
  addReservationWishForm.value = {
    startingDate: '',
    packChoices: [],
    publicComment: undefined,
  };
};

const closeModal = () => {
  showModal.value = false;
};

const handleSubmit = async () => {
  await submitReservationWish();

  if (submitSuccess.value) {
    setTimeout(() => {
      closeModal();
    }, 1000);
  }
};

const handleCancelWish = async (wishId: string) => {
  if (confirm('Êtes-vous sûr de vouloir annuler cette demande de réservation ?')) {
    await cancelReservationWish(wishId);
  }
};

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatDateLong = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const getStatusConfig = (status: ReservationStatusDto, packChoicesLength: number = 1) => {
  const DEFAULT_CLASSES = 'bg-gray-200 text-gray-800';
  const configs: Record<
    ReservationStatusDto,
    { label: string; classes: string; infoText?: string }
  > = {
    PENDING: { label: 'En attente', classes: 'bg-yellow-200 text-yellow-800' },
    CONFIRMED: { label: 'Confirmée', classes: 'bg-green-200 text-green-800' },
    REFUSED: {
      label: 'Refusée',
      infoText:
        packChoicesLength > 1
          ? `Les packs sélectionnés ont été attribués à d'autres pilotes pour le moment.`
          : `Le pack sélectionné a été attribué à un autre pilote pour le moment.`,
      classes: 'bg-red-200 text-red-800',
    },
    CANCELLED: { label: 'Annulée', classes: DEFAULT_CLASSES },
  };
  return configs[status] || { label: status, classes: DEFAULT_CLASSES };
};

onMounted(() => {
  getReservationWishes();
  getPacks();
});
</script>
