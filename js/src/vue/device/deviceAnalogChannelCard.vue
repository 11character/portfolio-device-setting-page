<template>
    <fieldset>
        <legend class="w-auto h4 text-truncate">{{label}}</legend>

        <div class="row">
            <!-- channel 반복 -->
            <div v-for="(channel, i) in channels" :key="i" class="w-50 col-12 p-1">
                <fieldset class="col-lg-12 p-2 border">
                    <legend class="w-auto h6">{{ channel.name }}</legend>

                    <div class="row">
                        <div class="col-12 pb-3">
                            <div class="custom-control custom-checkbox">
                                <input
                                    v-model="channel.sensor.isUse"
                                    :id="'check-use-sensor-' + channel.id"
                                    type="checkbox"
                                    class="custom-control-input">

                                <label :for="'check-use-sensor-' + channel.id" class="custom-control-label">Use</label>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <label class="h6 col-lg-6 col-form-label text-truncate">
                            <small>Sensor name</small>
                        </label>
                        <div class="col-lg-6">
                            <input v-model.trim="channel.sensor.name" :disabled="disabled" type="text" class="form-control form-control-sm">
                        </div>
                    </div>

                    <div class="row">
                        <label class="h6 col-lg-6 col-form-label text-truncate">
                            <small>Min Voltage(V)</small>
                        </label>
                        <div class="col-lg-6">
                            <input v-model.number="channel.sensor.minVoltage" :disabled="disabled" type="number" class="form-control form-control-sm">
                        </div>
                    </div>

                    <div class="row">
                        <label class="h6 col-lg-6 col-form-label text-truncate">
                            <small>Max Voltage(V)</small>
                        </label>
                        <div class="col-lg-6">
                            <input v-model.number="channel.sensor.maxVoltage" :disabled="disabled" type="number" class="form-control form-control-sm">
                        </div>
                    </div>

                    <div class="row">
                        <label class="h6 col-lg-6 col-form-label text-truncate">
                            <small>Min Value</small>
                        </label>
                        <div class="col-lg-6">
                            <input v-model.number="channel.sensor.minValue" :disabled="disabled" type="number" class="form-control form-control-sm">
                        </div>
                    </div>

                    <div class="row">
                        <label class="h6 col-lg-6 col-form-label text-truncate">
                            <small>Max Value</small>
                        </label>
                        <div class="col-lg-6">
                            <input v-model.number="channel.sensor.maxValue" :disabled="disabled" type="number" class="form-control form-control-sm">
                        </div>
                    </div>

                    <!-- 센서 목록 버튼 -->
                    <div class="row mt-3 px-3">
                        <sensor-list-modal
                            :is-submodal="isSubmodal"
                            @itemselect="onSelectSensor"
                            ref="sensorListModal">
                        </sensor-list-modal>

                        <button
                            :disabled="disabled"
                            @click="onClickSensorListModal(channel)"
                            type="button"
                            class="col-12 btn btn-outline-primary text-truncate">

                            <span>Sensor list</span>
                        </button>
                    </div>
                    <!-- END-센서 목록 버튼 작동여부 -->
                </fieldset>
            </div>
            <!-- END-channel 반복 -->
        </div>
    </fieldset>
</template>

<script>
    import Sensor from '../../device/sensor';

    import SensorListModalVue from './sensorListModal.vue';

    export default {
        props: {
            label: {type: String, default: ''},
            channels: {type: Array, default: []},
            disabled: {type: Boolean, default: false},
            isSubmodal: {type: Boolean, default: false}
        },
        components: {
            'sensor-list-modal': SensorListModalVue
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid
            };
        },
        methods: {
            onClickSensorListModal: function (channel) {
                const me = this;

                me.$refs.sensorListModal[0].show(channel);
            },
            onSelectSensor: function (sensor, channel) {
                if (channel) {
                    channel.sensor = new Sensor(sensor);
                }
            }
        }
    }
</script>

<style scoped>
    @media (min-width: 992px) {
        .w-50 {
            flex: none;
            width: 50%;
        }
    }
</style>