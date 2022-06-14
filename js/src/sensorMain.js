import SensorPage from './vue/sensor/sensorPage.vue';

const app = new Vue({
    el: '#container',
    components: {
        'sensor-page': SensorPage,
    }
});