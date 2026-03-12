<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <!-- Search Bar -->
      <div class="bg-white rounded-lg shadow-sm m-4">
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
        <p v-if="searchQuery && filteredCount === 0" class="mt-2 px-4 py-2 text-sm text-gray-500">
          Aucun résultat trouvé pour "{{ searchQuery }}"
        </p>
        <p
          v-else-if="searchQuery && filteredCount > 0"
          class="mt-2 px-4 py-2 text-sm text-gray-500"
        >
          {{ filteredCount }} résultat{{ filteredCount > 1 ? 's' : '' }} trouvé{{
            filteredCount > 1 ? 's' : ''
          }}
        </p>
      </div>

      <div ref="faqContainer" class="bg-white rounded-lg shadow-sm">
        <template v-for="section in faqSections" :key="section.title">
          <div class="px-6 pt-8 pb-2">
            <h2 class="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {{ section.title }}
            </h2>
          </div>

          <FaqItem
            v-for="item in section.items"
            :key="item.id"
            :id="item.id"
            :question="item.question"
            :is-initially-open="isInitiallyOpen"
            :is-item-visible="isItemVisible"
          >
            <component :is="item.component" />
          </FaqItem>
        </template>
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

import {
  FaqDuckSheet,
  FaqPreRequisCompte,
  FaqMotDePasse,
  FaqQuestCeQuUnCoin,
  FaqDemandeVsReservation,
  FaqProcessusReservation,
  FaqAlgorithmeAttribution,
  FaqComptageCoins,
  FaqDemandeNonValidee,
  FaqAnnulerReservation,
  FaqRecupererMateriel,
  FaqPasPuVoler,
  FaqMaximiserChances,
  FaqFormationExamenClub,
  FaqJoursConsecutifs,
  FaqScoreCoins,
  FaqImpossibleDeposerDemande,
  FaqParticipationPassager,
  FaqAdministrateurs,
  FaqContactQuestions,
} from '#components';

definePageMeta({
  pageTitle: 'FAQ - Questions fréquentes',
});

const faqSections = [
  {
    title: 'Introduction',
    items: [
      { id: 'duck-sheet', question: "1. J'aimais bien la Duck sheet", component: FaqDuckSheet },
      {
        id: 'pre-requis-compte',
        question: "2. Quels sont les pré-requis pour obtenir un compte sur l'application ?",
        component: FaqPreRequisCompte,
      },
      {
        id: 'mot-de-passe',
        question: "3. Un admin m'a créé un compte mais je n'ai pas le mot de passe...",
        component: FaqMotDePasse,
      },
      {
        id: 'email-non-reçu',
        question: "4. Un admin m'a créé un compte mais je n'ai pas reçu l'email de confirmation...",
        component: FaqMotDePasse,
      },
    ],
  },
  {
    title: 'Comprendre le système des Coins',
    items: [
      {
        id: 'quest-ce-quun-coin',
        question: "5. Qu'est-ce qu'un Coin ?",
        component: FaqQuestCeQuUnCoin,
      },
    ],
  },
  {
    title: 'Le processus de réservation',
    items: [
      {
        id: 'demande-vs-reservation',
        question:
          '6. Quelle est la différence entre une demande de réservation et une réservation ?',
        component: FaqDemandeVsReservation,
      },
      {
        id: 'processus-reservation',
        question: '7. Comment se déroule le processus de réservation ?',
        component: FaqProcessusReservation,
      },
      {
        id: 'algorithme-attribution',
        question: "8. Comment fonctionne l'algorithme d'attribution des packs ?",
        component: FaqAlgorithmeAttribution,
      },
      {
        id: 'comptage-coins',
        question: '9. Comment sont comptés les Coins ?',
        component: FaqComptageCoins,
      },
      {
        id: 'demande-non-validee',
        question: "10. Que se passe-t-il si ma demande n'est pas validée ?",
        component: FaqDemandeNonValidee,
      },
      {
        id: 'annuler-reservation',
        question: '11. Puis-je annuler ma réservation après validation ?',
        component: FaqAnnulerReservation,
      },
      {
        id: 'recuperer-materiel',
        question: "12. J'ai une réservation, chez qui dois-je récupérer le matériel ?",
        component: FaqRecupererMateriel,
      },
    ],
  },
  {
    title: 'Stratégies et conseils',
    items: [
      {
        id: 'pas-pu-voler',
        question: "13. Il a plu, je n'ai pas pu voler",
        component: FaqPasPuVoler,
      },
      {
        id: 'maximiser-chances',
        question: '14. Comment maximiser mes chances ?',
        component: FaqMaximiserChances,
      },
    ],
  },
  {
    title: 'Cas particuliers',
    items: [
      {
        id: 'formation-examen-club',
        question: "15. J'ai besoin d'un bi pour une formation, un examen ou une journée club",
        component: FaqFormationExamenClub,
      },
      {
        id: 'jours-consecutifs',
        question: '16. Je veux réserver plusieurs jours consécutifs',
        component: FaqJoursConsecutifs,
      },
      {
        id: 'score-coins',
        question: '17. Comment consulter mon score Coins actuel ?',
        component: FaqScoreCoins,
      },
      {
        id: 'impossible-deposer-demande',
        question: '18. Pourquoi ne puis-je pas déposer de demande de réservation ?',
        component: FaqImpossibleDeposerDemande,
      },
      {
        id: 'participation-passager',
        question:
          "19. Mon passager a surkiffé le vol et veut absolument donner de l'argent. Que dois-je faire ?",
        component: FaqParticipationPassager,
      },
    ],
  },
  {
    title: 'Aide et contact',
    items: [
      {
        id: 'administrateurs',
        question: '20. Où sont les administrateurs ?',
        component: FaqAdministrateurs,
      },
      {
        id: 'contact-questions',
        question: "21. Qui puis-je contacter si j'ai d'autres questions ?",
        component: FaqContactQuestions,
      },
    ],
  },
];

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
      [
        el.querySelector('h3')?.textContent,
        el.querySelector('[data-faq-answer]')?.textContent,
      ].join(' '),
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
  @apply text-blue-600 underline hover:text-blue-800 py-1 px-0.5 -mx-0.5 rounded;
}
</style>
