<script setup>
import { ref } from 'vue';
import { useProductStore } from '../stores/ProductStore';

const avatarUrl = '/logo.png';
const productStore = useProductStore();
const searchQuery = ref(''); 

const handleOnChangeSearchQuery = () => {
  productStore.setSearchQuery(searchQuery.value);
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
            @change="handleOnChangeSearchQuery"
            v-model="searchQuery"
          />
          <button class="btn btn-primary" type="button">
            <i class="bi bi-search"></i> <!-- Icon tìm kiếm -->
          </button>
        </div>
      </div>


      

      <!-- Menu Điều Hướng -->
      <nav class="nav">
        <div class="dropdown">
          <!-- Avatar và tên người dùng -->
          <button class="btn text-white dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <img :src="avatarUrl" alt="Avatar" class="avatar-img me-2" />
            <span>Nguyễn Văn A</span>
          </button>

          <!-- Dropdown Menu -->
          <ul class="dropdown-menu">
            <li><router-link to="/profile" class="dropdown-item">Thông tin cá nhân</router-link></li>
            <li><router-link to="/my-books" class="dropdown-item">Sách đã mượn</router-link></li>
            <li><router-link to="/admin" class="dropdown-item">Quản lý hệ thống</router-link></li>
            <li><router-link to="/logout" class="dropdown-item">Đăng xuất</router-link></li>
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
