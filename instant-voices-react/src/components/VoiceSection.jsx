import React from 'react';
import { User, Mic } from 'lucide-react';

const VoiceSection = ({ title, type, action, children }) => {
    const getIcon = () => {
        if (type === 'male') return <User size={28} />;
        if (type === 'female') return <User size={28} />;
        return <Mic size={28} />;
    };

    const getIconClass = () => {
        if (type === 'male') return 'male-icon';
        if (type === 'female') return 'female-icon';
        return 'custom-icon';
    };

    return (
        <section className={`voice-section ${type}-section`}>
            <div className="section-header">
                <div className={`gender-icon ${getIconClass()}`}>
                    {getIcon()}
                </div>
                <h2>{title}</h2>
                {action && <div className="section-actions">{action}</div>}
            </div>
            <div className="voice-cards">
                {children}
            </div>
        </section>
    );
};

export default VoiceSection;
