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
            <!-- Send protocol -->
            <div v-if="type != 'bluetooth'" class="row">
                <div class="col-lg-2 h4">Send</div>

                <div class="col-lg-10">
                    <div class="row">
                        <div class="col-lg-2">
                            <select
                                v-model.trim="protocol.send.type"
                                :disabled="disabled"
                                type="text"
                                class="form-control form-control-sm">

                                <option value="ASCII">ASCII</option>
                                <option value="HEX">HEX</option>
                            </select>
                        </div>

                        <div class="col-lg-10 mt-1 mt-lg-0">
                            <input
                                v-model.trim="protocol.send.value"
                                :disabled="disabled"
                                type="text"
                                class="form-control form-control-sm">
                        </div>
                    </div>
                </div>
            </div>
            <!-- END-Send protocol -->

            <!-- Bluetooth protocol name -->
            <div v-if="type == 'bluetooth'" class="row">
                <div class="col-lg-3 h4">Bluetooth Name</div>

                <div class="col-lg-9">
                    <div class="row">
                        <div class="col-lg-12 mt-1 mt-lg-0">
                            <input
                                v-model="protocol.recevieName"
                                :disabled="disabled"
                                type="text"
                                class="form-control form-control-sm">
                        </div>
                    </div>
                </div>
            </div>
            <!-- END-Send protocol -->

            <div class="row my-3 border-top"></div>

            <!-- Recevie protocol -->
            <div class="row mt-3">
                <!-- 항목 추가 -->
                <div class="col-lg-4">
                    <div class="row">
                        <div class="col-12 h4">Recevie</div>
                    </div>

                    <div class="row">
                        <div class="col-lg-4">
                            <label class="col-form-label">
                                <span>Name</span>
                            </label>
                        </div>

                        <div class="col-lg-8">
                            <input
                                v-model.trim="newRecevieRow.name"
                                :disabled="disabled"
                                type="text"
                                class="form-control form-control-sm">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-4">
                            <label class="col-form-label">
                                <span>Type</span>
                            </label>
                        </div>

                        <div class="col-lg-8">
                            <select
                                v-model.trim="newRecevieRow.type"
                                :disabled="disabled"
                                type="text"
                                class="form-control form-control-sm">

                                <option value="ASCII">ASCII</option>
                                <option value="HEX">HEX</option>
                                <option value="DEC">DEC</option>
                                <option value="IEEE754">IEEE754</option>
                            </select>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-4">
                            <label class="col-form-label">
                                <span>Start</span>
                            </label>
                        </div>

                        <div class="col-lg-8">
                            <input
                                v-model.number="newRecevieRow.start"
                                :disabled="disabled"
                                type="number"
                                class="form-control form-control-sm">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-4">
                            <label class="col-form-label">
                                <span>Length</span>
                            </label>
                        </div>

                        <div class="col-lg-8">
                            <input
                                v-model.number="newRecevieRow.length"
                                :disabled="disabled"
                                type="number"
                                class="form-control form-control-sm">
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-12">
                            <button
                                @click="onClickAdd"
                                :disabled="disabled"
                                type="button"
                                class="w-100 btn btn-primary">

                                <span>Add</span>
                            </button>
                        </div>
                    </div>
                </div>
                <!-- END-항목 추가 -->

                <!-- 컬럼 목록 -->
                <div class="col-lg-8 mt-3 mt-lg-0">
                    <div class="row pl-lg-3">
                        <div class="protocol-scroll-h col-12 card overflow-auto">
                            <div class="card-body px-0 py-1">
                                <table class="table table-sm text-center">
                                    <thead>
                                        <tr>
                                            <th class="col-3"></th>
                                            <th class="col-2">Name</th>
                                            <th class="col-2">Type</th>
                                            <th class="col-2">Start</th>
                                            <th class="col-2">Length</th>
                                            <th class="col-1"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="(row, i) in rowArr" :key="i">
                                            <td class="px-1 py-0 align-middle">
                                                <button
                                                    @click="onClickUp(i)"
                                                    :disabled="disabled"
                                                    type="button"
                                                    class="my-1 btn btn-primary">

                                                    <span>&#8593;</span>
                                                </button>

                                                <button
                                                    @click="onClickDown(i)"
                                                    :disabled="disabled"
                                                    type="button"
                                                    class="my-1 btn btn-primary">
                                                
                                                    <span>&#8595;</span>
                                                </button>
                                            </td>

                                            <td class="px-1 py-0 align-middle">
                                                <input
                                                    v-model.trim="row.name"
                                                    :disabled="disabled"
                                                    type="text"
                                                    class="w-100 form-control form-control-sm">
                                            </td>

                                            <td class="px-1 py-0 align-middle">
                                                <select
                                                    v-model.trim="row.type"
                                                    :disabled="disabled"
                                                    type="text"
                                                    class="w-100 form-control form-control-sm">

                                                    <option value="ASCII">ASCII</option>
                                                    <option value="HEX">HEX</option>
                                                    <option value="DEC">DEC</option>
                                                    <option value="IEEE754">IEEE754</option>
                                                </select>
                                            </td>

                                            <td class="px-1 py-0 align-middle">
                                                <input
                                                    v-model.number="row.start"
                                                    :disabled="disabled"
                                                    type="number"
                                                    class="w-100 form-control form-control-sm">
                                            </td>

                                            <td class="px-1 py-0 align-middle">
                                                <input
                                                    v-model.number="row.length"
                                                    :disabled="disabled"
                                                    type="number"
                                                    class="w-100 form-control form-control-sm">
                                            </td>

                                            <td class="px-1 py-0 align-middle">
                                                <button
                                                    @click="onClickDelete(i)"
                                                    :disabled="disabled"
                                                    type="button"
                                                    class="btn btn-danger">
                                                    
                                                    <span>&#8722;</span>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- END-컬럼 목록 -->
            </div>
            <!-- END-Recevie protocol -->
        </div>
    </div>
</template>

<script>
    import Protocol from '../../protocol/protocol';
    import RecevieRow from '../../protocol/recevieRow';

    import ConfirmModalVue from '../confirmModal.vue';

    export default {
        props: {
            protocol: {type: Protocol, default: () => new Protocol()},
            type: {type: String, default: ''},
            disabled: {type: Boolean, default: false}
        },
        components: {
            'confirm-modal': ConfirmModalVue
        },
        data: function () {
            return {
                newRecevieRow: new RecevieRow(),
                rowArr: []
            };
        },
        watch: {
            protocol: function (protocol) {
                const me = this;

                me.rowArr = protocol.recevieArray;
            }
        },
        mounted() {
            const me = this;

            me.rowArr = me.protocol.recevieArray;
        },
        methods: {
            onClickAdd: function () {
                const me = this;

                me.protocol.add(me.newRecevieRow);

                me.newRecevieRow = new RecevieRow();
            },
            onClickUp: function (i) {
                const me = this;

                if (0 <= i - 1) {
                    me.protocol.swapPosition(i, i - 1);
                }
            },
            onClickDown: function (i) {
                const me = this;

                if (i + 1 < me.protocol.recevieArray.length) {
                    me.protocol.swapPosition(i, i + 1);
                }
            },
            onClickDelete: function (i) {
                const me = this;

                me.$refs.deleteModal.show(i);
            },
            onConfirmDelete: function (bool, i) {
                const me = this;

                if (bool) {
                    if (0 <= i && i < me.protocol.recevieArray.length) {
                        me.protocol.delete(i);
                    }
                }
            }
        },
    }
</script>

<style scoped>
    .protocol-scroll-h {
        height: 250px;
        background-color: #dee2e6;
    }

    .protocol-scroll-h table {
        min-width: 500px;
    }
</style>