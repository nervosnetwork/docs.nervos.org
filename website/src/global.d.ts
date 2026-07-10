declare interface Window {
  gtag?: (...args: any[]) => void;
  umami?: {
    track: (eventName: string, data?: Record<string, unknown>) => void;
  };
}
