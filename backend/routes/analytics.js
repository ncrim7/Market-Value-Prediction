const express = require('express');
const router = express.Router();
const { AnalyticsLog, getLocationFromIP } = require('../middleware/analytics');

// Analytics log endpoint'i
router.post('/log', async (req, res) => {
  try {
    const logData = req.body;
    
    // IP'den konum bilgisi al (isteğe bağlı)
    if (logData.ip && logData.ip !== 'unknown') {
      const location = await getLocationFromIP(logData.ip);
      if (location) {
        logData.location = location;
      }
    }

    // Log'u kaydet
    const log = new AnalyticsLog(logData);
    await log.save();

    res.status(200).json({ success: true, message: 'Log kaydedildi' });
  } catch (error) {
    console.error('Analytics log hatası:', error);
    res.status(500).json({ error: 'Log kaydedilemedi' });
  }
});

// Analytics dashboard verileri
router.get('/dashboard', async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Tarih filtresi
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Temel istatistikler
    const totalVisits = await AnalyticsLog.countDocuments({
      timestamp: { $gte: startDate },
      action: 'page_view'
    });

    const uniqueVisitors = await AnalyticsLog.distinct('ip', {
      timestamp: { $gte: startDate }
    });

    const formSubmissions = await AnalyticsLog.countDocuments({
      timestamp: { $gte: startDate },
      action: 'form_submission'
    });

    const predictions = await AnalyticsLog.countDocuments({
      timestamp: { $gte: startDate },
      action: 'prediction_result'
    });

    // Tarayıcı dağılımı
    const browserStats = await AnalyticsLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // İşletim sistemi dağılımı
    const osStats = await AnalyticsLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$os',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Ülke dağılımı
    const countryStats = await AnalyticsLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
          'location.country': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$location.country',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Saatlik aktivite
    const hourlyActivity = await AnalyticsLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Ortalama response time
    const avgResponseTime = await AnalyticsLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
          responseTime: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: '$responseTime' }
        }
      }
    ]);

    res.json({
      period,
      stats: {
        totalVisits,
        uniqueVisitors: uniqueVisitors.length,
        formSubmissions,
        predictions,
        avgResponseTime: avgResponseTime[0]?.avgResponseTime || 0
      },
      browserStats,
      osStats,
      countryStats,
      hourlyActivity
    });

  } catch (error) {
    console.error('Dashboard veri hatası:', error);
    res.status(500).json({ error: 'Dashboard verileri alınamadı' });
  }
});

// Son loglar
router.get('/recent-logs', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    const logs = await AnalyticsLog.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json(logs);
  } catch (error) {
    console.error('Son loglar hatası:', error);
    res.status(500).json({ error: 'Loglar alınamadı' });
  }
});

// Belirli bir IP'nin logları
router.get('/ip/:ip', async (req, res) => {
  try {
    const { ip } = req.params;
    const { limit = 100 } = req.query;
    
    const logs = await AnalyticsLog.find({ ip })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.json(logs);
  } catch (error) {
    console.error('IP logları hatası:', error);
    res.status(500).json({ error: 'IP logları alınamadı' });
  }
});

// Session logları
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const logs = await AnalyticsLog.find({ sessionId })
      .sort({ timestamp: 1 })
      .select('-__v');

    res.json(logs);
  } catch (error) {
    console.error('Session logları hatası:', error);
    res.status(500).json({ error: 'Session logları alınamadı' });
  }
});

// Log temizleme (eski logları sil)
router.delete('/cleanup', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    const result = await AnalyticsLog.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    res.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} log silindi`
    });
  } catch (error) {
    console.error('Log temizleme hatası:', error);
    res.status(500).json({ error: 'Loglar temizlenemedi' });
  }
});

module.exports = router; 