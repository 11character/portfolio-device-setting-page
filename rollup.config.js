import commonjs from 'rollup-plugin-commonjs' 
import vuePlugin from 'rollup-plugin-vue';

const plugins = [
    commonjs(),
    vuePlugin()
];

export default [
    {
        input: 'js/src/common.js',
        output: {
            file: 'js/dist/common.js',
            format: 'iife',
            name: 'nemolabs'
        },
        plugins: plugins
    },
    {
        input: 'js/src/deviceMain.js',
        output: {
            file: 'js/dist/device.js',
            format: 'iife',
            name: 'nemolabs'
        },
        plugins: plugins
    },
    {
        input: 'js/src/sensorMain.js',
        output: {
            file: 'js/dist/sensor.js',
            format: 'iife',
            name: 'nemolabs'
        },
        plugins: plugins
    },
    {
        input: 'js/src/monitoringMain.js',
        output: {
            file: 'js/dist/monitoring.js',
            format: 'iife',
            name: 'nemolabs'
        },
        plugins: plugins
    },
    {
        input: 'js/src/serialMonitoringMain.js',
        output: {
            file: 'js/dist/serial-monitoring.js',
            format: 'iife',
            name: 'nemolabs'
        },
        plugins: plugins
    },
    {
        input: 'js/src/systemLogMain.js',
        output: {
            file: 'js/dist/system-log.js',
            format: 'iife',
            name: 'nemolabs'
        },
        plugins: plugins
    },
    {
        input: 'js/src/setupMain.js',
        output: {
            file: 'js/dist/setup.js',
            format: 'iife',
            name: 'nemolabs'
        },
        plugins: plugins
    }
];