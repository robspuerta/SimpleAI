import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface EventLogData {
  event: string;
  element: string;
  data?: Record<string, any>;
}

export function useEventLogger() {
  const mutation = useMutation({
    mutationFn: async (eventData: EventLogData) => {
      const payload = {
        ...eventData,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        url: window.location.href,
      };
      
      const response = await apiRequest("POST", "/api/events/log", payload);
      return response.json();
    },
    onError: (error) => {
      console.error("Failed to log event:", error);
    },
  });

  const logEvent = (event: string, element: string, data?: Record<string, any>) => {
    mutation.mutate({ event, element, data });
  };

  return { logEvent };
}
