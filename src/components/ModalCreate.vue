<script setup>

import { defineEmits,defineProps } from 'vue';
const props = defineProps({
    title: String,
    visible: Boolean,
});
const emit = defineEmits(['close']);

</script>

<template>
    <div v-if="visible" class="modal fade show d-block" style="background: rgba(0, 0, 0, 0.5)">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" @click="$emit('close')"></button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">Đóng</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </template>
  

  
  <style scoped>
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1050;
  }
  
  </style>
  