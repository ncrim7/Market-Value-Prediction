import React from "react";
import InfoCard from "./InfoCard";

const ResultCard = ({ result, loading, formatCurrency }) => {
  return (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="bg-white/8 backdrop-blur-3xl rounded-3xl p-8 border border-white/15 shadow-2xl">
        {loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-3 border-white/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p>AI model hesaplama yapıyor...</p>
          </div>
        )}
        {!loading && result && (
          <div
            className={`text-center transition-all duration-500 ${
              result ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            {result.error ? (
              <div className="text-red-400">
                <div className="text-2xl mb-2">❌</div>
                <p>{result.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm uppercase tracking-wide opacity-90">
                  Tahmini Piyasa Değeri
                </div>
                <div
                  className="text-4xl font-black text-green-400"
                  style={{
                    textShadow: "0 0 30px rgba(46, 213, 115, 0.5)",
                  }}
                >
                  {formatCurrency(result.value)}
                </div>
                <div className="inline-block px-4 py-2 bg-white/10 rounded-full border border-white/20">
                  🎯 AI Güvenilirlik: %{Math.round(result.confidence)}
                </div>
              </div>
            )}
          </div>
        )}
        {!result && !loading && (
          <div className="text-center py-8 opacity-50">
            <div className="text-4xl mb-4">🤖</div>
            <p>Tahmin sonucu burada görünecek</p>
          </div>
        )}
      </div>
      {/* Info Cards */}
      <div className="space-y-4">
        <InfoCard
          title="🤖 Model Bilgileri"
          content="XGBoost algoritması kullanılarak %85.4 doğruluk oranı ile çalışan gelişmiş tahmin sistemi."
        />
        <InfoCard
          title="📈 Tahmin Faktörleri"
          content="Yaş, performans istatistikleri, pozisyon ve takım verileri analiz edilerek hesaplanır."
        />
      </div>
    </div>
  );
};

export default ResultCard;