<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore'; // Import Pinia store
import { useRouter,useRoute } from 'vue-router';
import * as UserService from '@/services/UserService'; // Import API service
import Swal from "sweetalert2";
import { computed } from 'vue';
import { GoogleLogin } from "vue3-google-login";
import axios from 'axios';

import * as jwtdecode from "jwt-decode";
// import { }
const email = ref('');
const password = ref('');
const isShowPassword = ref(false);
const userStore = useUserStore();
const user = computed(() => userStore.getUser);
const route = useRoute();
const router = useRouter();
const errors = ref({});
const showSuccessAlert = () => {
  Swal.fire({
    title: "Đăng nhập thành công!",
    text: "Bạn sẽ được chuyển hướng về trang chủ.",
    icon: "success",
    timer: 2000, // 2 giây
    showConfirmButton: false,
  }).then(() => {
    const redirectPath = route.query.redirect || "/"; // Nếu không có trang trước, về trang chủ
    router.push(redirectPath);
  });
};
onMounted(() => {
  document.title = 'Đăng nhập';
});
const handleLogin = async () => {
    errors.value = {}; // Xóa sạch lỗi trước khi kiểm tra

    // Kiểm tra lỗi đầu vào
    if (!email.value) {
        errors.value.email = 'Vui lòng nhập email';
    }
    if (!password.value) {
        errors.value.password = 'Vui lòng nhập mật khẩu';
    }

    // Ngừng thực thi nếu có lỗi
    if (Object.keys(errors.value).length > 0) return;

    try {
        const response = await UserService.loginUser({ Email: email.value, Password: password.value });

        if (response?.status === 'success') {
            // Lưu thông tin user vào store
            const access_token = response.access_token;
            if(access_token){
                const decodedToken = jwtdecode.jwtDecode(access_token);
                const {id, exp } = decodedToken;
                if(exp < Date.now() / 1000){
                    console.log('Token hết hạn');
                    return;
                }
                const userDetail = await UserService.getUserDetail(access_token,id);
                if(userDetail.status === 'success'){
                    userStore.setUser({...userDetail.data, access_token});
                    showSuccessAlert(); // Hiển thị thông báo và chuyển trang
                }
                
            }
        } else if (response?.status === 'error') {
            if (response.error === 'email') {
                errors.value.email = response.message;
            } else {
                errors.value.password = response.message;
            }
        }
    } catch (error) {
        Swal.fire({
            title: "Lỗi!",
            text: "Đăng nhập thất bại, vui lòng thử lại.",
            icon: "error",
        });
    }
};
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const handleGoogleLogin = async (response) => {
    const code = response?.code; // Đảm bảo lấy đúng `code` 
    if (!code) {
        console.error("No authorization code received!");
        return;
    }

    try {
        const response = await UserService.loginGoogle({code:code});
        if(response?.status == "success"){
            const access_token = response.access_token;
            console.log('access_token',access_token);
            if(access_token){
                const decodedToken = jwtdecode.jwtDecode(access_token);
                console.log('decodedToken',decodedToken);
                const { id, exp } = decodedToken;
                if(exp < Date.now() / 1000){
                    console.log('Token hết hạn');
                    return;
                }
                console.log('id',id);
                const userDetail = await UserService.getUserDetail(access_token,id);
                if(userDetail?.status === 'success'){
                    userStore.setUser({...userDetail.data, access_token});
                    showSuccessAlert(); // Hiển thị thông báo và chuyển trang
                }
                
            }
        }

    } catch (error) {
        console.error("Error during Google login:", error);
    }
};

</script>
<template>
    <!-- <NotificationComponent :message="errors" type="error" :visible="errors" /> -->
    <div class="background-image">
        <form @submit.prevent="handleLogin" class="login-form">
            <h2 class="title text-center fw-bolder text-uppercase">Đăng nhập</h2>
    
            <div class="form-group">
                <label for="email" class="form-label fw-bold" ><i class="bi bi-envelope-fill"></i> Email</label>
                <input 
                    type="text" 
                    id="email" 
                    v-model="email" 
                    placeholder="Nhập email của bạn"
                    :class="{ 'is-invalid': errors.email }"
                />
                <span class="text-danger fw-bold" v-if="errors.email">* {{ errors.email }}</span>
            </div>
    
            <div class="form-group">
                <label for="password" class="form-label fw-bold"><i class="bi bi-lock-fill text-warning"></i> Mật khẩu</label>
                <div class="password-wrapper">
                    <input 
                        :type="isShowPassword ? 'text' : 'password'" 
                        id="password" 
                        v-model="password"
                        placeholder="Nhập mật khẩu"
                        :class="{ 'is-invalid': errors.password }"
                        
                    />
                        <button type="button" @click="isShowPassword = !isShowPassword">
                        <i :class="isShowPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye'"></i>
                    </button>
                </div>
                <span class="text-danger fw-bold" v-if="errors.password">* {{ errors.password }}</span>
            </div>

            <span>Nếu chưa có tài khoản <router-link to="/sign-up" class="fw-bold">Đăng ký</router-link></span>

            <button type="submit" class="button-submit mb-4">Đăng nhập</button>
            <GoogleLogin :client-id="clientId" :callback="handleGoogleLogin">
                <button class="google-btn" type="button" >
                    <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
                    Đăng nhập bằng Google
                </button>
            </GoogleLogin>
        </form>
    </div>
</template>
  
  
<style scoped>
.form-group {
  margin-bottom: 15px;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.password-wrapper input {
  width: 100%;
  padding: 10px;
  padding-right: 40px; /* Để tránh bị đè bởi nút */
  border: 1px solid #ccc;
  border-radius: 5px;
}

.password-wrapper button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #555;
}
.background-image {
    position: fixed; /* Cố định background toàn màn hình */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: url('/anh_slider1.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
}
  
.login-form {
    background: #D2B48C; /* Màu nền form với độ mờ */
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    width: 500px;
}
  
.title {
    color: #333;
    font-size: 2rem;
    margin-bottom: 20px;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

.button-submit {
    width: 100%;
    padding: 10px;
    background: #8B4513;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    margin-top: 10px;
}

.button-submit:hover {
    background: #A0522D;
}

.google-btn {
    width: 100%;
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 16px;
    font-weight: 500;
    color: #757575;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.google-btn img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.google-btn:hover {
  background-color: #f8f8f8;
  border-color: #c6c6c6;
}
</style>
  