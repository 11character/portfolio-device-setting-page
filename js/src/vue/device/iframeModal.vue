<template>
    <div :id="'modal-' + uid" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl">
            <div class="modal-content shadow-lg">
                <div class="modal-body">
                    <iframe ref="debugIframe" class="debug-iframe" frameborder="0"></iframe>
                </div>

                <div class="modal-footer">
                    <button type="button" @click="onClickClose" class="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            url: {type: String, default: '/'},
            isSubmodal: {type: Boolean, default: false}
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid
            };
        },
        mounted: function () {
            const me = this;

            $(me.$el).on('show.bs.modal', function (evt) {
                // 부모 모달의 이벤트로 전파되기 때문에 막아야 한다.
                evt.stopPropagation();

                const $this = $(this);

                $(me.$refs.debugIframe).attr('src', url);

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
            show: function (url) {
                const me = this;

                me.url = url;

                $(me.$el).modal('show');
            },
            hide: function () {
                const me = this;

                // iframe 에서 호출된 페이지가 모달이 숨겨진 상태에서 계속 작업을 하기 때문에 빈 페이지로 초기화 시킨다.
                $(me.$refs.debugIframe).attr('src', 'about:blank');

                $(me.$el).modal('hide');
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
        height: 600px;
    }
</style>