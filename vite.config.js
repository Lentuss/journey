import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'path';
import liveReload from 'vite-plugin-live-reload';

const pageData = {
    '/index.html': {
        title: 'Main Page',
    },
    '/404.html': {
        title: 'Sub Page',
    },
};

export default defineConfig({
    plugins: [
        handlebars({
            partialDirectory: path.resolve(__dirname, 'src/templates'),
            context(pagePath) {
                return pageData[pagePath];
            },
        }),
        liveReload(path.resolve(__dirname, 'src/**/*.hbs')),
    ],
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                404: './404.html',
            },
        },
    },
    css: {
        devSourcemap: true,
    },
    base: '',
});
