<!-- src/components/Notification.vue -->
<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
    message: String,
    type: String, // 'success' hoặc 'error'
    visible: Boolean
});

const notificationClass = computed(() => ({
    'alert-success': props.type === 'success',
    'alert-danger': props.type === 'error',
}));
</script>


<template>
    <div v-if="visible" :class="['alert', 'position-fixed', 'top-0', 'end-0', 'm-3', 'p-3', 'shadow', 'rounded', notificationClass]" role="alert">
        {{ message }}
    </div>
</template>

<style scoped>
.alert {
    z-index: 1050;
    min-width: 300px;
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>