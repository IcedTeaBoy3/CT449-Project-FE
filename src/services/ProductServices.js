import axios from 'axios';
export const getAllProducts = async () => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/get-all-products`);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}
export const deleteProduct = async (id) => {
    try{
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/delete-product/${id}`);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}
export const createProduct = async (data) => {
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/products/create-product`, data);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}
export const updateProduct = async (id, data) => {
    try{
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/products/update-product/${id}`, data);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}