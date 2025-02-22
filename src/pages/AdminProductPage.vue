<script setup>
import { ref, onMounted } from 'vue';
import * as ProductService from '../services/ProductServices';

// Biến products lưu danh sách sách
const products = ref([]);

onMounted(async () => {
    const response = await ProductService.getAllProducts();
    products.value = response.data; // Lấy mảng data thay vì toàn bộ object
    console.log('products', products.value);
});
</script>

<template>
    <div class="p-3">
        <h4 class="fw-bold mb-3 border-bottom border-primary">Quản lý sách</h4>
        <button class="btn btn-primary mb-3">
            <i class="bi bi-plus-lg"></i> Thêm sách
        </button>
        <div class="table-responsive">
            <table class="table table-hover table-bordered text-center align-middle">
                <thead class="table-primary">
                    <tr>
                        <th>#</th>
                        <th>Tên sách</th>
                        <th>Đơn giá</th>
                        <th>Số quyển</th>
                        <th>Năm xuất bản</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(product, index) in products" :key="product._id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ product.tenSach }}</td>
                        <td>{{ product.donGia.toLocaleString() }} đ</td>
                        <td>{{ product.soQuyen }}</td>
                        <td>{{ product.namXuatBan || 'Chưa cập nhật' }}</td>
                        <td>
                            <button class="btn btn-primary btn-sm me-1">
                                <i class="bi bi-pencil-square"></i> Sửa
                            </button>
                            <button class="btn btn-danger btn-sm">
                                <i class="bi bi-trash3"></i> Xóa
                            </button>
                        </td>
                    </tr>
                    <tr v-if="products.length === 0">
                        <td colspan="6" class="text-center text-secondary">Không có dữ liệu</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.table {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
