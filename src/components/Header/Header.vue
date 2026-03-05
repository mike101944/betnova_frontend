<script setup>
import { ref, computed, inject } from 'vue'


</script>

<template>
  <div class="header">
    <div data-v-3bcad4de="" class="header">
      <div data-v-3bcad4de="" class="header-body">
        <div data-v-3bcad4de="">
          <div data-v-3bcad4de="" class="main main-full-logo">
            <div data-v-3bcad4de="" class="header-logo-section">
              <div data-v-3bcad4de="">
                <!-- Hamburger menu - opens left sidebar -->
                <a 
                  data-v-3bcad4de="" 
                  class="sport-menu row-cell align-middle"
                  data-test-id="headerMenuOpener"
                > 
                  <svg data-v-02f45589="" data-v-3bcad4de=""
                      class="svg-icon menu-icon" 
                      style="vertical-align: top;">
                      <use xlink:href="#icon-hamburger-inclined"></use>
                  </svg>
                </a>
                
                <a data-v-3bcad4de="" href="/"
                  class="router-link-active router-link-exact-active logo-link"
                  data-test-id="nav-homepage-link" aria-current="page">

  
                 <!-- SMALL SCREEN -->
                <div class="flex md:hidden items-center justify-center ">
                    <!-- <svg
                class="svg-icon logoh-short "
                viewBox="0 0 100 30"
              >
                <use xlink:href="#logo-short"></use>
              </svg> -->
              <h1 class="text-2xl text-white font-bold">b</h1>
              <h1 class="text-2xl text-[#0AF0B5] font-bold font-italic">N</h1>

                </div>

               <!-- LARGE SCREEN -->
              <div class="hidden md:block">
                <svg data-v-02f45589="" data-v-3bcad4de="" 
                    class="svg-icon logo " 
                    style="vertical-align: top;">
                    <use xlink:href="#logoh"></use>
                </svg>
              </div>

                </a>
              </div>
            </div>

            <div data-v-3bcad4de="" class="header-balance-section">
              <div data-v-3bcad4de="" class="icon-search">
                <svg data-v-02f45589="" data-v-3bcad4de=""
                    class="svg-icon icon-size-medium" 
                    data-test-id="headerIconSearch"
                    style="vertical-align: unset;">
                    <use xlink:href="#icon-search"></use>
                </svg>
              </div>
              
              <!-- Unauthenticated state - Login/Join buttons -->
              <span  data-v-2658eb31="" data-v-3bcad4de="">
                <span data-v-2658eb31="" class="header-buttons">
                  <a data-v-2658eb31="" href="/login" class="button button-accent"
                      data-test-id="track-top-nav-link">Login</a>
                  <a data-v-2658eb31="" href="/register"
                      class="button button-primary" data-test-id="track-top-nav-link">Register</a>
                </span>
              </span>

              
            </div>
          </div>
            
        </div>
      </div>
      
      <div data-v-3bcad4de="" class="header-footer fixed">
        <div data-v-3bcad4de="" class="header-content-section"></div>
      </div>
    </div>
    
    <!-- Bottom Tabs Navigation -->
    <div data-v-2b602c69="" class="tabs">
      <div data-v-d3915418="" data-v-2b602c69="" class="tabs square scrollable dark">
        <ul data-v-d3915418="" class="tabs-menu align-center">
          <li data-v-d3915418="" class="active first no-grow tabs-selector" data-test-id="tabs-Homepage">
            <div data-v-d3915418="" class="tab-item">
              <div data-v-d3915418="" class="tab-item-border">
                <div data-v-d3915418="" class="tab-icon">
                  <svg data-v-02f45589="" data-v-d3915418=""
                      class="svg-icon icon icon-size-small">
                      <use xlink:href="#icon-home"></use>
                  </svg>
                </div>
              </div>
            </div>
          </li>
          <li data-v-d3915418="" class="tabs-selector" data-test-id="tabs-Upcoming">
            <div data-v-d3915418="" class="tab-item">
              <div data-v-d3915418="" class="tab-item-border">
                <div data-v-d3915418="" class="tab-icon">
                  <svg data-v-02f45589="" data-v-d3915418=""
                      class="svg-icon icon icon-size-small">
                      <use xlink:href="#icon-tennis"></use>
                  </svg>
                </div>
                <span data-v-d3915418="" class="tab-text">Sports</span>
              </div>
            </div>
          </li>
          <li data-v-d3915418="" class="tabs-selector" data-test-id="tabs-Live">
            <div data-v-d3915418="" class="tab-item">
              <div data-v-d3915418="" class="tab-item-border">
                <div data-v-d3915418="" class="tab-icon">
                  <svg data-v-02f45589="" data-v-d3915418=""
                      class="svg-icon icon icon-size-small">
                      <use xlink:href="#icon-live"></use>
                  </svg>
                </div>
                <span data-v-d3915418="" class="tab-text">Live</span>
              </div>
            </div>
          </li>
          <li data-v-d3915418="" class="tabs-selector" data-test-id="tabs-Casino">
            <div data-v-d3915418="" class="tab-item">
              <div data-v-d3915418="" class="tab-item-border">
                <div data-v-d3915418="" class="tab-icon">
                  <svg data-v-02f45589="" data-v-d3915418=""
                      class="svg-icon icon icon-size-small">
                      <use xlink:href="#icon-casino"></use>
                  </svg>
                </div>
                <span data-v-d3915418="" class="tab-text">Casino</span>
              </div>
            </div>
          </li>
          <li data-v-d3915418="" class="tabs-selector" data-test-id="tabs-Virtual Sports">
            <div data-v-d3915418="" class="tab-item">
              <div data-v-d3915418="" class="tab-item-border">
                <div data-v-d3915418="" class="tab-icon">
                  <svg data-v-02f45589="" data-v-d3915418=""
                      class="svg-icon icon icon-size-small">
                      <use xlink:href="#icon-virtual-sport"></use>
                  </svg>
                </div>
                <span data-v-d3915418="" class="tab-text">Virtuals</span>
              </div>
            </div>
          </li>
          <li data-v-d3915418="" class="tabs-selector" data-test-id="tabs-Casino">
            <div data-v-d3915418="" class="tab-item">
              <div data-v-d3915418="" class="tab-item-border">
                <div data-v-d3915418="" class="tab-icon">
                  <svg data-v-02f45589="" data-v-d3915418=""
                      class="svg-icon icon icon-size-small">
                      <use xlink:href="#icon-airplane"></use>
                  </svg>
                </div>
                <span data-v-d3915418="" class="tab-text">Aviator</span>
              </div>
            </div>
          </li>
          <li data-v-d3915418="" class="last tabs-selector" data-test-id="tabs-pawa6">
            <div data-v-d3915418="" class="tab-item">
              <div data-v-d3915418="" class="tab-item-border">
                <div data-v-d3915418="" class="tab-icon">
                  <svg data-v-02f45589="" data-v-d3915418=""
                      class="svg-icon icon icon-size-small">
                      <use xlink:href="#icon-pawa6"></use>
                  </svg>
                </div>
                <span data-v-d3915418="" class="tab-text">Pawa6</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style  scoped>

.header[data-v-3bcad4de] {
  text-align: left;
  background: #252a2d 100%;
  position: relative;
}
.header .main-full-logo[data-v-3bcad4de] {
  flex-wrap: nowrap;
}
.header .main[data-v-3bcad4de] {
  flex-wrap: wrap;
  flex: none;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  display: flex;
}
.logo-short[data-v-3bcad4de] {
    width: 32px;
    height: 18px;
}
.header-logo-section[data-v-3bcad4de] {
  overflow: hidden;
}
.header-balance-section[data-v-3bcad4de] {
  align-items: center;
  display: inline-flex;
}
.header-logo-section > div[data-v-3bcad4de] {
  align-items: center;
  display: flex;
}
.sport-menu[data-v-3bcad4de] {
  vertical-align: top;
  margin-right: 12px;
  padding: 4px;
  display: inline-block;
  cursor: pointer;
  
  &:hover svg {
    fill: #0AF0B5;
  }
}
a {
  cursor: pointer;
  user-select: none;
  color: inherit;
  text-decoration: none;
}
svg.menu-icon[data-v-3bcad4de],
img.menu-icon[data-v-3bcad4de] {
  fill: #aaaeb0;
  color: #8e9398;
  width: 24px;
  height: 24px;
  display: block;
}
svg[data-v-02f45589],
img[data-v-02f45589] {
  width: 32px;
  height: 32px;
}
.logo-link[data-v-3bcad4de] {
  margin-right: 12px;
  display: flex;
  overflow: hidden;
}
.header .logo.svg-icon[data-v-3bcad4de],
.header .logo.image-icon[data-v-3bcad4de] {
  width: 92px;
  height: 16px;
}
.header .logo[data-v-3bcad4de] {
  border: 0;
  display: inline-block;
}


.header-balance-section[data-v-3bcad4de] {
  align-items: center;
  display: inline-flex;
}
.icon-search[data-v-3bcad4de] {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  padding: 4px;
}
.icon-search svg[data-v-3bcad4de] {
  fill: #fff;
}
svg.icon-size-medium[data-v-02f45589],
img.icon-size-medium[data-v-02f45589] {
  width: 16px;
  height: 16px;
}
.header-buttons[data-v-2658eb31] {
  align-items: center;
  display: inline-flex;
}
.header-buttons .button[data-v-2658eb31] {
  padding: 7px 8px;
  line-height: 18px;
}
a.button[data-v-2658eb31] {
  text-decoration: none;
}
.button-accent {
  color: #fff;
  fill: #fff;
  background-color: #252a2d;
}
.button {
  cursor: pointer;
  max-width: 300px;
  font-family: inherit;
  font-weight: 700;
}

.header-buttons .button[data-v-2658eb31]:last-child {
  border-radius: 0;
}
.header-buttons .button[data-v-2658eb31] {
  padding: 7px 8px;
  line-height: 18px;
}
.button-primary {
  color: #252a2d;
  fill: #252a2d;
  background-color: #0AF0B5;
}
.header .top-menu[data-v-3bcad4de] {
  vertical-align: middle;
  display: inline-block;
}
.menu[data-v-02cc471f] {
  padding-right: 8px;
}
.table {
  width: 100%;
  display: table;
}
.table .row-cell.align-middle {
  vertical-align: middle;
}
.table .row-cell {
  display: table-cell;
}
.menu-button[data-v-02cc471f] {
  color: #fff;
  text-transform: uppercase;
  cursor: pointer;
  padding: 0 16px;
  display: flex;
  position: relative;
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
  
  &:hover .icon-top-menu {
    fill: #0AF0B5;
  }
}
.menu-button .top-menu-icon-wrapper[data-v-02cc471f] {
  margin-right: 8px;
  position: relative;
}
.menu-button .icon-top-menu[data-v-02cc471f] {
  fill: #f4f5f0;
  width: 16px;
  height: 16px;
}
svg:not(:root) {
  overflow-clip-margin: content-box;
  overflow: hidden;
}
.menu-button .icon-messages-menu[data-v-02cc471f] {
  fill: #fff;
  background: #0AF0B5;
  width: 15px;
  height: 12px;
  padding: 1px;
  position: absolute;
  top: -5px;
  left: 8px;
}
.search[data-v-8a5d1ac3] {
  background: #252a2d;
  border-top: 1px solid #353b40;
  width: 100%;
  padding-top: 8px;
  padding-bottom: 8px;
}
form {
  display: block;
  margin-top: 0em;
  unicode-bidi: isolate;
}
.table[data-v-8a5d1ac3] {
  width: 100%;
  display: table;
}
.search-bar .search-input[data-v-8a5d1ac3] {
  width: 100%;
  margin: 0;
  padding-right: 8px;
}
.input-field[data-v-1a892a33] {
  margin-bottom: 16px;
}
.input-field-wrapper[data-v-1a892a33] {
  display: flex;
  position: relative;
}
.input-field-wrapper input[data-v-1a892a33] {
  width: 100%;
  max-width: 100%;
}
input[type="text"] {
  border: 1px solid #e6e7e2;
  border-radius: 0;
  outline: 0;
  padding: 7px 10px;
  font: 14px / 1.1rem Roboto-flex, Helvetica, Arial, sans-serif;
}
.search .button-search[data-v-8a5d1ac3] {
  border: 1px solid #fff;
}
.search .button-search .button[data-v-8a5d1ac3] {
  color: #fff;
  background-color: #252a2e;
  padding: 0 8px;
}
.button {
  box-sizing: border-box;
  -ms-box-sizing: border-box;
  -webkit-background-origin: border-box;
  text-align: center;
  text-transform: uppercase;
  vertical-align: middle;
  background-origin: border-box;
  -webkit-background-clip: border-box;
  background-clip: border-box;
  border: 0;
  border-radius: 0;
  padding: 10px 20px;
  display: inline-block;
}
.header-footer.fixed[data-v-3bcad4de] {
  z-index: 1;
  position: absolute;
}
.header-footer[data-v-3bcad4de] {
  display: flex;
}
.tabs[data-v-2b602c69] {
  position: relative;
}
.tabs.dark[data-v-d3915418] {
  background: #353b40;
  overflow: hidden;
}
.tabs.dark .tabs-menu[data-v-d3915418] {
  background: 0 0;
  border: 0;
  padding: 0;
  display: flex;
}
.tabs.scrollable .tabs-menu[data-v-d3915418] {
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow: scroll;
}
.tabs .tabs-menu[data-v-d3915418] {
  user-select: none;
  list-style: none;
  display: flex;
}
.tabs .tabs-selector[data-v-d3915418] {
  cursor: pointer;
  width: 100%;
}
.tabs.dark .tabs-menu .tabs-selector.active[data-v-d3915418] {
  color: #0AF0B5;
  background: 0 0;
  border-bottom: 2px solid #0AF0B5;
}
.tabs.square .tabs-selector.active.first[data-v-d3915418] {
  border-left: none;
}
.tabs.dark .tabs-menu .tabs-selector[data-v-d3915418] {
  color: #aaaeb0;
  background: 0 0;
  border: none;
  border-bottom: 2px solid transparent;
  flex-grow: 1;
}
.tabs.square .tabs-selector.active[data-v-d3915418] {
  background: #fff;
  border-bottom: none;
}
.tabs.square .tabs-selector[data-v-d3915418] {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
}
.tabs.square .tabs-selector[data-v-d3915418]:not(.last) {
  border-right: none;
}
.tabs .tabs-menu .tabs-selector.no-grow[data-v-d3915418] {
  width: auto;
  padding-left: 12px;
  padding-right: 12px;
}
.tabs.scrollable .tabs-selector[data-v-d3915418] {
  white-space: nowrap;
}
.tabs.square .tabs-selector[data-v-d3915418] {
  background: #f4f5f0;
  border: 1px solid #e6e7e2;
  border-top: none;
  padding: 10px 16px;
}
.tabs .tabs-selector .tab-item[data-v-d3915418] {
  height: 100%;
}
.tabs.dark .tabs-menu .tabs-selector.active[data-v-d3915418] {
  color: #0AF0B5;
}
.tabs.scrollable .tabs-selector[data-v-d3915418] {
  white-space: nowrap;
}
.tabs .tabs-selector .tab-item-border[data-v-d3915418] {
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
}
.tabs .tabs-selector .tab-item-border .tab-icon[data-v-d3915418] {
  align-items: center;
  display: flex;
}
.tabs.dark .tabs-menu .tabs-selector.active .tab-item .tab-icon .svg-icon[data-v-d3915418] {
  fill: #0AF0B5;
}
svg.icon-size-small[data-v-02f45589],
img.icon-size-small[data-v-02f45589] {
  width: 14px;
  height: 14px;
}
.tabs.dark .tabs-menu .tabs-selector .tab-item .tab-icon .svg-icon[data-v-d3915418] {
  fill: #aaaeb0;
}
.tabs.dark .tabs-menu .tabs-selector .tab-item .tab-text[data-v-d3915418] {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
}
.tabs .tabs-selector .tab-item-border .tab-icon + .tab-text[data-v-d3915418] {
  margin-left: 8px;
}
</style>