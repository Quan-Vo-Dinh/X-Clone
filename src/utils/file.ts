import fs from 'fs'
import path from 'path'

export const initFolder = (folderPath: string) => {
  const fullPath = path.resolve(folderPath)
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, {
      recursive: true // tạo cả thư mục cha nếu chưa tồn tại
    })
  }
}
