<template>
    <div class="row px-1 px-lg-5">
        <div class="col-lg-2">
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-12">
                            <div class="custom-control custom-checkbox">
                                <input
                                    v-model="setupInfo.useBootingLog"
                                    :disabled="disabled"
                                    id="booting-check"
                                    type="checkbox"
                                    class="custom-control-input">

                                <label class="custom-control-label" for="booting-check">Booting</label>
                            </div>
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-12">
                            <div class="custom-control custom-checkbox">
                                <input
                                    v-model="setupInfo.useMessageLog"
                                    :disabled="disabled"
                                    id="message-check"
                                    type="checkbox"
                                    class="custom-control-input">

                                <label class="custom-control-label" for="message-check">Message</label>
                            </div>
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-12">
                            <div class="custom-control custom-checkbox">
                                <input
                                    v-model="setupInfo.useNetworkLog"
                                    :disabled="disabled"
                                    id="network-check"
                                    type="checkbox"
                                    class="custom-control-input">

                                <label class="custom-control-label" for="network-check">Network</label>
                            </div>
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-12">
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

        <div class="col-lg-10 mt-3 mt-lg-0">
            <div class="card">
                <div class="card-body p-0 pb-0">
                    <iframe class="log-iframe" src="./sample-page.php" frameborder="0"></iframe>
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
                disabled: false,
                setupInfo: new SetupInfo()
            }
        },
        mounted: function () {
            const me = this;

            me.disabled = true;

            apiRequest(SETUP_INPO_URL, {}, 'get').then(function (obj) {
                const data = obj.data;

                me.setupInfo = new SetupInfo(data);

                me.disabled = false;

            }).catch(function (error) {
                console.error(error);
                alert('processing error.');
                me.disabled = false;
            });
        },
        methods: {
            onClickSave: function () {
                const me = this;

                me.disabled = true;

                return apiRequest(SETUP_SAVE_URL, me.setupInfo.getDataObject(), 'post').then(function () {
                    me.setupInfo.apPassword = '';
                    me.disabled = false;

                }).catch(function (error) {
                    console.error(error);
                    alert('processing error.');
                    me.disabled = false;
                });
            }
        }
    }
</script>

<style scoped>
    .log-iframe {
        display: block;
        width: 100%;
        height: 800px;
    }
</style>