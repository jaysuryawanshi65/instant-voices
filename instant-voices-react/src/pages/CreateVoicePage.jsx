import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Mic, FileAudio, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateVoicePage = ({ onCreate }) => {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [translation, setTranslation] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (selectedFile) => {
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

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
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
            navigate('/');
        } catch (error) {
            alert(error.message || 'Error creating voice');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-voice-page">
            <div className="background-gradient"></div>
            
            <div className="create-voice-container">
                <button className="back-button" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} />
                    <span>Back to Voices</span>
                </button>

                <div className="create-voice-header">
                    <div className="header-icon">
                        <Sparkles size={32} />
                    </div>
                    <h1>Create Custom Voice</h1>
                    <p>Upload your own audio and create a personalized voice dialogue</p>
                </div>

                <form onSubmit={handleSubmit} className="create-voice-form-page">
                    <div className="form-section">
                        <div className="form-group-page">
                            <label htmlFor="voice-text">
                                <Mic size={18} />
                                Dialogue Text
                            </label>
                            <input 
                                type="text" 
                                id="voice-text" 
                                value={text} 
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter the dialogue text..."
                                className="text-input"
                                required
                            />
                            <span className="input-hint">This is the main text that will be displayed</span>
                        </div>
                        
                        <div className="form-group-page">
                            <label htmlFor="voice-translation">
                                <FileAudio size={18} />
                                Translation (Optional)
                            </label>
                            <input 
                                type="text" 
                                id="voice-translation" 
                                value={translation} 
                                onChange={(e) => setTranslation(e.target.value)}
                                placeholder="Enter translation or description..."
                                className="text-input"
                            />
                            <span className="input-hint">Add a translation or additional context</span>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="form-group-page">
                            <label>
                                <Upload size={18} />
                                Audio File
                            </label>
                            <div 
                                className={`file-upload-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
                                onClick={() => fileInputRef.current.click()}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={(e) => handleFileChange(e.target.files[0])}
                                    accept="audio/*,video/mp4"
                                    style={{ display: 'none' }}
                                />
                                <div className="upload-content">
                                    {file ? (
                                        <>
                                            <FileAudio size={48} className="file-icon" />
                                            <div className="file-info">
                                                <span className="file-name">{file.name}</span>
                                                <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                            </div>
                                            <button 
                                                type="button" 
                                                className="change-file-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setFile(null);
                                                }}
                                            >
                                                Change File
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={48} className="upload-icon" />
                                            <div className="upload-text">
                                                <span className="upload-title">Drop your audio file here</span>
                                                <span className="upload-subtitle">or click to browse</span>
                                            </div>
                                            <span className="upload-formats">Supports: MP3, WAV, OGG, MP4 (Max 10MB)</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="cancel-btn" 
                            onClick={() => navigate('/')}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={isSubmitting || !text || !file}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="spinner" />
                                    Creating Voice...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Create Voice
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateVoicePage;
