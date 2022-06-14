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
                disabled: false,
                setupInfo: new SetupInfo()
            }
        },
        mounted: function () {
            const me = this;

            me.disabled = true;

            apiRequest(SETUP_INPO_URL, {}, 'get').then(function (obj) {
                const data = obj.data;

                me.setupInfo = new SetupInfo(data);

                me.disabled = false;

            }).catch(function (error) {
                console.error(error);
                alert('processing error.');
                me.disabled = false;
            });
        },
        methods: {
            onClickSave: function () {
                const me = this;

                me.disabled = true;

                return apiRequest(SETUP_SAVE_URL, me.setupInfo.getDataObject(), 'post').then(function () {
                    me.setupInfo.apPassword = '';
                    me.disabled = false;

                }).catch(function (error) {
                    console.error(error);
                    alert('processing error.');
                    me.disabled = false;
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
    const __vue_script__ = script;

    /* template */
    var __vue_render__ = function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "row px-1 px-lg-5" }, [
        _c("div", { staticClass: "col-lg-2" }, [
          _c("div", { staticClass: "card" }, [
            _c("div", { staticClass: "card-body" }, [
              _c("div", { staticClass: "row" }, [
                _c("div", { staticClass: "col-12" }, [
                  _c("div", { staticClass: "custom-control custom-checkbox" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.setupInfo.useBootingLog,
                          expression: "setupInfo.useBootingLog"
                        }
                      ],
                      staticClass: "custom-control-input",
                      attrs: {
                        disabled: _vm.disabled,
                        id: "booting-check",
                        type: "checkbox"
                      },
                      domProps: {
                        checked: Array.isArray(_vm.setupInfo.useBootingLog)
                          ? _vm._i(_vm.setupInfo.useBootingLog, null) > -1
                          : _vm.setupInfo.useBootingLog
                      },
                      on: {
                        change: function($event) {
                          var $$a = _vm.setupInfo.useBootingLog,
                            $$el = $event.target,
                            $$c = $$el.checked ? true : false;
                          if (Array.isArray($$a)) {
                            var $$v = null,
                              $$i = _vm._i($$a, $$v);
                            if ($$el.checked) {
                              $$i < 0 &&
                                _vm.$set(
                                  _vm.setupInfo,
                                  "useBootingLog",
                                  $$a.concat([$$v])
                                );
                            } else {
                              $$i > -1 &&
                                _vm.$set(
                                  _vm.setupInfo,
                                  "useBootingLog",
                                  $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                                );
                            }
                          } else {
                            _vm.$set(_vm.setupInfo, "useBootingLog", $$c);
                          }
                        }
                      }
                    }),
                    _vm._v(" "),
                    _c(
                      "label",
                      {
                        staticClass: "custom-control-label",
                        attrs: { for: "booting-check" }
                      },
                      [_vm._v("Booting")]
                    )
                  ])
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "row mt-3" }, [
                _c("div", { staticClass: "col-12" }, [
                  _c("div", { staticClass: "custom-control custom-checkbox" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.setupInfo.useMessageLog,
                          expression: "setupInfo.useMessageLog"
                        }
                      ],
                      staticClass: "custom-control-input",
                      attrs: {
                        disabled: _vm.disabled,
                        id: "message-check",
                        type: "checkbox"
                      },
                      domProps: {
                        checked: Array.isArray(_vm.setupInfo.useMessageLog)
                          ? _vm._i(_vm.setupInfo.useMessageLog, null) > -1
                          : _vm.setupInfo.useMessageLog
                      },
                      on: {
                        change: function($event) {
                          var $$a = _vm.setupInfo.useMessageLog,
                            $$el = $event.target,
                            $$c = $$el.checked ? true : false;
                          if (Array.isArray($$a)) {
                            var $$v = null,
                              $$i = _vm._i($$a, $$v);
                            if ($$el.checked) {
                              $$i < 0 &&
                                _vm.$set(
                                  _vm.setupInfo,
                                  "useMessageLog",
                                  $$a.concat([$$v])
                                );
                            } else {
                              $$i > -1 &&
                                _vm.$set(
                                  _vm.setupInfo,
                                  "useMessageLog",
                                  $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                                );
                            }
                          } else {
                            _vm.$set(_vm.setupInfo, "useMessageLog", $$c);
                          }
                        }
                      }
                    }),
                    _vm._v(" "),
                    _c(
                      "label",
                      {
                        staticClass: "custom-control-label",
                        attrs: { for: "message-check" }
                      },
                      [_vm._v("Message")]
                    )
                  ])
                ])
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "row mt-3" }, [
                _c("div", { staticClass: "col-12" }, [
                  _c("div", { staticClass: "custom-control custom-checkbox" }, [
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.setupInfo.useNetworkLog,
                          expression: "setupInfo.useNetworkLog"
                        }
                      ],
                      staticClass: "custom-control-input",
                      attrs: {
                        disabled: _vm.disabled,
                        id: "network-check",
                        type: "checkbox"
                      },
                      domProps: {
                        checked: Array.isArray(_vm.setupInfo.useNetworkLog)
                          ? _vm._i(_vm.setupInfo.useNetworkLog, null) > -1
                          : _vm.setupInfo.useNetworkLog
                      },
                      on: {
                        change: function($event) {
                          var $$a = _vm.setupInfo.useNetworkLog,
                            $$el = $event.target,
                            $$c = $$el.checked ? true : false;
                          if (Array.isArray($$a)) {
                            var $$v = null,
                              $$i = _vm._i($$a, $$v);
                            if ($$el.checked) {
                              $$i < 0 &&
                                _vm.$set(
                                  _vm.setupInfo,
                                  "useNetworkLog",
                                  $$a.concat([$$v])
                                );
                            } else {
                              $$i > -1 &&
                                _vm.$set(
                                  _vm.setupInfo,
                                  "useNetworkLog",
                                  $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                                );
                            }
                          } else {
                            _vm.$set(_vm.setupInfo, "useNetworkLog", $$c);
                          }
                        }
                      }
                    }),
                    _vm._v(" "),
                    _c(
                      "label",
                      {
                        staticClass: "custom-control-label",
                        attrs: { for: "network-check" }
                      },
                      [_vm._v("Network")]
                    )
                  ])
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
                      on: { click: _vm.onClickSave }
                    },
                    [_c("span", [_vm._v("Save")])]
                  )
                ])
              ])
            ])
          ])
        ]),
        _vm._v(" "),
        _vm._m(0)
      ])
    };
    var __vue_staticRenderFns__ = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("div", { staticClass: "col-lg-10 mt-3 mt-lg-0" }, [
          _c("div", { staticClass: "card" }, [
            _c("div", { staticClass: "card-body p-0 pb-0" }, [
              _c("iframe", {
                staticClass: "log-iframe",
                attrs: { src: "./sample-page.php", frameborder: "0" }
              })
            ])
          ])
        ])
      }
    ];
    __vue_render__._withStripped = true;

      /* style */
      const __vue_inject_styles__ = function (inject) {
        if (!inject) return
        inject("data-v-b987dc1c_0", { source: "\n.log-iframe[data-v-b987dc1c] {\n    display: block;\n    width: 100%;\n    height: 800px;\n}\n", map: {"version":3,"sources":["D:\\project\\www\\portfolio-device-page\\js\\src\\vue\\systemLog\\systemLogPage.vue"],"names":[],"mappings":";AA6HA;IACA,cAAA;IACA,WAAA;IACA,aAAA;AACA","file":"systemLogPage.vue","sourcesContent":["<template>\r\n    <div class=\"row px-1 px-lg-5\">\r\n        <div class=\"col-lg-2\">\r\n            <div class=\"card\">\r\n                <div class=\"card-body\">\r\n                    <div class=\"row\">\r\n                        <div class=\"col-12\">\r\n                            <div class=\"custom-control custom-checkbox\">\r\n                                <input\r\n                                    v-model=\"setupInfo.useBootingLog\"\r\n                                    :disabled=\"disabled\"\r\n                                    id=\"booting-check\"\r\n                                    type=\"checkbox\"\r\n                                    class=\"custom-control-input\">\r\n\r\n                                <label class=\"custom-control-label\" for=\"booting-check\">Booting</label>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row mt-3\">\r\n                        <div class=\"col-12\">\r\n                            <div class=\"custom-control custom-checkbox\">\r\n                                <input\r\n                                    v-model=\"setupInfo.useMessageLog\"\r\n                                    :disabled=\"disabled\"\r\n                                    id=\"message-check\"\r\n                                    type=\"checkbox\"\r\n                                    class=\"custom-control-input\">\r\n\r\n                                <label class=\"custom-control-label\" for=\"message-check\">Message</label>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row mt-3\">\r\n                        <div class=\"col-12\">\r\n                            <div class=\"custom-control custom-checkbox\">\r\n                                <input\r\n                                    v-model=\"setupInfo.useNetworkLog\"\r\n                                    :disabled=\"disabled\"\r\n                                    id=\"network-check\"\r\n                                    type=\"checkbox\"\r\n                                    class=\"custom-control-input\">\r\n\r\n                                <label class=\"custom-control-label\" for=\"network-check\">Network</label>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"row mt-3\">\r\n                        <div class=\"col-12\">\r\n                            <button\r\n                                :disabled=\"disabled\"\r\n                                @click=\"onClickSave\"\r\n                                type=\"button\"\r\n                                class=\"w-100 btn btn-primary\">\r\n\r\n                                <span>Save</span>\r\n                            </button>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"col-lg-10 mt-3 mt-lg-0\">\r\n            <div class=\"card\">\r\n                <div class=\"card-body p-0 pb-0\">\r\n                    <iframe class=\"log-iframe\" src=\"./sample-page.php\" frameborder=\"0\"></iframe>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>\r\n\r\n<script>\r\n    import SetupInfo from '../../device/setupInfo';\r\n\r\n    export default {\r\n        data: function () {\r\n            return {\r\n                disabled: false,\r\n                setupInfo: new SetupInfo()\r\n            }\r\n        },\r\n        mounted: function () {\r\n            const me = this;\r\n\r\n            me.disabled = true;\r\n\r\n            apiRequest(SETUP_INPO_URL, {}, 'get').then(function (obj) {\r\n                const data = obj.data;\r\n\r\n                me.setupInfo = new SetupInfo(data);\r\n\r\n                me.disabled = false;\r\n\r\n            }).catch(function (error) {\r\n                console.error(error);\r\n                alert('processing error.');\r\n                me.disabled = false;\r\n            });\r\n        },\r\n        methods: {\r\n            onClickSave: function () {\r\n                const me = this;\r\n\r\n                me.disabled = true;\r\n\r\n                return apiRequest(SETUP_SAVE_URL, me.setupInfo.getDataObject(), 'post').then(function () {\r\n                    me.setupInfo.apPassword = '';\r\n                    me.disabled = false;\r\n\r\n                }).catch(function (error) {\r\n                    console.error(error);\r\n                    alert('processing error.');\r\n                    me.disabled = false;\r\n                });\r\n            }\r\n        }\r\n    }\r\n</script>\r\n\r\n<style scoped>\r\n    .log-iframe {\r\n        display: block;\r\n        width: 100%;\r\n        height: 800px;\r\n    }\r\n</style>"]}, media: undefined });

      };
      /* scoped */
      const __vue_scope_id__ = "data-v-b987dc1c";
      /* module identifier */
      const __vue_module_identifier__ = undefined;
      /* functional template */
      const __vue_is_functional_template__ = false;
      /* style inject SSR */
      

      
      var SystemLogPage = normalizeComponent_1(
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
            'system-log-page': SystemLogPage
        }
    });

})();
