interface NewsEntry {
  version: number;
  date: string;
  title: string;
  content: string;
}

const NEWS: NewsEntry[] = [
  {
    version: 2,
    date: '2025-04-23',
    title: 'Lien cliquable depuis le planning',
    content:
      "Vous pouvez désormais faire une demande de réservation directement depuis le planning en cliquant sur un biplace. Un formulaire pré-rempli avec la date et le biplace sélectionnés s'ouvrira pour faciliter votre réservation. Il vous faudra rajouter les autres biplaces désirés le cas échéant.",
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
