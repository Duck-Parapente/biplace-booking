export const usePageTitle = () => {
  const route = useRoute();

  const pageTitle = computed(() => {
    return (route.meta.pageTitle as string) || 'Biplace';
  });

  return {
    pageTitle,
  };
};
