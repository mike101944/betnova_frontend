<script setup>

// import HeadBannerImage from '../../../../assets/media/lg_990x272_4_cffeb66092.webp'
// import HeadBannerImage2 from '../../../../assets/media/lg_ENG_990x272jetx_new_max_multiplier_1_d51ba7c9f9.webp'
// import AfricanLeague from '../../../../assets/media/noun_europe_188772_1_de866e5d6c.svg'
// import EuropeanLeague from '../../../../assets/media/Europe_43bd11c816.svg'
// import leagueShortcut from '../league-shortcut.vue';
// import FootballBannerImage from '../../../../assets/media/lg_990x272_1_4fd3446df7.webp'

import { dummyGamesData } from '../data/dummyGameData'

import { ref, onMounted } from 'vue'

const games = ref([])

onMounted(() => {
  setTimeout(() => {
    games.value = dummyGamesData
  }, 1200)
})

</script>
<template>
  



          <div data-v-5cd8c607="" data-v-fc0cbc39="" class="events" data-test-id="tag-Events" data-test-class="cmsTag">
            <div data-v-4310f641="" data-v-5cd8c607="" class="game-category" info-category-id="">
              <div data-v-97dcd69f="" data-v-4310f641="" data-test-id="on-click-button"
                class="page-headline pointer category">
                <h1 data-v-97dcd69f="" class="page-headline-title"><svg data-v-02f45589="" data-v-97dcd69f=""
                    class="svg-icon page-headline-icon" style="vertical-align: middle; "><!---->
                    <use data-v-02f45589="" xlink:href="#icon-football"></use>
                  </svg> Football </h1> <span data-v-97dcd69f="" class="page-headline-count">
                  <div data-v-fa100c61="" data-v-97dcd69f="" class="box-count font-size-bigger">662</div> <svg
                    data-v-02f45589="" data-v-97dcd69f="" class="svg-icon icon-size-little"
                    style="vertical-align: middle;"><!---->
                    <use data-v-02f45589="" xlink:href="#arrow_right"></use>
                  </svg>
                </span>
              </div>

              <!-- start here -->
              <div data-v-ea5d556a="" data-v-4310f641="" v-for="game in games" :key="game.id"
                class="game-events-container prematch" data-test-id="bpEvent" :data-event-id="game.eventId">
                <a data-v-ea5d556a="" :href="`/event/${game.eventId}`" class="game-event-wrapper pointer"
                  :data-test-id="`nav-event-${game.eventId}-link`" :name="`id-${game.eventId}`">
                  <div data-v-ea5d556a="" class="game-event-header">
                    <div data-v-ea5d556a="" class="game-event-header-left-content">
                      {{ game.time }} <span data-v-ea5d556a="" class="game-event-date">{{ game.date }}</span>
                    </div>
                    <div data-v-ea5d556a="" class="game-event-header-right-content">
                      <!-- Two-Up Badge (conditional) -->
                      <span v-if="game.hasTwoUp" data-v-891f4695="" data-v-ea5d556a=""
                        class="badge type-best-odds mode-default pointer" data-test-id="game-open-two-up-modal-button">
                        <svg data-v-02f45589="" data-v-891f4695="" class="svg-icon icon icon-size-huge"
                          style="vertical-align: middle;">
                          <use data-v-02f45589="" xlink:href="#icon-two-up"></use>
                        </svg>
                      </span>

                      <!-- Boosted Odds Badge (conditional) -->
                      <span v-if="game.hasBoostedOdds" data-v-891f4695="" data-v-ea5d556a=""
                        class="badge type-best-odds mode-default game-best-odds-badge pointer"
                        data-test-id="game-open-boosted-odds-modal-button">
                        <svg data-v-02f45589="" data-v-891f4695="" class="svg-icon icon icon-size-huge"
                          style="vertical-align: middle;">
                          <use data-v-02f45589="" xlink:href="#icon-best-odds-circled"></use>
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div data-v-ea5d556a="" class="game-scoreboard">
                    <div data-v-43935c7e="" data-v-ea5d556a="" class="scoreboard-period invert">
                      <div data-v-43935c7e="" class="scoreboard-period-participant-name-wrapper">
                        <span data-v-43935c7e="" class="scoreboard-period-participant-name text-gray-500">{{ game.homeTeam }}</span>
                      </div>
                      <div data-v-43935c7e="" class="scoreboard-period-participant-name-wrapper">
                        <span data-v-43935c7e="" class="scoreboard-period-participant-name">{{ game.awayTeam }}</span>
                      </div>
                    </div>
                  </div>

                  <div data-v-ea5d556a="">
                    <p data-v-ea5d556a="" class="game-event-breadcrumbs" data-test-id="eventPath">{{ game.league }}</p>
                  </div>
                </a>

                <div data-v-5d6a591a="" data-v-ea5d556a="" class="betline-list">
                  <div data-v-5d6a591a="" class="betline-list-data">
                    <div data-v-5d6a591a="" class="betline-market">
                      <div data-v-00428546="" data-v-5d6a591a="">
                        <div data-v-00428546="" class="event-bets">
                          <div data-v-00428546="" class="chunks">
                            <div data-v-00428546="" class="chunk">
                              <!-- Home Odds (1) -->
                              <span data-v-9fc495af="" data-v-00428546="" class="event-bet-wrapper bet-price"
                                data-test-id="Odd-3743-3744">
                                <span data-v-9fc495af="" class="event-bet">
                                  <span data-v-9fc495af="" :id="`Bp-Price-${game.eventId}-home`"
                                    data-test-id="bet-price-select-button" class="anchor-wrap">
                                    <span data-v-9fc495af="" class="event-selection" data-test-id="selection">1</span>
                                    <span data-v-9fc495af="" class="event-odds" data-test-id="value">
                                      <svg v-if="game.homeOdds.hasFireIcon" data-v-02f45589="" data-v-9fc495af=""
                                        class="svg-icon price-icon icon-hot" style="vertical-align: middle;">
                                        <use data-v-02f45589="" xlink:href="#icon-hot"></use>
                                      </svg>
                                      <span data-v-9fc495af="">{{ game.homeOdds.value }}</span>
                                    </span>
                                  </span>
                                </span>
                              </span>

                              <!-- Draw Odds (X) -->
                              <span data-v-9fc495af="" data-v-00428546="" class="event-bet-wrapper bet-price"
                                data-test-id="Odd-3743-3745">
                                <span data-v-9fc495af="" class="event-bet">
                                  <span data-v-9fc495af="" :id="`Bp-Price-${game.eventId}-draw`"
                                    data-test-id="bet-price-select-button" class="anchor-wrap">
                                    <span data-v-9fc495af="" class="event-selection" data-test-id="selection">X</span>
                                    <span data-v-9fc495af="" class="event-odds" data-test-id="value">
                                      <svg v-if="game.drawOdds.hasFireIcon" data-v-02f45589="" data-v-9fc495af=""
                                        class="svg-icon price-icon icon-hot" style="vertical-align: middle;">
                                        <use data-v-02f45589="" xlink:href="#icon-hot"></use>
                                      </svg>
                                      <span data-v-9fc495af="">{{ game.drawOdds.value }}</span>
                                    </span>
                                  </span>
                                </span>
                              </span>

                              <!-- Away Odds (2) -->
                              <span data-v-9fc495af="" data-v-00428546="" class="event-bet-wrapper bet-price"
                                data-test-id="Odd-3743-3746">
                                <span data-v-9fc495af="" class="event-bet">
                                  <span data-v-9fc495af="" :id="`Bp-Price-${game.eventId}-away`"
                                    data-test-id="bet-price-select-button" class="anchor-wrap">
                                    <span data-v-9fc495af="" class="event-selection" data-test-id="selection">2</span>
                                    <span data-v-9fc495af="" class="event-odds" data-test-id="value">
                                      <svg v-if="game.awayOdds.hasFireIcon" data-v-02f45589="" data-v-9fc495af=""
                                        class="svg-icon price-icon icon-hot" style="vertical-align: middle;">
                                        <use data-v-02f45589="" xlink:href="#icon-hot"></use>
                                      </svg>
                                      <span data-v-9fc495af="">{{ game.awayOdds.value }}</span>
                                    </span>
                                  </span>
                                </span>
                              </span>

                              <!-- Bet Count Button -->
                              <a data-v-74c3b014="" data-v-5d6a591a="" :href="`/event/${game.eventId}`"
                                class="betline-count-button" :data-test-id="`nav-event-${game.eventId}-betline-link`">
                                <span data-v-74c3b014="">{{ game.betCount }}</span>
                                <svg data-v-02f45589="" data-v-74c3b014="" class="svg-icon icon-size-very-small"
                                  style="vertical-align: middle;">
                                  <use data-v-02f45589="" xlink:href="#arrow_right"></use>
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              <div data-v-4310f641="" data-test-id="more-sports-button" class="event-counter"><span data-v-4310f641=""
                  class="pointer"><span data-v-4310f641="">View all Football</span> <span
                    data-v-4310f641="">662</span></span> <svg data-v-02f45589="" data-v-4310f641=""
                  class="svg-icon icon-size-very-small" style="vertical-align: baseline;"><!---->
                  <use data-v-02f45589="" xlink:href="#arrow_right"></use>
                </svg></div>

              <div data-v-7c473a5b="" data-v-fc0cbc39="" class="" data-test-id="tag-BannersCollection"
                data-banner-collection="" data-test-class="cmsTag">
                <!-- <a data-v-7c473a5b=""
                  href="/2up?utm_medium=lilom&amp;utm_campaign=2up" class=""
                  data-test-id="nav--2up?utm_medium=lilom&amp;utm_campaign=2up-link">
                  <img data-v-5455027b="" data-v-7c473a5b="" :src="FootballBannerImage"></a> -->
                  <a data-v-7c473a5b=""
                  href="/2up?utm_medium=lilom&amp;utm_campaign=2up" class=""
                  data-test-id="nav--2up?utm_medium=lilom&amp;utm_campaign=2up-link">
                  <img data-v-5455027b="" data-v-7c473a5b="" src=""></a>
                </div>

              <!-- endCard  here -->



            </div>

          </div>


    

</template>



<style  scoped>
.league-shortcut-container {
  width: 100%;
  overflow: hidden;
  /* Hide horizontal overflow */
  position: relative;
}

.router-view {
  position: relative;
}

img[data-v-5455027b] {
  width: 100%;
}

img {
  overflow-clip-margin: content-box;
  overflow: clip;
}


.events[data-v-5cd8c607] {
  position: relative;
}

.page-headline.category[data-v-97dcd69f] {
  background: #f4f5f0;
}

.page-headline[data-v-97dcd69f] {
  white-space: nowrap;
  background: #fff;
  border-bottom: 1px solid #e6e7e2;
  padding: 10px;
  position: relative;
}

.pointer {
  cursor: pointer;
}

.page-headline .page-headline-title[data-v-97dcd69f] {
  vertical-align: middle;
  word-break: break-word;
  white-space: normal;
  text-align: left;
  margin: 0;
  padding-left: 34px;
  padding-right: 18px;
  display: inline-block;
  position: relative;
  color: #252a2d;
}

.page-headline .page-headline-title[data-v-97dcd69f],
.page-headline .page-headline-title-small[data-v-97dcd69f] {
  font-weight: 700;
}

.page-headline .page-headline-title[data-v-97dcd69f] {
  font-size: 22px;
  line-height: 26px;
}


.page-headline svg.page-headline-icon[data-v-97dcd69f] {
  fill: #000;
  width: 24px;
  height: 24px;
  display: block;
  position: absolute;

  top: 0;
  bottom: 0;
  left: 0;
}






.page-headline .page-headline-count[data-v-97dcd69f] {
  justify-content: center;
  align-items: center;
  gap: 8px;
  display: flex;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

.box-count.font-size-bigger[data-v-fa100c61],
.box-count[data-v-fa100c61] {
  font-weight: 400;
}

.box-count.font-size-bigger[data-v-fa100c61] {
  font-size: 12px;
  line-height: 16px;
}

.box-count[data-v-fa100c61] {
  color: #252a2d;
  background-color: #d9edb2;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  min-width: 16px;
  padding: 0 4px;
  display: flex;
}

svg.icon-size-little[data-v-02f45589],
img.icon-size-little[data-v-02f45589] {
  width: 12px;
  height: 12px;
}

.game-events-container[data-v-ea5d556a] {
  border-bottom: 1px solid #e6e7e2;
  padding: 12px;
}

.game-event-wrapper[data-v-ea5d556a] {
  width: 100%;
}

.pointer {
  cursor: pointer;
}

.game-event-header[data-v-ea5d556a] {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  display: flex;
}

.game-event-header-left-content[data-v-ea5d556a],
.game-event-header-right-content[data-v-ea5d556a] {
  font-weight: 400;
}

.game-event-date[data-v-ea5d556a],
.game-event-subtitle[data-v-ea5d556a],
.game-event-header-left-content[data-v-ea5d556a],
.game-event-header-right-content[data-v-ea5d556a] {
  font-size: 14px;
  line-height: 18px;
}

.game-event-header-left-content[data-v-ea5d556a],
.game-event-header-right-content[data-v-ea5d556a] {
  font-weight: 400;
}

.game-event-date[data-v-ea5d556a] {
  font-weight: 700;
}

.game-event-date[data-v-ea5d556a],
.game-event-subtitle[data-v-ea5d556a],
.game-event-header-left-content[data-v-ea5d556a],
.game-event-header-right-content[data-v-ea5d556a] {
  font-size: 14px;
  line-height: 18px;
}

.type-best-odds[data-v-891f4695] {
  vertical-align: middle;
  margin-right: 0;
  padding: 0;
}

.badge {
  text-align: center;
  color: #252a2d;
  background: #ffffff border-box;
  border: 0;
  border-radius: 0;
  margin-right: 7px;
  padding: 2px 7px;
  display: inline-block;
  font-size: 13px;
  line-height: 16px;
}

.badge,
.button.button-bordered,
.indicator-grey,
.indicator-white,
.indicator-green,
.indicator-yellow,
.indicator-orange,
.indicator-red,
.indicator-green-blank {
  font-weight: 400;
}

.badge,
.button.button-bordered,
.indicator-grey,
.indicator-white,
.indicator-green,
.indicator-yellow,
.indicator-orange,
.indicator-red,
.indicator-green-blank {
  font-weight: 400;
}

.type-best-odds .icon[data-v-891f4695] {
  margin-right: 0;
}

svg.icon-size-huge[data-v-02f45589],
img.icon-size-huge[data-v-02f45589] {
  width: 20px;
  height: 20px;
}

.icon[data-v-891f4695] {
  margin-right: 4px;
}

.game-best-odds-badge[data-v-ea5d556a] {
  margin-left: 4px;
}

.type-best-odds[data-v-891f4695] {
  vertical-align: middle;
  margin-right: 0;
  padding: 0;
}

.badge {
  text-align: center;
  color: #252a2d;
  background: #fff border-box;
  border: 0;
  border-radius: 0;
  margin-right: 7px;
  padding: 2px 7px;
  display: inline-block;
}

.badge,
.button.button-bordered,
.indicator-grey,
.indicator-white,
.indicator-green,
.indicator-yellow,
.indicator-orange,
.indicator-red,
.indicator-green-blank {
  font-weight: 400;
}

.type-best-odds .icon[data-v-891f4695] {
  margin-right: 0;
}

svg.icon-size-huge[data-v-02f45589],
img.icon-size-huge[data-v-02f45589] {
  width: 20px;
  height: 20px;
}

.icon[data-v-891f4695] {
  margin-right: 4px;
}

.game-scoreboard[data-v-ea5d556a] {
  width: 100%;
  margin-bottom: 4px;
}

.scoreboard-period[data-v-43935c7e] {
  align-items: center;
  column-gap: 4px;
  width: 100%;
  display: grid;
}

.scoreboard-period-participant-name-wrapper[data-v-43935c7e] {
  align-items: center;
  gap: 6px;
  display: flex;
}

.scoreboard-period-participant-name[data-v-43935c7e],
.scoreboard-participant-name[data-v-43935c7e],
.scoreboard-participant-score[data-v-43935c7e],
.scoreboard-period-score-cell.bigger[data-v-43935c7e] {
  font-weight: 700;
}

.scoreboard-period-participant-name[data-v-43935c7e],
.scoreboard-participant-name[data-v-43935c7e],
.scoreboard-participant-score[data-v-43935c7e] {
  font-size: 18px;
  line-height: 24px;
}

.scoreboard-period-participant-name-wrapper[data-v-43935c7e] {
  align-items: center;
  gap: 6px;
  display: flex;
}

.scoreboard-period-participant-name[data-v-43935c7e],
.scoreboard-participant-name[data-v-43935c7e],
.scoreboard-participant-score[data-v-43935c7e],
.scoreboard-period-score-cell.bigger[data-v-43935c7e] {
  font-weight: 700;
}

.scoreboard-period-participant-name[data-v-43935c7e],
.scoreboard-participant-name[data-v-43935c7e],
.scoreboard-participant-score[data-v-43935c7e] {
  font-size: 18px;
  line-height: 24px;
}

a {
  cursor: pointer;
  user-select: none;
  color: #252a2d;
  text-decoration: none;
}

.game-event-breadcrumbs[data-v-ea5d556a] {
  color: #8e9398;
  margin-bottom: 7px;
  font-style: normal;
}

.game-event-minutes[data-v-ea5d556a],
.game-event-breadcrumbs[data-v-ea5d556a] {
  font-weight: 400;
}

.game-event-minutes[data-v-ea5d556a],
.game-event-breadcrumbs[data-v-ea5d556a] {
  font-size: 12px;
  line-height: 16px;
}

.betline-list[data-v-5d6a591a] {
  flex-direction: row;
  flex: 1;
  width: 100%;
  display: flex;
}

.betline-list-data[data-v-5d6a591a] {
  flex-direction: column;
  flex: 1;
  width: 100%;
  display: flex;
}

.betline-market[data-v-5d6a591a]:last-child {
  margin-bottom: 0;
}

.betline-market[data-v-5d6a591a] {
  margin-bottom: 16px;
}

.event-bets[data-v-00428546] {
  text-align: center;
  flex-wrap: nowrap;
  flex: 1;
  justify-content: stretch;
  align-items: stretch;
  margin: 0;
  line-height: 16px;
  display: flex;
}

.chunks[data-v-00428546] {
  flex-wrap: wrap;
  flex-grow: 1;
  gap: 8px;
  max-width: 100%;
  display: flex;
}

.chunk[data-v-00428546] {
  width: 100%;
  display: flex;
}

.bet-price[data-v-00428546] {
  margin-right: 8px;
}

.event-bet-wrapper[data-v-9fc495af] {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.event-bet[data-v-9fc495af] {
  cursor: pointer;
  color: #252a2d;
  white-space: nowrap;
  background: #f4f5f0;
  border: 1px solid #e6e7e2;
  border-radius: 4px;
  width: 100%;
  display: flex;
}

.event-bet .anchor-wrap[data-v-9fc495af] {
  justify-content: space-between;
  width: 100%;
  display: flex;
}

.event-bet .event-selection[data-v-9fc495af] {
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 0;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-weight: 400;
}

.event-bet .event-selection[data-v-9fc495af],
.event-bet .event-odds[data-v-9fc495af] {
  padding: 7px 10px;
}

.event-bet .event-odds[data-v-9fc495af],
.event-bet .event-selection[data-v-9fc495af] {
  font-size: 14px;
  line-height: 18px;
}

.event-bet .event-odds[data-v-9fc495af] {
  white-space: nowrap;
  text-align: left;
  border-radius: 0;
  flex-shrink: 0;
  font-weight: 700;
}

.event-bet .event-odds[data-v-9fc495af],
.event-bet .event-selection[data-v-9fc495af] {
  font-size: 14px;
  line-height: 18px;
}

.event-bet-wrapper[data-v-9fc495af] {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.event-bet .anchor-wrap[data-v-9fc495af] {
  justify-content: space-between;
  width: 100%;
  display: flex;
}

.betline-count-button[data-v-74c3b014] {
  white-space: nowrap;
  color: #252a2d;
  background: 0 0;
  border: 1px solid #e6e7e2;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  min-width: 48px;
  padding: 7px 6px;
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
  display: flex;
}

svg.icon-size-very-small[data-v-02f45589],
img.icon-size-very-small[data-v-02f45589] {
  width: 10px;
  height: 10px;
}

.event-bet .anchor-wrap .icon-hot[data-v-9fc495af] {
  fill: #ff7a00;
  margin-right: 4px;
}

.event-bet .anchor-wrap .price-icon[data-v-9fc495af] {
  vertical-align: top;
  width: 14px;
  height: 14px;
  margin-top: -4px;
}

.event-counter[data-v-4310f641] {
  color: #252a2d;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
}

.event-counter>span[data-v-4310f641] {
  text-decoration: underline;
}

.pointer {
  cursor: pointer;
}

.event-counter>svg[data-v-4310f641] {
  margin-left: 8px;
}

svg.icon-size-very-small[data-v-02f45589],
img.icon-size-very-small[data-v-02f45589] {
  width: 10px;
  height: 10px;
}
</style>