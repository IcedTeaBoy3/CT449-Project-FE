
<script setup>
import MenuComponent from '../components/MenuComponent.vue';
</script>

<template>
    <div class="container-fluid" style="margin-top: 80px;">

        <div class="row">
            <div class="col-4 col-md-2 p-0">
                <MenuComponent bg-color="linear-gradient(to bottom, #007bff, #0056b3)">
                    <li>
                        <router-link to="/admin/products" class="menu-link" active-class="active"><i class="bi bi-book"></i> Quản lý sách</router-link>
                    </li>
                    <li>
                        <router-link to="/admin/users" class="menu-link" active-class="active"><i class="bi bi-person"></i> Quản lý người dùng</router-link>
                    </li>
                    <li>
                        <router-link to="/admin/nxb" class="menu-link" active-class="active"><i class="bi bi-building"></i> Quản lý NXB</router-link>
                    </li>
                    <li>
                        <router-link to="/admin/borrow-books" class="menu-link" active-class="active"><i class="bi bi-journal-check"></i> Quản lý mượn sách</router-link>
                    </li>
                </MenuComponent>
            </div>
            <div class="col-8 col-md-10 bg-light p-0">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>