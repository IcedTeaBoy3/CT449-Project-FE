<script setup>
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <div>
    <HeaderComponent v-if="!route.meta.hideLayout" :hideSearch="true"/>
    <router-view />
    <FooterComponent v-if="!route.meta.hideLayout" />
  </div>
</template>

<style scoped>

</style>
