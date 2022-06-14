<template>
    <div class="card btn btn-light p-0">
        <div class="card-body p-0 h-100">
            <ul class="list-group">
                <li v-for="(name, i) in otherNameArr" :key="i" @click="onClick(name, device)" class="list-group-item list-group-item-action py-2">
                    <div class="row">
                        <div class="col-3">
                            <div class="chart-icon mx-auto"></div>
                        </div>

                        <div class="col-9 text-left text-truncate">
                            {{name ? name : '&nbsp;'}}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import Device from '../../device/device';

    /**
     * Template event : itemclick
     */
    export default {
        props: {
            device: {type: Device, default: null},
            dataNameArray: {type: Array, default: null}
        },
        data: function () {
            return {
                otherNameArr: []
            };
        },
        mounted: function () {
            const me = this;

            me.draw();
        },
        methods: {
            draw: function () {
                const me = this;

                if (me.device && me.dataNameArray) {
                    me.otherNameArr = [];

                    for (let i = 0; i < me.dataNameArray.length; i++) {
                        const name = me.dataNameArray[i];

                        // 디바이스 번호와 연관된 이름들 중에서 지금 정보에 없는 이름만 골라낸다.
                        if (!me.device.getSensorByName(name)) {
                            me.otherNameArr.push(name);
                        }
                    }
                }
            },
            onClick: function (name, device) {
                const me = this;

                me.$emit('itemclick', name, device);
            }
        }
    }
</script>

<style scoped>
    .card {
        height: 151px;
    }

    .card-body {
        overflow-y: auto;
    }

    .chart-icon {
        width: 30px;
        height: 30px;
        background-image: url('./img/chart.svg');
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
    }

    .list-group-item {
        height: 50px;
    }

    .list-group-item:first-child {
        height: 51px;
    }
</style>