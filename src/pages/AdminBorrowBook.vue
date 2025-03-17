<script setup>
import Table from '@/components/Table.vue';
import { ref } from 'vue';
import { onMounted,computed } from 'vue';
import * as BorrowBookService from '@/services/BorrowBookService';
import { useUserStore } from '@/stores/userStore'; // Import Pinia store
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import NotificationComponent from '../components/NotificationComponent.vue';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const userStore = useUserStore();
const user = userStore.getUser;
const allBorrowBooks = ref([]);
// Hiển thị hộp thoại xác nhận
const comfirmDialog = ref({
    title: '',
    message: '',
    visible: false,
    id: null
});
onMounted(async () => {
    document.title = 'Quản lý mượn sách';
    try{
        const response = await BorrowBookService.getAllBorrowBookAdmin(user?.access_token)
        if(response.status == "success"){
            allBorrowBooks.value = response.data.map((item) => {
                return {
                    _id: item._id,
                    TenDocGia: item.MaDocGia.FullName,
                    HinhAnh: item.MaSach.HinhAnh,
                    TenSach: item.MaSach.TenSach,
                    NgayMuon: item.NgayMuon,
                    NgayTra: item.NgayTra,
                    TrangThai: item.TrangThai,
                }
            })
        }
    }catch(error){

    }
})

const approveBorrowBook = async (id) => {
    try {
        
        const response = await BorrowBookService.approveBorrowBook(user?.access_token, id);
        if (response?.status === 'success') {
            allBorrowBooks.value = allBorrowBooks.value.map((borrowBook) => {
                if (borrowBook._id === id) {
                    borrowBook.TrangThai = 'Đã duyệt';
                }
                return borrowBook;
            });
            Swal.fire('Thành công', 'Duyệt mượn sách thành công', 'success');
        }
    } catch (error) {
        console.error('Lỗi khi duyệt mượn sách:', error);
        Swal.fire('Lỗi', 'Duyệt mượn sách thất bại', 'error');
    }   
}
// Hiển thị hộp thoại xác nhận
const showConfirmModal = (id) => {
    comfirmDialog.value.id = id;
    comfirmDialog.value.visible = true;
};
// Xử lý khi xác nhận xoá
const handleConfirmDelete = async () => {
    try {
        const response = await BorrowBookService.deleteBorrowBook(user?.access_token, comfirmDialog.value.id);
        if (response.status === 'success') {
            allBorrowBooks.value = allBorrowBooks.value.filter((borrowBook) => borrowBook._id !== comfirmDialog.value.id);
            Swal.fire('Thành công', 'Xoá thông tin mượn sách thành công', 'success');
        }
    } catch (error) {
        console.error('Lỗi khi xoá thông tin mượn sách:', error);
        Swal.fire('Lỗi', 'Xoá thông tin mượn sách thất bại', 'error');
    }
    comfirmDialog.value.visible = false;
};
// Xử lý khi hủy xác nhận xoá
const handleCancelDelete = () => {
    comfirmDialog.value.visible = false;
};
const columns = [
    { key: 'TenDocGia', label: 'Người dùng' },
    { key: 'HinhAnh', label: 'Hình ảnh', type: 'image' },
    { key: 'TenSach', label: 'Sách' },
    { key: 'NgayMuon', label: 'Ngày mượn',type: 'Date' },
    { key: 'NgayTra', label: 'Ngày trả',type: 'Date' },
    { key: 'TrangThai', label: 'Trạng thái' },

];
</script>



<template>
    <ConfirmDialog 
        title="Xoá thông tin mượn sách" 
        message="Bạn có chắc chắn muốn xoá thông tin mượn này?" 
        :visible="comfirmDialog.visible"
        @confirm="handleConfirmDelete" 
        @cancel="handleCancelDelete"
    />
    <div class="p-3">
        <h4 class="fw-bold mb-3 border-bottom border-primary text-capitalize">Quản lý mượn sách</h4>
        <div class="d-flex justify-content-between">
            <button class="btn btn-success mb-3" @click="exportExcel">
                <i class="bi bi-plus-lg"></i> Xuất Excel
            </button>
        </div>
        <Table 
            :items="allBorrowBooks" 
            :columns="columns" 
            @delete="showConfirmModal"
            @approve="approveBorrowBook"
        </Table>
    </div>
</template>