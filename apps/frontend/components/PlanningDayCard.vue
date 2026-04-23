<template>
  <div
    :class="[
      'rounded shadow-sm',
      isBeforeToday(day.date) ? 'bg-gray-100 border border-gray-200' : '',
      isToday(day.date) ? 'bg-white border-2 border-gray-300' : '',
      !isBeforeToday(day.date) && !isToday(day.date) ? 'bg-white border border-gray-200' : '',
    ]"
  >
    <div
      @click="toggleExpanded"
      class="px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition"
      :class="isExpanded ? 'border-b border-gray-200' : ''"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">
          <DateDisplay :date="day.date" />
        </h3>
        <IconChevronRight
          class="w-4 h-4 transition-transform"
          :class="isExpanded ? 'rotate-90' : ''"
        />
      </div>

      <!-- Pack Status Tags (when collapsed) -->
      <div v-if="!isExpanded" class="flex flex-wrap gap-1 mt-2">
        <template v-for="pack in day.packs" :key="pack.packId">
          <NuxtLink
            v-if="getPackStatusConfig(pack).status === 'available'"
            :to="getCreateWishLink(pack)"
          >
            <BaseTag rounded="rounded" :variant="getPackStatusConfig(pack).variant">
              {{ pack.packLabel }}
            </BaseTag>
          </NuxtLink>
          <BaseTag v-else rounded="rounded" :variant="getPackStatusConfig(pack).variant">
            {{ pack.packLabel }}
          </BaseTag>
        </template>
      </div>
    </div>

    <div v-show="isExpanded" class="p-2 space-y-1.5">
      <!-- Pack Slot -->
      <div
        v-for="pack in day.packs"
        :key="pack.packId"
        class="border border-gray-200 rounded p-2 bg-gray-50"
      >
        <div class="flex items-start justify-between gap-2">
          <span class="text-sm text-secondary-600">{{ pack.packLabel }}</span>

          <div class="flex flex-col items-end gap-1">
            <div class="flex items-stretch gap-1 text-sm">
              <NuxtLink
                v-if="getPackStatusConfig(pack).status === 'available'"
                :to="getCreateWishLink(pack)"
              >
                <BaseTag rounded="rounded" :variant="getPackStatusConfig(pack).variant">
                  <component :is="getPackStatusConfig(pack).icon" class="w-3 h-3 mr-1" />
                  {{ getPackStatusConfig(pack).label }}
                </BaseTag>
              </NuxtLink>
              <BaseTag
                v-else-if="getPackStatusConfig(pack).status !== 'reserved'"
                rounded="rounded"
                :variant="getPackStatusConfig(pack).variant"
              >
                <component :is="getPackStatusConfig(pack).icon" class="w-3 h-3 mr-1" />
                {{ getPackStatusConfig(pack).label }}
              </BaseTag>
              <PilotDisplay
                v-else
                :display-name="getPackStatusConfig(pack).label"
                variant="danger"
              />
              <button
                v-if="pack.reservation && canCancelReservation(pack)"
                @click="handleCancelReservation(pack.reservation.id)"
                class="flex items-center justify-center px-2 py-1 rounded-md bg-red-700 hover:bg-red-800 transition text-white"
                aria-label="Annuler la réservation"
              >
                <IconX class="w-3 h-3" />
              </button>
            </div>

            <!-- User Contact Info -->
            <div v-if="pack.reservation" class="space-y-0.5 text-xs text-gray-600 text-right">
              <div v-if="getPackStatusConfig(pack).email">
                <a :href="`mailto:${getPackStatusConfig(pack).email}`" class="hover:underline">
                  {{ getPackStatusConfig(pack).email }}
                </a>
              </div>
              <div v-if="getPackStatusConfig(pack).phone">
                <a :href="`tel:${getPackStatusConfig(pack).phone}`" class="hover:underline">
                  {{ getPackStatusConfig(pack).phone }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Public Comment -->
        <div v-if="pack.reservation?.publicComment" class="mt-1.5 text-xs text-gray-700 italic">
          "{{ pack.reservation.publicComment }}"
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PackPlanningDto } from 'shared';

import IconCheck from '~/components/icons/IconCheck.vue';
import IconClock from '~/components/icons/IconClock.vue';
import IconUser from '~/components/icons/IconUser.vue';
import IconX from '~/components/icons/IconX.vue';
import { isToday, isBeforeToday, formatDateToString } from '~/composables/useDateHelpers';

interface PlanningDay {
  date: string;
  packs: PackPlanningDto[];
}

interface Props {
  day: PlanningDay;
  isExpanded: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'toggle-expanded': [];
  'after-cancel-reservation': [];
}>();

const { userData: currentUser, users } = useUser();
const { getUserDisplayName } = useUserHelpers();
const { isPackManagedByCurrentUser } = usePack();
const { cancelReservation } = useReservation();

const toggleExpanded = () => {
  emit('toggle-expanded');
};

const canCancelReservation = (pack: PackPlanningDto): boolean => {
  if (!pack.reservation) return false;
  if (!pack.reservation.isCancelable) return false;

  const isAfterNow = new Date(props.day.date) > new Date();

  // User can cancel their own reservation
  if (pack.reservation.userId === currentUser.value?.id && isAfterNow) return true;

  // Admin/Manager can cancel reservations on packs they manage
  return isPackManagedByCurrentUser(pack.packId);
};

const handleCancelReservation = async (reservationId: string) => {
  if (!confirm('Es-tu sûr de vouloir annuler cette réservation ?')) return;

  try {
    await cancelReservation(reservationId);
    emit('after-cancel-reservation');
  } catch (error) {
    console.error('Error deleting reservation:', error);
    alert('Erreur lors de la suppression de la réservation');
  }
};

const getReservedUser = (userId: string | undefined) => {
  if (!userId) return undefined;
  return users.value.find((u) => u.id === userId);
};

const getCreateWishLink = (pack: PackPlanningDto) => ({
  path: '/mes-demandes',
  query: { date: formatDateToString(new Date(props.day.date)), packId: pack.packId },
});

const getPackStatusConfig = (pack: PackPlanningDto) => {
  if (pack.reservation) {
    const user = getReservedUser(pack.reservation.userId);
    return {
      status: 'reserved' as const,
      variant: 'danger' as const,
      icon: IconUser,
      label: getUserDisplayName(user) ?? 'Admin',
      phone: user?.phoneNumber,
      email: user?.email,
    };
  }
  if (pack.pendingWishesCount > 0) {
    return {
      status: 'pending' as const,
      variant: 'warning' as const,
      icon: IconClock,
      label: `${pack.pendingWishesCount} ${pack.pendingWishesCount > 1 ? 'demandes' : 'demande'}`,
    };
  }
  return {
    status: 'available' as const,
    variant: 'success' as const,
    icon: IconCheck,
    label: 'Disponible',
  };
};
</script>
