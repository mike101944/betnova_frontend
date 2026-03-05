<script setup>
    import { useRoute } from 'vue-router'
    import { ref, computed } from 'vue'

    const route = useRoute()
    
    // Helper to check active route
    const isActive = (path) => {
      return route.path.startsWith(path)
    }




// const items = ref([])

const items = ref([
  {
    id: 'BET001',
    match: 'Manchester United vs Arsenal',
    betType: '1X2',
    selection: '1',
    odds: 2.45,
    amount: 5000,
    potentialWin: 12250,
    status: 'open', // open, won, lost, pending, refunded, cashout
    placedAt: '2024-01-15 14:30',
    matchDate: '2024-01-20 20:00'
  },
  {
    id: 'BET002',
    match: 'Liverpool vs Chelsea',
    betType: 'Over/Under',
    selection: 'Over 2.5',
    odds: 1.85,
    amount: 3000,
    potentialWin: 5550,
    status: 'won',
    placedAt: '2024-01-14 10:15',
    matchDate: '2024-01-18 19:45'
  }
])

// Computed property kucheck kama kuna data
const hasData = computed(() => {
  return items.value && items.value.length > 0
})
    </script>
    
    <template>
      <div data-v-3f1b2324="" class="my-bets-page bets-header router-view">
        <div data-v-beccd7ea="" data-v-3f1b2324="" class="my-bets">
          <div data-v-d3915418="" data-v-beccd7ea="" class="tabs square with-top-border truncate-text my-bets-tabs">
            <ul data-v-d3915418="" class="tabs-menu align-center">
              <!-- Open tab -->
              <router-link 
                to="/bets" 
                :class="{ 
                  active: isActive('/bets') && !isActive('/bets/settled') && !isActive('/bets/jackpots') && !isActive('/bets/virtuals'),
                  'tabs-selector': true,
                  first: true
                }" 
                data-v-d3915418="" 
                data-test-id="tabs-pending"
              >
                <div data-v-d3915418="" class="tab-item">

                  <div data-v-d3915418="" class="tab-item-border" v-if="hasData">
                    <span data-v-d3915418="" class="tab-text">Open</span> 
                    <span data-v-d3915418="" class="tab-counter active">1</span>
                  </div>

                  <div data-v-d3915418="" class="tab-item-border" v-else>
                    <span data-v-d3915418="" class="tab-text">Open</span> 
                    <span data-v-d3915418="" class="tab-counter active">0</span>
                  </div>

                </div>
              </router-link>
              
              <!-- Settled tab -->
              <router-link 
                to="/bets/settled" 
                :class="{ 
                  active: isActive('/bets/settled'),
                  'tabs-selector': true
                }" 
                data-v-d3915418="" 
                data-test-id="tabs-settled"
              >
                <div data-v-d3915418="" class="tab-item">
                  <div data-v-d3915418="" class="tab-item-border">
                    <span data-v-d3915418="" class="tab-text">Settled</span>
                  </div>
                </div>
              </router-link>
              
              <!-- Jackpots tab -->
              <router-link 
                to="/bets/jackpots" 
                :class="{ 
                  active: isActive('/bets/jackpots'),
                  'tabs-selector': true
                }" 
                data-v-d3915418="" 
                data-test-id="tabs-jackpot"
              >
                <div data-v-d3915418="" class="tab-item">
                  <div data-v-d3915418="" class="tab-item-border">
                    <span data-v-d3915418="" class="tab-text">Jackpots</span>
                  </div>
                </div>
              </router-link>
              
              <!-- Virtuals tab -->
              <router-link 
                to="/bets/virtuals" 
                :class="{ 
                  active: isActive('/bets/virtuals'),
                  'tabs-selector': true,
                  last: true
                }" 
                data-v-d3915418="" 
                data-test-id="tabs-virtual"
              >
                <div data-v-d3915418="" class="tab-item">
                  <div data-v-d3915418="" class="tab-item-border">
                    <span data-v-d3915418="" class="tab-text">Virtuals</span>
                  </div>
                </div>
              </router-link>
            </ul>
            <router-view></router-view>
          </div>
        </div>
      </div>
    </template>
    
    <style  scoped>
    .my-bets-page{
      margin: 0;
    }
    .bets-header[data-v-3f1b2324] {
      width: 100%;
      margin: 0 auto;
      padding-bottom: 10px;
    }
    .my-bets-page[data-v-3f1b2324] {
      background-color: initial;
      color: #252a2d;
     
    }
    .router-view {
      position: relative;
    }
    .my-bets {
      background: #fff;
    }
    .tabs[data-v-d3915418] {
      position: relative;
    }
    .tabs .tabs-menu[data-v-d3915418] {
      user-select: none;
      list-style: none;
      display: flex;
    }
    .tabs.with-top-border.square>.tabs-menu>.tabs-selector[data-v-d3915418] {
      border-top: 1px solid #e6e7e2;
    }
    .tabs.square .tabs-selector.active.first[data-v-d3915418] {
      border-left: none;
    }
    .tabs.truncate-text.square .tab-item[data-v-d3915418], .tabs.truncate-text.square .tabs-selector[data-v-d3915418] {
      overflow: hidden;
    }
    
    /* Active state styling - FIXED */
    .tabs.square .tabs-selector[data-v-d3915418] {
      background: #f4f5f0;
      border: 1px solid #e6e7e2;
      border-top: none;
      padding: 10px 16px;
      
      &.active {
        background: #fff !important;
      
        font-weight: bold !important;
        border-bottom: none !important;
        
        .tab-text {
          font-weight: bold !important;
        }
        
        
      }
    }
    
    .tabs.square .tabs-selector[data-v-d3915418]:not(.last) {
      border-right: none;
    }
    .tabs.square .tabs-selector[data-v-d3915418], .tabs.dark.round .tabs-menu .tabs-selector .tab-item .tab-text[data-v-d3915418] {
      font-weight: 400;
    }
    .tabs.square .tabs-selector.active .tab-text[data-v-d3915418], .tabs.text .tabs-selector .tab-text[data-v-d3915418], 
    .tabs.text .tabs-selector.active .tab-text[data-v-d3915418], .tabs.dark .tabs-menu .tabs-selector .tab-item 
    .tab-text[data-v-d3915418], .tabs.square .tabs-selector[data-v-d3915418], .tabs.dark.round .tabs-menu .tabs-selector 
    .tab-item .tab-text[data-v-d3915418] {
      font-size: 14px;
      line-height: 18px;
    }
    .tabs .tabs-selector[data-v-d3915418] {
      cursor: pointer;
      width: 100%;
    }
    .tabs.truncate-text.square .tab-item[data-v-d3915418], .tabs.truncate-text.square .tabs-selector[data-v-d3915418] {
      overflow: hidden;
    }
    .tabs .tabs-selector .tab-item[data-v-d3915418] {
      height: 100%;
    }
    .tabs .tabs-selector .tab-item-border[data-v-d3915418] {
      justify-content: center;
      align-items: center;
      height: 100%;
      display: flex;
    }
    .tabs.truncate-text.square .tab-item .tab-text[data-v-d3915418], .tabs.truncate-text.square .tabs-selector .tab-text[data-v-d3915418] {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .tabs.square .tabs-selector.active .tab-text[data-v-d3915418], .tabs.text .tabs-selector .tab-text[data-v-d3915418], .tabs.text .tabs-selector.active .tab-text[data-v-d3915418], .tabs.dark .tabs-menu .tabs-selector .tab-item .tab-text[data-v-d3915418] {
      font-weight: 700;
    }
    .tabs .tabs-selector[data-v-d3915418] {
      cursor: pointer;
      width: 100%;
    }
    .tabs .tabs-menu[data-v-d3915418] {
      user-select: none;
      list-style: none;
      display: flex;
    }
    .tabs .tabs-selector .tab-counter.active[data-v-d3915418] {
      background: #d9edb2;
    }
    .tabs .tabs-selector .tab-counter[data-v-d3915418] {
      background: #e6e7e2;
      border-radius: 50%;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      width: 17px;
      height: 17px;
      margin-left: 4px;
      display: flex;
    }
    .tabs.round .tabs-selector .tab-text[data-v-d3915418], .tabs.dark .tabs-menu .tabs-selector .tab-counter[data-v-d3915418], .tabs .tabs-selector .tab-counter[data-v-d3915418] {
      font-weight: 400;
    }
    .tabs .tabs-selector .tab-counter[data-v-d3915418] {
      font-size: 10px;
      line-height: 14px;
    }
    </style>