import React, { useState, useRef, useEffect } from 'react';
import {
    FaMicrophone,
    FaStop,
    FaUpload,
    FaFileAudio,
    FaClipboardCheck,
    FaNotesMedical,
    FaClock,
    FaCheckCircle,
} from 'react-icons/fa';
import { transcribeAudio } from '../services/api';
import Spinner from '../components/Spinner';
import './ScribePage.css';

const ScribePage = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioFile, setAudioFile] = useState(null);
    const [soapNotes, setSoapNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saved, setSaved] = useState(false);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    // Timer
    useEffect(() => {
        if (isRecording) {
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRecording]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
                setAudioFile(file);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingTime(0);
            setSoapNotes('');
            setSaved(false);
            setError('');
        } catch (err) {
            setError('Microphone access denied. Please allow microphone permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioFile(file);
            setSoapNotes('');
            setSaved(false);
            setError('');
        }
    };

    const handleTranscribe = async () => {
        if (!audioFile) {
            setError('Please record or upload an audio file first.');
            return;
        }
        setLoading(true);
        setError('');
        setSoapNotes('');

        try {
            const data = await transcribeAudio(audioFile);
            setSoapNotes(data.soapNotes);
        } catch (err) {
            setError('Failed to transcribe audio. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    // Parse SOAP notes into sections
    const parseSoap = (notes) => {
        const sections = { Subjective: '', Objective: '', Assessment: '', Plan: '' };
        let currentKey = '';

        notes.split('\n').forEach((line) => {
            const upper = line.trim().toUpperCase();
            if (upper.startsWith('SUBJECTIVE')) currentKey = 'Subjective';
            else if (upper.startsWith('OBJECTIVE')) currentKey = 'Objective';
            else if (upper.startsWith('ASSESSMENT')) currentKey = 'Assessment';
            else if (upper.startsWith('PLAN')) currentKey = 'Plan';
            else if (currentKey && line.trim()) {
                sections[currentKey] += (sections[currentKey] ? '\n' : '') + line.trim();
            }
        });

        return sections;
    };

    const soapSections = soapNotes ? parseSoap(soapNotes) : null;

    return (
        <div className="scribe-page">
            <div className="page-header">
                <h1>🎙️ Ambient Scribe</h1>
                <p>Record or upload doctor-patient conversations and generate structured SOAP notes</p>
            </div>

            <div className="split-layout">
                {/* Left: Audio Controls */}
                <div className="card scribe-audio-card">
                    <div className="card-header">
                        <div className="icon" style={{ background: 'linear-gradient(135deg, #7b1fa2, #ce93d8)' }}>
                            <FaFileAudio />
                        </div>
                        <h3>Audio Input</h3>
                    </div>

                    {/* Recording Section */}
                    <div className="recording-section">
                        <div className={`recording-indicator ${isRecording ? 'recording-active' : ''}`}>
                            <div className="recording-dot"></div>
                            <FaMicrophone className="recording-mic-icon" />
                        </div>

                        <div className="recording-timer">
                            <FaClock />
                            <span>{formatTime(recordingTime)}</span>
                        </div>

                        <div className="recording-controls">
                            {!isRecording ? (
                                <button className="btn btn-primary" onClick={startRecording}>
                                    <FaMicrophone /> Start Recording
                                </button>
                            ) : (
                                <button className="btn btn-danger" onClick={stopRecording}>
                                    <FaStop /> Stop Recording
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="scribe-divider">
                        <span>OR</span>
                    </div>

                    {/* File Upload */}
                    <div className="upload-section">
                        <label className="upload-area" htmlFor="audio-upload">
                            <FaUpload />
                            <span>{audioFile ? audioFile.name : 'Click to upload .wav file'}</span>
                            <input
                                id="audio-upload"
                                type="file"
                                accept=".wav,audio/*"
                                onChange={handleFileUpload}
                                hidden
                            />
                        </label>
                    </div>

                    {audioFile && (
                        <div className="audio-file-badge">
                            <FaFileAudio />
                            <span>{audioFile.name}</span>
                            <span className="audio-file-size">
                                ({(audioFile.size / 1024).toFixed(1)} KB)
                            </span>
                        </div>
                    )}

                    {error && <div className="error-message">{error}</div>}

                    <button
                        className="btn btn-primary btn-transcribe"
                        onClick={handleTranscribe}
                        disabled={loading || !audioFile}
                    >
                        <FaNotesMedical />
                        {loading ? 'Generating Notes...' : 'Generate SOAP Notes'}
                    </button>
                </div>

                {/* Right: Notes Preview */}
                <div className="scribe-notes-area">
                    {loading && <Spinner message="AI is generating SOAP notes..." />}

                    {soapSections && !loading && (
                        <div className="card scribe-notes-card">
                            <div className="card-header">
                                <div className="icon" style={{ background: 'linear-gradient(135deg, #2e7d32, #66bb6a)' }}>
                                    <FaClipboardCheck />
                                </div>
                                <h3>SOAP Notes</h3>
                            </div>

                            <div className="soap-sections">
                                {Object.entries(soapSections).map(([key, value]) => (
                                    <div key={key} className="soap-section">
                                        <h4 className="soap-section-title">
                                            <span className="soap-letter">{key[0]}</span>
                                            {key}
                                        </h4>
                                        <div className="soap-section-content">
                                            {value.split('\n').map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="soap-actions">
                                <button className="btn btn-success" onClick={handleSave}>
                                    {saved ? <><FaCheckCircle /> Saved!</> : <><FaClipboardCheck /> Approve & Save</>}
                                </button>
                                <button className="btn btn-outline" onClick={() => { setSoapNotes(''); setAudioFile(null); setRecordingTime(0); }}>
                                    New Recording
                                </button>
                            </div>
                        </div>
                    )}

                    {!soapSections && !loading && (
                        <div className="card scribe-empty-state">
                            <FaNotesMedical className="empty-icon" />
                            <h3>No Notes Generated</h3>
                            <p>Record a conversation or upload an audio file, then click "Generate SOAP Notes".</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScribePage;
