(function () {
    'use strict';

    class Utils {
        static randomString(count = 16) {
            let str = '';

            for (let i = 0; i < count; i++) {
                str += Math.floor(Math.random() * 36).toString(36);
            }

            return str;
        }

        static parseUrl(url) {
            const aEl = document.createElement('A');

            aEl.href = url;

            const arr = aEl.search.replace(/^\?/, '').split('&');
            const searchObj={};

            let queries;

            for (let i = 0; i < arr.length; i++) {
                queries = arr[i].split('=');
                searchObj[queries[0]] = queries[1];
            }

            return {
                protocol: aEl.protocol,
                host: aEl.host,
                hostname: aEl.hostname,
                port: aEl.port,
                // 브라우저에 따라서 pathname 값 앞에 `/`가 붙지 않는 겨우가 있다.
                // 브라우저 상관없이 `/`가 붙어있도록 처리한다.
                pathname: ('/' + aEl.pathname).replace(/^\/\//, '\/'),
                search: aEl.search,
                searchObj: searchObj,
                hash: aEl.hash
            };
        }

        static snakeToCamel(str = '') {
            str = str.toLowerCase();

            return str.replace(/([-_].)/g, function (group) {
                return group.toUpperCase().replace(/-|_/g, '');
            });
        }

        static snakeObjToCamelObj(sObj) {
            const cObj = {};

            for (let key in sObj) {
                cObj[Utils.snakeToCamel(key)] = sObj[key];
            }

            return cObj;
        }
    }

    class Sensor {
        constructor (obj = {}) {
            this.id = (typeof obj.id == 'number') ? obj.id : -1;
            this.type = obj.type || '';
            this.name = obj.name || 'NONAME';
            this.isUse = (typeof obj.isUse == 'boolean') ? obj.isUse : true;
            this.configFileUrl = obj.configFileUrl || '';

            /**
             * 센서값.
             * 모든 종류의 센서값을 넣을 수 있도록 한다.
             * 타입에 따라 사용되는 항목은 외부에서 결정한다. (ex 시리얼 센서로 사용될 경우 protocol에만 값을 넣다뺐다 한다.)
             */
            this.minVoltage = obj.minVoltage;
            this.maxVoltage = obj.maxVoltage;
            this.minValue = obj.minValue;
            this.maxValue = obj.maxValue;
            this.protocol = obj.protocol;
            this.uuid = obj.uuid;
        }

        setValueFromDb(obj) {
            const me = this;

            me.id = obj.SEQ_ID;
            me.name = obj.NAME;
            me.isUse = (obj.IS_USE === 1);

            me.minVoltage = obj.MIN_VOLTAGE;
            me.maxVoltage = obj.MAX_VOLTAGE;
            me.minValue = obj.MIN_VALUE;
            me.maxValue = obj.MAX_VALUE;
            me.protocol = obj.PROTOCOL;
            me.uuid = obj.UUID;
        }

        getDataObject() {
            const me = this;

            const obj = new Sensor(me);

            obj.isUse = (me.isUse ? 1 : 0);

            return obj;
        }
    }

    class Channel {
        constructor (obj = {}) {
            this.id = Utils.randomString();
            this.number = obj.number || 0;
            this.parent = obj.parent || null;
            this.name = obj.name || '';
            this.type = obj.type || 'analog';
            this.sensor = new Sensor(obj.sensor || {type: this.type});
        }
    }

    class Device {
        constructor () {
            const me = this;

            /**
             * ID.
             */
            me.id = -1;

            /**
             * 기기번호.
             */
            me.number = 0;

            /**
             * 타입 코드
             */
            me.typeCode = 1;

            /**
             * 타입
             */
            me.type = 'outter';

            /**
             * 사용여부
             */
            me.isUse = true;

            /**
             * 단방향 수신여부.
             */
            me.isOneWay = false;

            /**
             * 이미지 경로.
             */
            me.imageUrl = 'img/usa-device.png';

            /**
             * 아날로그 채널.
             */
            me.analogChannels = [
                new Channel({
                    number: 1,
                    parent: me,
                    name: 'Channel 1',
                    type: 'analog',
                    sensor: {
                        type: 'analog',
                        name: 'ANALOG_1',
                        minVoltage: 0,
                        maxVoltage: 5,
                        minValue: 0,
                        maxValue:5
                    }
                }),
                new Channel({
                    number: 2,
                    parent: me,
                    name: 'Channel 2',
                    type: 'analog',
                    sensor: {
                        type: 'analog',
                        name: 'ANALOG_2',
                        minVoltage: 0,
                        maxVoltage: 5,
                        minValue: 0,
                        maxValue:5
                    }
                })
            ];

            /**
             * 디지털 채널.
             */
            me.digitalChannels = [
                new Channel({
                    number: 1,
                    parent: me,
                    name: 'Channel 1',
                    type: 'digital',
                    sensor: {
                        type: 'digital',
                        name: 'DIGITAL_1',
                        minValue: 0,
                        maxValue: 1,
                    }
                }),
                new Channel({
                    number: 2,
                    parent: me,
                    name: 'Channel 2',
                    type: 'digital',
                    sensor: {
                        type: 'digital',
                        name: 'DIGITAL_2',
                        minValue: 0,
                        maxValue: 1,
                    }
                })
            ];

            /**
             * 시리얼 채널.
             */
             me.serialChannels = [
                new Channel({
                    number: 1,
                    parent: me,
                    name: 'Serial 1',
                    type: 'serial',
                    sensor: {
                        type: 'serial',
                        name: 'SERIAL_1',
                        protocol: 'NONE',
                    }
                })
            ];

            /**
             * 블루투스 채널.
             */
             me.bluetoothChannels = [
                new Channel({
                    number: 1,
                    parent: me,
                    name: 'Bluetooth',
                    type: 'bluetooth',
                    sensor: {
                        type: 'bluetooth',
                        name: 'BLE_DEFAULT',
                        uuid: '00000000-0000-0000-0000-000000000000'
                    }
                })
            ];
        }

        static validateDevice(device, deviceList = []) {
            const arr = device.getSensorArray();

            const nameArr = arr.map(function (val) {
                return val.name;
            });

            const nameSet = new Set(nameArr);

            let isOk = true;
            let message = '';
            let emptyCount = 0;

            // 비어있는 이름이 있는지 확인.
            for (let i = 0; i < nameArr.length; i++) {
                if (!nameArr[i]) {
                    emptyCount++;
                }
            }

            if (device.number < 0) {
                isOk = false;
                message = '디바이스의 번호는 0 보다 작을 수 없습니다.';

            } else if (!Number.isInteger(device.number)) {
                isOk = false;
                message = '디바이스 번호는 정수여야 합니다.';

            } else if (emptyCount > 0) {
                isOk = false;
                message = '센서의 이름은 필수입니다.';

            } else if (nameSet.size < nameArr.length) {
                isOk = false;
                message = '디바이스 내의 센서는 같은 이름을 가질 수 없습니다.';

            } else {
                // 같은 디바이스 번호가 있는지 확인한다.
                for (let i = 0; i < deviceList.length; i++) {
                    if (device.id != deviceList[i].id && device.number == deviceList[i].number) {
                        isOk = false;
                        message = '디바이스는 같은 번호를 가질 수 없습니다.';
                        break;
                    }
                }
            }

            return {
                isOk: isOk,
                message: message
            };
        }

        setValueFromDb(obj) {
            const me = this;

            me.id = obj.SEQ_ID;
            me.number = obj.USA_NUM;
            me.typeCode = obj.DEVICE_TYPE;
            me.isOneWay = (obj.IS_ONE_WAY === 1);

            me.type = 'outter';

            if (me.typeCode == 0) {
                me.type = 'inner';
            }

            me.isUse = (obj.IS_USE === 1);

            let number;

            for (let i = 0; i < me.analogChannels.length; i++) {
                number = i + 1;

                me.analogChannels[i].parent = me;
                me.analogChannels[i].number = number;
                me.analogChannels[i].sensor.isUse = (obj['ANALOG_IS_USE_' + number + 'CH'] === 1);
                me.analogChannels[i].sensor.name = obj['ANALOG_NAME_' + number + 'CH'];
                me.analogChannels[i].sensor.minVoltage = obj['ANALOG_MIN_VOLTAGE_' + number + 'CH'];
                me.analogChannels[i].sensor.maxVoltage = obj['ANALOG_MAX_VOLTAGE_' + number + 'CH'];
                me.analogChannels[i].sensor.minValue = obj['ANALOG_MIN_VALUE_' + number + 'CH'];
                me.analogChannels[i].sensor.maxValue = obj['ANALOG_MAX_VALUE_' + number + 'CH'];
            }

            for (let i = 0; i < me.digitalChannels.length; i++) {
                number = i + 1;

                me.digitalChannels[i].parent = me;
                me.digitalChannels[i].number = number;
                me.digitalChannels[i].sensor.isUse = (obj['DIGITAL_IS_USE_' + number + 'CH'] === 1);
                me.digitalChannels[i].sensor.name = obj['DIGITAL_NAME_' + number + 'CH'];
                me.digitalChannels[i].sensor.minValue = obj['DIGITAL_MIN_VALUE_' + number + 'CH'];
                me.digitalChannels[i].sensor.maxValue = obj['DIGITAL_MAX_VALUE_' + number + 'CH'];
            }

            for (let i = 0; i < me.bluetoothChannels.length; i++) {
                number = i + 1;

                me.bluetoothChannels[i].parent = me;
                me.bluetoothChannels[i].number = number;
                me.bluetoothChannels[i].sensor.isUse = (obj['BLUETOOTH_IS_USE_' + number + 'CH'] === 1);
                me.bluetoothChannels[i].sensor.name = obj['BLUETOOTH_NAME_' + number + 'CH'];
                me.bluetoothChannels[i].sensor.uuid = obj['BLUETOOTH_UUID_' + number + 'CH'];
            }

            for (let i = 0; i < me.serialChannels.length; i++) {
                number = i + 1;

                me.serialChannels[i].parent = me;
                me.serialChannels[i].number = number;
                me.serialChannels[i].sensor.isUse = (obj['SERIAL_IS_USE_' + number + 'CH'] === 1);
                me.serialChannels[i].sensor.name = obj['SERIAL_NAME_' + number + 'CH'];
                me.serialChannels[i].sensor.protocol = obj['SERIAL_PROTOCOL_' + number + 'CH'];
            }
        }

        getDataObject() {
            const me = this;

            const obj = {
                id: me.id,
                imageUrl: me.imageUrl,
                number: me.number,
                typeCode: me.typeCode,
                isUse: (me.isUse ? 1 : 0),
                isOneWay: (me.isOneWay ? 1 : 0)
            };

            let sensor;
            let number;

            // 아날로그 채널.
            for (let i = 0; i < me.analogChannels.length; i++) {
                sensor = me.analogChannels[i].sensor;
                number = i + 1;

                obj['analogIsUse' + number + 'ch'] = (sensor.isUse ? 1 : 0);
                obj['analogName' + number + 'ch'] = sensor.name;
                obj['analogMinVoltage' + number + 'ch'] = sensor.minVoltage;
                obj['analogMaxVoltage' + number + 'ch'] = sensor.maxVoltage;
                obj['analogMinValue' + number + 'ch'] = sensor.minValue;
                obj['analogMaxValue' + number + 'ch'] = sensor.maxValue;
            }

            // 디지털 채널.
            for (let i = 0; i < me.digitalChannels.length; i++) {
                sensor = me.digitalChannels[i].sensor;
                number = i + 1;

                obj['digitalIsUse' + number + 'ch'] = (sensor.isUse ? 1 : 0);
                obj['digitalName' + number + 'ch'] = sensor.name;
                obj['digitalMinValue' + number + 'ch'] = sensor.minValue;
                obj['digitalMaxValue' + number + 'ch'] = sensor.maxValue;
            }

            // 시리얼 채널.
            for (let i = 0; i < me.bluetoothChannels.length; i++) {
                sensor = me.bluetoothChannels[i].sensor;
                number = i + 1;

                obj['bluetoothIsUse' + number + 'ch'] = (sensor.isUse ? 1 : 0);
                obj['bluetoothName' + number + 'ch'] = sensor.name;
                obj['bluetoothUuid' + number + 'ch'] = sensor.uuid;
            }

            // 시리얼 채널.
            for (let i = 0; i < me.serialChannels.length; i++) {
                sensor = me.serialChannels[i].sensor;
                number = i + 1;

                obj['serialIsUse' + number + 'ch'] = (sensor.isUse ? 1 : 0);
                obj['serialName' + number + 'ch'] = sensor.name;
                obj['serialProtocol' + number + 'ch'] = sensor.protocol;
            }

            return obj;
        }

        getSensorArray() {
            const me = this;

            const arr = [];

            for (let i = 0; i < me.analogChannels.length; i++) {
                arr.push(me.analogChannels[i].sensor);
            }

            for (let i = 0; i < me.digitalChannels.length; i++) {
                arr.push(me.digitalChannels[i].sensor);
            }

            for (let i = 0; i < me.bluetoothChannels.length; i++) {
                arr.push(me.bluetoothChannels[i].sensor);
            }

            for (let i = 0; i < me.serialChannels.length; i++) {
                arr.push(me.serialChannels[i].sensor);
            }

            return arr;
        }

        getSensorByName(name) {
            const me = this;

            const arr = me.getSensorArray();

            let sensor = null;

            for (let i = 0; i < arr.length; i++) {
                if(arr[i].name == name) {
                    sensor = arr[i];
                    break;
                }
            }

            return sensor;
        }
    }

    class ChartData {
        constructor (obj = {}) {
            this.y = obj.y || 0;
            this.date = obj.date || new Date();
        }
    }

    //

    /**
     * Template event : hidden
     */
    var script$2 = {
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
    };

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

    function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
    /* server only */
    , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
      } // Vue.extend constructor export interop.


      var options = typeof script === 'function' ? script.options : script; // render functions

      if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true; // functional template

        if (isFunctionalTemplate) {
          options.functional = true;
        }
      } // scopedId


      if (scopeId) {
        options._scopeId = scopeId;
      }

      var hook;

      if (moduleIdentifier) {
        // server build
        hook = function hook(context) {
          // 2.3 injection
          context = context || // cached call
          this.$vnode && this.$vnode.ssrContext || // stateful
          this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
          // 2.2 with runInNewContext: true

          if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
            context = __VUE_SSR_CONTEXT__;
          } // inject component styles


          if (style) {
            style.call(this, createInjectorSSR(context));
          } // register component module identifier for async chunk inference


          if (context && context._registeredComponents) {
            context._registeredComponents.add(moduleIdentifier);
          }
        }; // used by ssr in case component is cached and beforeCreate
        // never gets called


        options._ssrRegister = hook;
      } else if (style) {
        hook = shadowMode ? function () {
          style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
        } : function (context) {
          style.call(this, createInjector(context));
        };
      }

      if (hook) {
        if (options.functional) {
          // register for functional component in vue file
          var originalRender = options.render;

          options.render = function renderWithStyleInjection(h, context) {
            hook.call(context);
            return originalRender(h, context);
          };
        } else {
          // inject component registration as beforeCreate hook
          var existing = options.beforeCreate;
          options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
      }

      return script;
    }

    var normalizeComponent_1 = normalizeComponent;

    /* script */
    const __vue_script__$2 = script$2;

    /* template */
    var __vue_render__$2 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        {
          staticClass: "modal fade",
          attrs: {
            id: "modal-" + _vm.uid,
            tabindex: "-1",
            "data-backdrop": "static",
            "data-keyboard": "false"
          }
        },
        [
          _c("div", { staticClass: "modal-dialog modal-xl" }, [
            _c("div", { staticClass: "modal-content" }, [
              _vm._m(0),
              _vm._v(" "),
              _c("div", { staticClass: "modal-footer" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-secondary",
                    attrs: { type: "button" },
                    on: { click: _vm.onClickClose }
                  },
                  [_vm._v("Close")]
                )
              ])
            ])
          ])
        ]
      )
    };
    var __vue_staticRenderFns__$2 = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "modal-body" }, [
          _c("div", { staticClass: "row" }, [
            _c("canvas", { staticClass: "col-12", attrs: { id: "chart" } })
          ])
        ])
      }
    ];
    __vue_render__$2._withStripped = true;

      /* style */
      const __vue_inject_styles__$2 = undefined;
      /* scoped */
      const __vue_scope_id__$2 = undefined;
      /* module identifier */
      const __vue_module_identifier__$2 = undefined;
      /* functional template */
      const __vue_is_functional_template__$2 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var SensorChartModalVue = normalizeComponent_1(
        { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
        __vue_inject_styles__$2,
        __vue_script__$2,
        __vue_scope_id__$2,
        __vue_is_functional_template__$2,
        __vue_module_identifier__$2,
        undefined,
        undefined
      );

    //

    /**
     * Template event : itemclick
     */
    var script$1 = {
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
    };

    var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
    function createInjector(context) {
      return function (id, style) {
        return addStyle(id, style);
      };
    }
    var HEAD = document.head || document.getElementsByTagName('head')[0];
    var styles = {};

    function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = {
        ids: new Set(),
        styles: []
      });

      if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;

        if (css.map) {
          // https://developer.chrome.com/devtools/docs/javascript-debugging
          // this makes source maps inside style tags work properly in Chrome
          code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

          code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
        }

        if (!style.element) {
          style.element = document.createElement('style');
          style.element.type = 'text/css';
          if (css.media) style.element.setAttribute('media', css.media);
          HEAD.appendChild(style.element);
        }

        if ('styleSheet' in style.element) {
          style.styles.push(code);
          style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
        } else {
          var index = style.ids.size - 1;
          var textNode = document.createTextNode(code);
          var nodes = style.element.childNodes;
          if (nodes[index]) style.element.removeChild(nodes[index]);
          if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
        }
      }
    }

    var browser = createInjector;

    /* script */
    const __vue_script__$1 = script$1;

    /* template */
    var __vue_render__$1 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "card btn btn-light p-0" }, [
        _c("div", { staticClass: "card-body p-0 h-100" }, [
          _c(
            "ul",
            { staticClass: "list-group" },
            _vm._l(_vm.otherNameArr, function(name, i) {
              return _c(
                "li",
                {
                  key: i,
                  staticClass: "list-group-item list-group-item-action py-2",
                  on: {
                    click: function($event) {
                      return _vm.onClick(name, _vm.device)
                    }
                  }
                },
                [
                  _c("div", { staticClass: "row" }, [
                    _vm._m(0, true),
                    _vm._v(" "),
                    _c("div", { staticClass: "col-9 text-left text-truncate" }, [
                      _vm._v(
                        "\n                        " +
                          _vm._s(name ? name : " ") +
                          "\n                    "
                      )
                    ])
                  ])
                ]
              )
            }),
            0
          )
        ])
      ])
    };
    var __vue_staticRenderFns__$1 = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "col-3" }, [
          _c("div", { staticClass: "chart-icon mx-auto" })
        ])
      }
    ];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$1 = function (inject) {
        if (!inject) return
        inject("data-v-5e04750a_0", { source: "\n.card[data-v-5e04750a] {\n    height: 151px;\n}\n.card-body[data-v-5e04750a] {\n    overflow-y: auto;\n}\n.chart-icon[data-v-5e04750a] {\n    width: 30px;\n    height: 30px;\n    background-image: url('./img/chart.svg');\n    background-size: 100% 100%;\n    background-position: center;\n    background-repeat: no-repeat;\n}\n.list-group-item[data-v-5e04750a] {\n    height: 50px;\n}\n.list-group-item[data-v-5e04750a]:first-child {\n    height: 51px;\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\monitoring\\otherSensorNameList.vue"],"names":[],"mappings":";AAoEA;IACA,aAAA;AACA;AAEA;IACA,gBAAA;AACA;AAEA;IACA,WAAA;IACA,YAAA;IACA,wCAAA;IACA,0BAAA;IACA,2BAAA;IACA,4BAAA;AACA;AAEA;IACA,YAAA;AACA;AAEA;IACA,YAAA;AACA","file":"otherSensorNameList.vue","sourcesContent":["<template>\r\n    <div class=\"card btn btn-light p-0\">\r\n        <div class=\"card-body p-0 h-100\">\r\n            <ul class=\"list-group\">\r\n                <li v-for=\"(name, i) in otherNameArr\" :key=\"i\" @click=\"onClick(name, device)\" class=\"list-group-item list-group-item-action py-2\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-3\">\r\n                            <div class=\"chart-icon mx-auto\"></div>\r\n                        </div>\r\n\r\n                        <div class=\"col-9 text-left text-truncate\">\r\n                            {{name ? name : '&nbsp;'}}\r\n                        </div>\r\n                    </div>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n    </div>\r\n</template>\r\n\r\n<script>\r\n    import Device from '../../device/device';\r\n\r\n    /**\r\n     * Template event : itemclick\r\n     */\r\n    export default {\r\n        props: {\r\n            device: {type: Device, default: null},\r\n            dataNameArray: {type: Array, default: null}\r\n        },\r\n        data: function () {\r\n            return {\r\n                otherNameArr: []\r\n            };\r\n        },\r\n        mounted: function () {\r\n            const me = this;\r\n\r\n            me.draw();\r\n        },\r\n        methods: {\r\n            draw: function () {\r\n                const me = this;\r\n\r\n                if (me.device && me.dataNameArray) {\r\n                    me.otherNameArr = [];\r\n\r\n                    for (let i = 0; i < me.dataNameArray.length; i++) {\r\n                        const name = me.dataNameArray[i];\r\n\r\n                        // 디바이스 번호와 연관된 이름들 중에서 지금 정보에 없는 이름만 골라낸다.\r\n                        if (!me.device.getSensorByName(name)) {\r\n                            me.otherNameArr.push(name);\r\n                        }\r\n                    }\r\n                }\r\n            },\r\n            onClick: function (name, device) {\r\n                const me = this;\r\n\r\n                me.$emit('itemclick', name, device);\r\n            }\r\n        }\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    .card {\r\n        height: 151px;\r\n    }\r\n\r\n    .card-body {\r\n        overflow-y: auto;\r\n    }\r\n\r\n    .chart-icon {\r\n        width: 30px;\r\n        height: 30px;\r\n        background-image: url('./img/chart.svg');\r\n        background-size: 100% 100%;\r\n        background-position: center;\r\n        background-repeat: no-repeat;\r\n    }\r\n\r\n    .list-group-item {\r\n        height: 50px;\r\n    }\r\n\r\n    .list-group-item:first-child {\r\n        height: 51px;\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$1 = "data-v-5e04750a";
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = false;
      /* style inject SSR */
      

      
      var OtherSensorNameListVue = normalizeComponent_1(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        browser,
        undefined
      );

    //

    var script = {
        components: {
            'sensor-chart-modal': SensorChartModalVue,
            'other-sensor-name-list': OtherSensorNameListVue
        },
        data: function () {
            return {
                api: SENSOR_DATA_LIST_URL,
                devices: {},
                channelArrays: {},
                dataNameArrays: {}
            }
        },
        mounted: function () {
            const me = this;

            me.load();
        },
        methods: {
            load: function () {
                const me = this;

                me.devices = {};
                me.channelArrays = {};
                me.dataNameArrays = {};

                // 디바이스 번호와 관련있는 이름의 목록을 가지고 온다.
                // 디바이스 정보에 없는 이름을 가진 데이터가 있을 수 있다.
                return apiRequest(SENSOR_DATA_NAME_LIST_URL, {}, 'get').then(function (obj) {
                    const arr = obj.data;
                    const nameArrays = {};

                    for (let i = 0; i < arr.length; i++) {
                        if (!nameArrays[arr[i].USA_NUM]) {
                            nameArrays[arr[i].USA_NUM] = [];
                        }
                        nameArrays[arr[i].USA_NUM].push(arr[i].CHANNEL_NAME);
                    }

                    me.dataNameArrays = nameArrays;

                    // 디바이스 목록 조회
                    apiRequest(DEVICE_LIST_URL, {}, 'get').then(function (obj) {
                        const arr = obj.data;
                        const devices = {};
                        const channelArrays = {};

                        for (let i = 0; i < arr.length; i++) {
                            const item = arr[i];
                            const device = new Device();

                            device.setValueFromDb(item);

                            // 채널 객체 단일 배열에 저장
                            if (!channelArrays[device.number]) {
                                channelArrays[device.number] = [];
                            }

                            // 디바이스에 속한 채널 순서대로 단일 배열에 저장.
                            channelArrays[device.number] = channelArrays[device.number].concat(device.analogChannels);
                            channelArrays[device.number] = channelArrays[device.number].concat(device.digitalChannels);
                            channelArrays[device.number] = channelArrays[device.number].concat(device.serialChannels);
                            channelArrays[device.number] = channelArrays[device.number].concat(device.bluetoothChannels);

                            devices[device.number] = device;
                        }

                        me.channelArrays = channelArrays;
                        me.devices = devices;
                    });
                }).catch(function (error) {
                    console.error(error);
                    alert('processing error.');

                    return Promise.resolve();
                });
            },
            onClickChannel(channel) {
                const me = this;

                me.$refs.sensorChartModal.show(channel);
            },
            onClickOtherName(name, device) {
                const me = this;

                const channel = new Channel({
                    parent: device,
                    name: 'Other',
                    type: 'temp'
                });

                channel.sensor.name = name;

                me.$refs.sensorChartModal.show(channel);
            }
        }
    };

    /* script */
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        { staticClass: "row px-1 px-lg-5" },
        [
          _c("sensor-chart-modal", {
            ref: "sensorChartModal",
            attrs: { api: _vm.api }
          }),
          _vm._v(" "),
          _vm._l(_vm.devices, function(device, number) {
            return _c("div", { key: number, staticClass: "card w-100 mb-3" }, [
              device.isUse
                ? _c("div", { staticClass: "card-body" }, [
                    _c(
                      "div",
                      {
                        staticClass:
                          "w-100 d-flex flex-wrap justify-content-between"
                      },
                      [
                        _vm._l(_vm.channelArrays[number], function(channel, i) {
                          return [
                            device.typeCode == 0 || channel.type != "bluetooth"
                              ? _c(
                                  "div",
                                  { key: i, staticClass: "w-14 col-12 p-1" },
                                  [
                                    _c(
                                      "div",
                                      {
                                        staticClass: "card btn btn-light p-0",
                                        on: {
                                          click: function($event) {
                                            return _vm.onClickChannel(channel)
                                          }
                                        }
                                      },
                                      [
                                        _c(
                                          "div",
                                          {
                                            staticClass:
                                              "card-header d-flex justify-content-between"
                                          },
                                          [
                                            _c(
                                              "span",
                                              { staticClass: "text-truncate" },
                                              [_vm._v("Device : " + _vm._s(number))]
                                            ),
                                            _vm._v(" "),
                                            _c(
                                              "span",
                                              { staticClass: "text-truncate" },
                                              [
                                                _vm._v(
                                                  "Channel : " +
                                                    _vm._s(channel.number)
                                                )
                                              ]
                                            )
                                          ]
                                        ),
                                        _vm._v(" "),
                                        _c("div", { staticClass: "card-body" }, [
                                          _c("div", { staticClass: "row" }, [
                                            _vm._m(0, true),
                                            _vm._v(" "),
                                            _c("div", { staticClass: "col-9" }, [
                                              _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "col-12 p-0 text-center text-truncate"
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                            Name\n                                        "
                                                  )
                                                ]
                                              ),
                                              _vm._v(" "),
                                              _c(
                                                "div",
                                                {
                                                  staticClass:
                                                    "col-12 m-0 p-0 pb-2 h4 text-center text-truncate"
                                                },
                                                [
                                                  _vm._v(
                                                    "\n                                            " +
                                                      _vm._s(channel.sensor.name) +
                                                      "\n                                        "
                                                  )
                                                ]
                                              )
                                            ])
                                          ])
                                        ])
                                      ]
                                    )
                                  ]
                                )
                              : _vm._e(),
                            _vm._v(" "),
                            i + 1 == _vm.channelArrays[number].length &&
                            device.typeCode != 0
                              ? _c("div", {
                                  key: "empty-" + i,
                                  staticClass: "w-14"
                                })
                              : _vm._e(),
                            _vm._v(" "),
                            i + 1 == _vm.channelArrays[number].length
                              ? _c(
                                  "div",
                                  {
                                    key: "list-" + i,
                                    staticClass: "w-16 col-12 p-1"
                                  },
                                  [
                                    _c("other-sensor-name-list", {
                                      attrs: {
                                        device: _vm.devices[number],
                                        dataNameArray: _vm.dataNameArrays[number]
                                      },
                                      on: { itemclick: _vm.onClickOtherName }
                                    })
                                  ],
                                  1
                                )
                              : _vm._e()
                          ]
                        })
                      ],
                      2
                    )
                  ])
                : _c("div", { staticClass: "card-body" }, [
                    _c("div", { staticClass: "text-center" }, [
                      _c("span", [_vm._v("- Device : " + _vm._s(number) + " -")])
                    ])
                  ])
            ])
          })
        ],
        2
      )
    };
    var __vue_staticRenderFns__ = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "div",
          {
            staticClass:
              "col-3 pr-0 d-flex justify-content-center align-items-center"
          },
          [_c("div", { staticClass: "chart-icon" })]
        )
      }
    ];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = function (inject) {
        if (!inject) return
        inject("data-v-bc9c9a06_0", { source: "\n.chart-icon[data-v-bc9c9a06] {\n    width: 40px;\n    height: 40px;\n    background-image: url('./img/chart.svg');\n    background-size: 100% 100%;\n    background-position: center;\n    background-repeat: no-repeat;\n}\n@media (min-width: 992px) {\n.w-14[data-v-bc9c9a06] {\n        flex: none;\n        width: 14%;\n}\n.w-16[data-v-bc9c9a06] {\n        flex: none;\n        width: 16%;\n}\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\monitoring\\monitoringPage.vue"],"names":[],"mappings":";AA6LA;IACA,WAAA;IACA,YAAA;IACA,wCAAA;IACA,0BAAA;IACA,2BAAA;IACA,4BAAA;AACA;AAEA;AACA;QACA,UAAA;QACA,UAAA;AACA;AAEA;QACA,UAAA;QACA,UAAA;AACA;AACA","file":"monitoringPage.vue","sourcesContent":["<template>\r\n    <div class=\"row px-1 px-lg-5\">\r\n        <!-- 차트 모달 -->\r\n        <sensor-chart-modal\r\n            :api=\"api\"\r\n            ref=\"sensorChartModal\">\r\n        </sensor-chart-modal>\r\n        <!-- END-차트 모달 -->\r\n\r\n        <!-- 디바이스 라인 -->\r\n        <div v-for=\"(device, number) in devices\" :key=\"number\" class=\"card w-100 mb-3\">\r\n            <div v-if=\"device.isUse\" class=\"card-body\">\r\n                <div class=\"w-100 d-flex flex-wrap justify-content-between\">\r\n                    <!-- 해당 디바이스의 채널 카드 -->\r\n                    <template v-for=\"(channel, i) in channelArrays[number]\">\r\n                        <div\r\n                            v-if=\"device.typeCode == 0 || channel.type != 'bluetooth'\"\r\n                            :key=\"i\"\r\n                            class=\"w-14 col-12 p-1\">\r\n\r\n                            <div\r\n                                @click=\"onClickChannel(channel)\"\r\n                                class=\"card btn btn-light p-0\">\r\n\r\n                                <div class=\"card-header d-flex justify-content-between\">\r\n                                    <span class=\"text-truncate\">Device : {{ number }}</span>\r\n                                    <span class=\"text-truncate\">Channel : {{ channel.number }}</span>\r\n                                </div>\r\n\r\n                                <div class=\"card-body\">\r\n                                    <div class=\"row\">\r\n                                        <div class=\"col-3 pr-0 d-flex justify-content-center align-items-center\">\r\n                                            <div class=\"chart-icon\">\r\n                                            </div>\r\n                                        </div>\r\n\r\n                                        <div class=\"col-9\">\r\n                                            <div class=\"col-12 p-0 text-center text-truncate\">\r\n                                                Name\r\n                                            </div>\r\n                                            <div class=\"col-12 m-0 p-0 pb-2 h4 text-center text-truncate\">\r\n                                                {{ channel.sensor.name }}\r\n                                            </div>\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <!-- 빈 공간 -->\r\n                        <div\r\n                            v-if=\"(i + 1) == channelArrays[number].length && device.typeCode != 0\"\r\n                            :key=\"'empty-' + i\"\r\n                            class=\"w-14\">\r\n                        </div>\r\n                        <!-- END-빈 공간 -->\r\n\r\n                        <!-- 등록되지 않은 채널목록 -->\r\n                        <div v-if=\"(i + 1) == channelArrays[number].length\" :key=\"'list-' + i\" class=\"w-16 col-12 p-1\">\r\n                            <other-sensor-name-list\r\n                                :device=\"devices[number]\"\r\n                                :dataNameArray=\"dataNameArrays[number]\"\r\n                                @itemclick=\"onClickOtherName\">\r\n                            </other-sensor-name-list>\r\n                        </div>\r\n                        <!-- END-등록되지 않은 채널목록 -->\r\n                    </template>\r\n                    <!-- END-해당 디바이스의 채널 카드 -->\r\n                </div>\r\n            </div>\r\n\r\n            <div v-else class=\"card-body\">\r\n                <div class=\"text-center\">\r\n                    <span>- Device : {{ number }} -</span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- END-디바이스 라인 -->\r\n    </div>\r\n</template>\r\n\r\n<script>\r\n    import Device from '../../device/device';\r\n    import Channel from '../../device/channel';\r\n\r\n    import SensorChartModalVue from './sensorChartModal.vue';\r\n    import OtherSensorNameListVue from './otherSensorNameList.vue';\r\n\r\n    export default {\r\n        components: {\r\n            'sensor-chart-modal': SensorChartModalVue,\r\n            'other-sensor-name-list': OtherSensorNameListVue\r\n        },\r\n        data: function () {\r\n            return {\r\n                api: SENSOR_DATA_LIST_URL,\r\n                devices: {},\r\n                channelArrays: {},\r\n                dataNameArrays: {}\r\n            }\r\n        },\r\n        mounted: function () {\r\n            const me = this;\r\n\r\n            me.load();\r\n        },\r\n        methods: {\r\n            load: function () {\r\n                const me = this;\r\n\r\n                me.devices = {};\r\n                me.channelArrays = {};\r\n                me.dataNameArrays = {};\r\n\r\n                // 디바이스 번호와 관련있는 이름의 목록을 가지고 온다.\r\n                // 디바이스 정보에 없는 이름을 가진 데이터가 있을 수 있다.\r\n                return apiRequest(SENSOR_DATA_NAME_LIST_URL, {}, 'get').then(function (obj) {\r\n                    const arr = obj.data;\r\n                    const nameArrays = {};\r\n\r\n                    for (let i = 0; i < arr.length; i++) {\r\n                        if (!nameArrays[arr[i].USA_NUM]) {\r\n                            nameArrays[arr[i].USA_NUM] = [];\r\n                        };\r\n\r\n                        nameArrays[arr[i].USA_NUM].push(arr[i].CHANNEL_NAME);\r\n                    }\r\n\r\n                    me.dataNameArrays = nameArrays;\r\n\r\n                    // 디바이스 목록 조회\r\n                    apiRequest(DEVICE_LIST_URL, {}, 'get').then(function (obj) {\r\n                        const arr = obj.data;\r\n                        const devices = {};\r\n                        const channelArrays = {};\r\n\r\n                        for (let i = 0; i < arr.length; i++) {\r\n                            const item = arr[i];\r\n                            const device = new Device();\r\n\r\n                            device.setValueFromDb(item);\r\n\r\n                            // 채널 객체 단일 배열에 저장\r\n                            if (!channelArrays[device.number]) {\r\n                                channelArrays[device.number] = [];\r\n                            }\r\n\r\n                            // 디바이스에 속한 채널 순서대로 단일 배열에 저장.\r\n                            channelArrays[device.number] = channelArrays[device.number].concat(device.analogChannels);\r\n                            channelArrays[device.number] = channelArrays[device.number].concat(device.digitalChannels);\r\n                            channelArrays[device.number] = channelArrays[device.number].concat(device.serialChannels);\r\n                            channelArrays[device.number] = channelArrays[device.number].concat(device.bluetoothChannels);\r\n\r\n                            devices[device.number] = device;\r\n                        }\r\n\r\n                        me.channelArrays = channelArrays;\r\n                        me.devices = devices;\r\n                    });\r\n                }).catch(function (error) {\r\n                    console.error(error);\r\n                    alert('processing error.');\r\n\r\n                    return Promise.resolve();\r\n                });\r\n            },\r\n            onClickChannel(channel) {\r\n                const me = this;\r\n\r\n                me.$refs.sensorChartModal.show(channel);\r\n            },\r\n            onClickOtherName(name, device) {\r\n                const me = this;\r\n\r\n                const channel = new Channel({\r\n                    parent: device,\r\n                    name: 'Other',\r\n                    type: 'temp'\r\n                });\r\n\r\n                channel.sensor.name = name;\r\n\r\n                me.$refs.sensorChartModal.show(channel);\r\n            }\r\n        }\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    .chart-icon {\r\n        width: 40px;\r\n        height: 40px;\r\n        background-image: url('./img/chart.svg');\r\n        background-size: 100% 100%;\r\n        background-position: center;\r\n        background-repeat: no-repeat;\r\n    }\r\n\r\n    @media (min-width: 992px) {\r\n        .w-14 {\r\n            flex: none;\r\n            width: 14%;\r\n        }\r\n\r\n        .w-16 {\r\n            flex: none;\r\n            width: 16%;\r\n        }\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__ = "data-v-bc9c9a06";
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject SSR */
      

      
      var MonitoringPage = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        browser,
        undefined
      );

    new Vue({
        el: '#container',
        components: {
            'monitoring-page': MonitoringPage
        }
    });

})();
