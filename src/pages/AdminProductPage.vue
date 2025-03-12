<script setup>
import { ref, onMounted } from 'vue';
import * as ProductService from '../services/ProductServices';
import * as NBXService from '../services/NXBService';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import Table from '../components/Table.vue';
import NotificationComponent from '../components/NotificationComponent.vue';
import ModalCreate from '../components/ModalCreate.vue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Drawer from '../components/Drawer.vue';

// Biến products lưu danh sách sách
const products = ref([]);
// Biến nxb lưu danh sách nhà xuất bản
const nxbs = ref([]);
// Hiển thị hộp thoại xác nhận
const comfirmDialog = ref({
    title: '',
    message: '',
    visible: false,
    id: null
});
// Hiển thị thông báo
const notification = ref({
    message: '',
    type: '',
    visible: false
});
// Hiển thị modal
const showModal = ref(false);
// Dữ liệu sách mới
const newProduct = ref({
    MaSach: '',
    TenSach: '',
    DonGia: '',
    SoQuyen: '',
    NamXuatBan: '',
    TacGia: '',
    MaNXB: '',
    TheLoai: '',
    HinhAnh: ''
});
// Lưu trữ lỗi form tạo mới
const errors = ref([]);
// Lưu trạng thái của Drawer
const isDrawerVisible = ref(false);
// Lưu thông tin Sách đang được chọn
const selectedProduct = ref({});


onMounted(async () => {
    const response = await ProductService.getAllProducts();
    if(response?.data){
        products.value = response?.data || [];
    } // ✅ Nếu không có dữ liệu thì gán mảng rỗng
});
// Hiển thị thông báo trong 3 giây
const showNotification = (message, type) => {
    notification.value = { message, type, visible: true };
    setTimeout(() => {
        notification.value.visible = false;
    }, 3000);
};
// Xử lý khi người dùng xác nhận xoá
const handleConfirmDelete = async () => {
    try{
        const result = await ProductService.deleteProduct(comfirmDialog.value.id);
        if(result?.data){
            products.value = products.value.filter((product) => product._id !== comfirmDialog.value.id);
            handleCancelDelete();
            showNotification(result.message, result.status);
        }
    } catch(error){
        showNotification('Xoá sách thất bại', 'error');
    }
};
// Hiển thị hộp thoại xác nhận
const showConfirmModal = (id) => {
    comfirmDialog.value.id = id;
    comfirmDialog.value.visible = true;
};
// Xử lý khi người dùng hủy xoá
const handleCancelDelete = () => {
    comfirmDialog.value.visible = false;
};
// Hiển thị modal tạo mới
const showCreateModal = async () => {
    showModal.value = true;
    // Gọi Api lấy danh sách nhà xuất bản
    try{
        const response = await NBXService.getAllNXB();
        if(response?.data){
            nxbs.value = response.data;
        }
    } catch(error){
        showNotification('Lấy danh sách nhà xuất bản thất bại', 'error');
    }
};
// Xử lý đóng form tạo mới
const handleCloseModal = () => {
    showModal.value = false;
    newProduct.value = {
        MaSach: '',
        TenSach: '',
        DonGia: '',
        SoQuyen: '',
        NamXuatBan: '',
        TacGia: '',
        MaNXB: '',
        TheLoai: '',
        HinhAnh: ''
    };
    // nxbs.value = [];
    errors.value = [];
};
// Xử lý tạo mới sách
const handleCreateProduct = async () => {
    if(!validateForm()){
        return;
    }
    try{
        const result = await ProductService.createProduct(newProduct.value);
        if(result.status === 'success'){
            products.value.push(result.data);
            newProduct.value = {
                MaSach: '',
                TenSach: '',
                DonGia: '',
                SoQuyen: '',
                NamXuatBan: '',
                TacGia: '',
                MaNXB: '',
                TheLoai: '',
                HinhAnh: ''
            };
            showNotification(result.message, result.status);
            handleCloseModal();
        }
        else{
            errors.value.MaSach = result.message;
        }
    } catch(error){
        showNotification('Tạo sách thất bại', 'error');
    }
};

// Xử lý khi người dùng chọn nút sửa
const handleEditProduct = async (product) => {
    try{
        const response = await NBXService.getAllNXB();
        if(response?.data){
            nxbs.value = response.data;
        }
        selectedProduct.value = {...product};
        isDrawerVisible.value = true;
    } catch(error){
        showNotification('Lấy danh sách nhà xuất bản thất bại', 'error');
    }
};
// Xử lý đóng drawer
const handleCloseDrawer = () => {
    selectedProduct.value = {};
    isDrawerVisible.value = false;
};
// Xử lý lưu thông tin sách đã chỉnh sửa
const handleSaveProduct = async (editedProduct) => {
    try{
        const {_id, ...data} = editedProduct;
        // console.log(editedProduct);
        
        const result = await ProductService.updateProduct(_id, data);
        
        
        if(result.status === 'success'){
            const index = products.value.findIndex((product) => product._id === _id);
            if(index !== -1){
                products.value[index] = {...editedProduct};
            }
            showNotification(result.message, result.status);
            handleCloseDrawer();
        }
    } catch(error){
        showNotification('Cập nhật sách thất bại', 'error');
    }
};

// hàm validate form tạo mới sách
const validateForm = () => {

    let isValid = true;
    if(!newProduct.value.MaSach.trim()){
        errors.value.MaSach = 'Vui lòng nhập mã sách';
        isValid = false;
    }
    if(!newProduct.value.TenSach.trim()){
        errors.value.TenSach = 'Vui lòng nhập tên sách';
        isValid = false;
    }
    if(!newProduct.value.DonGia.trim()){
        errors.value.DonGia = 'Vui lòng nhập đơn giá';
        isValid = false;
    }
    if(newProduct.value.DonGia <= 0){
        errors.value.DonGia = 'Đơn giá phải là số dương';
        isValid = false;
    }
    // Đơn giá là số
    if(isNaN(newProduct.value.DonGia)){
        errors.value.DonGia = 'Đơn giá phải là số';
        isValid = false;
    }
    if(!newProduct.value.SoQuyen.trim()){
        errors.value.SoQuyen = 'Vui lòng nhập số quyển';
        isValid = false;
    }
    if(newProduct.value.SoQuyen <= 0){
        errors.value.SoQuyen = 'Số quyển phải là số dương';
        isValid = false;
    }
    // Số quyển là số
    if(isNaN(newProduct.value.SoQuyen)){
        errors.value.SoQuyen = 'Số quyển phải là số';
        isValid = false;
    }
    if(!newProduct.value.NamXuatBan.trim()){
        errors.value.NamXuatBan = 'Vui lòng nhập năm xuất bản';
        isValid = false;
    }
    // Bắt lỗi năm là số
    if(isNaN(newProduct.value.NamXuatBan)){
        errors.value.NamXuatBan = 'Năm xuất bản phải là số';
        isValid = false;
    }
    // Năm xuất bản phải là số dương
    if(newProduct.value.NamXuatBan <= 0){
        errors.value.NamXuatBan = 'Năm xuất bản không hợp lệ';
        isValid = false;
    }

    if(!newProduct.value.TacGia.trim()){
        errors.value.TacGia = 'Vui lòng nhập tác giả';
        isValid = false;
    }
    if(!newProduct.value.MaNXB.trim()){
        errors.value.MaNXB = 'Vui lòng nhập mã NXB';
        isValid = false;
    }
    if(!newProduct.value.TheLoai.trim()){
        errors.value.TheLoai="Vui lòng nhập vào thể loại"
        isValid = false;
    }
    if(!newProduct.value.HinhAnh.trim()){
        errors.value.HinhAnh="Vui lòng nhập vào hình ảnh"
        isValid= false;
    }
    return isValid;
};
const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Lấy file đầu tiên
    
    if (file) {
    // Kiểm tra loại file
        if (!file.type.startsWith("image/")) {
            errors.value.HinhAnh = "Vui lòng chọn file ảnh"; // Thông báo lỗi
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        // Xóa thông báo lỗi
        errors.value.HinhAnh = "";
        reader.onload = () => {
            newProduct.value.HinhAnh = reader.result;
        };
    }
}
const handleUpdateFileUpload = (event) => {
    const file = event.target.files[0]; // Lấy file đầu tiên
    
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = () => {
            selectedProduct.value.HinhAnh = reader.result;
        };
    }
}
const exportExcel = () => {
    const data = products.value.map((product) => {
        return {
            MaSach: product.MaSach,
            TenSach: product.TenSach,
            DonGia: product.DonGia,
            SoQuyen: product.SoQuyen,
            NamXuatBan: product.NamXuatBan,
            TacGia: product.TacGia,
            MaNXB: product.MaNXB,
            TheLoai: product.TheLoai,
        };
    });

    // 1. Tạo worksheet từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(data);

    // 2. Tạo workbook và thêm worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachSach');

    // 3. Xuất file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'DanhSachSach.xlsx');
};
const columns = [
    { key: 'MaSach', label: 'Mã sách' },
    { key: 'TenSach', label: 'Tên sách' },
    { key: 'DonGia', label: 'Đơn giá' },
    { key: 'SoQuyen', label: 'Số quyển' },
    { key: 'NamXuatBan', label: 'Năm xuất bản' },
    { key: 'TacGia', label: 'Tác giả' },
    { key: 'MaNXB', label: 'Nhà xuất bản' },
    { key: 'TheLoai', label: 'Thể loại' },
    { key: 'HinhAnh', label: 'Hình ảnh', type: 'image' }
];
// ✅ Định nghĩa rules với nhiều điều kiện cho từng trường
const rules = {
    MaSach: [
        value => !!value || 'Vui lòng nhập mã sách',
        value => /^[A-Za-z0-9]+$/.test(value) || 'Mã sách chỉ được chứa chữ và số'
    ],
    TenSach: [
        value => !!value || 'Vui lòng nhập tên sách',
        value => value.length >= 3 || 'Tên sách phải có ít nhất 3 ký tự'
    ],
    DonGia: [
        value => !!value || 'Vui lòng nhập đơn giá',
        value => /^[0-9]+$/.test(value) || 'Đơn giá chỉ được chứa số',
        value => value > 0 || 'Đơn giá phải lớn hơn 0'
    ],
    SoQuyen: [
        value => !!value || 'Vui lòng nhập số quyển',
        value => /^[0-9]+$/.test(value) || 'Số quyển chỉ được chứa số',
        value => value > 0 || 'Số quyển phải lớn hơn 0'
    ],
    NamXuatBan: [
        value => !!value || 'Vui lòng nhập năm xuất bản',
        value => /^[0-9]{4}$/.test(value) || 'Năm xuất bản phải gồm 4 chữ số',
        value => value >= 1800 && value <= new Date().getFullYear() || 'Năm xuất bản không hợp lệ'
    ],
    TacGia: [
        value => !!value || 'Vui lòng nhập tên tác giả',
        value => value.length >= 3 || 'Tên tác giả phải có ít nhất 3 ký tự'
    ],
    MaNXB: [
        value => !!value || 'Vui lòng chọn nhà xuất bản'
    ],
    TheLoai: [
        value => !!value || 'Vui lòng nhập vào thể loại'
    ],
    HinhAnh: [
        // value => !!value.startsWith("image/") || "Vui lòng chọn hình ảnh hợp lệ"
    ]
};
</script>

<template>
    <NotificationComponent 
        :message="notification.message" 
        :type="notification.type" 
        :visible="notification.visible"
    />
    <ConfirmDialog 
        title="Xoá sách" 
        message="Bạn có chắc chắn muốn xoá sách này?" 
        :visible="comfirmDialog.visible"
        @confirm="handleConfirmDelete" 
        @cancel="handleCancelDelete"
    />
    <!-- ✅ Modal Component -->
    <ModalCreate 
        title="Thêm sách mới" 
        :visible="showModal" 
        @close="handleCloseModal"
    >
        <form @submit.prevent="handleCreateProduct">
            <div class="mb-3">
                <label class="form-label fw-bold">Mã sách:</label>
                <input 
                    v-model="newProduct.MaSach" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: S001" 
                    :class="{ 'is-invalid': errors.MaSach }"
                />
                <div v-if="errors.MaSach" class="invalid-feedback">{{ errors.MaSach }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Tên sách</label>
                <input 
                    v-model="newProduct.TenSach" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: bóng ma trong bí mật"
                    :class="{ 'is-invalid': errors.TenSach }" 
                />
                <div v-if="errors.TenSach" class="invalid-feedback">{{ errors.TenSach }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Đơn giá</label>
                <input 
                    v-model="newProduct.DonGia" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: 100000" 
                    :class="{ 'is-invalid': errors.DonGia }" 
                />
                <div v-if="errors.DonGia" class="invalid-feedback">{{ errors.DonGia }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Số quyển</label>
                <input 
                    v-model="newProduct.SoQuyen" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.SoQuyen }" 
                />
                <div v-if="errors.SoQuyen" class="invalid-feedback">{{ errors.SoQuyen }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Năm Xuất Bản</label>
                <input 
                    v-model="newProduct.NamXuatBan" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.NamXuatBan }" 
                />
                <div v-if="errors.NamXuatBan" class="invalid-feedback">{{ errors.NamXuatBan }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Tác Giả</label>
                <input 
                    v-model="newProduct.TacGia" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.TacGia }" 
                />
                <div v-if="errors.TacGia" class="invalid-feedback">{{ errors.TacGia }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Thể Loại</label>
                <input 
                    v-model="newProduct.TheLoai" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.TheLoai }"
                />
                <div v-if="errors.TheLoai" class="invalid-feedback">{{ errors.TheLoai }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Hình Ảnh</label>
                <input 
                    type="file" 
                    class="form-control" 
                    accept="image/*"
                    @change="handleFileUpload"
                    :class="{ 'is-invalid': errors.HinhAnh }"
                />
            </div>
            <div v-if="errors.HinhAnh" class="invalid-feedback">{{ errors.HinhAnh }}</div>

            <!-- Xem trước hình ảnh -->
            <div v-if="newProduct.HinhAnh">
                <img :src="newProduct.HinhAnh" alt="Xem trước ảnh" class="img-thumbnail mt-2" width="150">
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Mã NXB</label>
                <select 
                    v-model="newProduct.MaNXB" 
                    class="form-select" 
                    :class="{ 'is-invalid': errors.MaNXB }"
                >
                    <option value="">Chọn nhà xuất bản</option>
                    <option 
                        v-for="nxb in nxbs" 
                        :key="nxb.MaNXB" 
                        :value="nxb.MaNXB"
                    >
                        {{ nxb.TenNXB }}
                    </option>
                </select>
                <div v-if="errors.MaNXB" class="invalid-feedback">{{ errors.MaNXB }}</div>
            </div>
            
            <button type="submit" class="btn btn-primary">Lưu</button>
            <button type="button" class="btn btn-secondary ms-2" @click="handleCloseModal">Hủy</button>
        </form>
    </ModalCreate>
    <Drawer
        title="Cập nhật sách" 
        :visible="isDrawerVisible" 
        :object="selectedProduct" 
        :columns="columns"
        :rules="rules"
        @close="handleCloseDrawer" 
        @save="handleSaveProduct"
    >
        <template v-slot="{ editedObject, errors }">  <!-- ✅ Nhận slot props -->
            <div class="mb-3">
                <label class="form-label fw-bold">Mã sách:</label>
                <input 
                    v-model="editedObject.MaSach" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: S001" 
                    :class="{ 'is-invalid': errors.MaSach }"
                />
                <div v-if="errors.MaSach" class="invalid-feedback">{{ errors.MaSach }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Tên sách</label>
                <input 
                    v-model="editedObject.TenSach" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: bóng ma trong bí mật"
                    :class="{ 'is-invalid': errors.TenSach }" 
                />
                <div v-if="errors.TenSach" class="invalid-feedback">{{ errors.TenSach }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Đơn giá</label>
                <input 
                    v-model="editedObject.DonGia" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: 100000" 
                    :class="{ 'is-invalid': errors.DonGia }" 
                />
                <div v-if="errors.DonGia" class="invalid-feedback">{{ errors.DonGia }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Số quyển</label>
                <input 
                    v-model="editedObject.SoQuyen" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.SoQuyen }" 
                />
                <div v-if="errors.SoQuyen" class="invalid-feedback">{{ errors.SoQuyen }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Năm Xuất Bản</label>
                <input 
                    v-model="editedObject.NamXuatBan" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.NamXuatBan }" 
                />
                <div v-if="errors.NamXuatBan" class="invalid-feedback">{{ errors.NamXuatBan }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Tác Giả</label>
                <input 
                    v-model="editedObject.TacGia" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.TacGia }" 
                />
                <div v-if="errors.TacGia" class="invalid-feedback">{{ errors.TacGia }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Thể Loại</label>
                <input 
                    v-model="editedObject.TheLoai" 
                    type="text" 
                    class="form-control" 
                    placeholder="VD: Cần Thơ" 
                    :class="{ 'is-invalid': errors.TheLoai }"
                />
                <div v-if="errors.TheLoai" class="invalid-feedback">{{ errors.TheLoai }}</div>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Hình Ảnh</label>
                <input 
                    type="file" 
                    class="form-control" 
                    accept="image/*"
                    @change="handleUpdateFileUpload"
                    :class="{ 'is-invalid': errors.HinhAnh }"
                />
                <div v-if="errors.HinhAnh" class="invalid-feedback">{{ errors.HinhAnh }}</div>

                <!-- Hiển thị ảnh xem trước -->
                <div v-if="editedObject.HinhAnh" class="mt-2">
                    <img :src="editedObject.HinhAnh" alt="Xem trước ảnh" class="img-thumbnail" width="150">
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Mã NXB</label>
                <select 
                    v-model="editedObject.MaNXB" 
                    class="form-select" 
                    :class="{ 'is-invalid': errors.MaNXB }"
                >
                    <option value="">Chọn nhà xuất bản</option>
                    <option 
                        v-for="nxb in nxbs" 
                            
                        :key="nxb.MaNXB" 
                        :value="nxb.MaNXB"
                    >
                        {{ nxb.TenNXB }}
                    </option>
                </select>
                <div v-if="errors.MaNXB" class="invalid-feedback">{{ errors.MaNXB }}</div>
            </div>
        </template>
    </Drawer>
    <div class="p-3">
        <h4 class="fw-bold mb-3 border-bottom border-primary text-capitalize">Quản lý sách</h4>
        <div class="d-flex justify-content-between">
            <button class="btn btn-primary mb-3" @click="showCreateModal">
                <i class="bi bi-plus-lg"></i> Thêm sách
            </button>
            <button class="btn btn-success mb-3" @click="exportExcel">
                <i class="bi bi-plus-lg"></i> Xuất Excel
            </button>
        </div>
        <Table 
            :items="products" 
            :columns="columns" 
            @edit="handleEditProduct"
            @delete="showConfirmModal"
        </Table>
    </div>
</template>

<style scoped>
.table {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>