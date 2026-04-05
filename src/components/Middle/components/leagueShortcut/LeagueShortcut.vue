<!-- LeagueShortcut.vue -->
<script setup>
import { ref, watch } from 'vue'

const selectedLeague = ref(null)
const props = defineProps(['activeLeagueId']);
const emit = defineEmits(['league-changed']);

const selectLeague = (leagueId) => {
  emit('league-changed', leagueId);
}

// Lista kamili ya leagues zote duniani
const leagues = [
  { id: 0, name: 'All Leagues', icon: 'all', count: 0 },
  { id: 1, name: 'Premier League', icon: 'premier-league', country: 'England' },
  { id: 2, name: 'La Liga', icon: 'laliga', country: 'Spain' },
  { id: 3, name: 'Serie A', icon: 'serie-a', country: 'Italy' },
  { id: 4, name: 'Bundesliga', icon: 'bundesliga', country: 'Germany' },
  { id: 5, name: 'Ligue 1', icon: 'ligue-1', country: 'France' },
  { id: 6, name: 'UEFA Champions League', icon: 'champions-league', country: 'Europe' },
  { id: 7, name: 'UEFA Europa League', icon: 'europa-league', country: 'Europe' },
  { id: 8, name: 'Eredivisie', icon: 'eredivisie', country: 'Netherlands' },
  { id: 9, name: 'Primeira Liga', icon: 'primeira-liga', country: 'Portugal' },
  { id: 10, name: 'Süper Lig', icon: 'super-lig', country: 'Turkey' },
  { id: 11, name: 'MLS', icon: 'mls', country: 'USA' },
  { id: 12, name: 'Brasileirão', icon: 'brasileirao', country: 'Brazil' },
  { id: 13, name: 'Argentine Primera División', icon: 'argentina', country: 'Argentina' },
  { id: 14, name: 'Liga MX', icon: 'ligamx', country: 'Mexico' },
  { id: 15, name: 'Russian Premier League', icon: 'russia', country: 'Russia' },
  { id: 16, name: 'Ukrainian Premier League', icon: 'ukraine', country: 'Ukraine' },
  { id: 17, name: 'Belgian Pro League', icon: 'belgium', country: 'Belgium' },
  { id: 18, name: 'Scottish Premiership', icon: 'scotland', country: 'Scotland' },
  { id: 19, name: 'Austrian Bundesliga', icon: 'austria', country: 'Austria' },
  { id: 20, name: 'Swiss Super League', icon: 'switzerland', country: 'Switzerland' },
  { id: 21, name: 'Greek Super League', icon: 'greece', country: 'Greece' },
  { id: 22, name: 'Czech First League', icon: 'czech', country: 'Czech Republic' },
  { id: 23, name: 'Croatian First League', icon: 'croatia', country: 'Croatia' },
  { id: 24, name: 'Danish Superliga', icon: 'denmark', country: 'Denmark' },
  { id: 25, name: 'Norwegian Eliteserien', icon: 'norway', country: 'Norway' },
  { id: 26, name: 'Swedish Allsvenskan', icon: 'sweden', country: 'Sweden' },
  { id: 27, name: 'Finnish Veikkausliiga', icon: 'finland', country: 'Finland' },
  { id: 28, name: 'Polish Ekstraklasa', icon: 'poland', country: 'Poland' },
  { id: 29, name: 'Hungarian NB I', icon: 'hungary', country: 'Hungary' },
  { id: 30, name: 'Romanian Liga I', icon: 'romania', country: 'Romania' },
  { id: 31, name: 'Bulgarian First League', icon: 'bulgaria', country: 'Bulgaria' },
  { id: 32, name: 'Serbian SuperLiga', icon: 'serbia', country: 'Serbia' },
  { id: 33, name: 'Slovak Super Liga', icon: 'slovakia', country: 'Slovakia' },
  { id: 34, name: 'Slovenian PrvaLiga', icon: 'slovenia', country: 'Slovenia' },
  { id: 35, name: 'Israeli Premier League', icon: 'israel', country: 'Israel' },
  { id: 36, name: 'Saudi Professional League', icon: 'saudi', country: 'Saudi Arabia' },
  { id: 37, name: 'Qatar Stars League', icon: 'qatar', country: 'Qatar' },
  { id: 38, name: 'UAE Pro League', icon: 'uae', country: 'UAE' },
  { id: 39, name: 'J1 League', icon: 'japan', country: 'Japan' },
  { id: 40, name: 'K League 1', icon: 'korea', country: 'South Korea' },
  { id: 41, name: 'Chinese Super League', icon: 'china', country: 'China' },
  { id: 42, name: 'A-League', icon: 'australia', country: 'Australia' },
  { id: 43, name: 'Indian Super League', icon: 'india', country: 'India' },
  { id: 44, name: 'South African Premier Division', icon: 'southafrica', country: 'South Africa' },
  { id: 45, name: 'Egyptian Premier League', icon: 'egypt', country: 'Egypt' },
  { id: 46, name: 'Moroccan Botola', icon: 'morocco', country: 'Morocco' },
  { id: 47, name: 'Tunisian Ligue Professionnelle', icon: 'tunisia', country: 'Tunisia' },
  { id: 48, name: 'CAF Champions League', icon: 'caf', country: 'Africa' },
  { id: 49, name: 'AFC Champions League', icon: 'afc', country: 'Asia' },
  { id: 50, name: 'CONCACAF Champions League', icon: 'concacaf', country: 'North America' },
  { id: 51, name: 'Copa Libertadores', icon: 'libertadores', country: 'South America' },
  { id: 52, name: 'FIFA World Cup', icon: 'fifa', country: 'World' },
  { id: 53, name: 'UEFA European Championship', icon: 'euro', country: 'Europe' },
  { id: 54, name: 'Africa Cup of Nations', icon: 'afcon', country: 'Africa' },
  { id: 55, name: 'Copa América', icon: 'copaamerica', country: 'South America' },
  { id: 56, name: 'Asian Cup', icon: 'asiancup', country: 'Asia' },
  { id: 57, name: 'Championship', icon: 'championship', country: 'England' },
  { id: 58, name: 'League One', icon: 'leagueone', country: 'England' },
  { id: 59, name: 'League Two', icon: 'leaguetwo', country: 'England' },
  { id: 60, name: '2. Bundesliga', icon: '2bundesliga', country: 'Germany' },
  { id: 61, name: 'Serie B', icon: 'serieb', country: 'Italy' },
  { id: 62, name: 'Ligue 2', icon: 'ligue2', country: 'France' },
  { id: 63, name: 'Segunda División', icon: 'segunda', country: 'Spain' }
]

// Kama activeLeagueId ikiwa undefined au null, set default kuwa 0 (All Leagues)
if (!props.activeLeagueId && props.activeLeagueId !== 0) {
  emit('league-changed', 0);
}

// Watch activeLeagueId ili kusync
watch(() => props.activeLeagueId, (newVal) => {
  if (newVal !== undefined && newVal !== null) {
    selectedLeague.value = newVal;
  }
}, { immediate: true });
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