import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every
 * web page during static rendering.
 * The contents of this function only run in Node.js environments and
 * do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                {/* Use generic CSS reset */}
                <ScrollViewStyleReset />

                {/* Add any additional <head> elements that you want globally available on web... */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          body { 
            background-color: #0f0f0f;
            color: #ffffff;
            font-family: 'Poppins_400Regular', sans-serif;
          }
          /* Ensure root follows suit */
          #root {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background-color: #0f0f0f;
          }
        `}} />
            </head>
            <body>{children}</body>
        </html>
    );
}
