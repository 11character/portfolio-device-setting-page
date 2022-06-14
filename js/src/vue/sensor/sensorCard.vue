<template>
    <div class="card">
        <div class="card-body d-flex flex-wrap">
            <div class="col-lg-9">
                <div class="row">
                    <label class="h6 col-lg-4 col-form-label">
                        <span>Sensor name</span>
                    </label>
                    <div class="col-lg-8">
                        <input v-model.trim="sensor.name" :disabled="disabled" type="text" class="form-control form-control-sm">
                    </div>
                </div>

                <div class="row">
                    <label class="h6 col-lg-4 col-form-label">
                        <span>Min Voltage(V)</span>
                    </label>
                    <div class="col-lg-8">
                        <input v-model.number="sensor.minVoltage" :disabled="disabled" type="number" class="form-control form-control-sm">
                    </div>
                </div>

                <div class="row">
                    <label class="h6 col-lg-4 col-form-label">
                        <span>Max Voltage(V)</span>
                    </label>
                    <div class="col-lg-8">
                        <input v-model.number="sensor.maxVoltage" :disabled="disabled" type="number" class="form-control form-control-sm">
                    </div>
                </div>

                <div class="row">
                    <label class="h6 col-lg-4 col-form-label">
                        <span>Min Value</span>
                    </label>
                    <div class="col-lg-8">
                        <input v-model.number="sensor.minValue" :disabled="disabled" type="number" class="form-control form-control-sm">
                    </div>
                </div>

                <div class="row">
                    <label class="h6 col-lg-4 col-form-label">
                        <span>Max Value</span>
                    </label>
                    <div class="col-lg-8">
                        <input v-model.number="sensor.maxValue" :disabled="disabled" type="number" class="form-control form-control-sm">
                    </div>
                </div>

                <div class="row">
                    <div class="col-12 pt-3">
                        <div class="custom-control custom-checkbox">
                            <input
                                v-model="sensor.isUse"
                                :id="'check-use-sensor-' + uid"
                                :disabled="disabled"
                                type="checkbox"
                                class="custom-control-input">

                            <label :for="'check-use-sensor-' + uid" class="custom-control-label h6">Use</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-3">
                <!-- 버튼 -->
                <slot name="button"></slot>
                <!-- END 버튼 -->
            </div>
        </div>
    </div>
</template>

<script>
    import Sensor from '../../device/sensor';

    export default {
        props: {
            sensor: {type: Sensor, default: () => new Sensor()},
            disabled: {type: Boolean, default: false}
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid
            };
        }
    }
</script>