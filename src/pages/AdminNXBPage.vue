<script setup>
import { onMounted, onUpdated,computed } from 'vue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ref } from 'vue';
import * as NXBService from '../services/NXBService';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import NotificationComponent from '../components/NotificationComponent.vue';
import ModalCreate from '../components/ModalCreate.vue';
import Drawer from '../components/Drawer.vue';
import Table from '../components/Table.vue';



const nxbs = ref([]);
const showModal = ref(false);
// Thêm mới NXB
const newNXB = ref({ MaNXB:'' ,TenNXB: '', DiaChi: '' });
// Cập nhật NXB
const selectedNXB = ref({});
const errors = ref([]);
// Để cho biết có hiển thị drawer update sản phẩm hay không
const isDrawerVisible = ref(false);
// Hiển thị thông báo
const notification = ref({
    message: '',
    type: '',
    visible: false
});
// Hiển thị hộp thoại xác nhận
const comfirmDialog = ref({
    title: '',
    message: '',
    visible: false,
    id: null
});
const selectedIds = ref([]); // Lưu các ID được chọn


// Khi component được mount vào thì gọi API để hiển thị danh sách sản phẩm
onMounted(async () => {
    const response = await NXBService.getAllNXB();
    nxbs.value = response.data;
    console.log(nxbs.value);
    
});
// Hiển thị thông báo trong 3 giây
const showNotification = (message, type) => {
    notification.value = { message, type, visible: true };
    setTimeout(() => {
        notification.value.visible = false;
    }, 3000);
};
// Xác nhận xóa
const handleConfirmDelete = async () => {
    try {
        await NXBService.deleteNXB(comfirmDialog.value.id);
        nxbs.value = nxbs.value.filter((nxb) => nxb._id !== comfirmDialog.value.id);
        showNotification('Xóa thành công!', 'success');
    } catch (error) {
        console.error('Lỗi khi xóa NXB:', error);
        showNotification('Xóa thất bại!', 'error');
    } finally {
        comfirmDialog.value.visible = false;
    }
};
// Hủy xóa
const handleCancelDelete = () => {
    comfirmDialog.value.visible = false;
};
// Hiển thị hộp thoại xác nhận
const showConfirmModal = (id) => {
    comfirmDialog.value.id = id;
    comfirmDialog.value.visible = true;
};
// ✅ Hàm tạo mới NXB
const createNXB = async () => {
    if (!validateForm()) return; // Nếu form không hợp lệ thì dừng lại
    try {
        const response = await NXBService.createNXB(newNXB.value);
        if(response?.status == 'success'){

            nxbs.value.push(response.data);
            newNXB.value = { MaNXB:'', TenNXB: '', DiaChi: '' };
            showModal.value = false;
            showNotification(response.message, response.status);
        }
        else{
            errors.value.MaNXB = response?.message; 
        }
    } catch (error) {
        console.error('Lỗi khi thêm NXB:', error);
        showNotification('Thêm thất bại!', 'error');
    }
};
// Xử lý đóng model tạo NXB
const handleCloseModal = () => {
    newNXB.value = { MaNXB:'', TenNXB: '', DiaChi: '' };
    errors.value = {};
    showModal.value = false;
};

// Mở drawer và truyền dữ liệu của NXB được chọn
const openEditDrawer = (nxb) => {
    selectedNXB.value = { ...nxb };
    isDrawerVisible.value = true;
};
// Đóng drawer
const closeDrawer = () => {
    isDrawerVisible.value = false;
};
// Lưu dữ liệu sau khi chỉnh sửa
const saveNXB = async (updatedNXB) => {
    console.log('Updated', updatedNXB);

    try {
        const {_id, ...data} = updatedNXB;
        const response = await NXBService.updateNXB(_id, data); // ✅ Thêm await
        if (response?.status === 'success') {
            const index = nxbs.value.findIndex((nxb) => nxb._id === updatedNXB._id); // ✅ Đổi id thành _id
            if (index !== -1) {
                Object.assign(nxbs.value[index], updatedNXB); // ✅ Vue sẽ theo dõi được
            }
            showNotification('Cập nhật thành công!', 'success');
            closeDrawer();
        } else {
            showNotification(response.message, response.status);
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật NXB:', error);
        showNotification('Cập nhật thất bại!', 'error');
    } finally {
        closeDrawer();
    }
};

// ✅ Hàm kiểm tra dữ liệu
const validateForm = () => {
    errors.value = {};

    if (!newNXB.value.MaNXB) {
        errors.value.MaNXB = 'Mã NXB không được để trống!';
    } else if (!/^[a-zA-Z0-9]+$/.test(newNXB.value.MaNXB)) {
        errors.value.MaNXB = 'Mã NXB chỉ được chứa chữ cái và số!';
    }

    if (!newNXB.value.TenNXB) {
        errors.value.TenNXB = 'Tên NXB không được để trống!';
    } else if (newNXB.value.TenNXB.length < 3) {
        errors.value.TenNXB = 'Tên NXB phải có ít nhất 3 ký tự!';
    }

    if (!newNXB.value.DiaChi) {
        errors.value.DiaChi = 'Địa chỉ không được để trống!';
    }

    return Object.keys(errors.value).length === 0;
};
const exportExcel = () => {
    const data = nxbs.value.map((nxb) => {
        return {
            'Mã NXB': nxb.MaNXB,
            'Tên NXB': nxb.TenNXB,
            'Địa chỉ': nxb.DiaChi
        };
    });

    // 1. Tạo worksheet từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(data);

    // 2. Tạo workbook và thêm worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachNXB');

    // 3. Xuất file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'DanhSachNXB.xlsx');
};
const columns = [
    { label: 'Mã NXB', key: 'MaNXB' },
    { label: 'Tên NXB', key: 'TenNXB' },
    { label: 'Địa chỉ', key: 'DiaChi' }
];
</script>
<template>
    <NotificationComponent :message="notification.message" :type="notification.type" :visible="notification.visible" />
    <ConfirmDialog 
        title="Xoá nhà xuất bản" 
        message="Bạn có chắc chắn muốn xoá nhà xuất bản này?" 
        :visible="comfirmDialog.visible"
        @confirm="handleConfirmDelete" 
        @cancel="handleCancelDelete"
    />
     <!-- Drawer Component -->
    <Drawer
        title="Cập nhật NXB" 
        :visible="isDrawerVisible" 
        :nxb="selectedNXB" 
        @close="closeDrawer" 
        @save="saveNXB"
    >
        <template v-slot="{ editedNXB, errors }">  <!-- ✅ Nhận slot props -->
            <div class="mb-3">
                <label for="nxbMaNXB" class="form-label">Mã NXB:</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="nxbMaNXB" 
                    v-model="editedNXB.MaNXB" 
                    :class="{ 'is-invalid': errors.MaNXB }"
                >
                <div v-if="errors.MaNXB" class="invalid-feedback">{{ errors.MaNXB }}</div>
            </div>
            <div class="mb-3">
                <label for="nxbName" class="form-label">Tên NXB:</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="nxbName" 
                    v-model="editedNXB.TenNXB"
                    :class="{ 'is-invalid': errors.TenNXB }"
                >
                <div v-if="errors.TenNXB" class="invalid-feedback">{{ errors.TenNXB }}</div>
            </div>
            <div class="mb-3">
                <label for="nxbAddress" class="form-label">Địa Chỉ:</label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="nxbAddress" 
                    v-model="editedNXB.DiaChi"
                    :class="{ 'is-invalid': errors.DiaChi }"
                >
                <div v-if="errors.DiaChi" class="invalid-feedback">{{ errors.DiaChi }}</div>
            </div>
        </template>
    </Drawer>

    <!-- ✅ Modal Component -->
    <ModalCreate 
        :title="'Thêm NXB'" 
        :visible="showModal" 
        @close="handleCloseModal"
    >
        <form @submit.prevent="createNXB">
            <div class="mb-3">
                <label class="form-label">Mã NXB</label>
                <input 
                    v-model="newNXB.MaNXB" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD:M001" 
                    :class="{ 'is-invalid': errors.MaNXB }"
                />
                <div v-if="errors.MaNXB" class="invalid-feedback">{{ errors.MaNXB }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label">Tên NXB</label>
                <input 
                    v-model="newNXB.TenNXB" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD:Kim Đồng"
                    :class="{ 'is-invalid': errors.TenNXB }" 
                />
                <div v-if="errors.TenNXB" class="invalid-feedback">{{ errors.TenNXB }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input 
                    v-model="newNXB.DiaChi" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.DiaChi }" 
                />
                <div v-if="errors.DiaChi" class="invalid-feedback">{{ errors.DiaChi }}</div>
            </div>

            <button type="submit" class="btn btn-primary">Lưu</button>
            <button type="button" class="btn btn-secondary ms-2" @click="handleCloseModal">Hủy</button>
        </form>
    </ModalCreate>

    <div class="p-3">
        <!-- Hộp thoại xác nhận -->
        <h4 class="fw-bold mb-3 border-bottom border-primary text-capitalize">Quản lý NXB</h4>

        <!-- ✅ Nút mở modal -->
        <div class="d-flex justify-content-lg-between">

            <button class="btn btn-primary mb-3" @click="showModal = true">
                <i class="bi bi-plus-lg"></i> Thêm NXB
            </button>
            <button class="btn btn-success mb-3" @click="exportExcel">
                <i class="bi bi-plus-lg"></i> Xuất Excel
            </button>
        </div>
        <Table
            :items="nxbs" 
            :columns="columns" 
            @edit="openEditDrawer" 
            @delete="showConfirmModal" 
        />
    </div>
</template>