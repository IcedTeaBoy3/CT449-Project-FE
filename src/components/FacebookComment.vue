<template>
    <div>
        <div id="fb-root"></div>
        <div class="fb-comments"
            :data-href="url"
            data-width="100%"
            data-numposts="5">
        </div>
    </div>
</template>
  
<script setup>
  import { onMounted, defineProps } from 'vue';
  
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
  