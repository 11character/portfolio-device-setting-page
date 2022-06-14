<template>
    <div :id="'modal-' + uid" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content shadow-lg">
                <div class="modal-body">
                    <sensor-list ref="list" :disabled="disabled" @itemselect="onSelectSensor" @load="onLoadSensorList"></sensor-list>
                </div>

                <div class="modal-footer">
                    <button :disabled="disabled" @click="onClickOk" type="button" class="btn btn-primary">OK</button>
                    <button type="button" @click="onClickClose" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Sensor from '../../device/sensor';

    import SensorListVue from '../sensor/sensorList.vue';

    /**
     * Template event : itemselect
     */
    export default {
        props: {
            isSubmodal: {type: Boolean, default: false}
        },
        components: {
            'sensor-list': SensorListVue
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid,
                disabled: true,
                channel: null,
                selectedSensor: null
            };
        },
        mounted: function () {
            const me = this;

            $(me.$el).on('show.bs.modal', function (evt) {
                // 부모 모달의 이벤트로 전파되기 때문에 막아야 한다.
                evt.stopPropagation();

                const $this = $(this);

                me.selectedSensor = null;
                me.disabled = true;
                me.$refs.list.load();

                // 다른 모달창의 자식으로 표시 되었을 때 Y스크롤 밀림 처리를 직접 설정.
                if (me.isSubmodal) {
                    if ($('body').height() > $(window).height()) {
                        $this.css('paddingRight', '17px');
                    }
                }

            }).on('hidden.bs.modal', function (evt) {
                // 부모 모달의 이벤트로 전파되기 때문에 막아야 한다.
                evt.stopPropagation();

                // 다른 모달창의 자식으로 표시 되었을 때 닫힘에 의하여 스타일이 변경되는 것을 막음.
                if (me.isSubmodal) {
                    const $body = $('body');

                    $body.addClass('modal-open');

                    if ($body.height() > $(window).height()) {
                        $body.css('paddingRight', '17px');
                    }
                }
            });
        },
        methods: {
            show: function (channel) {
                const me = this;

                me.channel = channel;

                $(me.$el).modal('show');
            },
            hide: function () {
                const me = this;

                $(me.$el).modal('hide');
            },
            onLoadSensorList: function () {
                const me = this;

                me.disabled = false;
            },
            onSelectSensor: function (sensor) {
                const me = this;

                // 목록에 있는 값을 변경하지 않기 위해 객체를 복사하여 사용한다.
                me.selectedSensor = new Sensor(sensor);
            },
            onClickOk: function () {
                const me = this;

                if (me.selectedSensor) {
                    me.$emit('itemselect', me.selectedSensor, me.channel);
                }

                me.hide();
            },
            onClickClose: function () {
                const me = this;

                me.hide();
            }
        }
    }
</script>