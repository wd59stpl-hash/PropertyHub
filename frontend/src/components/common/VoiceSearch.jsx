import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const VoiceSearch = ({ onResult }) => {
    const [isListening, setIsListening] = useState(false);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-IN';
    recognition.interimResults = false;

    const handleListen = () => {
        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            try {
                recognition.start();
            } catch (err) {
                console.error("Speech error:", err);
            }
        }
    };

    recognition.onstart = () => {
        setIsListening(true);
        toast("Listening...", { icon: '🎙️', duration: 1000 });
    };

    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
            toast.error("Please allow Mic access");
        }
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
    };

    return (
        <button
            type="button"
            onClick={handleListen}
            className={`p-2 rounded-xl transition-all duration-300 ${isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
            title="Search by voice"
        >
            {isListening ? <Loader2 className="animate-spin" size={20} /> : <Mic size={20} />}
        </button>
    );
};

export default VoiceSearch;