const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'https://market-value-prediction.onrender.com';

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend çalışıyor!' });
});

// ML servisine tahmin isteği atan endpoint
app.post('/api/predict', async (req, res) => {
  try {
    // Girdi validasyonu (örnek: zorunlu alanlar)
    const requiredFields = [
      'Yaş', 'Maç', 'Gol', 'Asist', 'Şut_Maç', 'İsabetli_Şut_Maç', 'Pas',
      'Dribbling_Maç', 'Top_Kazanma_Maç', 'Hava_Topu_Kazanma_Maç',
      'İkili_Mücadele_Kazanma_Maç', 'Başarılı_Pas_Maç', 'İsabetli_Orta_Maç',
      'Ülke_encoded', 'Takım_encoded', 'Pozisyon_encoded'
    ];
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        return res.status(400).json({ error: `${field} alanı zorunludur.` });
      }
    }
    // ML servisine istek at
    const mlRes = await axios.post(`/predict`, req.body);
    res.json(mlRes.data);
  } catch (err) {
    if (err.response) {
      // ML servisinden dönen hata
      return res.status(err.response.status).json({ error: err.response.data.detail || 'ML servis hatası' });
    }
    res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend sunucusu ${PORT} portunda çalışıyor.`);
}); 
