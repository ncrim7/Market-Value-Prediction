// Kullanıcı analitik bilgilerini toplama utility'si
export class UserAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userAgent = navigator.userAgent;
    this.language = navigator.language;
    this.screenResolution = `${screen.width}x${screen.height}`;
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.timestamp = new Date().toISOString();
  }

  // Benzersiz session ID oluştur
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Tarayıcı bilgilerini al
  getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    let version = 'Unknown';

    // Chrome
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browser = 'Chrome';
      version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    }
    // Firefox
    else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    }
    // Safari
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
      version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    }
    // Edge
    else if (userAgent.includes('Edg')) {
      browser = 'Edge';
      version = userAgent.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
    }

    return { browser, version };
  }

  // İşletim sistemi bilgilerini al
  getOSInfo() {
    const userAgent = navigator.userAgent;
    let os = 'Unknown';

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

    return { os };
  }

  // Sayfa görüntüleme bilgilerini al
  getPageInfo() {
    return {
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
      pathname: window.location.pathname
    };
  }

  // Tüm kullanıcı bilgilerini topla
  collectUserData() {
    const browserInfo = this.getBrowserInfo();
    const osInfo = this.getOSInfo();
    const pageInfo = this.getPageInfo();

    return {
      sessionId: this.sessionId,
      timestamp: this.timestamp,
      userAgent: this.userAgent,
      browser: browserInfo.browser,
      browserVersion: browserInfo.version,
      os: osInfo.os,
      language: this.language,
      screenResolution: this.screenResolution,
      timezone: this.timezone,
      url: pageInfo.url,
      referrer: pageInfo.referrer,
      pageTitle: pageInfo.title,
      pathname: pageInfo.pathname,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      cookiesEnabled: navigator.cookieEnabled,
      online: navigator.onLine,
      doNotTrack: navigator.doNotTrack
    };
  }

  // Sunucuya log gönder
  async sendLog(action, additionalData = {}) {
    const userData = this.collectUserData();
    const logData = {
      ...userData,
      action,
      ...additionalData
    };

    try {
      const response = await fetch('/api/analytics/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData)
      });

      if (!response.ok) {
        console.warn('Analytics log gönderilemedi:', response.status);
      }
    } catch (error) {
      console.warn('Analytics log hatası:', error);
    }
  }

  // Sayfa yüklendiğinde log gönder
  logPageView() {
    this.sendLog('page_view');
  }

  // Form gönderildiğinde log gönder
  logFormSubmission(formData) {
    this.sendLog('form_submission', {
      formType: 'football_prediction',
      hasData: !!formData
    });
  }

  // Tahmin sonucu log gönder
  logPredictionResult(success, errorMessage = null) {
    this.sendLog('prediction_result', {
      success,
      errorMessage
    });
  }

  // Buton tıklama log gönder
  logButtonClick(buttonName) {
    this.sendLog('button_click', {
      buttonName
    });
  }
}

// Global analytics instance
export const analytics = new UserAnalytics();

// Sayfa yüklendiğinde otomatik log gönder
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    analytics.logPageView();
  });
} 