import { defineStore } from "pinia";

export const useProductStore = defineStore("productStore", {
    state: () => ({
        products: [],       // Danh sách sản phẩm
        searchQuery: "",    // Từ khóa tìm kiếm
        selectedCategory: "Tất cả" // Thể loại đang chọn
    }),
    getters: {
        // Lấy ra tất cả các thể loại không trùng nhau
        allCategories: (state) => ["Tất cả", ...new Set(state.products.map(p => p.TheLoai))],

        // Lọc sản phẩm theo thể loại
        filteredProducts: (state) => {
            if (state.selectedCategory === "Tất cả") {
                return state.products;
            }
            return state.products.filter(product => product.TheLoai === state.selectedCategory);
        },

        // Lọc sản phẩm theo tìm kiếm + thể loại
        filteredProductsBySearch(state) {
            return state.filteredProducts.filter(product =>
                product.TenSach.toLowerCase().includes(state.searchQuery.toLowerCase())
            );
        }
    },
    actions: {
        setProducts(products) {
            this.products = products;
        },
        setSearchQuery(query) {
            this.searchQuery = query;
        },
        setCategory(category) {
            this.selectedCategory = category;
        }
    }
});
