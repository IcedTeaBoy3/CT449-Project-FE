<script>
export default {
  data() {
    return {
      
    };
  },
  methods: {
    
  },
  computed: {
    textColor() {
      // Nếu bgColor là trắng, thì chữ màu đen, ngược lại màu trắng
      return this.bgColor.toLowerCase() === "white" ? "#000000" : "#ffffff";
    },
    hoverColor(){
      return this.bgColor.toLowerCase() === "white" ? "#ddd" : " #0056b3";
    }
  },
  props: {
    bgColor: {
      type: String,
    },
  }
  
};
</script>

<template>
    <ul class="menu m-0">
      <slot></slot>
    </ul>
  </template>
  
  <style>
  /* Menu tổng thể */
  /* Thêm bóng mờ bên phải */
  .menu {
    list-style: none;
    height: 100vh;
    padding: 20px 10px;
    /* background: linear-gradient(to bottom, #007bff, #0056b3); */
    --bg-color: v-bind(bgColor);
    --text-color: v-bind(textColor);

    background: var(--bg-color);
    color: var(--text-color);
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
    color: var(--text-color); /* Màu chữ động */
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s;
  }
  
  /* Hover */
  .menu-link:hover {
    --bg-hover: v-bind(hoverColor);
    background: var(--bg-hover);
    transform: translateX(5px);
  }
  
  /* Active */
  .menu-link.active {
    background: #ffc107;
    color: #333;
  }
  </style>
  