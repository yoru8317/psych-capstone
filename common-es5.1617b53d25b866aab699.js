(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{D0XW:function(e,t,n){"use strict";var r=n("quSY");class i extends r.a{constructor(e,t){super()}schedule(e,t=0){return this}}let s=(()=>{class e{constructor(t,n=e.now){this.SchedulerAction=t,this.now=n}schedule(e,t=0,n){return new this.SchedulerAction(this,e).schedule(n,t)}}return e.now=()=>Date.now(),e})();class o extends s{constructor(e,t=s.now){super(e,()=>o.delegate&&o.delegate!==this?o.delegate.now():t()),this.actions=[],this.active=!1,this.scheduled=void 0}schedule(e,t=0,n){return o.delegate&&o.delegate!==this?o.delegate.schedule(e,t,n):super.schedule(e,t,n)}flush(e){const{actions:t}=this;if(this.active)return void t.push(e);let n;this.active=!0;do{if(n=e.execute(e.state,e.delay))break}while(e=t.shift());if(this.active=!1,n){for(;e=t.shift();)e.unsubscribe();throw n}}}n.d(t,"a",(function(){return c}));const c=new o(class extends i{constructor(e,t){super(e,t),this.scheduler=e,this.work=t,this.pending=!1}schedule(e,t=0){if(this.closed)return this;this.state=e;const n=this.id,r=this.scheduler;return null!=n&&(this.id=this.recycleAsyncId(r,n,t)),this.pending=!0,this.delay=t,this.id=this.id||this.requestAsyncId(r,this.id,t),this}requestAsyncId(e,t,n=0){return setInterval(e.flush.bind(e,this),n)}recycleAsyncId(e,t,n=0){if(null!==n&&this.delay===n&&!1===this.pending)return t;clearInterval(t)}execute(e,t){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;const n=this._execute(e,t);if(n)return n;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))}_execute(e,t){let n=!1,r=void 0;try{this.work(e)}catch(i){n=!0,r=!!i&&i||new Error(i)}if(n)return this.unsubscribe(),r}_unsubscribe(){const e=this.id,t=this.scheduler,n=t.actions,r=n.indexOf(this);this.work=null,this.state=null,this.pending=!1,this.scheduler=null,-1!==r&&n.splice(r,1),null!=e&&(this.id=this.recycleAsyncId(t,e,null)),this.delay=null}})},Dl6n:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"b",(function(){return s})),n.d(t,"c",(function(){return r})),n.d(t,"d",(function(){return c}));const r=(e,t)=>null!==t.closest(e),i=e=>"string"==typeof e&&e.length>0?{"ion-color":!0,[`ion-color-${e}`]:!0}:void 0,s=e=>{const t={};return(e=>void 0!==e?(Array.isArray(e)?e:e.split(" ")).filter(e=>null!=e).map(e=>e.trim()).filter(e=>""!==e):[])(e).forEach(e=>t[e]=!0),t},o=/^[a-z][a-z0-9+\-.]*:/,c=async(e,t,n)=>{if(null!=e&&"#"!==e[0]&&!o.test(e)){const r=document.querySelector("ion-router");if(r)return null!=t&&t.preventDefault(),r.push(e,n)}return!1}},K6rM:function(e,t,n){"use strict";n.d(t,"a",(function(){return y})),n.d(t,"b",(function(){return M})),n.d(t,"c",(function(){return g})),n.d(t,"d",(function(){return v})),n.d(t,"e",(function(){return s}));var r=n("c1op"),i=n("kBU6");const s=e=>new Promise((t,n)=>{Object(r.m)(()=>{o(e),c(e).then(n=>{n.animation&&n.animation.destroy(),a(e),t(n)},t=>{a(e),n(t)})})}),o=e=>{const t=e.enteringEl,n=e.leavingEl;E(t,n,e.direction),e.showGoBack?t.classList.add("can-go-back"):t.classList.remove("can-go-back"),v(t,!1),n&&v(n,!1)},c=async e=>{const t=await u(e);return t?l(t,e):d(e)},a=e=>{const t=e.leavingEl;e.enteringEl.classList.remove("ion-page-invisible"),void 0!==t&&t.classList.remove("ion-page-invisible")},u=async e=>{if(e.leavingEl&&e.animated&&0!==e.duration)return e.animationBuilder?e.animationBuilder:"ios"===e.mode?(await n.e(100).then(n.bind(null,"5+Pq"))).iosTransitionAnimation:(await n.e(101).then(n.bind(null,"RRi8"))).mdTransitionAnimation},l=async(e,t)=>{let r;await h(t,!0);try{const i=await n.e(5).then(n.bind(null,"gHMO"));r=await i.create(e,t.baseEl,t)}catch(s){r=e(t.baseEl,t)}m(t.enteringEl,t.leavingEl);const i=await p(r,t);return t.progressCallback&&t.progressCallback(void 0),i&&w(t.enteringEl,t.leavingEl),{hasCompleted:i,animation:r}},d=async e=>{const t=e.enteringEl,n=e.leavingEl;return await h(e,!1),m(t,n),w(t,n),{hasCompleted:!0}},h=async(e,t)=>{const n=(void 0!==e.deepWait?e.deepWait:t)?[y(e.enteringEl),y(e.leavingEl)]:[b(e.enteringEl),b(e.leavingEl)];await Promise.all(n),await f(e.viewIsReady,e.enteringEl)},f=async(e,t)=>{e&&await e(t)},p=(e,t)=>{const n=t.progressCallback,r=new Promise(t=>{e.onFinish(n=>{"number"==typeof n?t(1===n):void 0!==e.hasCompleted&&t(e.hasCompleted)})});return n?(e.progressStart(!0),n(e)):e.play(),r},m=(e,t)=>{g(t,i.c),g(e,i.a)},w=(e,t)=>{g(e,i.b),g(t,i.d)},g=(e,t)=>{if(e){const n=new CustomEvent(t,{bubbles:!1,cancelable:!1});e.dispatchEvent(n)}},b=e=>e&&e.componentOnReady?e.componentOnReady():Promise.resolve(),y=async e=>{const t=e;if(t){if(null!=t.componentOnReady&&null!=await t.componentOnReady())return;await Promise.all(Array.from(t.children).map(y))}},v=(e,t)=>{t?(e.setAttribute("aria-hidden","true"),e.classList.add("ion-page-hidden")):(e.hidden=!1,e.removeAttribute("aria-hidden"),e.classList.remove("ion-page-hidden"))},E=(e,t,n)=>{void 0!==e&&(e.style.zIndex="back"===n?"99":"101"),void 0!==t&&(t.style.zIndex="100")},M=e=>e.classList.contains("ion-page")?e:e.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs")||e},PqYM:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var r=n("HDdC"),i=n("D0XW"),s=n("Y7HM"),o=n("z+Ro");function c(e=0,t,n){let c=-1;return Object(s.a)(t)?c=Number(t)<1?1:Number(t):Object(o.a)(t)&&(n=t),Object(o.a)(n)||(n=i.a),new r.a(t=>{const r=Object(s.a)(e)?e:+e-n.now();return n.schedule(a,r,{index:0,period:c,subscriber:t})})}function a(e){const{index:t,period:n,subscriber:r}=e;if(r.next(t),!r.closed){if(-1===n)return r.complete();e.index=t+1,this.schedule(e,n)}}},Xy44:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n("IheW"),i=n("ZZ/e"),s=n("8Y7J");let o=(()=>{class e{constructor(e,t){this.http=e,this.events=t}getData(){const e={headers:new r.g({"Content-Type":"application/json; charset=utf-8",Authorization:"Bearer "+localStorage.getItem("token")})};return this.http.post("https://crossfacerecognition.herokuapp.com/userData/",{},e)}}return e.ngInjectableDef=s.Xb({factory:function(){return new e(s.Yb(r.c),s.Yb(i.e))},token:e,providedIn:"root"}),e})()},Y7HM:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var r=n("DH7j");function i(e){return!Object(r.a)(e)&&e-parseFloat(e)+1>=0}},YtD4:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));const r=e=>{try{if("string"!=typeof e||""===e)return e;const t=document.createDocumentFragment(),n=document.createElement("div");t.appendChild(n),n.innerHTML=e,c.forEach(e=>{const n=t.querySelectorAll(e);for(let r=n.length-1;r>=0;r--){const e=n[r];e.parentNode?e.parentNode.removeChild(e):t.removeChild(e);const o=s(e);for(let t=0;t<o.length;t++)i(o[t])}});const r=s(t);for(let e=0;e<r.length;e++)i(r[e]);const o=document.createElement("div");o.appendChild(t);const a=o.querySelector("div");return null!==a?a.innerHTML:o.innerHTML}catch(t){return console.error(t),""}},i=e=>{if(e.nodeType&&1!==e.nodeType)return;for(let n=e.attributes.length-1;n>=0;n--){const t=e.attributes.item(n),r=t.name;if(!o.includes(r.toLowerCase())){e.removeAttribute(r);continue}const i=t.value;null!=i&&i.toLowerCase().includes("javascript:")&&e.removeAttribute(r)}const t=s(e);for(let n=0;n<t.length;n++)i(t[n])},s=e=>null!=e.children?e.children:e.childNodes,o=["class","id","href","src","name","slot"],c=["script","style","iframe","meta","link","object","embed"]},l5mm:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));var r=n("HDdC"),i=n("D0XW"),s=n("Y7HM");function o(e=0,t=i.a){return(!Object(s.a)(e)||e<0)&&(e=0),t&&"function"==typeof t.schedule||(t=i.a),new r.a(n=>(n.add(t.schedule(c,e,{subscriber:n,counter:0,period:e})),n))}function c(e){const{subscriber:t,counter:n,period:r}=e;t.next(n),this.schedule({subscriber:t,counter:n+1,period:r},r)}},m9yc:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return i}));const r=async(e,t,n,r,i)=>{if(e)return e.attachViewToDom(t,n,i,r);if("string"!=typeof n&&!(n instanceof HTMLElement))throw new Error("framework delegate is missing");const s="string"==typeof n?t.ownerDocument&&t.ownerDocument.createElement(n):n;return r&&r.forEach(e=>s.classList.add(e)),i&&Object.assign(s,i),t.appendChild(s),s.componentOnReady&&await s.componentOnReady(),s},i=(e,t)=>{if(t){if(e)return e.removeViewFromDom(t.parentElement,t);t.remove()}return Promise.resolve()}},"nN+u":function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return r}));const r=(e,t,n)=>{const r=new MutationObserver(e=>{n(i(e,t))});return r.observe(e,{childList:!0,subtree:!0}),r},i=(e,t)=>{let n;return e.forEach(e=>{for(let r=0;r<e.addedNodes.length;r++)n=s(e.addedNodes[r],t)||n}),n},s=(e,t)=>{if(1===e.nodeType)return(e.tagName===t.toUpperCase()?[e]:Array.from(e.querySelectorAll(t))).find(e=>!0===e.checked)}},opz7:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"b",(function(){return s})),n.d(t,"c",(function(){return o})),n.d(t,"d",(function(){return r}));const r=()=>{const e=window.TapticEngine;e&&e.selection()},i=()=>{const e=window.TapticEngine;e&&e.gestureSelectionStart()},s=()=>{const e=window.TapticEngine;e&&e.gestureSelectionChanged()},o=()=>{const e=window.TapticEngine;e&&e.gestureSelectionEnd()}},qaSm:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return i}));class r{constructor(e,t){this.x=e,this.y=t}}const i=(e,t,n,r,i)=>{const c=o(e.y,t.y,n.y,r.y,i);return s(e.x,t.x,n.x,r.x,c[0])},s=(e,t,n,r,i)=>i*(3*t*Math.pow(i-1,2)+i*(-3*n*i+3*n+r*i))-e*Math.pow(i-1,3),o=(e,t,n,r,i)=>c((r-=i)-3*(n-=i)+3*(t-=i)-(e-=i),3*n-6*t+3*e,3*t-3*e,e).filter(e=>e>=0&&e<=1),c=(e,t,n,r)=>{if(0===e)return((e,t,n)=>{const r=t*t-4*e*n;return r<0?[]:[(-t+Math.sqrt(r))/(2*e),(-t-Math.sqrt(r))/(2*e)]})(t,n,r);const i=(3*(n/=e)-(t/=e)*t)/3,s=(2*t*t*t-9*t*n+27*(r/=e))/27;if(0===i)return[Math.pow(-s,1/3)];if(0===s)return[Math.sqrt(-i),-Math.sqrt(-i)];const o=Math.pow(s/2,2)+Math.pow(i/3,3);if(0===o)return[Math.pow(s/2,.5)-t/3];if(o>0)return[Math.pow(-s/2+Math.sqrt(o),1/3)-Math.pow(s/2+Math.sqrt(o),1/3)-t/3];const c=Math.sqrt(Math.pow(-i/3,3)),a=Math.acos(-s/(2*Math.sqrt(Math.pow(-i/3,3)))),u=2*Math.pow(c,1/3);return[u*Math.cos(a/3)-t/3,u*Math.cos((a+2*Math.PI)/3)-t/3,u*Math.cos((a+4*Math.PI)/3)-t/3]}}}]);