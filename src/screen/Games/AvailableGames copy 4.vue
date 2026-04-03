
<!-- availableGames.vue -->
<template>
    <div>
        <HomeCanvaCard/>
        <LeagueShortcut  :activeLeagueId="selectedLeagueId" @league-changed="updateLeague"/>
        <CasionoGames/>
        
        <Football :leagueId="selectedLeagueId"/>
    
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Football from '../../components/Middle/components/Football.vue';
import LiveMatches from '../../components/Middle/components/LiveMatches.vue'
import CasionoGames from '../../components/Middle/components/CasionoGames.vue'
import Efootball from '../../components/Middle/components/Efootball.vue'
import BasketBall from '../../components/Middle/components/BasketBall.vue'
import Tennis from '../../components/Middle/components/Tennis.vue'
import HomeCanvaCard from '../../components/Middle/components/CanvaCard/HomeCanvaCard.vue'
import LeagueShortcut from '../../components/Middle/components/leagueShortcut/LeagueShortcut.vue';





const selectedLeagueId = ref(11); // Default iwe 'Live' au unayotaka

const updateLeague = (id) => {
    selectedLeagueId.value = id;
};
</script>

<style lang="scss" scoped>

</style>