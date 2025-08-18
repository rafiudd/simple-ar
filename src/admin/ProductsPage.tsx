import React, { useEffect, useMemo, useState } from 'react';
import { getListMenu, createMenu, updateMenu, deleteMenu, uploadFile } from '@/services/menuService';

interface Product {
  id: number;
  name: string;
  price: number;
  model: string;
  ios: string;
}

interface FormState {
  name: string;
  price: string;
  model: string;
  ios: string;
}

const emptyForm: FormState = { name: '', price: '', model: '', ios: '' };

export default function ProductsPage() {
  const [rows, setRows] = useState<Product[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [q, setQ] = useState('');

  const [localModelUrl, setLocalModelUrl] = useState<string | null>(null);
  const [localIosUrl, setLocalIosUrl] = useState<string | null>(null);

  const [modelUploading, setModelUploading] = useState(false);
  const [iosUploading, setIosUploading] = useState(false);

  const load = async () => {
    try {
      const data = await getListMenu();
      setRows(
        (data || []).map((d: any) => ({
          id: d.id,
          name: d.nama_menu || d.name || '',
          price: d.price ?? 0,
          model: d.model || '',
          ios: d.ios || '',
        }))
      );
    } catch (e) {
      console.error('Gagal memuat data:', e);
      setRows([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => rows.filter((r) => r.name?.toLowerCase().includes(q.toLowerCase())), [rows, q]);

  const resetLocalUrls = () => {
    if (localModelUrl) URL.revokeObjectURL(localModelUrl);
    if (localIosUrl) URL.revokeObjectURL(localIosUrl);
    setLocalModelUrl(null);
    setLocalIosUrl(null);
  };

  const startCreate = () => {
    setEditId(null);
    setForm(emptyForm);
    resetLocalUrls();
    setOpenForm(true);
  };

  const startEdit = (row: Product) => {
    setEditId(row.id);
    setForm({ name: row.name, price: row.price.toString(), model: row.model || '', ios: row.ios || '' });
    resetLocalUrls();
    setOpenForm(true);
  };

  const closeForm = () => {
    resetLocalUrls();
    setOpenForm(false);
  };

  const save = async () => {
    if (!form.name.trim()) return alert('Nama wajib diisi');
    if (!form.price || Number.isNaN(Number(form.price))) return alert('Harga wajib diisi');
    if (!form.model.trim()) return alert('Model wajib diisi');
    if (!form.ios.trim()) return alert('iOS wajib diisi');

    const payload = {
      ios: form.ios,
      model: form.model,
      price: Number(form.price),
      nama_menu: form.name,
    };

    try {
      if (editId) await updateMenu(editId, payload);
      else await createMenu(payload);
      closeForm();
      await load();
    } catch (e) {
      console.error('Gagal simpan:', e);
      alert('Gagal menyimpan data. Coba lagi.');
    }
  };

  const del = async (id: number) => {
    if (!window.confirm('Hapus produk ini?')) return;
    try {
      await deleteMenu(id);
      await load();
    } catch (e) {
      console.error('Gagal hapus:', e);
      alert('Gagal menghapus data.');
    }
  };

  const onPickModel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setModelUploading(true);
    try {
      const res = await uploadFile(file);
      const url = res.url;

      setForm((f) => ({ ...f, model: url }));
      setLocalModelUrl(URL.createObjectURL(file));
    } catch (err) {
      alert('Upload model gagal');
      console.error(err);
    } finally {
      setModelUploading(false);
    }
  };

  const onPickIos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIosUploading(true);
    try {
      const res = await uploadFile(file);
      const url = res.url;

      setForm((f) => ({ ...f, ios: url }));
      setLocalIosUrl(URL.createObjectURL(file));
    } catch (err) {
      alert('Upload iOS file gagal');
      console.error(err);
    } finally {
      setIosUploading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Produk</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            placeholder="Cari produk…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd' }}
          />
          <button
            onClick={startCreate}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: 'none',
              background: '#2ecc71',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            + Tambah
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafafa' }}>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Nama</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Harga</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>Model (GLB)</th>
              <th style={{ textAlign: 'left', padding: 10, borderBottom: '1px solid #eee' }}>iOS (USDZ)</th>
              <th style={{ padding: 10, borderBottom: '1px solid #eee' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td style={{ padding: 10 }}>{r.name}</td>
                <td style={{ padding: 10 }}>Rp {Number(r.price || 0).toLocaleString('id-ID')}</td>
                <td
                  style={{
                    padding: 10,
                    maxWidth: 150,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.model ? (
                    <a href={r.model} target="_blank" rel="noreferrer">
                      {r.model.split('/').pop()}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td
                  style={{
                    padding: 10,
                    maxWidth: 150,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.ios ? (
                    <a href={r.ios} target="_blank" rel="noreferrer">
                      {r.ios.split('/').pop()}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td style={{ padding: 10, display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => startEdit(r)}
                    style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #ddd', cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => del(r.id)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 6,
                      border: '1px solid #ffb3b3',
                      color: '#e74c3c',
                      background: '#fff5f5',
                      cursor: 'pointer',
                    }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: 16, color: '#888', textAlign: 'center' }}>
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {openForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'grid',
            placeItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 16,
              width: 460,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}
          >
            <h3 style={{ marginTop: 0 }}>{editId ? 'Edit Produk' : 'Tambah Produk'}</h3>

            <label>Nama</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama produk"
              style={{ width: '90%', padding: 10, borderRadius: 8, border: '1px solid #ddd', marginBottom: 8 }}
            />

            <label>Harga</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="Masukan harga"
              style={{ width: '90%', padding: 10, borderRadius: 8, border: '1px solid #ddd', marginBottom: 8 }}
            />

            <label>Model (GLB)</label>
            <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
              <input
                value={form.model.split('/').pop()}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder={modelUploading ? 'Mengupload...' : 'URL file GLB'}
                readOnly
                style={{ width: '90%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
              />
              <input type="file" accept=".glb" onChange={onPickModel} />
            </div>

            <label>iOS (USDZ)</label>
            <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
              <input
                value={form.ios.split('/').pop()}
                onChange={(e) => setForm({ ...form, ios: e.target.value })}
                placeholder={iosUploading ? 'Mengupload...' : 'URL file OSDZ'}
                readOnly
                style={{ width: '90%', padding: 10, borderRadius: 8, border: '1px solid #ddd' }}
              />
              <input type="file" accept=".usdz" onChange={onPickIos} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={closeForm}
                style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                onClick={save}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#2ecc71',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
