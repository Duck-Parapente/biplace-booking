export const usePageTitle = () => {
  const pageTitle = useState<string>('pageTitle', () => 'Biplace Duckparapente');

  const setPageTitle = (title: string) => {
    pageTitle.value = title;
  };

  return {
    pageTitle: readonly(pageTitle),
    setPageTitle,
  };
};
