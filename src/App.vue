<script setup>
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
</script>

<template>
  <div>
    <HeaderComponent/>
    <router-view />
    <FooterComponent />
  </div>
</template>

<style scoped>

</style>
