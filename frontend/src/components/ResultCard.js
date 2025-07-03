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
                <ErrorActions />
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
        <div className="flex items-center space-x-2 mt-2">
          <a href="https://github.com/ncrim7" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-300 hover:text-white transition">
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className="mr-1">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>ncrim7</span>
          </a>
        </div>
      </div>
    </div>
  );
};

function ErrorActions() {
  const [waiting, setWaiting] = React.useState(false);
  const [iframesVisible, setIframesVisible] = React.useState(false);

  const handleClick = () => {
    setWaiting(true);
    setIframesVisible(true);
  };

  return (
    <div className="mt-4 flex flex-col items-center">
      <button
        onClick={handleClick}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-200 mb-2"
        disabled={waiting}
      >
        Hata aldıysanız tıklayın
      </button>
      {waiting && (
        <div className="text-blue-300 mt-2 animate-pulse">Lütfen birkaç saniye bekleyin... ardından tekrar tahmin edin</div>
      )}
      {iframesVisible && (
        <div style={{ display: 'none' }}>
          <iframe src="https://market-value-prediction.onrender.com/docs" title="site1" />
          <iframe src="https://market-value-prediction-backend.onrender.com/" title="site2" />
        </div>
      )}
    </div>
  );
}

export default ResultCard;