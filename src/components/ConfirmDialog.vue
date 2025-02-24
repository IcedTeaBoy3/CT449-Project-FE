<script setup>

const props = defineProps({
    title: String,
    message: String,
    visible: Boolean
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
    <div class="modal fade" :class="{ show: visible, 'd-block': visible }" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="btn-close" aria-label="Close" @click="emit('cancel')"></button>
                </div>
                <div class="modal-body">
                    <p>{{ message }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="emit('cancel')">Hủy</button>
                    <button type="button" class="btn btn-danger" @click="emit('confirm')">Xác nhận</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal {
    background: rgba(0, 0, 0, 0.5);
    z-index: 1050;
    overflow: hidden;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
