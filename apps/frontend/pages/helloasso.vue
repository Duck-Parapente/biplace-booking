<template>
  <main class="h-full flex flex-col bg-gray-50 overflow-hidden">
    <div class="flex-1 p-4 pb-8 max-w-xl mx-auto w-full flex flex-col gap-6 overflow-y-auto">
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <h1 class="text-xl font-semibold text-secondary-600 mb-4">💰 Participation passager</h1>
        <div class="text-sm text-gray-700 mb-6">
          <p>
            Tu peux proposer à ton passager de participer au maintien du matériel biplace. La
            participation n'est pas obligatoire et le montant est libre.
          </p>
        </div>

        <!-- QR Code -->
        <div class="w-full max-w-[280px] mx-auto mb-6">
          <img
            src="~/assets/png/qr-participation.png"
            alt="QR Code participation biplace"
            class="w-full h-auto rounded-lg"
          />
        </div>

        <!-- Link Display -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-secondary-600 mb-2">
            Lien de participation
          </label>
          <div class="flex gap-2">
            <input
              ref="linkInput"
              type="text"
              :value="participationLink"
              readonly
              class="flex-1 px-3 py-2 bg-gray-50 text-gray-700 text-sm rounded border border-gray-300"
            />
            <button
              @click="copyLink"
              class="bg-secondary-600 text-white px-4 py-2 rounded hover:opacity-90 transition text-sm whitespace-nowrap"
            >
              {{ copied ? '✓ Copié' : 'Copier' }}
            </button>
          </div>
        </div>

        <!-- SMS Link -->
        <div>
          <a
            :href="smsLink"
            class="block w-full bg-secondary-600 text-white text-center px-4 py-3 rounded hover:opacity-90 transition font-medium"
          >
            📱 Partager par SMS
          </a>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  middleware: 'auth',
  pageTitle: 'HelloAsso',
});

const { participationLink } = useHelloAssoLinks();

const linkInput = ref<HTMLInputElement | null>(null);
const copied = ref(false);

const smsLink = computed(() => {
  const message = `Participe aux frais du biplace DUCK : ${participationLink}`;
  return `sms:?&body=${encodeURIComponent(message)}`;
});

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(participationLink);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    // Fallback for older browsers
    if (linkInput.value) {
      linkInput.value.select();
      document.execCommand('copy');
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    }
  }
};
</script>
