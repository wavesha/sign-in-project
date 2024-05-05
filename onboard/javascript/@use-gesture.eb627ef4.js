"use strict";(self.wpJsonp_onboarding=self.wpJsonp_onboarding||[]).push([[274],{77836:function(t,e,n){n.d(e,{"useDrag":function(){return Q}});const i={toVector(t,e){return void 0===t&&(t=e),Array.isArray(t)?t:[t,t]},add(t,e){return[t[0]+e[0],t[1]+e[1]]},sub(t,e){return[t[0]-e[0],t[1]-e[1]]},addTo(t,e){t[0]+=e[0],t[1]+=e[1]},subTo(t,e){t[0]-=e[0],t[1]-=e[1]}};function s(t,e,n){return 0===e||Math.abs(e)===1/0?Math.pow(t,5*n):t*e*n/(e+n*t)}function r(t,e,n,i=.15){return 0===i?function(t,e,n){return Math.max(e,Math.min(t,n))}(t,e,n):t<e?-s(e-t,n-e,i)+e:t>n?+s(t-n,n-e,i)+n:t}function o(t){var e=function(t,e){if("object"!=typeof t||null===t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var i=n.call(t,e||"default");if("object"!=typeof i)return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===e?String:Number)(t)}(t,"string");return"symbol"==typeof e?e:String(e)}function a(t,e,n){return(e=o(e))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function c(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function u(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?c(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}const h={pointer:{start:"down",change:"move",end:"up"},mouse:{start:"down",change:"move",end:"up"},touch:{start:"start",change:"move",end:"end"},gesture:{start:"start",change:"change",end:"end"}};function d(t){return t?t[0].toUpperCase()+t.slice(1):""}const l=["enter","leave"];function p(t,e="",n=!1){const i=h[t],s=i&&i[e]||e;return"on"+d(t)+d(s)+(function(t=!1,e){return t&&!l.includes(e)}(n,s)?"Capture":"")}const f=["gotpointercapture","lostpointercapture"];function v(t){let e=t.substring(2).toLowerCase();const n=!!~e.indexOf("passive");n&&(e=e.replace("passive",""));const i=f.includes(e)?"capturecapture":"capture",s=!!~e.indexOf(i);return s&&(e=e.replace("capture","")),{device:e,capture:s,passive:n}}function m(t){return"touches"in t}function g(t){return m(t)?"touch":"pointerType"in t?t.pointerType:"mouse"}function y(t){return m(t)?function(t){return"touchend"===t.type||"touchcancel"===t.type?t.changedTouches:t.targetTouches}(t)[0]:t}function b(t){return function(t){return Array.from(t.touches).filter((e=>{var n,i;return e.target===t.currentTarget||(null===(n=t.currentTarget)||void 0===n||null===(i=n.contains)||void 0===i?void 0:i.call(n,e.target))}))}(t).map((t=>t.identifier))}function _(t){const e=y(t);return m(t)?e.identifier:e.pointerId}function w(t){const e=y(t);return[e.clientX,e.clientY]}function S(t,...e){return"function"==typeof t?t(...e):t}function k(){}function T(...t){return 0===t.length?k:1===t.length?t[0]:function(){let e;for(const n of t)e=n.apply(this,arguments)||e;return e}}function x(t,e){return Object.assign({},e,t||{})}class O{constructor(t,e,n){this.ctrl=t,this.args=e,this.key=n,this.state||(this.state={},this.computeValues([0,0]),this.computeInitial(),this.init&&this.init(),this.reset())}get state(){return this.ctrl.state[this.key]}set state(t){this.ctrl.state[this.key]=t}get shared(){return this.ctrl.state.shared}get eventStore(){return this.ctrl.gestureEventStores[this.key]}get timeoutStore(){return this.ctrl.gestureTimeoutStores[this.key]}get config(){return this.ctrl.config[this.key]}get sharedConfig(){return this.ctrl.config.shared}get handler(){return this.ctrl.handlers[this.key]}reset(){const{state:t,shared:e,ingKey:n,args:i}=this;e[n]=t._active=t.active=t._blocked=t._force=!1,t._step=[!1,!1],t.intentional=!1,t._movement=[0,0],t._distance=[0,0],t._direction=[0,0],t._delta=[0,0],t._bounds=[[-1/0,1/0],[-1/0,1/0]],t.args=i,t.axis=void 0,t.memo=void 0,t.elapsedTime=0,t.direction=[0,0],t.distance=[0,0],t.overflow=[0,0],t._movementBound=[!1,!1],t.velocity=[0,0],t.movement=[0,0],t.delta=[0,0],t.timeStamp=0}start(t){const e=this.state,n=this.config;e._active||(this.reset(),this.computeInitial(),e._active=!0,e.target=t.target,e.currentTarget=t.currentTarget,e.lastOffset=n.from?S(n.from,e):e.offset,e.offset=e.lastOffset),e.startTime=e.timeStamp=t.timeStamp}computeValues(t){const e=this.state;e._values=t,e.values=this.config.transform(t)}computeInitial(){const t=this.state;t._initial=t._values,t.initial=t.values}compute(t){const{state:e,config:n,shared:s}=this;e.args=this.args;let o=0;if(t&&(e.event=t,n.preventDefault&&t.cancelable&&e.event.preventDefault(),e.type=t.type,s.touches=this.ctrl.pointerIds.size||this.ctrl.touchIds.size,s.locked=!!document.pointerLockElement,Object.assign(s,function(t){const e={};if("buttons"in t&&(e.buttons=t.buttons),"shiftKey"in t){const{shiftKey:n,altKey:i,metaKey:s,ctrlKey:r}=t;Object.assign(e,{shiftKey:n,altKey:i,metaKey:s,ctrlKey:r})}return e}(t)),s.down=s.pressed=s.buttons%2==1||s.touches>0,o=t.timeStamp-e.timeStamp,e.timeStamp=t.timeStamp,e.elapsedTime=e.timeStamp-e.startTime),e._active){const t=e._delta.map(Math.abs);i.addTo(e._distance,t)}this.axisIntent&&this.axisIntent(t);const[a,c]=e._movement,[u,h]=n.threshold,{_step:d,values:l}=e;if(n.hasCustomTransform?(!1===d[0]&&(d[0]=Math.abs(a)>=u&&l[0]),!1===d[1]&&(d[1]=Math.abs(c)>=h&&l[1])):(!1===d[0]&&(d[0]=Math.abs(a)>=u&&Math.sign(a)*u),!1===d[1]&&(d[1]=Math.abs(c)>=h&&Math.sign(c)*h)),e.intentional=!1!==d[0]||!1!==d[1],!e.intentional)return;const p=[0,0];if(n.hasCustomTransform){const[t,e]=l;p[0]=!1!==d[0]?t-d[0]:0,p[1]=!1!==d[1]?e-d[1]:0}else p[0]=!1!==d[0]?a-d[0]:0,p[1]=!1!==d[1]?c-d[1]:0;this.restrictToAxis&&!e._blocked&&this.restrictToAxis(p);const f=e.offset,v=e._active&&!e._blocked||e.active;v&&(e.first=e._active&&!e.active,e.last=!e._active&&e.active,e.active=s[this.ingKey]=e._active,t&&(e.first&&("bounds"in n&&(e._bounds=S(n.bounds,e)),this.setup&&this.setup()),e.movement=p,this.computeOffset()));const[m,g]=e.offset,[[y,b],[_,w]]=e._bounds;e.overflow=[m<y?-1:m>b?1:0,g<_?-1:g>w?1:0],e._movementBound[0]=!!e.overflow[0]&&(!1===e._movementBound[0]?e._movement[0]:e._movementBound[0]),e._movementBound[1]=!!e.overflow[1]&&(!1===e._movementBound[1]?e._movement[1]:e._movementBound[1]);const k=e._active&&n.rubberband||[0,0];if(e.offset=function(t,[e,n],[i,s]){const[[o,a],[c,u]]=t;return[r(e,o,a,i),r(n,c,u,s)]}(e._bounds,e.offset,k),e.delta=i.sub(e.offset,f),this.computeMovement(),v&&(!e.last||o>32)){e.delta=i.sub(e.offset,f);const t=e.delta.map(Math.abs);i.addTo(e.distance,t),e.direction=e.delta.map(Math.sign),e._direction=e._delta.map(Math.sign),!e.first&&o>0&&(e.velocity=[t[0]/o,t[1]/o])}}emit(){const t=this.state,e=this.shared,n=this.config;if(t._active||this.clean(),(t._blocked||!t.intentional)&&!t._force&&!n.triggerAllEvents)return;const i=this.handler(u(u(u({},e),t),{},{[this.aliasKey]:t.values}));void 0!==i&&(t.memo=i)}clean(){this.eventStore.clean(),this.timeoutStore.clean()}}class D extends O{constructor(...t){super(...t),a(this,"aliasKey","xy")}reset(){super.reset(),this.state.axis=void 0}init(){this.state.offset=[0,0],this.state.lastOffset=[0,0]}computeOffset(){this.state.offset=i.add(this.state.lastOffset,this.state.movement)}computeMovement(){this.state.movement=i.sub(this.state.offset,this.state.lastOffset)}axisIntent(t){const e=this.state,n=this.config;if(!e.axis&&t){const i="object"==typeof n.axisThreshold?n.axisThreshold[g(t)]:n.axisThreshold;e.axis=function([t,e],n){const i=Math.abs(t),s=Math.abs(e);return i>s&&i>n?"x":s>i&&s>n?"y":void 0}(e._movement,i)}e._blocked=(n.lockDirection||!!n.axis)&&!e.axis||!!n.axis&&n.axis!==e.axis}restrictToAxis(t){if(this.config.axis||this.config.lockDirection)switch(this.state.axis){case"x":t[1]=0;break;case"y":t[0]=0}}}const A=t=>t,P={enabled(t=!0){return t},eventOptions(t,e,n){return u(u({},n.shared.eventOptions),t)},preventDefault(t=!1){return t},triggerAllEvents(t=!1){return t},rubberband(t=0){switch(t){case!0:return[.15,.15];case!1:return[0,0];default:return i.toVector(t)}},from(t){return"function"==typeof t?t:null!=t?i.toVector(t):void 0},transform(t,e,n){const i=t||n.shared.transform;return this.hasCustomTransform=!!i,i||A},threshold(t){return i.toVector(t,0)}};const I=u(u({},P),{},{axis(t,e,{axis:n}){if(this.lockDirection="lock"===n,!this.lockDirection)return n},axisThreshold(t=0){return t},bounds(t={}){if("function"==typeof t)return e=>I.bounds(t(e));if("current"in t)return()=>t.current;if("function"==typeof HTMLElement&&t instanceof HTMLElement)return t;const{left:e=-1/0,right:n=1/0,top:i=-1/0,bottom:s=1/0}=t;return[[e,n],[i,s]]}}),E={ArrowRight:(t,e=1)=>[t*e,0],ArrowLeft:(t,e=1)=>[-1*t*e,0],ArrowUp:(t,e=1)=>[0,-1*t*e],ArrowDown:(t,e=1)=>[0,t*e]};const M="undefined"!=typeof window&&window.document&&window.document.createElement;function C(){return M&&"ontouchstart"in window||M&&window.navigator.maxTouchPoints>1}const K={isBrowser:M,gesture:function(){try{return"constructor"in GestureEvent}catch(t){return!1}}(),touch:C(),touchscreen:C(),pointer:M&&"onpointerdown"in window,pointerLock:M&&"exitPointerLock"in window.document},j={mouse:0,touch:0,pen:8},L=u(u({},I),{},{device(t,e,{pointer:{touch:n=!1,lock:i=!1,mouse:s=!1}={}}){return this.pointerLock=i&&K.pointerLock,K.touch&&n?"touch":this.pointerLock?"mouse":K.pointer&&!s?"pointer":K.touch?"touch":"mouse"},preventScrollAxis(t,e,{preventScroll:n}){if(this.preventScrollDelay="number"==typeof n?n:n||void 0===n&&t?250:void 0,K.touchscreen&&!1!==n)return t||(void 0!==n?"y":void 0)},pointerCapture(t,e,{pointer:{capture:n=!0,buttons:i=1,keys:s=!0}={}}){return this.pointerButtons=i,this.keys=s,!this.pointerLock&&"pointer"===this.device&&n},threshold(t,e,{filterTaps:n=!1,tapsThreshold:s=3,axis:r}){const o=i.toVector(t,n?s:r?1:0);return this.filterTaps=n,this.tapsThreshold=s,o},swipe({velocity:t=.5,distance:e=50,duration:n=250}={}){return{velocity:this.transform(i.toVector(t)),distance:this.transform(i.toVector(e)),duration:n}},delay(t=0){switch(t){case!0:return 180;case!1:return 0;default:return t}},axisThreshold(t){return t?u(u({},j),t):j},keyboardDisplacement(t=10){return t}});u(u({},P),{},{device(t,e,{shared:n,pointer:{touch:i=!1}={}}){if(n.target&&!K.touch&&K.gesture)return"gesture";if(K.touch&&i)return"touch";if(K.touchscreen){if(K.pointer)return"pointer";if(K.touch)return"touch"}},bounds(t,e,{scaleBounds:n={},angleBounds:i={}}){const s=t=>{const e=x(S(n,t),{min:-1/0,max:1/0});return[e.min,e.max]},r=t=>{const e=x(S(i,t),{min:-1/0,max:1/0});return[e.min,e.max]};return"function"!=typeof n&&"function"!=typeof i?[s(),r()]:t=>[s(t),r(t)]},threshold(t,e,n){this.lockDirection="lock"===n.axis;return i.toVector(t,this.lockDirection?[.1,3]:0)},modifierKey(t){return void 0===t?"ctrlKey":t},pinchOnWheel(t=!0){return t}});u(u({},I),{},{mouseOnly:(t=!0)=>t});u(u({},I),{},{mouseOnly:(t=!0)=>t});const B=new Map,V=new Map;const U={key:"drag",engine:class extends D{constructor(...t){super(...t),a(this,"ingKey","dragging")}reset(){super.reset();const t=this.state;t._pointerId=void 0,t._pointerActive=!1,t._keyboardActive=!1,t._preventScroll=!1,t._delayed=!1,t.swipe=[0,0],t.tap=!1,t.canceled=!1,t.cancel=this.cancel.bind(this)}setup(){const t=this.state;if(t._bounds instanceof HTMLElement){const e=t._bounds.getBoundingClientRect(),n=t.currentTarget.getBoundingClientRect(),i={left:e.left-n.left+t.offset[0],right:e.right-n.right+t.offset[0],top:e.top-n.top+t.offset[1],bottom:e.bottom-n.bottom+t.offset[1]};t._bounds=I.bounds(i)}}cancel(){const t=this.state;t.canceled||(t.canceled=!0,t._active=!1,setTimeout((()=>{this.compute(),this.emit()}),0))}setActive(){this.state._active=this.state._pointerActive||this.state._keyboardActive}clean(){this.pointerClean(),this.state._pointerActive=!1,this.state._keyboardActive=!1,super.clean()}pointerDown(t){const e=this.config,n=this.state;if(null!=t.buttons&&(Array.isArray(e.pointerButtons)?!e.pointerButtons.includes(t.buttons):-1!==e.pointerButtons&&e.pointerButtons!==t.buttons))return;const i=this.ctrl.setEventIds(t);e.pointerCapture&&t.target.setPointerCapture(t.pointerId),i&&i.size>1&&n._pointerActive||(this.start(t),this.setupPointer(t),n._pointerId=_(t),n._pointerActive=!0,this.computeValues(w(t)),this.computeInitial(),e.preventScrollAxis&&"mouse"!==g(t)?(n._active=!1,this.setupScrollPrevention(t)):e.delay>0?(this.setupDelayTrigger(t),e.triggerAllEvents&&(this.compute(t),this.emit())):this.startPointerDrag(t))}startPointerDrag(t){const e=this.state;e._active=!0,e._preventScroll=!0,e._delayed=!1,this.compute(t),this.emit()}pointerMove(t){const e=this.state,n=this.config;if(!e._pointerActive)return;if(e.type===t.type&&t.timeStamp===e.timeStamp)return;const s=_(t);if(void 0!==e._pointerId&&s!==e._pointerId)return;const r=w(t);return document.pointerLockElement===t.target?e._delta=[t.movementX,t.movementY]:(e._delta=i.sub(r,e._values),this.computeValues(r)),i.addTo(e._movement,e._delta),this.compute(t),e._delayed&&e.intentional?(this.timeoutStore.remove("dragDelay"),e.active=!1,void this.startPointerDrag(t)):n.preventScrollAxis&&!e._preventScroll?e.axis?e.axis===n.preventScrollAxis||"xy"===n.preventScrollAxis?(e._active=!1,void this.clean()):(this.timeoutStore.remove("startPointerDrag"),void this.startPointerDrag(t)):void 0:void this.emit()}pointerUp(t){this.ctrl.setEventIds(t);try{this.config.pointerCapture&&t.target.hasPointerCapture(t.pointerId)&&t.target.releasePointerCapture(t.pointerId)}catch(t){0}const e=this.state,n=this.config;if(!e._active||!e._pointerActive)return;const i=_(t);if(void 0!==e._pointerId&&i!==e._pointerId)return;this.state._pointerActive=!1,this.setActive(),this.compute(t);const[s,r]=e._distance;if(e.tap=s<=n.tapsThreshold&&r<=n.tapsThreshold,e.tap&&n.filterTaps)e._force=!0;else{const[t,i]=e.direction,[s,r]=e.velocity,[o,a]=e.movement,[c,u]=n.swipe.velocity,[h,d]=n.swipe.distance,l=n.swipe.duration;e.elapsedTime<l&&(Math.abs(s)>c&&Math.abs(o)>h&&(e.swipe[0]=t),Math.abs(r)>u&&Math.abs(a)>d&&(e.swipe[1]=i))}this.emit()}pointerClick(t){!this.state.tap&&t.detail>0&&(t.preventDefault(),t.stopPropagation())}setupPointer(t){const e=this.config,n=e.device;e.pointerLock&&t.currentTarget.requestPointerLock(),e.pointerCapture||(this.eventStore.add(this.sharedConfig.window,n,"change",this.pointerMove.bind(this)),this.eventStore.add(this.sharedConfig.window,n,"end",this.pointerUp.bind(this)),this.eventStore.add(this.sharedConfig.window,n,"cancel",this.pointerUp.bind(this)))}pointerClean(){this.config.pointerLock&&document.pointerLockElement===this.state.currentTarget&&document.exitPointerLock()}preventScroll(t){this.state._preventScroll&&t.cancelable&&t.preventDefault()}setupScrollPrevention(t){this.state._preventScroll=!1,function(t){"persist"in t&&"function"==typeof t.persist&&t.persist()}(t);const e=this.eventStore.add(this.sharedConfig.window,"touch","change",this.preventScroll.bind(this),{passive:!1});this.eventStore.add(this.sharedConfig.window,"touch","end",e),this.eventStore.add(this.sharedConfig.window,"touch","cancel",e),this.timeoutStore.add("startPointerDrag",this.startPointerDrag.bind(this),this.config.preventScrollDelay,t)}setupDelayTrigger(t){this.state._delayed=!0,this.timeoutStore.add("dragDelay",(()=>{this.state._step=[0,0],this.startPointerDrag(t)}),this.config.delay)}keyDown(t){const e=E[t.key];if(e){const n=this.state,s=t.shiftKey?10:t.altKey?.1:1;this.start(t),n._delta=e(this.config.keyboardDisplacement,s),n._keyboardActive=!0,i.addTo(n._movement,n._delta),this.compute(t),this.emit()}}keyUp(t){t.key in E&&(this.state._keyboardActive=!1,this.setActive(),this.compute(t),this.emit())}bind(t){const e=this.config.device;t(e,"start",this.pointerDown.bind(this)),this.config.pointerCapture&&(t(e,"change",this.pointerMove.bind(this)),t(e,"end",this.pointerUp.bind(this)),t(e,"cancel",this.pointerUp.bind(this)),t("lostPointerCapture","",this.pointerUp.bind(this))),this.config.keys&&(t("key","down",this.keyDown.bind(this)),t("key","up",this.keyUp.bind(this))),this.config.filterTaps&&t("click","",this.pointerClick.bind(this),{capture:!0,passive:!1})}},resolver:L};var H=n(27378);function z(t,e){if(null==t)return{};var n,i,s=function(t,e){if(null==t)return{};var n,i,s={},r=Object.keys(t);for(i=0;i<r.length;i++)n=r[i],e.indexOf(n)>=0||(s[n]=t[n]);return s}(t,e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);for(i=0;i<r.length;i++)n=r[i],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(s[n]=t[n])}return s}const R={target(t){if(t)return()=>"current"in t?t.current:t},enabled(t=!0){return t},window(t=(K.isBrowser?window:void 0)){return t},eventOptions({passive:t=!0,capture:e=!1}={}){return{passive:t,capture:e}},transform(t){return t}},J=["target","eventOptions","window","enabled","transform"];function X(t={},e){const n={};for(const[i,s]of Object.entries(e))switch(typeof s){case"function":n[i]=s.call(n,t[i],i,t);break;case"object":n[i]=X(t[i],s);break;case"boolean":s&&(n[i]=t[i])}return n}class Y{constructor(t,e){a(this,"_listeners",new Set),this._ctrl=t,this._gestureKey=e}add(t,e,n,i,s){const r=this._listeners,o=function(t,e=""){const n=h[t];return t+(n&&n[e]||e)}(e,n),a=u(u({},this._gestureKey?this._ctrl.config[this._gestureKey].eventOptions:{}),s);t.addEventListener(o,i,a);const c=()=>{t.removeEventListener(o,i,a),r.delete(c)};return r.add(c),c}clean(){this._listeners.forEach((t=>t())),this._listeners.clear()}}class q{constructor(){a(this,"_timeouts",new Map)}add(t,e,n=140,...i){this.remove(t),this._timeouts.set(t,window.setTimeout(e,n,...i))}remove(t){const e=this._timeouts.get(t);e&&window.clearTimeout(e)}clean(){this._timeouts.forEach((t=>{window.clearTimeout(t)})),this._timeouts.clear()}}class G{constructor(t){a(this,"gestures",new Set),a(this,"_targetEventStore",new Y(this)),a(this,"gestureEventStores",{}),a(this,"gestureTimeoutStores",{}),a(this,"handlers",{}),a(this,"config",{}),a(this,"pointerIds",new Set),a(this,"touchIds",new Set),a(this,"state",{shared:{shiftKey:!1,metaKey:!1,ctrlKey:!1,altKey:!1}}),function(t,e){e.drag&&N(t,"drag");e.wheel&&N(t,"wheel");e.scroll&&N(t,"scroll");e.move&&N(t,"move");e.pinch&&N(t,"pinch");e.hover&&N(t,"hover")}(this,t)}setEventIds(t){return m(t)?(this.touchIds=new Set(b(t)),this.touchIds):"pointerId"in t?("pointerup"===t.type||"pointercancel"===t.type?this.pointerIds.delete(t.pointerId):"pointerdown"===t.type&&this.pointerIds.add(t.pointerId),this.pointerIds):void 0}applyHandlers(t,e){this.handlers=t,this.nativeHandlers=e}applyConfig(t,e){this.config=function(t,e,n={}){const i=t,{target:s,eventOptions:r,window:o,enabled:a,transform:c}=i,h=z(i,J);if(n.shared=X({target:s,eventOptions:r,window:o,enabled:a,transform:c},R),e){const t=V.get(e);n[e]=X(u({shared:n.shared},h),t)}else for(const t in h){const e=V.get(t);e&&(n[t]=X(u({shared:n.shared},h[t]),e))}return n}(t,e,this.config)}clean(){this._targetEventStore.clean();for(const t of this.gestures)this.gestureEventStores[t].clean(),this.gestureTimeoutStores[t].clean()}effect(){return this.config.shared.target&&this.bind(),()=>this._targetEventStore.clean()}bind(...t){const e=this.config.shared,n={};let i;if(!e.target||(i=e.target(),i)){if(e.enabled){for(const e of this.gestures){const s=this.config[e],r=W(n,s.eventOptions,!!i);if(s.enabled){new(B.get(e))(this,t,e).bind(r)}}const s=W(n,e.eventOptions,!!i);for(const e in this.nativeHandlers)s(e,"",(n=>this.nativeHandlers[e](u(u({},this.state.shared),{},{event:n,args:t}))),void 0,!0)}for(const t in n)n[t]=T(...n[t]);if(!i)return n;for(const t in n){const{device:e,capture:s,passive:r}=v(t);this._targetEventStore.add(i,e,"",n[t],{capture:s,passive:r})}}}}function N(t,e){t.gestures.add(e),t.gestureEventStores[e]=new Y(t,e),t.gestureTimeoutStores[e]=new q}const W=(t,e,n)=>(i,s,r,o={},a=!1)=>{var c,u;const h=null!==(c=o.capture)&&void 0!==c?c:e.capture,d=null!==(u=o.passive)&&void 0!==u?u:e.passive;let l=a?i:p(i,s,h);n&&d&&(l+="Passive"),t[l]=t[l]||[],t[l].push(r)};function F(t,e={},n,i){const s=H.useMemo((()=>new G(t)),[]);if(s.applyHandlers(t,i),s.applyConfig(e,n),H.useEffect(s.effect.bind(s)),H.useEffect((()=>s.clean.bind(s)),[]),void 0===e.target)return s.bind.bind(s)}function Q(t,e){var n;return n=U,B.set(n.key,n.engine),V.set(n.key,n.resolver),F({drag:t},e||{},"drag")}}}]);
//# sourceMappingURL=@use-gesture.eb627ef4.js.map