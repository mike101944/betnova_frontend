<template>
  <div class="flex flex-col min-h-screen px-0 sm:px-0 md:px-12 lg:px-16 xl:px-48 2xl:px-48 bg-gray-800">
    <SvgIcon/>
    <Header />
    
    <!-- Main Content -->
    <main class="flex-1 bg-transparent flex flex-row w-full min-h-0 relative">
      
      <!-- SIDEBAR - INAPITA JUU (HAISUKUMI CONTENT) -->
      <Transition name="fade">
        <div v-if="isLeftSidebarOpen" class="sidebar-overlay" @click="leftSidebarClose"></div>
      </Transition>

      <Transition name="slide-left">
        <LeftSidebar v-if="isLeftSidebarOpen" @close="leftSidebarClose" class="account-sidebar-child" />
      </Transition>
      
      <!-- Left Column - Content Area (HAISOGI) -->
      <aside class="flex-[58%] h-full bg-transparent overflow-y-auto border-r border-teal-800 no-scrollbar pb-24">
        <!-- RouterView container -->
        <div class="flex-1 flex flex-col mt-4">
          <router-view v-slot="{ Component }">
            <component :is="Component" class="flex-1 flex flex-col" />
          </router-view>
        </div>
        <Footer />
      </aside>
      
      <!-- Right Column -->
      <aside class="hidden flex-[36%] bg-sky-100 lg:flex xl:flex h-full overflow-y-auto no-scrollbar">
        <BetSlip />
      </aside>
    </main>

    <!-- Bottom Tabs -->
    <section class="fixed bottom-0 left-0 right-0 z-50 block lg:hidden">
      <BottomTabs/>
    </section>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'
import BetSlip from './components/Betlslip/BetSlip.vue'
import BottomTabs from './components/BottomNavigation/BottomNavGation.vue'
import SvgIcon from './SvgIcons.vue/SvgIcon.vue';
import LeftSidebar from './components/LeftSidebar/LeftSidebar.vue'; 
import { useAuthStore } from './store/authStore';

const authStore = useAuthStore();
const isLeftSidebarOpen = ref(false)

const leftSidebarOpen = () => {
  isLeftSidebarOpen.value = true
}

const leftSidebarClose = () => {
  isLeftSidebarOpen.value = false
}

provide('leftSidebar', {
  isOpen: isLeftSidebarOpen,
  open: leftSidebarOpen,
  close: leftSidebarClose
})
</script>

<style scoped>
main {
  height: calc(100vh - 91px);
  position: relative;
  overflow: hidden; /* Zuia scroll wakati sidebar iko wazi */
}

aside {
  height: 100%;
  overflow-y: auto;
}

@media (max-width: 1024px) {
  aside.flex-\[58\%\] {
    padding-bottom: 80px;
  }
}

@media (max-width: 768px) {
  aside.flex-\[58\%\] {
    flex: 100%;
  }
}

/* Sidebar Styles - HAZISUKUMI CONTENT */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10002;
  cursor: pointer;
  pointer-events: auto;
}

.account-sidebar-child {
  position: fixed !important; /* Fixed inazuia kusukuma content */
  top: 0;
  left: 0;
  z-index: 10003 !important;
  width: 280px;
  height: 100vh;
  background-color: #1a1e24;
  box-shadow: 2px 0 10px rgba(0,0,0,0.3);
  overflow-y: auto;
}

/* Transitions */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
  position: fixed; /* Muhimu - inabaki fixed wakati wa transition */
  z-index: 10003;
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* REMOVE ml-[280px] - HATUTAKI CONTENT KUSOGEA */
</style>