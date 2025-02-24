import axios from 'axios';
export const getAllNXB = async () => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/nxb/get-all-nxb`);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}
export const getNXBDetail = async (id) => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/nxb/get-nxb/${id}`);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}
export const createNXB = async (data) => {
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/nxb/create-nxb`, data);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}
export const updateNXB = async (id,data) => {
    try{
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/nxb/update-nxb/${id}`, data);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}
export const deleteNXB = async (id) => {
    try{
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/nxb/delete-nxb/${id}`);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}