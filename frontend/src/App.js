import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import FootballForm from './components/FootballForm';
import ResultCard from './components/ResultCard';
import InfoGrid from './components/InfoGrid';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);

  // API base URL - production'da environment variable kullanın
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle form submission
  const handlePrediction = async (formData) => {
    setLoading(true);
    
    try {
      const response = await fetch(`https://market-value-prediction-backend.onrender.com/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.predicted_market_value !== undefined) {
        const newResult = {
          value: data.predicted_market_value,
          confidence: data.confidence || 95,
          timestamp: new Date()
        };
        
        setResult(newResult);
        
        // Save to history
        const newPrediction = {
          id: Date.now(),
          data: formData,
          result: data.predicted_market_value,
          timestamp: new Date()
        };
        setPredictions(prev => [newPrediction, ...prev.slice(0, 4)]);
      } else {
        throw new Error('Geçersiz API yanıtı');
      }
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'API sunucusuna bağlanılamıyor.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      }
      
      setResult({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Fetch prediction history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`https://market-value-prediction-backend.onrender.com/api/predictions/history`);
        if (response.ok) {
          const data = await response.json();
          setPredictions(data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, [API_BASE]);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" 
         style={{
           background: 'linear-gradient(135deg, #0f0c29 0%, #24243e 35%, #302b63 100%)'
         }}>
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-30"
           style={{
             background: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),\n                         radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),\n                         radial-gradient(circle at 40% 40%, rgba(120, 119, 255, 0.2) 0%, transparent 50%)`,
             animation: 'float 20s ease-in-out infinite'
           }}>
      </div>

      {/* Header */}
      <Header />

      <div className="relative z-10 max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          
          {/* Form Section */}
          <div className="lg:col-span-2">
            <FootballForm onSubmit={handlePrediction} loading={loading} />
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <ResultCard 
              result={result} 
              loading={loading} 
              formatCurrency={formatCurrency}
            />
          </div>
        </div>

        {/* Prediction History */}
        {predictions.length > 0 && (
          <div className="bg-white/8 backdrop-blur-3xl rounded-3xl p-8 border border-white/15 shadow-2xl mb-10">
            <h3 className="text-2xl font-bold mb-6 text-purple-300">📊 Son Tahminler</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictions.map((prediction) => (
                <div key={prediction.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="text-lg font-bold text-green-400 mb-2">
                    {formatCurrency(prediction.result)}
                  </div>
                  <div className="text-sm opacity-70 mb-2">
                    Yaş: {prediction.data?.Yaş}, Gol: {prediction.data?.Gol}, Asist: {prediction.data?.Asist}
                  </div>
                  <div className="text-xs opacity-50">
                    {formatDate(prediction.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feature Grid */}
        <InfoGrid />
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}

export default App;
