<script setup>
import { ref } from "vue";
import { defineProps } from "vue";

const props = defineProps({
    product: Object,
});

</script>


<template>
    
    <div class="col-md-3 pe-0 mb-3">
        <router-link :to="'/product-detail/' + product._id">
            <div class="card">
                <img :src="product.HinhAnh" class="card-img-top" alt="Ảnh sách" v-if="product.HinhAnh" />
                <div class="card-body">
                    <h5 class="card-title">{{ product.TenSach }}</h5>
                    <p class="card-text"><strong>Tác giả:</strong> {{ product.TacGia }}</p>
                    <p class="card-text"><strong>Thể loại:</strong> {{ product.TheLoai }}</p>
                    <p class="card-text"><strong>Số quyển:</strong> {{ product.SoQuyen }}</p>
                    <p class="card-text"><strong>Giá:</strong> {{ product.DonGia.toLocaleString() }} VNĐ</p>
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

