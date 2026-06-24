<template>
  <footer class="relative bg-sky-950 overflow-hidden py-5">
    <!-- Glow Backgrounds -->
    <div class="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[140px] -top-[100px] -left-[150px]"></div>
    <div class="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[140px] -bottom-[100px] -right-[150px]"></div>
    
    <!-- Animated Orbs -->
    <div class="absolute top-1/4 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
    <div class="absolute bottom-1/3 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

    <div class="relative max-w-7xl mx-auto px-1  z-10">
      
      <!-- Hero Card -->
      <div class="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-2 backdrop-blur-xl mb-20 overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div class="relative flex flex-col lg:flex-row justify-between gap-3">
          <!-- Brand Side -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-sky-800 to-cyan-900 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative w-14 h-14 bg-gradient-to-br from-sky-500 to-cyan-800 rounded-2xl flex items-center justify-center shadow-2xl">
                <span class="text-xl font-black text-white">B</span>
              </div>
            </div>
            
            <div>
              <h6 class="text-sm font-bold text-white  bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                VetisBet
              </h6>
              <p class="text-slate-400 text-sm lg:text-base">
                Premium Sportsbook Experience For Modern Players
              </p>
            </div>
          </div>

         <!-- Stats -->
          <div class="stats-grid ">
           <div class="flex justify-between gap-1.5">
            <div class=" flex-1 relative group/stat bg-white/5 border border-white/10 rounded-md p-2 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
              <h6 class="text-l font-extrabold text-white ">Instant</h6>
              <span class="text-slate-400 text-sm">Withdrawals</span>
            </div>

            <div class=" flex-1 relative group/stat bg-white/5 border border-white/10 rounded-md p-2 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
              <h6 class="text-l font-extrabold text-white ">24/7</h6>
              <span class="text-slate-400 text-sm">Live Support</span>
            </div>
           </div>

            <div class="relative group/stat bg-white/5 border border-white/10 rounded-md p-2 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity"></div>
              <h6 class="text-l font-extrabold text-white mb-1">100%</h6>
              <span class="text-slate-400 text-sm">Secure Platform</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2  gap-5 px-2 ">
        
        <!-- About Column -->
        <div class="space-y-2">
          <h3 class="text-l font-bold text-white relative inline-block">
            About Platform
            <div class="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
          </h3>
          
          <p class="text-slate-400 leading-relaxed">
            VetisBet provides a world-class betting experience with fast payouts, secure transactions, live betting markets, and premium gaming technology.
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


          <!-- Payment Methods -->
      <div class="mb-3">
        <div class="text-center mb-8">
          <h3 class="text-l font-bold text-white mb-2">Payment Methods</h3>
          <p class="text-slate-400 text-sm">Fast deposits and withdrawals supported</p>
        </div>
        
        <div class="flex flex-wrap justify-center gap-4">
          <div class="px-2 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            M-Pesa
          </div>
          <div class="px-2 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            Airtel Money
          </div>
          <div class="px-2 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            Mixx
          </div>
          <div class="px-2 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            HaloPesa
          </div>
          <div class="px-2 py-2 text-sm bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
            T-Pesa
          </div>
        </div>
      </div>


      

      
      
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2  gap-5 px-2 mt-3 ">

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
       
        </div>


      <!-- Contact Column -->
      <div class="">
          <h6 class="text-l font-bold text-white mb-6 relative inline-block">
            Contact
            <div class="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
          </h6>
          
          <div class="bg-white/5 border border-white/10 rounded-2xl px-2 py-1">
            
            <!-- Support 24/7 Section -->
            <div class="flex flex-col py-4">
              <div class="flex flex-col">
                <div class="flex  gap-2">
                    <span class="text-slate-400 text-sm  tracking-wider">Support</span>
                    <h6 class="text-sm  font-bold text-white  px-4 bg-sky-500 rounded-2xl">24/7</h6>
                </div>
                <p class="text-slate-400 text-xs">Contact us if you still have questions</p>
              
              </div>
              <button class="w-full mt-2 px-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-black font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-80">
                Contact support
              </button>
            </div>

            <!-- Divider -->
            <div class="border-t border-white/10"></div>

            <!-- Commercial Offers -->
            <div>
              <span class="text-slate-400 text-sm  tracking-wider">Commercial offers</span>
              <a href="mailto:business@vetisbet.com" class="text-white block mt-2 text-xs hover:text-emerald-400 transition-colors break-all">
                business@vetisbet.com
              </a>
            </div>

            <!-- Partner Program -->
            <div>
              <span class="text-slate-400 text-sm  tracking-wider">Partner program</span>
              <a href="mailto:partners@vetisbet.com" class="text-white block mt-2 text-xs hover:text-emerald-400 transition-colors break-all">
                partners@vetisbet.com
              </a>
            </div>

          </div>
        </div>

     

   
      <!-- Bottom Bar -->
      <div class="py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-slate-500 text-sm">
          © 2026 VetisBet. All rights reserved.
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