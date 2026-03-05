<template>
    <div class="betnova-container">
      <!-- Header -->
      <div class="header">
        <div class="logo-section">
          <h1 class="logo">BetNova</h1>
          <span class="tsh">TSH 3,780.25</span>
        </div>
        
        <div class="nav-tabs">
          <button class="tab active">SPORTS</button>
          <button class="tab">LIVE</button>
          <button class="tab">CASINO</button>
        </div>
      </div>
  
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-content">
          <h2 class="hero-title">Win Big Today</h2>
          <p class="hero-subtitle">Bet on your favorite sports, win BIG, and cash out instantly!</p>
          <button class="join-btn">JOIN NOW</button>
        </div>
      </div>
  
      <!-- Categories -->
      <div class="categories">
        <span class="category active">Live</span>
        <span class="category">36</span>
        <span class="category">Premier League</span>
        <span class="category">FA Cup</span>
        <span class="category">Serie A</span>
      </div>
  
      <!-- Main Content -->
      <div class="main-content">
        <h3 class="section-title">Football</h3>
  
        <!-- Match Cards -->
        <div class="match-card">
          <div class="match-time">10:30 pm Fri 13/02</div>
          <div class="match-teams">Borussia Dortmund vs Mainz</div>
          <div class="match-league">Football / Germany / Bundesliga</div>
          
          <div class="odds-grid">
            <div class="odd-item">
              <span class="odd-label">1</span>
              <span class="odd-value">1.67</span>
              <span class="odd-icon green">🟢</span>
            </div>
            <div class="odd-item">
              <span class="odd-label">✖️</span>
              <span class="odd-value">4.48</span>
            </div>
            <div class="odd-item">
              <span class="odd-label">2</span>
              <span class="odd-value">5.28</span>
              <span class="odd-icon">⚽</span>
            </div>
            <div class="odd-item highlight">
              <span class="odd-label">🔥</span>
              <span class="odd-value">160</span>
            </div>
          </div>
        </div>
  
        <div class="match-card">
          <div class="match-time">10:45 pm Fri 13/02</div>
          <div class="match-teams">Pisa SC AC Milan</div>
          <div class="match-league">Football / Italy / Serie A</div>
          
          <div class="odds-grid">
            <div class="odd-item">
              <span class="odd-label">1</span>
              <span class="odd-value">6.95</span>
              <span class="odd-icon green">🟢</span>
            </div>
            <div class="odd-item">
              <span class="odd-label">✖️</span>
              <span class="odd-value">4.28</span>
            </div>
            <div class="odd-item">
              <span class="odd-label">2</span>
              <span class="odd-value">1.58</span>
              <span class="odd-icon">⚽</span>
            </div>
            <div class="odd-item highlight">
              <span class="odd-label">🔥</span>
              <span class="odd-value">152</span>
            </div>
          </div>
        </div>
  
        <!-- Bonus Banner -->
        <div class="bonus-banner">
          <span class="odds-highlight">Odds: 2.45</span>
          <span class="bonus-text">· Add 1 more qualifying leg for 3% Win Bonus</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BetNova'
  }
  </script>
  
  <style scoped>
  .betnova-container {
    max-width: 480px;
    margin: 0 auto;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    color: white;
  }
  
  .header {
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  
  .logo-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .logo {
    font-size: 28px;
    font-weight: bold;
    margin: 0;
    background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .tsh {
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
  }
  
  .nav-tabs {
    display: flex;
    gap: 20px;
  }
  
  .tab {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 16px;
    font-weight: 600;
    padding: 5px 0;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .tab.active {
    color: white;
    border-bottom: 3px solid #ffd700;
  }
  
  .hero-section {
    background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%);
    margin: 20px;
    border-radius: 20px;
    padding: 30px 20px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
  }
  
  .hero-title {
    font-size: 32px;
    font-weight: bold;
    margin: 0 0 10px 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .hero-subtitle {
    font-size: 16px;
    margin: 0 0 20px 0;
    opacity: 0.9;
  }
  
  .join-btn {
    background: white;
    color: #764ba2;
    border: none;
    padding: 12px 30px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .join-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  
  .categories {
    display: flex;
    gap: 15px;
    padding: 0 20px;
    margin-bottom: 20px;
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  
  .category {
    background: rgba(255, 255, 255, 0.1);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .category.active {
    background: #ffd700;
    color: #764ba2;
    font-weight: 600;
  }
  
  .main-content {
    padding: 0 20px;
  }
  
  .section-title {
    font-size: 20px;
    margin: 0 0 15px 0;
    font-weight: 600;
  }
  
  .match-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 15px;
    margin-bottom: 15px;
    transition: all 0.3s ease;
  }
  
  .match-card:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  .match-time {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 5px;
  }
  
  .match-teams {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .match-league {
    font-size: 12px;
    opacity: 0.7;
    margin-bottom: 15px;
  }
  
  .odds-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  
  .odd-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px 5px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  
  .odd-item:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .odd-item.highlight {
    background: rgba(255, 215, 0, 0.3);
    border: 1px solid #ffd700;
  }
  
  .odd-label {
    font-size: 14px;
    font-weight: 600;
  }
  
  .odd-value {
    font-size: 16px;
    font-weight: bold;
  }
  
  .odd-icon {
    font-size: 16px;
  }
  
  .odd-icon.green {
    color: #4caf50;
  }
  
  .bonus-banner {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 10px;
    padding: 15px;
    margin: 20px 0;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
  }
  
  .odds-highlight {
    color: #ffd700;
  }
  
  .bonus-text {
    opacity: 0.9;
  }
  </style>