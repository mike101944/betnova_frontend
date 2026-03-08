<template>
    <div class="bottom-navigation-wrapper">
      <div class="bottom-navigation">
        <!-- Progress Bar -->
        <div class="progress-bar">
          <div class="progress-bar-text">
            <span class="progress-text truncate">
              <!-- <span>
                <span class="progress-bar-text-small">
                  Add more legs to your betslip to earn up to a 
                  <span class="bold">1000% Win Bonus.</span>
                </span>
              </span> -->
            </span>
          </div>
          <div class="progress-bar-fill" style="width: 0%;"></div>
        </div>
  
        <!-- Navigation Menu -->
        <div class="navigation-menu">
          <!-- Menu Item -->
          <div class="navigation-item">
            <div class="menu-item">
              <a class="action-link">
                <svg class="svg-icon menu-icon">
                  <use xlink:href="#icon-hamburger"></use>
                </svg>
                <div class="menu-title">Menu</div>
              </a>
            </div>
          </div>
  
          <!-- Sports Item -->
          <div class="navigation-item">
            <div class="menu-item">
              <a href="/" class="action-link">
                <svg class="svg-icon menu-icon">
                  <use xlink:href="#icon-football"></use>
                </svg>
                <div class="menu-title">Sports</div>
              </a>
            </div>
          </div>
  
          <!-- Betslip Item (Center) -->
          <div class="navigation-item transparent">
            <div class="circle-menu">
             
              <div class="betslip-menu">
                <div class="betslip-menu-wrapper">
                  <svg class="svg-icon cut-plus-icon">
                    <use xlink:href="#cut-plus-small"></use>
                  </svg>
                  <a class="betslip-link" href="/betSlip">
                    <svg class="svg-icon menu-icon">
                      <use xlink:href="#icon-betslip"></use>
                    </svg>
                    <div class="menu-title">Betslip</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Join Item -->
          <div class="navigation-item">
            <div class="menu-item">
              <a v-if="isAuthenticated" href="/bets" class="action-link">
                <svg class="svg-icon menu-icon">
                  <use xlink:href="#icon-join-now"></use>
                </svg>
                <div class="menu-title">Mybets</div>
              </a>
              <a v-else="!isAuthenticated" href="/register" class="action-link">
                <svg class="svg-icon menu-icon">
                  <use xlink:href="#icon-join-now"></use>
                </svg>
                <div class="menu-title">Join</div>
              </a>
            </div>
          </div>
  
          <!-- Account Item -->
          <div class="navigation-item">
            <div class="menu-item">
              <a class="action-link" href="/account" >
                <svg class="svg-icon menu-icon">
                  <use xlink:href="#icon-top-menu"></use>
                </svg>
                <div class="menu-title">Account</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // No script needed for static component
  import { computed} from 'vue'
  import { useAuthStore } from '../../store/authStore'


// Auth store
const authStore = useAuthStore()

const isAuthenticated = computed(() => {
  return authStore.isAuthenticated
})



  </script>
  
  <style scoped>
  * {
    margin: 0;
    padding: 0;
    /* box-sizing: border-box; */
  }
  
  .bottom-navigation-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    height: 90px;
  }
  
  .bottom-navigation {
    position: relative;
    width: 100%;
    height: 90px;
    background: #252a2d;
  }
  
  /* Progress Bar */
  .progress-bar {
    position: relative;
    height: 25px;
    background-color: #fff;
    width: 100%;
  }
  
  .progress-bar-text {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    color: #000;
    font-size: 12px;
    font-weight: 500;
    padding: 0 12px;
  }
  
  .progress-text {
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .progress-bar-text-small {
    font-size: 12px;
    line-height: 16px;
  }
  
  .bold {
    font-weight: 700;
  }
  
  .progress-bar-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #8dc63f;
    z-index: 1;
    transition: width 0.3s ease;
  }
  
  /* Navigation Menu */
  .navigation-menu {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 65px;
    position: absolute;
    bottom: 0;
    left: 0;
    background: transparent;
  }
  
  .navigation-item {
    flex: 1;
    height: 100%;
    background-color: #252a2d;
    color: #aaaeb0;
    text-align: center;
    padding: 8px 0 12px;
    font-size: 12px;
    font-weight: 400;
  }
  
  .navigation-item.transparent {
    background-color: transparent;
    padding: 0;
    position: relative;
  }
  
  /* Menu Item */
  .menu-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  
  .action-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    width: 100%;
    height: 100%;
    color: inherit;
    cursor: pointer;
  }
  
  .menu-icon {
    width: 22px;
    height: 22px;
    fill: #aaaeb0;
    margin-bottom: 4px;
  }
  
  .menu-title {
    color: #aaaeb0;
    font-size: 11px;
    line-height: 14px;
    margin-top: 2px;
  }
  
  /* Center Circle Menu */
  .circle-menu {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    top: -12px;
  }
  
  .ellipse-left {
    width: 50%;
    height: 100%;
    background-color: red;
    border-top-right-radius: 100%;
  }
  
  .ellipse-right {
    width: 50%;
    height: 100%;
    background-color: #252a2d;
    border-top-left-radius: 100%;
  }
  
  .betslip-menu {
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 68px;
    height: 68px;
    background-color: #353b40;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .betslip-menu-wrapper {
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    background-color: #252a2d;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  
  .betslip-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    width: 100%;
    height: 100%;
    color: inherit;
    cursor: pointer;
  }
  
  .cut-plus-icon {
    position: absolute;
    width: calc(100% - 8px);
    height: calc(100% - 8px);
    opacity: 0;
    pointer-events: none;
  }
  
  /* Responsive for Mobile */
  @media screen and (max-width: 768px) {
    .progress-bar-text {
      justify-content: flex-start;
      text-align: left;
      padding: 0 16px;
    }
    
    .progress-text {
      text-align: left;
    }
    
    .menu-icon {
      width: 20px;
      height: 20px;
    }
    
    .menu-title {
      font-size: 10px;
      margin-top: 2px;
    }
    
    .betslip-menu {
      width: 64px;
      height: 64px;
    }
  }
  
  /* Small phones */
  @media screen and (max-width: 360px) {
    .menu-title {
      font-size: 9px;
    }
    
    .progress-bar-text-small {
      font-size: 11px;
    }
    
    .betslip-menu {
      width: 60px;
      height: 60px;
    }
  }
  
  /* Truncate utility */
  .truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>