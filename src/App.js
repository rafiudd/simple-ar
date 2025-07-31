import './App.css';
import './styles.css';
import '@google/model-viewer/dist/model-viewer.min.js';

import cake from './assets/cake2.glb';
import minum from './assets/minum.glb';
import chair from './assets/coconchair.usdz';

import QRCode from 'qrcode.react';

const modelViewerStyle = {
  backgroundColor: "#eee",
  overflowX: "hidden",
  posterColor: "#eee",
  width: 400,
  height: 300,
  borderRadius: 10,
  marginTop: 40,
  marginLeft: 40,
};

const ModelWithQRCode = ({ src, iosSrc }) => (
  <div className="App">
    <model-viewer
      className="modelviewer"
      style={modelViewerStyle}
      src={src}
      ios-src={iosSrc}
      alt="3D model"
      ar
      auto-rotate
      camera-controls
    >
      {iosSrc && (
        <button slot="ar-button" className="arbutton">
          View in your space
        </button>
      )}
    </model-viewer>
    <div style={{ display: 'flex', marginLeft: 50 }}>
      <QRCode
        value={window.location.href}
        size={128}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
        includeMargin={true}
      />
      <h5 style={{ marginTop: 50 }}>QRCode URL: {window.location.href}</h5>
    </div>
  </div>
);

function App() {
  const isMobile = /iPhone|webOS|Android|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);

  return (
    <>
      {isMobile ? (
        <ModelWithQRCode src={cake} iosSrc={chair} />
      ) : (
        <>
          <ModelWithQRCode src={cake} />
          <ModelWithQRCode src={minum} />
        </>
      )}
    </>
  );
}

export default App;
