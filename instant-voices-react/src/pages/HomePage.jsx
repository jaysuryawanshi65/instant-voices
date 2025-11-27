import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import VoiceSection from '../components/VoiceSection';
import VoiceCard from '../components/VoiceCard';
import CustomVoiceCard from '../components/CustomVoiceCard';
import { dialogues as defaultDialogues } from '../data/dialogues';
import { useCustomVoices } from '../hooks/useCustomVoices';

const HomePage = () => {
    const navigate = useNavigate();
    const { customVoices, saveVoice, deleteVoice } = useCustomVoices();
    const [activeTab, setActiveTab] = useState('custom');

    // Merge default dialogues with dynamic custom voices
    const allCustomDialogues = [
        ...defaultDialogues,
        ...Object.values(customVoices)
            .filter(v => v.isCustom)
            .map(v => ({
                id: v.id,
                text: v.text,
                translation: v.translation
            }))
    ];

    return (
        <>
            <div className="background-gradient"></div>
            <div className="container">
                <Header />
                
                {/* Tab Navigation */}
                <div className="tabs-container">
                    <button 
                        className={`tab-button ${activeTab === 'custom' ? 'active' : ''}`}
                        onClick={() => setActiveTab('custom')}
                    >
                        Custom Voices
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'male' ? 'active' : ''}`}
                        onClick={() => setActiveTab('male')}
                    >
                        Male Voices
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'female' ? 'active' : ''}`}
                        onClick={() => setActiveTab('female')}
                    >
                        Female Voices
                    </button>
                </div>

                <div className="voice-sections">
                    {/* Custom Voices Section */}
                    {activeTab === 'custom' && (
                        <VoiceSection 
                            title="Custom Voices" 
                            type="custom"
                            action={
                                <button 
                                    className="add-voice-btn"
                                    onClick={() => navigate('/create')}
                                >
                                    <Plus size={18} />
                                    <span>Create New</span>
                                </button>
                            }
                        >
                            {allCustomDialogues.map(dialogue => (
                                <CustomVoiceCard 
                                    key={dialogue.id} 
                                    dialogue={dialogue}
                                    customVoice={customVoices[dialogue.id]}
                                    onSave={saveVoice}
                                    onDelete={deleteVoice}
                                />
                            ))}
                        </VoiceSection>
                    )}

                    {/* Male Voices Section */}
                    {activeTab === 'male' && (
                        <VoiceSection title="Male Voice" type="male">
                            {defaultDialogues.map(dialogue => (
                                <VoiceCard 
                                    key={dialogue.id} 
                                    dialogue={dialogue} 
                                    gender="male" 
                                />
                            ))}
                        </VoiceSection>
                    )}

                    {/* Female Voices Section */}
                    {activeTab === 'female' && (
                        <VoiceSection title="Female Voice" type="female">
                            {defaultDialogues.map(dialogue => (
                                <VoiceCard 
                                    key={dialogue.id} 
                                    dialogue={dialogue} 
                                    gender="female" 
                                />
                            ))}
                        </VoiceSection>
                    )}
                </div>
            </div>
        </>
    );
};

export default HomePage;
