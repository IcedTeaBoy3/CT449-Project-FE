<script setup>
import { ref } from 'vue';
import { useProductStore } from '../stores/ProductStore';
import { useUserStore } from '../stores/userStore';
import { computed } from 'vue';
import Swal from 'sweetalert2';
import router from '../routes';
// const avatarUrl = '/logo.png';
const productStore = useProductStore();
const searchQuery = ref(''); 
const userStore = useUserStore();
const user = computed(() => userStore.getUser); // ✅ Dùng computed để lấy getter từ store
const handleOnChangeSearchQuery = () => {
  productStore.setSearchQuery(searchQuery.value);
};
const showSuccessAlert = () => {
  Swal.fire({
    title: "Đăng xuất thành công!",
    text: "Bạn sẽ được chuyển hướng về trang đăng nhập.",
    icon: "success",
    timer: 2000, // 2 giây
    showConfirmButton: false,
  }).then(() => {
    // Chuyển hướng sau khi thông báo tắt
    router.push("/sign-in");
  });
};
const handleLogout = () => {
  userStore.logOut();
  showSuccessAlert();
};
</script>
<template>
  <header class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm border-bottom fixed-top ">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Logo và Tên Website -->
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img src="/logo.png" alt="Vue logo" class="logo" />
        <span class="brand-text">Thư viện Online</span>
      </router-link>
      <!-- input tìm kiếm -->
      <div class="col-md-6">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            placeholder="Tìm kiếm..." 
            @input="handleOnChangeSearchQuery"
            v-model="searchQuery"
          />
          <button class="btn btn-primary" type="button">
            <i class="bi bi-search"></i> <!-- Icon tìm kiếm -->
          </button>
        </div>
      </div>


      <div v-if="!user.Email" class="text-white d-flex align-items-center">
        <i class="bi bi-person-circle me-2" style="font-size: 30px;" ></i>
        <router-link to="/sign-in" class="text-white">Đăng nhập</router-link>
      </div>
      <!-- Menu Điều Hướng -->
      <nav class="nav" v-else>
        <div class="dropdown">
          <!-- Avatar và tên người dùng -->
          <button class="btn text-white dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span>Xin chào, {{ user?.FullName }}</span>
          </button>

          <!-- Dropdown Menu -->
          <ul class="dropdown-menu">
            <li><router-link to="/profile" class="dropdown-item">Thông tin cá nhân</router-link></li>
            <li><router-link to="/my-books" class="dropdown-item">Sách đã mượn</router-link></li>
            <li><router-link to="/admin" class="dropdown-item">Quản lý hệ thống</router-link></li>
            <li class="dropdown-item" @click="handleLogout">Đăng xuất</li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>

<style>
/* Header */
header {
  background: linear-gradient(to right, #007bff, #0056b3);
}

/* Logo */
.logo {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin-right: 8px;
  border: 2px solid white;
  transition: transform 0.3s;
}

.logo:hover {
  transform: rotate(360deg);
}

/* Tên Website */
.brand-text {
  font-size: 22px;
  font-weight: bold;
  color: white;
  letter-spacing: 1px;
}

/* Menu Điều Hướng */
.nav {
  display: flex;
  position: relative;
  align-items: center;
  position: relative;
  gap: 15px;
}

/* Avatar */
.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid white;
}


.dropdown-menu {
  padding: 6px;
  min-width: 160px;
}

.dropdown-item:hover {
  background-color: #ccc;
}
/* Active Link */
.router-link-exact-active {
  color: white;
  background: #007bff;
  font-weight: bold;
}
</style>
