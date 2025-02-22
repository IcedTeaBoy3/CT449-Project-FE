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