import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Dummy / Fallback Data ───────────────────────────────────

const DUMMY_TRIAGE = {
    riskScore: 3,
};

const DUMMY_SOAP = {
    soapNotes: `SUBJECTIVE:
Patient presents with complaints of persistent headache for the past 3 days, described as throbbing and localized to the frontal region. Reports associated symptoms of mild nausea and photophobia. Denies fever, vision changes, or recent head trauma. Pain rated 6/10. Over-the-counter acetaminophen provided partial relief.

OBJECTIVE:
Vitals: BP 128/82 mmHg, HR 78 bpm, Temp 98.4°F, SpO2 99%
General: Alert, oriented, no acute distress
HEENT: No papilledema on fundoscopic exam, no neck stiffness
Neuro: Cranial nerves II-XII intact, no focal deficits

ASSESSMENT:
1. Tension-type headache, recurrent
2. Rule out migraine without aura
3. Mild hypertension — monitor

PLAN:
1. Prescribe Ibuprofen 400mg PO every 8 hours as needed
2. Lifestyle modifications: adequate hydration, regular sleep pattern
3. Monitor blood pressure — follow up in 2 weeks
4. If symptoms worsen or new neurological symptoms develop, consider CT Head
5. Patient counseled on red flag symptoms requiring ER visit`,
};

const DUMMY_MONITOR = {
    patient: {
        name: 'Rajesh Kumar',
        age: 58,
        dischargeDate: '2026-02-28',
        diagnosis: 'Post-CABG Surgery',
        doctor: 'Dr. Meena Sharma',
    },
    vitals: [
        { time: '6 AM', heartRate: 72, oxygen: 97, systolic: 122, diastolic: 78 },
        { time: '8 AM', heartRate: 78, oxygen: 96, systolic: 128, diastolic: 82 },
        { time: '10 AM', heartRate: 80, oxygen: 95, systolic: 130, diastolic: 85 },
        { time: '12 PM', heartRate: 85, oxygen: 94, systolic: 135, diastolic: 88 },
        { time: '2 PM', heartRate: 82, oxygen: 96, systolic: 126, diastolic: 80 },
        { time: '4 PM', heartRate: 76, oxygen: 97, systolic: 124, diastolic: 79 },
        { time: '6 PM', heartRate: 74, oxygen: 98, systolic: 120, diastolic: 76 },
        { time: '8 PM', heartRate: 70, oxygen: 98, systolic: 118, diastolic: 75 },
    ],
    alert: false,
    whatsapp: {
        active: true,
        lastMessage: '2026-03-04T15:30:00+05:30',
    },
};

// ─── API Functions ───────────────────────────────────────────

/**
 * Send patient data to triage AI and get risk score
 */
export const triagePatient = async (data) => {
    try {
        const response = await api.post('/api/triage', data);
        return response.data;
    } catch (error) {
        console.warn('Triage API unavailable, using fallback data:', error.message);
        // Simulate risk based on vitals
        const { heartRate, oxygen, age } = data;
        let score = 2;
        if (heartRate > 110 || oxygen < 92) score = 5;
        else if (heartRate > 100 || oxygen < 95) score = 4;
        else if (age > 60 || heartRate > 90) score = 3;
        return { riskScore: score };
    }
};

/**
 * Send audio file to scribe AI and receive SOAP notes
 */
export const transcribeAudio = async (file) => {
    try {
        const formData = new FormData();
        formData.append('audio', file);
        const response = await api.post('/api/scribe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 30000,
        });
        return response.data;
    } catch (error) {
        console.warn('Scribe API unavailable, using fallback data:', error.message);
        return DUMMY_SOAP;
    }
};

/**
 * Get monitoring data for a discharged patient
 */
export const getMonitorData = async (patientId = 'default') => {
    try {
        const response = await api.get(`/api/monitor/${patientId}`);
        return response.data;
    } catch (error) {
        console.warn('Monitor API unavailable, using fallback data:', error.message);
        return DUMMY_MONITOR;
    }
};

export default api;
