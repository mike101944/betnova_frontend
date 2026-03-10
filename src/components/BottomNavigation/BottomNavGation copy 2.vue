<template>
  <div class="bottom-navigation-wrapper fixed bottom-0 left-0 right-0  h-[90px]">
    <div class="bottom-navigation relative w-full h-[90px] bg-[#252a2d]">
      
     

      <!-- Navigation Menu -->
      <div class="navigation-menu flex justify-between w-full h-[65px]  bottom-0 left-0 bg-transparent">
        
        <!-- Menu Item -->
        <div class="navigation-item flex-1 h-full bg-[#252a2d] text-[#aaaeb0] text-center pt-2 pb-3 text-xs font-normal">
          <div class="menu-item flex flex-col justify-center items-center h-full w-full">
            <a class="action-link flex flex-col items-center justify-center w-full h-full text-inherit cursor-pointer no-underline">
              <svg class="menu-icon w-[22px] h-[22px] fill-[#aaaeb0] mb-1">
                <rect x="4" y="6" width="16" height="2" fill="currentColor"/>
                <rect x="4" y="11" width="16" height="2" fill="currentColor"/>
                <rect x="4" y="16" width="16" height="2" fill="currentColor"/>
              </svg>
              <div class="menu-title text-[#aaaeb0] text-[11px] leading-[14px] mt-0.5">Menu</div>
            </a>
          </div>
        </div>

        <!-- Sports Item -->
        <div class="navigation-item flex-1 h-full bg-[#252a2d] text-[#aaaeb0] text-center pt-2 pb-3 text-xs font-normal">
          <div class="menu-item flex flex-col justify-center items-center h-full w-full">
            <router-link to="/" class="action-link flex flex-col items-center justify-center w-full h-full text-inherit cursor-pointer no-underline">
              <svg class="menu-icon w-[22px] h-[22px] fill-[#aaaeb0] mb-1" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M12 4v8l5 3" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
              <div class="menu-title text-[#aaaeb0] text-[11px] leading-[14px] mt-0.5">Sports</div>
            </router-link>
          </div>
        </div>

        <!-- Betslip Item (Center) -->
        <div class="navigation-item flex-1 h-full bg-transparent relative">
          <div class="circle-menu relative w-full h-full flex top-[-12px]">
            <div class="betslip-menu absolute bottom-1 left-1/2 -translate-x-1/2 w-[68px] h-[68px] bg-[#353b40] rounded-full flex justify-center items-center">
              <div class="betslip-menu-wrapper absolute top-1 left-1 right-1 bottom-1 bg-[#252a2d] rounded-full flex justify-center items-center flex-col">
                <router-link to="/betSlip" class="betslip-link flex flex-col items-center justify-center w-full h-full text-inherit cursor-pointer no-underline">
                  <svg class="menu-icon w-[22px] h-[22px] fill-[#aaaeb0] mb-1" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="1.5"/>
                    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <div class="menu-title text-[#aaaeb0] text-[11px] leading-[14px] mt-0.5">Betslip</div>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Join/Mybets Item -->
        <div class="navigation-item flex-1 h-full bg-[#252a2d] text-[#aaaeb0] text-center pt-2 pb-3 text-xs font-normal">
          <div class="menu-item flex flex-col justify-center items-center h-full w-full">
            <router-link v-if="isAuthenticated" to="/bets" class="action-link flex flex-col items-center justify-center w-full h-full text-inherit cursor-pointer no-underline">
              <svg class="menu-icon w-[22px] h-[22px] fill-[#aaaeb0] mb-1" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
              <div class="menu-title text-[#aaaeb0] text-[11px] leading-[14px] mt-0.5">Mybets</div>
            </router-link>
            <router-link v-else to="/register" class="action-link flex flex-col items-center justify-center w-full h-full text-inherit cursor-pointer no-underline">
              <svg class="menu-icon w-[22px] h-[22px] fill-[#aaaeb0] mb-1" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <line x1="17" y1="11" x2="22" y2="16" stroke="currentColor" stroke-width="1.5"/>
                <line x1="22" y1="11" x2="17" y2="16" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <div class="menu-title text-[#aaaeb0] text-[11px] leading-[14px] mt-0.5">Join</div>
            </router-link>
          </div>
        </div>

        <!-- Account Item -->
        <div class="navigation-item flex-1 h-full bg-[#252a2d] text-[#aaaeb0] text-center pt-2 pb-3 text-xs font-normal">
          <div class="menu-item flex flex-col justify-center items-center h-full w-full">
            <router-link to="/account" class="action-link flex flex-col items-center justify-center w-full h-full text-inherit cursor-pointer no-underline">
              <svg class="menu-icon w-[22px] h-[22px] fill-[#aaaeb0] mb-1" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" fill="none"/>
                <path d="M5 20v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="1.5" fill="none"/>
              </svg>
              <div class="menu-title text-[#aaaeb0] text-[11px] leading-[14px] mt-0.5">Account</div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../store/authStore'

const authStore = useAuthStore()

const isAuthenticated = computed(() => {
  return authStore.isAuthenticated
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}


</style>