
<script setup>
import MenuComponent from '../components/MenuComponent.vue';

import { useRoute } from "vue-router";
import { computed, onMounted, ref } from 'vue';
import { useProductStore } from '@/stores/productStore'; // Import Pinia store
import { useUserStore } from '@/stores/userStore'; // Import Pinia store
import * as UserServices from '@/services/UserService'; // Import API services
import * as BorrowBookServices from '@/services/BorrowBookService'; // Import API services

const productStore = useProductStore();
const productCount = computed(() => productStore.productCount);
const publisherCount = computed(() => productStore.publisherCount);
const userCount = ref(0);
const borrowBookCount = ref(0);
const userStore = useUserStore();
const user = userStore.getUser;
onMounted(async () => {
    document.title = 'Trang quản trị';
    try {
        const access_token = user?.access_token;
        if (!access_token) {
            return;
        }
        const response = await UserServices.countUser(access_token);
        const responseBorrowBook = await BorrowBookServices.countBorrowBook(access_token);
        if (responseBorrowBook.status == 'success') {
            borrowBookCount.value = responseBorrowBook.data;
        }
        if (response.status == 'success') {
            userCount.value = response.data;
        }
    } catch (error) {
        console.log(error);
    }
});
const route = useRoute();

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
                <!-- // Nội dung của trang cha -->
                <div v-if="route.path == '/admin'" class="p-4 text-center">
                    <h1 class="fw-bold text-primary">📊 Trang Quản Trị</h1>
                    <p class="text-muted">Chào mừng bạn đến với hệ thống quản lý!</p>

                    <div class="row mt-4 mb-3">
                        <!-- Card số lượng sách -->
                        <div class="col-md-6">
                            <div class="card shadow-lg border-0">
                                <div class="card-body text-center">
                                    <i class="bi bi-book text-primary" style="font-size: 3rem;"></i>
                                    <h4 class="mt-2">Số lượng sách</h4>
                                    <p class="fw-bold text-success display-5">{{ productCount }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Card số lượng nhà xuất bản -->
                        <div class="col-md-6">
                            <div class="card shadow-lg border-0">
                                <div class="card-body text-center">
                                    <i class="bi bi-building text-danger" style="font-size: 3rem;"></i>
                                    <h4 class="mt-2">Số lượng NXB</h4>
                                    <p class="fw-bold text-success display-5">{{ publisherCount }}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="row">
                        <!-- Card số lượng người dùng -->
                        <div class="col-md-6">
                            <div class="card shadow-lg border-0">
                                <div class="card-body text-center">
                                    <i class="bi bi-person text-warning" style="font-size: 3rem;"></i>
                                    <h4 class="mt-2">Số lượng người dùng</h4>
                                    <p class="fw-bold text-success display-5">{{ userCount }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card shadow-lg border-0">
                                <div class="card-body text-center">
                                    <i class="bi bi-journal-check text-info" style="font-size: 3rem;"></i>
                                    <h4 class="mt-2">Mượn sách thành công</h4>
                                    <p class="fw-bold text-success display-5">{{ borrowBookCount }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>