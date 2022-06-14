<template>
    <fieldset>
        <legend class="w-auto h4 text-truncate">{{label}}</legend>

        <div class="row">
            <!-- channel 반복 -->
            <div v-for="(channel, i) in channels" :key="i" class="w-100 col-12 p-1">
                <fieldset class="col-lg-12 p-2 border">
                    <legend class="w-auto h6">{{ channel.name }}</legend>

                    <div v-if="channel.sensor" class="row">
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

                    <div v-if="channel.sensor" class="row">
                        <label class="h6 col-lg-6 col-form-label text-truncate">
                            <small>Sensor name</small>
                        </label>
                        <div class="col-lg-6">
                            <input v-model.trim="channel.sensor.name" :disabled="disabled" type="text" class="form-control form-control-sm">
                        </div>
                    </div>

                    <div class="row">
                        <label class="h6 col-12 col-form-label text-truncate">
                            <small>Complete Local Name</small>
                        </label>
                        <div class="col-12">
                            <textarea v-model.trim="channel.sensor.uuid" :disabled="disabled" class="text-uuid form-control form-control-sm"></textarea>
                        </div>
                    </div>

                    <!-- 설정파일 보기 -->
                    <div class="row mt-2 px-3">
                        <button
                            :disabled="disabled || !channel.sensor.configFileUrl"
                            @click="onClickConfigFile(channel.sensor.configFileUrl)"
                            class="col-12 btn btn-outline-primary text-truncate">

                            <span>Protocol file</span>
                        </button>
                    </div>
                    <!-- END-설정파일 보기 -->

                    <!-- 설정파일 보기 -->
                    <div class="row mt-2 px-3">
                        <!-- 프로토콜 모달 -->
                        <protocol-modal
                            :channel="channel"
                            :is-submodal="isSubmodal"
                            ref="protocolModal"
                            type="bluetooth">
                        </protocol-modal>
                        <!-- END-프로토콜 모달 -->

                        <button
                            :disabled="disabled || (channel.parent.id < 0)"
                            @click="onClickProtocolModal"
                            type="button"
                            class="col-12 btn btn-outline-primary text-truncate">

                            <span>Protocol config / debug</span>
                        </button>
                    </div>
                    <!-- END-설정파일 보기 -->
                </fieldset>
            </div>
            <!-- END-channel 반복 -->
        </div>
    </fieldset>
</template>

<script>
    import ProtocolModalVue from '../protocol/protocolModal.vue';

    export default {
        props: {
            label: {type: String, default: ''},
            channels: {type: Array, default: []},
            disabled: {type: Boolean, default: false},
            isSubmodal: {type: Boolean, default: false}
        },
        components: {
            'protocol-modal': ProtocolModalVue
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid
            };
        },
        methods: {
            onClickConfigFile: function (url) {
                window.open(url + '?t=' + Date.now());
            },
            onClickProtocolModal: function () {
                const me = this;

                me.$refs.protocolModal[0].show();
            }
        },
    }
</script>

<style scoped>
    @media (min-width: 992px) {
        .w-100 {
            flex: none;
            width: 100%;
        }
    }

    .text-uuid {
        height: 76px;
        resize: none;
    }
</style>