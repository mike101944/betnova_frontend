<template>
    <div>
        <HomeCanvaCard/>
        <LeagueShortcut/>
        <Football/>
        <LiveMatches :games="games"/>
                            <CasionoGames/>
                            <Efootball/>
                            <BasketBall/>
                            <Tennis/>
    </div>
</template>

<script setup>
import Football from '../../components/Middle/Components/Football.vue';
import LiveMatches from '../../components/Middle/components/LiveMatches.vue'
import CasionoGames from '../../components/Middle/components/CasionoGames.vue'
import Efootball from '../../components/Middle/components/Efootball.vue'
import BasketBall from '../../components/Middle/components/BasketBall.vue'
import Tennis from '../../components/Middle/components/Tennis.vue'
import HomeCanvaCard from '../../components/Middle/components/CanvaCard/HomeCanvaCard.vue'
import LeagueShortcut from '../../components/Middle/components/leagueShortcut/LeagueShortcut.vue';
import { ref } from 'vue'



const betslipRef = ref(null)
const betslipSportsBets = ref([])

const handleAddToBetslip = (selection) => {
  betslipRef.value?.addToBetslip(selection)
  // Update local reference for highlighting
  betslipSportsBets.value.push(selection)
}

const handleRemoveFromBetslip = (selectionId) => {
  betslipRef.value?.removeFromBetslip(selectionId)
  betslipSportsBets.value = betslipSportsBets.value.filter(bet => bet.id !== selectionId)
}
</script>

<style lang="scss" scoped>

</style>