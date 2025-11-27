import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { 
  saveVoice as saveVoiceToBackend, 
  getUserVoices, 
  deleteVoice as deleteVoiceFromBackend 
} from '../services/voiceService';

export const useCustomVoices = () => {
    const { userId } = useAuth();
    const [customVoices, setCustomVoices] = useState({});
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // Load voices from Backend when user is authenticated
    useEffect(() => {
        if (!userId) return;

        const loadVoices = async () => {
            try {
                setLoading(true);
                const voices = await getUserVoices(userId);
                setCustomVoices(voices);
            } catch (error) {
                console.error('Error loading voices from Backend:', error);
                // Fallback to localStorage
                try {
                    const stored = localStorage.getItem('customVoices');
                    if (stored) {
                        setCustomVoices(JSON.parse(stored));
                    }
                } catch (e) {
                    console.error('Error loading from localStorage:', e);
                }
            } finally {
                setLoading(false);
            }
        };

        loadVoices();
    }, [userId]);

    const saveVoice = async (dialogueId, file) => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            setSyncing(true);

            // Prepare metadata
            const existingVoice = customVoices[dialogueId];
            const metadata = {
                id: dialogueId,
                type: file.type,
                name: file.name,
                size: file.size,
                lastModified: file.lastModified,
                ...(existingVoice?.isCustom && {
                    text: existingVoice.text,
                    translation: existingVoice.translation,
                    isCustom: true
                })
            };

            // Save to Backend
            const savedVoice = await saveVoiceToBackend(userId, metadata, file);

            // Update local state
            const updatedVoices = { 
                ...customVoices, 
                [dialogueId]: savedVoice 
            };
            setCustomVoices(updatedVoices);

            // Also save to localStorage as backup
            try {
                localStorage.setItem('customVoices', JSON.stringify(updatedVoices));
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
            }

            return savedVoice;
        } catch (error) {
            console.error('Error saving voice:', error);
            throw error;
        } finally {
            setSyncing(false);
        }
    };

    const createVoice = async (text, translation, file) => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            setSyncing(true);

            const id = Date.now().toString();

            // Prepare metadata
            const metadata = {
                id,
                text,
                translation,
                isCustom: true,
                type: file.type,
                name: file.name,
                size: file.size,
                lastModified: file.lastModified
            };

            // Save to Backend
            const savedVoice = await saveVoiceToBackend(userId, metadata, file);

            // Update local state
            const updatedVoices = { 
                ...customVoices, 
                [id]: savedVoice 
            };
            setCustomVoices(updatedVoices);

            // Also save to localStorage as backup
            try {
                localStorage.setItem('customVoices', JSON.stringify(updatedVoices));
            } catch (e) {
                console.warn('Could not save to localStorage:', e);
            }

            return savedVoice;
        } catch (error) {
            console.error('Error creating voice:', error);
            throw error;
        } finally {
            setSyncing(false);
        }
    };

    const deleteVoice = async (dialogueId) => {
        if (!userId) {
            throw new Error('User not authenticated');
        }

        try {
            setSyncing(true);

            // Delete from Backend
            await deleteVoiceFromBackend(userId, dialogueId);

            // Update local state
            const updatedVoices = { ...customVoices };
            delete updatedVoices[dialogueId];
            setCustomVoices(updatedVoices);

            // Update localStorage
            try {
                localStorage.setItem('customVoices', JSON.stringify(updatedVoices));
            } catch (e) {
                console.warn('Could not update localStorage:', e);
            }
        } catch (error) {
            console.error('Error deleting voice:', error);
            throw error;
        } finally {
            setSyncing(false);
        }
    };

    return { 
        customVoices, 
        saveVoice, 
        createVoice, 
        deleteVoice,
        loading,
        syncing
    };
};
