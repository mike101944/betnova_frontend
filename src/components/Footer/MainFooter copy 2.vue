<template>
  <footer class="relative bg-gradient-to-b from-[#040816] to-[#0a0f2a] overflow-hidden pt-20">
    <!-- Glow Backgrounds -->
    <div class="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[140px] -top-[100px] -left-[150px]"></div>
    <div class="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px] -bottom-[100px] -right-[150px]"></div>
    
    <!-- Animated Orbs -->
    <div class="absolute top-1/4 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-1/3 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

    <div class="relative max-w-7xl mx-auto px-6 lg:px-8 z-10">
      
      <!-- Hero Card -->
      <div class="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-8 lg:p-12 backdrop-blur-xl mb-20 overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div class="relative flex flex-col lg:flex-row justify-between gap-8">
          <!-- Brand Side -->
          <div class="flex items-center gap-6">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <span class="text-3xl font-black text-black">B</span>
              </div>
            </div>
            
            <div>
              <h4 class="text-3xl lg:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                BetNover
              </h4>
              <p class="text-slate-400 text-sm lg:text-base">
                Premium Sportsbook Experience For Modern Players
              </p>
            </div>
          </div>

         <!-- Stats -->
          <div class="stats-grid ">
           <div class="flex justify-between">
            <div class="relative group/stat bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
              <h6 class="text-l font-extrabold text-white mb-1">Instant</h6>
              <span class="text-slate-400 text-sm">Withdrawals</span>
            </div>

            <div class="relative group/stat bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
              <h2 class="text-l font-extrabold text-white mb-1">24/7</h2>
              <span class="text-slate-400 text-sm">Live Support</span>
            </div>
           </div>

            <div class="relative group/stat bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
              <h2 class="text-l font-extrabold text-white mb-1">100%</h2>
              <span class="text-slate-400 text-sm">Secure Platform</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
        
        <!-- About Column -->
        <div class="space-y-6">
          <h3 class="text-lg font-bold text-white relative inline-block">
            About Platform
            <div class="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
          </h3>
          
          <p class="text-slate-400 leading-relaxed">
            BetNover provides a world-class betting experience with fast payouts, secure transactions, live betting markets, and premium gaming technology.
          </p>

          <div class="flex gap-3 pt-4">
            <a href="#" class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300">
              <i class="fab fa-instagram text-lg"></i>
            </a>
            <a href="#" class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300">
              <i class="fab fa-telegram-plane text-lg"></i>
            </a>
            <a href="#" class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300">
              <i class="fab fa-facebook-f text-lg"></i>
            </a>
            <a href="#" class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300">
              <i class="fab fa-x-twitter text-lg"></i>
            </a>
          </div>
        </div>

        <!-- Company Column -->
        <div>
          <h3 class="text-lg font-bold text-white mb-6 relative inline-block">
            Company
            <div class="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
          </h3>
          
          <ul class="space-y-3 flex gap-1">
            <li><a href="#" class="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">About Us</a></li>
            <li><a href="#" class="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">Terms & Conditions</a></li>
            <li><a href="#" class="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">Privacy Policy</a></li>
            <li><a href="#" class="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">Responsible Gaming</a></li>
          </ul>
        </div>

        <!-- Products Column -->
        <div>
          <h3 class="text-lg font-bold text-white mb-6 relative inline-block">
            Products
            <div class="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
          </h3>
          
          <ul class="space-y-3 flex gap-1">
            <li><a href="#" class="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">Sports Betting</a></li>
            <li><a href="#" class="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">Live Betting</a></li>
            <li><a href="#" class="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">Virtual Games</a></li>
            <li><a href="#" class="text-slate-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block">Jackpot</a></li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div>
          <h3 class="text-lg font-bold text-white mb-6 relative inline-block">
            Contact
            <div class="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
          </h3>
          
          <div class="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
            <div>
              <span class="text-slate-500 text-xs uppercase tracking-wider">Email</span>
              <a href="mailto:support@betnover.com" class="text-white block mt-1 hover:text-emerald-400 transition-colors">
                support@betnover.com
              </a>
            </div>
            
            <div>
              <span class="text-slate-500 text-xs uppercase tracking-wider">Status</span>
              <div class="flex items-center gap-2 mt-1">
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p class="text-white">All systems operational</p>
              </div>
            </div>
            
            <div>
              <span class="text-slate-500 text-xs uppercase tracking-wider">Support</span>
              <p class="text-white mt-1">Available 24/7</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="mb-16">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-white mb-2">Payment Methods</h3>
          <p class="text-slate-400">Fast deposits and withdrawals supported</p>
        </div>
        
        <div class="flex flex-wrap justify-center gap-4">
          <div class="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            M-Pesa
          </div>
          <div class="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            Airtel Money
          </div>
          <div class="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            Mixx
          </div>
          <div class="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            HaloPesa
          </div>
          <div class="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            T-Pesa
          </div>
        </div>
      </div>

      <!-- Warning Box -->
      <div class="relative bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-8 mb-16 overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="relative flex flex-col md:flex-row gap-6 items-start">
          <div class="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <span class="text-2xl font-black text-amber-400">!</span>
          </div>
          
          <div>
            <h4 class="text-xl font-bold text-white mb-2">Responsible Gaming</h4>
            <p class="text-slate-300 leading-relaxed">
              Betting is intended for users aged 18 and above. Please play responsibly and only bet what you can afford to lose.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-slate-500 text-sm">
          © 2026 BetNover. All rights reserved.
        </p>
        
        <div class="flex gap-6">
          <a href="#" class="text-slate-400 text-sm hover:text-white transition-colors">Terms</a>
          <a href="#" class="text-slate-400 text-sm hover:text-white transition-colors">Privacy</a>
          <a href="#" class="text-slate-400 text-sm hover:text-white transition-colors">Security</a>
        </div>
      </div>

    </div>
  </footer>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}

.stats-grid {
  display: grid;
  gap: 1rem; /* gap-4 */
}

/* Mobile (default) - column 1 moja */
.stats-grid {
  grid-template-columns: 1fr;
}

/* Tablet medium (640px - 1023px) - row 1: columns 2, row 2: column 1 centered */
@media (min-width: 640px) and (max-width: 1023px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Element ya tatu iwe kwenye row ya pili na icolumns 2 zote */
  .stats-grid > :nth-child(3) {
    grid-column: span 2;
    justify-self: center;
    max-width: 50%;
    width: 100%;
  }
}

/* Desktop large (1024px+) - columns 3 */
@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .stats-grid > :nth-child(3) {
    grid-column: auto;
    max-width: none;
  }
}
</style>