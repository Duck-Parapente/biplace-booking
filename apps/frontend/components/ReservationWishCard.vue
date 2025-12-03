<template>
  <div class="border bg-gray-50 border-gray-300 rounded-lg hover:shadow-md transition relative">
    <!-- Status Badge - Top Right Corner -->
    <div class="absolute top-3 right-3">
      <span class="px-2 py-1 text-xs font-medium rounded shadow-sm" :class="statusConfig.classes">
        {{ statusConfig.label }}
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
              :variant="hasReservation(packId) ? 'success' : 'secondary'"
            >
              {{ getPackLabel(packId) }}
            </BaseTag>
          </div>
          <p v-if="wish.publicComment" class="italic text-gray-700">"{{ wish.publicComment }}"</p>

          <!-- Event History Toggle -->
          <button
            @click="toggleHistory"
            class="text-xs text-gray-600 hover:text-gray-800 hover:underline mt-2 flex items-center gap-1"
          >
            <IconChevronRight
              class="w-3 h-3 transition-transform"
              :class="showHistory ? 'rotate-90' : ''"
            />
            {{ showHistory ? 'Masquer' : 'Voir' }} l'historique
          </button>
          <ReservationWishEventHistory
            v-if="showHistory"
            :events="sortedEvents"
          />
        </div>
      </div>
    </div>
    <div
      v-if="statusConfig.infoText"
      class="w-full border-t border-gray-200 p-3 text-sm text-gray-700"
    >
      {{ statusConfig.infoText }}
    </div>
    <button
      v-if="wish.reservation?.isCancelable || wish.isCancelable"
      @click="handleCancel(wish)"
      :disabled="cancelling"
      class="w-full bg-red-100 hover:bg-red-200 border-t border-red-200 p-3 text-sm font-medium text-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-b-lg"
    >
      <IconX class="w-4 h-4" />
      {{ wish.reservation?.isCancelable ? 'Annuler la réservation' : 'Annuler cette demande' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ReservationOrWishStatusDto, type ReservationWishDto, type PackDto } from 'shared';

import { formatDateLong } from '~/composables/useDateHelpers';

interface Props {
  wish: ReservationWishDto;
  packs: PackDto[];
  currentStatus: ReservationOrWishStatusDto;
}

const { getConfigFromStatus } = useReservationWishStatus();
const { cancelling, cancelReservationWish, getReservationWishes } = useReservationWish();
const { cancelReservation } = useReservation();
const props = defineProps<Props>();

const showHistory = ref(false);

const sortedEvents = computed(() => {
  return [...props.wish.events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
});

const toggleHistory = () => {
  showHistory.value = !showHistory.value;
};

const getPackLabel = (packId: string): string => {
  const pack = props.packs.find(({ id }) => id === packId);
  return pack ? pack.label : packId;
};

const statusConfig = getConfigFromStatus(props.currentStatus);

const hasReservation = (packId: string): boolean => {
  return props.wish.reservation?.packId === packId && props.currentStatus === 'CONFIRMED';
};

const handleCancel = async (wish: ReservationWishDto) => {
  if (
    wish.reservation?.isCancelable &&
    confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')
  ) {
    await cancelReservation(wish.reservation.id);
    await getReservationWishes();
    return;
  }

  if (
    wish.isCancelable &&
    confirm('Êtes-vous sûr de vouloir annuler cette demande de réservation ?')
  ) {
    await cancelReservationWish(wish.id);
  }
};
</script>
