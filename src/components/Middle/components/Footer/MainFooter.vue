<template>
  <footer class="footer">

    <!-- Glow Background -->
    <div class="footer-glow left"></div>
    <div class="footer-glow right"></div>

    <div class="container">

      <!-- TOP HERO -->
      <div class="hero-card">

        <div class="hero-content">

          <!-- LEFT -->
          <div class="brand-side">

            <div class="logo-box">
              <span>B</span>
            </div>

            <div>
              <h1>BetNover</h1>
              <p>
                Premium Sportsbook Experience For Modern Players
              </p>
            </div>

          </div>

          <!-- RIGHT -->
          <div class="hero-stats">

            <div class="stat">
              <h2>Instant</h2>
              <span>Withdrawals</span>
            </div>

            <div class="stat">
              <h2>24/7</h2>
              <span>Live Support</span>
            </div>

            <div class="stat">
              <h2>100%</h2>
              <span>Secure Platform</span>
            </div>

          </div>

        </div>

      </div>

      <!-- MAIN -->
      <div class="footer-grid">

        <!-- ABOUT -->
        <div>

          <h3 class="title">
            About Platform
          </h3>

          <p class="description">
            BetNover provides a world-class betting experience with
            fast payouts, secure transactions, live betting markets,
            and premium gaming technology.
          </p>

          <!-- SOCIAL -->
          <div class="socials">

            <a href="#">
              <i class="fab fa-instagram"></i>
            </a>

            <a href="#">
              <i class="fab fa-telegram-plane"></i>
            </a>

            <a href="#">
              <i class="fab fa-facebook-f"></i>
            </a>

            <a href="#">
              <i class="fab fa-x-twitter"></i>
            </a>

          </div>

        </div>

        <!-- COMPANY -->
        <div>

          <h3 class="title">
            Company
          </h3>

          <ul class="links">

            <li>
              <a href="#">
                About Us
              </a>
            </li>

            <li>
              <a href="#">
                Terms & Conditions
              </a>
            </li>

            <li>
              <a href="#">
                Privacy Policy
              </a>
            </li>

            <li>
              <a href="#">
                Responsible Gaming
              </a>
            </li>

          </ul>

        </div>

        <!-- PRODUCTS -->
        <div>

          <h3 class="title">
            Products
          </h3>

          <ul class="links">

            <li>
              <a href="#">
                Sports Betting
              </a>
            </li>

            <li>
              <a href="#">
                Live Betting
              </a>
            </li>

            <li>
              <a href="#">
                Virtual Games
              </a>
            </li>

            <li>
              <a href="#">
                Jackpot
              </a>
            </li>

          </ul>

        </div>

        <!-- CONTACT -->
        <div>

          <h3 class="title">
            Contact
          </h3>

          <div class="contact-card">

            <div class="contact-item">
              <span>Email</span>

              <a href="mailto:support@betnover.com">
                support@betnover.com
              </a>
            </div>

            <div class="contact-item">
              <span>Status</span>

              <p>
                All systems operational
              </p>
            </div>

            <div class="contact-item">
              <span>Support</span>

              <p>
                Available 24/7
              </p>
            </div>

          </div>

        </div>

      </div>

      <!-- PAYMENTS -->
      <div class="payments-section">

        <div class="payments-header">

          <h3>
            Payment Methods
          </h3>

          <p>
            Fast deposits and withdrawals supported
          </p>

        </div>

        <div class="payments">

          <div class="payment">M-Pesa</div>
          <div class="payment">Airtel Money</div>
          <div class="payment">Mixx</div>
          <div class="payment">HaloPesa</div>
          <div class="payment">T-Pesa</div>

        </div>

      </div>

      <!-- RESPONSIBLE -->
      <div class="warning-box">

        <div class="warning-icon">
          !
        </div>

        <div>

          <h4>
            Responsible Gaming
          </h4>

          <p>
            Betting is intended for users aged 18 and above.
            Please play responsibly and only bet what you can afford to lose.
          </p>

        </div>

      </div>

      <!-- BOTTOM -->
      <div class="bottom-bar">

        <p>
          © 2026 BetNover. All rights reserved.
        </p>

        <div class="bottom-links">

          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Security</a>

        </div>

      </div>

    </div>

  </footer>
</template>

<style scoped lang="scss">

.footer {
  position: relative;
  background: #040816;
  overflow: hidden;
  padding-top: 80px;
}

.container {
  max-width: 1280px;
  margin: auto;
  padding: 0 24px;
  position: relative;
  z-index: 2;
}

/* GLOWS */

.footer-glow {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 999px;
  filter: blur(140px);
}

.footer-glow.left {
  background: rgba(16, 185, 129, 0.15);
  top: -100px;
  left: -150px;
}

.footer-glow.right {
  background: rgba(6, 182, 212, 0.15);
  bottom: -100px;
  right: -150px;
}

/* HERO */

.hero-card {
  background: linear-gradient(
    135deg,
    rgba(255,255,255,0.06),
    rgba(255,255,255,0.02)
  );

  border: 1px solid rgba(255,255,255,0.08);

  border-radius: 32px;

  padding: 40px;

  backdrop-filter: blur(20px);

  margin-bottom: 80px;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}

.brand-side {
  display: flex;
  gap: 20px;
  align-items: center;
}

.logo-box {
  width: 72px;
  height: 72px;
  border-radius: 24px;

  background: linear-gradient(
    135deg,
    #10b981,
    #06b6d4
  );

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 32px;
  font-weight: 900;
  color: black;

  box-shadow: 0 20px 60px rgba(16,185,129,.4);
}

.brand-side h1 {
  font-size: 36px;
  font-weight: 800;
}

.brand-side p {
  color: #94a3b8;
  margin-top: 6px;
}

.hero-stats {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.stat {
  min-width: 140px;

  padding: 20px;

  border-radius: 22px;

  background: rgba(255,255,255,.04);

  border: 1px solid rgba(255,255,255,.06);
}

.stat h2 {
  font-size: 28px;
  color: white;
  font-weight: 800;
}

.stat span {
  color: #94a3b8;
  font-size: 14px;
}

/* GRID */

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 50px;
}

.title {
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
}

.description {
  color: #94a3b8;
  line-height: 1.9;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.links a {
  color: #94a3b8;
  transition: .3s;
}

.links a:hover {
  color: white;
  transform: translateX(6px);
}

.socials {
  display: flex;
  gap: 14px;
  margin-top: 28px;
}

.socials a {
  width: 46px;
  height: 46px;

  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255,255,255,.04);

  border: 1px solid rgba(255,255,255,.08);

  color: #cbd5e1;

  transition: .3s;
}

.socials a:hover {
  transform: translateY(-5px);
  background: #10b981;
  color: black;
}

/* CONTACT */

.contact-card {
  padding: 24px;
  border-radius: 24px;

  background: rgba(255,255,255,.03);

  border: 1px solid rgba(255,255,255,.08);
}

.contact-item {
  margin-bottom: 24px;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-item span {
  display: block;
  color: #64748b;
  margin-bottom: 8px;
  font-size: 13px;
}

.contact-item a,
.contact-item p {
  color: white;
}

/* PAYMENTS */

.payments-section {
  margin-top: 90px;
}

.payments-header h3 {
  font-size: 24px;
  font-weight: 700;
}

.payments-header p {
  color: #94a3b8;
  margin-top: 8px;
}

.payments {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  margin-top: 30px;
}

.payment {
  padding: 16px 24px;

  border-radius: 20px;

  background: rgba(255,255,255,.04);

  border: 1px solid rgba(255,255,255,.08);

  color: white;

  transition: .3s;
}

.payment:hover {
  border-color: #10b981;
  transform: translateY(-3px);
}

/* WARNING */

.warning-box {
  margin-top: 80px;

  padding: 30px;

  border-radius: 28px;

  display: flex;
  gap: 20px;

  background: linear-gradient(
    135deg,
    rgba(245,158,11,.12),
    rgba(249,115,22,.08)
  );

  border: 1px solid rgba(245,158,11,.2);
}

.warning-icon {
  width: 54px;
  height: 54px;

  border-radius: 18px;

  background: rgba(245,158,11,.2);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
  font-weight: 800;

  color: #facc15;

  flex-shrink: 0;
}

.warning-box h4 {
  color: white;
  font-size: 18px;
  margin-bottom: 8px;
}

.warning-box p {
  color: #cbd5e1;
  line-height: 1.8;
}

/* BOTTOM */

.bottom-bar {
  margin-top: 70px;
  padding: 30px 0;

  border-top: 1px solid rgba(255,255,255,.08);

  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.bottom-bar p {
  color: #64748b;
}

.bottom-links {
  display: flex;
  gap: 24px;
}

.bottom-links a {
  color: #94a3b8;
  transition: .3s;
}

.bottom-links a:hover {
  color: white;
}

/* MOBILE */

@media(max-width: 991px){

  .footer-grid {
    grid-template-columns: repeat(2,1fr);
  }

}

@media(max-width: 640px){

  .hero-card {
    padding: 28px;
  }

  .brand-side h1 {
    font-size: 28px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    width: 100%;
  }

  .stat {
    flex: 1;
  }

  .warning-box {
    flex-direction: column;
  }

  .bottom-bar {
    flex-direction: column;
    text-align: center;
  }

}

</style>