import React, { useState } from 'react';
import '@google/model-viewer/dist/model-viewer.min.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const sampleProducts = [
  { id: 1, name: 'Matcha Cake', price: 25000, model: '/assets/cake2.glb', ios: '/assets/coconchair.usdz' },
  { id: 2, name: 'Es Kopi Special', price: 20000, model: '/assets/minum.glb', ios: null },
  { id: 3, name: 'Kursi Mini', price: 50000, model: '/assets/minum.glb', ios: '/assets/coconchair.usdz' },
  { id: 1, name: 'Matcha Cake', price: 25000, model: '/assets/cake2.glb', ios: '/assets/coconchair.usdz' },
  { id: 2, name: 'Es Kopi Special', price: 20000, model: '/assets/minum.glb', ios: null },
  { id: 3, name: 'Kursi Mini', price: 50000, model: '/assets/minum.glb', ios: '/assets/coconchair.usdz' },
  { id: 1, name: 'Matcha Cake', price: 25000, model: '/assets/cake2.glb', ios: '/assets/coconchair.usdz' },
  { id: 2, name: 'Es Kopi Special', price: 20000, model: '/assets/minum.glb', ios: null },
  { id: 3, name: 'Kursi Mini', price: 50000, model: '/assets/minum.glb', ios: '/assets/coconchair.usdz' },
  { id: 1, name: 'Matcha Cake', price: 25000, model: '/assets/cake2.glb', ios: '/assets/coconchair.usdz' },
  { id: 2, name: 'Es Kopi Special', price: 20000, model: '/assets/minum.glb', ios: null },
  { id: 3, name: 'Kursi Mini', price: 50000, model: '/assets/minum.glb', ios: '/assets/coconchair.usdz' },
  { id: 1, name: 'Matcha Cake', price: 25000, model: '/assets/cake2.glb', ios: '/assets/coconchair.usdz' },
  { id: 2, name: 'Es Kopi Special', price: 20000, model: '/assets/minum.glb', ios: null },
  { id: 3, name: 'Kursi Mini', price: 50000, model: '/assets/minum.glb', ios: '/assets/coconchair.usdz' },
  { id: 1, name: 'Matcha Cake', price: 25000, model: '/assets/cake2.glb', ios: '/assets/coconchair.usdz' },
  { id: 2, name: 'Es Kopi Special', price: 20000, model: '/assets/minum.glb', ios: null },
  { id: 3, name: 'Kursi Mini', price: 50000, model: '/assets/minum.glb', ios: '/assets/coconchair.usdz' },
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.productId === product.id);
      if (found) {
        toast.info(`${product.name} jumlahnya bertambah`, { position: "top-center" });
        return prev.map((p) => p.productId === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      toast.success(`${product.name} ditambahkan ke keranjang`, { position: "top-center" });
      return [...prev, { productId: product.id, qty: 1 }];
    });
  };

  // >>> HANDLE CHECKOUT <<<
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Keranjang masih kosong!", { position: "top-center" });
      return;
    }
  
    // Kirim data keranjang + total ke OrderPage
    navigate("/order", {
      state: {
        items: cart.map((c) => {
          const prod = sampleProducts.find((p) => p.id === c.productId);
          return {
            name: prod.name,
            qty: c.qty,
            price: prod.price,
          };
        }),
      },
    });
  };

  const removeFromCart = (productId) => {
    const prod = sampleProducts.find((p) => p.id === productId);
    toast.error(`${prod?.name} dihapus dari keranjang`, { position: "top-center" });
    setCart((prev) => prev.filter((p) => p.productId !== productId));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => {
    const prod = sampleProducts.find((p) => p.id === i.productId);
    return s + (prod ? prod.price * i.qty : 0);
  }, 0);

  return (
    <div style={{ fontFamily: 'sans-serif', paddingBottom: 80 }}>
      {/* Header */}
      <header style={{ textAlign: 'center', padding: '20px 0' }}>
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Laper3D</h1>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>by Singgah Coffee & Book</p>
      </header>

      {/* Grid produk */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 20,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        {sampleProducts.map((product) => (
          <div key={product.id} style={{
            border: '1px solid #ccc',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}>
            <model-viewer
              src={product.model}
              ios-src={product.ios}
              alt={product.name}
              ar
              auto-rotate
              camera-controls
              style={{ width: '100%', height: 180, backgroundColor: '#efefef' }}
            ></model-viewer>
            <div style={{ padding: 10 }}>
              <h3>{product.name}</h3>
              <p>Rp {product.price.toLocaleString('id-ID')}</p>
              <button
                onClick={() => setOpenProduct(product)}
                style={{ width: '100%', padding: 10, background: '#ff3b3b', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}
              >
                Lihat versi 3D
              </button>
              <button
                onClick={() => addToCart(product)}
                style={{ width: '100%', marginTop: 8, padding: 10, background: '#333', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}
              >
                + Keranjang
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Popup lihat 3D */}
      {openProduct && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 100, backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: '#fff', padding: 20, borderRadius: 16, maxWidth: '95%',
            width: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', textAlign: 'center'
          }}>
            <h2 style={{ margin: 0, marginBottom: 16 }}>{openProduct.name}</h2>
            <model-viewer
              src={openProduct.model}
              ios-src={openProduct.ios}
              alt={openProduct.name}
              ar
              auto-rotate
              camera-controls
              style={{ width: '100%', height: 300, backgroundColor: '#f5f5f5', borderRadius: 12 }}
            ></model-viewer>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 10 }}>
              <button
                onClick={() => { addToCart(openProduct); setOpenProduct(null); }}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#27ae60', color: 'white', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                + Tambah ke Keranjang
              </button>
              <button
                onClick={() => setOpenProduct(null)}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#e74c3c', color: 'white', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup keranjang */}
      {showCart && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 200, backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            background: '#fff', padding: '20px 24px', borderRadius: '16px',
            width: '90%', maxWidth: 420, maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}>
            <h2 style={{ margin: 0, marginBottom: 16, fontSize: '1.5rem', fontWeight: '600', borderBottom: '1px solid #eee', paddingBottom: 8 }}>
              🛒 Keranjang Belanja
            </h2>
            {cart.length === 0 ? (
              <p style={{ color: '#777', textAlign: 'center', padding: '20px 0' }}>Keranjang kosong</p>
            ) : (
              cart.map((item) => {
                const prod = sampleProducts.find((p) => p.id === item.productId);
                return (
                  <div key={item.productId} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 12, background: '#f9f9f9', padding: '8px 12px', borderRadius: 8
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{prod?.name}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>x {item.qty}</span>
                    </div>
                    <span style={{ fontWeight: '500', color: '#333' }}>
                      Rp {(prod?.price * item.qty).toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      style={{ background: 'transparent', border: 'none', color: '#e74c3c', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      ❌
                    </button>
                  </div>
                );
              })
            )}
            <hr style={{ margin: '16px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>
            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button
                onClick={() => setShowCart(false)}
                style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: '#3498db', color: 'white', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer keranjang */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff',
        borderTop: '1px solid #ccc', padding: '16px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 -2px 6px rgba(0,0,0,0.1)', flexWrap: 'wrap', gap: 10
      }}>
        <div><strong>Total:</strong> Rp {cartTotal.toLocaleString('id-ID')}</div>
        <div>
          <button
            onClick={() => setShowCart(true)}
            style={{ padding: '10px 20px', background: '#333', color: '#fff', border: 'none', borderRadius: 5 }}
          >
            Keranjang ({cartCount})
          </button>
          <button
            onClick={handleCheckout}
            style={{ marginLeft: 10, padding: '10px 20px', background: '#ff3b3b', color: '#fff', border: 'none', borderRadius: 5 }}
          >
            Pesan Sekarang
          </button>

        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
