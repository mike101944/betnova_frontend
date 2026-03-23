<template>
  <div class="flex flex-col min-h-screen px-0 sm:px-0 md:px-12 lg:px-16 xl:px-48 2xl:px-48 bg-gray-700">
    <SvgIcon/>
    <Header />
    
    <!-- Main Content - Inachukua nafasi yote iliyobaki -->
    <main class="flex-1 bg-white flex flex-row w-full min-h-0 relative">


      <Transition name="fade">
        <div 
          v-if="isLeftSidebarOpen" 
          class="fixed inset-0 bg-transparent cursor-pointer z-[1000]" 
          @click="leftSidebarClose"
        ></div>
      </Transition>

      <Transition name="slide-left">
        <LeftSidebar 
          v-if="isLeftSidebarOpen" 
          @close="leftSidebarClose" 
        />
      </Transition>



      
      <aside class="flex-[58%] h-full bg-transparent overflow-y-auto border-r border-teal-800 no-scrollbar pb-24">
        <!-- Left Sidebar Component -->
            


       
        
        <!-- RouterView container -->
        <div class="flex-1 flex flex-col">
          <!-- <router-view v-slot="{ Component }">
            <component :is="Component" class="flex-1 flex flex-col" />
          </router-view> -->
          <router-view v-slot="{ Component }">
    <transition name="page" mode="out-in">
      <component :is="Component" class="flex-1 flex flex-col" />
    </transition>
  </router-view>

        </div>
        <Footer />
      </aside>
      
      <!-- Right Column - Fixed kwenye desktop (36%) -->
      <aside class="hidden flex-[36%] bg-sky-100 lg:flex xl:flex h-full overflow-y-auto no-scrollbar">
        <BetSlip />
      </aside>
    </main>

    <!-- Bottom Tabs - Fixed chini kwa mobile (HAICHUKUI SPACE) -->
    <section class="fixed bottom-0 left-0 right-0 z-50 block lg:hidden">
      <BottomTabs/>
    </section>
  </div>
</template>

<script setup>
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'
import BetSlip from './components/Betlslip/BetSlip.vue'
import BottomTabs from './components/BottomNavigation/BottomNavGation.vue'
import SvgIcon from './SvgIcons.vue/SvgIcon.vue';
import LeftSidebar from './components/LeftSidebar/LeftSidebar.vue'; 

import {ref,provide,watch} from 'vue'

const isLeftSidebarOpen = ref(false)

const leftSidebarOpen = () => isLeftSidebarOpen.value = true
const leftSidebarClose = () => isLeftSidebarOpen.value = false

// Zuia kuscroll main page wakati sidebar iko wazi
watch(isLeftSidebarOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})

provide('leftSidebar', {
  isOpen: isLeftSidebarOpen,
  open: leftSidebarOpen,
  close: leftSidebarClose
})
// Auth state - kama unahitaji kucontrol visibility ya sidebar
import { useAuthStore } from './store/authStore';
const authStore = useAuthStore();
</script>

<style scoped>
/* Hakikisha main inachukua nafasi zote zilizobaki */
main {
  height: calc(100vh - 91px); /* 91px ni urefu wa Header */
}

/* Scrollable aside */
aside {
  height: 100%;
  overflow-y: auto;
}

/* Padding chini kwa mobile */
@media (max-width: 1024px) {
  aside.flex-\[58\%\] {
    padding-bottom: 80px; /* Nafasi kwa bottom tabs */
  }
}

/* Optional: Hide sidebar kwa mobile ukitaka */
@media (max-width: 768px) {
  aside.flex-\[58\%\] {
    flex: 100%; /* Full width kwa mobile */
  }
}

.slide-left-enter-active, .slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-left-enter-from, .slide-left-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}


/* Page transition animations */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

</style>