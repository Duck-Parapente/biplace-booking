export const useApi = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();

  const callApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = await getAccessToken();
    const backendUrl = config.public.backendDomain;

    const response = await fetch(`${backendUrl}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  };

  return { callApi };
};
