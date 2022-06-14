(function () {
    'use strict';

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

    //

    var script$3 = {
        props: {
            sensor: {type: Sensor, default: () => new Sensor()},
            disabled: {type: Boolean, default: false}
        },
        data: function () {
            const me = this;

            return {
                uid: me._uid
            };
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
    const __vue_script__$3 = script$3;

    /* template */
    var __vue_render__$3 = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "card" }, [
        _c("div", { staticClass: "card-body d-flex flex-wrap" }, [
          _c("div", { staticClass: "col-lg-9" }, [
            _c("div", { staticClass: "row" }, [
              _vm._m(0),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-8" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.sensor.name,
                      expression: "sensor.name",
                      modifiers: { trim: true }
                    }
                  ],
                  staticClass: "form-control form-control-sm",
                  attrs: { disabled: _vm.disabled, type: "text" },
                  domProps: { value: _vm.sensor.name },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.sensor, "name", $event.target.value.trim());
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
              _vm._m(1),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-8" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.number",
                      value: _vm.sensor.minVoltage,
                      expression: "sensor.minVoltage",
                      modifiers: { number: true }
                    }
                  ],
                  staticClass: "form-control form-control-sm",
                  attrs: { disabled: _vm.disabled, type: "number" },
                  domProps: { value: _vm.sensor.minVoltage },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.sensor,
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
              _vm._m(2),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-8" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.number",
                      value: _vm.sensor.maxVoltage,
                      expression: "sensor.maxVoltage",
                      modifiers: { number: true }
                    }
                  ],
                  staticClass: "form-control form-control-sm",
                  attrs: { disabled: _vm.disabled, type: "number" },
                  domProps: { value: _vm.sensor.maxVoltage },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.sensor,
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
              _vm._m(3),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-8" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.number",
                      value: _vm.sensor.minValue,
                      expression: "sensor.minValue",
                      modifiers: { number: true }
                    }
                  ],
                  staticClass: "form-control form-control-sm",
                  attrs: { disabled: _vm.disabled, type: "number" },
                  domProps: { value: _vm.sensor.minValue },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.sensor, "minValue", _vm._n($event.target.value));
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
                      value: _vm.sensor.maxValue,
                      expression: "sensor.maxValue",
                      modifiers: { number: true }
                    }
                  ],
                  staticClass: "form-control form-control-sm",
                  attrs: { disabled: _vm.disabled, type: "number" },
                  domProps: { value: _vm.sensor.maxValue },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.sensor, "maxValue", _vm._n($event.target.value));
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
              _c("div", { staticClass: "col-12 pt-3" }, [
                _c("div", { staticClass: "custom-control custom-checkbox" }, [
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.sensor.isUse,
                        expression: "sensor.isUse"
                      }
                    ],
                    staticClass: "custom-control-input",
                    attrs: {
                      id: "check-use-sensor-" + _vm.uid,
                      disabled: _vm.disabled,
                      type: "checkbox"
                    },
                    domProps: {
                      checked: Array.isArray(_vm.sensor.isUse)
                        ? _vm._i(_vm.sensor.isUse, null) > -1
                        : _vm.sensor.isUse
                    },
                    on: {
                      change: function($event) {
                        var $$a = _vm.sensor.isUse,
                          $$el = $event.target,
                          $$c = $$el.checked ? true : false;
                        if (Array.isArray($$a)) {
                          var $$v = null,
                            $$i = _vm._i($$a, $$v);
                          if ($$el.checked) {
                            $$i < 0 &&
                              _vm.$set(_vm.sensor, "isUse", $$a.concat([$$v]));
                          } else {
                            $$i > -1 &&
                              _vm.$set(
                                _vm.sensor,
                                "isUse",
                                $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                              );
                          }
                        } else {
                          _vm.$set(_vm.sensor, "isUse", $$c);
                        }
                      }
                    }
                  }),
                  _vm._v(" "),
                  _c(
                    "label",
                    {
                      staticClass: "custom-control-label h6",
                      attrs: { for: "check-use-sensor-" + _vm.uid }
                    },
                    [_vm._v("Use")]
                  )
                ])
              ])
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-lg-3" }, [_vm._t("button")], 2)
        ])
      ])
    };
    var __vue_staticRenderFns__$3 = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("Sensor name")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("Min Voltage(V)")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("Max Voltage(V)")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("Min Value")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("Max Value")])
        ])
      }
    ];
    __vue_render__$3._withStripped = true;

      /* style */
      const __vue_inject_styles__$3 = undefined;
      /* scoped */
      const __vue_scope_id__$3 = undefined;
      /* module identifier */
      const __vue_module_identifier__$3 = undefined;
      /* functional template */
      const __vue_is_functional_template__$3 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var SensorCardVue = normalizeComponent_1(
        { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
        __vue_inject_styles__$3,
        __vue_script__$3,
        __vue_scope_id__$3,
        __vue_is_functional_template__$3,
        __vue_module_identifier__$3,
        undefined,
        undefined
      );

    //

    /**
     * Template event : itemselect, load
     */
    var script$2 = {
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

    /* script */
    const __vue_script__$2 = script$2;

    /* template */
    var __vue_render__$2 = function() {
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
    var __vue_staticRenderFns__$2 = [];
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
      

      
      var SensorListVue = normalizeComponent_1(
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
    var script$1 = {
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
    var __vue_staticRenderFns__$1 = [];
    __vue_render__$1._withStripped = true;

      /* style */
      const __vue_inject_styles__$1 = undefined;
      /* scoped */
      const __vue_scope_id__$1 = undefined;
      /* module identifier */
      const __vue_module_identifier__$1 = undefined;
      /* functional template */
      const __vue_is_functional_template__$1 = false;
      /* style inject */
      
      /* style inject SSR */
      

      
      var ConfirmModalVue = normalizeComponent_1(
        { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
        __vue_inject_styles__$1,
        __vue_script__$1,
        __vue_scope_id__$1,
        __vue_is_functional_template__$1,
        __vue_module_identifier__$1,
        undefined,
        undefined
      );

    //

    var script = {
        components: {
            'sensor-card': SensorCardVue,
            'sensor-list': SensorListVue,
            'confirm-modal': ConfirmModalVue
        },
        data: function () {
            return {
                sensor: new Sensor({
                    type: 'analog',
                    minVoltage: 0,
                    maxVoltage: 5,
                    minValue: 0,
                    maxValue:5
                }),
                disabled: true,
                sdDisabled: false
            }
        },
        mounted: function () {
            const me = this;

            me.$refs.list.load();
        },
        methods: {
            valueCheck: function () {
                const me = this;

                const bool = me.sensor.name != ''
                    && typeof me.sensor.minVoltage == 'number'
                    && typeof me.sensor.maxVoltage == 'number'
                    && typeof me.sensor.minValue == 'number'
                    && typeof me.sensor.maxValue == 'number';

                return bool;
            },
            onCreate: function () {
                const me = this;

                me.disabled = true;

                me.$refs.list.load();
            },
            onSelectSensor: function (sensor) {
                const me = this;

                // 목록에 있는 값을 변경하지 않기 위해 객체를 복사하여 사용한다.
                me.sensor = new Sensor(sensor);
            },
            onLoadSensorList: function (sensorList) {
                const me = this;

                me.disabled = false;
                me.sdDisabled = sensorList.length < 1;
            },
            onClickNew: function () {
                const me = this;

                const sensor = me.sensor;

                if (me.valueCheck()) {
                    me.disabled = true;

                    apiRequest(SENSOR_CREATE_URL, sensor.getDataObject(), 'post').then(function () {
                        me.$refs.list.load();

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.$refs.list.load();
                    });

                } else {
                    alert('모든 값을 넣어주세요.');
                }
            },
            onClickSave: function () {
                const me = this;

                const sensor = me.sensor;

                if (sensor.id > -1) {
                    if (me.valueCheck()) {
                        me.disabled = true;

                        apiRequest(SENSOR_SAVE_URL, sensor.getDataObject(), 'post').then(function () {
                            me.$refs.list.load(true);

                        }).catch(function (error) {
                            console.error(error);
                            alert('processing error.');
                            me.$refs.list.load(true);
                        });

                    } else {
                        alert('모든 값을 넣어주세요.');
                    }
                }
            },
            onClickDelete: function () {
                const me = this;

                me.$refs.deleteModal.show();
            },
            onConfirmDelete: function (bool) {
                const me = this;

                const sensor = me.sensor;

                if (sensor.id > -1 && bool) {
                    me.disabled = true;

                    apiRequest(SENSOR_DELETE_URL, sensor.getDataObject(), 'post').then(function () {
                        me.$refs.list.load();

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.$refs.list.load();
                    });

                    me.sensor = new Sensor({
                        type: 'analog',
                        minVoltage: 0,
                        maxVoltage: 5,
                        minValue: 0,
                        maxValue:5
                    });
                }
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
        { staticClass: "row d-flex flex-lg-nowrap flex-lg-row-reverse" },
        [
          _c("div", { staticClass: "col-12 col-lg-3" }, [
            _c(
              "div",
              { staticClass: "row px-1 pr-lg-5" },
              [
                _c("sensor-list", {
                  ref: "list",
                  attrs: { disabled: _vm.disabled },
                  on: { itemselect: _vm.onSelectSensor, load: _vm.onLoadSensorList }
                })
              ],
              1
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-12 col-lg-9 mt-3 mt-lg-0" }, [
            _c(
              "div",
              { staticClass: "row px-1 px-lg-5" },
              [
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
                      [
                        _vm._v(
                          "\n                    Delete this item?\n                "
                        )
                      ]
                    )
                  ]
                ),
                _vm._v(" "),
                _c(
                  "sensor-card",
                  {
                    staticClass: "col-12",
                    attrs: { sensor: _vm.sensor, disabled: _vm.disabled }
                  },
                  [
                    _c(
                      "div",
                      {
                        staticClass: "row mt-3 mt-lg-0 px-3",
                        attrs: { slot: "button" },
                        slot: "button"
                      },
                      [
                        _c(
                          "button",
                          {
                            staticClass: "col-12 btn btn-outline-primary",
                            attrs: { disabled: _vm.disabled, type: "button" },
                            on: { click: _vm.onClickNew }
                          },
                          [_c("span", [_vm._v("New")])]
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass: "row mt-2 px-3",
                        attrs: { slot: "button" },
                        slot: "button"
                      },
                      [
                        _c(
                          "button",
                          {
                            staticClass: "col-12 btn btn-outline-primary",
                            attrs: {
                              disabled: _vm.disabled || _vm.sdDisabled,
                              type: "button"
                            },
                            on: { click: _vm.onClickSave }
                          },
                          [_c("span", [_vm._v("Save")])]
                        )
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass: "row mt-2 px-3",
                        attrs: { slot: "button" },
                        slot: "button"
                      },
                      [
                        _c(
                          "button",
                          {
                            staticClass: "col-12 btn btn-outline-danger",
                            attrs: {
                              disabled: _vm.disabled || _vm.sdDisabled,
                              type: "button"
                            },
                            on: { click: _vm.onClickDelete }
                          },
                          [_c("span", [_vm._v("Delete")])]
                        )
                      ]
                    )
                  ]
                )
              ],
              1
            )
          ])
        ]
      )
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
      

      
      var SensorPage = normalizeComponent_1(
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
            'sensor-page': SensorPage,
        }
    });

})();
