import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Travelpayouts script */}
        <script
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
          dangerouslySetInnerHTML={{
            __html: `(function () {
              var script = document.createElement("script");
              script.src = <script data-noptimize="1" data-cfasync="false" data-wpfc-render="false">
  (function () {
      var script = document.createElement("script");
      script.async = 1;
      script.src = 'https://tpembar.com/NDEwMDA3.js?t=410007';
      document.head.appendChild(script);
  })();
</script>
              document.head.appendChild(script);
            })();`
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
