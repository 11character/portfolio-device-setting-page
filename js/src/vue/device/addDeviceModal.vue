<template>
    <div :id="'modal-' + uid" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-body">
                    <device-card :device="device" :disabled="disabled" :isSubmodal="true" class="col-12">
                        <!-- 버튼 -->
                        <div slot="button" class="h-100 d-lg-flex justify-content-lg-end align-items-lg-center">
                            <div class="col-lg-6 mt-lg-0">
                                <button :disabled="disabled" @click="onClickCreate" type="button" class="w-100 btn btn-primary">Create</button>
                            </div>

                            <div class="col-lg-6 mt-2 mt-lg-0 mt-lg-0">
                                <button @click="onClickClose" type="button" class="w-100 btn btn-secondary">Close</button>
                            </div>
                        </div>
                        <!-- END-버튼 -->
                    </device-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Device from '../../device/device';

    import DeviceCardVue from './deviceCard.vue';

    /**
     * Template event : created
     */
    export default {
        props: {
            deviceList: {type: Array, default: []}
        },
        components: {
            'device-card': DeviceCardVue
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid,
                disabled: false,
                device: new Device()
            }
        },
        methods: {
            show: function () {
                const me = this;

                $(me.$el).modal('show');
            },
            hide: function () {
                const me = this;

                $(me.$el).modal('hide');
            },
            onClickCreate: function () {
                const me = this;

                const device = me.device;
                const check = Device.validateDevice(device, me.deviceList);

                if (check.isOk) {
                    me.disabled = true;

                    apiRequest(DEVICE_CREATE_URL, me.device.getDataObject(), 'post').then(function () {
                        me.disabled = false;

                        me.$emit('created');
                        
                        me.hide();

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.disabled = false;
                    });

                } else {
                    alert(check.message);
                }
            },
            onClickClose: function () {
                const me = this;

                me.hide();
            }
        }
    }
</script>

<style scoped>
    @media (min-width: 1200px) {
        .modal-xl {
            max-width: 1540px;
        }
    }
</style>