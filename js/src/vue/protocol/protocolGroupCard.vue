<template>
    <div class="card">
        <!-- 제거 모달 -->
        <confirm-modal :is-submodal="true" @confirm="onConfirmDelete" ref="deleteModal">
            <div slot="message" class="h4 my-5 text-center">
                <span>Delete this item?</span>
            </div>
        </confirm-modal>
        <!-- END-제거 모달 -->

        <div class="card-body">
            <div class="row">
                <div class="col-lg-2 h4">Protocol</div>

                <div class="col-lg-5 mt-1 mt-lg-0">
                    <div v-if="type != 'bluetooth'" class="row">
                        <div class="col-12">
                            <div class="custom-control custom-checkbox">
                                <input v-model="protocolGroup.isOneWay" :disabled="disabled" :id="'check-one-way-protocol-' + uid" type="checkbox" class="custom-control-input">
                                <label :for="'check-one-way-protocol-' + uid" class="custom-control-label h5">One-way Protocol</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-5 mt-3 mt-lg-0">
                    <button
                        @click="onClickAdd"
                        :disabled="disabled"
                        type="button"
                        class="w-100 btn btn-primary">

                        <span>Add protocol</span>
                    </button>
                </div>
            </div>

            <!-- 프로토콜 목록 -->
            <div class="row mt-3">
                <div class="protocol-group-scroll-h col-12 px-1 border rounded overflow-auto">
                    <!-- 목록 아이템 -->
                    <div v-for="(protocol, i) in protocolGroup.array" :key="i" class="card my-1">
                        <div class="card-header">
                            <div class="row">
                                <div class="col-6 h4">
                                    <span># {{ i + 1 }}</span>
                                </div>

                                <div class="col-6 text-right">
                                    <button
                                        @click="onClickDelete(i)"
                                        :disabled="disabled"
                                        type="button"
                                        class="btn btn-outline-danger">

                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="card-body">
                            <protocol-card :type="type" :protocol="protocol" :disabled="disabled" ref="card"></protocol-card>
                        </div>
                    </div>
                    <!-- END-목록 아이템 -->
                </div>
            </div>
            <!-- END-프로토콜 목록 -->
        </div>
    </div>
</template>

<script>
    import ProtocolGroup from '../../protocol/protocolGroup';
    import Protocol from '../../protocol/protocol';

    import ProtocolCardVue from './protocolCard.vue';
    import ConfirmModalVue from '../confirmModal.vue';

    export default {
        props: {
            type: {type: String, default: ''},
            disabled: {type: Boolean, default: false}
        },
        components: {
            'protocol-card': ProtocolCardVue,
            'confirm-modal': ConfirmModalVue
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid,
                protocolGroup: new ProtocolGroup()
            };
        },
        methods: {
            clear: function () {
                const me = this;

                me.protocolGroup = new ProtocolGroup();
            },
            setData: function (obj) {
                const me = this;

                me.protocolGroup = new ProtocolGroup(obj);
            },
            getJson: function () {
                const me = this;

                return JSON.stringify(me.protocolGroup);
            },
            onClickAdd: function () {
                const me = this;

                me.protocolGroup.add(new Protocol());
            },
            onClickDelete: function (i) {
                const me = this;

                me.$refs.deleteModal.show(i);
            },
            onConfirmDelete: function (bool, i) {
                const me = this;

                if (bool) {
                    if (0 <= i && i < me.protocolGroup.array.length) {
                        me.protocolGroup.delete(i);
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .protocol-group-scroll-h {
        height: 50vh;
        background-color: #dee2e6;
    }
</style>