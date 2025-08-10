// src/admin/LoginPage.jsx
import React, { useState } from 'react';
import { auth } from '../services/cmsStore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const ok = await auth.login(password);
    if (ok) navigate('/admin/products');
    else setErr('Password salah');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f6f7fb' }}>
      <form onSubmit={submit} style={{ background: '#fff', padding: 24, borderRadius: 12, width: 360, boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginTop: 0 }}>Login Admin</h2>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '92%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ddd', marginTop: 6 }}
          placeholder="admin123"
        />
        {err && <div style={{ color: '#ff4d4f', marginTop: 8 }}>{err}</div>}
        <button type="submit" style={{ marginTop: 14, width: '100%', padding: '10px 12px', background: '#2d89ef', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          Masuk
        </button>
      </form>
    </div>
  );
}
