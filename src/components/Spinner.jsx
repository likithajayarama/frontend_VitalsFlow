import React from 'react';

const Spinner = ({ message = 'Processing...' }) => {
    return (
        <div className="spinner-overlay">
            <div style={{ textAlign: 'center' }}>
                <div className="spinner"></div>
                <p style={{
                    marginTop: '14px',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                }}>
                    {message}
                </p>
            </div>
        </div>
    );
};

export default Spinner;
