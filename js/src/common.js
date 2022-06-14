import Navbar from './vue/navbar.vue';

// 프로젝트 내부에서 만들어진 경로.
window.DEVICE_CREATE_URL = './api/device-create.php';
window.DEVICE_DELETE_URL = './api/device-delete.php';
window.DEVICE_SAVE_URL = './api/device-save.php';
window.DEVICE_LIST_URL = './api/device-list.php';
window.SENSOR_CREATE_URL = './api/sensor-create.php';
window.SENSOR_DELETE_URL = './api/sensor-delete.php';
window.SENSOR_SAVE_URL = './api/sensor-save.php';
window.SENSOR_LIST_URL = './api/sensor-list.php';
window.SENSOR_DATA_LIST_URL = './api/sensor-data-list.php';
window.SENSOR_DATA_NAME_LIST_URL = './api/sensor-data-name-list.php';
window.SENSOR_SERIAL_DATA_LIST_URL = './api/sensor-serial-data-list.php';
window.SENSOR_SERIAL_DATA_NAME_LIST_URL = './api/sensor-serial-data-name-list.php';
window.SETUP_INPO_URL = './api/setup-info.php';
window.SETUP_SAVE_URL = './api/setup-save.php';
window.PROTOCOL_CONFIG_FILES_URL = './api/protocol-config-files.php';
window.PROTOCOL_SAVE_URL = './api/protocol-save.php';
window.PROTOCOL_DATA_URL = './api/protocol-data.php';

// 프로젝트 외부에서 제공하는 경로.
window.BLUETOOTH_DEBUG_URL = './sample-page.php';
window.SERIAL_DEBUG_URL = './sample-page.php';
window.SERVER_REBOOT_URL = './sample-page.php';
window.SERVER_RESTART_URL = './sample-page.php';
window.SDR_CHANNEL_CHANGE_URL = './sample-page.php';

window.RATE_ARR = [
    50,
    75,
    100,
    200,
    250,
    600,
    1200,
    2400,
    4800,
    9600,
    14400,
    19200,
    28800,
    38400,
    57600,
    115200,
    230400,
    460800,
    921600
];

window.apiRequest = function (url, obj = {}, method = 'get') {
    return new Promise(function (resolve, reject) {
        $.ajax({
            method: method,
            url: url,
            dataType: 'json',
            data: obj
        }).done(function (obj) {
            if (obj.code == 0) {
                resolve(obj);

            } else {
                reject(new Error(obj.message));
            }
        }).fail(reject);
    });
};

const nav = new Vue({
    el: '#nav',
    components: {
        'main-nav': Navbar
    }
});