<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-3 max-w-4xl mx-auto w-full flex flex-col min-h-0">
      <div v-if="loading" class="text-gray-500">
        <p>Chargement...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 p-3 rounded-lg">
        <p><strong>Erreur:</strong> {{ error }}</p>
      </div>

      <div v-else-if="equipments.length === 0" class="text-gray-500 text-center p-8">
        <p>Aucun accessoire pour le moment.</p>
      </div>

      <div v-else class="flex-1 overflow-y-auto pb-4 space-y-4">
        <div
          v-for="equipment in equipments"
          :key="equipment.id"
          class="border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
          <div class="bg-secondary-100 px-3 py-2">
            <h3 class="text-lg font-semibold text-secondary-700">{{ equipment.label }}</h3>
          </div>

          <div class="px-3 py-3 space-y-3">
            <!-- Current holder -->
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <div class="flex items-center gap-2 text-sm text-gray-700">
                <span class="font-medium">Détenteur actuel :</span>
                <span
                  v-if="equipment.currentHolderId"
                  class="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-secondary-600 text-white"
                >
                  {{ equipment.currentHolderName ?? getUserName(equipment.currentHolderId) }}
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-400"
                >
                  personne
                </span>
              </div>

              <button
                v-if="!isHeldByMe(equipment)"
                type="button"
                :disabled="updatingId === equipment.id"
                class="px-4 py-2 text-sm bg-secondary-600 text-white hover:bg-secondary-700 transition rounded disabled:opacity-50"
                @click="takeEquipment(equipment)"
              >
                Je le prends
              </button>
              <button
                v-else
                type="button"
                :disabled="updatingId === equipment.id"
                class="px-4 py-2 text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 transition rounded disabled:opacity-50"
                @click="releaseEquipment(equipment)"
              >
                Je le rends
              </button>
            </div>

            <!-- Notes -->
            <div class="border-t border-gray-100 pt-3">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-medium text-gray-700">Notes</h4>
                <button
                  type="button"
                  class="px-4 py-2 text-sm bg-amber-400 hover:bg-amber-500 text-white rounded transition"
                  @click="openNoteModal(equipment.id)"
                >
                  + Ajouter une note
                </button>
              </div>

              <div
                v-if="(notesByEquipment[equipment.id] ?? []).length === 0"
                class="text-xs text-gray-400"
              >
                Aucune note.
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="note in notesByEquipment[equipment.id]"
                  :key="note.id"
                  class="border border-amber-200 bg-amber-50 rounded-lg px-3 py-2 flex flex-col gap-1"
                  :class="{
                    'cursor-pointer hover:bg-amber-100 transition':
                      note.createdById === userData?.id,
                  }"
                  @click="note.createdById === userData?.id && handleNoteEdit(equipment.id, note)"
                >
                  <p class="text-xs text-gray-400">{{ formatDate(note.createdAt) }}</p>
                  <p class="text-sm text-gray-700 whitespace-pre-line">{{ note.content }}</p>
                  <p v-if="note.createdById" class="text-xs text-amber-700 text-right">
                    — {{ getUserName(note.createdById) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EquipmentNoteModal
      v-if="noteModalEquipmentId"
      :open="noteModalOpen"
      :equipment-id="noteModalEquipmentId"
      :note="editingNote"
      @close="closeNoteModal"
      @created="handleNotesChanged"
      @updated="handleNotesChanged"
    />
  </main>
</template>

<script setup lang="ts">
import type { EquipmentDto, EquipmentNoteDto } from 'shared';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'Accessoires',
});

const { equipments, loading, error, getEquipments, getEquipmentNotes, setHolder } = useEquipment();
const { userData, getUser, getUsers, getUserName } = useUser();

const notesByEquipment = ref<Record<string, EquipmentNoteDto[]>>({});
const updatingId = ref<string | null>(null);

const noteModalOpen = ref<boolean>(false);
const noteModalEquipmentId = ref<string | null>(null);
const editingNote = ref<EquipmentNoteDto | null>(null);

const isHeldByMe = (equipment: EquipmentDto): boolean => {
  return !!userData.value && equipment.currentHolderId === userData.value.id;
};

const fetchNotes = async (equipmentId: string) => {
  try {
    notesByEquipment.value[equipmentId] = await getEquipmentNotes(equipmentId);
  } catch (err) {
    console.error('Failed to fetch equipment notes:', err);
  }
};

const fetchAllNotes = async () => {
  await Promise.all(equipments.value.map((e) => fetchNotes(e.id)));
};

const takeEquipment = async (equipment: EquipmentDto) => {
  if (!userData.value) return;
  if (!confirm(`Es-tu sûr de vouloir prendre "${equipment.label}" ?`)) return;
  await changeHolder(equipment.id, userData.value.id);
};

const releaseEquipment = async (equipment: EquipmentDto) => {
  await changeHolder(equipment.id, null);
};

const changeHolder = async (equipmentId: string, holderId: string | null) => {
  try {
    updatingId.value = equipmentId;
    await setHolder(equipmentId, holderId);
    await getEquipments();
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Impossible de mettre à jour le détenteur';
  } finally {
    updatingId.value = null;
  }
};

const openNoteModal = (equipmentId: string) => {
  editingNote.value = null;
  noteModalEquipmentId.value = equipmentId;
  noteModalOpen.value = true;
};

const handleNoteEdit = (equipmentId: string, note: EquipmentNoteDto) => {
  editingNote.value = note;
  noteModalEquipmentId.value = equipmentId;
  noteModalOpen.value = true;
};

const closeNoteModal = () => {
  noteModalOpen.value = false;
  editingNote.value = null;
};

const handleNotesChanged = async () => {
  if (noteModalEquipmentId.value) {
    await fetchNotes(noteModalEquipmentId.value);
  }
};

onMounted(async () => {
  await Promise.all([getUser(), getUsers(), getEquipments()]);
  await fetchAllNotes();
});
</script>
