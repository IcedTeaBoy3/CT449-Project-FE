<script setup>
import { ref, defineEmits } from 'vue';

const searchQuery = ref('');
const emit = defineEmits(['search']);

const handleSearch = () => {
    emit('search', searchQuery.value);
};
</script>

<template>
    <div class="input-group w-100">
        <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm..."
            v-model="searchQuery"
            @keyup.enter="handleSearch"  
            
        />
        <button class="btn btn-primary" type="button" @click="handleSearch">
            <i class="bi bi-search"></i> <!-- Icon tìm kiếm -->
        </button>
    </div>
</template>
