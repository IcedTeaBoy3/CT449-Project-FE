<template>
    <div>
      <!-- Nút Like -->
      <div class="fb-like" 
        :data-href="url" 
        data-width="" 
        data-layout="button_count" 
        data-action="like" 
        data-size="small" 
        data-share="false">
      </div>
  
      <!-- Nút Share -->
      <div class="fb-share-button" 
        :data-href="url" 
        data-layout="button_count">
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, onMounted } from 'vue';
  
  const props = defineProps({
    url: {
      type: String,
      required: true
    }
  });
  
  onMounted(() => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
  });
  </script>
  