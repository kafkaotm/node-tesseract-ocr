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
const port = 9527

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

// 設定要啟動伺服器，並在我們剛剛設定的埠 9527 接聽連線
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

後記

原本想要把這個 js 檔用 Docker 建立 node 環境去運行，不知道為什麼本地直接執行 node app.js都沒問題，但放到Docker上會跳這個錯

`Command failed: tesseract stdin stdout`

後來才發現是因為本地早就用 brew 裝過 tesseract 才跑得起來，而 Docker 環境沒有，才跳了這個錯，如果知道要怎麼把 tesseract-ocr 掛載在 Docker 上的話還請不吝告訴我！