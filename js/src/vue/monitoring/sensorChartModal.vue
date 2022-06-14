<template>
    <div :id="'modal-' + uid" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row">
                        <canvas id="chart" class="col-12"></canvas>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" @click="onClickClose" class="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ChartData from '../../device/chartData';

    /**
     * Template event : hidden
     */
    export default {
        props: {
            api: {type: String, default: ''}
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid,
                name: '',
                channel: null,
                chart: null,
                intervalId: null
            };
        },
        mounted: function () {
            const me = this;

            // 차트객체 초기화.
            me.chart = initChart();

            // 모달이 표시된 뒤에 값을 넣어야 한다.
            $(me.$el).on('shown.bs.modal', function (evt) {
                // 부모 모달의 이벤트로 전파되기 때문에 막아야 한다.
                evt.stopPropagation();

                if (me.channel) {
                    me.name = me.channel.name;

                    me.load();

                    // 모달이 보여지고 있는 동안 주기적으로 조회한다.
                    me.intervalId = setInterval(function () {
                        if ($(me.$el).is(':visible')) {
                            me.load();

                        } else {
                            clearInterval(me.intervalId);
                        }
                    }, 10000);
                }
            }).on('hidden.bs.modal', function (evt) {
                // 부모 모달의 이벤트로 전파되기 때문에 막아야 한다.
                evt.stopPropagation();

                me.$emit('hidden');
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
            load: function () {
                const me = this;

                const params = {
                    usaNumber: me.channel.parent.number,
                    sensorName: me.channel.sensor.name
                };

                return apiRequest(me.api, params, 'get').then(function (obj) {
                    const arr = obj.data;

                    const lables = [];
                    const chartDataArr = [];

                    for (let i = 0; i < arr.length; i++) {
                        lables.push(i + 1);

                        chartDataArr.push(new ChartData({
                            y: arr[i].VALUE,
                            date: new Date(arr[i].C_DATE)
                        }));
                    }

                    me.chart.data.labels = lables;
                    me.chart.data.datasets[0].data = chartDataArr;
                    me.chart.update();

                }).catch(function (error) {
                    clearInterval(me.intervalId);

                    console.error(error);
                    alert('processing error.');

                    return Promise.resolve();
                });
            },
            onClickClose: function () {
                const me = this;

                clearInterval(me.intervalId);

                me.hide();

                me.chart.data.labels = [];
                me.chart.data.datasets[0].data = [];
                me.chart.update();
            }
        }
    }

    function initChart() {
        return new Chart($('#chart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    borderWidth: 0,
                    pointStyle: 'circle',
                    pointBorderWidth: 0,
                    pointBackgroundColor: '#dc3545',
                    backgroundColor: '#dc3545',
                    borderColor: '#dc3545',
                    fill:false,
                    data: []
                }]
            },
            options: {
                legend: false,
                elements: {
                    line: {
                        tension: 0
                    }
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                    }]
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItemArr, data) {
                            const date = data.datasets[0].data[tooltipItemArr[0].index].date;
                            return moment(date).format('MMMM Do YYYY, H:mm:ss');
                        }
                    }
                }
            }
        });
    }
</script>