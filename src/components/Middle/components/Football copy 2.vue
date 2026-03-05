<script setup>
import { ref, onMounted } from 'vue'
import { dummyGamesData } from '../data/dummyGameData'

const games = ref([])

onMounted(() => {
  // Simulating data fetch
  setTimeout(() => {
    games.value = dummyGamesData
  }, 1200)
})
</script>

<template>
  <div class="betpawa-layout">
    <div class="events" data-v-5cd8c607="">
      <div class="game-category">
        <div class="page-headline pointer category">
          <h1 class="page-headline-title">
            <svg class="svg-icon page-headline-icon" style="vertical-align: middle;">
              <use xlink:href="#icon-football"></use>
            </svg> 
            Football 
          </h1> 
          <span class="page-headline-count flex items-center justify-center">
            <div class="box-count">662</div> 
            <svg class="svg-icon icon-size-little">
              <use xlink:href="#arrow_right"></use>
            </svg>
          </span>
        </div>

        <div 
          v-for="game in games" 
          :key="game.id"
          class="game-events-container prematch"
        >
          <div class="game-info-row flex flex-col bg-red-500">
            <a :href="`/event/${game.eventId}`" class="game-details-link flex flex-col">
              <div class="game-event-header ">
                <div class="game-event-header-left">
                  {{ game.time }} <span class="game-event-date">{{ game.date }}</span>
                </div>
                <div class="game-event-header-right">
                   <span v-if="game.hasTwoUp" class="badge-icon">
                     <svg class="svg-icon icon-size-huge"><use xlink:href="#icon-two-up"></use></svg>
                   </span>
                   <span v-if="game.hasBoostedOdds" class="badge-icon">
                     <svg class="svg-icon icon-size-huge"><use xlink:href="#icon-best-odds-circled"></use></svg>
                   </span>
                </div>
              </div>

              <div class="game-scoreboard">
                <div class="team-names">
                  <div class="team-name">{{ game.homeTeam }}</div>
                  <div class="team-name">{{ game.awayTeam }}</div>
                </div>
              </div>

              <div class="game-league">
                {{ game.league }}
              </div>
            </a>

            <div class="betline-list">
              <div class="odds-grid">
                <div class="odd-item">
                  <span class="selection-label">1</span>
                  <span class="odd-value">
                    <svg v-if="game.homeOdds.hasFireIcon" class="svg-icon icon-hot"><use xlink:href="#icon-hot"></use></svg>
                    {{ game.homeOdds.value }}
                  </span>
                </div>
                <div class="odd-item">
                  <span class="selection-label">X</span>
                  <span class="odd-value">{{ game.drawOdds.value }}</span>
                </div>
                <div class="odd-item">
                  <span class="selection-label">2</span>
                  <span class="odd-value">{{ game.awayOdds.value }}</span>
                </div>
                <a :href="`/event/${game.eventId}`" class="markets-count">
                  {{ game.betCount }} <svg class="svg-icon icon-next"><use xlink:href="#arrow_right"></use></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="view-all-footer">
          <span class="pointer">View all Football <strong>662</strong></span>
          <svg class="svg-icon icon-size-very-small"><use xlink:href="#arrow_right"></use></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main Container */
.betpawa-layout {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #252a2d;
  background-color: #fff;
}

/* Header Style */
.page-headline {
  background: #f4f5f0;
  border-bottom: 1px solid #e6e7e2;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-headline-title {
  font-size: 20px;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-headline-icon {
  width: 24px;
  height: 24px;
}

.box-count {
  background-color: #d9edb2;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

/* Game Row Layout */
.game-events-container {
  border-bottom: 1px solid #e6e7e2;
  padding: 12px 15px;
}

.game-info-row {
  display: flex;
  flex-direction: column; /* Mobile first */
  gap: 12px;
}

/* Kama unataka Desktop view ambapo Odds zinakaa pembeni ya Timu: */
@media (min-width: 768px) {
  .game-info-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .game-details-link { flex: 1; }
  .betline-list { width: 350px; }
}

.game-details-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.game-event-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #757575;
  margin-bottom: 4px;
}

.game-event-date {
  font-weight: 700;
  color: #252a2d;
}

.team-name {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
}

.game-league {
  font-size: 12px;
  color: #8e9398;
  margin-top: 4px;
}

/* Odds Grid */
.odds-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 6px;
  align-items: center;
}

.odd-item {
  background: #f4f5f0;
  border: 1px solid #e6e7e2;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  cursor: pointer;
  min-width: 70px;
}

.odd-item:hover {
  background: #e9eadf;
}

.selection-label {
  font-size: 13px;
  color: #666;
}

.odd-value {
  font-size: 14px;
  font-weight: 700;
}

.markets-count {
  text-decoration: none;
  border: 1px solid #e6e7e2;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #252a2d;
}

/* Icons */
.svg-icon {
  fill: currentColor;
}
.icon-hot {
  fill: #ff7a00;
  width: 14px;
  height: 14px;
}
.icon-size-huge { width: 20px; height: 20px; }
.icon-size-little { width: 12px; height: 12px; }

/* Footer */
.view-all-footer {
  padding: 15px;
  text-align: center;
  font-size: 14px;
  color: #252a2d;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}
.view-all-footer span { text-decoration: underline; }

.pointer { cursor: pointer; }
</style>