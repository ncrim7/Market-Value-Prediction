import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/analytics/dashboard?period=${period}`);
      
      if (!response.ok) {
        throw new Error('Analytics verileri alınamadı');
      }
      
      const data = await response.json();
      setAnalyticsData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Analytics veri hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('tr-TR').format(num);
  };

  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${((value / total) * 100).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="bg-white/8 backdrop-blur-3xl rounded-3xl p-8 border border-white/15 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-white/10 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/8 backdrop-blur-3xl rounded-3xl p-8 border border-white/15 shadow-2xl">
        <div className="text-center text-red-400">
          <h3 className="text-xl font-bold mb-2">📊 Analytics Dashboard</h3>
          <p>Hata: {error}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const { stats, browserStats, osStats, countryStats, hourlyActivity } = analyticsData;

  return (
    <div className="bg-white/8 backdrop-blur-3xl rounded-3xl p-8 border border-white/15 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h3 className="text-2xl font-bold text-purple-300 mb-4 md:mb-0">
          📊 Analytics Dashboard
        </h3>
        <div className="flex space-x-2">
          {['1d', '7d', '30d'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                period === p 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {p === '1d' ? '1 Gün' : p === '7d' ? '7 Gün' : '30 Gün'}
            </button>
          ))}
        </div>
      </div>

      {/* Temel İstatistikler */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-green-400">
            {formatNumber(stats.totalVisits)}
          </div>
          <div className="text-sm opacity-70">Toplam Ziyaret</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-blue-400">
            {formatNumber(stats.uniqueVisitors)}
          </div>
          <div className="text-sm opacity-70">Benzersiz Ziyaretçi</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-yellow-400">
            {formatNumber(stats.formSubmissions)}
          </div>
          <div className="text-sm opacity-70">Form Gönderimi</div>
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="text-2xl font-bold text-purple-400">
            {formatNumber(stats.predictions)}
          </div>
          <div className="text-sm opacity-70">Tahmin</div>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Tarayıcı Dağılımı */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-bold mb-4 text-purple-300">🌐 Tarayıcı Dağılımı</h4>
          <div className="space-y-3">
            {browserStats.map((browser, index) => (
              <div key={browser._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" 
                       style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}></div>
                  <span className="text-sm">{browser._id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(browser.count / stats.totalVisits) * 100}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {formatPercentage(browser.count, stats.totalVisits)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* İşletim Sistemi Dağılımı */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-bold mb-4 text-purple-300">💻 İşletim Sistemi</h4>
          <div className="space-y-3">
            {osStats.map((os, index) => (
              <div key={os._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" 
                       style={{ backgroundColor: `hsl(${index * 45 + 180}, 70%, 60%)` }}></div>
                  <span className="text-sm">{os._id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(os.count / stats.totalVisits) * 100}%`,
                        backgroundColor: `hsl(${index * 45 + 180}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-12 text-right">
                    {formatPercentage(os.count, stats.totalVisits)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ülke Dağılımı */}
      {countryStats.length > 0 && (
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-bold mb-4 text-purple-300">🌍 Ülke Dağılımı</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {countryStats.map((country, index) => (
              <div key={country._id} className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {formatNumber(country.count)}
                </div>
                <div className="text-sm opacity-70">{country._id}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saatlik Aktivite */}
      {hourlyActivity.length > 0 && (
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h4 className="text-lg font-bold mb-4 text-purple-300">⏰ Saatlik Aktivite</h4>
          <div className="flex items-end justify-between h-32 space-x-1">
            {hourlyActivity.map((hour) => {
              const maxCount = Math.max(...hourlyActivity.map(h => h.count));
              const height = maxCount > 0 ? (hour.count / maxCount) * 100 : 0;
              
              return (
                <div key={hour._id} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-purple-500 rounded-t transition-all duration-500"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs mt-2 opacity-70">{hour._id}:00</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Performans Metrikleri */}
      <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
        <h4 className="text-lg font-bold mb-4 text-purple-300">⚡ Performans</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {stats.avgResponseTime.toFixed(0)}ms
            </div>
            <div className="text-sm opacity-70">Ortalama Yanıt Süresi</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats.totalVisits > 0 ? ((stats.formSubmissions / stats.totalVisits) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm opacity-70">Dönüşüm Oranı</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 