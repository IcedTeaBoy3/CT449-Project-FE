import axios from "axios";
export const createBorrowBook = async (access_token,data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/borrow-books/create-borrow-book`, data,{
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const getAllBorrowBookUser = async (access_token,userId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/borrow-books/get-all-borrow-book/${userId}`,{
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const returnBook = async (access_token,id) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/borrow-books/return-book/${id}`,{
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const getAllBorrowBookAdmin = async (access_token) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/borrow-books/get-all-borrow-book`,{
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const approveBorrowBook = async (access_token,id) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/borrow-books/approve-borrow-book/${id}`, {}, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const deleteBorrowBook = async (access_token,id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/borrow-books/delete-borrow-book/${id}`,{
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const countBorrowBook = async (access_token) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/borrow-books/count-borrow-book`,{
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}