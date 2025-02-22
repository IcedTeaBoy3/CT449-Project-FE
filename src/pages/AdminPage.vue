
<script setup>
import MenuComponent from '../components/MenuComponent.vue';
</script>

<template>
    <div class="container-fluid">

        <div class="row">
            <div class="col-4 col-md-2 p-0">
                <MenuComponent />
            </div>
            <div class="col-8 col-md-10 bg-light p-0">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>