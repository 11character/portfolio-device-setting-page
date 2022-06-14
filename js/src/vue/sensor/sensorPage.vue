<template>
    <div class="row d-flex flex-lg-nowrap flex-lg-row-reverse">
        <div class="col-12 col-lg-3">
            <div class="row px-1 pr-lg-5">
                <!-- 센서 리스트 -->
                <sensor-list
                    :disabled="disabled"
                    @itemselect="onSelectSensor"
                    @load="onLoadSensorList"
                    ref="list">
                </sensor-list>
                <!-- END-센서 리스트 -->
            </div>
        </div>

        <div class="col-12 col-lg-9 mt-3 mt-lg-0">
            <div class="row px-1 px-lg-5">
                <!-- 센서 제거 모달 -->
                <confirm-modal @confirm="onConfirmDelete" ref="deleteModal">
                    <div slot="message" class="h4 my-5 text-center">
                        Delete this item?
                    </div>
                </confirm-modal>
                <!-- END-센서 제거 모달 -->

                <!-- 센서 정보 -->
                <sensor-card :sensor="sensor" :disabled="disabled" class="col-12">
                    <div slot="button" class="row mt-3 mt-lg-0 px-3">
                        <button
                            :disabled="disabled"
                            @click="onClickNew"
                            type="button"
                            class="col-12 btn btn-outline-primary">

                            <span>New</span>
                        </button>
                    </div>

                    <div slot="button" class="row mt-2 px-3">
                        <button
                            :disabled="disabled || sdDisabled"
                            @click="onClickSave"
                            type="button"
                            class="col-12 btn btn-outline-primary">

                            <span>Save</span>
                        </button>
                    </div>

                    <div slot="button" class="row mt-2 px-3">
                        <button
                            :disabled="disabled || sdDisabled"
                            @click="onClickDelete"
                            type="button"
                            class="col-12 btn btn-outline-danger">

                            <span>Delete</span>
                        </button>
                    </div>
                </sensor-card>
                <!-- END-센서 정보 -->
            </div>
        </div>
    </div>
</template>

<script>
    import Sensor from '../../device/sensor';

    import SensorCardVue from './sensorCard.vue';
    import SensorListVue from './sensorList.vue';
    import ConfirmModalVue from '../confirmModal.vue';

    export default {
        components: {
            'sensor-card': SensorCardVue,
            'sensor-list': SensorListVue,
            'confirm-modal': ConfirmModalVue
        },
        data: function () {
            return {
                sensor: new Sensor({
                    type: 'analog',
                    minVoltage: 0,
                    maxVoltage: 5,
                    minValue: 0,
                    maxValue:5
                }),
                disabled: true,
                sdDisabled: false
            }
        },
        mounted: function () {
            const me = this;

            me.$refs.list.load();
        },
        methods: {
            valueCheck: function () {
                const me = this;

                const bool = me.sensor.name != ''
                    && typeof me.sensor.minVoltage == 'number'
                    && typeof me.sensor.maxVoltage == 'number'
                    && typeof me.sensor.minValue == 'number'
                    && typeof me.sensor.maxValue == 'number';

                return bool;
            },
            onCreate: function () {
                const me = this;

                me.disabled = true;

                me.$refs.list.load();
            },
            onSelectSensor: function (sensor) {
                const me = this;

                // 목록에 있는 값을 변경하지 않기 위해 객체를 복사하여 사용한다.
                me.sensor = new Sensor(sensor);
            },
            onLoadSensorList: function (sensorList) {
                const me = this;

                me.disabled = false;
                me.sdDisabled = sensorList.length < 1;
            },
            onClickNew: function () {
                const me = this;

                const sensor = me.sensor;

                if (me.valueCheck()) {
                    me.disabled = true;

                    apiRequest(SENSOR_CREATE_URL, sensor.getDataObject(), 'post').then(function () {
                        me.$refs.list.load();

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.$refs.list.load();
                    });

                } else {
                    alert('모든 값을 넣어주세요.');
                }
            },
            onClickSave: function () {
                const me = this;

                const sensor = me.sensor;

                if (sensor.id > -1) {
                    if (me.valueCheck()) {
                        me.disabled = true;
    
                        apiRequest(SENSOR_SAVE_URL, sensor.getDataObject(), 'post').then(function () {
                            me.$refs.list.load(true);
    
                        }).catch(function (error) {
                            console.error(error);
                            alert('processing error.');
                            me.$refs.list.load(true);
                        });

                    } else {
                        alert('모든 값을 넣어주세요.');
                    }
                }
            },
            onClickDelete: function () {
                const me = this;

                me.$refs.deleteModal.show();
            },
            onConfirmDelete: function (bool) {
                const me = this;

                const sensor = me.sensor;

                if (sensor.id > -1 && bool) {
                    me.disabled = true;

                    apiRequest(SENSOR_DELETE_URL, sensor.getDataObject(), 'post').then(function () {
                        me.$refs.list.load();

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.$refs.list.load();
                    });

                    me.sensor = new Sensor({
                        type: 'analog',
                        minVoltage: 0,
                        maxVoltage: 5,
                        minValue: 0,
                        maxValue:5
                    });
                }
            }
        }
    }
</script>