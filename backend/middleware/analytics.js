const mongoose = require('mongoose');
const fetch = require('node-fetch');

// IP adresini al
const getClientIP = (req) => {
  // Proxy arkasındaysa gerçek IP'yi al
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         req.ip ||
         'unknown';
};

// User-Agent'dan tarayıcı bilgilerini parse et
const parseUserAgent = (userAgent) => {
  if (!userAgent) return { browser: 'Unknown', os: 'Unknown' };

  let browser = 'Unknown';
  let os = 'Unknown';

  // Tarayıcı tespiti
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Opera')) {
    browser = 'Opera';
  }

  // İşletim sistemi tespiti
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iOS')) {
    os = 'iOS';
  }

  return { browser, os };
};

// Analytics middleware
const analyticsMiddleware = async (req, res, next) => {
  const startTime = Date.now();

  // Orijinal send metodunu sakla
  const originalSend = res.send;

  // Response body'sini yakalamak için send metodunu override et
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    
    // Analytics verilerini topla
    const analyticsData = {
      timestamp: new Date(),
      method: req.method,
      url: req.originalUrl,
      path: req.path,
      ip: getClientIP(req),
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
      acceptLanguage: req.headers['accept-language'],
      acceptEncoding: req.headers['accept-encoding'],
      host: req.headers.host,
      statusCode: res.statusCode,
      responseTime,
      contentLength: data ? data.length : 0,
      ...parseUserAgent(req.headers['user-agent'])
    };

    // Client'tan gelen analytics verilerini ekle
    if (req.body && req.body.sessionId) {
      analyticsData.sessionId = req.body.sessionId;
      analyticsData.action = req.body.action;
      analyticsData.clientData = {
        language: req.body.language,
        screenResolution: req.body.screenResolution,
        timezone: req.body.timezone,
        viewport: req.body.viewport,
        cookiesEnabled: req.body.cookiesEnabled,
        online: req.body.online
      };
    }

    // Log'u kaydet (asenkron olarak)
    saveAnalyticsLog(analyticsData).catch(err => {
      console.error('Analytics log kaydetme hatası:', err);
    });

    // Debug için log bilgisi (sadece development'ta)
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Log:', {
        method: analyticsData.method,
        path: analyticsData.path,
        ip: analyticsData.ip,
        statusCode: analyticsData.statusCode,
        responseTime: analyticsData.responseTime + 'ms'
      });
    }

    // Orijinal send metodunu çağır
    return originalSend.call(this, data);
  };

  next();
};

// Analytics log modeli
const analyticsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  method: String,
  url: String,
  path: String,
  ip: String,
  userAgent: String,
  referer: String,
  acceptLanguage: String,
  acceptEncoding: String,
  host: String,
  statusCode: Number,
  responseTime: Number,
  contentLength: Number,
  browser: String,
  os: String,
  sessionId: String,
  action: String,
  clientData: {
    language: String,
    screenResolution: String,
    timezone: String,
    viewport: String,
    cookiesEnabled: Boolean,
    online: Boolean
  },
  // IP'den türetilen konum bilgileri
  location: {
    country: String,
    city: String,
    region: String,
    latitude: Number,
    longitude: Number
  }
}, {
  timestamps: true
});

// Index'ler ekle
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ ip: 1 });
analyticsSchema.index({ sessionId: 1 });
analyticsSchema.index({ action: 1 });

const AnalyticsLog = mongoose.model('AnalyticsLog', analyticsSchema);

// Log'u veritabanına kaydet
const saveAnalyticsLog = async (data) => {
  try {
    const log = new AnalyticsLog(data);
    await log.save();
  } catch (error) {
    console.error('Analytics log kaydetme hatası:', error);
  }
};

// IP'den konum bilgisi al (isteğe bağlı)
const getLocationFromIP = async (ip) => {
  try {
    // Ücretsiz IP geolocation servisi
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile,proxy,hosting,query`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country,
        city: data.city,
        region: data.regionName,
        latitude: data.lat,
        longitude: data.lon
      };
    }
  } catch (error) {
    console.warn('IP konum bilgisi alınamadı:', error.message);
  }
  
  return null;
};

module.exports = {
  analyticsMiddleware,
  AnalyticsLog,
  getLocationFromIP,
  getClientIP
}; 