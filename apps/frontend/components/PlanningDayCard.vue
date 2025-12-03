<template>
  <div
    :class="[
      'border rounded shadow-sm',
      isToday(day.date) ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-300',
    ]"
  >
    <div
      @click="toggleExpanded"
      class="px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition"
      :class="isExpanded ? 'border-b border-gray-200' : ''"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">
          <span class="text-secondary-600"
            >{{ formatDateLong(day.date).day }} {{ formatDateLong(day.date).month }}</span
          >
          <span class="text-gray-400 font-normal text-sm ml-1"
            >({{ formatDateLong(day.date).weekday }})</span
          >
        </h3>
        <IconChevronRight
          class="w-4 h-4 transition-transform"
          :class="isExpanded ? 'rotate-90' : ''"
        />
      </div>

      <!-- Pack Status Tags (when collapsed) -->
      <div v-if="!isExpanded" class="flex flex-wrap gap-1 mt-2">
        <span
          v-for="pack in day.packs"
          :key="pack.packId"
          class="px-2 py-0.5 text-xs rounded"
          :class="getPackStatusConfig(pack).backgroundClass"
        >
          {{ pack.packLabel }}
        </span>
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
            <div class="flex items-stretch gap-1">
              <div
                class="flex items-center gap-1 px-2 py-1 rounded text-sm"
                :class="getPackStatusConfig(pack).backgroundClass"
              >
                <component :is="getPackStatusConfig(pack).icon" class="w-3 h-3" />
                <span>{{ getPackStatusConfig(pack).label }}</span>
              </div>
              <button
                v-if="pack.reservation && canCancelReservation(pack)"
                @click="handleCancelReservation(pack.reservation.id)"
                class="flex items-center justify-center px-2 rounded bg-red-100 hover:bg-red-200 transition text-red-800"
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
import { UserRoles } from 'shared';

import IconCheck from '~/components/icons/IconCheck.vue';
import IconClock from '~/components/icons/IconClock.vue';
import IconUser from '~/components/icons/IconUser.vue';
import IconX from '~/components/icons/IconX.vue';
import { formatDateLong, isToday } from '~/composables/useDateHelpers';

interface PlanningDay {
  date: Date;
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

const { hasRole } = useAuth();
const { userData: currentUser, users } = useUser();
const { getUserDisplayName } = useUserHelpers();
const { packs: allPacks } = usePack();
const { cancelReservation } = useReservation();

const toggleExpanded = () => {
  emit('toggle-expanded');
};

const canCancelReservation = (pack: PackPlanningDto): boolean => {
  if (!pack.reservation) return false;
  if (!pack.reservation.isCancelable) return false;

  // User can cancel their own reservation
  if (pack.reservation.userId === currentUser.value?.id) return true;

  // Admin can delete any reservation
  if (hasRole(UserRoles.ADMIN)) return true;

  // Manager can delete reservations on packs they own
  if (hasRole(UserRoles.MANAGER)) {
    const packDetails = allPacks.value.find((p) => p.id === pack.packId);
    return packDetails?.ownerId === currentUser.value?.id;
  }

  return false;
};

const handleCancelReservation = async (reservationId: string) => {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

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

const getPackStatusConfig = (pack: PackPlanningDto) => {
  if (pack.reservation) {
    const user = getReservedUser(pack.reservation.userId);
    return {
      backgroundClass: 'bg-red-100 text-red-800',
      icon: IconUser,
      label: getUserDisplayName(user) ?? 'Admin',
      phone: user?.phoneNumber,
      email: user?.email,
    };
  }
  if (pack.pendingWishesCount > 0) {
    return {
      backgroundClass: 'bg-orange-100 text-orange-800',
      icon: IconClock,
      label: `${pack.pendingWishesCount} ${pack.pendingWishesCount > 1 ? 'demandes' : 'demande'}`,
    };
  }
  return {
    backgroundClass: 'bg-green-100 text-green-800',
    icon: IconCheck,
    label: 'Disponible',
  };
};
</script>
