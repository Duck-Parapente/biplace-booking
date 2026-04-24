export const useApi = () => {
  const config = useRuntimeConfig();
  const { getAccessToken } = useAuth();

  const fetchApi = async <T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true,
  ): Promise<T> => {
    const backendUrl = config.public.backendDomain;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge existing headers
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers[key] = value;
        }
      });
    }

    if (includeAuth) {
      const token = await getAccessToken();
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${backendUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = response.statusText;

      // Try to parse JSON error response
      try {
        const errorData = await response.json();
        // Prefer French label, then message, then full error object
        errorMessage = errorData.label || errorData.message || JSON.stringify(errorData, null, 2);
      } catch {
        // If not JSON, keep the default message
      }

      if (errorMessage.toLowerCase() === 'internal server error') {
        errorMessage = 'Une erreur inattendue est survenue. Réessaie plus tard.';
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  };

  const callApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    return fetchApi<T>(endpoint, options, true);
  };

  const callPublicApi = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    return fetchApi<T>(endpoint, options, false);
  };

  return { callApi, callPublicApi };
};
