const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/football_analytics';

// MongoDB bağlantısı
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Analytics middleware'ini ekle
const { analyticsMiddleware } = require('./middleware/analytics');
app.use(analyticsMiddleware);

// Analytics routes
const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', async (req, res) => {
  try {
    // MongoDB bağlantı durumu
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Analytics istatistikleri (son 1 saat)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const { AnalyticsLog } = require('./middleware/analytics');
    
    const [totalLogs, recentLogs] = await Promise.all([
      AnalyticsLog.countDocuments(),
      AnalyticsLog.countDocuments({ timestamp: { $gte: oneHourAgo } })
    ]);

    res.json({ 
      status: 'ok', 
      message: 'Backend çalışıyor!',
      analytics: {
        database: dbStatus,
        totalLogs,
        logsLastHour: recentLogs
      }
    });
  } catch (error) {
    res.json({ 
      status: 'ok', 
      message: 'Backend çalışıyor!',
      analytics: {
        database: 'error',
        error: error.message
      }
    });
  }
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
    const mlRes = await axios.post(`${ML_SERVICE_URL}/predict`, req.body);
    res.json(mlRes.data);
  } catch (err) {
    if (err.response) {
      // ML servisinden dönen hata
      return res.status(err.response.status).json({ error: err.response.data.detail || 'ML servis hatası' });
    }
    res.status(500).json({ error: 'Sunucu hatası', detail: err.message });
  }
});

// Tahmin geçmişi endpoint'i (frontend'den çağrılıyor)
app.get('/api/predictions/history', async (req, res) => {
  try {
    // Şimdilik boş array döndür (gerçek implementasyon için veritabanı gerekli)
    res.json([]);
  } catch (error) {
    console.error('Tahmin geçmişi hatası:', error);
    res.status(500).json({ error: 'Tahmin geçmişi alınamadı' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend sunucusu ${PORT} portunda çalışıyor.`);
}); 