<script setup>
import { onMounted, ref } from 'vue';
// Nhập props từ route
import { useRoute, useRouter } from 'vue-router';
import * as ProductService from '../services/ProductServices';
import FacebookComment from '../components/FacebookComment.vue';
import FacebookLikeShare from '../components/FacebookLikeShare.vue';
import { useUserStore } from '../stores/userStore';
import NotificationComponent from '../components/NotificationComponent.vue';
import * as BorrowBookService from '../services/BorrowBookService';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const productId = ref(route.params.id);
const productDetail = ref({});
const currentUrl = ref('');

const userStore = useUserStore();
// Hiển thị thông báo
const notification = ref({
  message: '',
  type: '',
  visible: false
});
// Hiển thị thông báo trong 3 giây
const showNotification = (message, type) => {
  notification.value = { message, type, visible: true };
  setTimeout(() => {
      notification.value.visible = false;
  }, 3000);
};
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

const handleBorrowBook = async (productDetail) => {
  if (!userStore.access_token) {
    Swal.fire({
      title: "Bạn chưa đăng nhập!",
      text: "Vui lòng đăng nhập để mượn sách.",
      icon: "warning",
      showConfirmButton: true,
    }).then(() => {
      router.push({
        path: "/sign-in",
        query: { redirect: router.currentRoute.value.fullPath } // Lưu lại trang hiện tại
      });
    });
  }
  else if (productDetail.SoQuyen > 0) {
    Swal.fire({
      title: "Xác nhận mượn sách?",
      text: "Bạn có chắc chắn muốn mượn sách này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Mượn sách",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await BorrowBookService.createBorrowBook(userStore.getUser.access_token,{ 
          MaSach: productDetail._id,
          MaDocGia: userStore.getUser._id,
          NgayMuon: new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
          NgayTra: '',
          TrangThai: 'Chờ xác nhận'
        });
        if(response.status === 'success'){
          // Giảm số lượng trên giao diện ngay lập tức
          productDetail.SoQuyen -= 1;
          showNotification(response.message, response.status);
        } else {
          // Nếu lỗi xảy ra, khôi phục lại số lượng sách
          productDetail.SoQuyen += 1;
          showNotification(response.message, response.status);
        }
      }
    });
  } else {
    showNotification('Sách đã hết', 'error');
  }
};

</script>


<template>
    <NotificationComponent 
      :message="notification.message" 
      :type="notification.type" 
      :visible="notification.visible"
    />
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
          <button class="btn btn-success btn-md mt-3 fw-bold" @click="handleBorrowBook(productDetail)">
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
  