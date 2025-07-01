import React from "react";

const Header = () => {
  return (
    <div
      className="relative z-10 text-center py-10 px-5 border-b border-white/10 mb-10"
      style={{ backdropFilter: "blur(20px)", background: "rgba(255, 255, 255, 0.02)" }}
    >
      <h1
        className="text-5xl font-black mb-4 leading-tight"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-2px",
        }}
      >
        ⚽ Football AI Predictor
      </h1>
      <p className="text-xl opacity-80 font-light tracking-wide">
        Yapay Zeka Destekli Futbolcu Piyasa Değeri Tahmin Sistemi
      </p>
    </div>
  );
};

export default Header;