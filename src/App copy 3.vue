<template>
  <div class="flex flex-col min-h-screen px-0 sm:px-0 md:px-12 lg:px-16 xl:px-48 2xl:px-48 bg-gray-800">
    <SvgIcon/>
    <Header />
    
    <!-- Main Content - Inachukua nafasi yote iliyobaki -->
    <main class="flex-1 bg-transparent flex flex-row w-full min-h-0 relative">
      <!-- Left Column - Scrollable -->
      <aside class="flex-[58%] h-full bg-sky-800 overflow-y-auto border-r border-teal-800 no-scrollbar pb-24">
        <!-- RouterView container yenye flex-1 -->
        <div class="flex-1 flex flex-col">
          <router-view v-slot="{ Component }">
            <component :is="Component" class="flex-1 flex flex-col" />
          </router-view>
        </div>
        <Footer />
      </aside>
      
      <!-- Right Column - Fixed kwenye desktop -->
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
</style>