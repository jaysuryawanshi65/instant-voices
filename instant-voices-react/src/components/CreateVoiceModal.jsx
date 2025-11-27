import React, { useState, useRef } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

const CreateVoiceModal = ({ isOpen, onClose, onCreate }) => {
    const [text, setText] = useState('');
    const [translation, setTranslation] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validation
            const validTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg', 'video/mp4', 'audio/mp4'];
            if (!validTypes.some(type => selectedFile.type.includes(type.replace('audio/', '').replace('video/', '')))) {
                alert('Please select a valid audio/video file (MP3, WAV, OGG, or MP4)');
                return;
            }

            if (selectedFile.size > 10 * 1024 * 1024) {
                alert('File is too large. Maximum size is 10MB.');
                return;
            }
            
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text || !file) {
            alert('Please provide text and an audio file.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onCreate(text, translation, file);
            onClose();
            // Reset form
            setText('');
            setTranslation('');
            setFile(null);
        } catch (error) {
            alert(error.message || 'Error creating voice');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Create Custom Voice</h2>
                    <button className="close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="create-voice-form">
                    <div className="form-group">
                        <label htmlFor="voice-text">Dialogue Text</label>
                        <input 
                            type="text" 
                            id="voice-text" 
                            value={text} 
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter dialogue text..."
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="voice-translation">Translation (Optional)</label>
                        <input 
                            type="text" 
                            id="voice-translation" 
                            value={translation} 
                            onChange={(e) => setTranslation(e.target.value)}
                            placeholder="Enter translation..."
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Audio File</label>
                        <div 
                            className={`file-upload-area ${file ? 'has-file' : ''}`}
                            onClick={() => fileInputRef.current.click()}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="audio/*,video/mp4"
                                style={{ display: 'none' }}
                            />
                            <div className="upload-placeholder">
                                <Upload size={24} />
                                <span>{file ? file.name : 'Click to upload audio'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="create-button" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="spinner" />
                                    Creating...
                                </>
                            ) : (
                                'Create Voice'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateVoiceModal;
