import { useState, useRef, useCallback } from 'react';

export const useWebRTC = () => {
  const [isAudioConnected, setIsAudioConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const localStreamRef = useRef<MediaStream | null>(null);

  const startAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      setIsAudioConnected(true);
    } catch (err) {
      console.error('Failed to access microphone:', err);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setIsAudioConnected(false);
    }
  }, []);

  return {
    isAudioConnected,
    isMuted,
    startAudio,
    toggleMute,
    stopAudio,
  };
};