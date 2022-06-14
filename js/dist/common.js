(function () {
    'use strict';

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
    //

    var script = {
        props: {
            pageName: {type: String, default: ''}
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
      return _c(
        "nav",
        { staticClass: "navbar navbar-expand-lg navbar-dark bg-dark" },
        [
          _vm._m(0),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "collapse navbar-collapse", attrs: { id: "navbarNav" } },
            [
              _c("ul", { staticClass: "navbar-nav w-100" }, [
                _c("li", { staticClass: "nav-item mr-3" }, [
                  _c(
                    "a",
                    {
                      staticClass: "nav-link",
                      class: { active: _vm.pageName == "device" },
                      attrs: { href: "./device.php" }
                    },
                    [_c("span", [_vm._v("Device")])]
                  )
                ]),
                _vm._v(" "),
                _c("li", { staticClass: "nav-item mr-3" }, [
                  _c(
                    "a",
                    {
                      staticClass: "nav-link",
                      class: { active: _vm.pageName == "sensor" },
                      attrs: { href: "./sensor.php" }
                    },
                    [_c("span", [_vm._v("Sensor")])]
                  )
                ]),
                _vm._v(" "),
                _c("li", { staticClass: "nav-item mr-3" }, [
                  _c(
                    "a",
                    {
                      staticClass: "nav-link",
                      class: { active: _vm.pageName == "monitoring" },
                      attrs: { href: "./monitoring.php" }
                    },
                    [_c("span", [_vm._v("Monitoring")])]
                  )
                ]),
                _vm._v(" "),
                _c("li", { staticClass: "nav-item mr-3" }, [
                  _c(
                    "a",
                    {
                      staticClass: "nav-link",
                      class: { active: _vm.pageName == "serial-monitoring" },
                      attrs: { href: "./serial-monitoring.php" }
                    },
                    [_c("span", [_vm._v("Serial monitoring")])]
                  )
                ]),
                _vm._v(" "),
                _c("li", { staticClass: "nav-item mr-3" }, [
                  _c(
                    "a",
                    {
                      staticClass: "nav-link",
                      class: { active: _vm.pageName == "system-log" },
                      attrs: { href: "./system-log.php" }
                    },
                    [_c("span", [_vm._v("System loging")])]
                  )
                ]),
                _vm._v(" "),
                _c("li", { staticClass: "nav-item mr-lg-auto" }, [
                  _c(
                    "a",
                    {
                      staticClass: "nav-link",
                      class: { active: _vm.pageName == "setup" },
                      attrs: { href: "./setup.php" }
                    },
                    [_c("span", [_vm._v("Setup")])]
                  )
                ]),
                _vm._v(" "),
                _vm._m(1)
              ])
            ]
          )
        ]
      )
    };
    var __vue_staticRenderFns__ = [
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c(
          "button",
          {
            staticClass: "navbar-toggler",
            attrs: {
              type: "button",
              "data-toggle": "collapse",
              "data-target": "#navbarNav",
              "aria-controls": "navbarNav",
              "aria-expanded": "false",
              "aria-label": "Toggle navigation"
            }
          },
          [_c("span", { staticClass: "navbar-toggler-icon" })]
        )
      },
      function() {
        var _vm = this;
        var _h = _vm.$createElement;
        var _c = _vm._self._c || _h;
        return _c("li", { staticClass: "nav-item" }, [
          _c(
            "a",
            {
              staticClass: "nav-link",
              attrs: {
                href: "https://github.com/11character/potrfolio-device-setting-page"
              }
            },
            [_vm._v("GitHub")]
          )
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
      

      
      var Navbar = normalizeComponent_1(
        { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
        __vue_inject_styles__,
        __vue_script__,
        __vue_scope_id__,
        __vue_is_functional_template__,
        __vue_module_identifier__,
        undefined,
        undefined
      );

    // 프로젝트 내부에서 만들어진 경로.
    window.DEVICE_CREATE_URL = './api/device-create.php';
    window.DEVICE_DELETE_URL = './api/device-delete.php';
    window.DEVICE_SAVE_URL = './api/device-save.php';
    window.DEVICE_LIST_URL = './api/device-list.php';
    window.SENSOR_CREATE_URL = './api/sensor-create.php';
    window.SENSOR_DELETE_URL = './api/sensor-delete.php';
    window.SENSOR_SAVE_URL = './api/sensor-save.php';
    window.SENSOR_LIST_URL = './api/sensor-list.php';
    window.SENSOR_DATA_LIST_URL = './api/sensor-data-list.php';
    window.SENSOR_DATA_NAME_LIST_URL = './api/sensor-data-name-list.php';
    window.SENSOR_SERIAL_DATA_LIST_URL = './api/sensor-serial-data-list.php';
    window.SENSOR_SERIAL_DATA_NAME_LIST_URL = './api/sensor-serial-data-name-list.php';
    window.SETUP_INPO_URL = './api/setup-info.php';
    window.SETUP_SAVE_URL = './api/setup-save.php';
    window.PROTOCOL_CONFIG_FILES_URL = './api/protocol-config-files.php';
    window.PROTOCOL_SAVE_URL = './api/protocol-save.php';
    window.PROTOCOL_DATA_URL = './api/protocol-data.php';

    // 프로젝트 외부에서 제공하는 경로.
    window.BLUETOOTH_DEBUG_URL = './sample-page.html';
    window.SERIAL_DEBUG_URL = './sample-page.html';
    window.SERVER_REBOOT_URL = './sample-page.html';
    window.SERVER_RESTART_URL = './sample-page.html';
    window.SDR_CHANNEL_CHANGE_URL = './sample-page.html';

    window.RATE_ARR = [
        50,
        75,
        100,
        200,
        250,
        600,
        1200,
        2400,
        4800,
        9600,
        14400,
        19200,
        28800,
        38400,
        57600,
        115200,
        230400,
        460800,
        921600
    ];

    window.apiRequest = function (url, obj = {}, method = 'get') {
        return new Promise(function (resolve, reject) {
            $.ajax({
                method: method,
                url: url,
                dataType: 'json',
                data: obj
            }).done(function (obj) {
                if (obj.code == 0) {
                    resolve(obj);

                } else {
                    reject(new Error(obj.message));
                }
            }).fail(reject);
        });
    };

    new Vue({
        el: '#nav',
        components: {
            'main-nav': Navbar
        }
    });

})();
