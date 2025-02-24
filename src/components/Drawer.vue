<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
    title: String,
    visible: Boolean,
    nxb: Object, // Dữ liệu nhà xuất bản cần sửa
});

const emit = defineEmits(['close', 'save']);

// Sao chép dữ liệu để chỉnh sửa mà không ảnh hưởng đến prop gốc
const editedNXB = ref(props.nxb ? { ...props.nxb } : { MaNXB: '', TenNXB: '', DiaChi: '' });


// Theo dõi khi prop thay đổi thì cập nhật lại dữ liệu
watch(() => props.nxb, (newValue) => {
    editedNXB.value = newValue ? { ...newValue } : { MaNXB: '', TenNXB: '', DiaChi: '' };
    clearErrors();
});


// Đóng drawer
const closeDrawer = () => {
    emit('close');
};

// Lưu dữ liệu đã chỉnh sửa
const saveChanges = () => {
    if (validateForm()) {
        emit('save', editedNXB.value);
        closeDrawer();
    }
    else{
        console.log('Lỗi');
    }
};
// Lưu các lỗi validation
const errors = ref({
    MaNXB: '',
    TenNXB: '',
    DiaChi: ''
});
// Xóa các thông báo lỗi
const clearErrors = () => {
    errors.value = {
        MaNXB: '',
        TenNXB: '',
        DiaChi: ''
    };
};

// Kiểm tra dữ liệu trước khi lưu
const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!editedNXB.value.MaNXB.trim()) {
        errors.value.MaNXB = 'Vui lòng nhập mã NXB!';
        isValid = false;
    }

    if (!editedNXB.value.TenNXB.trim()) {
        errors.value.TenNXB = 'Vui lòng nhập tên NXB!';
        isValid = false;
    }

    if (!editedNXB.value.DiaChi.trim()) {
        errors.value.DiaChi = 'Vui lòng nhập địa chỉ!';
        isValid = false;
    }

    return isValid;
};

</script>

<template>
    <div class="drawer-overlay" v-if="visible" @click.self="closeDrawer">
        <div class="drawer">
            <div class="drawer-header">
                <h5 class="drawer-title">{{ title }}</h5>
                <button type="button" class="btn-close" @click="closeDrawer"></button>
            </div>
            <div class="drawer-body">
                <slot :editedNXB="editedNXB" :errors="errors"></slot>
            </div>
            <div class="drawer-footer">
                <button type="button" class="btn btn-secondary" @click="closeDrawer">Hủy</button>
                <button type="button" class="btn btn-primary" @click="saveChanges">Lưu</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.drawer-overlay {
    position: fixed;
    top: 0;
    right: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1050;
    display: flex;
    justify-content: flex-end;
}

.drawer {
    width: 500px;
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-in-out;
}

.drawer-header {
    padding: 1rem;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.drawer-body {
    padding: 1rem;
    flex-grow: 1;
    overflow-y: auto;
}

.drawer-footer {
    padding: 1rem;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
    }
    to {
        transform: translateX(0);
    }
}
</style>