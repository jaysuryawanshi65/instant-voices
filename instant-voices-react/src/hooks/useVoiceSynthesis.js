import { useState, useEffect, useRef } from 'react';
import { voiceTypes } from '../data/voiceTypes';

export const useVoiceSynthesis = (text, gender, voiceType, customPitch, customSpeed) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const utteranceRef = useRef(null);

    useEffect(() => {
        // Pre-load voices
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        
        loadVoices();
        
        if ('onvoiceschanged' in window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const play = () => {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        // Get available voices
        const voices = window.speechSynthesis.getVoices();
        
        // Select voice
        if (voices.length > 0) {
            // Filter for English voices
            let voicePool = voices.filter(v => v.lang.startsWith('en'));
            if (voicePool.length === 0) voicePool = voices;
            
            // Filter by gender
            if (gender === 'female') {
                const femaleVoices = voicePool.filter(v => 
                    v.name.toLowerCase().includes('female') ||
                    v.name.toLowerCase().includes('woman') ||
                    !v.name.toLowerCase().includes('male')
                );
                if (femaleVoices.length > 0) voicePool = femaleVoices;
            } else {
                const maleVoices = voicePool.filter(v => 
                    v.name.toLowerCase().includes('male') ||
                    v.name.toLowerCase().includes('man')
                );
                if (maleVoices.length > 0) voicePool = maleVoices;
            }
            
            // Select voice
            const voiceIndex = Object.keys(voiceTypes).indexOf(voiceType) % voicePool.length;
            utterance.voice = voicePool[voiceIndex] || voicePool[0];
        }
        
        // Apply settings
        const typeSettings = voiceTypes[voiceType] || voiceTypes.normal;
        utterance.rate = customSpeed;
        const genderPitchModifier = gender === 'female' ? 1.2 : 0.85;
        utterance.pitch = customPitch * genderPitchModifier;
        utterance.volume = typeSettings.volume;
        
        // Event handlers
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        // Speak
        window.speechSynthesis.speak(utterance);
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    };

    return { isPlaying, play, stop };
};
