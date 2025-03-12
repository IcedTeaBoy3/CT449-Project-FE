<script setup>
import Table from '@/components/Table.vue';
import { ref } from 'vue';
import { onMounted,computed } from 'vue';
import * as UserService from '@/services/UserService';
import { useUserStore } from '@/stores/userStore'; // Import Pinia store
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import NotificationComponent from '../components/NotificationComponent.vue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const users = ref([]);
const userStore = useUserStore();
const user = computed(() => userStore.getUser); // ✅ Dùng computed để lấy getter từ store
const comfirmDialog = ref({
    visible: false,
    id: null
});
// Hiển thị thông báo
const notification = ref({
    message: '',
    type: '',
    visible: false
});
onMounted(async() => {
    try {
        if (!user.value?.access_token) {
            console.warn("Không có access_token, không thể gọi API");
            return; 
        }
        const response = await UserService.getAllUsers(user?.value.access_token);
        if(response.status === 'success'){
            users.value = response.data;
        }
        
    } catch (error) {
        console.log(error);
    }
});
// Hiển thị hộp thoại xác nhận
const showConfirmModal = (id) => {
    comfirmDialog.value.id = id;
    comfirmDialog.value.visible = true;
};
// Xử lý khi người dùng hủy xoá
const handleCancelDelete = () => {
    comfirmDialog.value.visible = false;
};
// Hiển thị thông báo trong 3 giây
const showNotification = (message, type) => {
    notification.value = { message, type, visible: true };
    setTimeout(() => {
        notification.value.visible = false;
    }, 3000);
};
// Xử lý khi người dùng xác nhận xoá
const handleConfirmDelete = async () => {
    try {
        if(!user.value?.access_token){
            console.warn("Không có access_token, không thể gọi API");
            return;
        }
        const response = await UserService.deleteUser(comfirmDialog.value.id, user.value.access_token);
        if(response.status === 'success'){
            users.value = users.value.filter(user => user._id !== comfirmDialog.value.id);
            handleCancelDelete();
            showNotification(response.message, response.status);
        }
    } catch (error) {
        console.log(error);
    }
};

// Xuất Excel
const exportExcel = () => {
    const data = users.value.map((user) => {
        return {
            'Họ tên': user.FullName,
            'Email': user.Email,
            'Vai trò': user.isAdmin ? 'Admin' : 'User',
            'Địa chỉ': user.Address,
            'Số điện thoại': user.Phone,
        };
    });

    // 1. Tạo worksheet từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(data);

    // 2. Tạo workbook và thêm worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Danh_sach_nguoi_dung');

    // 3. Xuất file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'Danh_sach_nguoi_dung.xlsx');
};

const columns = [
    { key: 'FullName', label: 'Họ tên' },
    { key: 'Email', label: 'Email' },
    { key: 'isAdmin', label: 'Vai trò',type:'boolean' },
    { key: 'Address', label: 'Địa chỉ' },
    { key: 'Phone', label: 'Số điện thoại' },

];
</script>


<template>
    <NotificationComponent 
        :message="notification.message" 
        :type="notification.type" 
        :visible="notification.visible"
    />
    <ConfirmDialog 
        title="Xoá người dùng" 
        message="Bạn có chắc chắn muốn xoá người dùng này?" 
        :visible="comfirmDialog.visible"
        @confirm="handleConfirmDelete" 
        @cancel="handleCancelDelete"
    />
    <div class="p-3">
        <h4 class="fw-bold mb-3 border-bottom border-primary text-capitalize">Quản lý người dùng</h4>
        <div class="d-flex justify-content-between">
            <!-- <button class="btn btn-primary mb-3" @click="showCreateModal">
                <i class="bi bi-plus-lg"></i> Thêm sách
            </button> -->
            <button class="btn btn-success mb-3" @click="exportExcel">
                <i class="bi bi-plus-lg"></i> Xuất Excel
            </button>
        </div>
        <Table 
            :items="users" 
            :columns="columns" 
            @delete="showConfirmModal"
        </Table>
    </div>

</template>