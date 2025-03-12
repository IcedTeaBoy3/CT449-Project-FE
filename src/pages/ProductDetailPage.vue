<script setup>
import { onMounted, ref } from 'vue';
// Nhập props từ route
import { useRoute } from 'vue-router';
import * as ProductService from '../services/ProductServices';
import FacebookComment from '../components/FacebookComment.vue';
import FacebookLikeShare from '../components/FacebookLikeShare.vue';
const route = useRoute();
const productId = ref(route.params.id);
const productDetail = ref({});
const currentUrl = ref('');

onMounted(async() => {
    document.title = 'Chi tiết sản phẩm';
    currentUrl.value = window.location.href;
    try{
        // Gọi API lấy chi tiết sản phẩm
        const response = await ProductService.getDetailProduct(productId.value);
        if(response.status === 'success'){
            productDetail.value = response.data;
        }
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    }
});

</script>


<template>
    <div class="container p-5 bg-body-tertiary" style="margin-top: 80px;">
      <div class="row align-items-center bg-white p-5 rounded shadow">
        <!-- Cột chứa hình ảnh -->
        <div class="col-12 col-md-5 text-center">
          <img 
            :src="productDetail.HinhAnh" 
            class="img-fluid rounded shadow-sm border" 
            alt="Ảnh sách" 
            width="300"
            v-if="productDetail.HinhAnh" 
          />
        </div>
  
        <!-- Cột chứa thông tin sản phẩm -->
        <div class="col-12 col-md-7">
          <h2 class="fw-bold text-primary">{{ productDetail.TenSach }}</h2>
          <hr>
          <p><strong>Tác giả:</strong> {{ productDetail.TacGia }}</p>
          <p><strong>Thể loại:</strong> {{ productDetail.TheLoai }}</p>
          <p><strong>Số quyển:</strong> {{ productDetail.SoQuyen }}</p>
          <p class="price text-danger">
            <strong>Giá:</strong> {{ productDetail.DonGia }} VNĐ
          </p>
          <p><strong>Mô tả:</strong> {{ productDetail.MoTa }}</p>
          <hr>
          <!-- Nút Mua ngay -->
          <FacebookLikeShare :url="currentUrl" />
          <button class="btn btn-success btn-md mt-3 fw-bold">
            Mượn sách
          </button>
        </div>
      </div>
      <div class="row bg-white p-5 rounded shadow mt-5">
        <h3 class="mt-5">Bình luận</h3>
        <FacebookComment url="https://developers.facebook.com/docs/plugins/" />
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Căn giữa hình ảnh */
  img {
    max-width: 100%;
    height: auto;
  }
  
  /* Làm nổi bật giá */
  .price {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  /* Thêm hiệu ứng cho nút */
  .btn-success {
    transition: 0.3s;
  }
  
  .btn-success:hover {
    background-color: #218838;
  }
  </style>
  