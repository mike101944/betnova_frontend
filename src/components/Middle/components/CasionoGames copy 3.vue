<script setup>
import { ref, onMounted, computed } from 'vue'
import leagueShortcut from '../league-shortcut.vue'

// Import images (kama zinahitajika)
// import HeadBannerImage from '../../../../assets/media/lg_990x272_4_cffeb66092.webp'
// import HeadBannerImage2 from '../../../../assets/media/lg_ENG_990x272jetx_new_max_multiplier_1_d51ba7c9f9.webp'

// Casino games data
const casinoGames = ref([
  {
    id: 1,
    title: "Wheel Of Luck 2",
    image: "https://www.betpawa.co.tz/media/casino/jelly/WHEELOFLUCKV7P6/Wheel%20of%20Luck%202%20200x200.jpg",
    ribbon: {
      text: "Exclusive",
      color: "#fff",
      bgColor: "#831aed"
    },
    hasError: false
  },
  {
    id: 2,
    title: "Air Ace",
    image: "https://www.betpawa.co.tz/media/casino/jelly/AIRACE7ED3/Air%20Ace%20200x200.jpg",
    ribbon: {
      text: "Exclusive",
      color: "#fff",
      bgColor: "#831aed"
    },
    hasError: false
  },
  {
    id: 3,
    title: "Hot Slot™: 777 Crown",
    image: "https://www.betpawa.co.tz/media/casino/wazdan/524648/HotSlot777Crown_icon_350x350.jpg",
    ribbon: null,
    hasError: false
  },
  {
    id: 4,
    title: "JetX",
    image: "https://www.betpawa.co.tz/media/casino/smartsoft/18/JetXNew.jpg",
    ribbon: null,
    hasError: false
  },
  {
    id: 5,
    title: "Fortune Chest",
    image: "https://www.betpawa.co.tz/media/casino/alea/22372/FortuneChest.jpg",
    ribbon: {
      text: "3x3 Slot",
      color: "#f4f5f0",
      bgColor: "#ff7400"
    },
    hasError: false
  },
  {
    id: 6,
    title: "Fortune Gems 500",
    image: null,
    ribbon: {
      text: "3x3 Slot",
      color: "#f4f5f0",
      bgColor: "#ff7400"
    },
    hasError: true
  },
  {
    id: 7,
    title: "Aviator",
    image: null,
    ribbon: null,
    hasError: true
  },
  {
    id: 8,
    title: "Coin Win 2: Hold The Spin",
    image: null,
    ribbon: null,
    hasError: true
  },
  {
    id: 9,
    title: "Burning Coins 40",
    image: null,
    ribbon: null,
    hasError: true
  },
  {
    id: 10,
    title: "Jackpot Joker Fever",
    image: null,
    ribbon: {
      text: "3x3 Slot",
      color: "#f4f5f0",
      bgColor: "#ff7400"
    },
    hasError: true
  },
  {
    id: 11,
    title: "Casino Sevens",
    image: null,
    ribbon: {
      text: "WIN BIG!",
      color: "#353b40",
      bgColor: "#17c7e6"
    },
    hasError: true
  },
  {
    id: 12,
    title: "Mayan Gold",
    image: null,
    ribbon: null,
    hasError: true
  },
  {
    id: 13,
    title: "Fury Flight",
    image: null,
    ribbon: null,
    hasError: true
  },
  {
    id: 14,
    title: "Casino Bar",
    image: null,
    ribbon: {
      text: "WIN BIG!",
      color: "#353b40",
      bgColor: "#17c7e6"
    },
    hasError: true
  },
  {
    id: 15,
    title: "Fortune Miner 2",
    image: null,
    ribbon: {
      text: "Exclusive",
      color: "#fff",
      bgColor: "#831aed"
    },
    hasError: true
  },
  {
    id: 16,
    title: "African Gold",
    image: null,
    ribbon: null,
    hasError: true
  },
  {
    id: 17,
    title: "Wheel of Luck",
    image: null,
    ribbon: null,
    hasError: true
  },
  {
    id: 18,
    title: "Fortune Miner",
    image: null,
    ribbon: null,
    hasError: true
  }
])

// Loading state
const isLoading = ref(true)

// Simulate loading
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1200)
})

// Computed properties
const totalGames = computed(() => casinoGames.value.length)

// Handle game click
const handleGameClick = (game) => {
  console.log('Game clicked:', game.title)
  // Add your game opening logic here
}

// Handle scroll navigation
const scrollToSlide = (direction) => {
  const container = document.querySelector('.casino-list')
  if (container) {
    const scrollAmount = container.clientWidth
    if (direction === 'next') {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }
}

// Handle dot click
const scrollToDot = (index) => {
  const container = document.querySelector('.casino-list')
  if (container) {
    const itemWidth = container.querySelector('.casino-list-item').clientWidth
    const gap = 8 // Adjust based on your CSS
    container.scrollTo({ 
      left: index * (itemWidth + gap) * 4, // 4 items per slide
      behavior: 'smooth' 
    })
  }
}
</script>

<template>
  <div class="casino-collection" data-test-id="tag-CasinoCollection">
    <div class="content is-home-page">
      <!-- Header Section -->
      <div class="title">
        <div class="page-headline pointer category" data-test-id="on-click-button">
          <h1 class="page-headline-title">
            <svg class="svg-icon page-headline-icon" style="vertical-align: middle;">
              <use xlink:href="#icon-casino"></use>
            </svg>
            Games
          </h1>
          <span class="page-headline-count">
            <div class="box-count font-size-bigger">{{ totalGames }}</div>
            <svg class="svg-icon icon-size-little" style="vertical-align: middle;">
              <use xlink:href="#arrow_right"></use>
            </svg>
          </span>
        </div>
      </div>

      <!-- Casino Games Grid -->
      <div class="casino-content">
        <div class="casino-list-wrapper">
          <!-- Previous Button -->
          <div 
            class="slider-nav slider-nav-prev" 
            data-test-id="scroll-to-next-slide-prev"
            @click="scrollToSlide('prev')"
          >
            <svg class="svg-icon icon icon-size-medium" style="vertical-align: middle;">
              <use xlink:href="#arrow_left"></use>
            </svg>
          </div>

          <!-- Games Grid -->
          <div 
            class="casino-list" 
            :style="{
              'grid-auto-columns': `calc((100% - (4 - 1) * var(--gap)) / 4)`,
              'grid-template-rows': 'repeat(1, auto)'
            }"
          >
            <div 
              v-for="game in casinoGames" 
              :key="game.id" 
              class="casino-list-item"
            >
              <div class="casino-item-wrapper is-real">
                <div 
                  class="casino-item" 
                  data-test-id="open-casino-game-button"
                  @click="handleGameClick(game)"
                >
                  <!-- Game Ribbon -->
                  <div class="casino-item-header" v-if="game.ribbon">
                    <div 
                      class="casino-item-ribbon"
                      :style="{
                        color: game.ribbon.color,
                        background: game.ribbon.bgColor
                      }"
                    >
                      {{ game.ribbon.text }}
                    </div>
                  </div>

                  <!-- Game Image or Error State -->
                  <div class="casino-img-wrapper">
                    <div v-if="!game.hasError && game.image" class="casino-img-container">
                      <img 
                        :src="game.image" 
                        :alt="game.title"
                        class="casino-img card-item-image responsive-image"
                        @error="game.hasError = true"
                      />
                    </div>
                    
                    <!-- Error State (Image failed to load) -->
                    <div 
                      v-else 
                      class="casino-img-error card-item-image"
                      :class="{ 'is-hidden': !game.hasError }"
                    >
                      <svg class="svg-icon icon-size-very-large pointer" style="vertical-align: middle;">
                        <use xlink:href="#icon-casino"></use>
                      </svg>
                      <div class="casino-img-error-title">{{ game.title }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <div 
            class="slider-nav slider-nav-next" 
            data-test-id="scroll-to-next-slide-next"
            @click="scrollToSlide('next')"
          >
            <svg class="svg-icon icon icon-size-medium" style="vertical-align: middle;">
              <use xlink:href="#arrow_right"></use>
            </svg>
          </div>
        </div>

        <!-- Dots Navigation -->
        <!-- <ul class="casino-dots" role="tablist">
          <li 
            v-for="dot in 5" 
            :key="dot" 
            class="pointer" 
            :class="{ active: dot === 1 }"
          >
            <button 
              type="button" 
              data-test-id="scroll-to-dot-button"
              @click="scrollToDot(dot - 1)"
            >
              {{ dot }}
            </button>
          </li>
        </ul> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.casino-collection {
  .content {
    margin-top: 16px;
    margin-bottom: 16px;

    &.is-home-page {
      margin-top: 0;

      .title {
        padding: 0;
      }
    }

    .title {
      padding: 0 12px;

      .page-headline {
        &.category {
          background: #f4f5f0;
        }

        white-space: nowrap;
        background: #fff;
        border-bottom: 1px solid #e6e7e2;
        padding: 10px;
        position: relative;
        cursor: pointer;

        .page-headline-title {
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
          font-weight: 700;
          font-size: 22px;
          line-height: 26px;

          svg.page-headline-icon {
            fill: #000;
            width: 24px;
            height: 24px;
            display: block;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
          }
        }

        .page-headline-count {
          justify-content: center;
          align-items: center;
          gap: 8px;
          display: flex;
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);

          .box-count {
            color: #252a2d;
            background-color: #d9edb2;
            border-radius: 4px;
            justify-content: center;
            align-items: center;
            min-width: 16px;
            padding: 0 4px;
            display: flex;
            font-weight: 400;

            &.font-size-bigger {
              font-size: 12px;
              line-height: 16px;
            }
          }

          .icon-size-little {
            width: 12px;
            height: 12px;
          }
        }
      }
    }

    .casino-content {
      .casino-list-wrapper {
        position: relative;
        margin-top: 12px;

        .casino-list {
          --gap: 12px;
          grid-gap: calc(var(--gap) - 4px);
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          user-select: none;
          --columns: 2;
          grid-auto-flow: column;
          padding: 0 12px;
          display: grid;
          overflow-x: scroll;
          overflow-y: hidden;

          &::-webkit-scrollbar {
            display: none;
          }

          .casino-list-item {
            user-select: none;
            scroll-snap-align: center;
            scroll-margin: 12px;

            .casino-item-wrapper {
              border: 1px solid #e6e7e2;
              border-radius: 8px;
              height: 0;
              padding-top: 100%;
              position: relative;
              overflow: hidden;

              &.is-real {
                // Additional styles for real casino items
              }

              .casino-item {
                cursor: pointer;
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;

                .casino-item-header {
                  z-index: 2;
                  width: 100%;
                  display: flex;
                  position: absolute;
                  top: 0;
                  left: 0;

                  .casino-item-ribbon {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    border-radius: 0 0 8px;
                    height: 22px;
                    padding: 4px;
                    font-size: 10px;
                    font-weight: 500;
                    line-height: 14px;
                    overflow: hidden;

                    &:only-child {
                      max-width: 80%;
                    }
                  }
                }

                .casino-img-wrapper {
                  width: 100%;
                  height: 100%;
                  position: relative;
                  overflow: hidden;

                  .casino-img-container {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    overflow: hidden;

                    img {
                      width: inherit;
                      height: inherit;
                      object-fit: cover;
                      transition: transform 0.3s ease;

                      &:hover {
                        transform: scale(1.05);
                      }
                    }
                  }

                  .casino-img-error {
                    background: #f4f5f0;
                    flex-direction: column;
                    place-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    position: absolute;
                    top: 0;
                    left: 0;

                    &.is-hidden {
                      visibility: hidden;
                    }

                    svg {
                      fill: #aaaeb0;
                      width: 24px;
                      height: 24px;
                    }

                    .casino-img-error-title {
                      text-align: center;
                      padding: 8px 4px 0;
                      line-height: 12px;
                      font-size: 12px;
                      font-weight: 400;
                      color: #353b40;
                    }
                  }
                }
              }
            }
          }
        }

        .slider-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(17, 16, 16, 0.9);
          border-radius: 5px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 10;

          &.slider-nav-prev {
            left: 4px;
            color: #fff;
          }

          &.slider-nav-next {
            right: 4px;
            color: #fff;
          }

         

          .icon-size-medium {
            width: 16px;
            color: #fff;
            height: 16px;
          }
        }
      }

      .casino-dots {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 16px;
        padding: 0;
        list-style: none;

        li {
          button {
            background: #cccaca;
            border: none;
            border-radius: 50%;
            width: 8px;
            height: 8px;
            padding: 0;
            cursor: pointer;
            transition: all 0.3s ease;

          
          }

          &.active {
            button {
              background: #252a2d;
              width: 20px;
              border-radius: 4px;
            }
          }
        }
      }
    }
  }
}

// Loading animation
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.skeleton-item {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  background-color: #e6e7e2;
  border-radius: 8px;
  height: 0;
  padding-top: 100%;
}

// Responsive adjustments
@media (max-width: 768px) {
  .casino-collection {
    .content {
      .casino-content {
        .casino-list-wrapper {
          .casino-list {
            --columns: 2;
            grid-auto-columns: calc((100% - (2 - 1) * var(--gap)) / 2);
          }
        }
      }
    }
  }
}

@media (min-width: 1024px) {
  .casino-collection {
    .content {
      .casino-content {
        .casino-list-wrapper {
          .casino-list {
            --columns: 6;
            grid-auto-columns: calc((100% - (6 - 1) * var(--gap)) / 6);
          }
        }
      }
    }
  }
}
</style>