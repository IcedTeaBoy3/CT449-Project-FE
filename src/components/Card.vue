<script setup>
import { defineProps } from "vue";
import { useProductStore } from "../stores/ProductStore";
import { convertPrice } from "../utils/convertPrice";

const props = defineProps({
    product: Object,
});
const productStore = useProductStore();

</script>


<template>
    
    <div class="col-md-3 pe-0 mb-3">
        <router-link :to="'/product-detail/' + product._id" class="text-decoration-none">
            <div class="card">
                <img 
                :src="product.HinhAnh" 
                class="card-img-top" 
                alt="Ảnh sách" 
                v-if="product.HinhAnh" 
                />
                <div class="card-body">
                    <h5 class="
                        card-title 
                        text-primary 
                        
                        text-decoration-underline
                        text-capitalize 
                        mb-3">
                        {{ product.TenSach }}
                    </h5>
                    
                    <div>
                        <p class="mb-1"><strong>Tác giả</strong> {{ product.TacGia }}</p>
                        <p class="mb-1"><strong>Thể loại:</strong> {{ product.TheLoai }}</p>
                        <p class="mb-1"><strong>Số quyển:</strong> <span class="badge bg-success">{{ product.SoQuyen }} cuốn</span></p>
                        <p class="mb-1 price text-danger">
                           Giá: <span class="fw-bold">{{ convertPrice(product.DonGia)}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
  
   
</template>
<style scoped>
.card-img-top {
    height: 200px;
    object-fit: cover;
}

.card {
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.05); /* Phóng to 5% */
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2); /* Đổ bóng mạnh hơn */
}
</style>

