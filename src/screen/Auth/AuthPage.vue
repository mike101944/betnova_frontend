<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

// Determine active tab based on current route
const activeTab = computed(() => {
  if (route.path === '/login') return 'login'
  if (route.path === '/register') return 'register'
  return 'login'
})

// Navigate function
const navigateToTab = (tab) => {
  if (tab === 'login') {
    router.push('/login')
  } else {
    router.push('/register')
  }
}
</script>

<template>
  <div class="page login-page router-view bg-white">
    <div class="tabs square with-top-border auth-tabs mt-14">
      <!-- Tabs Navigation -->
      <ul class="tabs-menu align-center ">
        <!-- Login Tab -->
        <li 
          class="first tabs-selector" 
          :class="{ active: activeTab === 'login' }"
          data-test-id="tabs-login"
          @click="navigateToTab('login')"
        >
          <div class="tab-item">
            <div class="tab-item-border">
              <div class="tab-icon">
                <svg class="svg-icon icon icon-size-medium">
                  <use xlink:href="#icon-logIn-menu"></use>
                </svg>
              </div>
              <span class="tab-text">Log In</span>
            </div>
          </div>
        </li>
        
        <!-- Register Tab -->
        <li 
          class="last tabs-selector" 
          :class="{ active: activeTab === 'register' }"
          data-test-id="tabs-join-now"
          @click="navigateToTab('register')"
        >
          <div class="tab-item">
            <div class="tab-item-border">
              <div class="tab-icon">
                <svg class="svg-icon icon icon-size-medium">
                  <use xlink:href="#icon-join-now"></use>
                </svg>
              </div>
              <span class="tab-text">Register Now</span>
            </div>
          </div>
        </li>
      </ul>

      <!-- Router View - Shows Login or Register Form -->
      <section class="tab-section">
        <router-view></router-view>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ===== STYLES ZOTE KUTOKA LOGIN PAGE ===== */
.router-view {
  position: relative;
  color: #252a2d;
}

.page {
  flex-flow: column;
  padding: 18px 20px;
  display: flex;
  margin-bottom: 70px;
  
}

/* Tabs Container */
.tabs {
  position: relative;
  border: 1px solid #e6e7e2;
}

.tabs .tabs-menu {
  user-select: none;
  list-style: none;
  display: flex;
}

/* Auth tabs specific */
.auth-tabs .tabs-menu .tabs-selector.active.first {
  border: none;
}

/* Square tabs style */
.tabs.square .tabs-selector.active {
  background: #fff;
  border-bottom: none;
}

.tabs.square .tabs-selector:not(.last) {
  border-right: none;
}

.tabs.square .tabs-selector {
  background: #f4f5f0;
  border: 1px solid #e6e7e2;
  border-top: none;
  padding: 10px 16px;
  cursor: pointer;
  width: 100%;
}

.tabs.square .tabs-selector,
.tabs.dark.round .tabs-menu .tabs-selector .tab-item .tab-text {
  font-weight: 400;
}

/* Tab text styles */
.tabs.square .tabs-selector.active .tab-text,
.tabs.text .tabs-selector .tab-text,
.tabs.text .tabs-selector.active .tab-text,
.tabs.dark .tabs-menu .tabs-selector .tab-item .tab-text,
.tabs.square .tabs-selector,
.tabs.dark.round .tabs-menu .tabs-selector .tab-item .tab-text {
  font-size: 14px;
  line-height: 18px;
}

.tabs.square .tabs-selector.active .tab-text,
.tabs.text .tabs-selector .tab-text,
.tabs.text .tabs-selector.active .tab-text,
.tabs.dark .tabs-menu .tabs-selector .tab-item .tab-text {
  font-weight: 700;
}

/* Tab selector */
.tabs .tabs-selector {
  cursor: pointer;
  width: 100%;
}

.tabs .tabs-selector .tab-item {
  height: 100%;
}

.tabs .tabs-selector .tab-item-border {
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
}

.tabs .tabs-selector .tab-item-border .tab-icon {
  align-items: center;
  display: flex;
}

/* Icons */
svg.icon-size-medium,
img.icon-size-medium {
  width: 16px;
  height: 16px;
}

.tabs .tabs-selector .tab-item-border .tab-icon + .tab-text {
  margin-left: 8px;
}

/* Top border for tabs */
.tabs.with-top-border.square > .tabs-menu > .tabs-selector {
  border-top: 1px solid #e6e7e2;
}

/* Tab section - where forms appear */
.auth-tabs .tab-section {
  padding: 16px;
  position: relative;
}

/* ===== ZIADA STYLES ZA TABS KUTOKA LOGIN ===== */
.tabs.square .tabs-selector {
  background: #f4f5f0;
  border: 1px solid #e6e7e2;
  border-top: none;
  padding: 10px 16px;
  font-weight: 400;
}

.tabs .tabs-selector .tab-item-border {
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
}

.tabs .tabs-selector .tab-item-border .tab-icon {
  align-items: center;
  display: flex;
}

.tabs .tabs-selector .tab-item-border .tab-icon + .tab-text {
  margin-left: 8px;
}
</style>