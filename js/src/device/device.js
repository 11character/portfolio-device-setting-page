import Channel from './channel';

export default class Device {
    constructor () {
        const me = this;

        /**
         * ID.
         */
        me.id = -1;

        /**
         * 기기번호.
         */
        me.number = 0;

        /**
         * 타입 코드
         */
        me.typeCode = 1;

        /**
         * 타입
         */
        me.type = 'outter';

        /**
         * 사용여부
         */
        me.isUse = true;

        /**
         * 단방향 수신여부.
         */
        me.isOneWay = false;

        /**
         * 이미지 경로.
         */
        me.imageUrl = 'img/usa-device.png';

        /**
         * 아날로그 채널.
         */
        me.analogChannels = [
            new Channel({
                number: 1,
                parent: me,
                name: 'Channel 1',
                type: 'analog',
                sensor: {
                    type: 'analog',
                    name: 'ANALOG_1',
                    minVoltage: 0,
                    maxVoltage: 5,
                    minValue: 0,
                    maxValue:5
                }
            }),
            new Channel({
                number: 2,
                parent: me,
                name: 'Channel 2',
                type: 'analog',
                sensor: {
                    type: 'analog',
                    name: 'ANALOG_2',
                    minVoltage: 0,
                    maxVoltage: 5,
                    minValue: 0,
                    maxValue:5
                }
            })
        ];

        /**
         * 디지털 채널.
         */
        me.digitalChannels = [
            new Channel({
                number: 1,
                parent: me,
                name: 'Channel 1',
                type: 'digital',
                sensor: {
                    type: 'digital',
                    name: 'DIGITAL_1',
                    minValue: 0,
                    maxValue: 1,
                }
            }),
            new Channel({
                number: 2,
                parent: me,
                name: 'Channel 2',
                type: 'digital',
                sensor: {
                    type: 'digital',
                    name: 'DIGITAL_2',
                    minValue: 0,
                    maxValue: 1,
                }
            })
        ];

        /**
         * 시리얼 채널.
         */
         me.serialChannels = [
            new Channel({
                number: 1,
                parent: me,
                name: 'Serial 1',
                type: 'serial',
                sensor: {
                    type: 'serial',
                    name: 'SERIAL_1',
                    protocol: 'NONE',
                }
            })
        ];

        /**
         * 블루투스 채널.
         */
         me.bluetoothChannels = [
            new Channel({
                number: 1,
                parent: me,
                name: 'Bluetooth',
                type: 'bluetooth',
                sensor: {
                    type: 'bluetooth',
                    name: 'BLE_DEFAULT',
                    uuid: '00000000-0000-0000-0000-000000000000'
                }
            })
        ];
    }

    static validateDevice(device, deviceList = []) {
        const arr = device.getSensorArray();

        const nameArr = arr.map(function (val) {
            return val.name;
        });

        const nameSet = new Set(nameArr);

        let isOk = true;
        let message = '';
        let emptyCount = 0;

        // 비어있는 이름이 있는지 확인.
        for (let i = 0; i < nameArr.length; i++) {
            if (!nameArr[i]) {
                emptyCount++;
            }
        }

        if (device.number < 0) {
            isOk = false;
            message = '디바이스의 번호는 0 보다 작을 수 없습니다.';

        } else if (!Number.isInteger(device.number)) {
            isOk = false;
            message = '디바이스 번호는 정수여야 합니다.';

        } else if (emptyCount > 0) {
            isOk = false;
            message = '센서의 이름은 필수입니다.';

        } else if (nameSet.size < nameArr.length) {
            isOk = false;
            message = '디바이스 내의 센서는 같은 이름을 가질 수 없습니다.';

        } else {
            // 같은 디바이스 번호가 있는지 확인한다.
            for (let i = 0; i < deviceList.length; i++) {
                if (device.id != deviceList[i].id && device.number == deviceList[i].number) {
                    isOk = false;
                    message = '디바이스는 같은 번호를 가질 수 없습니다.';
                    break;
                }
            }
        }

        return {
            isOk: isOk,
            message: message
        };
    }

    setValueFromDb(obj) {
        const me = this;

        me.id = obj.SEQ_ID;
        me.number = obj.USA_NUM;
        me.typeCode = obj.DEVICE_TYPE;
        me.isOneWay = (obj.IS_ONE_WAY === 1);

        me.type = 'outter';

        if (me.typeCode == 0) {
            me.type = 'inner';
        }

        me.isUse = (obj.IS_USE === 1);

        let number;

        for (let i = 0; i < me.analogChannels.length; i++) {
            number = i + 1;

            me.analogChannels[i].parent = me;
            me.analogChannels[i].number = number;
            me.analogChannels[i].sensor.isUse = (obj['ANALOG_IS_USE_' + number + 'CH'] === 1);
            me.analogChannels[i].sensor.name = obj['ANALOG_NAME_' + number + 'CH'];
            me.analogChannels[i].sensor.minVoltage = obj['ANALOG_MIN_VOLTAGE_' + number + 'CH'];
            me.analogChannels[i].sensor.maxVoltage = obj['ANALOG_MAX_VOLTAGE_' + number + 'CH'];
            me.analogChannels[i].sensor.minValue = obj['ANALOG_MIN_VALUE_' + number + 'CH'];
            me.analogChannels[i].sensor.maxValue = obj['ANALOG_MAX_VALUE_' + number + 'CH'];
        }

        for (let i = 0; i < me.digitalChannels.length; i++) {
            number = i + 1;

            me.digitalChannels[i].parent = me;
            me.digitalChannels[i].number = number;
            me.digitalChannels[i].sensor.isUse = (obj['DIGITAL_IS_USE_' + number + 'CH'] === 1);
            me.digitalChannels[i].sensor.name = obj['DIGITAL_NAME_' + number + 'CH'];
            me.digitalChannels[i].sensor.minValue = obj['DIGITAL_MIN_VALUE_' + number + 'CH'];
            me.digitalChannels[i].sensor.maxValue = obj['DIGITAL_MAX_VALUE_' + number + 'CH'];
        }

        for (let i = 0; i < me.bluetoothChannels.length; i++) {
            number = i + 1;

            me.bluetoothChannels[i].parent = me;
            me.bluetoothChannels[i].number = number;
            me.bluetoothChannels[i].sensor.isUse = (obj['BLUETOOTH_IS_USE_' + number + 'CH'] === 1);
            me.bluetoothChannels[i].sensor.name = obj['BLUETOOTH_NAME_' + number + 'CH'];
            me.bluetoothChannels[i].sensor.uuid = obj['BLUETOOTH_UUID_' + number + 'CH'];
        }

        for (let i = 0; i < me.serialChannels.length; i++) {
            number = i + 1;

            me.serialChannels[i].parent = me;
            me.serialChannels[i].number = number;
            me.serialChannels[i].sensor.isUse = (obj['SERIAL_IS_USE_' + number + 'CH'] === 1);
            me.serialChannels[i].sensor.name = obj['SERIAL_NAME_' + number + 'CH'];
            me.serialChannels[i].sensor.protocol = obj['SERIAL_PROTOCOL_' + number + 'CH'];
        }
    }

    getDataObject() {
        const me = this;

        const obj = {
            id: me.id,
            imageUrl: me.imageUrl,
            number: me.number,
            typeCode: me.typeCode,
            isUse: (me.isUse ? 1 : 0),
            isOneWay: (me.isOneWay ? 1 : 0)
        };

        let sensor;
        let number;

        // 아날로그 채널.
        for (let i = 0; i < me.analogChannels.length; i++) {
            sensor = me.analogChannels[i].sensor;
            number = i + 1;

            obj['analogIsUse' + number + 'ch'] = (sensor.isUse ? 1 : 0);
            obj['analogName' + number + 'ch'] = sensor.name;
            obj['analogMinVoltage' + number + 'ch'] = sensor.minVoltage;
            obj['analogMaxVoltage' + number + 'ch'] = sensor.maxVoltage;
            obj['analogMinValue' + number + 'ch'] = sensor.minValue;
            obj['analogMaxValue' + number + 'ch'] = sensor.maxValue;
        }

        // 디지털 채널.
        for (let i = 0; i < me.digitalChannels.length; i++) {
            sensor = me.digitalChannels[i].sensor;
            number = i + 1;

            obj['digitalIsUse' + number + 'ch'] = (sensor.isUse ? 1 : 0);
            obj['digitalName' + number + 'ch'] = sensor.name;
            obj['digitalMinValue' + number + 'ch'] = sensor.minValue;
            obj['digitalMaxValue' + number + 'ch'] = sensor.maxValue;
        }

        // 시리얼 채널.
        for (let i = 0; i < me.bluetoothChannels.length; i++) {
            sensor = me.bluetoothChannels[i].sensor;
            number = i + 1;

            obj['bluetoothIsUse' + number + 'ch'] = (sensor.isUse ? 1 : 0);
            obj['bluetoothName' + number + 'ch'] = sensor.name;
            obj['bluetoothUuid' + number + 'ch'] = sensor.uuid;
        }

        // 시리얼 채널.
        for (let i = 0; i < me.serialChannels.length; i++) {
            sensor = me.serialChannels[i].sensor;
            number = i + 1;

            obj['serialIsUse' + number + 'ch'] = (sensor.isUse ? 1 : 0);
            obj['serialName' + number + 'ch'] = sensor.name;
            obj['serialProtocol' + number + 'ch'] = sensor.protocol;
        }

        return obj;
    }

    getSensorArray() {
        const me = this;

        const arr = [];

        for (let i = 0; i < me.analogChannels.length; i++) {
            arr.push(me.analogChannels[i].sensor);
        }

        for (let i = 0; i < me.digitalChannels.length; i++) {
            arr.push(me.digitalChannels[i].sensor);
        }

        for (let i = 0; i < me.bluetoothChannels.length; i++) {
            arr.push(me.bluetoothChannels[i].sensor);
        }

        for (let i = 0; i < me.serialChannels.length; i++) {
            arr.push(me.serialChannels[i].sensor);
        }

        return arr;
    }

    getSensorByName(name) {
        const me = this;

        const arr = me.getSensorArray();

        let sensor = null;

        for (let i = 0; i < arr.length; i++) {
            if(arr[i].name == name) {
                sensor = arr[i];
                break;
            }
        }

        return sensor;
    }
}