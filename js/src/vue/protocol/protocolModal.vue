<template>
    <div :id="'modal-' + uid" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-body">
                    <!-- 항목 추가 -->
                    <div class="row">
                        <div class="col-12">
                            <protocol-group-card :type="type" :disabled="disabled" ref="card"></protocol-group-card>
                        </div>
                    </div>
                    <!-- END-항목 추가 -->

                    <!-- 항목 추가 -->
                    <div class="row mt-3">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body">
                                    <iframe ref="debugIframe" class="debug-iframe" frameborder="0"></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- END-항목 추가 -->
                </div>

                <div class="modal-footer">
                    <div class="col-lg-3">
                        <div class="row">
                            <div class="col-6">
                                <button
                                    type="button"
                                    @click="onClickSave"
                                    :disabled="disabled"
                                    class="w-100 btn btn-primary">

                                    <span>Save</span>
                                </button>
                            </div>

                            <div class="col-6">
                                <button
                                    type="button"
                                    @click="onClickClose"
                                    class="w-100 btn btn-secondary">

                                    <span>Close</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Channel from '../../device/channel';

    import ProtocolGroupCardVue from './protocolGroupCard.vue';

    export default {
        props: {
            channel: {type: Channel, default: () => new Channel()},
            type: {type: String, default: ''},
            isSubmodal: {type: Boolean, default: false}
        },
        components: {
            'protocol-group-card': ProtocolGroupCardVue
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid,
                disabled: false
            };
        },
        mounted: function () {
            const me = this;

            $(me.$el).on('show.bs.modal', function (evt) {
                // 부모 모달의 이벤트로 전파되기 때문에 막아야 한다.
                evt.stopPropagation();

                const $this = $(this);

                me.load();

                let debugUrl = (me.type == 'serial') ? SERIAL_DEBUG_URL : BLUETOOTH_DEBUG_URL;
                debugUrl += '?number=' + me.channel.parent.number;

                $(me.$refs.debugIframe).attr('src', debugUrl);

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
            show: function () {
                const me = this;

                $(me.$el).modal('show');
            },
            hide: function () {
                const me = this;

                // 스크롤 초기화를 위해 내용을 비운다. (모달이 사라지기 전에 비워야 한다.)
                me.$refs.card.clear();
                
                // iframe 에서 호출된 페이지가 모달이 숨겨진 상태에서 계속 작업을 하기 때문에 빈 페이지로 초기화 시킨다.
                $(me.$refs.debugIframe).attr('src', 'about:blank');

                $(me.$el).modal('hide');
            },
            load: function () {
                const me = this;

                me.disabled = true;

                const param = {
                    id: me.channel.parent.id,
                    type: me.type
                };

                apiRequest(PROTOCOL_DATA_URL, param, 'get').then(function (obj) {
                    me.$refs.card.setData(obj.data);

                    me.disabled = false;

                }).catch(function (error) {
                    console.error(error);
                    alert('processing error.');
                    me.disabled = false;
                });
            },
            onClickSave: function () {
                const me = this;

                me.disabled = true;

                const json = me.$refs.card.getJson();

                const param = {
                    id: me.channel.parent.id,
                    type: me.type,
                    data: json
                };

                apiRequest(PROTOCOL_SAVE_URL, param, 'post').then(function () {
                    me.disabled = false;

                }).catch(function (error) {
                    console.error(error);
                    alert('processing error.');
                    me.disabled = false;
                });

                me.hide();
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
            max-width: 1440px;
        }
    }

    .debug-iframe {
        display: block;
        width: 100%;
        height: 100px;
    }
</style>