<template>
    <select v-model="selectedSensor" :disabled="disabled" @change="onChange" class="custom-select" size="10">
        <!-- sensor 목록 반복 -->
        <option v-for="(sensor, i) in sensorList" :key="i" :value="sensor">
            {{ sensor.name }}
        </option>
        <!-- END-sensor 목록 반복 -->
    </select>
</template>

<script>
    import Sensor from '../../device/sensor';

    /**
     * Template event : itemselect, load
     */
    export default {
        props: {
            disabled: {type: Boolean, default: false}
        },
        data: function () {
            return {
                sensorList: [],
                selectedSensor: null
            };
        },
        methods: {
            onChange: function () {
                const me = this;
                
                me.$emit('itemselect', me.selectedSensor);
            },
            load: function (reselection) {
                reselection = !!reselection;

                const me = this;

                me.sensorList = [];

                return apiRequest(SENSOR_LIST_URL, {}, 'get').then(function (obj) {
                    const arr = obj.data;

                    let prevSensor = null;

                    for (let i = 0; i < arr.length; i++) {
                        const item = arr[i];
                        const sensor = new Sensor();

                        sensor.setValueFromDb(item);

                        me.sensorList.push(sensor);

                        // 처음 항목 선택, 이후 이전에 선택한 대상이 있으면 그 항목 선택.
                        if (reselection && me.selectedSensor && me.selectedSensor.id == sensor.id) {
                            prevSensor = sensor;
                        }
                    }

                    me.selectedSensor = null;

                    if (prevSensor) {
                        me.selectedSensor = prevSensor;
                        me.$emit('itemselect', me.selectedSensor);

                    } else {
                        // 선택된 항목이 없으면 목록의 마지막 항목을 선택한다.
                        if(me.sensorList.length) {
                            me.selectedSensor = me.sensorList[me.sensorList.length - 1];
                            me.$emit('itemselect', me.selectedSensor);
                        }
                    }

                    me.$emit('load', me.sensorList);

                }).catch(function (error) {
                    console.error(error);
                    me.$emit('load', me.sensorList);

                    return Promise.resolve();
                });
            }
        }
    }
</script>