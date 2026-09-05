'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const tid = searchParams.get('tid');
  const name = searchParams.get('name');

  return (
    <div className="container" style={{ maxWidth: '500px', paddingTop: '80px', textAlign: 'center' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <span style={{ fontSize: '32px', color: '#2E7D32' }}>&#10003;</span>
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Payment Confirmed</h1>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Your M-Pesa payment has been received and your registration is being processed.
      </p>

      {tid && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Transaction ID</span>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>{tid}</span>
          </div>
          {name && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Player</span>
              <span style={{ fontSize: '12px', fontWeight: 600 }}>{name}</span>
            </div>
          )}
        </div>
      )}

      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
        You&apos;ll receive a WhatsApp confirmation with your tournament details shortly.
        Check the live bracket for match times.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <a href="/live" style={{ textDecoration: 'none' }}>
          <span className="form-btn" style={{ display: 'inline-block', padding: '10px 20px' }}>View Live Bracket</span>
        </a>
        <a href="/" style={{ textDecoration: 'none' }}>
          <span className="form-btn" style={{ display: 'inline-block', padding: '10px 20px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>Home</span>
        </a>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ maxWidth: '500px', paddingTop: '80px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}