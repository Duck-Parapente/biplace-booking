<template>
  <div class="flex-1 flex flex-col min-h-0">
    <div class="mb-3 flex items-center justify-between gap-3">
      <h2 class="text-xl font-semibold text-gray-800 shrink-0">Carnet de vol</h2>
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <span class="text-gray-600">Vols non clôturés</span>
          <button
            type="button"
            :class="[
              showConfirmed ? 'bg-primary-400' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
            ]"
            role="switch"
            :aria-checked="showConfirmed"
            @click="showConfirmed = !showConfirmed"
          >
            <span
              :class="[
                showConfirmed ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              ]"
            />
          </button>
        </label>

        <label v-if="isAdmin" class="flex items-center gap-2 text-sm cursor-pointer">
          <span class="text-gray-600">Édition</span>
          <button
            type="button"
            :class="[
              editMode ? 'bg-primary-400' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
            ]"
            role="switch"
            :aria-checked="editMode"
            @click="editMode = !editMode"
          >
            <span
              :class="[
                editMode ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              ]"
            />
          </button>
        </label>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="rounded-lg shadow-sm">
        <div v-if="timeline.length === 0" class="text-gray-500 text-sm bg-white p-3 rounded-lg">
          <p>Aucun vol enregistré pour ce pack.</p>
        </div>

        <div v-else class="space-y-2">
          <template v-for="item in timeline" :key="item.id">
            <div
              v-if="item.type === 'note'"
              class="border border-amber-200 bg-amber-50 rounded-lg px-3 py-2 flex flex-col gap-1"
              :class="{
                'cursor-pointer hover:bg-amber-100 transition':
                  item.data.createdById === userData?.id,
              }"
              @click="item.data.createdById === userData?.id && emit('note-edit', item.data)"
            >
              <p class="text-xs text-gray-400">{{ formatDate(item.data.createdAt) }}</p>
              <p class="text-sm text-gray-700 whitespace-pre-line">{{ item.data.content }}</p>
              <p v-if="item.data.createdById" class="text-xs text-amber-700 text-right">
                — {{ getUserName(item.data.createdById) }}
              </p>
            </div>

            <div
              v-else
              class="border bg-white border-gray-300 rounded-lg p-3 hover:shadow-md transition"
              :class="{ 'cursor-pointer hover:bg-gray-50': editMode }"
              @click="handleReservationClick(item.data)"
            >
              <div class="flex justify-between items-start mb-2">
                <p class="text-xs text-gray-400">{{ formatDate(item.data.startingDate) }}</p>
                <div class="flex flex-col items-end gap-1.5">
                  <BaseTag
                    v-if="item.data.status === ReservationWishStatusDto.CANCELLED"
                    variant="danger"
                  >
                    Annulé
                  </BaseTag>
                  <BaseTag
                    v-else-if="item.data.status === ReservationWishStatusDto.CLOSED"
                    variant="success"
                  >
                    Clôturé
                  </BaseTag>
                  <BaseTag
                    v-else-if="item.data.status === ReservationWishStatusDto.CONFIRMED"
                    variant="gray"
                  >
                    Confirmé
                  </BaseTag>
                </div>
              </div>

              <div v-if="item.data.userId" class="mb-2 text-sm flex items-center gap-2">
                <span class="font-semibold">Pilote:</span>
                <PilotDisplay :display-name="getUserName(item.data.userId)" />
                <template v-if="editMode">
                  <span class="font-semibold text-xl text-gray-200">&nbsp;/&nbsp;</span>
                  <CostDisplay :cost="item.data.manualCost ?? item.data.automaticCost ?? 0" />
                </template>
              </div>

              <div
                v-if="item.data.flightLog"
                class="bg-gray-100 rounded-lg p-2 space-y-1.5 text-sm"
              >
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Temps de vol:</span>
                  <span>{{ item.data.flightLog.flightTimeMinutes }} minutes</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-semibold">Nombre de vols:</span>
                  <span>{{ item.data.flightLog.flightsCount }}</span>
                </div>
                <div
                  v-if="item.data.flightLog.publicComment"
                  class="pt-1.5 border-t border-gray-200"
                >
                  <p class="font-semibold mb-1">Commentaire:</p>
                  <p class="italic text-gray-600">"{{ item.data.flightLog.publicComment }}"</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ReservationWishStatusDto, type PackReservationsDto, type PackNoteDto } from 'shared';

import { formatDate } from '~/composables/useDateHelpers';

type ReservationItem = PackReservationsDto['reservations'][0];

type TimelineItem =
  | { id: string; type: 'reservation'; sortDate: number; data: ReservationItem }
  | { id: string; type: 'note'; sortDate: number; data: PackNoteDto };

const props = defineProps<{
  reservations: PackReservationsDto['reservations'];
  notes: PackNoteDto[];
  isAdmin: boolean;
}>();

const emit = defineEmits<{
  'reservation-click': [reservation: ReservationItem];
  'note-edit': [note: PackNoteDto];
}>();

const editMode = ref(false);
const showConfirmed = ref(false);

const { getUserName, getUsers, userData } = useUser();

const timeline = computed<TimelineItem[]>(() => {
  const reservationItems: TimelineItem[] = props.reservations
    .filter((reservation) => {
      if (!editMode.value && reservation.status === ReservationWishStatusDto.CANCELLED)
        return false;
      if (!showConfirmed.value && reservation.status === ReservationWishStatusDto.CONFIRMED)
        return false;
      return true;
    })
    .map((r) => ({
      id: r.id,
      type: 'reservation' as const,
      sortDate: new Date(r.startingDate).getTime(),
      data: r,
    }));

  const noteItems: TimelineItem[] = props.notes.map((n) => ({
    id: n.id,
    type: 'note' as const,
    sortDate: new Date(n.createdAt).getTime(),
    data: n,
  }));

  return [...reservationItems, ...noteItems].sort((a, b) => {
    if (b.sortDate !== a.sortDate) return b.sortDate - a.sortDate;
    // notes before reservations when timestamps are equal
    if (a.type === 'note' && b.type !== 'note') return -1;
    if (b.type === 'note' && a.type !== 'note') return 1;
    return 0;
  });
});

const handleReservationClick = (reservation: ReservationItem) => {
  if (editMode.value) {
    emit('reservation-click', reservation);
  }
};

onMounted(async () => {
  await getUsers();
});
</script>
