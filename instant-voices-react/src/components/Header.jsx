import React from 'react';
import { Mic, Volume2 } from 'lucide-react';

const Header = () => {
    return (
        <header className="header">
            <div className="logo-container">
                <div className="logo-icon">
                    <Mic size={28} />
                </div>
                <div className="logo-icon" style={{ animationDelay: '1s' }}>
                    <Volume2 size={28} />
                </div>
            </div>
            <h1>Instant Voices</h1>
            <p className="subtitle">Professional Indian Voice Samples</p>
            
            <div className="background-play-badge">
                <Volume2 size={20} />
                <span>Background Play Enabled</span>
            </div>
        </header>
    );
};

export default Header;
