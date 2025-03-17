<script setup>
import Table from '@/components/Table.vue';
import { ref } from 'vue';
import { onMounted,computed } from 'vue';
import * as UserService from '@/services/UserService';
import { useUserStore } from '@/stores/userStore'; // Import Pinia store
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import NotificationComponent from '../components/NotificationComponent.vue';
import Drawer from '../components/Drawer.vue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
const users = ref([]);
const userStore = useUserStore();
// Lưu trạng thái của Drawer
const isDrawerVisible = ref(false);
// Lưu thông tin người dùng đang được chọn
const selectedUser = ref({});
const user = userStore.getUser;
// Hiển thị hộp thoại xác nhận
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
        document.title = 'Quản lý người dùng';
        if (!user?.access_token) {
            console.warn("Không có access_token, không thể gọi API");
            return; 
        }
        const response = await UserService.getAllUsers(user?.access_token);
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
        if(!user.access_token){
            console.warn("Không có access_token, không thể gọi API");
            return;
        }
        const response = await UserService.deleteUser(comfirmDialog.value.id, user.access_token);
        if(response.status === 'success'){
            users.value = users.value.filter(user => user._id !== comfirmDialog.value.id);
            handleCancelDelete();
            showNotification(response.message, response.status);
        }
    } catch (error) {
        console.log(error);
    }
};

const handleEditUser = (user) => {
    selectedUser.value = user;
    isDrawerVisible.value = true;
};
const handleCloseDrawer = () => {
    isDrawerVisible.value = false;
    selectedUser.value = {};
};

const handleSaveUser = async (editedUser) => {
    try {
        const {_id, ...data} = editedUser;
        const access_token = user?.access_token;
        console.log('access_token', access_token);
        
        const result = await UserService.updateUser(_id, data, access_token);
        if(result.status === 'success'){
            const index = users.value.findIndex(user => user._id === _id);
            if(index !== -1){
                users.value[index] = {...editedUser};
            }
            showNotification(result.message, result.status);
            isDrawerVisible.value = false;
        }
    } catch (error) {
        showNotification('Có lỗi xảy ra', 'error');
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
// Validation cho Drawer
const rules = {
    FullName: [
        value => !!value || 'Vui lòng nhập họ tên',
        value => value.length >= 3 || 'Họ tên phải có ít nhất 3 ký tự'
    ],
    Email: [
        value => !!value || 'Vui lòng nhập email',
        value => /.+@.+\..+/.test(value) || 'Email không hợp lệ'
    ],
    Address: [
        value => !!value || 'Vui lòng nhập địa chỉ',
        value => value.length >= 3 || 'Địa chỉ phải có ít nhất 3 ký tự'
    ],
    Phone: [
        value => !!value || 'Vui lòng nhập số điện thoại',
        value => /^[0-9]{10,11}$/.test(value) || 'Số điện thoại chỉ được chứa số và có 10 hoặc 11 chữ số',
        value => /^(0[3|5|7|8|9])[0-9]{8}$/.test(value) || 'Số điện thoại không hợp lệ'
    ],
};

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
            <button class="btn btn-success mb-3" @click="exportExcel">
                <i class="bi bi-plus-lg"></i> Xuất Excel
            </button>
        </div>
        <Table 
            :items="users" 
            :columns="columns" 
            @delete="showConfirmModal"
            @edit="handleEditUser"
        </Table>
    </div>
    <Drawer
        title="Cập nhật người dùng" 
        :visible="isDrawerVisible" 
        :object="selectedUser" 
        :columns="columns"
        :rules="rules"
        @close="handleCloseDrawer" 
        @save="handleSaveUser"
    >
        <template v-slot="{ editedObject, errors }">  <!-- ✅ Nhận slot props -->
            <div class="mb-3">
                <label class="form-label fw-bold">Họ tên:</label>
                <input 
                    v-model="editedObject.FullName" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: S001" 
                    :class="{ 'is-invalid': errors.FullName }"
                />
                <div v-if="errors.FullName" class="invalid-feedback">{{ errors.FullName }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Email:</label>
                <input 
                    v-model="editedObject.Email" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: bóng ma trong bí mật"
                    :class="{ 'is-invalid': errors.Email }" 
                />
                <div v-if="errors.Email" class="invalid-feedback">{{ errors.Email }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Vai trò:</label>
                <label class="ms-3">
                    <input 
                        v-model="editedObject.isAdmin" 
                        type="radio" 
                        class="form-check-input"
                        value="true" 
                        :class="{ 'is-invalid': errors.isAdmin }"
                    /> Admin
                </label>
                <label class="ms-3">
                    <input 
                        v-model="editedObject.isAdmin" 
                        type="radio" 
                        class="form-check-input"
                        value="false"
                        :class="{ 'is-invalid': errors.isAdmin }"
                    /> User
                </label>
                <div v-if="errors.isAdmin" class="invalid-feedback d-block">{{ errors.isAdmin }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Địa chỉ</label>
                <input 
                    v-model="editedObject.Address" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.Address }" 
                />
                <div v-if="errors.Address" class="invalid-feedback">{{ errors.Address }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Số điện thoại</label>
                <input 
                    v-model="editedObject.Phone" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.Phone }" 
                />
                <div v-if="errors.Phone" class="invalid-feedback">{{ errors.Phone }}</div>
            </div>
        </template>
    </Drawer>

</template>