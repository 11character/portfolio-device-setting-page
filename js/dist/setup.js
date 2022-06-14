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

    class SetupInfo {
        constructor (obj = {}) {
            obj = Utils.snakeObjToCamelObj(obj);

            this.serialDevice = obj.serialDevice || '';
            this.baudRate = obj.baudRate || '';
            this.serialDeviceMcu = obj.serialDeviceMcu || '';
            this.baudRateMcu = obj.baudRateMcu || '';
            this.requestInterval = obj.requestInterval || '';
            this.sdrChannel = obj.sdrChannel || '';
            this.serverType = obj.serverType || '';
            this.serverIp = obj.serverIp || '';
            this.serverPort = obj.serverPort || '';
            this.serverTopic = obj.serverTopic || '';
            this.apUse = !!obj.apUse;
            this.apSsid = obj.apSsid || '';
            this.apPassword = obj.apPassword || '';
            this.apChannel = obj.apChannel || '';
            this.useBootingLog = !!obj.useBootingLog;
            this.useMessageLog = !!obj.useMessageLog;
            this.useNetworkLog = !!obj.useNetworkLog;
        }

        getDataObject() {
            const me = this;

            return {
                serialDevice: me.serialDevice,
                baudRate: me.baudRate,
                serialDeviceMcu: me.serialDeviceMcu,
                baudRateMcu: me.baudRateMcu,
                requestInterval: me.requestInterval,
                sdrChannel: me.sdrChannel,
                serverType: me.serverType,
                serverIp: me.serverIp,
                serverPort: me.serverPort,
                serverTopic: me.serverTopic,
                apUse: (me.apUse ? 1 : 0),
                apSsid: me.apSsid,
                apPassword: me.apPassword,
                apChannel: me.apChannel,
                useBootingLog: (me.useBootingLog ? 1 : 0),
                useMessageLog: (me.useMessageLog ? 1 : 0),
                useNetworkLog: (me.useNetworkLog ? 1 : 0)
            };
        }

        validate() {
            const me = this;

            const isOk = me.serialDevice != me.serialDeviceMcu;

            return {
                isOk: isOk,
                message: isOk ? '' : 'SERIAL DEVICE 는 같은 이름을 가질 수 없습니다.',
            };
        }
    }

    //

    var script = {
        data: function () {
            return {
                setupInfo: new SetupInfo(),
                disabled: true,
                rateArr: RATE_ARR,
                isSdrChannelChange: false,
                showMcu: false,
            };
        },
        mounted: function () {
            const me = this;

            me.disabled = true;

            apiRequest(SETUP_INPO_URL, {}, 'get').then(function (obj) {
                const data = obj.data;

                me.setupInfo = new SetupInfo(data);

                me.disabled = false;

                // SDR channel 변경 감지.
                me.$watch(function () {
                    return me.setupInfo.sdrChannel;

                }, function () {
                    me.isSdrChannelChange = true;
                });

            }).catch(function (error) {
                console.error(error);
                alert('processing error.');
                me.disabled = false;
            });
        },
        methods: {
            save: function () {
                const me = this;

                const check = me.setupInfo.validate();

                if (check.isOk) {
                    const dataObj = me.setupInfo.getDataObject();

                    return apiRequest(SETUP_SAVE_URL, dataObj, 'post').then(function () {
                        // SDR channel 변경시 필요한 작업.
                        if (me.isSdrChannelChange) {
                            $.ajax({method: 'get', url: SDR_CHANNEL_CHANGE_URL, data: {channel_num: dataObj.sdrChannel}});
                        }

                        me.disabled = false;

                    }).catch(function (error) {
                        console.error(error);
                        alert('processing error.');
                        me.disabled = false;
                    });

                } else {
                    alert(check.message);

                    me.disabled = false;
                    me.showMcu = true;
                }
            },
            onClickSave: function () {
                const me = this;

                me.disabled = true;

                me.save();
            },
            onClickReboot: function () {
                const me = this;

                me.disabled = true;

                me.save().then(function () {
                    $.ajax({method: 'get', url: SERVER_REBOOT_URL});
                });
            },
            onClickRestart: function () {
                const me = this;

                me.disabled = true;

                me.save().then(function () {
                    $.ajax({method: 'get', url: SERVER_RESTART_URL});
                });
            },
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
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "row px-1 px-lg-5" }, [
        _c("div", { staticClass: "card col-12" }, [
          _c("div", { staticClass: "card-body" }, [
            _c("div", { staticClass: "row" }, [
              _c("div", { staticClass: "col-lg-6" }, [
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
                          value: _vm.setupInfo.serialDevice,
                          expression: "setupInfo.serialDevice",
                          modifiers: { trim: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "text" },
                      domProps: { value: _vm.setupInfo.serialDevice },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.setupInfo,
                            "serialDevice",
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
                            rawName: "v-model",
                            value: _vm.setupInfo.baudRate,
                            expression: "setupInfo.baudRate"
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
                                return val
                              });
                            _vm.$set(
                              _vm.setupInfo,
                              "baudRate",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            );
                          }
                        }
                      },
                      _vm._l(_vm.rateArr, function(rate, i) {
                        return _c("option", { key: i, domProps: { value: rate } }, [
                          _vm._v(_vm._s(rate))
                        ])
                      }),
                      0
                    )
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "col-12 text-right" }, [
                    _c(
                      "div",
                      {
                        staticClass:
                          "custom-control custom-checkbox custom-control-inline"
                      },
                      [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.showMcu,
                              expression: "showMcu"
                            }
                          ],
                          staticClass: "custom-control-input",
                          attrs: {
                            disabled: _vm.disabled,
                            id: "check-show-mcu",
                            type: "checkbox"
                          },
                          domProps: {
                            checked: Array.isArray(_vm.showMcu)
                              ? _vm._i(_vm.showMcu, null) > -1
                              : _vm.showMcu
                          },
                          on: {
                            change: function($event) {
                              var $$a = _vm.showMcu,
                                $$el = $event.target,
                                $$c = $$el.checked ? true : false;
                              if (Array.isArray($$a)) {
                                var $$v = null,
                                  $$i = _vm._i($$a, $$v);
                                if ($$el.checked) {
                                  $$i < 0 && (_vm.showMcu = $$a.concat([$$v]));
                                } else {
                                  $$i > -1 &&
                                    (_vm.showMcu = $$a
                                      .slice(0, $$i)
                                      .concat($$a.slice($$i + 1)));
                                }
                              } else {
                                _vm.showMcu = $$c;
                              }
                            }
                          }
                        }),
                        _vm._v(" "),
                        _c(
                          "label",
                          {
                            staticClass: "custom-control-label h6",
                            attrs: { for: "check-show-mcu" }
                          },
                          [_vm._v("Show MCU")]
                        )
                      ]
                    )
                  ])
                ]),
                _vm._v(" "),
                _vm.showMcu
                  ? _c("div", { staticClass: "row mt-1" }, [
                      _c("div", { staticClass: "col-12" }, [
                        _c("div", { staticClass: "card" }, [
                          _c("div", { staticClass: "card-body" }, [
                            _c("div", { staticClass: "row" }, [
                              _vm._m(3),
                              _vm._v(" "),
                              _c("div", { staticClass: "col-lg-8" }, [
                                _c("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model.trim",
                                      value: _vm.setupInfo.serialDeviceMcu,
                                      expression: "setupInfo.serialDeviceMcu",
                                      modifiers: { trim: true }
                                    }
                                  ],
                                  staticClass: "form-control form-control-sm",
                                  attrs: { disabled: _vm.disabled, type: "text" },
                                  domProps: {
                                    value: _vm.setupInfo.serialDeviceMcu
                                  },
                                  on: {
                                    input: function($event) {
                                      if ($event.target.composing) {
                                        return
                                      }
                                      _vm.$set(
                                        _vm.setupInfo,
                                        "serialDeviceMcu",
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
                              _vm._m(4),
                              _vm._v(" "),
                              _c("div", { staticClass: "col-lg-8" }, [
                                _c(
                                  "select",
                                  {
                                    directives: [
                                      {
                                        name: "model",
                                        rawName: "v-model",
                                        value: _vm.setupInfo.baudRateMcu,
                                        expression: "setupInfo.baudRateMcu"
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
                                            var val =
                                              "_value" in o ? o._value : o.value;
                                            return val
                                          });
                                        _vm.$set(
                                          _vm.setupInfo,
                                          "baudRateMcu",
                                          $event.target.multiple
                                            ? $$selectedVal
                                            : $$selectedVal[0]
                                        );
                                      }
                                    }
                                  },
                                  _vm._l(_vm.rateArr, function(rate, i) {
                                    return _c(
                                      "option",
                                      { key: i, domProps: { value: rate } },
                                      [_vm._v(_vm._s(rate))]
                                    )
                                  }),
                                  0
                                )
                              ])
                            ])
                          ])
                        ])
                      ])
                    ])
                  : _vm._e(),
                _vm._v(" "),
                _c("div", { staticClass: "row mt-4" }, [
                  _vm._m(5),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: _vm.setupInfo.requestInterval,
                          expression: "setupInfo.requestInterval",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: _vm.setupInfo.requestInterval },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.setupInfo,
                            "requestInterval",
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
                  _vm._m(6),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: _vm.setupInfo.sdrChannel,
                          expression: "setupInfo.sdrChannel",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: _vm.setupInfo.sdrChannel },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.setupInfo,
                            "sdrChannel",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-6 pt-5 pt-lg-0" }, [
                _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "col-12 pb-3" }, [
                    _c("span", { staticClass: "h4 mr-3" }, [_vm._v("SERVER")]),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass:
                          "custom-control custom-radio custom-control-inline"
                      },
                      [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.setupInfo.serverType,
                              expression: "setupInfo.serverType"
                            }
                          ],
                          staticClass: "custom-control-input",
                          attrs: {
                            disabled: _vm.disabled,
                            type: "radio",
                            id: "server-type-tcpip",
                            name: "serverType",
                            value: "tcpip"
                          },
                          domProps: {
                            checked: _vm._q(_vm.setupInfo.serverType, "tcpip")
                          },
                          on: {
                            change: function($event) {
                              return _vm.$set(_vm.setupInfo, "serverType", "tcpip")
                            }
                          }
                        }),
                        _vm._v(" "),
                        _vm._m(7)
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass:
                          "custom-control custom-radio custom-control-inline"
                      },
                      [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.setupInfo.serverType,
                              expression: "setupInfo.serverType"
                            }
                          ],
                          staticClass: "custom-control-input",
                          attrs: {
                            disabled: _vm.disabled,
                            type: "radio",
                            id: "server-type-restfulapi",
                            name: "serverType",
                            value: "restfulapi"
                          },
                          domProps: {
                            checked: _vm._q(_vm.setupInfo.serverType, "restfulapi")
                          },
                          on: {
                            change: function($event) {
                              return _vm.$set(
                                _vm.setupInfo,
                                "serverType",
                                "restfulapi"
                              )
                            }
                          }
                        }),
                        _vm._v(" "),
                        _vm._m(8)
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass:
                          "custom-control custom-radio custom-control-inline"
                      },
                      [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.setupInfo.serverType,
                              expression: "setupInfo.serverType"
                            }
                          ],
                          staticClass: "custom-control-input",
                          attrs: {
                            disabled: _vm.disabled,
                            type: "radio",
                            id: "server-type-mqtt",
                            name: "serverType",
                            value: "mqtt"
                          },
                          domProps: {
                            checked: _vm._q(_vm.setupInfo.serverType, "mqtt")
                          },
                          on: {
                            change: function($event) {
                              return _vm.$set(_vm.setupInfo, "serverType", "mqtt")
                            }
                          }
                        }),
                        _vm._v(" "),
                        _vm._m(9)
                      ]
                    )
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(10),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.trim",
                          value: _vm.setupInfo.serverIp,
                          expression: "setupInfo.serverIp",
                          modifiers: { trim: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "text" },
                      domProps: { value: _vm.setupInfo.serverIp },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.setupInfo,
                            "serverIp",
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
                  _vm._m(11),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.trim",
                          value: _vm.setupInfo.serverPort,
                          expression: "setupInfo.serverPort",
                          modifiers: { trim: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "text" },
                      domProps: { value: _vm.setupInfo.serverPort },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.setupInfo,
                            "serverPort",
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
                _vm.setupInfo.serverType == "mqtt"
                  ? _c("div", { staticClass: "row" }, [
                      _vm._m(12),
                      _vm._v(" "),
                      _c("div", { staticClass: "col-lg-8" }, [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model.trim",
                              value: _vm.setupInfo.serverTopic,
                              expression: "setupInfo.serverTopic",
                              modifiers: { trim: true }
                            }
                          ],
                          staticClass: "form-control form-control-sm",
                          attrs: { disabled: _vm.disabled, type: "text" },
                          domProps: { value: _vm.setupInfo.serverTopic },
                          on: {
                            input: function($event) {
                              if ($event.target.composing) {
                                return
                              }
                              _vm.$set(
                                _vm.setupInfo,
                                "serverTopic",
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
                  : _vm._e()
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-6 pt-5" }, [
                _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "col-12 pb-3" }, [
                    _c("span", { staticClass: "h4 mr-3" }, [_vm._v("AP (Wi-Fi)")]),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass:
                          "custom-control custom-checkbox custom-control-inline"
                      },
                      [
                        _c("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: _vm.setupInfo.apUse,
                              expression: "setupInfo.apUse"
                            }
                          ],
                          staticClass: "custom-control-input",
                          attrs: {
                            disabled: _vm.disabled,
                            id: "check-use-wifi",
                            type: "checkbox"
                          },
                          domProps: {
                            checked: Array.isArray(_vm.setupInfo.apUse)
                              ? _vm._i(_vm.setupInfo.apUse, null) > -1
                              : _vm.setupInfo.apUse
                          },
                          on: {
                            change: function($event) {
                              var $$a = _vm.setupInfo.apUse,
                                $$el = $event.target,
                                $$c = $$el.checked ? true : false;
                              if (Array.isArray($$a)) {
                                var $$v = null,
                                  $$i = _vm._i($$a, $$v);
                                if ($$el.checked) {
                                  $$i < 0 &&
                                    _vm.$set(
                                      _vm.setupInfo,
                                      "apUse",
                                      $$a.concat([$$v])
                                    );
                                } else {
                                  $$i > -1 &&
                                    _vm.$set(
                                      _vm.setupInfo,
                                      "apUse",
                                      $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                                    );
                                }
                              } else {
                                _vm.$set(_vm.setupInfo, "apUse", $$c);
                              }
                            }
                          }
                        }),
                        _vm._v(" "),
                        _c(
                          "label",
                          {
                            staticClass: "custom-control-label h6",
                            attrs: { for: "check-use-wifi" }
                          },
                          [_vm._v("Use")]
                        )
                      ]
                    )
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "row" }, [
                  _vm._m(13),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.trim",
                          value: _vm.setupInfo.apSsid,
                          expression: "setupInfo.apSsid",
                          modifiers: { trim: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "text" },
                      domProps: { value: _vm.setupInfo.apSsid },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.setupInfo,
                            "apSsid",
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
                  _vm._m(14),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.trim",
                          value: _vm.setupInfo.apPassword,
                          expression: "setupInfo.apPassword",
                          modifiers: { trim: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "text" },
                      domProps: { value: _vm.setupInfo.apPassword },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.setupInfo,
                            "apPassword",
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
                  _vm._m(15),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-8" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.number",
                          value: _vm.setupInfo.apChannel,
                          expression: "setupInfo.apChannel",
                          modifiers: { number: true }
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { disabled: _vm.disabled, type: "number" },
                      domProps: { value: _vm.setupInfo.apChannel },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.setupInfo,
                            "apChannel",
                            _vm._n($event.target.value)
                          );
                        },
                        blur: function($event) {
                          return _vm.$forceUpdate()
                        }
                      }
                    })
                  ])
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-12 pt-5 pt-lg-0" }, [
                _c("div", { staticClass: "row" }, [
                  _c("div", { staticClass: "offset-lg-10 col-12 col-lg-2" }, [
                    _c(
                      "button",
                      {
                        staticClass: "w-100 btn btn-primary",
                        attrs: { disabled: _vm.disabled, type: "button" },
                        on: { click: _vm.onClickSave }
                      },
                      [_c("span", [_vm._v("Save")])]
                    )
                  ])
                ])
              ])
            ])
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "card col-12 mt-5" }, [
          _c("div", { staticClass: "card-body" }, [
            _c("div", { staticClass: "row" }, [
              _c("div", { staticClass: "col-12 col-lg-2" }, [
                _c(
                  "button",
                  {
                    staticClass: "w-100 btn btn-outline-primary",
                    attrs: { disabled: _vm.disabled, type: "button" },
                    on: { click: _vm.onClickReboot }
                  },
                  [_c("span", [_vm._v("Reboot")])]
                )
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "col-12 col-lg-2 mt-3 mt-lg-0" }, [
                _c(
                  "button",
                  {
                    staticClass: "w-100 btn btn-outline-primary",
                    attrs: { disabled: _vm.disabled, type: "button" },
                    on: { click: _vm.onClickRestart }
                  },
                  [_c("span", [_vm._v("Restart")])]
                )
              ])
            ])
          ])
        ])
      ])
    };
    var __vue_staticRenderFns__ = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "row" }, [
          _c("div", { staticClass: "col-12 pb-3" }, [
            _c("span", { staticClass: "h4" }, [_vm._v("SDR (SERIAL)")])
          ])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("SERIAL DEVICE")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("BAUD RATE")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("SERIAL DEVICE MCU")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("BAUD RATE MCU")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("REQUEST INTERVAL(ms)")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("CHANNEL")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          {
            staticClass: "custom-control-label",
            attrs: { for: "server-type-tcpip" }
          },
          [_c("span", [_vm._v("TCP/IP")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          {
            staticClass: "custom-control-label",
            attrs: { for: "server-type-restfulapi" }
          },
          [_c("span", [_vm._v("Restful API")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "label",
          {
            staticClass: "custom-control-label",
            attrs: { for: "server-type-mqtt" }
          },
          [_c("span", [_vm._v("MQTT")])]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("IP")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("PORT")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("TOPIC")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("SSID")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("PASSWORD")])
        ])
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("label", { staticClass: "h6 col-lg-4 col-form-label" }, [
          _c("span", [_vm._v("CHANNEL")])
        ])
      }
    ];
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
      

      
      var SetupPage = normalizeComponent_1(
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
            'setup-page': SetupPage
        }
    });

})();
