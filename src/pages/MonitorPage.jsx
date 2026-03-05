import React, { useState, useEffect } from 'react';
import {
    FaHeartbeat,
    FaLungs,
    FaTachometerAlt,
    FaExclamationTriangle,
    FaCheckCircle,
    FaUserMd,
    FaCalendarAlt,
    FaStethoscope,
    FaWhatsapp,
} from 'react-icons/fa';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import { getMonitorData } from '../services/api';
import Spinner from '../components/Spinner';
import './MonitorPage.css';

const MonitorPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const result = await getMonitorData('default');
            setData(result);
        } catch (err) {
            setError('Failed to load monitoring data.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner message="Loading patient monitoring data..." />;
    if (error) return <div className="error-message">{error}</div>;
    if (!data) return null;

    const { patient, vitals, alert: hasAlert, whatsapp } = data;
    const latestVital = vitals[vitals.length - 1];

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTimestamp = (ts) => {
        return new Date(ts).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="monitor-page">
            <div className="page-header">
                <h1>📊 Digital Caretaker</h1>
                <p>Post-discharge home monitoring dashboard with real-time vital signs tracking</p>
            </div>

            {/* Alert Banner */}
            {hasAlert && (
                <div className="alert-banner alert-banner--danger">
                    <FaExclamationTriangle />
                    <span><strong>ALERT:</strong> Abnormal vitals detected for {patient.name}. Immediate follow-up recommended.</span>
                </div>
            )}

            {/* Patient Summary */}
            <div className="card monitor-patient-card">
                <div className="monitor-patient-info">
                    <div className="monitor-patient-avatar">
                        {patient.name.charAt(0)}
                    </div>
                    <div className="monitor-patient-details">
                        <h3>{patient.name}</h3>
                        <p className="monitor-patient-diagnosis">{patient.diagnosis}</p>
                    </div>
                    <div className="monitor-patient-meta">
                        <div className="meta-item">
                            <FaCalendarAlt />
                            <div>
                                <span className="meta-label">Discharged</span>
                                <span className="meta-value">{formatDate(patient.dischargeDate)}</span>
                            </div>
                        </div>
                        <div className="meta-item">
                            <FaUserMd />
                            <div>
                                <span className="meta-label">Physician</span>
                                <span className="meta-value">{patient.doctor}</span>
                            </div>
                        </div>
                        <div className="meta-item">
                            <FaStethoscope />
                            <div>
                                <span className="meta-label">Age</span>
                                <span className="meta-value">{patient.age} years</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vitals Cards */}
            <div className="grid-3 monitor-vitals-grid">
                <div className={`card monitor-vital-card ${latestVital.heartRate > 100 ? 'vital-alert' : ''}`}>
                    <div className="vital-card-header">
                        <div className="vital-icon vital-icon--hr"><FaHeartbeat /></div>
                        <div>
                            <span className="vital-label">Heart Rate</span>
                            {latestVital.heartRate > 100 && <span className="badge badge-danger">High</span>}
                        </div>
                    </div>
                    <div className="vital-value">{latestVital.heartRate} <span>bpm</span></div>
                    <div className="vital-range">Normal: 60–100 bpm</div>
                </div>

                <div className={`card monitor-vital-card ${latestVital.oxygen < 95 ? 'vital-alert' : ''}`}>
                    <div className="vital-card-header">
                        <div className="vital-icon vital-icon--o2"><FaLungs /></div>
                        <div>
                            <span className="vital-label">Oxygen Level</span>
                            {latestVital.oxygen < 95 && <span className="badge badge-danger">Low</span>}
                        </div>
                    </div>
                    <div className="vital-value">{latestVital.oxygen}<span>%</span></div>
                    <div className="vital-range">Normal: 95–100%</div>
                </div>

                <div className={`card monitor-vital-card ${latestVital.systolic > 140 ? 'vital-alert' : ''}`}>
                    <div className="vital-card-header">
                        <div className="vital-icon vital-icon--bp"><FaTachometerAlt /></div>
                        <div>
                            <span className="vital-label">Blood Pressure</span>
                            {latestVital.systolic > 140 && <span className="badge badge-danger">High</span>}
                        </div>
                    </div>
                    <div className="vital-value">{latestVital.systolic}/{latestVital.diastolic} <span>mmHg</span></div>
                    <div className="vital-range">Normal: 120/80 mmHg</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid-2 monitor-charts-grid">
                <div className="card">
                    <div className="card-header">
                        <div className="icon" style={{ background: 'linear-gradient(135deg, #d32f2f, #ef5350)' }}>
                            <FaHeartbeat />
                        </div>
                        <h3>Heart Rate Trend</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={vitals}>
                                <defs>
                                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d32f2f" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#d32f2f" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#aaa" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#aaa" domain={[60, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 8, border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="heartRate"
                                    stroke="#d32f2f"
                                    strokeWidth={2.5}
                                    fill="url(#hrGrad)"
                                    dot={{ r: 4, fill: '#d32f2f' }}
                                    activeDot={{ r: 6 }}
                                    name="Heart Rate"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="icon" style={{ background: 'linear-gradient(135deg, #0288d1, #4fc3f7)' }}>
                            <FaLungs />
                        </div>
                        <h3>Oxygen Saturation Trend</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={vitals}>
                                <defs>
                                    <linearGradient id="o2Grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0288d1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#0288d1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#aaa" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#aaa" domain={[90, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 8, border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="oxygen"
                                    stroke="#0288d1"
                                    strokeWidth={2.5}
                                    fill="url(#o2Grad)"
                                    dot={{ r: 4, fill: '#0288d1' }}
                                    activeDot={{ r: 6 }}
                                    name="SpO₂ %"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-bp-card">
                    <div className="card-header">
                        <div className="icon" style={{ background: 'linear-gradient(135deg, #ed6c02, #ffa726)' }}>
                            <FaTachometerAlt />
                        </div>
                        <h3>Blood Pressure Trend</h3>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={vitals}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#aaa" />
                                <YAxis tick={{ fontSize: 12 }} stroke="#aaa" domain={[60, 160]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 8, border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="systolic"
                                    stroke="#ed6c02"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, fill: '#ed6c02' }}
                                    name="Systolic"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="diastolic"
                                    stroke="#ffa726"
                                    strokeWidth={2.5}
                                    dot={{ r: 4, fill: '#ffa726' }}
                                    name="Diastolic"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* WhatsApp Bot Status */}
                <div className="card monitor-whatsapp-card">
                    <div className="card-header">
                        <div className="icon" style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}>
                            <FaWhatsapp />
                        </div>
                        <h3>WhatsApp Bot Status</h3>
                    </div>

                    <div className="whatsapp-status-body">
                        <div className="whatsapp-status-row">
                            <span className="whatsapp-label">Bot Status</span>
                            <span className={`badge ${whatsapp.active ? 'badge-success' : 'badge-danger'}`}>
                                {whatsapp.active ? <><FaCheckCircle /> Active</> : 'Inactive'}
                            </span>
                        </div>
                        <div className="whatsapp-status-row">
                            <span className="whatsapp-label">Last Message</span>
                            <span className="whatsapp-value">{formatTimestamp(whatsapp.lastMessage)}</span>
                        </div>
                        <div className="whatsapp-status-row">
                            <span className="whatsapp-label">Patient Contact</span>
                            <span className="whatsapp-value">Connected</span>
                        </div>
                        <div className="whatsapp-status-row">
                            <span className="whatsapp-label">Alert Frequency</span>
                            <span className="whatsapp-value">Every 2 hours</span>
                        </div>
                    </div>

                    <div className="whatsapp-info">
                        <FaWhatsapp />
                        <p>The WhatsApp bot automatically checks in with the patient every 2 hours to collect vitals and symptom updates.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonitorPage;
