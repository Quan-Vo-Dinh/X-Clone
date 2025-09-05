Mình sẽ viết lại flow quên mật khẩu của bạn thành file `.md` với format rõ ràng, dễ đọc nhé:

```markdown
# 🔑 Password Reset Flow

Quy trình xử lý khi người dùng quên mật khẩu.

---

## 1. Người dùng chọn **"Quên mật khẩu"**

- Client gọi API:
```

POST /forgot-password

````
- Request body:
```json
{
  "email": "string"
}
````

---

## 2. Server xử lý `/forgot-password`

- Tạo và cập nhật `forgot_password_token` trong document **user**.
- Gửi email cho người dùng, trong email có kèm link reset mật khẩu (chứa token).

---

## 3. Người dùng **click vào link** trong email

- Client sẽ gửi `forgot_password_token` đến API:

  ```
  POST /verify-forgot-password
  ```

---

## 4. Server xử lý `/verify-forgot-password`

- Kiểm tra token trong link có hợp lệ hay không.
- Nếu hợp lệ → chuyển người dùng đến màn hình nhập:
  - `new_password`
  - `confirm_new_password`

---

## 5. Người dùng nhập mật khẩu mới

- Client gửi request đến API:

  ```
  POST /reset-password
  ```

- Request body:

  ```json
  {
    "new_password": "string",
    "confirm_new_password": "string"
  }
  ```

---

## 6. Server xử lý `/reset-password`

- Cập nhật lại `password` trong document **user**.
- Hoàn tất quá trình đổi mật khẩu.

---

✅ **Kết quả:** Người dùng có thể đăng nhập bằng mật khẩu mới.
