import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useVoice = (onTranscript) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const start = useCallback(() => {
    if (!isSupported) { toast.error('Voice not supported in this browser'); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) => {
      let final = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t; else interim += t;
      }
      const combined = transcript + final;
      setTranscript(combined + interim);
      if (final && onTranscript) onTranscript(combined);
    };
    recognition.onerror = (e) => { if (e.error !== 'no-speech') toast.error('Voice error'); setListening(false); };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, transcript, onTranscript]);

  const stop = useCallback(() => { recognitionRef.current?.stop(); setListening(false); }, []);
  const clear = useCallback(() => setTranscript(''), []);

  return { listening, transcript, start, stop, clear, isSupported };
};