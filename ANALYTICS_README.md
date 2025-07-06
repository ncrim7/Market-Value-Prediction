# 📊 Analytics Sistemi

Bu proje, kullanıcı davranışlarını ve site performansını izlemek için kapsamlı bir analytics sistemi içerir.

## 🚀 Özellikler

### 🔐 Client-Side Analytics
- **Otomatik Bilgi Toplama**: Tarayıcı, işletim sistemi, ekran çözünürlüğü
- **Session Takibi**: Benzersiz session ID'leri ile kullanıcı oturumları
- **Sayfa Görüntüleme**: Otomatik sayfa yükleme logları
- **Form İnteraksiyonları**: Form gönderimi ve sonuç takibi
- **Hata İzleme**: API hataları ve kullanıcı deneyimi sorunları

### 🧠 Server-Side Analytics
- **IP Adresi Tespiti**: Proxy arkasındaki gerçek IP'leri alma
- **Request/Response Logları**: Tüm API çağrılarının detaylı logları
- **Performans Metrikleri**: Response time ve throughput ölçümleri
- **User-Agent Parsing**: Tarayıcı ve işletim sistemi tespiti

### 🌍 Konum Bilgileri
- **IP Geolocation**: Ücretsiz IP-API servisi ile konum tespiti
- **Ülke/Şehir Dağılımı**: Ziyaretçi coğrafi dağılımı
- **Timezone Bilgileri**: Kullanıcı saat dilimi analizi

### 📊 Dashboard ve Görselleştirme
- **Gerçek Zamanlı İstatistikler**: Canlı ziyaretçi ve aktivite verileri
- **Grafik ve Chartlar**: Tarayıcı, OS, ülke dağılımları
- **Performans Metrikleri**: Response time ve dönüşüm oranları
- **Saatlik Aktivite**: Günlük kullanım paternleri

## 🛠️ Kurulum

### 1. MongoDB Kurulumu
```bash
# MongoDB'yi başlat
mongod

# Veya Docker ile
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Backend Kurulumu
```bash
cd backend

# Bağımlılıkları yükle
npm install

# Environment dosyasını oluştur
cp env.example .env

# .env dosyasını düzenle
nano .env

# Sunucuyu başlat
npm start
```

### 3. Frontend Kurulumu
```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Uygulamayı başlat
npm start
```

## 📁 Dosya Yapısı

```
├── backend/
│   ├── middleware/
│   │   └── analytics.js          # Analytics middleware
│   ├── routes/
│   │   └── analytics.js          # Analytics API routes
│   ├── index.js                  # Ana server dosyası
│   └── env.example               # Environment örneği
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── AnalyticsDashboard.js  # Dashboard component
│   │   ├── utils/
│   │   │   └── analytics.js           # Client analytics utility
│   │   └── App.js                     # Ana uygulama
│   └── package.json
└── ANALYTICS_README.md           # Bu dosya
```

## 🔧 Konfigürasyon

### Environment Variables

```env
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/football_analytics
ML_SERVICE_URL=http://localhost:8000
ENABLE_ANALYTICS=true
LOG_RETENTION_DAYS=30
ENABLE_IP_GEOLOCATION=true

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
```

### Analytics Ayarları

```javascript
// frontend/src/utils/analytics.js
export class UserAnalytics {
  constructor() {
    // Otomatik sayfa yükleme logları
    this.autoLogPageViews = true;
    
    // Session süresi (ms)
    this.sessionTimeout = 30 * 60 * 1000; // 30 dakika
    
    // Log gönderme aralığı
    this.logInterval = 5000; // 5 saniye
  }
}
```

## 📊 API Endpoints

### Analytics Log
```http
POST /api/analytics/log
Content-Type: application/json

{
  "sessionId": "session_1234567890_abc123",
  "action": "page_view",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1",
  "browser": "Chrome",
  "os": "Windows",
  "language": "tr-TR",
  "screenResolution": "1920x1080",
  "timezone": "Europe/Istanbul"
}
```

### Dashboard Verileri
```http
GET /api/analytics/dashboard?period=7d

Response:
{
  "period": "7d",
  "stats": {
    "totalVisits": 1250,
    "uniqueVisitors": 890,
    "formSubmissions": 156,
    "predictions": 142,
    "avgResponseTime": 245
  },
  "browserStats": [...],
  "osStats": [...],
  "countryStats": [...],
  "hourlyActivity": [...]
}
```

### Son Loglar
```http
GET /api/analytics/recent-logs?limit=50
```

### IP Logları
```http
GET /api/analytics/ip/192.168.1.1?limit=100
```

### Session Logları
```http
GET /api/analytics/session/session_1234567890_abc123
```

### Log Temizleme
```http
DELETE /api/analytics/cleanup?days=30
```

## 📈 Dashboard Özellikleri

### Temel Metrikler
- **Toplam Ziyaret**: Tüm sayfa görüntülemeleri
- **Benzersiz Ziyaretçi**: Farklı IP adresleri
- **Form Gönderimi**: Başarılı form gönderimleri
- **Tahmin Sayısı**: ML tahmin sonuçları

### Dağılım Grafikleri
- **Tarayıcı Dağılımı**: Chrome, Firefox, Safari, Edge
- **İşletim Sistemi**: Windows, macOS, Linux, Android, iOS
- **Ülke Dağılımı**: Coğrafi konum bazlı analiz
- **Saatlik Aktivite**: Günlük kullanım paternleri

### Performans Metrikleri
- **Ortalama Yanıt Süresi**: API response time
- **Dönüşüm Oranı**: Ziyaretçi → Form gönderimi oranı

## 🔒 Gizlilik ve Güvenlik

### Toplanan Veriler
- **Teknik Bilgiler**: Tarayıcı, OS, ekran çözünürlüğü
- **Kullanım Verileri**: Sayfa görüntülemeleri, form gönderimleri
- **Konum Bilgileri**: IP bazlı ülke/şehir (opsiyonel)
- **Performans Verileri**: Response time, hata oranları

### Gizlilik Önlemleri
- **IP Anonimleştirme**: Son okteti maskeleme
- **Veri Saklama**: Otomatik eski log temizleme
- **GDPR Uyumluluğu**: Kullanıcı onayı ve veri silme
- **HTTPS Zorunluluğu**: Tüm veri transferleri şifreli

### Veri Saklama Politikası
```javascript
// Otomatik log temizleme (30 gün)
const LOG_RETENTION_DAYS = 30;

// IP anonimleştirme
const anonymizeIP = (ip) => {
  return ip.replace(/\.\d+$/, '.0');
};
```

## 🚀 Performans Optimizasyonu

### Database Indexing
```javascript
// MongoDB index'leri
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ ip: 1 });
analyticsSchema.index({ sessionId: 1 });
analyticsSchema.index({ action: 1 });
```

### Caching Stratejisi
```javascript
// Redis cache örneği
const cacheKey = `analytics:dashboard:${period}`;
const cachedData = await redis.get(cacheKey);

if (cachedData) {
  return JSON.parse(cachedData);
}

// Cache'e kaydet (5 dakika)
await redis.setex(cacheKey, 300, JSON.stringify(data));
```

### Batch Processing
```javascript
// Toplu log işleme
const batchSize = 100;
const logBatch = [];

// Log'ları topla
logBatch.push(logData);

// Batch dolduğunda kaydet
if (logBatch.length >= batchSize) {
  await AnalyticsLog.insertMany(logBatch);
  logBatch.length = 0;
}
```

## 🔧 Geliştirme ve Test

### Test Ortamı
```bash
# Test veritabanı
MONGODB_URI=mongodb://localhost:27017/football_analytics_test

# Test modu
NODE_ENV=test
```

### Unit Testler
```bash
# Analytics testleri
npm test -- --testPathPattern=analytics

# Coverage raporu
npm run test:coverage
```

### Load Testing
```bash
# Artillery ile yük testi
artillery run load-test.yml

# Sonuçları görüntüle
artillery report artillery-report.json
```

## 📊 Monitoring ve Alerting

### Health Checks
```http
GET /api/health

Response:
{
  "status": "ok",
  "analytics": {
    "database": "connected",
    "logsPerMinute": 45,
    "avgResponseTime": 245
  }
}
```

### Alerting Kuralları
```javascript
// Yüksek response time uyarısı
if (avgResponseTime > 1000) {
  sendAlert('Yüksek response time: ' + avgResponseTime + 'ms');
}

// Hata oranı uyarısı
if (errorRate > 5) {
  sendAlert('Yüksek hata oranı: ' + errorRate + '%');
}
```

## 🔄 Entegrasyon Seçenekleri

### Google Analytics
```javascript
// Google Analytics entegrasyonu
gtag('config', 'GA_MEASUREMENT_ID', {
  custom_map: {
    'custom_parameter_1': 'session_id',
    'custom_parameter_2': 'prediction_result'
  }
});
```

### Mixpanel
```javascript
// Mixpanel entegrasyonu
mixpanel.track('Form Submission', {
  'Form Type': 'football_prediction',
  'Success': true,
  'Response Time': responseTime
});
```

### Custom Webhook
```javascript
// Webhook entegrasyonu
const webhookData = {
  event: 'user_action',
  data: analyticsData,
  timestamp: new Date().toISOString()
};

await fetch(WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(webhookData)
});
```

## 🎯 Gelecek Özellikler

### Planlanan Geliştirmeler
- [ ] **Real-time Dashboard**: WebSocket ile canlı veri
- [ ] **A/B Testing**: Farklı UI versiyonları testi
- [ ] **Heatmaps**: Kullanıcı tıklama haritaları
- [ ] **Funnel Analysis**: Kullanıcı yolculuğu analizi
- [ ] **Machine Learning**: Anomali tespiti ve tahmin
- [ ] **Export Features**: CSV/Excel veri dışa aktarma
- [ ] **Custom Events**: Geliştirici dostu event sistemi
- [ ] **Multi-language**: Çoklu dil desteği

### Performans İyileştirmeleri
- [ ] **Database Sharding**: Büyük veri setleri için
- [ ] **CDN Integration**: Statik dosya optimizasyonu
- [ ] **Service Workers**: Offline analytics
- [ ] **Progressive Web App**: PWA özellikleri

## 📞 Destek

### Sorun Giderme
1. **MongoDB Bağlantı Hatası**: MongoDB servisinin çalıştığından emin olun
2. **Analytics Verisi Görünmüyor**: İlk ziyaretlerden sonra veriler görünür
3. **Yavaş Dashboard**: Database index'lerini kontrol edin
4. **IP Konum Hatası**: IP-API servisinin erişilebilir olduğunu kontrol edin

### Log Dosyaları
```bash
# Backend logları
tail -f backend/logs/app.log

# MongoDB logları
tail -f /var/log/mongodb/mongod.log

# Nginx logları (varsa)
tail -f /var/log/nginx/access.log
```

### Debug Modu
```bash
# Backend debug modu
DEBUG=analytics:* npm start

# Frontend debug modu
REACT_APP_DEBUG=true npm start
```

---

**Not**: Bu analytics sistemi GDPR ve diğer gizlilik yasalarına uygun olarak tasarlanmıştır. Kullanıcı onayı almayı ve veri saklama politikalarını belirtmeyi unutmayın. 