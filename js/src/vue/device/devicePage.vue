<template>
    <div class="row d-flex flex-lg-row-reverse">
        <div class="col-12">
            <div class="row px-1 px-lg-5">
                <div class="col-lg-2 mr-lg-3 px-0">
                    <button :disabled="disabled" @click="onClickRefresh" type="button" class="col-12 btn btn-outline-primary">Refresh</button>
                </div>

                <div class="col-lg-2 mr-lg-3 mt-2 mt-lg-0 px-0">
                    <button
                        :disabled="disabled"
                        @click="onClickAddDeviceModal"
                        type="button"
                        class="col-12 btn btn-outline-primary">
                            <span>Add device</span>
                        </button>
                </div>
            </div>
        </div>

        <div class="col-12 mt-3">
            <!-- 추가 모달 -->
            <add-device-modal
                :device-list="deviceList"
                @created="onCreated"
                ref="addDeviceModal">
            </add-device-modal>
            <!-- END-추가 모달 -->

            <!-- 제거 모달 -->
            <confirm-modal @confirm="onConfirmDelete" ref="deleteModal">
                <div slot="message" class="h4 my-5 text-center">
                    <span>Delete this item?</span>
                </div>
            </confirm-modal>
            <!-- END-제거 모달 -->

            <!-- device 반복 -->
            <div v-for="(device, i) in deviceList" :key="i" class="row mb-3 px-1 px-lg-5">
                <device-card :device="device" :disabled="disabled" class="col-12">
                    <!-- 버튼 -->
                    <div slot="button" class="h-100 d-lg-flex justify-content-lg-end align-items-lg-center">
                        <div v-if="device.typeCode != 0" class="col-12 col-lg-3 mt-2 mt-lg-0 ml-lg-3 px-0">
                            <button :disabled="disabled" @click="onClickDelete(device)" type="button" class="w-100 btn btn-outline-danger">Delete</button>
                        </div>

                        <div class="col-12 col-lg-3 mt-2 mt-lg-0 ml-lg-3 px-0">
                            <button :disabled="disabled" @click="onClickSave(device)" type="button" class="w-100 btn btn-primary">Save</button>
                        </div>
                    </div>
                    <!-- END-버튼 -->
                </device-card>
            </div>
            <!-- END-device 반복 -->
        </div>
    </div>
</template>

<script>
    import Device from '../../device/device';

    import DeviceCardVue from './deviceCard.vue';
    import AddDeviceModalVue from './addDeviceModal.vue';
    import ConfirmModalVue from '../confirmModal.vue';

    export default {
        components: {
            'device-card': DeviceCardVue,
            'add-device-modal': AddDeviceModalVue,
            'confirm-modal': ConfirmModalVue
        },
        data: function () {
            return {
                disabled: true,
                deviceList: []
            }
        },
        mounted: function() {
            const me = this;

            me.load().then(function () {
                me.disabled = false;
            });
        },
        methods: {
            load: function () {
                const me = this;

                me.deviceList = [];

                // 서버에 있는 시리얼 설정파일 목록을 가지고 온다.
                return apiRequest(PROTOCOL_CONFIG_FILES_URL, {}, 'get').then(function (obj) {
                    return Promise.resolve(obj.data);

                }).catch(function () {
                    return Promise.resolve({});

                }).then(function (serialConfigUrls) {
                    // 디바이스 정보를 가지고 온다.
                    return apiRequest(DEVICE_LIST_URL, {}, 'get').then(function (obj) {
                        const arr = obj.data;

                        for (let i = 0; i < arr.length; i++) {
                            const item = arr[i];
                            const device = new Device();

                            device.setValueFromDb(item);
                            
                            // 프로토콜 설정파일 경로를 저장한다.
                            device.bluetoothChannels[0].sensor.configFileUrl = serialConfigUrls['BLUETOOTH_' + device.number] || '';
                            device.serialChannels[0].sensor.configFileUrl = serialConfigUrls['SERIAL_' + device.number] || '';

                            me.deviceList.push(device);
                        }

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');

                        return Promise.resolve();
                    });
                });
            },
            onClickRefresh: function () {
                const me = this;

                me.disabled = true;

                me.load().then(function () {
                    me.disabled = false;
                });
            },
            onClickSave: function (device) {
                const me = this;

                let check = Device.validateDevice(device, me.deviceList);

                if (check.isOk) {
                    me.disabled = true;

                    apiRequest(DEVICE_SAVE_URL, device.getDataObject(), 'post').then(function () {
                        me.load().then(function () {
                            me.disabled = false;
                        });

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.disabled = false;
                    });

                } else {
                    alert(check.message);
                }
            },
            onClickDelete: function (device) {
                const me = this;

                me.$refs.deleteModal.show(device);
            },
            onConfirmDelete: function (bool, device) {
                const me = this;

                if (device && device.id > -1 && bool) {
                    me.disabled = true;

                    apiRequest(DEVICE_DELETE_URL, device.getDataObject(), 'post').then(function () {
                        me.load().then(function () {
                            me.disabled = false;
                        });

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.disabled = false;
                    });
                }
            },
            onClickAddDeviceModal: function () {
                const me = this;

                me.$refs.addDeviceModal.show();
            },
            onCreated: function () {
                const me = this;

                me.disabled = true;

                me.load().then(function () {
                    me.disabled = false;
                });
            }
        }
    }
</script>