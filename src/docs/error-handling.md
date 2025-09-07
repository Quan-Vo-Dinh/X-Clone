# Error Handling

Trong express có 2 loại handler

## Request handler

Nhận request từ client và trả về response

với mỗi request handler thì chúng ta sẽ có 3 loại tham số: `req`, `res`, `next`.

nếu không dùng `next` thì không cần khai báo củng được

```ts
app.get('/user', (req, res, next) => {
  // do something
  res.send('hello world')
})
```

- gọi `next()` để chuyển request sang request handler tiếp theo
- gọi `next(err)` để chuyển request sang error handler tiếp theo

## Note quan trọng:

khi xảy ra lỗi trong synchronous handler thì tự động sẽ dược chuyển sang error handler

khi xãy ra lỗi trong asynchronous handler thì phải gọi `next(err)` để chuyển sang error handler

## Error handler

Nhận error từ request handler và trả về response

với mỗi error handler thì chúng ta phải **Bắt buộc phải khai báo đủ 4 tham số là** `err`, `req`, `res`, `next`

Nếu chỉ khai báo 3 tham số thì nó sẽ được coi là request handler
