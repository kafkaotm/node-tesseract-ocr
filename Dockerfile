# 用 node 環境作為基本映像檔
FROM node:12

# 下載相依的 tesseract-ocr
RUN apt-get update -y \
&&  apt-get install tesseract-ocr -y

# 建立 app 目錄
WORKDIR /usr/src/app

# 複製 pakage.json 至根目錄並執行安裝
COPY package*.json ./
RUN npm install
COPY . .

# expose 在 3000 埠
EXPOSE 3000

# 在 node 環境下執行 app.js
CMD [ "node", "app.js" ]