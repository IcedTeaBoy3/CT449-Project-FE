<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import * as BorrowBookService from '../services/BorrowBookService';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { convertDate } from '../utils/convertDate.js';
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
const borrowBooks = ref([]);
const user = userStore.getUser;


onMounted(async () => {
    document.title = 'Sách đã mượn';
    try {
        const response = await BorrowBookService.getAllBorrowBookUser(user?.access_token, user?._id);
        if (response.status === 'success') {
            borrowBooks.value = response.data;
        }
    } catch (error) {
        console.error('Lỗi khi lấy sách đã mượn:', error);
    }
});
const handleReturnBook = (id) => {
    Swal.fire({
        title: 'Bạn có chắc chắn muốn trả sách này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Trả sách',
        cancelButtonText: 'Hủy',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await BorrowBookService.returnBook(user?.access_token,id);
                if (response.status === 'success') {
                    Swal.fire('Thành công', 'Trả sách thành công', 'success');
                    // Cập nhật lại trạng thái sách
                    borrowBooks.value = borrowBooks.value.map((borrowBook) => {
                        if (borrowBook._id === id) {
                            borrowBook.TrangThai = 'Đã trả';
                            borrowBook.NgayTra = new Date();
                        }
                        return borrowBook;
                    });
                }
            } catch (error) {
                console.error('Lỗi khi trả sách:', error);
                Swal.fire('Lỗi', 'Trả sách thất bại', 'error');
            }
        }
    });
}
</script>
<template>
    <div class="container bg-body-secondary" style="margin-top: 80px;">
        <h3 class="text-center p-2 mt-3">Sách đã mượn</h3>
        <div class="row">
            <div class="col-12">
                <div class="table-responsive">
                    <table class="table table-striped table-hover">
                        <thead class="table-primary">
                            <tr>
                                <th>#</th>
                                <th>Sách</th>
                                <th></th>
                                <th>Ngày mượn</th>
                                <th>Ngày trả</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(borrowBook, index) in borrowBooks" :key="borrowBook._id" class="align-middle">
                                <td>{{ index + 1 }}</td>
                                <td style="display: flex; align-items: center;">
                                    <img :src="borrowBook.MaSach.HinhAnh" alt="Ảnh bìa" style="width: 50px; height: 50px; object-fit: cover;">
                                
                                </td>
                                <td>

                                    {{ borrowBook.MaSach.TenSach }}
                                </td>
                                <td>{{ convertDate(borrowBook.NgayMuon) }}</td>
                                <td>{{ convertDate(borrowBook.NgayTra) }}</td>

                                <td>{{ borrowBook.TrangThai }}</td>
                                <td>
                                    <button 
                                        :disabled="borrowBook.TrangThai !== 'Đã duyệt'" 
                                        class="btn btn-primary" 
                                        @click="handleReturnBook(borrowBook?._id)"
                                    >
                                        Trả sách
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>