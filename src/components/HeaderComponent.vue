<script>
export default {
  data() {
    return {
      isDropdownVisible: false,
      avatarUrl: '/images/default-avatar.png', // Thay bằng đường dẫn ảnh thật của bạn
    };
  },
  methods: {
    toggleDropdown(event) {
      event.stopPropagation(); // Ngăn sự kiện lan ra ngoài
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    closeDropdown() {
      this.isDropdownVisible = false;
    },
  },
  mounted() {
    document.addEventListener('click', () => {
      this.closeDropdown();
    });
  },
};
</script>
<template>
  <header class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Logo và Tên Website -->
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img src="/logo.png" alt="Vue logo" class="logo" />
        <span class="brand-text">Thư viện Online</span>
      </router-link>

      <!-- Menu Điều Hướng -->
      <nav class="nav">
        <div class="nav-avatar" @click="toggleDropdown">
          <img :src="avatarUrl" alt="Avatar" class="avatar-img" />
          <span>Nguyễn Văn A</span>
        </div>

        <!-- Popup Dropdown -->
        <div v-if="isDropdownVisible" class="dropdown-menu">
         
          <router-link to="/login" class="dropdown-item">Đăng xuất</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
/* Header */
header {
  background: linear-gradient(to right, #007bff, #0056b3);
  padding: 15px 0;
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
  align-items: center;
  position: relative;
  gap: 15px;
}

/* Ảnh đại diện */
.nav-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid white;
  transition: all 0.3s;
}

.nav-avatar:hover {
  border-color: #ffd700;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 50px;
  right: 0;
  width: 160px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}

.dropdown-item {
  display: block;
  padding: 12px 15px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.3s, color 0.3s;
}

.dropdown-item:hover {
  background-color: #007bff;
  color: white;
}

/* Active Link */
.router-link-exact-active {
  background: white;
  color: #007bff;
  font-weight: bold;
}
</style>
