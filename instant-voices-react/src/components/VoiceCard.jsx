import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { voiceTypes } from '../data/voiceTypes';
import VoiceControls from './VoiceControls';
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';

const VoiceCard = ({ dialogue, gender }) => {
    const [selectedVoiceType, setSelectedVoiceType] = useState('normal');
    const [pitch, setPitch] = useState(1.0);
    const [speed, setSpeed] = useState(1.0);
    
    const { isPlaying, play, stop } = useVoiceSynthesis(
        dialogue.text, 
        gender, 
        selectedVoiceType, 
        pitch, 
        speed
    );

    const handleReset = () => {
        setPitch(1.0);
        setSpeed(1.0);
    };

    const togglePlay = (e) => {
        e.stopPropagation();
        if (isPlaying) {
            stop();
        } else {
            play();
        }
    };

    return (
        <div className={`voice-card ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
            <div className="card-header">
                <span className="card-number">#{dialogue.id}</span>
                <button className={`play-button ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
            </div>
            
            <div className="dialogue-text">{dialogue.text}</div>
            <div className="dialogue-translation">{dialogue.translation}</div>
            
            <div className="voice-type-selector" onClick={(e) => e.stopPropagation()}>
                {Object.entries(voiceTypes).map(([key, type]) => (
                    <button 
                        key={key}
                        className={`voice-type-btn ${selectedVoiceType === key ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedVoiceType(key);
                            setPitch(type.pitch);
                            setSpeed(type.rate);
                        }}
                        title={type.name}
                    >
                        <span className="voice-type-icon">{type.icon}</span>
                        <span className="voice-type-label">{type.name}</span>
                    </button>
                ))}
            </div>
            
            <div onClick={(e) => e.stopPropagation()}>
                <VoiceControls 
                    pitch={pitch} 
                    setPitch={setPitch} 
                    speed={speed} 
                    setSpeed={setSpeed} 
                    onReset={handleReset} 
                />
            </div>
            
            <div className="waveform" style={{ opacity: isPlaying ? 1 : 0 }}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="waveform-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
            </div>
        </div>
    );
};

export default VoiceCard;
