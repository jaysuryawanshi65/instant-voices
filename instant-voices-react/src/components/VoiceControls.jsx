import React from 'react';

const VoiceControls = ({ pitch, setPitch, speed, setSpeed, onReset }) => {
    const handlePitchChange = (e) => {
        e.stopPropagation();
        setPitch(parseFloat(e.target.value));
    };

    const handleSpeedChange = (e) => {
        e.stopPropagation();
        setSpeed(parseFloat(e.target.value));
    };

    const handleResetClick = (e) => {
        e.stopPropagation();
        onReset();
    };

    return (
        <div className="voice-controls">
            <div className="voice-control-group">
                <div className="voice-control-label">
                    <span className="voice-control-name">🎵 Pitch</span>
                    <span className="voice-control-value">{pitch.toFixed(1)}x</span>
                </div>
                <input 
                    type="range" 
                    className="voice-control-slider" 
                    min="0.5" 
                    max="2.0" 
                    step="0.1" 
                    value={pitch}
                    onChange={handlePitchChange}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                />
            </div>
            <div className="voice-control-group">
                <div className="voice-control-label">
                    <span className="voice-control-name">⚡ Speed</span>
                    <span className="voice-control-value">{speed.toFixed(1)}x</span>
                </div>
                <input 
                    type="range" 
                    className="voice-control-slider" 
                    min="0.5" 
                    max="2.0" 
                    step="0.1" 
                    value={speed}
                    onChange={handleSpeedChange}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                />
            </div>
            <button className="voice-control-reset" onClick={handleResetClick}>
                Reset to Default
            </button>
        </div>
    );
};

export default VoiceControls;
