'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">booking-frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-cbeee24c1db5a83acc440871cbfab0253f799a5a84a7011c0a6ed92144ca92432b6f56c1c68fe33e90b22f8c045eac4ae921d1e1a43dcbda4b2433ec35e41c86"' : 'data-target="#xs-components-links-module-AppModule-cbeee24c1db5a83acc440871cbfab0253f799a5a84a7011c0a6ed92144ca92432b6f56c1c68fe33e90b22f8c045eac4ae921d1e1a43dcbda4b2433ec35e41c86"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-cbeee24c1db5a83acc440871cbfab0253f799a5a84a7011c0a6ed92144ca92432b6f56c1c68fe33e90b22f8c045eac4ae921d1e1a43dcbda4b2433ec35e41c86"' :
                                            'id="xs-components-links-module-AppModule-cbeee24c1db5a83acc440871cbfab0253f799a5a84a7011c0a6ed92144ca92432b6f56c1c68fe33e90b22f8c045eac4ae921d1e1a43dcbda4b2433ec35e41c86"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IconModule.html" data-type="entity-link" >IconModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-IconModule-e854c801c8c65a2bd21dd837965b22c646289c5f0674779689b66790031bda8980a834bd53a0545a4b48caaddf0e42261f66195379bd5a4ed66370b0a6e5bc8e"' : 'data-target="#xs-components-links-module-IconModule-e854c801c8c65a2bd21dd837965b22c646289c5f0674779689b66790031bda8980a834bd53a0545a4b48caaddf0e42261f66195379bd5a4ed66370b0a6e5bc8e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-IconModule-e854c801c8c65a2bd21dd837965b22c646289c5f0674779689b66790031bda8980a834bd53a0545a4b48caaddf0e42261f66195379bd5a4ed66370b0a6e5bc8e"' :
                                            'id="xs-components-links-module-IconModule-e854c801c8c65a2bd21dd837965b22c646289c5f0674779689b66790031bda8980a834bd53a0545a4b48caaddf0e42261f66195379bd5a4ed66370b0a6e5bc8e"' }>
                                            <li class="link">
                                                <a href="components/AuthComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessageBoxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageBoxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SessionWindowComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionWindowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatisticsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatisticsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PageModule.html" data-type="entity-link" >PageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PageModule-dc226bac15ffac9db5ccd422c8186ee0e97a2d52d36191a8c41b642bec8379b07cb7786a1812499f27e356c7d1668ca7885e9256cb67dcbe093b8768a4b3594a"' : 'data-target="#xs-components-links-module-PageModule-dc226bac15ffac9db5ccd422c8186ee0e97a2d52d36191a8c41b642bec8379b07cb7786a1812499f27e356c7d1668ca7885e9256cb67dcbe093b8768a4b3594a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PageModule-dc226bac15ffac9db5ccd422c8186ee0e97a2d52d36191a8c41b642bec8379b07cb7786a1812499f27e356c7d1668ca7885e9256cb67dcbe093b8768a4b3594a"' :
                                            'id="xs-components-links-module-PageModule-dc226bac15ffac9db5ccd422c8186ee0e97a2d52d36191a8c41b642bec8379b07cb7786a1812499f27e356c7d1668ca7885e9256cb67dcbe093b8768a4b3594a"' }>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SigninComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SigninComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PipeModule.html" data-type="entity-link" >PipeModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-PipeModule-60f3be70d12bd1f14cdca010e9cba921e7f51eb5aecc5e9bf5e873a7d4d640fa4af836855f7b89ef3e3b336817be91ff91de9ad63cf9bb88241aeb1aaa97aa16"' : 'data-target="#xs-pipes-links-module-PipeModule-60f3be70d12bd1f14cdca010e9cba921e7f51eb5aecc5e9bf5e873a7d4d640fa4af836855f7b89ef3e3b336817be91ff91de9ad63cf9bb88241aeb1aaa97aa16"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-PipeModule-60f3be70d12bd1f14cdca010e9cba921e7f51eb5aecc5e9bf5e873a7d4d640fa4af836855f7b89ef3e3b336817be91ff91de9ad63cf9bb88241aeb1aaa97aa16"' :
                                            'id="xs-pipes-links-module-PipeModule-60f3be70d12bd1f14cdca010e9cba921e7f51eb5aecc5e9bf5e873a7d4d640fa4af836855f7b89ef3e3b336817be91ff91de9ad63cf9bb88241aeb1aaa97aa16"' }>
                                            <li class="link">
                                                <a href="pipes/SafePipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SafePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-abc0e61d1ef5feedea9325e3f03af34f8d6f94326314cd02bf8f6fc962b0d13b0ebe317ab6244175ec16102cd380f4b0e6ad11415b7de9ad7bd3888962f0fe5b"' : 'data-target="#xs-components-links-module-SharedModule-abc0e61d1ef5feedea9325e3f03af34f8d6f94326314cd02bf8f6fc962b0d13b0ebe317ab6244175ec16102cd380f4b0e6ad11415b7de9ad7bd3888962f0fe5b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-abc0e61d1ef5feedea9325e3f03af34f8d6f94326314cd02bf8f6fc962b0d13b0ebe317ab6244175ec16102cd380f4b0e6ad11415b7de9ad7bd3888962f0fe5b"' :
                                            'id="xs-components-links-module-SharedModule-abc0e61d1ef5feedea9325e3f03af34f8d6f94326314cd02bf8f6fc962b0d13b0ebe317ab6244175ec16102cd380f4b0e6ad11415b7de9ad7bd3888962f0fe5b"' }>
                                            <li class="link">
                                                <a href="components/AuthComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessageBoxComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessageBoxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SessionWindowComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SessionWindowComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/StatisticsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >StatisticsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/IconCloseComponent.html" data-type="entity-link" >IconCloseComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconSignoutComponent.html" data-type="entity-link" >IconSignoutComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppStateManageService.html" data-type="entity-link" >AppStateManageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataService.html" data-type="entity-link" >DataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FunctionalService.html" data-type="entity-link" >FunctionalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleSigninService.html" data-type="entity-link" >GoogleSigninService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StatesService.html" data-type="entity-link" >StatesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StoreService.html" data-type="entity-link" >StoreService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TrafficLightService.html" data-type="entity-link" >TrafficLightService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RouterGuardService.html" data-type="entity-link" >RouterGuardService</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/formFieldsObjectInterface.html" data-type="entity-link" >formFieldsObjectInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/prefillResponseDataInterface.html" data-type="entity-link" >prefillResponseDataInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/sessionEventTypeDataInterface.html" data-type="entity-link" >sessionEventTypeDataInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});