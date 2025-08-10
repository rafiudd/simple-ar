import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const items = location.state?.items || [];
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePlaceOrder = () => {
    if (!name.trim()) {
      alert("Nama tidak boleh kosong.");
      return;
    }
  
    const payload = {
      id: Date.now().toString(),
      name: name.trim(),
      items, // dari keranjang yang dikirim via state
      total,
      createdAt: new Date().toISOString(),
    };
  
    localStorage.setItem("lastConfirmedOrder", JSON.stringify(payload));
    navigate(`/order/success/${payload.id}`, { state: { order: payload } });
  };
  

  if (items.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <p>Keranjang kosong atau data tidak ditemukan.</p>
        <button onClick={() => navigate("/")}>Kembali ke Menu</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: 520, margin: "0 auto" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          background: "none",
          border: "none",
          color: "#007bff",
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        ← Kembali ke Menu
      </button>

      <h1>Pesanan Anda</h1>
      <div style={{ background: "#fff", borderRadius: 10, padding: 20, marginTop: 10 }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: "flex", justifyContent: "space-between", margin: "8px 0" }}>
            <span>{item.qty}x {item.name}</span>
            <span>Rp {item.price.toLocaleString("id-ID")}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
          <span>Total</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div style={{ background: "#f9f9f9", borderRadius: 10, padding: 20, marginTop: 20 }}>
        <label htmlFor="nama">Nama pemesan</label>
        <input
          id="nama"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama"
          style={{
            width: "96%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
            marginTop: 8,
          }}
        />
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button
            onClick={handlePlaceOrder}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: "#2ecc71",
              color: "white",
              cursor: "pointer",
            }}
          >
            Pesan Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
