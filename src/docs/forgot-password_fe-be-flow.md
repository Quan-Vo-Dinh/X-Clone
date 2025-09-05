# 🔄 Interaction giữa Backend và Frontend trong Flow "Quên Mật Khẩu"

## 1. Người dùng chọn **"Quên mật khẩu"**

- **Frontend (FE):**
  - Hiển thị form nhập **email**.
  - Gửi request đến backend:

    ```
    POST /forgot-password
    ```

    ```json
    { "email": "user@example.com" }
    ```

- **Backend (BE):**
  - Kiểm tra email có tồn tại trong DB không.
  - Tạo `forgot_password_token` (random string hoặc JWT).
  - Lưu `forgot_password_token` vào document **user**.
  - Gửi email chứa link:

    ```
    https://myapp.com/reset-password?token=<forgot_password_token>
    ```

---

## 2. Người dùng **click vào link trong email**

- **Frontend:**
  - Khi click → mở trang `/reset-password?token=xxx`.
  - FE sẽ gọi API verify token:

    ```
    POST /verify-forgot-password
    { "token": "xxx" }
    ```

- **Backend:**
  - Nhận token và kiểm tra:
    - Có tồn tại không?
    - Có còn hạn không?

  - Nếu hợp lệ → trả về `200 OK` và cho phép FE hiển thị form nhập mật khẩu mới.
  - Nếu không hợp lệ → trả về `400`/`401` để FE hiển thị lỗi (token hết hạn, không hợp lệ).

---

## 3. Người dùng nhập **mật khẩu mới**

- **Frontend:**
  - Hiển thị form:
    - `new_password`
    - `confirm_new_password`

  - Gửi request đến backend:

    ```
    POST /reset-password
    {
      "token": "xxx",
      "new_password": "newPass123",
      "confirm_new_password": "newPass123"
    }
    ```

- **Backend:**
  - Verify token một lần nữa để đảm bảo an toàn.
  - Kiểm tra `new_password` và `confirm_new_password` có khớp không.
  - Hash mật khẩu mới (BCrypt/Argon2).
  - Cập nhật mật khẩu trong document **user**.
  - Xóa/disable `forgot_password_token` để token không dùng lại được.
  - Trả về response thành công → FE có thể chuyển hướng sang màn hình login.

---

## 4. Người dùng **đăng nhập lại**

- **Frontend:**
  - Sau khi reset thành công, FE hiển thị thông báo "Đổi mật khẩu thành công".
  - Chuyển hướng user về màn hình login để đăng nhập bằng mật khẩu mới.

- **Backend:**
  - Khi user login lại → xác thực bằng mật khẩu mới trong DB.

---

👉 Tóm gọn:

- **Frontend** chịu trách nhiệm: hiển thị form, gọi API, hiển thị thông báo, điều hướng UI.
- **Backend** chịu trách nhiệm: sinh token, verify token, gửi email, validate input, hash mật khẩu, cập nhật DB.

---

Bạn có muốn mình vẽ thêm **sequence diagram** (chuỗi request-response giữa FE và BE) để dễ hình dung hơn không?
