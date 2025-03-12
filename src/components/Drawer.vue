<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
    title: String,
    visible: Boolean,
    columns: Array, // Danh sách các cột (label và key)
    rules: Object, // Quy tắc validation
    object: Object, // Dữ liệu nhà xuất bản cần sửa
});

const emit = defineEmits(['close', 'save']);

// Sao chép dữ liệu để chỉnh sửa mà không ảnh hưởng đến prop gốc
const editedObject = ref({ ...props.object });


// Theo dõi props.object để cập nhật editedObject khi dữ liệu thay đổi
watch(
    () => props.object,
    (newValue) => {
        editedObject.value = { ...newValue }; // Cập nhật bản sao mới mỗi khi object thay đổi
    },
    { deep: true, immediate: true } // immediate: chạy ngay khi component được tạo
);


// Đóng drawer
const closeDrawer = () => {
    emit('close');
};

// Lưu dữ liệu đã chỉnh sửa
const saveChanges = () => {
    if (validateForm()) {
        emit('save', editedObject.value);
        closeDrawer();
    } else {
        console.log('Lỗi');
    }
};
// Lưu các lỗi validation
const errors = ref({});
props.columns.forEach(col => {
    errors.value[col.key] = '';
});
// Xóa các thông báo lỗi
const clearErrors = () => {
    for (let key in errors.value) {
        errors.value[key] = '';
    }
};
// ✅ Hàm validate cho từng trường với nhiều rule
const validateField = (key, value) => {
    const fieldRules = props.rules[key] || [];
    for (const rule of fieldRules) {
        const result = rule(value);
        if (result !== true) {
            errors.value[key] = result; // Nếu có lỗi thì gán thông báo và dừng lại
            return false;
        }
    }
    return true;
};
// ✅ Validate tất cả các trường
const validateForm = () => {
    clearErrors();
    let isValid = true;

    props.columns.forEach(col => {
        if (!validateField(col.key, editedObject.value[col.key])) {
            isValid = false;
        }
    });

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
                <slot :editedObject="editedObject" :errors="errors"></slot>
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
    width: 50%;
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