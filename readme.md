# node-tesseract-ocr

node-tesseract-ocr 是一個讓 tesseract-ocr 能夠在 node 環境下編譯使用的插件，方便我們在 js 檔中能夠引用進來輕鬆地做文字的 OCR (光學字元辨識)

下面我們就試試在 node 環境運行 node-tesseract-ocr，並配合 Express 這個輕量的 web 架構直接在 web 上渲染畫面

1. 進入目錄，安裝相依套件

node-tesseract-ocr 需要 tesseract-ocr 才能正常執行，因此我們先安裝 tesseract-ocr

```jsx
brew install tesseract
```

接著使用 yarn 安裝會用到的 node-tesseract-ocr 與 Express

```jsx
yarn add node-tesseract-ocr
yarn add express
```

2.  撰寫我們的測試檔案，記得要在同目錄下放辨識圖片，這裡以 image.png 為例

```jsx
// app.js

// 引入用到的兩個插件
const express = require('expconst express = require('express')
const tesseract = require('node-tesseract-ocr')

// 初始化 express
const app = express()
const port = 3000

// tesseract function
async function printResult() {
  try {
    // 拿到辨識結果
    const text = await tesseract.recognize('image.png')
    // 經由express印到頁面上
    app.get('/', (req, res) => {
      res.send(text)
    })
    console.log('Result:', text)
  } catch (error) {
    console.log(error.message)
  }
}

printResult()

// 設定啟動伺服器，並在我們剛剛設定的埠 3000 接聽連線
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})ress')
```

3. 在 node 環境執行

```jsx
node app.js
```

現在應該會在 terminal 中看到 'Example app listening at [http://localhost:](http://localhost:3000/)9527'
打開瀏覽器就能看到辨識過的字元印出來了

4. 在 Docker 中運行

要讓程式在 Docker 中運行，我們首先要建立 Dockerfile 腳本，讓 Docker 知道我們要怎麼 build 出映像檔

```docker
# Dockerfile

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
```

同時在根目錄建立 package.json 來儲存我們需要安裝的套件資訊

```json
// package.json
{
  "version": "1.0.0",
  "dependencies": {
    "node-tesseract-ocr": "^2.2.1",
    "express": "^4.16.1"
  }
}
```

然後就可以開始製作映像檔啦

```json
$ docker build -t <image-name> . --no-cache
```

在容器中執行映像檔，並將 express 預設的 3000 port 映射到本地的 8000 port

```json
$ docker run -p 8080:3000 --name <app-name> -d <image-name>
```

現在打開 [localhost:8080/](http://localhost:8080/) 就能看到瀏覽器印出辨識過的文字啦

4. 後記

一開始想把 app. js 用 Docker 建立 node 環境去運行，不知道為什麼本地直接執行 node app.js都沒問題，但放到 Docker 上會跳這個錯

`Command failed: tesseract stdin stdout`

後來才發現是因為本地早就用 brew 裝過 tesseract 才跑得起來，而 Docker 環境沒有，才跳了這個錯，因此要在 Dockerfile 中補上以下兩行才能順利執行

```docker
RUN apt-get update -y \
&&  apt-get install tesseract-ocr -y
```

注意這邊把 apt-get update 與 apt-get install 寫在同一個 RUN 可以避免多餘的 layer