<script setup>
import { ref } from 'vue'

const selectedLeague = ref(2)

// const selectLeague = (league) => {
//   selectedLeague.value = league.id
// }

// Pokea prop ya ligi inayofanya kazi sasa hivi
const props = defineProps(['activeLeagueId']);
const emit = defineEmits(['league-changed']);

const selectLeague = (leagueId) => {
  emit('league-changed', leagueId); // Tuma ID kwenda kwa parent
}


const leagues = [
{ 
    id: 11, 
    name: 'Live', 
    icon: 'live', 
    count: 10, 
  
  },
  { 
    id: 1, 
    name: 'Premier League', 
    icon: 'premier-league', 
    count: 12, 
  
  },
  { 
    id: 2, 
    name: 'La Liga', 
    icon: 'laliga', 
    count: 8, 
   
  },
  { 
    id: 3, 
    name: 'Serie A', 
    icon: 'serie-a', 
    count: 6, 
   
  },
  { 
    id: 4, 
    name: 'Bundesliga', 
    icon: 'bundesliga', 
    count: 9, 
   
  },
  { 
    id: 5, 
    name: 'Ligue 1', 
    icon: 'ligue-1', 
    count: 5, 
  
  },
  { 
    id: 6, 
    name: 'UEFA', 
    icon: 'champions-league', 
    
  },
  { 
    id: 7, 
    name: 'Eredivisie', 
    icon: 'eredivisie', 
  
  },
  { 
    id: 8, 
    name: 'Primeira Liga', 
    icon: 'primeira-liga', 
    count: 4, 
    
  },
  { 
    id: 9, 
    name: 'Turkish', 
    icon: 'super-lig', 
    count: 7, 
 
  },
  { 
    id: 10, 
    name: 'MLS', 
    icon: 'mls', 
    count: 10, 
  
  }
]

</script>

<template>
  <div class="w-full h-12.5 bg-emerald-950 overflow-auto relative flex flex-row gap-2 py-2 px-2">
    <a href="#" 
       v-for="league in leagues" :key="league.id" 
       @click.prevent="selectLeague(league.id)"
       class="inline-flex w-full gap-3 rounded-md p-1 text-white items-center bg-cyan-900"
       :class="activeLeagueId === league.id ? 'bg-cyan-900 border shadow-lg border-amber-50' : 'bg-cyan-900 hover:bg-emerald-800'"
    >
        <div class="whitespace-nowrap"><span class="text-[15px]">{{ league.name }}</span></div>
    </a>
  </div>
</template>

<style scoped>
.svg-icon{
    width: 12px;
    height: 12px;
    color: #ff7a00;
    
}
.page-headline-icon{
    color: #ff7a00;
}
</style>



