// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'
import { default as Document } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
