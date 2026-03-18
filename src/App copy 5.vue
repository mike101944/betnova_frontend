<template>
  <div class="flex flex-col min-h-screen px-0 sm:px-0 md:px-12 lg:px-16 xl:px-48 2xl:px-48 bg-gray-800">
    <SvgIcon/>
    <Header />
    
    <!-- Main Content - Inachukua nafasi yote iliyobaki -->
    <main class="flex-1 bg-transparent flex flex-row w-full min-h-0 relative">
      <!-- Left Column - SIDEBAR (58%) -->
      <aside class="flex-[58%] h-full bg-transparent overflow-y-auto border-r border-teal-800 no-scrollbar pb-24">
        <!-- Left Sidebar Component -->
            


        <Transition name="fade">
        <div v-if="leftSidebar?.isOpen.value" class="sidebar-overlay" @click="closeLeftSidebar"></div>
      </Transition>

      <div class="absolute-content content">
        <Transition name="slide-left">
          <LeftSidebar v-if="leftSidebar?.isOpen.value" @close="closeLeftSidebar" class="account-sidebar-child" />
        </Transition>
      </div>
        
        <!-- RouterView container -->
        <div class="flex-1 flex flex-col mt-4">
          <router-view v-slot="{ Component }">
            <component :is="Component" class="flex-1 flex flex-col" />
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

import {ref,provide,inject} from 'vue'
const isLeftSidebarOpen = ref(false)



const leftSidebarOpen = ()=>{
  isLeftSidebarOpen.value = true
}
const leftSidebarClose = ()=>{
  isLeftSidebarOpen.value = false
}




provide('leftSidebar', {
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


/* Style ya Overlay */
.sidebar-overlay {
  position: fixed !important;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: transparent; /* Rangi ya giza kiasi */
  z-index: 10002; /* Chini kidogo ya sidebar (ambayo ni 10003) */
  cursor: pointer;
}
.account-sidebar-child {
    position: fixed !important; /* Muhimu: Inafuata parent yake */
    top: 0;

    left: 0 !important;
    margin-left: 200px !important;
    /* Hakikisha ina z-index ya juu zaidi */
    z-index: 10003 !important;
    
    /* Ongeza transition kwa smoother movement */
    transition: right 1s ease-in !important;
    
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 1s ease-in-out !important;
}
</style>