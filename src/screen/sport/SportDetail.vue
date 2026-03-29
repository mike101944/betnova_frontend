<script setup>
// No additional logic needed for static design
</script>

<template>
  <div class="h-full bg-sky-900 text-white p-4 font-sans">
    <!-- Header / Match Info (Placeholder) -->
    <div class="mb-2 text-center">
      <h2 class="text-xl font-bold">Manchester United vs Liverpool</h2>
      <p class="text-gray-400 text-sm">Premier League • Full Time</p>
    </div>

    <!-- 1. 1X2 / Full Time 2UP with Boosted -->
    <div class=" rounded-lg ">
      <div class="flex justify-between items-center mb-2">
        <span class="text-gray-300 font-medium">1X2 | Full Time 2UP</span>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center">
          <div class="text-xs text-gray-800">1</div>
          <div class="text-xs font-bold text-gray-800">1.31</div>
        </div>
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-1 flex flex-row justify-between items-center">
          <div class="text-xs text-gray-800">x</div>
          <div class="text-xs font-bold text-gray-800">1.2</div>
        </div>
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-1 flex flex-row justify-between items-center">
          <div class="text-xs text-gray-800">2</div>
          <div class="text-xs font-bold text-gray-800">3.31</div>
        </div>
       
      </div>
    </div>

    <!-- 3. Double Chance | Full Time 2UP -->
    <div class="rounded-lg  mb-2">
      <div class="text-gray-300 font-medium mb-2">Double Chance | Full Time 2UP</div>
      <div class="grid grid-cols-3 gap-3 text-center ">
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center">
          <div class="text-xs text-gray-800">1X</div>
          <div class="text-xs text-gray-800 font-bold">1.07</div>
        </div>
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-1 flex flex-row justify-between items-center">
          <div class="text-xs text-gray-800">X2</div>
          <div class="text-xs text-gray-800 font-bold">3.40</div>
        </div>
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-1 flex flex-row justify-between items-center">
          <div class="text-xs text-gray-800">12</div>
          <div class="text-xs text-gray-800 font-bold">1.15</div>
        </div>
      </div>
    </div>

    <!-- 4. Both Teams To Score | Full Time -->
    <div class=" rounded-lg  mb-2">
      <div class="text-gray-300 font-medium mb-2">Both Teams To Score | Full Time</div>
      <div class="grid grid-cols-2 gap-3 text-center">
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center">
          <div class="text-xs text-gray-800">Yes</div>
          <div class="text-xs text-gray-800 font-bold">2.48</div>
        </div>
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex flex-row justify-between items-center">
          <div class="text-xs text-gray-800">No</div>
          <div class="text-xs text-gray-800 font-bold">1.54</div>
        </div>
      </div>
    </div>

    <!-- 5. Correct Score | Full Time (Grid) -->
    <div class=" rounded-lg  mb-4">
      <div class="text-gray-300 font-medium mb-3">Correct Score | Full Time</div>
      <div class="grid grid-cols-3 sm:grid-cols-4 gap-2 text-center">
        <!-- Other -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">Other</div>
          <div class="text-xs text-gray-950 font-bold">31.02</div>
        </div>
        <!-- 0-0 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">0-0</div>
          <div class="text-xs text-gray-950 font-bold">11.44</div>
        </div>
        <!-- 0-1 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">0-1</div>
          <div class="text-xs text-gray-950 font-bold">20.29</div>
        </div>
        <!-- 0-2 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">0-2</div>
          <div class="text-xs text-gray-950 font-bold">72.25</div>
        </div>
        <!-- 0-3 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">0-3</div>
          <div class="text-xs text-gray-950 font-bold">83.33</div>
        </div>
        <!-- 0-4 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">0-4</div>
          <div class="text-xs text-gray-950 font-bold">83.33</div>
        </div>
        <!-- 0-5 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">0-5</div>
          <div class="text-xs text-gray-950 font-bold">83.33</div>
        </div>
        <!-- 0-6 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">0-6</div>
          <div class="text-xs text-gray-950 font-bold">83.33</div>
        </div>
        <!-- 1-0 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">1-0</div>
          <div class="text-xs text-gray-950 font-bold">5.23</div>
        </div>
        <!-- 1-1 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">1-1</div>
          <div class="text-xs text-gray-950 font-bold">9.72</div>
        </div>
        <!-- 1-2 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">1-2</div>
          <div class="text-xs text-gray-950 font-bold">32.82</div>
        </div>
        <!-- 1-3 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">1-3</div>
          <div class="text-xs text-gray-950 font-bold">83.33</div>
        </div>
        <!-- 1-4 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">1-4</div>
          <div class="text-xs text-gray-950 font-bold">83.33</div>
        </div>
        <!-- 1-5 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">1-5</div>
          <div class="text-xs text-gray-950 font-bold">83.33</div>
        </div>
        <!-- 2-0 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">2-0</div>
          <div class="text-xs text-gray-950 font-bold">4.76</div>
        </div>
        <!-- 2-1 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">2-1</div>
          <div class="text-xs text-gray-950 font-bold">8.42</div>
        </div>
        <!-- 2-2 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">2-2</div>
          <div class="text-xs text-gray-950 font-bold">31.25</div>
        </div>
        <!-- 2-3 -->
        <div class="cursor-pointer whitespace-nowrap bg-[#f4f5f0] opacity-50 border border-[#e6e7e2] rounded transition-all duration-200 hover:bg-[#e0f2e9] p-2 flex justify-between items-center">
          <div class="text-xs text-gray-950">2-3</div>
          <div class="text-xs text-gray-950 font-bold">83.33</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Optional custom styles if needed, Tailwind handles most */
</style>