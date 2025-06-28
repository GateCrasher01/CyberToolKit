import { toast } from "sonner";

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status?: number;
}

const API_BASE_URL = "http://localhost:5000"; 

async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      try {
        const errorData = await response.json();
        return { error: errorData.message || `HTTP error ${response.status}`, status: response.status };
      } catch (e) {
        return { error: `HTTP error ${response.status}`, status: response.status };
      }
    }

    if (response.status === 204) {
      return { data: {} as T, status: response.status };
    }

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error("API request failed:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return {
        error: "Cannot connect to the backend server. Please ensure that:\n1. Your Python backend is running on http://localhost:5000\n2. CORS is properly configured on your backend\n3. There are no network issues between frontend and backend",
        status: 0
      };
    }
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        error: "Request timed out. The backend server is not responding.",
        status: 0
      };
    }
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: 0
    };
  }
}

export const api = {
  async trackIp(ip: string): Promise<ApiResponse<any>> {
    return fetchWithErrorHandling("/api/track/ip", {
      method: "POST",
      body: JSON.stringify({ ip }),
    });
  },

  async getIpThreatIntelligence(ip: string): Promise<ApiResponse<any>> {
    return fetchWithErrorHandling("/api/threat/ip", {
      method: "POST",
      body: JSON.stringify({ ip }),
    });
  },

  async checkDarkWebForIp(ip: string): Promise<ApiResponse<any>> {
    return fetchWithErrorHandling("/api/darkweb/ip", {
      method: "POST",
      body: JSON.stringify({ ip }),
    });
  },

  async trackPhone(phoneNumber: string): Promise<ApiResponse<any>> {
    return fetchWithErrorHandling("/api/track/phone", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
  },

  async getPhoneReputation(phoneNumber: string): Promise<ApiResponse<any>> {
    return fetchWithErrorHandling("/api/phone/reputation", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
  },

  async trackUsername(username: string): Promise<ApiResponse<any>> {
    return fetchWithErrorHandling("/api/track/username", {
      method: "POST",
      body: JSON.stringify({ username }),
    });
  },

  async getCurrentIp(): Promise<ApiResponse<{ ip: string }>> {
    return fetchWithErrorHandling("/api/my-ip");
  },

  async initiateFileSend(host: string, port: number, password: string): Promise<ApiResponse<{ sessionId: string }>> {
    return fetchWithErrorHandling("/api/file/prepare-send", {
      method: "POST",
      body: JSON.stringify({ host, port, password }),
    });
  },

  async uploadFile(sessionId: string, file: File): Promise<ApiResponse<{ success: boolean }>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sessionId", sessionId);
    
    return fetch(`${API_BASE_URL}/api/file/upload`, {
      method: "POST",
      body: formData,
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.message || `HTTP error ${response.status}` };
      }
      return { data: await response.json() };
    }).catch(error => {
      console.error("File upload failed:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    });
  },

  async prepareFileReceive(port: number, password: string): Promise<ApiResponse<{ success: boolean }>> {
    return fetchWithErrorHandling("/api/file/prepare-receive", {
      method: "POST",
      body: JSON.stringify({ port, password }),
    });
  },

  async checkFileIntegrity(file: File): Promise<ApiResponse<any>> {
    const formData = new FormData();
    formData.append("file", file);
    
    return fetch(`${API_BASE_URL}/api/file/check-integrity`, {
      method: "POST",
      body: formData,
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.message || `HTTP error ${response.status}` };
      }
      return { data: await response.json() };
    }).catch(error => {
      console.error("File integrity check failed:", error);
      return {
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    });
  },
};

export const handleApiResponse = async <T,>(
  apiCall: Promise<ApiResponse<T>>,
  {
    loadingMessage = "Processing...",
    successMessage = "Operation successful",
    errorMessage = "Operation failed",
    onSuccess,
    onError,
  }: {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: (data: T) => void;
    onError?: (error: string, status?: number) => void;
  }
): Promise<void> => {
  const toastId = toast.loading(loadingMessage);
  
  try {
    const response = await apiCall;
    
    if (response.error) {
      let detailedError = response.error;
      
      if (response.status === 0) {
        toast.error(`${errorMessage}: ${detailedError}`, { id: toastId, duration: 5000 });
        onError?.(response.error, response.status);
      } else {
        toast.error(`${errorMessage}: ${detailedError}`, { id: toastId });
        onError?.(response.error, response.status);
      }
    } else if (response.data) {
      toast.success(successMessage, { id: toastId });
      onSuccess?.(response.data);
    }
  } catch (error) {
    toast.error(errorMessage, { id: toastId });
    onError?.(error instanceof Error ? error.message : "Unknown error", 0);
  }
};
