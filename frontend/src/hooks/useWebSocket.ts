import { useEffect, useRef, useState, useCallback } from 'react';

export const useWebSocket = (sessionId: string, clientType: 'traveler' | 'expert') => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastError, setLastError] = useState<Event | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `ws://localhost:8000/ws/session/${sessionId}?client_type=${clientType}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setLastError(null);
      setIsConnected(true);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = (event) => {
      setLastError(event);
    };

    return () => {
      ws.close();
    };
  }, [sessionId, clientType]);

  const sendMessage = useCallback((data: Record<string, unknown>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, lastError, sendMessage, wsRef };
};
