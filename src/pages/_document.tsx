import { Head, Html, Main, NextScript } from "next/document";
import { globalTheme, globalThemeContext } from "~/styles/themes";

export default function Document() {
  return (
    <globalThemeContext.Provider value={globalTheme}>
      <Html data-theme="">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </globalThemeContext.Provider>
  );
}
