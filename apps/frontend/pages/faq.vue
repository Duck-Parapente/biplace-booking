<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-sm p-4 m-4">
        <p class="text-gray-600">
          Retrouve ici toutes les réponses aux questions fréquentes sur le système de réservation
          des vols biplaces.
        </p>
      </div>

      <!-- Search Bar -->
      <div class="bg-white rounded-lg shadow-sm p-4 m-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher dans la FAQ..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div v-if="searchQuery" class="absolute right-3 top-2.5">
            <button @click="searchQuery = ''" class="text-gray-400 hover:text-gray-600 transition">
              ✕
            </button>
          </div>
        </div>
        <p v-if="searchQuery && filteredCount === 0" class="mt-2 text-sm text-gray-500">
          Aucun résultat trouvé pour "{{ searchQuery }}"
        </p>
        <p v-else-if="searchQuery && filteredCount > 0" class="mt-2 text-sm text-gray-500">
          {{ filteredCount }} résultat{{ filteredCount > 1 ? 's' : '' }} trouvé{{
            filteredCount > 1 ? 's' : ''
          }}
        </p>
      </div>

      <div ref="faqContainer" class="bg-white rounded-lg shadow-sm">
        <!-- Introduction -->
        <div class="px-6 pt-6 pb-3">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Introduction</h2>
        </div>

        <FaqItem
          id="duck-sheet"
          question="1. J'aimais bien la Duck sheet"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqDuckSheet />
        </FaqItem>

        <FaqItem
          id="pre-requis-compte"
          question="2. Quels sont les pré-requis pour obtenir un compte sur l'application ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqPreRequisCompte />
        </FaqItem>

        <FaqItem
          id="mot-de-passe"
          question="3. Un admin m'a créé un compte mais je n'ai pas le mot de passe..."
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqMotDePasse />
        </FaqItem>

        <!-- Comprendre le système des Coins -->
        <div class="px-6 pt-6 pb-3">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Comprendre le système des Coins
          </h2>
        </div>

        <FaqItem
          id="quest-ce-quun-coin"
          question="4. Qu'est-ce qu'un Coin ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqQuestCeQuUnCoin />
        </FaqItem>

        <!-- Le processus de réservation -->
        <div class="px-6 pt-6 pb-3">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Le processus de réservation
          </h2>
        </div>

        <FaqItem
          id="demande-vs-reservation"
          question="5. Quelle est la différence entre une demande de réservation et une réservation ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqDemandeVsReservation />
        </FaqItem>

        <FaqItem
          id="processus-reservation"
          question="6. Comment se déroule le processus de réservation ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqProcessusReservation />
        </FaqItem>

        <FaqItem
          id="algorithme-attribution"
          question="7. Comment fonctionne l'algorithme d'attribution des packs ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqAlgorithmeAttribution />
        </FaqItem>

        <FaqItem
          id="comptage-coins"
          question="8. Comment sont comptés les Coins ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqComptageCoins />
        </FaqItem>

        <FaqItem
          id="demande-non-validee"
          question="9. Que se passe-t-il si ma demande n'est pas validée ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqDemandeNonValidee />
        </FaqItem>

        <FaqItem
          id="annuler-reservation"
          question="10. Puis-je annuler ma réservation après validation ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqAnnulerReservation />
        </FaqItem>

        <FaqItem
          id="recuperer-materiel"
          question="11. J'ai une réservation, chez qui dois-je récupérer le matériel ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqRecupererMateriel />
        </FaqItem>

        <!-- Stratégies et conseils -->
        <div class="px-6 pt-6 pb-3">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Stratégies et conseils
          </h2>
        </div>

        <FaqItem
          id="pas-pu-voler"
          question="12. Il a plu, je n'ai pas pu voler"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqPasPuVoler />
        </FaqItem>

        <FaqItem
          id="maximiser-chances"
          question="13. Comment maximiser mes chances ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqMaximiserChances />
        </FaqItem>

        <!-- Cas particuliers -->
        <div class="px-6 pt-6 pb-3">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Cas particuliers
          </h2>
        </div>

        <FaqItem
          id="formation-examen-club"
          question="14. J'ai besoin d'un bi pour une formation, un examen ou une journée club"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqFormationExamenClub />
        </FaqItem>

        <FaqItem
          id="jours-consecutifs"
          question="15. Je veux réserver plusieurs jours consécutifs"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqJoursConsecutifs />
        </FaqItem>

        <FaqItem
          id="score-coins"
          question="16. Comment consulter mon score Coins actuel ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqScoreCoins />
        </FaqItem>

        <FaqItem
          id="impossible-deposer-demande"
          question="17. Pourquoi ne puis-je pas déposer de demande de réservation ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqImpossibleDeposerDemande />
        </FaqItem>

        <FaqItem
          id="participation-passager"
          question="18. Mon passager a surkiffé le vol et veut absolument donner de l'argent. Que dois-je faire ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqParticipationPassager />
        </FaqItem>

        <!-- Aide et contact -->
        <div class="px-6 pt-6 pb-3">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Aide et contact
          </h2>
        </div>

        <FaqItem
          id="administrateurs"
          question="19. Où sont les administrateurs ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqAdministrateurs />
        </FaqItem>

        <FaqItem
          id="contact-questions"
          question="20. Qui puis-je contacter si j'ai d'autres questions ?"
          :is-initially-open="isInitiallyOpen"
          :is-item-visible="isItemVisible"
        >
          <FaqContactQuestions />
        </FaqItem>
      </div>

      <div class="mt-8 text-center">
        <NuxtLink
          to="/"
          class="bg-secondary-600 text-white transition text-sm px-4 py-2 rounded disabled:opacity-50"
        >
          Retour au planning
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Fuse from 'fuse.js';

definePageMeta({
  pageTitle: 'FAQ - Questions fréquentes',
});

const route = useRoute();
const initialOpenId = route.hash?.slice(1) || '';

// Search functionality
const searchQuery = ref('');
const faqContainer = ref<HTMLElement>();

const normalize = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

interface FaqEntry {
  slug: string;
  text: string;
}

const fuseInstance = ref<Fuse<FaqEntry> | null>(null);
const allSlugs = ref<string[]>([]);
const matchingSlugs = ref<Set<string>>(new Set());

onMounted(() => {
  if (!faqContainer.value) return;
  const items = faqContainer.value.querySelectorAll('[data-faq-item]');
  const data: FaqEntry[] = Array.from(items).map((el) => ({
    slug: el.id,
    text: normalize(
      [el.querySelector('h3')?.textContent, el.querySelector('.p-4')?.textContent].join(' '),
    ),
  }));
  allSlugs.value = data.map((d) => d.slug);
  fuseInstance.value = new Fuse(data, {
    keys: ['text'],
    threshold: 0.3,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
  matchingSlugs.value = new Set(allSlugs.value);

  // Scroll to hash target
  if (initialOpenId) {
    nextTick(() => {
      document.getElementById(initialOpenId)?.scrollIntoView({ behavior: 'smooth' });
    });
  }
});

watch(searchQuery, (query) => {
  if (!fuseInstance.value || !query.trim()) {
    matchingSlugs.value = new Set(allSlugs.value);
    return;
  }
  const results = fuseInstance.value.search(normalize(query));
  matchingSlugs.value = new Set(results.map((r) => r.item.slug));
});

const isInitiallyOpen = (slug: string) => initialOpenId === slug;

const isItemVisible = (slug: string) => {
  if (!searchQuery.value.trim()) return true;
  return matchingSlugs.value.has(slug);
};

const filteredCount = computed(() =>
  searchQuery.value.trim() ? matchingSlugs.value.size : allSlugs.value.length,
);
</script>

<style scoped>
/* Only style links within FAQ items, not standalone NuxtLinks like the back button */
:deep([data-faq-item] a) {
  @apply text-blue-600 underline hover:text-blue-800;
}
</style>
