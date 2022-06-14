<template>
    <div :id="'modal-' + uid" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <slot name="message"></slot>
                </div>

                <div class="modal-footer bg-warning">
                    <button @click="onClickOk" type="button" class="btn btn-primary">OK</button>
                    <button @click="onClickClose" type="button" class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * Template event : confirm
     */
    export default {
        props: {
            isSubmodal: {type: Boolean, default: false}
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid,
                passData: null
            };
        },
        mounted: function () {
            const me = this;

            $(me.$el).on('show.bs.modal', function (evt) {
                // 부모 모달의 이벤트로 전파되기 때문에 막아야 한다.
                evt.stopPropagation();

                const $this = $(this);

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
            show: function (data) {
                const me = this;

                me.passData = data;

                $(me.$el).modal('show');
            },
            hide: function () {
                const me = this;

                $(me.$el).modal('hide');
            },
            onClickOk: function() {
                const me = this;

                me.hide();

                me.$emit('confirm', true, me.passData);
            },
            onClickClose: function() {
                const me = this;

                me.hide();

                me.$emit('confirm', false, me.passData);
            }
        },
    }
</script>