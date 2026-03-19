<template>
  <div class="layout">
    <AppHeader @toggle="sidebarVisible = true" />
    <AppSidebar v-model:visible="sidebarVisible" />

    <main
      class="page-content"
      :class="{ 'center-content': isCenter }"
    >
      <router-view />
    </main>

    <AppFooter v-if="showHeader" />
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import AppHeader from '@/components/common/AppHeader.vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import AppFooter from '@/components/common/AppFooter.vue'

const sidebarVisible = ref(false)
const route = useRoute()

const isCenter = computed(() => route.meta.centerContent === true)
const showHeader = computed(() => !route.meta.guestOnly)
</script>