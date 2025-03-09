<script setup>
import SliderComponent from '../components/SliderComponent.vue';
import MenuComponent from '../components/MenuComponent.vue';
import * as ProductService from '../services/ProductServices';
import Card from '../components/Card.vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { computed } from 'vue';
import { useProductStore } from '../stores/ProductStore';

const productStore = useProductStore();

onMounted(async () => {
    document.title = 'Trang chủ';
    try {
        //Gọi Api lấy danh sách sản phẩm
        const response = await ProductService.getAllProducts();
        if (response.status === 'success') {
            productStore.setProducts(response.data);
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    }
});

// Lấy danh sách thể loại duy nhất từ store
const allCategories = computed(() => productStore.allCategories);
// // Lọc sản phẩm dựa trên thể loại đã chọn
// const filteredProducts = computed(() => productStore.filteredProducts);
// Lọc sản phẩm dựa trên từ khóa tìm kiếm
const filteredProductsBySearch = computed(() => productStore.filteredProductsBySearch);
// Hàm xử lý khi click vào thể loại
const filterByCategory = (category) => {    
    productStore.setCategory(category);
};
</script>
<template>
    <div class="container bg-body-secondary" style="margin-top: 80px;">
        <div class="row">
            <div class="col-12 mt-3 mb-3">
                <SliderComponent />
            </div>
            <div class="row pe-0">
                <div class="col-3">
                    
                    <h5 
                        class="fw-bold text-white text-capitalize bg-primary m-0 p-3 rounded-top text-decoration-italic"
                        style="box-shadow: 5px 0 5px -5px rgba(0, 0, 0, 0.5);"
                        >Thể loại sách
                    </h5>
                    <MenuComponent bg-color="white" >
                        <li 
                            class="menu-link border-bottom border-secondary " 
                            style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); cursor: pointer;/* Đổ bóng xuống dưới */"
                            :class="{ active: category === productStore.selectedCategory }" 
                            v-for="category in allCategories" :key="category"  
                            @click="filterByCategory(category)">
                                {{ category }}
                        </li>
                    </MenuComponent>

                </div>
                <div class="col-9">
                    
                    <div class="row">

                        <Card v-for="product in filteredProductsBySearch" :key="product._id" :product="product" />
                    </div>

                  
                    
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
/* Khi bấm vào thể loại thì tô màu nền xanh */
.menu-link.active {
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}
</style>
