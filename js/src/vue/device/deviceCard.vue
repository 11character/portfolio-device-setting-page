<template>
    <div class="card">
        <div class="card-body">
            <div class="row pl-lg-0 py-2">
                <div class="col-lg-2 d-flex justify-content-center">
                    <img :src="device.imageUrl" height="100" alt="device">
                </div>

                <div class="col-lg-10">
                    <div v-if="device.typeCode == 0" class="row">
                        <div class="col-lg-3 mt-3 mt-lg-0">
                            <div class="h3 text-center text-lg-left text-success">
                                Inner device
                            </div>
                        </div>

                        <div class="col-lg-3 d-flex align-items-center mt-3 mt-lg-0">
                            <div class="custom-control custom-checkbox">
                                <input v-model="device.isUse" :disabled="disabled" :id="'check-use-device-' + device.id" type="checkbox" class="custom-control-input">
                                <label :for="'check-use-device-' + device.id" class="custom-control-label h5">Use device</label>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="offset-lg-3 col-lg-3 d-flex align-items-center mt-3 mt-lg-0">
                            <div class="custom-control custom-checkbox">
                                <input v-model="device.isOneWay" :disabled="disabled" :id="'check-one-way-device-' + device.id" type="checkbox" class="custom-control-input">
                                <label :for="'check-one-way-device-' + device.id" class="custom-control-label h5">One-way Protocol</label>
                            </div>
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-lg-2 d-flex flex-column justify-content-center">
                            <label :for="'device-number-' + device.id" class="h6">Device Number</label>
                            <input v-model.number="device.number" :readonly="device.typeCode == 0" :id="'device-number-' + device.id" :disabled="disabled" type="number" class="form-control form-control-sm">
                        </div>

                        <div class="col-lg-10 mt-3 mt-lg-0">
                            <!-- 버튼 -->
                            <slot name="button"></slot>
                            <!-- END-버튼 -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 py-2">
                <div class="row mt-3">
                    <device-analog-channel-card :label="'Analog'" :channels="device.analogChannels" :disabled="disabled" :is-submodal="isSubmodal" class="col-lg-4 mt-3 mt-lg-0"></device-analog-channel-card>

                    <device-digital-channel-card :label="'Digital'" :channels="device.digitalChannels" :disabled="disabled" :is-submodal="isSubmodal" class="col-lg-4 mt-3 mt-lg-0"></device-digital-channel-card>

                    <device-serial-channel-card :label="'Serial'" :channels="device.serialChannels" :disabled="disabled" :is-submodal="isSubmodal" class="col-lg-2 mt-3 mt-lg-0"></device-serial-channel-card>

                    <template v-if="device.typeCode == 0">
                        <device-bluetooth-channel-card :label="'Bluetooth'" :channels="device.bluetoothChannels" :disabled="disabled" :is-submodal="isSubmodal" class="col-lg-2 mt-3 mt-lg-0"></device-bluetooth-channel-card>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Device from '../../device/device';

    import DeviceAnalogChannelCardVue from './deviceAnalogChannelCard.vue';
    import DeviceDigitalChannelCardVue from './deviceDigitalChannelCard.vue';
    import DeviceBluetoothChannelCardVue from './deviceBluetoothChannelCard.vue';
    import DeviceSerialChannelCardVue from './deviceSerialChannelCard.vue';

    export default {
        props: {
            device: {type: Device, default: () => new Device()},
            disabled: {type: Boolean, default: false},
            isSubmodal: {type: Boolean, default: false}
        },
        components: {
            'device-analog-channel-card': DeviceAnalogChannelCardVue,
            'device-digital-channel-card': DeviceDigitalChannelCardVue,
            'device-bluetooth-channel-card': DeviceBluetoothChannelCardVue,
            'device-serial-channel-card': DeviceSerialChannelCardVue
        }
    }
</script>