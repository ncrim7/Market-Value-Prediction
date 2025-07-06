# 🚀 Deployment Rehberi

## Vercel Deployment

### 1. Backend Deployment (Vercel Functions)

```bash
# Backend klasöründe
cd backend

# Vercel'e deploy et
vercel --prod

# Environment variables ayarla
vercel env add MONGODB_URI
vercel env add ML_SERVICE_URL
vercel env add ENABLE_ANALYTICS
```

### 2. Frontend Deployment

```bash
# Root klasörde
vercel --prod

# Environment variables ayarla
vercel env add REACT_APP_API_URL
```

### 3. Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/football_analytics
ML_SERVICE_URL=https://your-ml-service.vercel.app
ENABLE_ANALYTICS=true
LOG_RETENTION_DAYS=30
ENABLE_IP_GEOLOCATION=true
```

#### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend.vercel.app
REACT_APP_ENVIRONMENT=production
REACT_APP_ANALYTICS_ENABLED=true
```

### 4. MongoDB Atlas Kurulumu

1. **MongoDB Atlas'ta Database Oluştur:**
   - Atlas'ta yeni cluster oluştur
   - Network Access'te IP whitelist'e `0.0.0.0/0` ekle
   - Database Access'te user oluştur

2. **Connection String:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/football_analytics
   ```

### 5. ML Service Deployment

```bash
# ML service klasöründe
cd ml-service

# Requirements.txt güncelle
pip freeze > requirements.txt

# Vercel'e deploy et
vercel --prod
```

### 6. CORS Ayarları

Backend'de CORS ayarlarını güncelle:

```javascript
// backend/index.js
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### 7. Domain Ayarları

1. **Custom Domain (Opsiyonel):**
   - Vercel Dashboard'da domain ekle
   - DNS ayarlarını yapılandır

2. **SSL Certificate:**
   - Vercel otomatik SSL sağlar
   - HTTPS zorunlu

### 8. Monitoring

#### Health Check
```bash
curl https://your-backend.vercel.app/api/health
```

#### Analytics Dashboard
```
https://your-frontend.vercel.app
```

### 9. Troubleshooting

#### Build Hataları
```bash
# Local build test
npm run build

# ESLint kontrolü
npm run lint

# Type check
npm run type-check
```

#### Environment Variables
```bash
# Vercel'de environment variables kontrol et
vercel env ls

# Local test
vercel dev
```

#### MongoDB Bağlantı
```bash
# Connection test
curl https://your-backend.vercel.app/api/health
```

### 10. Performance Optimizasyonu

#### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

#### Backend
- Database indexing
- Caching
- Rate limiting
- Compression

### 11. Security

#### Environment Variables
- Hassas bilgileri .env'de sakla
- Vercel'de environment variables kullan
- Git'e commit etme

#### CORS
- Sadece gerekli origin'leri allow et
- Credentials: true sadece gerekirse

#### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100 // IP başına max request
});

app.use('/api/', limiter);
```

### 12. Analytics Production

#### MongoDB Atlas
- Production cluster kullan
- Backup ayarla
- Monitoring aktif et

#### Log Management
- Vercel logs
- MongoDB logs
- Error tracking

### 13. CI/CD Pipeline

#### GitHub Actions
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 14. Backup Strategy

#### Database
- MongoDB Atlas backup
- Daily automated backup
- Point-in-time recovery

#### Code
- GitHub repository
- Version tagging
- Release branches

### 15. Monitoring & Alerting

#### Vercel Analytics
- Performance monitoring
- Error tracking
- User analytics

#### Custom Monitoring
- Health check endpoints
- Response time monitoring
- Error rate tracking

---

## 🎯 Deployment Checklist

- [ ] Backend environment variables ayarlandı
- [ ] Frontend environment variables ayarlandı
- [ ] MongoDB Atlas bağlantısı test edildi
- [ ] ML service deploy edildi
- [ ] CORS ayarları yapıldı
- [ ] SSL certificate aktif
- [ ] Health check endpoint çalışıyor
- [ ] Analytics dashboard erişilebilir
- [ ] Error monitoring aktif
- [ ] Performance monitoring aktif
- [ ] Backup strategy hazır
- [ ] Documentation güncel

---

**Not**: Production'a geçmeden önce tüm testleri local'de çalıştırın ve güvenlik kontrollerini yapın. 