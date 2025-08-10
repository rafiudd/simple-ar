// src/OrderSuccess.jsx
import React, { useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import QRCode from "qrcode.react";

const dayNames = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const monthNames = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

function formatIndoDate(date) {
  const d = new Date(date);
  const hari = dayNames[d.getDay()];
  const tanggal = String(d.getDate()).padStart(2, "0");
  const bulan = monthNames[d.getMonth()];
  const tahun = d.getFullYear();
  const jam = String(d.getHours()).padStart(2, "0");
  const menit = String(d.getMinutes()).padStart(2, "0");
  return `${hari} ${tanggal} ${bulan} ${tahun}, Pukul ${jam}.${menit}`;
}

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const qrRef = useRef(null);

  // Ambil order dari state (prioritas), kalau tidak ada coba localStorage
  const order = useMemo(() => {
    if (location.state?.order) return location.state.order;
    const saved = localStorage.getItem("lastConfirmedOrder");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!id || parsed.id === id) return parsed;
    }
    return null;
  }, [id, location.state]);

  if (!order) {
    return (
      <div style={{ padding: 20, fontFamily: "sans-serif" }}>
        <p>Data pesanan tidak ditemukan.</p>
        <button onClick={() => navigate("/")}>Kembali ke Menu</button>
      </div>
    );
  }

  const subtotal = order.total ?? order.items.reduce((s, it) => s + it.price * it.qty, 0);
  const createdAt = order.createdAt || new Date().toISOString();
  const formattedDate = formatIndoDate(createdAt);

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `QR-Order-${order.id}.png`;
    a.click();
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: 24, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: 4 }}>Order Berhasil</h1>
      <p style={{ color: "#555", marginTop: 0 }}>{formattedDate}</p>

      <div style={{
        background: "#fff", borderRadius: 12, padding: 20,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)", marginTop: 12
      }}>
        <p style={{ margin: 0, color: "#666" }}>Tunjukkan QR ini ke kasir</p>

        <div ref={qrRef} style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
          <QRCode value={`ORDER:${order.id}`} size={180} includeMargin />
        </div>

        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleDownloadQR}
            style={{
              padding: "10px 16px", border: "none", borderRadius: 8,
              background: "#2d89ef", color: "#fff", cursor: "pointer"
            }}
          >
            Download
          </button>
        </div>

        <hr style={{ margin: "20px 0" }} />

        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Atas Nama</div>
          <div>{order.name || "-"}</div>
        </div>

        <div style={{ fontWeight: 700, margin: "12px 0 8px" }}>Ringkasan Pesanan</div>
        <div>
          {order.items.map((item, idx) => (
            <div key={idx} style={{
              display: "grid",
              gridTemplateColumns: "40px 1fr auto",
              alignItems: "center",
              gap: 8,
              padding: "6px 0",
              borderBottom: "1px solid #f1f1f1"
            }}>
              <div style={{ color: "#555" }}>{item.qty}x</div>
              <div>{item.name}</div>
              <div>Rp {(item.price * item.qty).toLocaleString("id-ID")}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 700 }}>
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString("id-ID")}</span>
        </div>
      </div>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 16px", borderRadius: 8, border: "none",
            background: "#333", color: "#fff", cursor: "pointer"
          }}
        >
          Kembali ke Menu
        </button>
      </div>
    </div>
  );
}
