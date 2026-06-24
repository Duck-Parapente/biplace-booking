interface NewsEntry {
  version: number;
  date: string;
  title: string;
  content: string;
}

const NEWS: NewsEntry[] = [
  {
    version: 4,
    date: '2026-06-24',
    title: 'Accessoires partagés',
    content:
      "Une nouvelle page « Accessoires » (menu Réservations) permet de suivre le matériel qu'on se prête, comme la sellette Kinder.<br><br>Vous pouvez aussi laisser des notes datées et signées (ex. « chez moi à Corenc ») pour que tout le monde sache où elle se trouve.",
  },
  {
    version: 3,
    date: '2026-04-27',
    title: 'Notes sur les packs',
    content:
      "Vous pouvez désormais ajouter des notes sur les packs (bouton ✏️ en bas à droite). Ces notes apparaissent dans le carnet de vol du pack, avec la date et l'auteur.<br><br>Les commentaires à la clôture d'une réservation sont désormais aussi affichés comme des notes dans le carnet de vol.",
  },
  {
    version: 2,
    date: '2025-04-23',
    title: 'Lien cliquable depuis le planning',
    content:
      "Vous pouvez désormais faire une demande de réservation directement depuis le planning en cliquant sur un biplace.<br><br>Un formulaire pré-rempli avec la date et le biplace sélectionnés s'ouvrira pour faciliter votre réservation. Il vous faudra rajouter les autres biplaces désirés le cas échéant.",
  },
  {
    version: 1,
    date: '2025-03-01',
    title: 'Lancement de la plateforme',
    content: 'Bienvenue sur la plateforme de réservation de biplaces !',
  },
];

const CURRENT_VERSION = Math.max(...NEWS.map((n) => n.version));

export const useNews = () => {
  const { value: lastSeenVersion, setValue: setLastSeenVersion } = useLocalStorage<number>(
    'news-last-seen-version',
    0,
  );

  const hasNewsToShow = computed(() => lastSeenVersion.value < CURRENT_VERSION);

  const markAsSeen = () => {
    setLastSeenVersion(CURRENT_VERSION);
  };

  return {
    news: NEWS,
    currentVersion: CURRENT_VERSION,
    hasNewsToShow,
    lastSeenVersion,
    markAsSeen,
  };
};
