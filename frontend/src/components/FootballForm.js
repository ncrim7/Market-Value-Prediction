import React, { useState } from 'react';
import QuickFillButtons from './QuickFillButtons';

const FootballForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    Yaş: '',
    Maç: '',
    Gol: '',
    Asist: '',
    Şut_Maç: '',
    İsabetli_Şut_Maç: '',
    Pas: '',
    Dribbling_Maç: '',
    Top_Kazanma_Maç: '',
    Hava_Topu_Kazanma_Maç: '',
    İkili_Mücadele_Kazanma_Maç: '',
    Başarılı_Pas_Maç: '',
    İsabetli_Orta_Maç: '',
    Ülke_encoded: '',
    Takım_encoded: '',
    Pozisyon_encoded: ''
  });

  const [errors, setErrors] = useState({});

  // Form validation
  const validateForm = (data) => {
    const newErrors = {};
    
    if (data.Yaş < 16 || data.Yaş > 45 || isNaN(data.Yaş)) {
      newErrors.Yaş = 'Yaş 16-45 arasında olmalı';
    }
    
    if (data.Pas < 0 || data.Pas > 100 || isNaN(data.Pas)) {
      newErrors.Pas = 'Pas başarısı 0-100 arasında olmalı';
    }
    
    if (data.İkili_Mücadele_Kazanma_Maç < 0 || data.İkili_Mücadele_Kazanma_Maç > 100 || isNaN(data.İkili_Mücadele_Kazanma_Maç)) {
      newErrors.İkili_Mücadele_Kazanma_Maç = 'İkili mücadele kazanma 0-100 arasında olmalı';
    }

    const positiveFields = ['Maç', 'Gol', 'Asist', 'Şut_Maç', 'İsabetli_Şut_Maç', 
                           'Dribbling_Maç', 'Top_Kazanma_Maç', 'Hava_Topu_Kazanma_Maç',
                           'Başarılı_Pas_Maç', 'İsabetli_Orta_Maç', 'Ülke_encoded', 'Takım_encoded', 'Pozisyon_encoded'];
    
    positiveFields.forEach(field => {
      if (data[field] < 0 || isNaN(data[field])) {
        newErrors[field] = 'Bu alan 0 veya pozitif olmalı';
      }
    });

    return newErrors;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert to numbers
    const processedData = Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: parseFloat(formData[key])
    }), {});
    
    // Validate
    const formErrors = validateForm(processedData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onSubmit(processedData);
  };

  // Fill sample data
  const fillSampleData = (data) => {
    setFormData(data);
    setErrors({});
  };

  // Clear form
  const clearForm = () => {
    setFormData(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: '' }), {}));
    setErrors({});
  };

  return (
    <div className="bg-white/8 backdrop-blur-3xl rounded-3xl p-8 border border-white/15 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-purple-300 relative">
        📊 Oyuncu Verilerini Girin
        <div className="absolute bottom-0 left-0 w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
      </h2>
      
      {/* Quick Fill Buttons */}
      <QuickFillButtons onFillData={fillSampleData} onClearForm={clearForm} />

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {Object.keys(formData).map((field) => (
            <div key={field} className="space-y-2">
              <label className="block text-sm font-medium text-white/90 tracking-wide">
                {field.replace('_', ' ')}
              </label>
              <input
                type="number"
                step="any"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 bg-white/5 border-2 rounded-xl text-white font-medium transition-all duration-300 backdrop-blur-lg ${
                  errors[field] 
                    ? 'border-red-500 shadow-red-500/20 shadow-lg' 
                    : 'border-white/15 focus:border-blue-500 focus:shadow-blue-500/20 focus:shadow-lg focus:-translate-y-1'
                }`}
                placeholder="0"
              />
              {errors[field] && (
                <p className="text-red-400 text-sm">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white font-bold text-lg uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
          <span className="relative z-10">
            {loading ? '⏳ Hesaplanıyor...' : '🔮 Piyasa Değerini Tahmin Et'}
          </span>
          {!loading && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default FootballForm;