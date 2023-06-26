'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

customElements.define('compodoc-menu', /*#__PURE__*/function (_HTMLElement) {
  _inherits(_class, _HTMLElement);

  var _super = _createSuper(_class);

  function _class() {
    var _this;

    _classCallCheck(this, _class);

    _this = _super.call(this);
    _this.isNormalMode = _this.getAttribute('mode') === 'normal';
    return _this;
  }

  _createClass(_class, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render(this.isNormalMode);
    }
  }, {
    key: "render",
    value: function render(isNormalMode) {
      var tp = lithtml.html("\n        <nav>\n            <ul class=\"list\">\n                <li class=\"title\">\n                    <a href=\"index.html\" data-type=\"index-link\">booking-frontend documentation</a>\n                </li>\n\n                <li class=\"divider\"></li>\n                ".concat(isNormalMode ? "<div id=\"book-search-input\" role=\"search\"><input type=\"text\" placeholder=\"Type to search\"></div>" : '', "\n                <li class=\"chapter\">\n                    <a data-type=\"chapter-link\" href=\"index.html\"><span class=\"icon ion-ios-home\"></span>Getting started</a>\n                    <ul class=\"links\">\n                        <li class=\"link\">\n                            <a href=\"overview.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-keypad\"></span>Overview\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"index.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>README\n                            </a>\n                        </li>\n                                <li class=\"link\">\n                                    <a href=\"dependencies.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-list\"></span>Dependencies\n                                    </a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"properties.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-apps\"></span>Properties\n                                    </a>\n                                </li>\n                    </ul>\n                </li>\n                    <li class=\"chapter modules\">\n                        <a data-type=\"chapter-link\" href=\"modules.html\">\n                            <div class=\"menu-toggler linked\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#modules-links"' : 'data-target="#xs-modules-links"', ">\n                                <span class=\"icon ion-ios-archive\"></span>\n                                <span class=\"link-name\">Modules</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                        </a>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"', ">\n                            <li class=\"link\">\n                                <a href=\"modules/AppModule.html\" data-type=\"entity-link\" >AppModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#components-links-module-AppModule-cbeee24c1db5a83acc440871cbfab0253f799a5a84a7011c0a6ed92144ca92432b6f56c1c68fe33e90b22f8c045eac4ae921d1e1a43dcbda4b2433ec35e41c86"' : 'data-target="#xs-components-links-module-AppModule-cbeee24c1db5a83acc440871cbfab0253f799a5a84a7011c0a6ed92144ca92432b6f56c1c68fe33e90b22f8c045eac4ae921d1e1a43dcbda4b2433ec35e41c86"', ">\n                                            <span class=\"icon ion-md-cog\"></span>\n                                            <span>Components</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="components-links-module-AppModule-cbeee24c1db5a83acc440871cbfab0253f799a5a84a7011c0a6ed92144ca92432b6f56c1c68fe33e90b22f8c045eac4ae921d1e1a43dcbda4b2433ec35e41c86"' : 'id="xs-components-links-module-AppModule-cbeee24c1db5a83acc440871cbfab0253f799a5a84a7011c0a6ed92144ca92432b6f56c1c68fe33e90b22f8c045eac4ae921d1e1a43dcbda4b2433ec35e41c86"', ">\n                                            <li class=\"link\">\n                                                <a href=\"components/AppComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AppComponent</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/AppRoutingModule.html\" data-type=\"entity-link\" >AppRoutingModule</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/IconModule.html\" data-type=\"entity-link\" >IconModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#components-links-module-IconModule-e854c801c8c65a2bd21dd837965b22c646289c5f0674779689b66790031bda8980a834bd53a0545a4b48caaddf0e42261f66195379bd5a4ed66370b0a6e5bc8e"' : 'data-target="#xs-components-links-module-IconModule-e854c801c8c65a2bd21dd837965b22c646289c5f0674779689b66790031bda8980a834bd53a0545a4b48caaddf0e42261f66195379bd5a4ed66370b0a6e5bc8e"', ">\n                                            <span class=\"icon ion-md-cog\"></span>\n                                            <span>Components</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="components-links-module-IconModule-e854c801c8c65a2bd21dd837965b22c646289c5f0674779689b66790031bda8980a834bd53a0545a4b48caaddf0e42261f66195379bd5a4ed66370b0a6e5bc8e"' : 'id="xs-components-links-module-IconModule-e854c801c8c65a2bd21dd837965b22c646289c5f0674779689b66790031bda8980a834bd53a0545a4b48caaddf0e42261f66195379bd5a4ed66370b0a6e5bc8e"', ">\n                                            <li class=\"link\">\n                                                <a href=\"components/AuthComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AuthComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/HeaderComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >HeaderComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/MessageBoxComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >MessageBoxComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ModalComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ModalComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/SessionWindowComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >SessionWindowComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/StatisticsComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >StatisticsComponent</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/PageModule.html\" data-type=\"entity-link\" >PageModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#components-links-module-PageModule-dc226bac15ffac9db5ccd422c8186ee0e97a2d52d36191a8c41b642bec8379b07cb7786a1812499f27e356c7d1668ca7885e9256cb67dcbe093b8768a4b3594a"' : 'data-target="#xs-components-links-module-PageModule-dc226bac15ffac9db5ccd422c8186ee0e97a2d52d36191a8c41b642bec8379b07cb7786a1812499f27e356c7d1668ca7885e9256cb67dcbe093b8768a4b3594a"', ">\n                                            <span class=\"icon ion-md-cog\"></span>\n                                            <span>Components</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="components-links-module-PageModule-dc226bac15ffac9db5ccd422c8186ee0e97a2d52d36191a8c41b642bec8379b07cb7786a1812499f27e356c7d1668ca7885e9256cb67dcbe093b8768a4b3594a"' : 'id="xs-components-links-module-PageModule-dc226bac15ffac9db5ccd422c8186ee0e97a2d52d36191a8c41b642bec8379b07cb7786a1812499f27e356c7d1668ca7885e9256cb67dcbe093b8768a4b3594a"', ">\n                                            <li class=\"link\">\n                                                <a href=\"components/HomeComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >HomeComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/SigninComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >SigninComponent</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/PipeModule.html\" data-type=\"entity-link\" >PipeModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#pipes-links-module-PipeModule-60f3be70d12bd1f14cdca010e9cba921e7f51eb5aecc5e9bf5e873a7d4d640fa4af836855f7b89ef3e3b336817be91ff91de9ad63cf9bb88241aeb1aaa97aa16"' : 'data-target="#xs-pipes-links-module-PipeModule-60f3be70d12bd1f14cdca010e9cba921e7f51eb5aecc5e9bf5e873a7d4d640fa4af836855f7b89ef3e3b336817be91ff91de9ad63cf9bb88241aeb1aaa97aa16"', ">\n                                            <span class=\"icon ion-md-add\"></span>\n                                            <span>Pipes</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="pipes-links-module-PipeModule-60f3be70d12bd1f14cdca010e9cba921e7f51eb5aecc5e9bf5e873a7d4d640fa4af836855f7b89ef3e3b336817be91ff91de9ad63cf9bb88241aeb1aaa97aa16"' : 'id="xs-pipes-links-module-PipeModule-60f3be70d12bd1f14cdca010e9cba921e7f51eb5aecc5e9bf5e873a7d4d640fa4af836855f7b89ef3e3b336817be91ff91de9ad63cf9bb88241aeb1aaa97aa16"', ">\n                                            <li class=\"link\">\n                                                <a href=\"pipes/SafePipe.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >SafePipe</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"modules/SharedModule.html\" data-type=\"entity-link\" >SharedModule</a>\n                                    <li class=\"chapter inner\">\n                                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#components-links-module-SharedModule-abc0e61d1ef5feedea9325e3f03af34f8d6f94326314cd02bf8f6fc962b0d13b0ebe317ab6244175ec16102cd380f4b0e6ad11415b7de9ad7bd3888962f0fe5b"' : 'data-target="#xs-components-links-module-SharedModule-abc0e61d1ef5feedea9325e3f03af34f8d6f94326314cd02bf8f6fc962b0d13b0ebe317ab6244175ec16102cd380f4b0e6ad11415b7de9ad7bd3888962f0fe5b"', ">\n                                            <span class=\"icon ion-md-cog\"></span>\n                                            <span>Components</span>\n                                            <span class=\"icon ion-ios-arrow-down\"></span>\n                                        </div>\n                                        <ul class=\"links collapse\" ").concat(isNormalMode ? 'id="components-links-module-SharedModule-abc0e61d1ef5feedea9325e3f03af34f8d6f94326314cd02bf8f6fc962b0d13b0ebe317ab6244175ec16102cd380f4b0e6ad11415b7de9ad7bd3888962f0fe5b"' : 'id="xs-components-links-module-SharedModule-abc0e61d1ef5feedea9325e3f03af34f8d6f94326314cd02bf8f6fc962b0d13b0ebe317ab6244175ec16102cd380f4b0e6ad11415b7de9ad7bd3888962f0fe5b"', ">\n                                            <li class=\"link\">\n                                                <a href=\"components/AuthComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >AuthComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/HeaderComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >HeaderComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/MessageBoxComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >MessageBoxComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/ModalComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >ModalComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/SessionWindowComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >SessionWindowComponent</a>\n                                            </li>\n                                            <li class=\"link\">\n                                                <a href=\"components/StatisticsComponent.html\" data-type=\"entity-link\" data-context=\"sub-entity\" data-context-id=\"modules\" >StatisticsComponent</a>\n                                            </li>\n                                        </ul>\n                                    </li>\n                            </li>\n                </ul>\n                </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#components-links"' : 'data-target="#xs-components-links"', ">\n                            <span class=\"icon ion-md-cog\"></span>\n                            <span>Components</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="components-links"' : 'id="xs-components-links"', ">\n                            <li class=\"link\">\n                                <a href=\"components/IconCloseComponent.html\" data-type=\"entity-link\" >IconCloseComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/IconSignoutComponent.html\" data-type=\"entity-link\" >IconSignoutComponent</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#injectables-links"' : 'data-target="#xs-injectables-links"', ">\n                                <span class=\"icon ion-md-arrow-round-down\"></span>\n                                <span>Injectables</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"injectables/AppStateManageService.html\" data-type=\"entity-link\" >AppStateManageService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/DataService.html\" data-type=\"entity-link\" >DataService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/FunctionalService.html\" data-type=\"entity-link\" >FunctionalService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/GoogleSigninService.html\" data-type=\"entity-link\" >GoogleSigninService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/StatesService.html\" data-type=\"entity-link\" >StatesService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/StoreService.html\" data-type=\"entity-link\" >StoreService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/TrafficLightService.html\" data-type=\"entity-link\" >TrafficLightService</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#guards-links"' : 'data-target="#xs-guards-links"', ">\n                            <span class=\"icon ion-ios-lock\"></span>\n                            <span>Guards</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"', ">\n                            <li class=\"link\">\n                                <a href=\"guards/RouterGuardService.html\" data-type=\"entity-link\" >RouterGuardService</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#interfaces-links"' : 'data-target="#xs-interfaces-links"', ">\n                            <span class=\"icon ion-md-information-circle-outline\"></span>\n                            <span>Interfaces</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"', ">\n                            <li class=\"link\">\n                                <a href=\"interfaces/formFieldsObjectInterface.html\" data-type=\"entity-link\" >formFieldsObjectInterface</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/prefillResponseDataInterface.html\" data-type=\"entity-link\" >prefillResponseDataInterface</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"interfaces/sessionEventTypeDataInterface.html\" data-type=\"entity-link\" >sessionEventTypeDataInterface</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-toggle=\"collapse\" ").concat(isNormalMode ? 'data-target="#miscellaneous-links"' : 'data-target="#xs-miscellaneous-links"', ">\n                            <span class=\"icon ion-ios-cube\"></span>\n                            <span>Miscellaneous</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"', ">\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/enumerations.html\" data-type=\"entity-link\">Enums</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/functions.html\" data-type=\"entity-link\">Functions</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/variables.html\" data-type=\"entity-link\">Variables</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <a data-type=\"chapter-link\" href=\"routes.html\"><span class=\"icon ion-ios-git-branch\"></span>Routes</a>\n                        </li>\n                    <li class=\"chapter\">\n                        <a data-type=\"chapter-link\" href=\"coverage.html\"><span class=\"icon ion-ios-stats\"></span>Documentation coverage</a>\n                    </li>\n                    <li class=\"divider\"></li>\n                    <li class=\"copyright\">\n                        Documentation generated using <a href=\"https://compodoc.app/\" target=\"_blank\">\n                            <img data-src=\"images/compodoc-vectorise.png\" class=\"img-responsive\" data-type=\"compodoc-logo\">\n                        </a>\n                    </li>\n            </ul>\n        </nav>\n        "));
      this.innerHTML = tp.strings;
    }
  }]);

  return _class;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));