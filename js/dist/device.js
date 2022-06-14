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

    //

    /**
     * Template event : itemselect, load
     */
    var script$c = {
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
    };

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
    const __vue_script__$c = script$c;

    /* template */
    var __vue_render__$c = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "select",
        {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.selectedSensor,
              expression: "selectedSensor"
            }
          ],
          staticClass: "custom-select",
          attrs: { disabled: _vm.disabled, size: "10" },
          on: {
            change: [
              function($event) {
                var $$selectedVal = Array.prototype.filter
                  .call($event.target.options, function(o) {
                    return o.selected
                  })
                  .map(function(o) {
                    var val = "_value" in o ? o._value : o.value;
                    return val
                  });
                _vm.selectedSensor = $event.target.multiple
                  ? $$selectedVal
                  : $$selectedVal[0];
              },
              _vm.onChange
            ]
          }
        },
        _vm._l(_vm.sensorList, function(sensor, i) {
          return _c("option", { key: i, domProps: { value: sensor } }, [
            _vm._v("\n        " + _vm._s(sensor.name) + "\n    ")
          ])
        }),
        0
      )
    };
    var __vue_staticRenderFns__$c = [];
    __vue_render__$c._withStripped = true;

      /* style */
      const __vue_inject_styles__$c = undefined;
      /* scoped */
      const __vue_scope_id__$c = undefined;
      /* module identifier */
      const __vue_module_identifier__$c = undefined;
      /* functional template */
      const __vue_is_functional_template__$c = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var SensorListVue = normalizeComponent_1(
        { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
        __vue_inject_styles__$c,
        __vue_script__$c,
        __vue_scope_id__$c,
        __vue_is_functional_template__$c,
        __vue_module_identifier__$c,
        undefined,
        undefined
      );

    //

    /**
     * Template event : itemselect
     */
    var script$b = {
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
    };

    /* script */
    const __vue_script__$b = script$b;

    /* template */
    var __vue_render__$b = function() {
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
          _c("div", { staticClass: "modal-dialog" }, [
            _c("div", { staticClass: "modal-content shadow-lg" }, [
              _c(
                "div",
                { staticClass: "modal-body" },
                [
                  _c("sensor-list", {
                    ref: "list",
                    attrs: { disabled: _vm.disabled },
                    on: {
                      itemselect: _vm.onSelectSensor,
                      load: _vm.onLoadSensorList
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c("div", { staticClass: "modal-footer" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary",
                    attrs: { disabled: _vm.disabled, type: "button" },
                    on: { click: _vm.onClickOk }
                  },
                  [_vm._v("OK")]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "btn btn-secondary",
                    attrs: { type: "button" },
                    on: { click: _vm.onClickClose }
                  },
                  [_vm._v("Cancel")]
                )
              ])
            ])
          ])
        ]
      )
    };
    var __vue_staticRenderFns__$b = [];
    __vue_render__$b._withStripped = true;

      /* style */
      const __vue_inject_styles__$b = undefined;
      /* scoped */
      const __vue_scope_id__$b = undefined;
      /* module identifier */
      const __vue_module_identifier__$b = undefined;
      /* functional template */
      const __vue_is_functional_template__$b = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var SensorListModalVue = normalizeComponent_1(
        { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
        __vue_inject_styles__$b,
        __vue_script__$b,
        __vue_scope_id__$b,
        __vue_is_functional_template__$b,
        __vue_module_identifier__$b,
        undefined,
        undefined
      );

    //

    var script$a = {
        props: {
            label: {type: String, default: ''},
            channels: {type: Array, default: []},
            disabled: {type: Boolean, default: false},
            isSubmodal: {type: Boolean, default: false}
        },
        components: {
            'sensor-list-modal': SensorListModalVue
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid
            };
        },
        methods: {
            onClickSensorListModal: function (channel) {
                const me = this;

                me.$refs.sensorListModal[0].show(channel);
            },
            onSelectSensor: function (sensor, channel) {
                if (channel) {
                    channel.sensor = new Sensor(sensor);
                }
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
    const __vue_script__$a = script$a;

    /* template */
    var __vue_render__$a = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("fieldset", [
        _c("legend", { staticClass: "w-auto h4 text-truncate" }, [
          _vm._v(_vm._s(_vm.label))
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "row" },
          _vm._l(_vm.channels, function(channel, i) {
            return _c("div", { key: i, staticClass: "w-50 col-12 p-1" }, [
              _c("fieldset", { staticClass: "col-lg-12 p-2 border" }, [
                _c("legend", { staticClass: "w-auto h6" }, [
                  _vm._v(_vm._s(channel.name))
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "col-12 pb-3" }, [
                    _c("div", { staticClass: "custom-control custom-checkbox" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: channel.sensor.isUse,
                            expression: "channel.sensor.isUse"
                          }
                        ],
                        staticClass: "custom-control-input",
                        attrs: {
                          id: "check-use-sensor-" + channel.id,
                          type: "checkbox"
                        },
                        domProps: {
                          checked: Array.isArray(channel.sensor.isUse)
                            ? _vm._i(channel.sensor.isUse, null) > -1
                            : channel.sensor.isUse
                        },
                        on: {
                          change: function($event) {
                            var $$a = channel.sensor.isUse,
                              $$el = $event.target,
                              $$c = $$el.checked ? true : false;
                            if (Array.isArray($$a)) {
                              var $$v = null,
                                $$i = _vm._i($$a, $$v);
                              if ($$el.checked) {
                                $$i < 0 &&
                                  _vm.$set(
                                    channel.sensor,
                                    "isUse",
                                    $$a.concat([$$v])
                                  );
                              } else {
                                $$i > -1 &&
                                  _vm.$set(
                                    channel.sensor,
                                    "isUse",
                                    $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                                  );
                              }
                            } else {
                              _vm.$set(channel.sensor, "isUse", $$c);
                            }
                          }
                        }
                      }),
                      _vm._v(" "),
                      _c(
                        "label",
                        {
                          staticClass: "custom-control-label",
                          attrs: { for: "check-use-sensor-" + channel.id }
                        },
                        [_vm._v("Use")]
                      )
                    ])
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(0, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-6" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.trim",
                          value: channel.sensor.name,
                          expression: "channel.sensor.name",
                          modifiers: { trim: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "text" },
                      domProps: { value: channel.sensor.name },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            channel.sensor,
                            "name",
                            $event.target.value.trim()
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(1, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-6" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: channel.sensor.minVoltage,
                          expression: "channel.sensor.minVoltage",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: channel.sensor.minVoltage },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            channel.sensor,
                            "minVoltage",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(2, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-6" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: channel.sensor.maxVoltage,
                          expression: "channel.sensor.maxVoltage",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: channel.sensor.maxVoltage },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            channel.sensor,
                            "maxVoltage",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(3, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-6" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: channel.sensor.minValue,
                          expression: "channel.sensor.minValue",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: channel.sensor.minValue },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            channel.sensor,
                            "minValue",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(4, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-6" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: channel.sensor.maxValue,
                          expression: "channel.sensor.maxValue",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: channel.sensor.maxValue },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            channel.sensor,
                            "maxValue",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "row mt-3 px-3" },
                  [
                    _c("sensor-list-modal", {
                      ref: "sensorListModal",
                      refInFor: true,
                      attrs: { "is-submodal": _vm.isSubmodal },
                      on: { itemselect: _vm.onSelectSensor }
                    }),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "col-12 btn btn-outline-primary text-truncate",
                        attrs: { disabled: _vm.disabled, type: "button" },
                        on: {
                          click: function($event) {
                            return _vm.onClickSensorListModal(channel)
                          }
                        }
                      },
                      [_c("span", [_vm._v("Sensor list")])]
                    )
                  ],
                  1
                )
              ])
            ])
          }),
          0
        )
      ])
    };
    var __vue_staticRenderFns__$a = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Sensor name")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Min Voltage(V)")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Max Voltage(V)")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Min Value")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Max Value")])]
        )
      }
    ];
    __vue_render__$a._withStripped = true;

      /* style */
      const __vue_inject_styles__$a = function (inject) {
        if (!inject) return
        inject("data-v-7854021c_0", { source: "\n@media (min-width: 992px) {\n.w-50[data-v-7854021c] {\n        flex: none;\n        width: 50%;\n}\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\device\\deviceAnalogChannelCard.vue"],"names":[],"mappings":";AAoIA;AACA;QACA,UAAA;QACA,UAAA;AACA;AACA","file":"deviceAnalogChannelCard.vue","sourcesContent":["<template>\r\n    <fieldset>\r\n        <legend class=\"w-auto h4 text-truncate\">{{label}}</legend>\r\n\r\n        <div class=\"row\">\r\n            <!-- channel 반복 -->\r\n            <div v-for=\"(channel, i) in channels\" :key=\"i\" class=\"w-50 col-12 p-1\">\r\n                <fieldset class=\"col-lg-12 p-2 border\">\r\n                    <legend class=\"w-auto h6\">{{ channel.name }}</legend>\r\n\r\n                    <div class=\"row\">\r\n                        <div class=\"col-12 pb-3\">\r\n                            <div class=\"custom-control custom-checkbox\">\r\n                                <input\r\n                                    v-model=\"channel.sensor.isUse\"\r\n                                    :id=\"'check-use-sensor-' + channel.id\"\r\n                                    type=\"checkbox\"\r\n                                    class=\"custom-control-input\">\r\n\r\n                                <label :for=\"'check-use-sensor-' + channel.id\" class=\"custom-control-label\">Use</label>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Sensor name</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <input v-model.trim=\"channel.sensor.name\" :disabled=\"disabled\" type=\"text\" class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Min Voltage(V)</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <input v-model.number=\"channel.sensor.minVoltage\" :disabled=\"disabled\" type=\"number\" class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Max Voltage(V)</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <input v-model.number=\"channel.sensor.maxVoltage\" :disabled=\"disabled\" type=\"number\" class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Min Value</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <input v-model.number=\"channel.sensor.minValue\" :disabled=\"disabled\" type=\"number\" class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Max Value</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <input v-model.number=\"channel.sensor.maxValue\" :disabled=\"disabled\" type=\"number\" class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- 센서 목록 버튼 -->\r\n                    <div class=\"row mt-3 px-3\">\r\n                        <sensor-list-modal\r\n                            :is-submodal=\"isSubmodal\"\r\n                            @itemselect=\"onSelectSensor\"\r\n                            ref=\"sensorListModal\">\r\n                        </sensor-list-modal>\r\n\r\n                        <button\r\n                            :disabled=\"disabled\"\r\n                            @click=\"onClickSensorListModal(channel)\"\r\n                            type=\"button\"\r\n                            class=\"col-12 btn btn-outline-primary text-truncate\">\r\n\r\n                            <span>Sensor list</span>\r\n                        </button>\r\n                    </div>\r\n                    <!-- END-센서 목록 버튼 작동여부 -->\r\n                </fieldset>\r\n            </div>\r\n            <!-- END-channel 반복 -->\r\n        </div>\r\n    </fieldset>\r\n</template>\r\n\r\n<script>\r\n    import Sensor from '../../device/sensor';\r\n\r\n    import SensorListModalVue from './sensorListModal.vue';\r\n\r\n    export default {\r\n        props: {\r\n            label: {type: String, default: ''},\r\n            channels: {type: Array, default: []},\r\n            disabled: {type: Boolean, default: false},\r\n            isSubmodal: {type: Boolean, default: false}\r\n        },\r\n        components: {\r\n            'sensor-list-modal': SensorListModalVue\r\n        },\r\n        data: function () {\r\n            const me = this;\r\n\r\n            return {\r\n                uid: me._uid\r\n            };\r\n        },\r\n        methods: {\r\n            onClickSensorListModal: function (channel) {\r\n                const me = this;\r\n\r\n                me.$refs.sensorListModal[0].show(channel);\r\n            },\r\n            onSelectSensor: function (sensor, channel) {\r\n                if (channel) {\r\n                    channel.sensor = new Sensor(sensor);\r\n                }\r\n            }\r\n        }\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    @media (min-width: 992px) {\r\n        .w-50 {\r\n            flex: none;\r\n            width: 50%;\r\n        }\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$a = "data-v-7854021c";
      /* module identifier */
      const __vue_module_identifier__$a = undefined;
      /* functional template */
      const __vue_is_functional_template__$a = false;
      /* style inject SSR */
      

      
      var DeviceAnalogChannelCardVue = normalizeComponent_1(
        { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
        __vue_inject_styles__$a,
        __vue_script__$a,
        __vue_scope_id__$a,
        __vue_is_functional_template__$a,
        __vue_module_identifier__$a,
        browser,
        undefined
      );

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    var script$9 = {
        props: {
            label: {type: String, default: ''},
            channels: {type: Array, default: []},
            disabled: {type: Boolean, default: false},
            isSubmodal: {type: Boolean, default: false}
        }
    };

    /* script */
    const __vue_script__$9 = script$9;

    /* template */
    var __vue_render__$9 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("fieldset", [
        _c("legend", { staticClass: "w-auto h4 text-truncate" }, [
          _vm._v(_vm._s(_vm.label))
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "row" },
          _vm._l(_vm.channels, function(channel, i) {
            return _c("div", { key: i, staticClass: "w-50 col-12 p-1" }, [
              _c("fieldset", { staticClass: "col-lg-12 p-2 border" }, [
                _c("legend", { staticClass: "w-auto h6" }, [
                  _vm._v(_vm._s(channel.name))
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "col-12 pb-3" }, [
                    _c("div", { staticClass: "custom-control custom-checkbox" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: channel.sensor.isUse,
                            expression: "channel.sensor.isUse"
                          }
                        ],
                        staticClass: "custom-control-input",
                        attrs: {
                          id: "check-use-sensor-" + channel.id,
                          type: "checkbox"
                        },
                        domProps: {
                          checked: Array.isArray(channel.sensor.isUse)
                            ? _vm._i(channel.sensor.isUse, null) > -1
                            : channel.sensor.isUse
                        },
                        on: {
                          change: function($event) {
                            var $$a = channel.sensor.isUse,
                              $$el = $event.target,
                              $$c = $$el.checked ? true : false;
                            if (Array.isArray($$a)) {
                              var $$v = null,
                                $$i = _vm._i($$a, $$v);
                              if ($$el.checked) {
                                $$i < 0 &&
                                  _vm.$set(
                                    channel.sensor,
                                    "isUse",
                                    $$a.concat([$$v])
                                  );
                              } else {
                                $$i > -1 &&
                                  _vm.$set(
                                    channel.sensor,
                                    "isUse",
                                    $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                                  );
                              }
                            } else {
                              _vm.$set(channel.sensor, "isUse", $$c);
                            }
                          }
                        }
                      }),
                      _vm._v(" "),
                      _c(
                        "label",
                        {
                          staticClass: "custom-control-label",
                          attrs: { for: "check-use-sensor-" + channel.id }
                        },
                        [_vm._v("Use")]
                      )
                    ])
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(0, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-6" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.trim",
                          value: channel.sensor.name,
                          expression: "channel.sensor.name",
                          modifiers: { trim: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "text" },
                      domProps: { value: channel.sensor.name },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            channel.sensor,
                            "name",
                            $event.target.value.trim()
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _vm._m(1, true),
                _vm._v(" "),
                _vm._m(2, true),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(3, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-6" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: channel.sensor.minValue,
                          expression: "channel.sensor.minValue",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: channel.sensor.minValue },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            channel.sensor,
                            "minValue",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(4, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-6" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: channel.sensor.maxValue,
                          expression: "channel.sensor.maxValue",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: channel.sensor.maxValue },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            channel.sensor,
                            "maxValue",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _vm._m(5, true)
              ])
            ])
          }),
          0
        )
      ])
    };
    var __vue_staticRenderFns__$9 = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Sensor name")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "row d-none d-md-block" }, [
          _c("div", { staticClass: "col-12" }, [
            _c("label", { staticClass: "h6 col-form-label" }, [_vm._v(" ")])
          ])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "row d-none d-md-block" }, [
          _c("div", { staticClass: "col-12" }, [
            _c("label", { staticClass: "h6 col-form-label" }, [_vm._v(" ")])
          ])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Min Value")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Max Value")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "row mt-3 px-3" }, [
          _c(
            "button",
            {
              staticClass: "col-12 btn btn-light border-white bg-white",
              attrs: { type: "button", disabled: "" }
            },
            [_vm._v("-")]
          )
        ])
      }
    ];
    __vue_render__$9._withStripped = true;

      /* style */
      const __vue_inject_styles__$9 = function (inject) {
        if (!inject) return
        inject("data-v-6404c706_0", { source: "\n@media (min-width: 992px) {\n.w-50[data-v-6404c706] {\n        flex: none;\n        width: 50%;\n}\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\device\\deviceDigitalChannelCard.vue"],"names":[],"mappings":";AAuFA;AACA;QACA,UAAA;QACA,UAAA;AACA;AACA","file":"deviceDigitalChannelCard.vue","sourcesContent":["<template>\r\n    <fieldset>\r\n        <legend class=\"w-auto h4 text-truncate\">{{label}}</legend>\r\n\r\n        <div class=\"row\">\r\n            <!-- channel 반복 -->\r\n            <div v-for=\"(channel, i) in channels\" :key=\"i\" class=\"w-50 col-12 p-1\">\r\n                <fieldset class=\"col-lg-12 p-2 border\">\r\n                    <legend class=\"w-auto h6\">{{ channel.name }}</legend>\r\n\r\n                    <div class=\"row\">\r\n                        <div class=\"col-12 pb-3\">\r\n                            <div class=\"custom-control custom-checkbox\">\r\n                                <input\r\n                                    v-model=\"channel.sensor.isUse\"\r\n                                    :id=\"'check-use-sensor-' + channel.id\"\r\n                                    type=\"checkbox\"\r\n                                    class=\"custom-control-input\">\r\n\r\n                                <label :for=\"'check-use-sensor-' + channel.id\" class=\"custom-control-label\">Use</label>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Sensor name</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <input v-model.trim=\"channel.sensor.name\" :disabled=\"disabled\" type=\"text\" class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- 공백 -->\r\n                    <div class=\"row d-none d-md-block\">\r\n                        <div class=\"col-12\">\r\n                            <label class=\"h6 col-form-label\">&nbsp;</label>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row d-none d-md-block\">\r\n                        <div class=\"col-12\">\r\n                            <label class=\"h6 col-form-label\">&nbsp;</label>\r\n                        </div>\r\n                    </div>\r\n                    <!-- END-공백 -->\r\n\r\n                    <div class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Min Value</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <input v-model.number=\"channel.sensor.minValue\" :disabled=\"disabled\" type=\"number\" class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Max Value</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <input v-model.number=\"channel.sensor.maxValue\" :disabled=\"disabled\" type=\"number\" class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row mt-3 px-3\">\r\n                        <button type=\"button\" class=\"col-12 btn btn-light border-white bg-white\" disabled>-</button>\r\n                    </div>\r\n                </fieldset>\r\n            </div>\r\n            <!-- END-channel 반복 -->\r\n        </div>\r\n    </fieldset>\r\n</template>\r\n\r\n<script>\r\n    export default {\r\n        props: {\r\n            label: {type: String, default: ''},\r\n            channels: {type: Array, default: []},\r\n            disabled: {type: Boolean, default: false},\r\n            isSubmodal: {type: Boolean, default: false}\r\n        }\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    @media (min-width: 992px) {\r\n        .w-50 {\r\n            flex: none;\r\n            width: 50%;\r\n        }\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$9 = "data-v-6404c706";
      /* module identifier */
      const __vue_module_identifier__$9 = undefined;
      /* functional template */
      const __vue_is_functional_template__$9 = false;
      /* style inject SSR */
      

      
      var DeviceDigitalChannelCardVue = normalizeComponent_1(
        { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
        __vue_inject_styles__$9,
        __vue_script__$9,
        __vue_scope_id__$9,
        __vue_is_functional_template__$9,
        __vue_module_identifier__$9,
        browser,
        undefined
      );

    class SendRow {
        constructor (obj = {}) {
            this.type = obj.type || 'ASCII';
            this.value = obj.value || '';
        }
    }

    class RecevieRow {
        constructor (obj = {}) {
            this.name = obj.name || '';
            this.type = obj.type || 'ASCII';
            this.start = (typeof obj.start == 'number') ? obj.start : 0;
            this.length = (typeof obj.length == 'number') ? obj.length : 1;
        }
    }

    class Protocol {
        constructor (obj = {}) {
            this.send = new SendRow(obj.send || {});

            const tempArr = Array.isArray(obj.recevieArray) ? obj.recevieArray : [];

            this.recevieName = obj.recevieName || '';

            this.recevieArray = tempArr.map(function (obj) {
                return (obj instanceof RecevieRow) ? obj : new RecevieRow(obj);
            });
        }

        add(obj) {
            const me = this;

            me.recevieArray.push(new RecevieRow(obj));
        }

        delete(index) {
            const me = this;

            if (me.recevieArray.length > index) {
                me.recevieArray.splice(index, 1);
            }
        }

        swapPosition(currentIndex, targetIndex) {
            const me = this;

            const arr = me.recevieArray.splice(currentIndex, 1);

            if (arr.length) {
                const item = arr[0];

                me.recevieArray.splice(targetIndex, 0, item);
            }
        }

        setArray(dataArray) {
            const me = this;

            me.recevieArray.splice(0);

            for (let i = 0; i < dataArray.length; i++) {
                me.add(dataArray[i]);
            }
        }
    }

    class ProtocolGroup {
        constructor (obj = {}) {
            this.isOneWay = (typeof obj.isOneWay == 'boolean') ? obj.isOneWay : true;

            const tempArr = Array.isArray(obj.array) ? obj.array : [];

            this.array = tempArr.map(function (obj) {
                return (obj instanceof Protocol) ? obj : new Protocol(obj);
            });
        }

        add(protocolObj) {
            const me = this;

            me.array.push(new Protocol(protocolObj));
        }

        delete(index) {
            const me = this;

            if (me.array.length > index) {
                me.array.splice(index, 1);
            }
        }
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    /**
     * Template event : confirm
     */
    var script$8 = {
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
    };

    /* script */
    const __vue_script__$8 = script$8;

    /* template */
    var __vue_render__$8 = function() {
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
          _c("div", { staticClass: "modal-dialog" }, [
            _c("div", { staticClass: "modal-content" }, [
              _c("div", { staticClass: "modal-body" }, [_vm._t("message")], 2),
              _vm._v(" "),
              _c("div", { staticClass: "modal-footer bg-warning" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-primary",
                    attrs: { type: "button" },
                    on: { click: _vm.onClickOk }
                  },
                  [_vm._v("OK")]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "btn btn-secondary",
                    attrs: { type: "button" },
                    on: { click: _vm.onClickClose }
                  },
                  [_vm._v("Cancel")]
                )
              ])
            ])
          ])
        ]
      )
    };
    var __vue_staticRenderFns__$8 = [];
    __vue_render__$8._withStripped = true;

      /* style */
      const __vue_inject_styles__$8 = undefined;
      /* scoped */
      const __vue_scope_id__$8 = undefined;
      /* module identifier */
      const __vue_module_identifier__$8 = undefined;
      /* functional template */
      const __vue_is_functional_template__$8 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var ConfirmModalVue = normalizeComponent_1(
        { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
        __vue_inject_styles__$8,
        __vue_script__$8,
        __vue_scope_id__$8,
        __vue_is_functional_template__$8,
        __vue_module_identifier__$8,
        undefined,
        undefined
      );

    //

    var script$7 = {
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
    };

    /* script */
    const __vue_script__$7 = script$7;

    /* template */
    var __vue_render__$7 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        { staticClass: "card" },
        [
          _c(
            "confirm-modal",
            {
              ref: "deleteModal",
              attrs: { "is-submodal": true },
              on: { confirm: _vm.onConfirmDelete }
            },
            [
              _c(
                "div",
                {
                  staticClass: "h4 my-5 text-center",
                  attrs: { slot: "message" },
                  slot: "message"
                },
                [_c("span", [_vm._v("Delete this item?")])]
              )
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "card-body" }, [
            _vm.type != "bluetooth"
              ? _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "col-lg-2 h4" }, [_vm._v("Send")]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-10" }, [
                    _c("div", { staticClass: "row" }, [
                      _c("div", { staticClass: "col-lg-2" }, [
                        _c(
                          "select",
                          {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model.trim",
                                value: _vm.protocol.send.type,
                                expression: "protocol.send.type",
                                modifiers: { trim: true }
                              }
                            ],
                            staticClass: "form-control form-control-sm",
                            attrs: { disabled: _vm.disabled, type: "text" },
                            on: {
                              change: function($event) {
                                var $$selectedVal = Array.prototype.filter
                                  .call($event.target.options, function(o) {
                                    return o.selected
                                  })
                                  .map(function(o) {
                                    var val = "_value" in o ? o._value : o.value;
                                    return val
                                  });
                                _vm.$set(
                                  _vm.protocol.send,
                                  "type",
                                  $event.target.multiple
                                    ? $$selectedVal
                                    : $$selectedVal[0]
                                );
                              }
                            }
                          },
                          [
                            _c("option", { attrs: { value: "ASCII" } }, [
                              _vm._v("ASCII")
                            ]),
                            _vm._v(" "),
                            _c("option", { attrs: { value: "HEX" } }, [
                              _vm._v("HEX")
                            ])
                          ]
                        )
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-lg-10 mt-1 mt-lg-0" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model.trim",
                              value: _vm.protocol.send.value,
                              expression: "protocol.send.value",
                              modifiers: { trim: true }
                            }
                          ],
                          staticClass: "form-control form-control-sm",
                          attrs: { disabled: _vm.disabled, type: "text" },
                          domProps: { value: _vm.protocol.send.value },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.protocol.send,
                                "value",
                                $event.target.value.trim()
                              );
                            },
                            blur: function($event) {
                              return _vm.$forceUpdate()
                            }
                          }
                        })
                      ])
                    ])
                  ])
                ])
              : _vm._e(),
            _vm._v(" "),
            _vm.type == "bluetooth"
              ? _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "col-lg-3 h4" }, [
                    _vm._v("Bluetooth Name")
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-9" }, [
                    _c("div", { staticClass: "row" }, [
                      _c("div", { staticClass: "col-lg-12 mt-1 mt-lg-0" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.protocol.recevieName,
                              expression: "protocol.recevieName"
                            }
                          ],
                          staticClass: "form-control form-control-sm",
                          attrs: { disabled: _vm.disabled, type: "text" },
                          domProps: { value: _vm.protocol.recevieName },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.protocol,
                                "recevieName",
                                $event.target.value
                              );
                            }
                          }
                        })
                      ])
                    ])
                  ])
                ])
              : _vm._e(),
            _vm._v(" "),
            _c("div", { staticClass: "row my-3 border-top" }),
            _vm._v(" "),
            _c("div", { staticClass: "row mt-3" }, [
              _c("div", { staticClass: "col-lg-4" }, [
                _vm._m(0),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(1),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.trim",
                          value: _vm.newRecevieRow.name,
                          expression: "newRecevieRow.name",
                          modifiers: { trim: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "text" },
                      domProps: { value: _vm.newRecevieRow.name },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.newRecevieRow,
                            "name",
                            $event.target.value.trim()
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(2),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model.trim",
                            value: _vm.newRecevieRow.type,
                            expression: "newRecevieRow.type",
                            modifiers: { trim: true }
                          }
                        ],
                        staticClass: "form-control form-control-sm",
                        attrs: { disabled: _vm.disabled, type: "text" },
                        on: {
                          change: function($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function(o) {
                                return o.selected
                              })
                              .map(function(o) {
                                var val = "_value" in o ? o._value : o.value;
                                return val
                              });
                            _vm.$set(
                              _vm.newRecevieRow,
                              "type",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            );
                          }
                        }
                      },
                      [
                        _c("option", { attrs: { value: "ASCII" } }, [
                          _vm._v("ASCII")
                        ]),
                        _vm._v(" "),
                        _c("option", { attrs: { value: "HEX" } }, [_vm._v("HEX")]),
                        _vm._v(" "),
                        _c("option", { attrs: { value: "DEC" } }, [_vm._v("DEC")]),
                        _vm._v(" "),
                        _c("option", { attrs: { value: "IEEE754" } }, [
                          _vm._v("IEEE754")
                        ])
                      ]
                    )
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(3),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: _vm.newRecevieRow.start,
                          expression: "newRecevieRow.start",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: _vm.newRecevieRow.start },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.newRecevieRow,
                            "start",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(4),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: _vm.newRecevieRow.length,
                          expression: "newRecevieRow.length",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: _vm.newRecevieRow.length },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.newRecevieRow,
                            "length",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row mt-3" }, [
                  _c("div", { staticClass: "col-12" }, [
                    _c(
                      "button",
                      {
                        staticClass: "w-100 btn btn-primary",
                        attrs: { disabled: _vm.disabled, type: "button" },
                        on: { click: _vm.onClickAdd }
                      },
                      [_c("span", [_vm._v("Add")])]
                    )
                  ])
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-8 mt-3 mt-lg-0" }, [
                _c("div", { staticClass: "row pl-lg-3" }, [
                  _c(
                    "div",
                    { staticClass: "protocol-scroll-h col-12 card overflow-auto" },
                    [
                      _c("div", { staticClass: "card-body px-0 py-1" }, [
                        _c("table", { staticClass: "table table-sm text-center" }, [
                          _vm._m(5),
                          _vm._v(" "),
                          _c(
                            "tbody",
                            _vm._l(_vm.rowArr, function(row, i) {
                              return _c("tr", { key: i }, [
                                _c(
                                  "td",
                                  { staticClass: "px-1 py-0 align-middle" },
                                  [
                                    _c(
                                      "button",
                                      {
                                        staticClass: "my-1 btn btn-primary",
                                        attrs: {
                                          disabled: _vm.disabled,
                                          type: "button"
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.onClickUp(i)
                                          }
                                        }
                                      },
                                      [_c("span", [_vm._v("↑")])]
                                    ),
                                    _vm._v(" "),
                                    _c(
                                      "button",
                                      {
                                        staticClass: "my-1 btn btn-primary",
                                        attrs: {
                                          disabled: _vm.disabled,
                                          type: "button"
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.onClickDown(i)
                                          }
                                        }
                                      },
                                      [_c("span", [_vm._v("↓")])]
                                    )
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "td",
                                  { staticClass: "px-1 py-0 align-middle" },
                                  [
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model.trim",
                                          value: row.name,
                                          expression: "row.name",
                                          modifiers: { trim: true }
                                        }
                                      ],
                                      staticClass:
                                        "w-100 form-control form-control-sm",
                                      attrs: {
                                        disabled: _vm.disabled,
                                        type: "text"
                                      },
                                      domProps: { value: row.name },
                                      on: {
                                        input: function($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            row,
                                            "name",
                                            $event.target.value.trim()
                                          );
                                        },
                                        blur: function($event) {
                                          return _vm.$forceUpdate()
                                        }
                                      }
                                    })
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "td",
                                  { staticClass: "px-1 py-0 align-middle" },
                                  [
                                    _c(
                                      "select",
                                      {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model.trim",
                                            value: row.type,
                                            expression: "row.type",
                                            modifiers: { trim: true }
                                          }
                                        ],
                                        staticClass:
                                          "w-100 form-control form-control-sm",
                                        attrs: {
                                          disabled: _vm.disabled,
                                          type: "text"
                                        },
                                        on: {
                                          change: function($event) {
                                            var $$selectedVal = Array.prototype.filter
                                              .call($event.target.options, function(
                                                o
                                              ) {
                                                return o.selected
                                              })
                                              .map(function(o) {
                                                var val =
                                                  "_value" in o ? o._value : o.value;
                                                return val
                                              });
                                            _vm.$set(
                                              row,
                                              "type",
                                              $event.target.multiple
                                                ? $$selectedVal
                                                : $$selectedVal[0]
                                            );
                                          }
                                        }
                                      },
                                      [
                                        _c(
                                          "option",
                                          { attrs: { value: "ASCII" } },
                                          [_vm._v("ASCII")]
                                        ),
                                        _vm._v(" "),
                                        _c("option", { attrs: { value: "HEX" } }, [
                                          _vm._v("HEX")
                                        ]),
                                        _vm._v(" "),
                                        _c("option", { attrs: { value: "DEC" } }, [
                                          _vm._v("DEC")
                                        ]),
                                        _vm._v(" "),
                                        _c(
                                          "option",
                                          { attrs: { value: "IEEE754" } },
                                          [_vm._v("IEEE754")]
                                        )
                                      ]
                                    )
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "td",
                                  { staticClass: "px-1 py-0 align-middle" },
                                  [
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model.number",
                                          value: row.start,
                                          expression: "row.start",
                                          modifiers: { number: true }
                                        }
                                      ],
                                      staticClass:
                                        "w-100 form-control form-control-sm",
                                      attrs: {
                                        disabled: _vm.disabled,
                                        type: "number"
                                      },
                                      domProps: { value: row.start },
                                      on: {
                                        input: function($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            row,
                                            "start",
                                            _vm._n($event.target.value)
                                          );
                                        },
                                        blur: function($event) {
                                          return _vm.$forceUpdate()
                                        }
                                      }
                                    })
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "td",
                                  { staticClass: "px-1 py-0 align-middle" },
                                  [
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model.number",
                                          value: row.length,
                                          expression: "row.length",
                                          modifiers: { number: true }
                                        }
                                      ],
                                      staticClass:
                                        "w-100 form-control form-control-sm",
                                      attrs: {
                                        disabled: _vm.disabled,
                                        type: "number"
                                      },
                                      domProps: { value: row.length },
                                      on: {
                                        input: function($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            row,
                                            "length",
                                            _vm._n($event.target.value)
                                          );
                                        },
                                        blur: function($event) {
                                          return _vm.$forceUpdate()
                                        }
                                      }
                                    })
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "td",
                                  { staticClass: "px-1 py-0 align-middle" },
                                  [
                                    _c(
                                      "button",
                                      {
                                        staticClass: "btn btn-danger",
                                        attrs: {
                                          disabled: _vm.disabled,
                                          type: "button"
                                        },
                                        on: {
                                          click: function($event) {
                                            return _vm.onClickDelete(i)
                                          }
                                        }
                                      },
                                      [_c("span", [_vm._v("−")])]
                                    )
                                  ]
                                )
                              ])
                            }),
                            0
                          )
                        ])
                      ])
                    ]
                  )
                ])
              ])
            ])
          ])
        ],
        1
      )
    };
    var __vue_staticRenderFns__$7 = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 h4" }, [_vm._v("Recevie")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "col-lg-4" }, [
          _c("label", { staticClass: "col-form-label" }, [
            _c("span", [_vm._v("Name")])
          ])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "col-lg-4" }, [
          _c("label", { staticClass: "col-form-label" }, [
            _c("span", [_vm._v("Type")])
          ])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "col-lg-4" }, [
          _c("label", { staticClass: "col-form-label" }, [
            _c("span", [_vm._v("Start")])
          ])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "col-lg-4" }, [
          _c("label", { staticClass: "col-form-label" }, [
            _c("span", [_vm._v("Length")])
          ])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("thead", [
          _c("tr", [
            _c("th", { staticClass: "col-3" }),
            _vm._v(" "),
            _c("th", { staticClass: "col-2" }, [_vm._v("Name")]),
            _vm._v(" "),
            _c("th", { staticClass: "col-2" }, [_vm._v("Type")]),
            _vm._v(" "),
            _c("th", { staticClass: "col-2" }, [_vm._v("Start")]),
            _vm._v(" "),
            _c("th", { staticClass: "col-2" }, [_vm._v("Length")]),
            _vm._v(" "),
            _c("th", { staticClass: "col-1" })
          ])
        ])
      }
    ];
    __vue_render__$7._withStripped = true;

      /* style */
      const __vue_inject_styles__$7 = function (inject) {
        if (!inject) return
        inject("data-v-2a7b938f_0", { source: "\n.protocol-scroll-h[data-v-2a7b938f] {\n    height: 250px;\n    background-color: #dee2e6;\n}\n.protocol-scroll-h table[data-v-2a7b938f] {\n    min-width: 500px;\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\protocol\\protocolCard.vue"],"names":[],"mappings":";AAyUA;IACA,aAAA;IACA,yBAAA;AACA;AAEA;IACA,gBAAA;AACA","file":"protocolCard.vue","sourcesContent":["<template>\r\n    <div class=\"card\">\r\n        <!-- 제거 모달 -->\r\n        <confirm-modal :is-submodal=\"true\" @confirm=\"onConfirmDelete\" ref=\"deleteModal\">\r\n            <div slot=\"message\" class=\"h4 my-5 text-center\">\r\n                <span>Delete this item?</span>\r\n            </div>\r\n        </confirm-modal>\r\n        <!-- END-제거 모달 -->\r\n\r\n        <div class=\"card-body\">\r\n            <!-- Send protocol -->\r\n            <div v-if=\"type != 'bluetooth'\" class=\"row\">\r\n                <div class=\"col-lg-2 h4\">Send</div>\r\n\r\n                <div class=\"col-lg-10\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-2\">\r\n                            <select\r\n                                v-model.trim=\"protocol.send.type\"\r\n                                :disabled=\"disabled\"\r\n                                type=\"text\"\r\n                                class=\"form-control form-control-sm\">\r\n\r\n                                <option value=\"ASCII\">ASCII</option>\r\n                                <option value=\"HEX\">HEX</option>\r\n                            </select>\r\n                        </div>\r\n\r\n                        <div class=\"col-lg-10 mt-1 mt-lg-0\">\r\n                            <input\r\n                                v-model.trim=\"protocol.send.value\"\r\n                                :disabled=\"disabled\"\r\n                                type=\"text\"\r\n                                class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!-- END-Send protocol -->\r\n\r\n            <!-- Bluetooth protocol name -->\r\n            <div v-if=\"type == 'bluetooth'\" class=\"row\">\r\n                <div class=\"col-lg-3 h4\">Bluetooth Name</div>\r\n\r\n                <div class=\"col-lg-9\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-12 mt-1 mt-lg-0\">\r\n                            <input\r\n                                v-model=\"protocol.recevieName\"\r\n                                :disabled=\"disabled\"\r\n                                type=\"text\"\r\n                                class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!-- END-Send protocol -->\r\n\r\n            <div class=\"row my-3 border-top\"></div>\r\n\r\n            <!-- Recevie protocol -->\r\n            <div class=\"row mt-3\">\r\n                <!-- 항목 추가 -->\r\n                <div class=\"col-lg-4\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-12 h4\">Recevie</div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-4\">\r\n                            <label class=\"col-form-label\">\r\n                                <span>Name</span>\r\n                            </label>\r\n                        </div>\r\n\r\n                        <div class=\"col-lg-8\">\r\n                            <input\r\n                                v-model.trim=\"newRecevieRow.name\"\r\n                                :disabled=\"disabled\"\r\n                                type=\"text\"\r\n                                class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-4\">\r\n                            <label class=\"col-form-label\">\r\n                                <span>Type</span>\r\n                            </label>\r\n                        </div>\r\n\r\n                        <div class=\"col-lg-8\">\r\n                            <select\r\n                                v-model.trim=\"newRecevieRow.type\"\r\n                                :disabled=\"disabled\"\r\n                                type=\"text\"\r\n                                class=\"form-control form-control-sm\">\r\n\r\n                                <option value=\"ASCII\">ASCII</option>\r\n                                <option value=\"HEX\">HEX</option>\r\n                                <option value=\"DEC\">DEC</option>\r\n                                <option value=\"IEEE754\">IEEE754</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-4\">\r\n                            <label class=\"col-form-label\">\r\n                                <span>Start</span>\r\n                            </label>\r\n                        </div>\r\n\r\n                        <div class=\"col-lg-8\">\r\n                            <input\r\n                                v-model.number=\"newRecevieRow.start\"\r\n                                :disabled=\"disabled\"\r\n                                type=\"number\"\r\n                                class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <div class=\"col-lg-4\">\r\n                            <label class=\"col-form-label\">\r\n                                <span>Length</span>\r\n                            </label>\r\n                        </div>\r\n\r\n                        <div class=\"col-lg-8\">\r\n                            <input\r\n                                v-model.number=\"newRecevieRow.length\"\r\n                                :disabled=\"disabled\"\r\n                                type=\"number\"\r\n                                class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row mt-3\">\r\n                        <div class=\"col-12\">\r\n                            <button\r\n                                @click=\"onClickAdd\"\r\n                                :disabled=\"disabled\"\r\n                                type=\"button\"\r\n                                class=\"w-100 btn btn-primary\">\r\n\r\n                                <span>Add</span>\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <!-- END-항목 추가 -->\r\n\r\n                <!-- 컬럼 목록 -->\r\n                <div class=\"col-lg-8 mt-3 mt-lg-0\">\r\n                    <div class=\"row pl-lg-3\">\r\n                        <div class=\"protocol-scroll-h col-12 card overflow-auto\">\r\n                            <div class=\"card-body px-0 py-1\">\r\n                                <table class=\"table table-sm text-center\">\r\n                                    <thead>\r\n                                        <tr>\r\n                                            <th class=\"col-3\"></th>\r\n                                            <th class=\"col-2\">Name</th>\r\n                                            <th class=\"col-2\">Type</th>\r\n                                            <th class=\"col-2\">Start</th>\r\n                                            <th class=\"col-2\">Length</th>\r\n                                            <th class=\"col-1\"></th>\r\n                                        </tr>\r\n                                    </thead>\r\n\r\n                                    <tbody>\r\n                                        <tr v-for=\"(row, i) in rowArr\" :key=\"i\">\r\n                                            <td class=\"px-1 py-0 align-middle\">\r\n                                                <button\r\n                                                    @click=\"onClickUp(i)\"\r\n                                                    :disabled=\"disabled\"\r\n                                                    type=\"button\"\r\n                                                    class=\"my-1 btn btn-primary\">\r\n\r\n                                                    <span>&#8593;</span>\r\n                                                </button>\r\n\r\n                                                <button\r\n                                                    @click=\"onClickDown(i)\"\r\n                                                    :disabled=\"disabled\"\r\n                                                    type=\"button\"\r\n                                                    class=\"my-1 btn btn-primary\">\r\n                                                \r\n                                                    <span>&#8595;</span>\r\n                                                </button>\r\n                                            </td>\r\n\r\n                                            <td class=\"px-1 py-0 align-middle\">\r\n                                                <input\r\n                                                    v-model.trim=\"row.name\"\r\n                                                    :disabled=\"disabled\"\r\n                                                    type=\"text\"\r\n                                                    class=\"w-100 form-control form-control-sm\">\r\n                                            </td>\r\n\r\n                                            <td class=\"px-1 py-0 align-middle\">\r\n                                                <select\r\n                                                    v-model.trim=\"row.type\"\r\n                                                    :disabled=\"disabled\"\r\n                                                    type=\"text\"\r\n                                                    class=\"w-100 form-control form-control-sm\">\r\n\r\n                                                    <option value=\"ASCII\">ASCII</option>\r\n                                                    <option value=\"HEX\">HEX</option>\r\n                                                    <option value=\"DEC\">DEC</option>\r\n                                                    <option value=\"IEEE754\">IEEE754</option>\r\n                                                </select>\r\n                                            </td>\r\n\r\n                                            <td class=\"px-1 py-0 align-middle\">\r\n                                                <input\r\n                                                    v-model.number=\"row.start\"\r\n                                                    :disabled=\"disabled\"\r\n                                                    type=\"number\"\r\n                                                    class=\"w-100 form-control form-control-sm\">\r\n                                            </td>\r\n\r\n                                            <td class=\"px-1 py-0 align-middle\">\r\n                                                <input\r\n                                                    v-model.number=\"row.length\"\r\n                                                    :disabled=\"disabled\"\r\n                                                    type=\"number\"\r\n                                                    class=\"w-100 form-control form-control-sm\">\r\n                                            </td>\r\n\r\n                                            <td class=\"px-1 py-0 align-middle\">\r\n                                                <button\r\n                                                    @click=\"onClickDelete(i)\"\r\n                                                    :disabled=\"disabled\"\r\n                                                    type=\"button\"\r\n                                                    class=\"btn btn-danger\">\r\n                                                    \r\n                                                    <span>&#8722;</span>\r\n                                                </button>\r\n                                            </td>\r\n                                        </tr>\r\n                                    </tbody>\r\n                                </table>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n                <!-- END-컬럼 목록 -->\r\n            </div>\r\n            <!-- END-Recevie protocol -->\r\n        </div>\r\n    </div>\r\n</template>\r\n\r\n<script>\r\n    import Protocol from '../../protocol/protocol';\r\n    import RecevieRow from '../../protocol/recevieRow';\r\n\r\n    import ConfirmModalVue from '../confirmModal.vue';\r\n\r\n    export default {\r\n        props: {\r\n            protocol: {type: Protocol, default: () => new Protocol()},\r\n            type: {type: String, default: ''},\r\n            disabled: {type: Boolean, default: false}\r\n        },\r\n        components: {\r\n            'confirm-modal': ConfirmModalVue\r\n        },\r\n        data: function () {\r\n            return {\r\n                newRecevieRow: new RecevieRow(),\r\n                rowArr: []\r\n            };\r\n        },\r\n        watch: {\r\n            protocol: function (protocol) {\r\n                const me = this;\r\n\r\n                me.rowArr = protocol.recevieArray;\r\n            }\r\n        },\r\n        mounted() {\r\n            const me = this;\r\n\r\n            me.rowArr = me.protocol.recevieArray;\r\n        },\r\n        methods: {\r\n            onClickAdd: function () {\r\n                const me = this;\r\n\r\n                me.protocol.add(me.newRecevieRow);\r\n\r\n                me.newRecevieRow = new RecevieRow();\r\n            },\r\n            onClickUp: function (i) {\r\n                const me = this;\r\n\r\n                if (0 <= i - 1) {\r\n                    me.protocol.swapPosition(i, i - 1);\r\n                }\r\n            },\r\n            onClickDown: function (i) {\r\n                const me = this;\r\n\r\n                if (i + 1 < me.protocol.recevieArray.length) {\r\n                    me.protocol.swapPosition(i, i + 1);\r\n                }\r\n            },\r\n            onClickDelete: function (i) {\r\n                const me = this;\r\n\r\n                me.$refs.deleteModal.show(i);\r\n            },\r\n            onConfirmDelete: function (bool, i) {\r\n                const me = this;\r\n\r\n                if (bool) {\r\n                    if (0 <= i && i < me.protocol.recevieArray.length) {\r\n                        me.protocol.delete(i);\r\n                    }\r\n                }\r\n            }\r\n        },\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    .protocol-scroll-h {\r\n        height: 250px;\r\n        background-color: #dee2e6;\r\n    }\r\n\r\n    .protocol-scroll-h table {\r\n        min-width: 500px;\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$7 = "data-v-2a7b938f";
      /* module identifier */
      const __vue_module_identifier__$7 = undefined;
      /* functional template */
      const __vue_is_functional_template__$7 = false;
      /* style inject SSR */
      

      
      var ProtocolCardVue = normalizeComponent_1(
        { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
        __vue_inject_styles__$7,
        __vue_script__$7,
        __vue_scope_id__$7,
        __vue_is_functional_template__$7,
        __vue_module_identifier__$7,
        browser,
        undefined
      );

    //

    var script$6 = {
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
    };

    /* script */
    const __vue_script__$6 = script$6;

    /* template */
    var __vue_render__$6 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c(
        "div",
        { staticClass: "card" },
        [
          _c(
            "confirm-modal",
            {
              ref: "deleteModal",
              attrs: { "is-submodal": true },
              on: { confirm: _vm.onConfirmDelete }
            },
            [
              _c(
                "div",
                {
                  staticClass: "h4 my-5 text-center",
                  attrs: { slot: "message" },
                  slot: "message"
                },
                [_c("span", [_vm._v("Delete this item?")])]
              )
            ]
          ),
          _vm._v(" "),
          _c("div", { staticClass: "card-body" }, [
            _c("div", { staticClass: "row" }, [
              _c("div", { staticClass: "col-lg-2 h4" }, [_vm._v("Protocol")]),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-5 mt-1 mt-lg-0" }, [
                _vm.type != "bluetooth"
                  ? _c("div", { staticClass: "row" }, [
                      _c("div", { staticClass: "col-12" }, [
                        _c(
                          "div",
                          { staticClass: "custom-control custom-checkbox" },
                          [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.protocolGroup.isOneWay,
                                  expression: "protocolGroup.isOneWay"
                                }
                              ],
                              staticClass: "custom-control-input",
                              attrs: {
                                disabled: _vm.disabled,
                                id: "check-one-way-protocol-" + _vm.uid,
                                type: "checkbox"
                              },
                              domProps: {
                                checked: Array.isArray(_vm.protocolGroup.isOneWay)
                                  ? _vm._i(_vm.protocolGroup.isOneWay, null) > -1
                                  : _vm.protocolGroup.isOneWay
                              },
                              on: {
                                change: function($event) {
                                  var $$a = _vm.protocolGroup.isOneWay,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false;
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v);
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        _vm.$set(
                                          _vm.protocolGroup,
                                          "isOneWay",
                                          $$a.concat([$$v])
                                        );
                                    } else {
                                      $$i > -1 &&
                                        _vm.$set(
                                          _vm.protocolGroup,
                                          "isOneWay",
                                          $$a
                                            .slice(0, $$i)
                                            .concat($$a.slice($$i + 1))
                                        );
                                    }
                                  } else {
                                    _vm.$set(_vm.protocolGroup, "isOneWay", $$c);
                                  }
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c(
                              "label",
                              {
                                staticClass: "custom-control-label h5",
                                attrs: { for: "check-one-way-protocol-" + _vm.uid }
                              },
                              [_vm._v("One-way Protocol")]
                            )
                          ]
                        )
                      ])
                    ])
                  : _vm._e()
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-5 mt-3 mt-lg-0" }, [
                _c(
                  "button",
                  {
                    staticClass: "w-100 btn btn-primary",
                    attrs: { disabled: _vm.disabled, type: "button" },
                    on: { click: _vm.onClickAdd }
                  },
                  [_c("span", [_vm._v("Add protocol")])]
                )
              ])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "row mt-3" }, [
              _c(
                "div",
                {
                  staticClass:
                    "protocol-group-scroll-h col-12 px-1 border rounded overflow-auto"
                },
                _vm._l(_vm.protocolGroup.array, function(protocol, i) {
                  return _c("div", { key: i, staticClass: "card my-1" }, [
                    _c("div", { staticClass: "card-header" }, [
                      _c("div", { staticClass: "row" }, [
                        _c("div", { staticClass: "col-6 h4" }, [
                          _c("span", [_vm._v("# " + _vm._s(i + 1))])
                        ]),
                        _vm._v(" "),
                        _c("div", { staticClass: "col-6 text-right" }, [
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-outline-danger",
                              attrs: { disabled: _vm.disabled, type: "button" },
                              on: {
                                click: function($event) {
                                  return _vm.onClickDelete(i)
                                }
                              }
                            },
                            [_c("span", [_vm._v("Delete")])]
                          )
                        ])
                      ])
                    ]),
                    _vm._v(" "),
                    _c(
                      "div",
                      { staticClass: "card-body" },
                      [
                        _c("protocol-card", {
                          ref: "card",
                          refInFor: true,
                          attrs: {
                            type: _vm.type,
                            protocol: protocol,
                            disabled: _vm.disabled
                          }
                        })
                      ],
                      1
                    )
                  ])
                }),
                0
              )
            ])
          ])
        ],
        1
      )
    };
    var __vue_staticRenderFns__$6 = [];
    __vue_render__$6._withStripped = true;

      /* style */
      const __vue_inject_styles__$6 = function (inject) {
        if (!inject) return
        inject("data-v-00cd54d2_0", { source: "\n.protocol-group-scroll-h[data-v-00cd54d2] {\n    height: 50vh;\n    background-color: #dee2e6;\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\protocol\\protocolGroupCard.vue"],"names":[],"mappings":";AAyIA;IACA,YAAA;IACA,yBAAA;AACA","file":"protocolGroupCard.vue","sourcesContent":["<template>\r\n    <div class=\"card\">\r\n        <!-- 제거 모달 -->\r\n        <confirm-modal :is-submodal=\"true\" @confirm=\"onConfirmDelete\" ref=\"deleteModal\">\r\n            <div slot=\"message\" class=\"h4 my-5 text-center\">\r\n                <span>Delete this item?</span>\r\n            </div>\r\n        </confirm-modal>\r\n        <!-- END-제거 모달 -->\r\n\r\n        <div class=\"card-body\">\r\n            <div class=\"row\">\r\n                <div class=\"col-lg-2 h4\">Protocol</div>\r\n\r\n                <div class=\"col-lg-5 mt-1 mt-lg-0\">\r\n                    <div v-if=\"type != 'bluetooth'\" class=\"row\">\r\n                        <div class=\"col-12\">\r\n                            <div class=\"custom-control custom-checkbox\">\r\n                                <input v-model=\"protocolGroup.isOneWay\" :disabled=\"disabled\" :id=\"'check-one-way-protocol-' + uid\" type=\"checkbox\" class=\"custom-control-input\">\r\n                                <label :for=\"'check-one-way-protocol-' + uid\" class=\"custom-control-label h5\">One-way Protocol</label>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n\r\n                <div class=\"col-lg-5 mt-3 mt-lg-0\">\r\n                    <button\r\n                        @click=\"onClickAdd\"\r\n                        :disabled=\"disabled\"\r\n                        type=\"button\"\r\n                        class=\"w-100 btn btn-primary\">\r\n\r\n                        <span>Add protocol</span>\r\n                    </button>\r\n                </div>\r\n            </div>\r\n\r\n            <!-- 프로토콜 목록 -->\r\n            <div class=\"row mt-3\">\r\n                <div class=\"protocol-group-scroll-h col-12 px-1 border rounded overflow-auto\">\r\n                    <!-- 목록 아이템 -->\r\n                    <div v-for=\"(protocol, i) in protocolGroup.array\" :key=\"i\" class=\"card my-1\">\r\n                        <div class=\"card-header\">\r\n                            <div class=\"row\">\r\n                                <div class=\"col-6 h4\">\r\n                                    <span># {{ i + 1 }}</span>\r\n                                </div>\r\n\r\n                                <div class=\"col-6 text-right\">\r\n                                    <button\r\n                                        @click=\"onClickDelete(i)\"\r\n                                        :disabled=\"disabled\"\r\n                                        type=\"button\"\r\n                                        class=\"btn btn-outline-danger\">\r\n\r\n                                        <span>Delete</span>\r\n                                    </button>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n\r\n                        <div class=\"card-body\">\r\n                            <protocol-card :type=\"type\" :protocol=\"protocol\" :disabled=\"disabled\" ref=\"card\"></protocol-card>\r\n                        </div>\r\n                    </div>\r\n                    <!-- END-목록 아이템 -->\r\n                </div>\r\n            </div>\r\n            <!-- END-프로토콜 목록 -->\r\n        </div>\r\n    </div>\r\n</template>\r\n\r\n<script>\r\n    import ProtocolGroup from '../../protocol/protocolGroup';\r\n    import Protocol from '../../protocol/protocol';\r\n\r\n    import ProtocolCardVue from './protocolCard.vue';\r\n    import ConfirmModalVue from '../confirmModal.vue';\r\n\r\n    export default {\r\n        props: {\r\n            type: {type: String, default: ''},\r\n            disabled: {type: Boolean, default: false}\r\n        },\r\n        components: {\r\n            'protocol-card': ProtocolCardVue,\r\n            'confirm-modal': ConfirmModalVue\r\n        },\r\n        data: function () {\r\n            const me = this;\r\n\r\n            return {\r\n                uid: me._uid,\r\n                protocolGroup: new ProtocolGroup()\r\n            };\r\n        },\r\n        methods: {\r\n            clear: function () {\r\n                const me = this;\r\n\r\n                me.protocolGroup = new ProtocolGroup();\r\n            },\r\n            setData: function (obj) {\r\n                const me = this;\r\n\r\n                me.protocolGroup = new ProtocolGroup(obj);\r\n            },\r\n            getJson: function () {\r\n                const me = this;\r\n\r\n                return JSON.stringify(me.protocolGroup);\r\n            },\r\n            onClickAdd: function () {\r\n                const me = this;\r\n\r\n                me.protocolGroup.add(new Protocol());\r\n            },\r\n            onClickDelete: function (i) {\r\n                const me = this;\r\n\r\n                me.$refs.deleteModal.show(i);\r\n            },\r\n            onConfirmDelete: function (bool, i) {\r\n                const me = this;\r\n\r\n                if (bool) {\r\n                    if (0 <= i && i < me.protocolGroup.array.length) {\r\n                        me.protocolGroup.delete(i);\r\n                    }\r\n                }\r\n            }\r\n        }\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    .protocol-group-scroll-h {\r\n        height: 50vh;\r\n        background-color: #dee2e6;\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$6 = "data-v-00cd54d2";
      /* module identifier */
      const __vue_module_identifier__$6 = undefined;
      /* functional template */
      const __vue_is_functional_template__$6 = false;
      /* style inject SSR */
      

      
      var ProtocolGroupCardVue = normalizeComponent_1(
        { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
        __vue_inject_styles__$6,
        __vue_script__$6,
        __vue_scope_id__$6,
        __vue_is_functional_template__$6,
        __vue_module_identifier__$6,
        browser,
        undefined
      );

    //

    var script$5 = {
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
    };

    /* script */
    const __vue_script__$5 = script$5;

    /* template */
    var __vue_render__$5 = function() {
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
              _c("div", { staticClass: "modal-body" }, [
                _c("div", { staticClass: "row" }, [
                  _c(
                    "div",
                    { staticClass: "col-12" },
                    [
                      _c("protocol-group-card", {
                        ref: "card",
                        attrs: { type: _vm.type, disabled: _vm.disabled }
                      })
                    ],
                    1
                  )
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row mt-3" }, [
                  _c("div", { staticClass: "col-12" }, [
                    _c("div", { staticClass: "card" }, [
                      _c("div", { staticClass: "card-body" }, [
                        _c("iframe", {
                          ref: "debugIframe",
                          staticClass: "debug-iframe",
                          attrs: { frameborder: "0" }
                        })
                      ])
                    ])
                  ])
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "modal-footer" }, [
                _c("div", { staticClass: "col-lg-3" }, [
                  _c("div", { staticClass: "row" }, [
                    _c("div", { staticClass: "col-6" }, [
                      _c(
                        "button",
                        {
                          staticClass: "w-100 btn btn-primary",
                          attrs: { type: "button", disabled: _vm.disabled },
                          on: { click: _vm.onClickSave }
                        },
                        [_c("span", [_vm._v("Save")])]
                      )
                    ]),
                    _vm._v(" "),
                    _c("div", { staticClass: "col-6" }, [
                      _c(
                        "button",
                        {
                          staticClass: "w-100 btn btn-secondary",
                          attrs: { type: "button" },
                          on: { click: _vm.onClickClose }
                        },
                        [_c("span", [_vm._v("Close")])]
                      )
                    ])
                  ])
                ])
              ])
            ])
          ])
        ]
      )
    };
    var __vue_staticRenderFns__$5 = [];
    __vue_render__$5._withStripped = true;

      /* style */
      const __vue_inject_styles__$5 = function (inject) {
        if (!inject) return
        inject("data-v-2f564248_0", { source: "\n@media (min-width: 1200px) {\n.modal-xl[data-v-2f564248] {\n        max-width: 1440px;\n}\n}\n.debug-iframe[data-v-2f564248] {\n    display: block;\n    width: 100%;\n    height: 100px;\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\protocol\\protocolModal.vue"],"names":[],"mappings":";AA8LA;AACA;QACA,iBAAA;AACA;AACA;AAEA;IACA,cAAA;IACA,WAAA;IACA,aAAA;AACA","file":"protocolModal.vue","sourcesContent":["<template>\r\n    <div :id=\"'modal-' + uid\" class=\"modal fade\" tabindex=\"-1\" data-backdrop=\"static\" data-keyboard=\"false\">\r\n        <div class=\"modal-dialog modal-xl\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-body\">\r\n                    <!-- 항목 추가 -->\r\n                    <div class=\"row\">\r\n                        <div class=\"col-12\">\r\n                            <protocol-group-card :type=\"type\" :disabled=\"disabled\" ref=\"card\"></protocol-group-card>\r\n                        </div>\r\n                    </div>\r\n                    <!-- END-항목 추가 -->\r\n\r\n                    <!-- 항목 추가 -->\r\n                    <div class=\"row mt-3\">\r\n                        <div class=\"col-12\">\r\n                            <div class=\"card\">\r\n                                <div class=\"card-body\">\r\n                                    <iframe ref=\"debugIframe\" class=\"debug-iframe\" frameborder=\"0\"></iframe>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                    <!-- END-항목 추가 -->\r\n                </div>\r\n\r\n                <div class=\"modal-footer\">\r\n                    <div class=\"col-lg-3\">\r\n                        <div class=\"row\">\r\n                            <div class=\"col-6\">\r\n                                <button\r\n                                    type=\"button\"\r\n                                    @click=\"onClickSave\"\r\n                                    :disabled=\"disabled\"\r\n                                    class=\"w-100 btn btn-primary\">\r\n\r\n                                    <span>Save</span>\r\n                                </button>\r\n                            </div>\r\n\r\n                            <div class=\"col-6\">\r\n                                <button\r\n                                    type=\"button\"\r\n                                    @click=\"onClickClose\"\r\n                                    class=\"w-100 btn btn-secondary\">\r\n\r\n                                    <span>Close</span>\r\n                                </button>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>\r\n\r\n<script>\r\n    import Channel from '../../device/channel';\r\n\r\n    import ProtocolGroupCardVue from './protocolGroupCard.vue';\r\n\r\n    export default {\r\n        props: {\r\n            channel: {type: Channel, default: () => new Channel()},\r\n            type: {type: String, default: ''},\r\n            isSubmodal: {type: Boolean, default: false}\r\n        },\r\n        components: {\r\n            'protocol-group-card': ProtocolGroupCardVue\r\n        },\r\n        data: function () {\r\n            const me = this;\r\n\r\n            return {\r\n                uid: me._uid,\r\n                disabled: false\r\n            };\r\n        },\r\n        mounted: function () {\r\n            const me = this;\r\n\r\n            $(me.$el).on('show.bs.modal', function (evt) {\r\n                // 부모 모달의 이벤트로 전파되기 때문에 막아야 한다.\r\n                evt.stopPropagation();\r\n\r\n                const $this = $(this);\r\n\r\n                me.load();\r\n\r\n                let debugUrl = (me.type == 'serial') ? SERIAL_DEBUG_URL : BLUETOOTH_DEBUG_URL;\r\n                debugUrl += '?number=' + me.channel.parent.number;\r\n\r\n                $(me.$refs.debugIframe).attr('src', debugUrl);\r\n\r\n                // 다른 모달창의 자식으로 표시 되었을 때 Y스크롤 밀림 처리를 직접 설정.\r\n                if (me.isSubmodal) {\r\n                    if ($('body').height() > $(window).height()) {\r\n                        $this.css('paddingRight', '17px');\r\n                    }\r\n                }\r\n\r\n            }).on('hidden.bs.modal', function (evt) {\r\n                // 부모 모달의 이벤트로 전파되기 때문에 막아야 한다.\r\n                evt.stopPropagation();\r\n\r\n                // 다른 모달창의 자식으로 표시 되었을 때 닫힘에 의하여 스타일이 변경되는 것을 막음.\r\n                if (me.isSubmodal) {\r\n                    const $body = $('body');\r\n\r\n                    $body.addClass('modal-open');\r\n\r\n                    if ($body.height() > $(window).height()) {\r\n                        $body.css('paddingRight', '17px');\r\n                    }\r\n                }\r\n            });\r\n        },\r\n        methods: {\r\n            show: function () {\r\n                const me = this;\r\n\r\n                $(me.$el).modal('show');\r\n            },\r\n            hide: function () {\r\n                const me = this;\r\n\r\n                // 스크롤 초기화를 위해 내용을 비운다. (모달이 사라지기 전에 비워야 한다.)\r\n                me.$refs.card.clear();\r\n                \r\n                // iframe 에서 호출된 페이지가 모달이 숨겨진 상태에서 계속 작업을 하기 때문에 빈 페이지로 초기화 시킨다.\r\n                $(me.$refs.debugIframe).attr('src', 'about:blank');\r\n\r\n                $(me.$el).modal('hide');\r\n            },\r\n            load: function () {\r\n                const me = this;\r\n\r\n                me.disabled = true;\r\n\r\n                const param = {\r\n                    id: me.channel.parent.id,\r\n                    type: me.type\r\n                };\r\n\r\n                apiRequest(PROTOCOL_DATA_URL, param, 'get').then(function (obj) {\r\n                    me.$refs.card.setData(obj.data);\r\n\r\n                    me.disabled = false;\r\n\r\n                }).catch(function (error) {\r\n                    console.error(error);\r\n                    alert('processing error.');\r\n                    me.disabled = false;\r\n                });\r\n            },\r\n            onClickSave: function () {\r\n                const me = this;\r\n\r\n                me.disabled = true;\r\n\r\n                const json = me.$refs.card.getJson();\r\n\r\n                const param = {\r\n                    id: me.channel.parent.id,\r\n                    type: me.type,\r\n                    data: json\r\n                };\r\n\r\n                apiRequest(PROTOCOL_SAVE_URL, param, 'post').then(function () {\r\n                    me.disabled = false;\r\n\r\n                }).catch(function (error) {\r\n                    console.error(error);\r\n                    alert('processing error.');\r\n                    me.disabled = false;\r\n                });\r\n\r\n                me.hide();\r\n            },\r\n            onClickClose: function () {\r\n                const me = this;\r\n\r\n                me.hide();\r\n            }\r\n        }\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    @media (min-width: 1200px) {\r\n        .modal-xl {\r\n            max-width: 1440px;\r\n        }\r\n    }\r\n\r\n    .debug-iframe {\r\n        display: block;\r\n        width: 100%;\r\n        height: 100px;\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$5 = "data-v-2f564248";
      /* module identifier */
      const __vue_module_identifier__$5 = undefined;
      /* functional template */
      const __vue_is_functional_template__$5 = false;
      /* style inject SSR */
      

      
      var ProtocolModalVue = normalizeComponent_1(
        { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
        __vue_inject_styles__$5,
        __vue_script__$5,
        __vue_scope_id__$5,
        __vue_is_functional_template__$5,
        __vue_module_identifier__$5,
        browser,
        undefined
      );

    //

    var script$4 = {
        props: {
            label: {type: String, default: ''},
            channels: {type: Array, default: []},
            disabled: {type: Boolean, default: false},
            isSubmodal: {type: Boolean, default: false}
        },
        components: {
            'protocol-modal': ProtocolModalVue
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid
            };
        },
        methods: {
            onClickConfigFile: function (url) {
                window.open(url + '?t=' + Date.now());
            },
            onClickProtocolModal: function () {
                const me = this;

                me.$refs.protocolModal[0].show();
            }
        },
    };

    /* script */
    const __vue_script__$4 = script$4;

    /* template */
    var __vue_render__$4 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("fieldset", [
        _c("legend", { staticClass: "w-auto h4 text-truncate" }, [
          _vm._v(_vm._s(_vm.label))
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "row" },
          _vm._l(_vm.channels, function(channel, i) {
            return _c("div", { key: i, staticClass: "w-100 col-12 p-1" }, [
              _c("fieldset", { staticClass: "col-lg-12 p-2 border" }, [
                _c("legend", { staticClass: "w-auto h6" }, [
                  _vm._v(_vm._s(channel.name))
                ]),
                _vm._v(" "),
                channel.sensor
                  ? _c("div", { staticClass: "row" }, [
                      _c("div", { staticClass: "col-12 pb-3" }, [
                        _c(
                          "div",
                          { staticClass: "custom-control custom-checkbox" },
                          [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: channel.sensor.isUse,
                                  expression: "channel.sensor.isUse"
                                }
                              ],
                              staticClass: "custom-control-input",
                              attrs: {
                                id: "check-use-sensor-" + channel.id,
                                type: "checkbox"
                              },
                              domProps: {
                                checked: Array.isArray(channel.sensor.isUse)
                                  ? _vm._i(channel.sensor.isUse, null) > -1
                                  : channel.sensor.isUse
                              },
                              on: {
                                change: function($event) {
                                  var $$a = channel.sensor.isUse,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false;
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v);
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        _vm.$set(
                                          channel.sensor,
                                          "isUse",
                                          $$a.concat([$$v])
                                        );
                                    } else {
                                      $$i > -1 &&
                                        _vm.$set(
                                          channel.sensor,
                                          "isUse",
                                          $$a
                                            .slice(0, $$i)
                                            .concat($$a.slice($$i + 1))
                                        );
                                    }
                                  } else {
                                    _vm.$set(channel.sensor, "isUse", $$c);
                                  }
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c(
                              "label",
                              {
                                staticClass: "custom-control-label",
                                attrs: { for: "check-use-sensor-" + channel.id }
                              },
                              [_vm._v("Use")]
                            )
                          ]
                        )
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                channel.sensor
                  ? _c("div", { staticClass: "row" }, [
                      _vm._m(0, true),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-lg-6" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model.trim",
                              value: channel.sensor.name,
                              expression: "channel.sensor.name",
                              modifiers: { trim: true }
                            }
                          ],
                          staticClass: "form-control form-control-sm",
                          attrs: { disabled: _vm.disabled, type: "text" },
                          domProps: { value: channel.sensor.name },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                channel.sensor,
                                "name",
                                $event.target.value.trim()
                              );
                            },
                            blur: function($event) {
                              return _vm.$forceUpdate()
                            }
                          }
                        })
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(1, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-12" }, [
                    _c("textarea", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.trim",
                          value: channel.sensor.uuid,
                          expression: "channel.sensor.uuid",
                          modifiers: { trim: true }
                        }
                      ],
                      staticClass: "text-uuid form-control form-control-sm",
                      attrs: { disabled: _vm.disabled },
                      domProps: { value: channel.sensor.uuid },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            channel.sensor,
                            "uuid",
                            $event.target.value.trim()
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row mt-2 px-3" }, [
                  _c(
                    "button",
                    {
                      staticClass: "col-12 btn btn-outline-primary text-truncate",
                      attrs: {
                        disabled: _vm.disabled || !channel.sensor.configFileUrl
                      },
                      on: {
                        click: function($event) {
                          return _vm.onClickConfigFile(channel.sensor.configFileUrl)
                        }
                      }
                    },
                    [_c("span", [_vm._v("Protocol file")])]
                  )
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "row mt-2 px-3" },
                  [
                    _c("protocol-modal", {
                      ref: "protocolModal",
                      refInFor: true,
                      attrs: {
                        channel: channel,
                        "is-submodal": _vm.isSubmodal,
                        type: "bluetooth"
                      }
                    }),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "col-12 btn btn-outline-primary text-truncate",
                        attrs: {
                          disabled: _vm.disabled || channel.parent.id < 0,
                          type: "button"
                        },
                        on: { click: _vm.onClickProtocolModal }
                      },
                      [_c("span", [_vm._v("Protocol config / debug")])]
                    )
                  ],
                  1
                )
              ])
            ])
          }),
          0
        )
      ])
    };
    var __vue_staticRenderFns__$4 = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Sensor name")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-12 col-form-label text-truncate" },
          [_c("small", [_vm._v("Complete Local Name")])]
        )
      }
    ];
    __vue_render__$4._withStripped = true;

      /* style */
      const __vue_inject_styles__$4 = function (inject) {
        if (!inject) return
        inject("data-v-08825572_0", { source: "\n@media (min-width: 992px) {\n.w-100[data-v-08825572] {\n        flex: none;\n        width: 100%;\n}\n}\n.text-uuid[data-v-08825572] {\n    height: 76px;\n    resize: none;\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\device\\deviceBluetoothChannelCard.vue"],"names":[],"mappings":";AAoHA;AACA;QACA,UAAA;QACA,WAAA;AACA;AACA;AAEA;IACA,YAAA;IACA,YAAA;AACA","file":"deviceBluetoothChannelCard.vue","sourcesContent":["<template>\r\n    <fieldset>\r\n        <legend class=\"w-auto h4 text-truncate\">{{label}}</legend>\r\n\r\n        <div class=\"row\">\r\n            <!-- channel 반복 -->\r\n            <div v-for=\"(channel, i) in channels\" :key=\"i\" class=\"w-100 col-12 p-1\">\r\n                <fieldset class=\"col-lg-12 p-2 border\">\r\n                    <legend class=\"w-auto h6\">{{ channel.name }}</legend>\r\n\r\n                    <div v-if=\"channel.sensor\" class=\"row\">\r\n                        <div class=\"col-12 pb-3\">\r\n                            <div class=\"custom-control custom-checkbox\">\r\n                                <input\r\n                                    v-model=\"channel.sensor.isUse\"\r\n                                    :id=\"'check-use-sensor-' + channel.id\"\r\n                                    type=\"checkbox\"\r\n                                    class=\"custom-control-input\">\r\n\r\n                                <label :for=\"'check-use-sensor-' + channel.id\" class=\"custom-control-label\">Use</label>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div v-if=\"channel.sensor\" class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Sensor name</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <input v-model.trim=\"channel.sensor.name\" :disabled=\"disabled\" type=\"text\" class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <label class=\"h6 col-12 col-form-label text-truncate\">\r\n                            <small>Complete Local Name</small>\r\n                        </label>\r\n                        <div class=\"col-12\">\r\n                            <textarea v-model.trim=\"channel.sensor.uuid\" :disabled=\"disabled\" class=\"text-uuid form-control form-control-sm\"></textarea>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- 설정파일 보기 -->\r\n                    <div class=\"row mt-2 px-3\">\r\n                        <button\r\n                            :disabled=\"disabled || !channel.sensor.configFileUrl\"\r\n                            @click=\"onClickConfigFile(channel.sensor.configFileUrl)\"\r\n                            class=\"col-12 btn btn-outline-primary text-truncate\">\r\n\r\n                            <span>Protocol file</span>\r\n                        </button>\r\n                    </div>\r\n                    <!-- END-설정파일 보기 -->\r\n\r\n                    <!-- 설정파일 보기 -->\r\n                    <div class=\"row mt-2 px-3\">\r\n                        <!-- 프로토콜 모달 -->\r\n                        <protocol-modal\r\n                            :channel=\"channel\"\r\n                            :is-submodal=\"isSubmodal\"\r\n                            ref=\"protocolModal\"\r\n                            type=\"bluetooth\">\r\n                        </protocol-modal>\r\n                        <!-- END-프로토콜 모달 -->\r\n\r\n                        <button\r\n                            :disabled=\"disabled || (channel.parent.id < 0)\"\r\n                            @click=\"onClickProtocolModal\"\r\n                            type=\"button\"\r\n                            class=\"col-12 btn btn-outline-primary text-truncate\">\r\n\r\n                            <span>Protocol config / debug</span>\r\n                        </button>\r\n                    </div>\r\n                    <!-- END-설정파일 보기 -->\r\n                </fieldset>\r\n            </div>\r\n            <!-- END-channel 반복 -->\r\n        </div>\r\n    </fieldset>\r\n</template>\r\n\r\n<script>\r\n    import ProtocolModalVue from '../protocol/protocolModal.vue';\r\n\r\n    export default {\r\n        props: {\r\n            label: {type: String, default: ''},\r\n            channels: {type: Array, default: []},\r\n            disabled: {type: Boolean, default: false},\r\n            isSubmodal: {type: Boolean, default: false}\r\n        },\r\n        components: {\r\n            'protocol-modal': ProtocolModalVue\r\n        },\r\n        data: function () {\r\n            const me = this;\r\n\r\n            return {\r\n                uid: me._uid\r\n            };\r\n        },\r\n        methods: {\r\n            onClickConfigFile: function (url) {\r\n                window.open(url + '?t=' + Date.now());\r\n            },\r\n            onClickProtocolModal: function () {\r\n                const me = this;\r\n\r\n                me.$refs.protocolModal[0].show();\r\n            }\r\n        },\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    @media (min-width: 992px) {\r\n        .w-100 {\r\n            flex: none;\r\n            width: 100%;\r\n        }\r\n    }\r\n\r\n    .text-uuid {\r\n        height: 76px;\r\n        resize: none;\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$4 = "data-v-08825572";
      /* module identifier */
      const __vue_module_identifier__$4 = undefined;
      /* functional template */
      const __vue_is_functional_template__$4 = false;
      /* style inject SSR */
      

      
      var DeviceBluetoothChannelCardVue = normalizeComponent_1(
        { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
        __vue_inject_styles__$4,
        __vue_script__$4,
        __vue_scope_id__$4,
        __vue_is_functional_template__$4,
        __vue_module_identifier__$4,
        browser,
        undefined
      );

    //

    var script$3 = {
        props: {
            label: {type: String, default: ''},
            channels: {type: Array, default: []},
            disabled: {type: Boolean, default: false},
            isSubmodal: {type: Boolean, default: false}
        },
        components: {
            'protocol-modal': ProtocolModalVue
        },
        data: function () {
            const me = this;

            const typeArr = ['NONE', 'SERIAL', 'CAMERA', 'ETC'];

            return {
                uid: me._uid,
                typeArr: typeArr
            };
        },
        methods: {
            onClickConfigFile: function (url) {
                window.open(url + '?t=' + Date.now());
            },
            onClickProtocolModal: function () {
                const me = this;

                me.$refs.protocolModal[0].show();
            }
        }
    };

    /* script */
    const __vue_script__$3 = script$3;

    /* template */
    var __vue_render__$3 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("fieldset", [
        _c("legend", { staticClass: "w-auto h4 text-truncate" }, [
          _vm._v(_vm._s(_vm.label))
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "row" },
          _vm._l(_vm.channels, function(channel, i) {
            return _c("div", { key: i, staticClass: "w-100 col-12 p-1" }, [
              _c("fieldset", { staticClass: "col-lg-12 p-2 border" }, [
                _c("legend", { staticClass: "w-auto h6" }, [
                  _vm._v(_vm._s(channel.name))
                ]),
                _vm._v(" "),
                channel.sensor
                  ? _c("div", { staticClass: "row" }, [
                      _c("div", { staticClass: "col-12 pb-3" }, [
                        _c(
                          "div",
                          { staticClass: "custom-control custom-checkbox" },
                          [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: channel.sensor.isUse,
                                  expression: "channel.sensor.isUse"
                                }
                              ],
                              staticClass: "custom-control-input",
                              attrs: {
                                id: "check-use-sensor-" + channel.id,
                                type: "checkbox"
                              },
                              domProps: {
                                checked: Array.isArray(channel.sensor.isUse)
                                  ? _vm._i(channel.sensor.isUse, null) > -1
                                  : channel.sensor.isUse
                              },
                              on: {
                                change: function($event) {
                                  var $$a = channel.sensor.isUse,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false;
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v);
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        _vm.$set(
                                          channel.sensor,
                                          "isUse",
                                          $$a.concat([$$v])
                                        );
                                    } else {
                                      $$i > -1 &&
                                        _vm.$set(
                                          channel.sensor,
                                          "isUse",
                                          $$a
                                            .slice(0, $$i)
                                            .concat($$a.slice($$i + 1))
                                        );
                                    }
                                  } else {
                                    _vm.$set(channel.sensor, "isUse", $$c);
                                  }
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c(
                              "label",
                              {
                                staticClass: "custom-control-label",
                                attrs: { for: "check-use-sensor-" + channel.id }
                              },
                              [_vm._v("Use")]
                            )
                          ]
                        )
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                channel.sensor
                  ? _c("div", { staticClass: "row" }, [
                      _vm._m(0, true),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-lg-6" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model.trim",
                              value: channel.sensor.name,
                              expression: "channel.sensor.name",
                              modifiers: { trim: true }
                            }
                          ],
                          staticClass: "form-control form-control-sm",
                          attrs: { disabled: _vm.disabled, type: "text" },
                          domProps: { value: channel.sensor.name },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                channel.sensor,
                                "name",
                                $event.target.value.trim()
                              );
                            },
                            blur: function($event) {
                              return _vm.$forceUpdate()
                            }
                          }
                        })
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(1, true),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-6" }, [
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model.number",
                            value: channel.sensor.protocol,
                            expression: "channel.sensor.protocol",
                            modifiers: { number: true }
                          }
                        ],
                        staticClass: "form-control form-control-sm",
                        attrs: { disabled: _vm.disabled },
                        on: {
                          change: function($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function(o) {
                                return o.selected
                              })
                              .map(function(o) {
                                var val = "_value" in o ? o._value : o.value;
                                return _vm._n(val)
                              });
                            _vm.$set(
                              channel.sensor,
                              "protocol",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            );
                          }
                        }
                      },
                      _vm._l(_vm.typeArr, function(type, i) {
                        return _c("option", { key: i, domProps: { value: type } }, [
                          _vm._v(_vm._s(type))
                        ])
                      }),
                      0
                    )
                  ])
                ]),
                _vm._v(" "),
                _vm._m(2, true),
                _vm._v(" "),
                _vm._m(3, true),
                _vm._v(" "),
                _c("div", { staticClass: "row mt-2 px-3" }, [
                  _c(
                    "button",
                    {
                      staticClass: "col-12 btn btn-outline-primary text-truncate",
                      attrs: {
                        disabled: _vm.disabled || !channel.sensor.configFileUrl
                      },
                      on: {
                        click: function($event) {
                          return _vm.onClickConfigFile(channel.sensor.configFileUrl)
                        }
                      }
                    },
                    [_c("span", [_vm._v("Protocol file")])]
                  )
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "row mt-2 px-3" },
                  [
                    _c("protocol-modal", {
                      ref: "protocolModal",
                      refInFor: true,
                      attrs: {
                        channel: channel,
                        "is-submodal": _vm.isSubmodal,
                        type: "serial"
                      }
                    }),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "col-12 btn btn-outline-primary text-truncate",
                        attrs: {
                          disabled: _vm.disabled || channel.parent.id < 0,
                          type: "button"
                        },
                        on: { click: _vm.onClickProtocolModal }
                      },
                      [_c("span", [_vm._v("Protocol config / debug")])]
                    )
                  ],
                  1
                )
              ])
            ])
          }),
          0
        )
      ])
    };
    var __vue_staticRenderFns__$3 = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Sensor name")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          { staticClass: "h6 col-lg-6 col-form-label text-truncate" },
          [_c("small", [_vm._v("Protocol")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "row d-none d-md-block" }, [
          _c("div", { staticClass: "col-12" }, [
            _c("label", { staticClass: "h6 col-form-label" }, [_vm._v(" ")])
          ])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "row d-none d-md-block" }, [
          _c("div", { staticClass: "col-12" }, [
            _c("label", { staticClass: "h6 col-form-label" }, [_vm._v(" ")])
          ])
        ])
      }
    ];
    __vue_render__$3._withStripped = true;

      /* style */
      const __vue_inject_styles__$3 = function (inject) {
        if (!inject) return
        inject("data-v-96cf08d2_0", { source: "\n@media (min-width: 992px) {\n.w-100[data-v-96cf08d2] {\n        flex: none;\n        width: 100%;\n}\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\device\\deviceSerialChannelCard.vue"],"names":[],"mappings":";AAsIA;AACA;QACA,UAAA;QACA,WAAA;AACA;AACA","file":"deviceSerialChannelCard.vue","sourcesContent":["<template>\r\n    <fieldset>\r\n        <legend class=\"w-auto h4 text-truncate\">{{label}}</legend>\r\n\r\n        <div class=\"row\">\r\n            <!-- channel 반복 -->\r\n            <div v-for=\"(channel, i) in channels\" :key=\"i\" class=\"w-100 col-12 p-1\">\r\n                <fieldset class=\"col-lg-12 p-2 border\">\r\n                    <legend class=\"w-auto h6\">{{ channel.name }}</legend>\r\n\r\n                    <div v-if=\"channel.sensor\" class=\"row\">\r\n                        <div class=\"col-12 pb-3\">\r\n                            <div class=\"custom-control custom-checkbox\">\r\n                                <input\r\n                                    v-model=\"channel.sensor.isUse\"\r\n                                    :id=\"'check-use-sensor-' + channel.id\"\r\n                                    type=\"checkbox\"\r\n                                    class=\"custom-control-input\">\r\n\r\n                                <label :for=\"'check-use-sensor-' + channel.id\" class=\"custom-control-label\">Use</label>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div v-if=\"channel.sensor\" class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Sensor name</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <input v-model.trim=\"channel.sensor.name\" :disabled=\"disabled\" type=\"text\" class=\"form-control form-control-sm\">\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row\">\r\n                        <label class=\"h6 col-lg-6 col-form-label text-truncate\">\r\n                            <small>Protocol</small>\r\n                        </label>\r\n                        <div class=\"col-lg-6\">\r\n                            <select v-model.number=\"channel.sensor.protocol\" :disabled=\"disabled\" class=\"form-control form-control-sm\">\r\n                                <option v-for=\"(type, i) in typeArr\" :key=\"i\" :value=\"type\">{{ type }}</option>\r\n                            </select>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <!-- 공백 -->\r\n                    <div class=\"row d-none d-md-block\">\r\n                        <div class=\"col-12\">\r\n                            <label class=\"h6 col-form-label\">&nbsp;</label>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row d-none d-md-block\">\r\n                        <div class=\"col-12\">\r\n                            <label class=\"h6 col-form-label\">&nbsp;</label>\r\n                        </div>\r\n                    </div>\r\n                    <!-- END-공백 -->\r\n\r\n                    <!-- 설정파일 보기 -->\r\n                    <div class=\"row mt-2 px-3\">\r\n                        <button\r\n                            :disabled=\"disabled || !channel.sensor.configFileUrl\"\r\n                            @click=\"onClickConfigFile(channel.sensor.configFileUrl)\"\r\n                            class=\"col-12 btn btn-outline-primary text-truncate\">\r\n\r\n                            <span>Protocol file</span>\r\n                        </button>\r\n                    </div>\r\n                    <!-- END-설정파일 보기 -->\r\n\r\n                    <!-- 디버그 모달 -->\r\n                    <div class=\"row mt-2 px-3\">\r\n                        <!-- 프로토콜 모달 -->\r\n                        <protocol-modal\r\n                            :channel=\"channel\"\r\n                            :is-submodal=\"isSubmodal\"\r\n                            ref=\"protocolModal\"\r\n                            type=\"serial\">\r\n                        </protocol-modal>\r\n                        <!-- END-프로토콜 모달 -->\r\n\r\n                        <button :disabled=\"disabled || (channel.parent.id < 0)\"\r\n                            @click=\"onClickProtocolModal\"\r\n                            type=\"button\"\r\n                            class=\"col-12 btn btn-outline-primary text-truncate\">\r\n\r\n                            <span>Protocol config / debug</span>\r\n                        </button>\r\n                    </div>\r\n                    <!-- END-디버그 모달 -->\r\n                </fieldset>\r\n            </div>\r\n            <!-- END-channel 반복 -->\r\n        </div>\r\n    </fieldset>\r\n</template>\r\n\r\n<script>\r\n    import ProtocolModalVue from '../protocol/protocolModal.vue';\r\n\r\n    export default {\r\n        props: {\r\n            label: {type: String, default: ''},\r\n            channels: {type: Array, default: []},\r\n            disabled: {type: Boolean, default: false},\r\n            isSubmodal: {type: Boolean, default: false}\r\n        },\r\n        components: {\r\n            'protocol-modal': ProtocolModalVue\r\n        },\r\n        data: function () {\r\n            const me = this;\r\n\r\n            const typeArr = ['NONE', 'SERIAL', 'CAMERA', 'ETC'];\r\n\r\n            return {\r\n                uid: me._uid,\r\n                typeArr: typeArr\r\n            };\r\n        },\r\n        methods: {\r\n            onClickConfigFile: function (url) {\r\n                window.open(url + '?t=' + Date.now());\r\n            },\r\n            onClickProtocolModal: function () {\r\n                const me = this;\r\n\r\n                me.$refs.protocolModal[0].show();\r\n            }\r\n        }\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    @media (min-width: 992px) {\r\n        .w-100 {\r\n            flex: none;\r\n            width: 100%;\r\n        }\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$3 = "data-v-96cf08d2";
      /* module identifier */
      const __vue_module_identifier__$3 = undefined;
      /* functional template */
      const __vue_is_functional_template__$3 = false;
      /* style inject SSR */
      

      
      var DeviceSerialChannelCardVue = normalizeComponent_1(
        { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
        __vue_inject_styles__$3,
        __vue_script__$3,
        __vue_scope_id__$3,
        __vue_is_functional_template__$3,
        __vue_module_identifier__$3,
        browser,
        undefined
      );

    //

    var script$2 = {
        props: {
            device: {type: Device, default: () => new Device()},
            disabled: {type: Boolean, default: false},
            isSubmodal: {type: Boolean, default: false}
        },
        components: {
            'device-analog-channel-card': DeviceAnalogChannelCardVue,
            'device-digital-channel-card': DeviceDigitalChannelCardVue,
            'device-bluetooth-channel-card': DeviceBluetoothChannelCardVue,
            'device-serial-channel-card': DeviceSerialChannelCardVue
        }
    };

    /* script */
    const __vue_script__$2 = script$2;

    /* template */
    var __vue_render__$2 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "card" }, [
        _c("div", { staticClass: "card-body" }, [
          _c("div", { staticClass: "row pl-lg-0 py-2" }, [
            _c("div", { staticClass: "col-lg-2 d-flex justify-content-center" }, [
              _c("img", {
                attrs: { src: _vm.device.imageUrl, height: "100", alt: "device" }
              })
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-lg-10" }, [
              _vm.device.typeCode == 0
                ? _c("div", { staticClass: "row" }, [
                    _vm._m(0),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass:
                          "col-lg-3 d-flex align-items-center mt-3 mt-lg-0"
                      },
                      [
                        _c(
                          "div",
                          { staticClass: "custom-control custom-checkbox" },
                          [
                            _c("input", {
                              directives: [
                                {
                                  name: "model",
                                  rawName: "v-model",
                                  value: _vm.device.isUse,
                                  expression: "device.isUse"
                                }
                              ],
                              staticClass: "custom-control-input",
                              attrs: {
                                disabled: _vm.disabled,
                                id: "check-use-device-" + _vm.device.id,
                                type: "checkbox"
                              },
                              domProps: {
                                checked: Array.isArray(_vm.device.isUse)
                                  ? _vm._i(_vm.device.isUse, null) > -1
                                  : _vm.device.isUse
                              },
                              on: {
                                change: function($event) {
                                  var $$a = _vm.device.isUse,
                                    $$el = $event.target,
                                    $$c = $$el.checked ? true : false;
                                  if (Array.isArray($$a)) {
                                    var $$v = null,
                                      $$i = _vm._i($$a, $$v);
                                    if ($$el.checked) {
                                      $$i < 0 &&
                                        _vm.$set(
                                          _vm.device,
                                          "isUse",
                                          $$a.concat([$$v])
                                        );
                                    } else {
                                      $$i > -1 &&
                                        _vm.$set(
                                          _vm.device,
                                          "isUse",
                                          $$a
                                            .slice(0, $$i)
                                            .concat($$a.slice($$i + 1))
                                        );
                                    }
                                  } else {
                                    _vm.$set(_vm.device, "isUse", $$c);
                                  }
                                }
                              }
                            }),
                            _vm._v(" "),
                            _c(
                              "label",
                              {
                                staticClass: "custom-control-label h5",
                                attrs: { for: "check-use-device-" + _vm.device.id }
                              },
                              [_vm._v("Use device")]
                            )
                          ]
                        )
                      ]
                    )
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("div", { staticClass: "row" }, [
                _c(
                  "div",
                  {
                    staticClass:
                      "offset-lg-3 col-lg-3 d-flex align-items-center mt-3 mt-lg-0"
                  },
                  [
                    _c("div", { staticClass: "custom-control custom-checkbox" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.device.isOneWay,
                            expression: "device.isOneWay"
                          }
                        ],
                        staticClass: "custom-control-input",
                        attrs: {
                          disabled: _vm.disabled,
                          id: "check-one-way-device-" + _vm.device.id,
                          type: "checkbox"
                        },
                        domProps: {
                          checked: Array.isArray(_vm.device.isOneWay)
                            ? _vm._i(_vm.device.isOneWay, null) > -1
                            : _vm.device.isOneWay
                        },
                        on: {
                          change: function($event) {
                            var $$a = _vm.device.isOneWay,
                              $$el = $event.target,
                              $$c = $$el.checked ? true : false;
                            if (Array.isArray($$a)) {
                              var $$v = null,
                                $$i = _vm._i($$a, $$v);
                              if ($$el.checked) {
                                $$i < 0 &&
                                  _vm.$set(
                                    _vm.device,
                                    "isOneWay",
                                    $$a.concat([$$v])
                                  );
                              } else {
                                $$i > -1 &&
                                  _vm.$set(
                                    _vm.device,
                                    "isOneWay",
                                    $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                                  );
                              }
                            } else {
                              _vm.$set(_vm.device, "isOneWay", $$c);
                            }
                          }
                        }
                      }),
                      _vm._v(" "),
                      _c(
                        "label",
                        {
                          staticClass: "custom-control-label h5",
                          attrs: { for: "check-one-way-device-" + _vm.device.id }
                        },
                        [_vm._v("One-way Protocol")]
                      )
                    ])
                  ]
                )
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "row mt-3" }, [
                _c(
                  "div",
                  {
                    staticClass:
                      "col-lg-2 d-flex flex-column justify-content-center"
                  },
                  [
                    _c(
                      "label",
                      {
                        staticClass: "h6",
                        attrs: { for: "device-number-" + _vm.device.id }
                      },
                      [_vm._v("Device Number")]
                    ),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: _vm.device.number,
                          expression: "device.number",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: {
                        readonly: _vm.device.typeCode == 0,
                        id: "device-number-" + _vm.device.id,
                        disabled: _vm.disabled,
                        type: "number"
                      },
                      domProps: { value: _vm.device.number },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.device,
                            "number",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ]
                ),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "col-lg-10 mt-3 mt-lg-0" },
                  [_vm._t("button")],
                  2
                )
              ])
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-12 py-2" }, [
            _c(
              "div",
              { staticClass: "row mt-3" },
              [
                _c("device-analog-channel-card", {
                  staticClass: "col-lg-4 mt-3 mt-lg-0",
                  attrs: {
                    label: "Analog",
                    channels: _vm.device.analogChannels,
                    disabled: _vm.disabled,
                    "is-submodal": _vm.isSubmodal
                  }
                }),
                _vm._v(" "),
                _c("device-digital-channel-card", {
                  staticClass: "col-lg-4 mt-3 mt-lg-0",
                  attrs: {
                    label: "Digital",
                    channels: _vm.device.digitalChannels,
                    disabled: _vm.disabled,
                    "is-submodal": _vm.isSubmodal
                  }
                }),
                _vm._v(" "),
                _c("device-serial-channel-card", {
                  staticClass: "col-lg-2 mt-3 mt-lg-0",
                  attrs: {
                    label: "Serial",
                    channels: _vm.device.serialChannels,
                    disabled: _vm.disabled,
                    "is-submodal": _vm.isSubmodal
                  }
                }),
                _vm._v(" "),
                _vm.device.typeCode == 0
                  ? [
                      _c("device-bluetooth-channel-card", {
                        staticClass: "col-lg-2 mt-3 mt-lg-0",
                        attrs: {
                          label: "Bluetooth",
                          channels: _vm.device.bluetoothChannels,
                          disabled: _vm.disabled,
                          "is-submodal": _vm.isSubmodal
                        }
                      })
                    ]
                  : _vm._e()
              ],
              2
            )
          ])
        ])
      ])
    };
    var __vue_staticRenderFns__$2 = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "col-lg-3 mt-3 mt-lg-0" }, [
          _c("div", { staticClass: "h3 text-center text-lg-left text-success" }, [
            _vm._v(
              "\n                            Inner device\n                        "
            )
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
      

      
      var DeviceCardVue = normalizeComponent_1(
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
     * Template event : created
     */
    var script$1 = {
        props: {
            deviceList: {type: Array, default: []}
        },
        components: {
            'device-card': DeviceCardVue
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid,
                disabled: false,
                device: new Device()
            }
        },
        methods: {
            show: function () {
                const me = this;

                $(me.$el).modal('show');
            },
            hide: function () {
                const me = this;

                $(me.$el).modal('hide');
            },
            onClickCreate: function () {
                const me = this;

                const device = me.device;
                const check = Device.validateDevice(device, me.deviceList);

                if (check.isOk) {
                    me.disabled = true;

                    apiRequest(DEVICE_CREATE_URL, me.device.getDataObject(), 'post').then(function () {
                        me.disabled = false;

                        me.$emit('created');
                        
                        me.hide();

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.disabled = false;
                    });

                } else {
                    alert(check.message);
                }
            },
            onClickClose: function () {
                const me = this;

                me.hide();
            }
        }
    };

    /* script */
    const __vue_script__$1 = script$1;

    /* template */
    var __vue_render__$1 = function() {
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
              _c(
                "div",
                { staticClass: "modal-body" },
                [
                  _c(
                    "device-card",
                    {
                      staticClass: "col-12",
                      attrs: {
                        device: _vm.device,
                        disabled: _vm.disabled,
                        isSubmodal: true
                      }
                    },
                    [
                      _c(
                        "div",
                        {
                          staticClass:
                            "h-100 d-lg-flex justify-content-lg-end align-items-lg-center",
                          attrs: { slot: "button" },
                          slot: "button"
                        },
                        [
                          _c("div", { staticClass: "col-lg-6 mt-lg-0" }, [
                            _c(
                              "button",
                              {
                                staticClass: "w-100 btn btn-primary",
                                attrs: { disabled: _vm.disabled, type: "button" },
                                on: { click: _vm.onClickCreate }
                              },
                              [_vm._v("Create")]
                            )
                          ]),
                          _vm._v(" "),
                          _c(
                            "div",
                            { staticClass: "col-lg-6 mt-2 mt-lg-0 mt-lg-0" },
                            [
                              _c(
                                "button",
                                {
                                  staticClass: "w-100 btn btn-secondary",
                                  attrs: { type: "button" },
                                  on: { click: _vm.onClickClose }
                                },
                                [_vm._v("Close")]
                              )
                            ]
                          )
                        ]
                      )
                    ]
                  )
                ],
                1
              )
            ])
          ])
        ]
      )
    };
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$1 = function (inject) {
        if (!inject) return
        inject("data-v-5ec9d82a_0", { source: "\n@media (min-width: 1200px) {\n.modal-xl[data-v-5ec9d82a] {\n        max-width: 1540px;\n}\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\device\\addDeviceModal.vue"],"names":[],"mappings":";AA+FA;AACA;QACA,iBAAA;AACA;AACA","file":"addDeviceModal.vue","sourcesContent":["<template>\r\n    <div :id=\"'modal-' + uid\" class=\"modal fade\" tabindex=\"-1\" data-backdrop=\"static\" data-keyboard=\"false\">\r\n        <div class=\"modal-dialog modal-xl\">\r\n            <div class=\"modal-content\">\r\n                <div class=\"modal-body\">\r\n                    <device-card :device=\"device\" :disabled=\"disabled\" :isSubmodal=\"true\" class=\"col-12\">\r\n                        <!-- 버튼 -->\r\n                        <div slot=\"button\" class=\"h-100 d-lg-flex justify-content-lg-end align-items-lg-center\">\r\n                            <div class=\"col-lg-6 mt-lg-0\">\r\n                                <button :disabled=\"disabled\" @click=\"onClickCreate\" type=\"button\" class=\"w-100 btn btn-primary\">Create</button>\r\n                            </div>\r\n\r\n                            <div class=\"col-lg-6 mt-2 mt-lg-0 mt-lg-0\">\r\n                                <button @click=\"onClickClose\" type=\"button\" class=\"w-100 btn btn-secondary\">Close</button>\r\n                            </div>\r\n                        </div>\r\n                        <!-- END-버튼 -->\r\n                    </device-card>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>\r\n\r\n<script>\r\n    import Device from '../../device/device';\r\n\r\n    import DeviceCardVue from './deviceCard.vue';\r\n\r\n    /**\r\n     * Template event : created\r\n     */\r\n    export default {\r\n        props: {\r\n            deviceList: {type: Array, default: []}\r\n        },\r\n        components: {\r\n            'device-card': DeviceCardVue\r\n        },\r\n        data: function () {\r\n            const me = this;\r\n\r\n            return {\r\n                uid: me._uid,\r\n                disabled: false,\r\n                device: new Device()\r\n            }\r\n        },\r\n        methods: {\r\n            show: function () {\r\n                const me = this;\r\n\r\n                $(me.$el).modal('show');\r\n            },\r\n            hide: function () {\r\n                const me = this;\r\n\r\n                $(me.$el).modal('hide');\r\n            },\r\n            onClickCreate: function () {\r\n                const me = this;\r\n\r\n                const device = me.device;\r\n                const check = Device.validateDevice(device, me.deviceList);\r\n\r\n                if (check.isOk) {\r\n                    me.disabled = true;\r\n\r\n                    apiRequest(DEVICE_CREATE_URL, me.device.getDataObject(), 'post').then(function () {\r\n                        me.disabled = false;\r\n\r\n                        me.$emit('created');\r\n                        \r\n                        me.hide();\r\n\r\n                    }).catch(function (error) {\r\n                        console.error(error);\r\n                        alert('processing error.');\r\n                        me.disabled = false;\r\n                    });\r\n\r\n                } else {\r\n                    alert(check.message);\r\n                }\r\n            },\r\n            onClickClose: function () {\r\n                const me = this;\r\n\r\n                me.hide();\r\n            }\r\n        }\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    @media (min-width: 1200px) {\r\n        .modal-xl {\r\n            max-width: 1540px;\r\n        }\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__$1 = "data-v-5ec9d82a";
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = false;
      /* style inject SSR */
      

      
      var AddDeviceModalVue = normalizeComponent_1(
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
            'device-card': DeviceCardVue,
            'add-device-modal': AddDeviceModalVue,
            'confirm-modal': ConfirmModalVue
        },
        data: function () {
            return {
                disabled: true,
                deviceList: []
            }
        },
        mounted: function() {
            const me = this;

            me.load().then(function () {
                me.disabled = false;
            });
        },
        methods: {
            load: function () {
                const me = this;

                me.deviceList = [];

                // 서버에 있는 시리얼 설정파일 목록을 가지고 온다.
                return apiRequest(PROTOCOL_CONFIG_FILES_URL, {}, 'get').then(function (obj) {
                    return Promise.resolve(obj.data);

                }).catch(function () {
                    return Promise.resolve({});

                }).then(function (serialConfigUrls) {
                    // 디바이스 정보를 가지고 온다.
                    return apiRequest(DEVICE_LIST_URL, {}, 'get').then(function (obj) {
                        const arr = obj.data;

                        for (let i = 0; i < arr.length; i++) {
                            const item = arr[i];
                            const device = new Device();

                            device.setValueFromDb(item);
                            
                            // 프로토콜 설정파일 경로를 저장한다.
                            device.bluetoothChannels[0].sensor.configFileUrl = serialConfigUrls['BLUETOOTH_' + device.number] || '';
                            device.serialChannels[0].sensor.configFileUrl = serialConfigUrls['SERIAL_' + device.number] || '';

                            me.deviceList.push(device);
                        }

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');

                        return Promise.resolve();
                    });
                });
            },
            onClickRefresh: function () {
                const me = this;

                me.disabled = true;

                me.load().then(function () {
                    me.disabled = false;
                });
            },
            onClickSave: function (device) {
                const me = this;

                let check = Device.validateDevice(device, me.deviceList);

                if (check.isOk) {
                    me.disabled = true;

                    apiRequest(DEVICE_SAVE_URL, device.getDataObject(), 'post').then(function () {
                        me.load().then(function () {
                            me.disabled = false;
                        });

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.disabled = false;
                    });

                } else {
                    alert(check.message);
                }
            },
            onClickDelete: function (device) {
                const me = this;

                me.$refs.deleteModal.show(device);
            },
            onConfirmDelete: function (bool, device) {
                const me = this;

                if (device && device.id > -1 && bool) {
                    me.disabled = true;

                    apiRequest(DEVICE_DELETE_URL, device.getDataObject(), 'post').then(function () {
                        me.load().then(function () {
                            me.disabled = false;
                        });

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.disabled = false;
                    });
                }
            },
            onClickAddDeviceModal: function () {
                const me = this;

                me.$refs.addDeviceModal.show();
            },
            onCreated: function () {
                const me = this;

                me.disabled = true;

                me.load().then(function () {
                    me.disabled = false;
                });
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
      return _c("div", { staticClass: "row d-flex flex-lg-row-reverse" }, [
        _c("div", { staticClass: "col-12" }, [
          _c("div", { staticClass: "row px-1 px-lg-5" }, [
            _c("div", { staticClass: "col-lg-2 mr-lg-3 px-0" }, [
              _c(
                "button",
                {
                  staticClass: "col-12 btn btn-outline-primary",
                  attrs: { disabled: _vm.disabled, type: "button" },
                  on: { click: _vm.onClickRefresh }
                },
                [_vm._v("Refresh")]
              )
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "col-lg-2 mr-lg-3 mt-2 mt-lg-0 px-0" }, [
              _c(
                "button",
                {
                  staticClass: "col-12 btn btn-outline-primary",
                  attrs: { disabled: _vm.disabled, type: "button" },
                  on: { click: _vm.onClickAddDeviceModal }
                },
                [_c("span", [_vm._v("Add device")])]
              )
            ])
          ])
        ]),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "col-12 mt-3" },
          [
            _c("add-device-modal", {
              ref: "addDeviceModal",
              attrs: { "device-list": _vm.deviceList },
              on: { created: _vm.onCreated }
            }),
            _vm._v(" "),
            _c(
              "confirm-modal",
              { ref: "deleteModal", on: { confirm: _vm.onConfirmDelete } },
              [
                _c(
                  "div",
                  {
                    staticClass: "h4 my-5 text-center",
                    attrs: { slot: "message" },
                    slot: "message"
                  },
                  [_c("span", [_vm._v("Delete this item?")])]
                )
              ]
            ),
            _vm._v(" "),
            _vm._l(_vm.deviceList, function(device, i) {
              return _c(
                "div",
                { key: i, staticClass: "row mb-3 px-1 px-lg-5" },
                [
                  _c(
                    "device-card",
                    {
                      staticClass: "col-12",
                      attrs: { device: device, disabled: _vm.disabled }
                    },
                    [
                      _c(
                        "div",
                        {
                          staticClass:
                            "h-100 d-lg-flex justify-content-lg-end align-items-lg-center",
                          attrs: { slot: "button" },
                          slot: "button"
                        },
                        [
                          device.typeCode != 0
                            ? _c(
                                "div",
                                {
                                  staticClass:
                                    "col-12 col-lg-3 mt-2 mt-lg-0 ml-lg-3 px-0"
                                },
                                [
                                  _c(
                                    "button",
                                    {
                                      staticClass: "w-100 btn btn-outline-danger",
                                      attrs: {
                                        disabled: _vm.disabled,
                                        type: "button"
                                      },
                                      on: {
                                        click: function($event) {
                                          return _vm.onClickDelete(device)
                                        }
                                      }
                                    },
                                    [_vm._v("Delete")]
                                  )
                                ]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _c(
                            "div",
                            {
                              staticClass:
                                "col-12 col-lg-3 mt-2 mt-lg-0 ml-lg-3 px-0"
                            },
                            [
                              _c(
                                "button",
                                {
                                  staticClass: "w-100 btn btn-primary",
                                  attrs: { disabled: _vm.disabled, type: "button" },
                                  on: {
                                    click: function($event) {
                                      return _vm.onClickSave(device)
                                    }
                                  }
                                },
                                [_vm._v("Save")]
                              )
                            ]
                          )
                        ]
                      )
                    ]
                  )
                ],
                1
              )
            })
          ],
          2
        )
      ])
    };
    var __vue_staticRenderFns__ = [];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = undefined;
      /* scoped */
      const __vue_scope_id__ = undefined;
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var DevicePage = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        undefined,
        undefined
      );

    new Vue({
        el: '#container',
        components: {
            'device-page': DevicePage,
        }
    });

})();
