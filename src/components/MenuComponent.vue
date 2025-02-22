<template>
    <ul class="menu">
      <li>
        <router-link to="/admin/products" class="menu-link" active-class="active">📦 Quản lý sách</router-link>
      </li>
      <li>
        <router-link to="/admin/users" class="menu-link" active-class="active">👤 Quản lý người dùng</router-link>
      </li>
    </ul>
  </template>
  
  <style scoped>
  /* Menu tổng thể */
  /* Thêm bóng mờ bên phải */
  .menu {
    list-style: none;
    height: 100vh;
    padding: 20px 10px;
    background: linear-gradient(to bottom, #007bff, #0056b3);
    box-shadow: 5px 0 5px -5px rgba(0, 0, 0, 0.5);
    
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  /* Link menu */
  .menu-link {
    display: block;
    padding: 12px 16px;
    border-radius: 8px;
    text-decoration: none;
    color: white;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s;
  }
  
  /* Hover */
  .menu-link:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }
  
  /* Active */
  .menu-link.active {
    background: #ffc107;
    color: #333;
    font-weight: bold;
  }
  </style>
  