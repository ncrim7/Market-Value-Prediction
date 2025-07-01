// src/components/QuickFillButtons.js
import React from 'react';

const QuickFillButtons = ({ onFillData, onClearForm }) => {
  // Sample data for quick fill
  const sampleData = {
    superstar: {
      Yaş: 24,
      Maç: 35,
      Gol: 28,
      Asist: 15,
      Şut_Maç: 4.2,
      İsabetli_Şut_Maç: 2.1,
      Pas: 85,
      Dribbling_Maç: 3.8,
      Top_Kazanma_Maç: 2.5,
      Hava_Topu_Kazanma_Maç: 1.2,
      İkili_Mücadele_Kazanma_Maç: 65,
      Başarılı_Pas_Maç: 28,
      İsabetli_Orta_Maç: 1.8,
      Ülke_encoded: 15,
      Takım_encoded: 8,
      Pozisyon_encoded: 2
    },
    rising: {
      Yaş: 19,
      Maç: 25,
      Gol: 8,
      Asist: 12,
      Şut_Maç: 2.5,
      İsabetli_Şut_Maç: 1.2,
      Pas: 78,
      Dribbling_Maç: 2.8,
      Top_Kazanma_Maç: 3.2,
      Hava_Topu_Kazanma_Maç: 0.8,
      İkili_Mücadele_Kazanma_Maç: 58,
      Başarılı_Pas_Maç: 22,
      İsabetli_Orta_Maç: 1.1,
      Ülke_encoded: 25,
      Takım_encoded: 12,
      Pozisyon_encoded: 1
    },
    veteran: {
      Yaş: 32,
      Maç: 30,
      Gol: 12,
      Asist: 8,
      Şut_Maç: 2.8,
      İsabetli_Şut_Maç: 1.5,
      Pas: 92,
      Dribbling_Maç: 1.5,
      Top_Kazanma_Maç: 4.2,
      Hava_Topu_Kazanma_Maç: 2.8,
      İkili_Mücadele_Kazanma_Maç: 72,
      Başarılı_Pas_Maç: 45,
      İsabetli_Orta_Maç: 2.2,
      Ülke_encoded: 5,
      Takım_encoded: 3,
      Pozisyon_encoded: 0
    }
  };

  return (
    <div className="mb-8">
      <div className="text-lg font-semibold mb-4 text-purple-300">🚀 Hızlı Doldurma</div>
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => onFillData(sampleData.superstar)} 
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm hover:bg-blue-500/30 hover:border-blue-500 transition-all duration-300"
        >
          ⭐ Süperstar
        </button>
        <button 
          onClick={() => onFillData(sampleData.rising)} 
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm hover:bg-blue-500/30 hover:border-blue-500 transition-all duration-300"
        >
          📈 Yükselen Yıldız
        </button>
        <button 
          onClick={() => onFillData(sampleData.veteran)} 
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm hover:bg-blue-500/30 hover:border-blue-500 transition-all duration-300"
        >
          🏆 Veteran
        </button>
        <button 
          onClick={onClearForm} 
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm hover:bg-red-500/30 hover:border-red-500 transition-all duration-300"
        >
          🗑️ Temizle
        </button>
      </div>
    </div>
  );
};

export default QuickFillButtons;