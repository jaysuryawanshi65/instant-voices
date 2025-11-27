import api from './api';

/**
 * Get all voices for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Object of voice objects
 */
export const getUserVoices = async (userId) => {
  try {
    const response = await api.get('/voices', { params: { userId } });
    return response.data;
  } catch (error) {
    console.error('Error getting user voices:', error);
    throw error;
  }
};

/**
 * Save a voice (upload file + save metadata)
 * @param {string} userId - User ID
 * @param {Object} voiceData - Voice metadata (id, text, translation, etc.)
 * @param {File} file - Audio file (optional if just updating metadata)
 * @returns {Promise<Object>} Saved voice object
 */
export const saveVoice = async (userId, voiceData, file) => {
  try {
    const formData = new FormData();
    formData.append('userId', userId);
    
    // Append all voice data fields
    Object.keys(voiceData).forEach(key => {
      formData.append(key, voiceData[key]);
    });

    if (file) {
      formData.append('file', file);
    }

    const response = await api.post('/voices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error saving voice:', error);
    throw error;
  }
};

/**
 * Delete a voice
 * @param {string} userId - User ID
 * @param {string} voiceId - Voice ID
 */
export const deleteVoice = async (userId, voiceId) => {
  try {
    await api.delete(`/voices/${voiceId}`, { params: { userId } });
  } catch (error) {
    console.error('Error deleting voice:', error);
    throw error;
  }
};
