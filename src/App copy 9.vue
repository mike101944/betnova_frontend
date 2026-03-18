<template>
  <div class="flex flex-col min-h-screen px-0 sm:px-0 md:px-12 lg:px-16 xl:px-48 2xl:px-48 bg-gray-800">
    <SvgIcon />
    <Header />
    
    <main class="flex-1 flex w-full relative overflow-hidden" :style="{ height: 'calc(100vh - 91px)' }">
      
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
      
      <aside class="flex-1 lg:flex-[58%] h-full overflow-y-auto border-r border-gray-800 no-scrollbar pb-24">
        <div class="mt-4 px-2">
          <router-view v-slot="{ Component }">
            <transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
        <Footer />
      </aside>
      
      <aside class="hidden lg:flex lg:flex-[36%] bg-[#1a1e24] h-full overflow-y-auto no-scrollbar border-l border-gray-800">
        <BetSlip />
      </aside>
    </main>

    <section class="fixed bottom-0 left-0 right-0 z-[50] block lg:hidden">
      <BottomTabs />
    </section>
  </div>
</template>

<script setup>
import { ref, provide, watch } from 'vue'
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'
import BetSlip from './components/Betlslip/BetSlip.vue'
import BottomTabs from './components/BottomNavigation/BottomNavGation.vue'
import SvgIcon from './SvgIcons.vue/SvgIcon.vue';
import LeftSidebar from './components/LeftSidebar/LeftSidebar.vue'; 

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
</script>

<style scoped>
/* Transitions */
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
</style>