<script setup>
import { ref, computed } from 'vue';
// import Paginate from "vue3-pagination"; // ✅ Import đúng
import { convertDate } from '../utils/convertDate';

// Nhận props
const props = defineProps({
    items: Array, // Dữ liệu để hiển thị
    columns: Array // Danh sách các cột (label và key)
});

const emit = defineEmits(['edit', 'delete','deleteMany','approve']);

// Danh sách các ID được chọn
const selectedIds = ref([]);

// Kiểm tra tất cả checkbox có được chọn không
const isAllSelected = computed(() => selectedIds.value.length === props.items.length && props.items.length > 0);

// Chọn hoặc bỏ chọn tất cả checkbox
const toggleSelectAll = () => {
    if (isAllSelected.value) {
        selectedIds.value = [];
    } else {
        selectedIds.value = props.items.map(item => item._id);
    }
};

// Chọn hoặc bỏ chọn một item
const toggleSelectItem = (id) => {
    const index = selectedIds.value.indexOf(id);
    if (index === -1) {
        selectedIds.value.push(id);
    } else {
        selectedIds.value.splice(index, 1);
    }
};

</script>

<template>
    <div class="table-responsive">
        <table class="table table-hover table-bordered text-center align-middle">
            <thead class="table-primary">
                <tr>
                    <th>
                        <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll">
                    </th>
                    <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items" :key="item._id">
                    <td>
                        <input 
                            type="checkbox" 
                            :checked="selectedIds.includes(item._id)"
                            @change="toggleSelectItem(item._id)"
                        >
                    </td>
                    <td v-for="col in columns" :key="col.key">
                        <template v-if="col.type === 'image'">
                            <img :src="item[col.key] || 'default.jpg'" alt="Ảnh" class="img-thumbnail" width="50" height="50">
                        </template>
                        <template v-else-if="col.type === 'boolean'">
                            <span>{{ item[col.key] ? 'Admin' : 'User' }}</span>
                        </template>
                        <template v-else-if="col.type === 'Date'">
                            <span>{{ convertDate(item[col.key]) }}</span>
                        </template>
                        <template v-else>
                            {{ item[col.key] ?? 'N/A' }}
                        </template>
                    </td>
                    <td>
                        <button class="btn btn-primary btn-sm me-1" @click="$emit('edit', item)" v-if="!item.TrangThai">
                            <i class="bi bi-pencil-square"></i> Sửa
                        </button>

                        <button 
                            class="btn btn-primary btn-sm me-1" 
                            v-if="item.TrangThai" @click="$emit('approve',item._id)"
                            :disabled="item.TrangThai !== 'Chờ xác nhận'" 
                        ><i class="bi bi-check-circle"></i> Duyệt
                        </button>
                        <button class="btn btn-danger btn-sm" @click="$emit('delete', item._id)">
                            <i class="bi bi-trash3"></i> Xóa
                        </button>
                    </td>
                </tr>
                <tr v-if="items?.length === 0">
                    <td colspan="8" class="text-center text-secondary">Không có dữ liệu</td>
                </tr>

            </tbody>
        </table>
    </div>
</template>

<style scoped>

</style>
