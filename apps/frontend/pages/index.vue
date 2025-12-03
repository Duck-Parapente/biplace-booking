<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 max-w-4xl mx-auto w-full flex flex-col min-h-0">
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
          {{ getConfigFromStatus(status).label }}
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
                  :class="getConfigFromWish(wish).classes"
                >
                  {{ getConfigFromWish(wish).label }}
                </span>
              </div>

              <div class="p-4">
                <div class="flex-1">
                  <div class="text-sm text-gray-600 space-y-1">
                    <p class="flex items-center gap-2">
                      <span class="font-bold">{{ formatDateLong(wish.startingDate) }}</span>
                    </p>
                    <div class="flex flex-wrap gap-1 mt-2 items-center">
                      <span class="text-xs text-gray-500">
                        {{ 'Mes préférences:' }}
                      </span>
                      <BaseTag
                        v-for="packId in wish.packChoices"
                        :key="packId"
                        :variant="hasReservation(wish, packId) ? 'success' : 'secondary'"
                      >
                        {{ getPackLabel(packId) }}
                      </BaseTag>
                    </div>
                    <p v-if="wish.publicComment" class="italic text-gray-700">
                      "{{ wish.publicComment }}"
                    </p>

                    <!-- Event History Toggle -->
                    <button
                      @click="toggleEventHistory(wish.id)"
                      class="text-xs text-gray-600 hover:text-gray-800 hover:underline mt-2 flex items-center gap-1"
                    >
                      <IconChevronRight
                        class="w-3 h-3 transition-transform"
                        :class="expandedWishes.has(wish.id) ? 'rotate-90' : ''"
                      />
                      {{ expandedWishes.has(wish.id) ? 'Masquer' : 'Voir' }} l'historique
                    </button>

                    <!-- Event History Details -->
                    <div
                      v-if="expandedWishes.has(wish.id)"
                      class="mt-2 p-2 bg-white rounded border border-gray-200 space-y-1"
                    >
                      <div
                        v-for="(event, index) in getEvents(wish)"
                        :key="index"
                        class="flex items-center justify-between text-xs"
                      >
                        <span
                          class="px-2 py-0.5 rounded text-xs"
                          :class="getConfigFromStatus(event.status).classes"
                        >
                          {{ getEventLabel(event) }}
                        </span>
                        <span class="text-gray-500">
                          {{ formatDateTime(event.date) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="getConfigFromWish(wish).infoText"
                class="w-full border-t border-gray-200 p-3 text-sm text-gray-700"
              >
                {{ getConfigFromWish(wish).infoText }}
              </div>
              <button
                v-if="wish.reservation?.isCancelable || wish.isCancelable"
                @click="handleCancel(wish)"
                :disabled="cancelling"
                class="w-full bg-red-100 hover:bg-red-200 border-t border-red-200 p-3 text-sm font-medium text-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-b-lg"
              >
                <IconX class="w-4 h-4" />
                {{
                  wish.reservation?.isCancelable
                    ? 'Annuler la réservation'
                    : 'Annuler cette demande'
                }}
              </button>
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
import {
  ReservationEventTypeDto,
  ReservationOrWishStatusDto,
  ReservationWishDto,
  ReservationWishEventDto,
} from 'shared';

import { formatDateLong, formatDateTime } from '~/composables/useDateHelpers';

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
const { cancelReservation } = useReservation();

const showModal = ref(false);
const expandedWishes = ref<Set<string>>(new Set());
const selectedStatuses = ref<Set<ReservationOrWishStatusDto>>(
  new Set([ReservationOrWishStatusDto.PENDING, ReservationOrWishStatusDto.CONFIRMED]),
);

const getEvents = (wish: ReservationWishDto) => {
  return [...wish.events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getCurrentStatus = (wish: ReservationWishDto) => {
  return getEvents(wish)[0]?.status ?? ReservationOrWishStatusDto.PENDING;
};

const availableStatuses = computed(() => {
  return [...new Set(reservationWishes.value.map((wish) => getCurrentStatus(wish)))];
});

const filteredReservationWishes = computed(() => {
  return reservationWishes.value
    .sort((a, b) => {
      return new Date(b.startingDate).getTime() - new Date(a.startingDate).getTime();
    })
    .filter((wish) => selectedStatuses.value.has(getCurrentStatus(wish)));
});

const toggleStatus = (status: ReservationOrWishStatusDto) => {
  const set = selectedStatuses.value;
  set.has(status) ? set.delete(status) : set.add(status);
};

const toggleEventHistory = (wishId: string) => {
  const set = expandedWishes.value;
  set.has(wishId) ? set.delete(wishId) : set.add(wishId);
};

const getPackLabel = (packId: string): string => {
  const pack = packs.value.find(({ id }) => id === packId);
  return pack ? pack.label : packId;
};

const hasReservation = (wish: ReservationWishDto, packId: string): boolean => {
  return (
    wish.reservation?.packId === packId &&
    getCurrentStatus(wish) === ReservationOrWishStatusDto.CONFIRMED
  );
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

const handleCancel = async (wish: ReservationWishDto) => {
  // If the wish has a cancelable reservation, cancel the reservation instead
  if (wish.reservation?.isCancelable) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        await cancelReservation(wish.reservation.id);
        await getReservationWishes();
      } catch (error) {
        console.error('Error canceling reservation:', error);
      }
    }
  } else if (wish.isCancelable) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette demande de réservation ?')) {
      await cancelReservationWish(wish.id);
    }
  }
};

const STATUS_CONFIG: Record<
  ReservationOrWishStatusDto,
  { label: string; classes: string; infoText?: string }
> = {
  [ReservationOrWishStatusDto.PENDING]: {
    label: 'En attente',
    classes: 'bg-yellow-200 text-yellow-800',
  },
  [ReservationOrWishStatusDto.CONFIRMED]: {
    label: 'Confirmée',
    classes: 'bg-green-200 text-green-800',
  },
  [ReservationOrWishStatusDto.REFUSED]: {
    label: 'Refusée',
    classes: 'bg-red-200 text-red-800',
    infoText: "Les packs sélectionnés ont été attribués à d'autres pilotes pour le moment.",
  },
  [ReservationOrWishStatusDto.CANCELLED]: {
    label: 'Annulée',
    classes: 'bg-gray-200 text-gray-800',
  },
};

const getEventLabel = (event: ReservationWishEventDto): string => {
  return [
    event.type === ReservationEventTypeDto.WISH ? 'Demande' : 'Réservation',
    getConfigFromStatus(event.status).label.toLowerCase(),
  ].join(' ');
};

const getConfigFromStatus = (status: ReservationOrWishStatusDto) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG[ReservationOrWishStatusDto.CANCELLED];
};

const getConfigFromWish = (wish: ReservationWishDto) => {
  const currentStatus = getCurrentStatus(wish);
  return (
    STATUS_CONFIG[currentStatus] || {
      label: currentStatus,
      classes: STATUS_CONFIG[ReservationOrWishStatusDto.CANCELLED].classes,
    }
  );
};

onMounted(() => {
  getReservationWishes();
  getPacks();
});
</script>
