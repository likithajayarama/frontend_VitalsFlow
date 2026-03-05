import React, { useState } from 'react';
import { FaHeartbeat, FaExclamationTriangle, FaCheckCircle, FaUserInjured } from 'react-icons/fa';
import { triagePatient } from '../services/api';
import Spinner from '../components/Spinner';
import './TriagePage.css';

const initialForm = {
    name: '',
    age: '',
    heartRate: '',
    oxygen: '',
    bloodPressure: '',
    symptoms: '',
};

const getRiskInfo = (score) => {
    if (score <= 2) return { level: 'Low Risk', color: 'success', icon: <FaCheckCircle /> };
    if (score === 3) return { level: 'Moderate Risk', color: 'warning', icon: <FaExclamationTriangle /> };
    return { level: 'High Risk', color: 'danger', icon: <FaExclamationTriangle /> };
};

const TriagePage = () => {
    const [form, setForm] = useState(initialForm);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setLoading(true);

        try {
            const payload = {
                name: form.name,
                age: Number(form.age),
                heartRate: Number(form.heartRate),
                oxygen: Number(form.oxygen),
                bloodPressure: form.bloodPressure,
                symptoms: form.symptoms,
            };
            const data = await triagePatient(payload);
            setResult(data);
        } catch (err) {
            setError('Failed to analyze patient. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const riskInfo = result ? getRiskInfo(result.riskScore) : null;

    return (
        <div className="triage-page">
            <div className="page-header">
                <h1>🚨 Smart ER Triage</h1>
                <p>Enter patient details to receive an AI-powered triage risk assessment</p>
            </div>

            {/* High-Risk Alert Banner */}
            {result && result.riskScore >= 4 && (
                <div className="alert-banner alert-banner--danger">
                    <FaExclamationTriangle />
                    <span><strong>CRITICAL ALERT:</strong> High-risk patient detected — {form.name}. Immediate attention required!</span>
                </div>
            )}

            <div className="triage-grid">
                {/* Intake Form */}
                <div className="card triage-form-card">
                    <div className="card-header">
                        <div className="icon" style={{ background: 'linear-gradient(135deg, #1565c0, #42a5f5)' }}>
                            <FaUserInjured />
                        </div>
                        <h3>Patient Intake Form</h3>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Patient Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="age">Age</label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    className="form-control"
                                    placeholder="Years"
                                    value={form.age}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max="150"
                                />
                            </div>
                        </div>

                        <div className="form-row form-row-3">
                            <div className="form-group">
                                <label htmlFor="heartRate">Heart Rate (bpm)</label>
                                <input
                                    id="heartRate"
                                    name="heartRate"
                                    type="number"
                                    className="form-control"
                                    placeholder="e.g. 80"
                                    value={form.heartRate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="oxygen">Oxygen Level (%)</label>
                                <input
                                    id="oxygen"
                                    name="oxygen"
                                    type="number"
                                    className="form-control"
                                    placeholder="e.g. 98"
                                    value={form.oxygen}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    max="100"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bloodPressure">Blood Pressure</label>
                                <input
                                    id="bloodPressure"
                                    name="bloodPressure"
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. 120/80"
                                    value={form.bloodPressure}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="symptoms">Symptoms</label>
                            <textarea
                                id="symptoms"
                                name="symptoms"
                                className="form-control"
                                placeholder="Describe the patient's symptoms in detail..."
                                value={form.symptoms}
                                onChange={handleChange}
                                required
                                rows={4}
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="btn btn-primary btn-analyze" disabled={loading}>
                            <FaHeartbeat />
                            {loading ? 'Analyzing...' : 'Analyze Risk'}
                        </button>
                    </form>
                </div>

                {/* Result Panel */}
                <div className="triage-result-area">
                    {loading && <Spinner message="AI is analyzing patient data..." />}

                    {result && !loading && (
                        <div className={`card triage-result-card triage-result--${riskInfo.color}`}>
                            <div className="card-header">
                                <div className="icon" style={{
                                    background: riskInfo.color === 'success' ? 'linear-gradient(135deg, #2e7d32, #66bb6a)' :
                                        riskInfo.color === 'warning' ? 'linear-gradient(135deg, #ed6c02, #ffa726)' :
                                            'linear-gradient(135deg, #d32f2f, #ef5350)'
                                }}>
                                    {riskInfo.icon}
                                </div>
                                <h3>Triage Assessment</h3>
                            </div>

                            <div className="risk-score-display">
                                <div className={`risk-score-circle risk-score--${riskInfo.color}`}>
                                    <span className="risk-score-number">{result.riskScore}</span>
                                    <span className="risk-score-max">/5</span>
                                </div>
                                <div className="risk-score-info">
                                    <span className={`badge badge-${riskInfo.color}`}>
                                        {riskInfo.icon} {riskInfo.level}
                                    </span>
                                    <p className="risk-patient-name">{form.name}</p>
                                    <p className="risk-description">
                                        {riskInfo.color === 'success' && 'Patient vitals are stable. Standard care pathway recommended.'}
                                        {riskInfo.color === 'warning' && 'Patient requires close monitoring. Consider priority assessment.'}
                                        {riskInfo.color === 'danger' && 'Patient requires immediate medical attention. Escalate to emergency team.'}
                                    </p>
                                </div>
                            </div>

                            <div className="risk-vitals-summary">
                                <div className="risk-vital">
                                    <span className="risk-vital-label">Heart Rate</span>
                                    <span className="risk-vital-value">{form.heartRate} bpm</span>
                                </div>
                                <div className="risk-vital">
                                    <span className="risk-vital-label">SpO₂</span>
                                    <span className="risk-vital-value">{form.oxygen}%</span>
                                </div>
                                <div className="risk-vital">
                                    <span className="risk-vital-label">BP</span>
                                    <span className="risk-vital-value">{form.bloodPressure}</span>
                                </div>
                                <div className="risk-vital">
                                    <span className="risk-vital-label">Age</span>
                                    <span className="risk-vital-value">{form.age} yrs</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {!result && !loading && (
                        <div className="triage-empty-state card">
                            <FaHeartbeat className="empty-icon" />
                            <h3>Awaiting Patient Data</h3>
                            <p>Fill out the intake form and click "Analyze Risk" to receive an AI-powered triage assessment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TriagePage;
