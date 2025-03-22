import { defineStore } from "pinia";

export const useProductStore = defineStore("productStore", {
    state: () => ({
        products: [],       // Danh sách sản phẩm
        nxbs: [],           // Danh sách nhà xuất bản
        searchQuery: "",    // Từ khóa tìm kiếm
        selectedCategory: "Tất cả", // Thể loại đang chọn
        selectedPublisher: "Tất cả" // Nhà xuất bản đang chọn
    }),
    getters: {
        // Lấy ra tất cả các thể loại không trùng nhau
        allCategories: (state) => ["Tất cả", ...new Set(state.products.map(p => p.TheLoai))],
        // Lấy ra tất cả các nhà xuất bản không trùng nhau
        allPublishers: (state) => ["Tất cả",...new Set(state.products.map(p => p.MaNXB))],
        getPublisherName: (state) => (id) => {
            const publisher = state.nxbs.find(nxb => nxb.MaNXB === id);
            return publisher ? publisher.TenNXB : "Tất cả";
        },
        // lấy ra số lượng sản phẩm
        productCount: (state) => state.products.length,
        // lấy ra số lượng nhà xuất bản
        publisherCount: (state) => state.nxbs.length,
        
        // Lấy ra sản phẩm theo mã sản phẩm

        // Lọc sản phẩm theo thể loại
        filteredProducts: (state) => {
            if (state.selectedCategory === "Tất cả") {
                return state.products;
            }
            return state.products.filter(product => product.TheLoai === state.selectedCategory);
        },
        // Lọc sản phẩm theo nhà xuất bản
        filteredProductsByPublisher: (state) => {
            if (state.selectedPublisher === "Tất cả") {
                return state.products;
            }
            return state.products.filter(product => product.MaNXB === state.selectedPublisher);
        },

        // Lọc sản phẩm theo tìm kiếm + thể loại
        filteredProductsBySearch(state) {
            return state.products.filter(product =>
                product.TenSach.toLowerCase().includes(state.searchQuery.toLowerCase())
            );
        },
        // ✅ Lọc sản phẩm theo tất cả điều kiện
        filteredProductsFinal(state) {
            return state.products.filter(product => {
                const matchCategory = state.selectedCategory === "Tất cả" || product.TheLoai === state.selectedCategory;
                const matchPublisher = state.selectedPublisher === "Tất cả" || product.MaNXB === state.selectedPublisher;
                const matchSearch = product.TenSach.toLowerCase().includes(state.searchQuery.toLowerCase());

                return matchCategory && matchPublisher && matchSearch;
            });
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
        },
        setPublishers(nxbs) {
            this.nxbs = nxbs;
        },
        setPublisher(publisher) {
            this.selectedPublisher = publisher;
        }
    }
});
