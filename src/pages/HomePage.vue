<script setup>
import SliderComponent from '../components/SliderComponent.vue';
import MenuComponent from '../components/MenuComponent.vue';
import NotificationComponent from '../components/NotificationComponent.vue';
import * as ProductService from '../services/ProductServices';
import * as NXBService from '../services/NXBService';
import Card from '../components/Card.vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { computed } from 'vue';
import { useProductStore } from '../stores/ProductStore';
import { useUserStore } from '../stores/userStore';
const userStore = useUserStore();

const productStore = useProductStore();

const user = userStore.getUser;
onMounted(async () => {
    document.title = 'Trang chủ';
    try {
        //Gọi Api lấy danh sách sản phẩm
        const response = await ProductService.getAllProducts();
        if (response.status === 'success') {
            productStore.setProducts(response.data);
        }
        const responsePublisher = await NXBService.getAllNXB();
        console.log('responsePublisher', responsePublisher);
        
        if (responsePublisher.status === 'success') {
            productStore.setPublishers(responsePublisher.data);
        }
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    }
});

// Lấy danh sách thể loại duy nhất từ store
const allCategories = computed(() => productStore.allCategories);
// // Lấy danh sách nhà xuất bản duy nhất từ store
 const allPublishers = computed(() => productStore.allPublishers);
// // Lọc sản phẩm dựa trên thể loại đã chọn
// const filteredProducts = computed(() => productStore.filteredProducts);
// Lọc sản phẩm dựa trên từ khóa tìm kiếm
const filteredProductsFinal = computed(() => productStore.filteredProductsFinal);
// Hàm xử lý khi click vào thể loại
const selectedCategory = ref('Thể loại');
const filterByCategory = (category) => {    
    productStore.setCategory(category);
};
// Hàm xử lý khi click vào nhà xuất bản
const filterByPublisher = (publisher) => {
    productStore.setPublisher(publisher);
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
                    
                
                    <!-- Dropdown chọn danh mục -->
                    <div class="dropdown d-flex justify-content-evenly">
                        <button class="btn btn-primary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                            <span class="fs-4 fw-bold">{{ selectedCategory}}</span>
                        </button>
                        <ul class="dropdown-menu w-100">
                            <li>
                                <a
                                    class="dropdown-item" 
                                    @click.prevent="selectedCategory = 'Thể loại'"
                                    :class="{ active: selectedCategory === 'Thể loại' }"
                                >Theo thể loại
                                </a>
                            </li>
                            <li>
                                <a 
                                    class="dropdown-item" 
                                    @click.prevent="selectedCategory = 'Nhà xuất bản'"
                                    :class="{ active: selectedCategory === 'Nhà xuất bản' }"
                                > Theo nhà xuất bản</a>
                            </li>
                        </ul>
                    </div>
                  

                    <!-- Menu hiển thị theo điều kiện -->
                    <MenuComponent v-if="selectedCategory === 'Thể loại'" bg-color="white">
                        <li class="menu-link border-bottom border-secondary"
                            style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); cursor: pointer;"
                            v-for="category in allCategories" :key="category"
                            :class="{ active: productStore.selectedCategory === category }"
                            @click="filterByCategory(category)">
                        {{ category }}
                        </li>
                    </MenuComponent>

                    <MenuComponent v-if="selectedCategory === 'Nhà xuất bản'" bg-color="white">
                        <li class="menu-link border-bottom border-secondary"
                            style="box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); cursor: pointer;"
                            v-for="publisher in allPublishers" :key="publisher"
                            :class="{ active: productStore.selectedPublisher === publisher }"
                            @click="filterByPublisher(publisher)">
                            {{ productStore.getPublisherName(publisher) }} 
                        </li>
                        
                    </MenuComponent>
                   

                </div>
                <div class="col-9">
                    <div class="row">

                        <Card 
                            v-for="product in filteredProductsFinal" 
                            :key="product._id" 
                            :product="product" 
                        />

                        <div v-if="filteredProductsFinal.length === 0" class="text-center">
                            <!-- <i class="bi bi-image" style="font-size: 400px; color: white"></i> -->
                            <span>Không có sản phẩm nào</span>
                        </div>
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
