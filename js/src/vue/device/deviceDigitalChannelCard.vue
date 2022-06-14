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

                    <!-- 공백 -->
                    <div class="row d-none d-md-block">
                        <div class="col-12">
                            <label class="h6 col-form-label">&nbsp;</label>
                        </div>
                    </div>

                    <div class="row d-none d-md-block">
                        <div class="col-12">
                            <label class="h6 col-form-label">&nbsp;</label>
                        </div>
                    </div>
                    <!-- END-공백 -->

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

                    <div class="row mt-3 px-3">
                        <button type="button" class="col-12 btn btn-light border-white bg-white" disabled>-</button>
                    </div>
                </fieldset>
            </div>
            <!-- END-channel 반복 -->
        </div>
    </fieldset>
</template>

<script>
    export default {
        props: {
            label: {type: String, default: ''},
            channels: {type: Array, default: []},
            disabled: {type: Boolean, default: false},
            isSubmodal: {type: Boolean, default: false}
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