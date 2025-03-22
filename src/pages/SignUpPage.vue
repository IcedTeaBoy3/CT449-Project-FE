<script setup>
import { onMounted, ref, reactive  } from 'vue';
import { useUserStore } from '@/stores/userStore'; // Import Pinia store
import { useRouter,useRoute } from 'vue-router';
import * as UserService from '@/services/UserService'; // Import API service

import Swal from "sweetalert2";
import { computed } from 'vue';


// import { }
const email = ref('');
const password = ref('');
const fullName = ref('');
const phone = ref('');
const confirmPassword = ref('');
const isShowPassword = ref(false);
const isShowConfirmPassword = ref(false);
const userStore = useUserStore();
const user = computed(() => userStore.getUser);
const route = useRoute();
const router = useRouter();
const errors = reactive({}); // Reactive giúp cập nhật lỗi ngay lập tức
const showSuccessAlert = () => {
  Swal.fire({
    title: "Đăng ký thành công thành công!",
    text: "Bạn sẽ được chuyển hướng trang đăng nhập.",
    icon: "success",
    timer: 2000, // 2 giây
    showConfirmButton: false,
  }).then(() => {
    const redirectPath = route.query.redirect || "/sign-in"; // Nếu không có trang trước, về trang chủ
    router.push(redirectPath);
  });
};
onMounted(() => {
  document.title = 'Đăng ký';
});
const validate = () => {
    // Xóa lỗi trước khi kiểm tra
    Object.keys(errors).forEach(key => delete errors[key]); 

    // Kiểm tra họ tên
    if (!fullName.value) {
        errors.fullName = 'Vui lòng nhập họ tên';
    }

    // Kiểm tra email hợp lệ
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.value) {
        errors.email = 'Vui lòng nhập email';
    } else if (!emailRegex.test(email.value)) {
        errors.email = 'Email không hợp lệ';
    }

    // Kiểm tra số điện thoại Việt Nam
    const phoneRegex = /^(0[2-9][0-9]{8}|84[2-9][0-9]{8})$/; 
    if (!phone.value) {
        errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(phone.value)) {
        errors.phone = 'Số điện thoại không hợp lệ (phải là số Việt Nam)';
    }

    // Kiểm tra mật khẩu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password.value) {
        errors.password = 'Vui lòng nhập mật khẩu';
    } else if (!passwordRegex.test(password.value)) {
        errors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
    }

    // Kiểm tra mật khẩu xác nhận
    if (!confirmPassword.value) {
        errors.confirmPassword = 'Vui lòng nhập mật khẩu xác nhận';
    } else if (password.value !== confirmPassword.value) {
        errors.confirmPassword = 'Mật khẩu không khớp';
    }

    return Object.keys(errors).length === 0; // Trả về `true` nếu không có lỗi
};
const handleSignup = async () => {
    if (!validate()) return;
    try {
        const response = await UserService.signupUser({ Email: email.value, Password: password.value, ConfirmPassword: confirmPassword.value, FullName: fullName.value, Phone: phone.value });
        if (response?.status === 'success') {
            showSuccessAlert();
        }
        else if(response?.status === 'error'){
            if(response.error === 'email'){
                errors.email = 'Email đã tồn tại';
            }
        }
    } catch (error) {
        console.log(error);
    }
    
};

</script>
<template>
    <div class="background-image">
      <form @submit.prevent="handleSignup" class="login-form">
        <h2 class="title text-center fw-bolder text-uppercase">Đăng ký</h2>
        <div class="form-group">
            <label for="fullName" class="form-label fw-bold" ><i class="bi bi-envelope-fill"></i> Họ và tên</label>
            <input 
                type="text" 
                id="fullName" 
                v-model="fullName" 
                placeholder="Nhập vào họ tên của bạn"
                :class="{ 'is-invalid': errors.fullName }"
            />
            <span class="text-danger fw-bold" v-if="errors.fullName">* {{ errors.fullName }}</span>
        </div>
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
        <div class="form-group">
            <label for="password" class="form-label fw-bold"><i class="bi bi-lock-fill text-warning"></i> Mật khẩu</label>
            <div class="password-wrapper">
                <input 
                    :type="isShowConfirmPassword ? 'text' : 'password'" 
                    id="confirmPassword" 
                    v-model="confirmPassword"
                    placeholder="Nhập mật khẩu"
                    :class="{ 'is-invalid': errors.password }"
                    
                />
                    <button type="button" @click="isShowConfirmPassword = !isShowConfirmPassword">
                    <i :class="isShowConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye'"></i>
                </button>
            </div>
            <span class="text-danger fw-bold" v-if="errors.confirmPassword">* {{ errors.confirmPassword }}</span>
        </div>
        <div class="form-group">
            <label for="phone" class="form-label fw-bold" ><i class="bi bi-envelope-fill"></i> Số điện thoại</label>
            <input 
                type="text" 
                id="phone" 
                v-model="phone" 
                placeholder="Nhập vào số điện thoại của bạn"
                :class="{ 'is-invalid': errors.phone }"
            />
            <span class="text-danger fw-bold" v-if="errors.phone">* {{ errors.phone }}</span>
        </div>

        <span>Nếu đã có tài khoản <router-link to="/sign-in" class="fw-bold">Đăng nhập</router-link></span>
        <button type="submit" class="button-submit">Đăng ký</button>
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
</style>
  