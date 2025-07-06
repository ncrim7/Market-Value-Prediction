// Analytics sistemi test script'i
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000';

// Test verileri
const testLogData = {
  sessionId: 'test_session_' + Date.now(),
  action: 'test_action',
  timestamp: new Date().toISOString(),
  userAgent: 'Test User Agent',
  ip: '127.0.0.1',
  browser: 'Test Browser',
  os: 'Test OS',
  language: 'tr-TR',
  screenResolution: '1920x1080',
  timezone: 'Europe/Istanbul'
};

async function testAnalytics() {
  console.log('🧪 Analytics sistemi test ediliyor...\n');

  try {
    // 1. Health check
    console.log('1️⃣ Health check test ediliyor...');
    const healthResponse = await fetch(`${API_BASE}/api/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // 2. Analytics log gönder
    console.log('\n2️⃣ Analytics log gönderiliyor...');
    const logResponse = await fetch(`${API_BASE}/api/analytics/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testLogData)
    });
    const logData = await logResponse.json();
    console.log('✅ Log gönderildi:', logData);

    // 3. Dashboard verilerini al
    console.log('\n3️⃣ Dashboard verileri alınıyor...');
    const dashboardResponse = await fetch(`${API_BASE}/api/analytics/dashboard?period=1d`);
    const dashboardData = await dashboardResponse.json();
    console.log('✅ Dashboard verileri:', {
      period: dashboardData.period,
      stats: dashboardData.stats,
      browserCount: dashboardData.browserStats?.length || 0,
      osCount: dashboardData.osStats?.length || 0
    });

    // 4. Son logları al
    console.log('\n4️⃣ Son loglar alınıyor...');
    const recentResponse = await fetch(`${API_BASE}/api/analytics/recent-logs?limit=5`);
    const recentData = await recentResponse.json();
    console.log('✅ Son loglar:', recentData.length, 'log bulundu');

    // 5. Test IP logları
    console.log('\n5️⃣ Test IP logları alınıyor...');
    const ipResponse = await fetch(`${API_BASE}/api/analytics/ip/127.0.0.1?limit=5`);
    const ipData = await ipResponse.json();
    console.log('✅ IP logları:', ipData.length, 'log bulundu');

    console.log('\n🎉 Tüm testler başarılı!');

  } catch (error) {
    console.error('❌ Test hatası:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Backend sunucusunun çalıştığından emin olun:');
      console.log('   cd backend && npm start');
    }
  }
}

// Test'i çalıştır
testAnalytics(); 