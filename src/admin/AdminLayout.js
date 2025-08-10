// src/admin/AdminLayout.jsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../services/cmsStore';

export default function AdminLayout() {
  const navigate = useNavigate();

  if (!auth.isAuthed()) {
    navigate('/admin/login');
    return null;
  }

  const linkStyle = ({ isActive }) => ({
    padding: '10px 14px',
    borderRadius: 8,
    textDecoration: 'none',
    color: isActive ? '#fff' : '#333',
    background: isActive ? '#2d89ef' : 'transparent',
  });

  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: '#f6f7fb' }}>
      <header style={{ background: '#111', color: '#fff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between' }}>
        <strong>Laper3D CMS</strong>
        <button
          onClick={() => { auth.logout(); navigate('/admin/login'); }}
          style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, padding: 16 }}>
        <aside style={{ background: '#fff', borderRadius: 12, padding: 12, height: 'calc(100vh - 90px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <NavLink to="/admin/products" style={linkStyle}>Produk</NavLink>
            <NavLink to="/admin/orders" style={linkStyle}>Pesanan</NavLink>
          </div>
        </aside>

        <main style={{ background: '#fff', borderRadius: 12, padding: 16, minHeight: 400 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
