import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import path from 'path';
import liveReload from 'vite-plugin-live-reload';

const pageData = {
    '/index.html': {
        title: 'Main Page',
    },
    '/lesson3.html': {
        title: 'Lesson 3',
    },
    '/lesson4.html': {
        title: 'Lesson 4',
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
        glsl()
    ],
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                lesson3: './lesson3.html',
                lesson4: './lesson4.html',
                lesson27: './lesson27.html',
                404: './404.html',
            },
        },
    },
    css: {
        devSourcemap: true,
    },
    base: '',
});
