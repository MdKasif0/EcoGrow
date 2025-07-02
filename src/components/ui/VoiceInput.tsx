import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, onError, className }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') { // Simplified check
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = SpeechRecognitionAPI ? new SpeechRecognitionAPI() : null;

      if (!recognition) {
        onError?.('Speech recognition API is not available in this browser.');
        setRecognition(null); // Ensure state is null if API is not available
        return;
      }

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        onTranscript(transcript);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        onError?.(event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
      // No explicit else here, as the early return handles non-availability
    }

    return () => {
      if (recognition) { // recognition here is from the outer scope of useEffect, which is fine.
        recognition.stop();
      }
    };
  }, [onTranscript, onError, recognition]);

  const toggleListening = () => {
    if (!recognition) return; // recognition here refers to the state variable

    if (isListening) {
      recognition.stop();
      // setIsListening(false); // onend will handle this
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error("Error starting recognition:", e);
        onError?.("Failed to start voice input.");
      }
    }
  };

  // Determine if API is available for disabling button more accurately
  const isApiAvailable = typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleListening}
      className={className}
      disabled={!recognition || !isApiAvailable} // Check both state and API availability
    >
      {isListening ? (
        <MicOff className="h-4 w-4 text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceInput; 