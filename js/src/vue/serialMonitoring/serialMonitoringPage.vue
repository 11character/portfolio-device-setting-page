<template>
    <div class="row px-1 px-lg-5">
        <!-- 차트 모달 -->
        <sensor-chart-modal
            :api="api"
            @hidden="onHiddenModal"
            ref="sensorChartModal">
        </sensor-chart-modal>
        <!-- END-차트 모달 -->

        <!-- 디바이스 라인 -->
        <template v-for="(device, i) in deviceArr">
            <div v-if="numberByNameArr[device.number] && numberByNameArr[device.number].length" :key="i" class="card w-100 mb-3">
                <div class="card-body">
                    <div class="w-100 d-flex flex-wrap justify-content-start">
                        <!-- 채널 카드 -->
                        <div v-for="(data, key) in numberByNameArr[device.number]" :key="key" class="w-20 col-12 p-1">
                            <div
                                @click="onClickChannel(data.name, device)"
                                class="card btn btn-light p-0">

                                <div class="card-header d-flex justify-content-between">
                                    <span class="text-truncate">Device number : {{ device.number }}</span>
                                </div>

                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-3 d-flex justify-content-center align-items-center">
                                            <div class="chart-icon">
                                            </div>
                                        </div>
                                        <div class="col-9">
                                            <div class="row">
                                                <div class="col-12 text-center text-truncate">
                                                    Sensor Name
                                                </div>
                                                <h4 class="col-12 text-center text-truncate">
                                                    {{ data.name || '&nbsp;' }}
                                                </h4>
                                            </div>

                                            <div class="row">
                                                <h4 class="col-12 text-center text-truncate text-danger">
                                                    {{ data.value }}
                                                </h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- END-채널 카드 -->
                    </div>
                </div>
            </div>

            <div v-else :key="i" class="card w-100 mb-3">
                <div class="card-body">
                    <div class="text-center">Device number : {{ device.number }}</div>
                    <div class="h2 text-center text-secondary">None data</div>
                </div>
            </div>
        </template>
        <!-- END-디바이스 라인 -->
    </div>
</template>

<script>
    import Device from '../../device/device';
    import Channel from '../../device/channel';

    import SensorChartModalVue from '../monitoring/sensorChartModal.vue';

    export default {
        components: {
            'sensor-chart-modal': SensorChartModalVue
        },
        data: function () {
            return {
                api: SENSOR_SERIAL_DATA_LIST_URL,
                deviceArr: [],
                numberByNameArr: {},
                intervalId: null
            }
        },
        mounted: function () {
            const me = this;

            me.startInterval();
        },
        methods: {
            startInterval: function () {
                const me = this;

                clearInterval(me.intervalId);

                me.load();

                me.intervalId = setInterval(function () {
                    me.load();
                }, 10000);
            },
            stopInterval: function () {
                const me = this;

                clearInterval(me.intervalId);
            },
            load: function () {
                const me = this;

                const deviceArr = [];
                const numberByNameArr = {};

                // 디바이스 번호와 관련있는 이름의 목록을 가지고 온다.
                return apiRequest(SENSOR_SERIAL_DATA_NAME_LIST_URL, {}, 'get').then(function (obj) {
                    const arr = obj.data;

                    for (let i = 0; i < arr.length; i++) {
                        if (!numberByNameArr[arr[i].USA_NUM]) {
                            numberByNameArr[arr[i].USA_NUM] = [];
                        };

                        numberByNameArr[arr[i].USA_NUM].push({
                            name: arr[i].CHANNEL_NAME,
                            value: arr[i].VALUE
                        });
                    }

                    // 디바이스 목록 조회
                    return apiRequest(DEVICE_LIST_URL, {}, 'get').then(function (obj) {
                        const arr = obj.data;

                        for (let i = 0; i < arr.length; i++) {
                            const item = arr[i];
                            const device = new Device;

                            device.setValueFromDb(item);

                            deviceArr.push(device);
                        }
                    });
                }).catch(function (error) {
                    me.stopInterval();

                    console.error(error);
                    alert('processing error.');

                    return Promise.resolve();

                }).then(function () {
                    me.deviceArr = deviceArr;
                    me.numberByNameArr = numberByNameArr;
                });
            },
            onClickChannel(name, device) {
                const me = this;

                const channel = new Channel({
                    parent: device,
                    name: 'Other',
                    type: 'temp'
                });

                channel.sensor.name = name;

                me.stopInterval();

                me.$refs.sensorChartModal.show(channel);
            },
            onHiddenModal() {
                const me = this;

                me.startInterval();
            }
        }
    }
</script>

<style scoped>
    .chart-icon {
        width: 40px;
        height: 40px;
        background-image: url('./img/chart.svg');
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
    }

    @media (min-width: 992px) {
        .w-20 {
            flex: none;
            width: 20%;
        }
    }
</style>