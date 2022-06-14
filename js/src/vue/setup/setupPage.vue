<template>
    <div class="row px-1 px-lg-5">
        <div class="card col-12">
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="row">
                            <div class="col-12 pb-3">
                                <span class="h4">SDR (SERIAL)</span>
                            </div>
                        </div>

                        <div class="row">
                            <label class="h6 col-lg-4 col-form-label">
                                <span>SERIAL DEVICE</span>
                            </label>
                            <div class="col-lg-8">
                                <input v-model.trim="setupInfo.serialDevice" :disabled="disabled" type="text" class="form-control form-control-sm">
                            </div>
                        </div>

                        <div class="row">
                            <label class="h6 col-lg-4 col-form-label">
                                <span>BAUD RATE</span>
                            </label>

                            <div class="col-lg-8">
                                <select v-model="setupInfo.baudRate" :disabled="disabled" class="form-control form-control-sm">
                                    <option v-for="(rate, i) in rateArr" :key="i" :value="rate">{{ rate }}</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-12 text-right">
                                <div class="custom-control custom-checkbox custom-control-inline">
                                    <input
                                        v-model="showMcu"
                                        :disabled="disabled"
                                        id="check-show-mcu"
                                        type="checkbox"
                                        class="custom-control-input">

                                    <label for="check-show-mcu" class="custom-control-label h6">Show MCU</label>
                                </div>
                            </div>
                        </div>

                        <div v-if="showMcu" class="row mt-1">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="row">
                                            <label class="h6 col-lg-4 col-form-label">
                                                <span>SERIAL DEVICE MCU</span>
                                            </label>
                                            <div class="col-lg-8">
                                                <input v-model.trim="setupInfo.serialDeviceMcu" :disabled="disabled" type="text" class="form-control form-control-sm">
                                            </div>
                                        </div>

                                        <div class="row">
                                            <label class="h6 col-lg-4 col-form-label">
                                                <span>BAUD RATE MCU</span>
                                            </label>

                                            <div class="col-lg-8">
                                                <select v-model="setupInfo.baudRateMcu" :disabled="disabled" class="form-control form-control-sm">
                                                    <option v-for="(rate, i) in rateArr" :key="i" :value="rate">{{ rate }}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-4">
                            <label class="h6 col-lg-4 col-form-label">
                                <span>REQUEST INTERVAL(ms)</span>
                            </label>
                            <div class="col-lg-8">
                                <input v-model.number="setupInfo.requestInterval" :disabled="disabled" type="number" class="form-control form-control-sm">
                            </div>
                        </div>

                        <div class="row">
                            <label class="h6 col-lg-4 col-form-label">
                                <span>CHANNEL</span>
                            </label>
                            <div class="col-lg-8">
                                <input v-model.number="setupInfo.sdrChannel" :disabled="disabled" type="number" class="form-control form-control-sm">
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 pt-5 pt-lg-0">
                        <div class="row">
                            <div class="col-12 pb-3">
                                <span class="h4 mr-3">SERVER</span>

                                <div class="custom-control custom-radio custom-control-inline">
                                    <input
                                        v-model="setupInfo.serverType"
                                        :disabled="disabled"
                                        type="radio"
                                        id="server-type-tcpip"
                                        name="serverType"
                                        class="custom-control-input"
                                        value="tcpip">

                                    <label
                                        for="server-type-tcpip"
                                        class="custom-control-label">

                                        <span>TCP/IP</span>
                                    </label>
                                </div>

                                <div class="custom-control custom-radio custom-control-inline">
                                    <input
                                        v-model="setupInfo.serverType"
                                        :disabled="disabled"
                                        type="radio"
                                        id="server-type-restfulapi"
                                        name="serverType"
                                        class="custom-control-input"
                                        value="restfulapi">

                                    <label
                                        for="server-type-restfulapi"
                                        class="custom-control-label">

                                        <span>Restful API</span>
                                    </label>
                                </div>

                                <div class="custom-control custom-radio custom-control-inline">
                                    <input
                                        v-model="setupInfo.serverType"
                                        :disabled="disabled"
                                        type="radio"
                                        id="server-type-mqtt"
                                        name="serverType"
                                        class="custom-control-input"
                                        value="mqtt">

                                    <label
                                        for="server-type-mqtt"
                                        class="custom-control-label">

                                        <span>MQTT</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <label class="h6 col-lg-4 col-form-label">
                                <span>IP</span>
                            </label>
                            <div class="col-lg-8">
                                <input v-model.trim="setupInfo.serverIp" :disabled="disabled" type="text" class="form-control form-control-sm">
                            </div>
                        </div>

                        <div class="row">
                            <label class="h6 col-lg-4 col-form-label">
                                <span>PORT</span>
                            </label>
                            <div class="col-lg-8">
                                <input v-model.trim="setupInfo.serverPort" :disabled="disabled" type="text" class="form-control form-control-sm">
                            </div>
                        </div>

                        <div v-if="setupInfo.serverType == 'mqtt'" class="row">
                            <label class="h6 col-lg-4 col-form-label">
                                <span>TOPIC</span>
                            </label>
                            <div class="col-lg-8">
                                <input v-model.trim="setupInfo.serverTopic" :disabled="disabled" type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6 pt-5">
                        <div class="row">
                            <div class="col-12 pb-3">
                                <span class="h4 mr-3">AP (Wi-Fi)</span>

                                <div class="custom-control custom-checkbox custom-control-inline">
                                    <input
                                        v-model="setupInfo.apUse"
                                        :disabled="disabled"
                                        id="check-use-wifi"
                                        type="checkbox"
                                        class="custom-control-input">

                                    <label for="check-use-wifi" class="custom-control-label h6">Use</label>
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <label class="h6 col-lg-4 col-form-label">
                                <span>SSID</span>
                            </label>
                            <div class="col-lg-8">
                                <input v-model.trim="setupInfo.apSsid" :disabled="disabled" type="text" class="form-control form-control-sm">
                            </div>
                        </div>

                        <div class="row">
                            <label class="h6 col-lg-4 col-form-label">
                                <span>PASSWORD</span>
                            </label>
                            <div class="col-lg-8">
                                <input v-model.trim="setupInfo.apPassword" :disabled="disabled" type="text" class="form-control form-control-sm">
                            </div>
                        </div>

                        <div class="row">
                            <label class="h6 col-lg-4 col-form-label">
                                <span>CHANNEL</span>
                            </label>
                            <div class="col-lg-8">
                                <input v-model.number="setupInfo.apChannel" :disabled="disabled" type="number" class="form-control form-control-sm">
                            </div>
                        </div>
                    </div>

                    <div class="col-12 pt-5 pt-lg-0">
                        <div class="row">
                            <div class="offset-lg-10 col-12 col-lg-2">
                                <button
                                    :disabled="disabled"
                                    @click="onClickSave"
                                    type="button"
                                    class="w-100 btn btn-primary">

                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card col-12 mt-5">
            <div class="card-body">
                <div class="row">
                    <div class="col-12 col-lg-2">
                        <button
                            :disabled="disabled"
                            @click="onClickReboot"
                            type="button"
                            class="w-100 btn btn-outline-primary">

                            <span>Reboot</span>
                        </button>
                    </div>

                    <div class="col-12 col-lg-2 mt-3 mt-lg-0">
                        <button
                            :disabled="disabled"
                            @click="onClickRestart"
                            type="button"
                            class="w-100 btn btn-outline-primary">

                            <span>Restart</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import SetupInfo from '../../device/setupInfo';

    export default {
        data: function () {
            return {
                setupInfo: new SetupInfo(),
                disabled: true,
                rateArr: RATE_ARR,
                isSdrChannelChange: false,
                showMcu: false,
            };
        },
        mounted: function () {
            const me = this;

            me.disabled = true;

            apiRequest(SETUP_INPO_URL, {}, 'get').then(function (obj) {
                const data = obj.data;

                me.setupInfo = new SetupInfo(data);

                me.disabled = false;

                // SDR channel 변경 감지.
                me.$watch(function () {
                    return me.setupInfo.sdrChannel;

                }, function () {
                    me.isSdrChannelChange = true;
                });

            }).catch(function (error) {
                console.error(error);
                alert('processing error.');
                me.disabled = false;
            });
        },
        methods: {
            save: function () {
                const me = this;

                const check = me.setupInfo.validate();

                if (check.isOk) {
                    const dataObj = me.setupInfo.getDataObject();

                    return apiRequest(SETUP_SAVE_URL, dataObj, 'post').then(function () {
                        // SDR channel 변경시 필요한 작업.
                        if (me.isSdrChannelChange) {
                            $.ajax({method: 'get', url: SDR_CHANNEL_CHANGE_URL, data: {channel_num: dataObj.sdrChannel}});
                        }

                        me.disabled = false;

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.disabled = false;
                    });

                } else {
                    alert(check.message);

                    me.disabled = false;
                    me.showMcu = true;
                }
            },
            onClickSave: function () {
                const me = this;

                me.disabled = true;

                me.save();
            },
            onClickReboot: function () {
                const me = this;

                me.disabled = true;

                me.save().then(function () {
                    $.ajax({method: 'get', url: SERVER_REBOOT_URL});
                });
            },
            onClickRestart: function () {
                const me = this;

                me.disabled = true;

                me.save().then(function () {
                    $.ajax({method: 'get', url: SERVER_RESTART_URL});
                });
            },
        }
    }
</script>
