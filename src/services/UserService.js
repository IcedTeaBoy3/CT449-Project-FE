import axios from "axios";
export const loginUser = async (data) => {
    try{
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login-user`, data);
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}
export const getUserDetail = async (access_token,userId) => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/get-user-detail/${userId}`,{
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        return response.data;
    }
    catch(error){
        console.error(error);
    }
}