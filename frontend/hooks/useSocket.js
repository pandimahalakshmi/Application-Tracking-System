import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function useSocket(userId, onStatusUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current.emit('join', userId);

    socketRef.current.on('statusUpdate', (data) => {
      if (onStatusUpdate) onStatusUpdate(data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  return socketRef.current;
}
