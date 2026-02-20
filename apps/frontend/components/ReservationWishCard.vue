<template>
  <div class="border bg-white border-gray-300 rounded-lg hover:shadow-md transition relative">
    <!-- Status Badge - Top Right Corner -->
    <div class="absolute top-3 right-3 flex flex-col items-end">
      <button
        @click="toggleHistory"
        class="px-2 py-1 text-xs font-medium rounded inline-flex items-center gap-1 transition-all hover:opacity-80"
        :class="statusConfig.classes"
      >
        <IconChevronRight
          class="w-3 h-3 transition-transform"
          :class="showHistory ? 'rotate-90' : ''"
        />
        <span>{{ statusConfig.label }}</span>
      </button>
      <span
        v-if="
          (wish.reservation && ReservationWishStatusDto.CONFIRMED !== currentStatus) ||
          currentStatus === ReservationWishStatusDto.CANCELLED
        "
        class="inline-flex items-center text-gray-400 mt-1"
      >
        <CostDisplay :cost="wish.reservation?.cost ?? 0" />
      </span>
    </div>

    <div class="p-3">
      <div class="flex-1">
        <div class="text-sm text-gray-600 space-y-2">
          <DateDisplay :date="wish.startingDate" />
          <div class="flex flex-wrap gap-1 mt-3 items-center">
            <BaseTag
              v-for="packId in wish.packChoices"
              :key="packId"
              :variant="showPackIsReserved(packId) ? 'success' : 'secondary'"
              rounded="rounded"
            >
              {{ getPackLabel(packId) }}
            </BaseTag>
          </div>
          <p v-if="wish.publicComment" class="text-gray-700 rounded-lg bg-gray-100 p-3">
            ℹ️ {{ wish.publicComment }}
          </p>
          <ReservationWishEventHistory :events="sortedEvents" :show-history="showHistory" />
        </div>
      </div>
    </div>
    <div
      v-if="statusConfig.infoText"
      class="w-full border-t border-gray-200 p-3 text-sm text-gray-700"
    >
      {{ statusConfig.infoText }}
    </div>
    <CloseReservationModal v-if="wish.reservation" :wish="wish" />
    <button
      v-if="canCancel"
      @click="handleCancel(wish)"
      :disabled="cancelling"
      class="w-full bg-red-50 hover:bg-red-100 border-t border-red-1000 p-3 text-sm font-medium text-red-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-b-lg"
    >
      <IconX class="w-4 h-4" />
      {{ wish.reservation?.isCancelable ? 'Annuler la réservation' : 'Annuler la demande' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  type ReservationWishDto,
  type PackDto,
  ReservationWishStatusDto,
  type CostUpdateType,
} from 'shared';

interface Props {
  wish: ReservationWishDto;
  packs: PackDto[];
  currentStatus: ReservationWishStatusDto;
}

const { getConfigFromStatus } = useReservationWishStatus();
const { cancelling, cancelReservationWish } = useReservationWish();
const { cancelReservation } = useReservation();
const props = defineProps<Props>();

const showHistory = ref(false);

const toggleHistory = () => {
  showHistory.value = !showHistory.value;
};

const sortedEvents = computed(() => {
  // Combine status updates and cost updates into a single timeline
  const statusEvents = props.wish.statusUpdates.map(({ status, date, type }) => ({
    type: 'status' as const,
    status,
    date,
    eventType: type,
  }));

  const getType = (update: CostUpdateType) => {
    if (update === 'MANUAL_COST_UPDATED') {
      return 'manual' as const;
    }
    if (update === 'AUTOMATIC_COST_UPDATED') {
      return 'automatic' as const;
    }
    return 'unknown' as const;
  };

  const costEvents = props.wish.costUpdates.map(({ cost, date, type }) => ({
    type: getType(type),
    cost,
    date,
  }));

  return [...statusEvents, ...costEvents].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();

    if (timeB !== timeA) {
      return timeB - timeA;
    }

    return a.type === 'status' ? 1 : -1;
  });
});

const getPackLabel = (packId: string): string => {
  const pack = props.packs.find(({ id }) => id === packId);
  return pack ? pack.label : packId;
};

const statusConfig = getConfigFromStatus(props.currentStatus);

const showPackIsReserved = (packId: string): boolean => {
  return (
    props.wish.reservation?.packId === packId &&
    [ReservationWishStatusDto.CONFIRMED, ReservationWishStatusDto.CLOSED].includes(
      props.currentStatus,
    )
  );
};

const canCancel = computed(() => {
  const isAfterNow = new Date(props.wish.startingDate) > new Date();

  if (props.wish.reservation) {
    return props.wish.reservation.isCancelable && isAfterNow;
  }

  return props.wish.isCancelable;
});

const handleCancel = async (wish: ReservationWishDto) => {
  if (wish.reservation?.isCancelable) {
    if (confirm('Es-tu sûr de vouloir annuler cette réservation ?')) {
      await cancelReservation(wish.reservation.id);
    }
    return;
  }

  if (wish.isCancelable && confirm('Es-tu sûr de vouloir annuler cette demande ?')) {
    await cancelReservationWish(wish.id);
  }
};
</script>
