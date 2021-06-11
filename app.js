const express = require('express')
const tesseract = require('node-tesseract-ocr')

// init express, set localhost port
const app = express()
const port = 3000

// OCR function
async function printResult() {
  try {
    // get result
    const text = await tesseract.recognize('image.png')
    // print on page
    app.get('/', (req, res) => {
      res.send(text)
    })
    console.log('Result:', text)
  } catch (error) {
    console.log(error.message)
  }
}

printResult()

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
