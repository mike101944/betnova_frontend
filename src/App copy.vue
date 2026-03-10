<template>

    <div className="flex flex-col min-h-screen px-0 sm:px-0 md:px-12 lg:px-16 xl:px-48 2xl:px-48
 bg-gray-800">
 <SvgIcon/>
        <Header />
        <main className="flex-1 bg-transparent flex flex-row">
          <aside className='flex-[58%] h-[calc(100vh-91px)] bg-sky-800 overflow-y-auto border-r border-teal-800 no-scrollbar'>
            <router-view></router-view>
            <Footer />
          </aside>
          <aside className='hidden flex-[36%]  bg-sky-100 sm:hidden md:hidden lg:flex xl:flex'>
            <BetSlip />
          </aside>

        </main>
        <section class="block sm:block md:block lg:hidden xl:hidden">
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

<style lang="scss" scoped>

</style>