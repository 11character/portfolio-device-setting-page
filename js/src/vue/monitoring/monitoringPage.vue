<template>
    <div class="row px-1 px-lg-5">
        <!-- 차트 모달 -->
        <sensor-chart-modal
            :api="api"
            ref="sensorChartModal">
        </sensor-chart-modal>
        <!-- END-차트 모달 -->

        <!-- 디바이스 라인 -->
        <div v-for="(device, number) in devices" :key="number" class="card w-100 mb-3">
            <div v-if="device.isUse" class="card-body">
                <div class="w-100 d-flex flex-wrap justify-content-between">
                    <!-- 해당 디바이스의 채널 카드 -->
                    <template v-for="(channel, i) in channelArrays[number]">
                        <div
                            v-if="device.typeCode == 0 || channel.type != 'bluetooth'"
                            :key="i"
                            class="w-14 col-12 p-1">

                            <div
                                @click="onClickChannel(channel)"
                                class="card btn btn-light p-0">

                                <div class="card-header d-flex justify-content-between">
                                    <span class="text-truncate">Device : {{ number }}</span>
                                    <span class="text-truncate">Channel : {{ channel.number }}</span>
                                </div>

                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-3 pr-0 d-flex justify-content-center align-items-center">
                                            <div class="chart-icon">
                                            </div>
                                        </div>

                                        <div class="col-9">
                                            <div class="col-12 p-0 text-center text-truncate">
                                                Name
                                            </div>
                                            <div class="col-12 m-0 p-0 pb-2 h4 text-center text-truncate">
                                                {{ channel.sensor.name }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 빈 공간 -->
                        <div
                            v-if="(i + 1) == channelArrays[number].length && device.typeCode != 0"
                            :key="'empty-' + i"
                            class="w-14">
                        </div>
                        <!-- END-빈 공간 -->

                        <!-- 등록되지 않은 채널목록 -->
                        <div v-if="(i + 1) == channelArrays[number].length" :key="'list-' + i" class="w-16 col-12 p-1">
                            <other-sensor-name-list
                                :device="devices[number]"
                                :dataNameArray="dataNameArrays[number]"
                                @itemclick="onClickOtherName">
                            </other-sensor-name-list>
                        </div>
                        <!-- END-등록되지 않은 채널목록 -->
                    </template>
                    <!-- END-해당 디바이스의 채널 카드 -->
                </div>
            </div>

            <div v-else class="card-body">
                <div class="text-center">
                    <span>- Device : {{ number }} -</span>
                </div>
            </div>
        </div>
        <!-- END-디바이스 라인 -->
    </div>
</template>

<script>
    import Device from '../../device/device';
    import Channel from '../../device/channel';

    import SensorChartModalVue from './sensorChartModal.vue';
    import OtherSensorNameListVue from './otherSensorNameList.vue';

    export default {
        components: {
            'sensor-chart-modal': SensorChartModalVue,
            'other-sensor-name-list': OtherSensorNameListVue
        },
        data: function () {
            return {
                api: SENSOR_DATA_LIST_URL,
                devices: {},
                channelArrays: {},
                dataNameArrays: {}
            }
        },
        mounted: function () {
            const me = this;

            me.load();
        },
        methods: {
            load: function () {
                const me = this;

                me.devices = {};
                me.channelArrays = {};
                me.dataNameArrays = {};

                // 디바이스 번호와 관련있는 이름의 목록을 가지고 온다.
                // 디바이스 정보에 없는 이름을 가진 데이터가 있을 수 있다.
                return apiRequest(SENSOR_DATA_NAME_LIST_URL, {}, 'get').then(function (obj) {
                    const arr = obj.data;
                    const nameArrays = {};

                    for (let i = 0; i < arr.length; i++) {
                        if (!nameArrays[arr[i].USA_NUM]) {
                            nameArrays[arr[i].USA_NUM] = [];
                        };

                        nameArrays[arr[i].USA_NUM].push(arr[i].CHANNEL_NAME);
                    }

                    me.dataNameArrays = nameArrays;

                    // 디바이스 목록 조회
                    apiRequest(DEVICE_LIST_URL, {}, 'get').then(function (obj) {
                        const arr = obj.data;
                        const devices = {};
                        const channelArrays = {};

                        for (let i = 0; i < arr.length; i++) {
                            const item = arr[i];
                            const device = new Device();

                            device.setValueFromDb(item);

                            // 채널 객체 단일 배열에 저장
                            if (!channelArrays[device.number]) {
                                channelArrays[device.number] = [];
                            }

                            // 디바이스에 속한 채널 순서대로 단일 배열에 저장.
                            channelArrays[device.number] = channelArrays[device.number].concat(device.analogChannels);
                            channelArrays[device.number] = channelArrays[device.number].concat(device.digitalChannels);
                            channelArrays[device.number] = channelArrays[device.number].concat(device.serialChannels);
                            channelArrays[device.number] = channelArrays[device.number].concat(device.bluetoothChannels);

                            devices[device.number] = device;
                        }

                        me.channelArrays = channelArrays;
                        me.devices = devices;
                    });
                }).catch(function (error) {
                    console.error(error);
                    alert('processing error.');

                    return Promise.resolve();
                });
            },
            onClickChannel(channel) {
                const me = this;

                me.$refs.sensorChartModal.show(channel);
            },
            onClickOtherName(name, device) {
                const me = this;

                const channel = new Channel({
                    parent: device,
                    name: 'Other',
                    type: 'temp'
                });

                channel.sensor.name = name;

                me.$refs.sensorChartModal.show(channel);
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
        .w-14 {
            flex: none;
            width: 14%;
        }

        .w-16 {
            flex: none;
            width: 16%;
        }
    }
</style>