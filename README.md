Lấy code về:
git clone https://github.com/longnguyen3204/book-store

-------------------------------------------------------
Đẩy code lên git:
git status #để kiểm tra các file được thêm, sửa, xóa
git add .
git commit -m "Mô tả ngắn những gì đã sửa"
git push

-------------------------------------------------------
Một số tình huống thường gặp
1. Sửa file nhưng Git không thấy?
Chưa lưu file → nhấn Ctrl + S.

2. Báo lỗi “rejected” khi push?
git pull
git push

3. Push nhầm file như .env, node_modules?
Thêm vào .gitignore, rồi chạy:

git rm --cached backend/.env
git rm -r --cached backend/node_modules
git commit -m "Remove sensitive files"
git push

-------------------------------------------------------
Nếu bị lỗi “non-fast-forward”
Pull về trước:

git pull --rebase
git push
