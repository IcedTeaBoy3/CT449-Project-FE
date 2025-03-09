<template>
    <footer class="footer mt-5">
      <div class="container">
        <div class="footer-content">
          <!-- Cột 1: Giới thiệu -->
          <div class="footer-column">
            <h5>Về Chúng Tôi</h5>
            <p>QLMS là hệ thống quản lý mượn sách hiện đại, tiện lợi và nhanh chóng.</p>
          </div>
  
          <!-- Cột 2: Liên Kết -->
          <div class="footer-column">
            <h5>Liên Kết Nhanh</h5>
            <ul class="footer-links">
              <li><router-link to="/"><i class="bi bi-house-door"></i> Trang chủ</router-link></li>
              <li><router-link to="/about"><i class="bi bi-book"></i> Giới thiệu</router-link></li>
              <li><router-link to="/contact"><i class="bi bi-envelope"></i> Liên hệ</router-link></li>

            </ul>
          </div>
  
          <!-- Cột 3: Mạng Xã Hội -->
          <div class="footer-column">
            <h5>Kết Nối Với Chúng Tôi</h5>
            <div class="social-icons">
              <a href="#" class="social-link"><i class="bi bi-facebook"></i></a>
              <a href="#" class="social-link"><i class="bi bi-twitter"></i></a>
              <a href="#" class="social-link"><i class="bi bi-instagram"></i></a>
              <a href="#" class="social-link"><i class="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>
  
        <!-- Copyright -->
        <div class="footer-bottom">
          <p>&copy; 2024 QLMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </template>
  
<style scoped>
  /* Footer Chính */
  .footer {
    background: linear-gradient(to right, #007bff, #0056b3);
    color: white;
    padding: 15px 0;
    font-size: 16px;
  }
  
  /* Container */
  .container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Nội Dung Footer */
  .footer-content {
    display: flex;
    justify-content: space-between;
    gap: 30px;
    flex-wrap: wrap;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 20px;
  }
  
  /* Cột Footer */
  .footer-column {
    flex: 1;
    min-width: 250px;
  }
  
  .footer-column h5 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    position: relative;
  }
  
  .footer-column h5::after {
    content: '';
    display: block;
    width: 50px;
    height: 3px;
    background: #ffd700;
    margin-top: 8px;
  }
  
  /* Liên Kết Footer */
  .footer-links {
    list-style: none;
    padding: 0;
  }
  
  .footer-links li {
    margin-bottom: 8px;
  }
  
  .footer-links a {
    color: white;
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .footer-links a:hover {
    color: #ffd700;
  }
  
  /* Icon Mạng Xã Hội */
  .social-icons {
    display: flex;
    gap: 15px;
    margin-top: 10px;
  }
  
  .social-link {
    display: inline-block;
    width: 40px;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
    background: white;
    color: #007bff;
    font-size: 18px;
    text-align: center;
    transition: background 0.3s, color 0.3s;
  }
  
  .social-link:hover {
    background: #ffd700;
    color: #0056b3;
  }
  
  /* Copyright */
  .footer-bottom {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    opacity: 0.8;
  }
  </style>
  