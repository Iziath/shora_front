/**
 * Service API pour communiquer avec le backend MongoDB
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface User {
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Stocke le token dans localStorage
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Récupère le token depuis localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Supprime le token
 */
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

/**
 * Effectue une requête API avec authentification
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    }).catch((fetchError: any) => {
      // Intercepter l'erreur fetch avant qu'elle ne soit loggée par le navigateur
      const isConnectionError = fetchError.message?.includes('Failed to fetch') || 
                              fetchError.message?.includes('ERR_CONNECTION_REFUSED') ||
                              fetchError.message?.includes('ERR_CONNECTION_CLOSED') ||
                              fetchError.message?.includes('NetworkError') ||
                              fetchError.name === 'TypeError';
      
      if (isConnectionError) {
        // Retourner une réponse d'erreur personnalisée au lieu de throw
        return {
          ok: false,
          json: async () => ({ 
            success: false, 
            error: 'Backend non disponible. Le serveur peut être en veille ou non démarré. URL: ' + API_URL 
          })
        } as Response;
      }
      throw fetchError;
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Une erreur est survenue',
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error: any) {
    // Gérer spécifiquement les erreurs de connexion
    // Ne pas logger ces erreurs dans la console car elles polluent quand le backend n'est pas démarré
    const isConnectionError = error.message?.includes('Failed to fetch') || 
                            error.message?.includes('ERR_CONNECTION_REFUSED') ||
                            error.message?.includes('ERR_CONNECTION_CLOSED') ||
                            error.message?.includes('NetworkError') ||
                            error.name === 'TypeError';
    
    if (isConnectionError) {
      // Retourner silencieusement l'erreur sans la logger
      return {
        success: false,
        error: 'Backend non disponible. Le serveur peut être en veille ou non démarré. URL: ' + API_URL,
      };
    }
    
    // Pour les autres erreurs, les logger normalement
    console.error('API Error:', error);
    return {
      success: false,
      error: error.message || 'Erreur de connexion au serveur',
    };
  }
};

/**
 * Connexion
 */
export const login = async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.success && response.data?.token) {
    setAuthToken(response.data.token);
  }

  return response;
};

/**
 * Vérifier le token
 */
export const verifyToken = async (): Promise<ApiResponse<User>> => {
  const token = getAuthToken();
  // Ne pas faire d'appel si aucun token n'existe
  if (!token) {
    return {
      success: false,
      error: 'No token found',
    };
  }
  return apiRequest<User>('/api/auth/verify');
};

/**
 * Déconnexion
 */
export const logout = async (): Promise<void> => {
  await apiRequest('/api/auth/logout', {
    method: 'POST',
  });
  removeAuthToken();
};

