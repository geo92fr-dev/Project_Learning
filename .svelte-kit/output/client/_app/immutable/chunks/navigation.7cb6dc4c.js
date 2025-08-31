import{w as Aa}from"./index.2202404a.js";import{h as ba}from"./singletons.034d086d.js";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Es=function(n){const e=[];let i=0;for(let r=0;r<n.length;r++){let o=n.charCodeAt(r);o<128?e[i++]=o:o<2048?(e[i++]=o>>6|192,e[i++]=o&63|128):(o&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(o=65536+((o&1023)<<10)+(n.charCodeAt(++r)&1023),e[i++]=o>>18|240,e[i++]=o>>12&63|128,e[i++]=o>>6&63|128,e[i++]=o&63|128):(e[i++]=o>>12|224,e[i++]=o>>6&63|128,e[i++]=o&63|128)}return e},Sa=function(n){const e=[];let i=0,r=0;for(;i<n.length;){const o=n[i++];if(o<128)e[r++]=String.fromCharCode(o);else if(o>191&&o<224){const c=n[i++];e[r++]=String.fromCharCode((o&31)<<6|c&63)}else if(o>239&&o<365){const c=n[i++],h=n[i++],p=n[i++],y=((o&7)<<18|(c&63)<<12|(h&63)<<6|p&63)-65536;e[r++]=String.fromCharCode(55296+(y>>10)),e[r++]=String.fromCharCode(56320+(y&1023))}else{const c=n[i++],h=n[i++];e[r++]=String.fromCharCode((o&15)<<12|(c&63)<<6|h&63)}}return e.join("")},As={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const i=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let o=0;o<n.length;o+=3){const c=n[o],h=o+1<n.length,p=h?n[o+1]:0,y=o+2<n.length,T=y?n[o+2]:0,A=c>>2,S=(c&3)<<4|p>>4;let R=(p&15)<<2|T>>6,N=T&63;y||(N=64,h||(R=64)),r.push(i[A],i[S],i[R],i[N])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Es(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Sa(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const i=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let o=0;o<n.length;){const c=i[n.charAt(o++)],p=o<n.length?i[n.charAt(o)]:0;++o;const T=o<n.length?i[n.charAt(o)]:64;++o;const S=o<n.length?i[n.charAt(o)]:64;if(++o,c==null||p==null||T==null||S==null)throw new Ra;const R=c<<2|p>>4;if(r.push(R),T!==64){const N=p<<4&240|T>>2;if(r.push(N),S!==64){const C=T<<6&192|S;r.push(C)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Ra extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const ka=function(n){const e=Es(n);return As.encodeByteArray(e,!0)},tn=function(n){return ka(n).replace(/\./g,"")},bs=function(n){try{return As.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ca(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pa=()=>Ca().__FIREBASE_DEFAULTS__,Oa=()=>{if(typeof process>"u"||typeof process.env>"u")return;const n={}.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Da=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&bs(n[1]);return e&&JSON.parse(e)},di=()=>{try{return Pa()||Oa()||Da()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Ss=n=>{var e,i;return(i=(e=di())===null||e===void 0?void 0:e.emulatorHosts)===null||i===void 0?void 0:i[n]},Na=n=>{const e=Ss(n);if(!e)return;const i=e.lastIndexOf(":");if(i<=0||i+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(i+1),10);return e[0]==="["?[e.substring(1,i-1),r]:[e.substring(0,i),r]},Rs=()=>{var n;return(n=di())===null||n===void 0?void 0:n.config},ks=n=>{var e;return(e=di())===null||e===void 0?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class La{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,i)=>{this.resolve=e,this.reject=i})}wrapCallback(e){return(i,r)=>{i?this.reject(i):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(i):e(i,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ma(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const i={alg:"none",type:"JWT"},r=e||"demo-project",o=n.iat||0,c=n.sub||n.user_id;if(!c)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const h=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:o,exp:o+3600,auth_time:o,sub:c,user_id:c,firebase:{sign_in_provider:"custom",identities:{}}},n),p="";return[tn(JSON.stringify(i)),tn(JSON.stringify(h)),p].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Ua(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(q())}function xa(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Cs(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Fa(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function ja(){const n=q();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Ps(){try{return typeof indexedDB=="object"}catch{return!1}}function Os(){return new Promise((n,e)=>{try{let i=!0;const r="validate-browser-context-for-indexeddb-analytics-module",o=self.indexedDB.open(r);o.onsuccess=()=>{o.result.close(),i||self.indexedDB.deleteDatabase(r),n(!0)},o.onupgradeneeded=()=>{i=!1},o.onerror=()=>{var c;e(((c=o.error)===null||c===void 0?void 0:c.message)||"")}}catch(i){e(i)}})}function Ba(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $a="FirebaseError";class ae extends Error{constructor(e,i,r){super(i),this.code=e,this.customData=r,this.name=$a,Object.setPrototypeOf(this,ae.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ze.prototype.create)}}class ze{constructor(e,i,r){this.service=e,this.serviceName=i,this.errors=r}create(e,...i){const r=i[0]||{},o=`${this.service}/${e}`,c=this.errors[e],h=c?Va(c,r):"Error",p=`${this.serviceName}: ${h} (${o}).`;return new ae(o,p,r)}}function Va(n,e){return n.replace(Ha,(i,r)=>{const o=e[r];return o!=null?String(o):`<${r}?>`})}const Ha=/\{\$([^}]+)}/g;function za(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function St(n,e){if(n===e)return!0;const i=Object.keys(n),r=Object.keys(e);for(const o of i){if(!r.includes(o))return!1;const c=n[o],h=e[o];if(Lr(c)&&Lr(h)){if(!St(c,h))return!1}else if(c!==h)return!1}for(const o of r)if(!i.includes(o))return!1;return!0}function Lr(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ct(n){const e=[];for(const[i,r]of Object.entries(n))Array.isArray(r)?r.forEach(o=>{e.push(encodeURIComponent(i)+"="+encodeURIComponent(o))}):e.push(encodeURIComponent(i)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Wa(n,e){const i=new Ga(n,e);return i.subscribe.bind(i)}class Ga{constructor(e,i){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=i,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(i=>{i.next(e)})}error(e){this.forEachObserver(i=>{i.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,i,r){let o;if(e===void 0&&i===void 0&&r===void 0)throw new Error("Missing Observer.");qa(e,["next","error","complete"])?o=e:o={next:e,error:i,complete:r},o.next===void 0&&(o.next=Wn),o.error===void 0&&(o.error=Wn),o.complete===void 0&&(o.complete=Wn);const c=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?o.error(this.finalError):o.complete()}catch{}}),this.observers.push(o),c}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let i=0;i<this.observers.length;i++)this.sendOne(i,e)}sendOne(e,i){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{i(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function qa(n,e){if(typeof n!="object"||n===null)return!1;for(const i of e)if(i in n&&typeof n[i]=="function")return!0;return!1}function Wn(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ka=1e3,Ja=2,Xa=4*60*60*1e3,Ya=.5;function Mr(n,e=Ka,i=Ja){const r=e*Math.pow(i,n),o=Math.round(Ya*r*(Math.random()-.5)*2);return Math.min(Xa,r+o)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ue(n){return n&&n._delegate?n._delegate:n}class oe{constructor(e,i,r){this.name=e,this.instanceFactory=i,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xe="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qa{constructor(e,i){this.name=e,this.container=i,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const i=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(i)){const r=new La;if(this.instancesDeferred.set(i,r),this.isInitialized(i)||this.shouldAutoInitialize())try{const o=this.getOrInitializeService({instanceIdentifier:i});o&&r.resolve(o)}catch{}}return this.instancesDeferred.get(i).promise}getImmediate(e){var i;const r=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),o=(i=e==null?void 0:e.optional)!==null&&i!==void 0?i:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(c){if(o)return null;throw c}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(ec(e))try{this.getOrInitializeService({instanceIdentifier:xe})}catch{}for(const[i,r]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(i);try{const c=this.getOrInitializeService({instanceIdentifier:o});r.resolve(c)}catch{}}}}clearInstance(e=xe){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(i=>"INTERNAL"in i).map(i=>i.INTERNAL.delete()),...e.filter(i=>"_delete"in i).map(i=>i._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=xe){return this.instances.has(e)}getOptions(e=xe){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:i={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const o=this.getOrInitializeService({instanceIdentifier:r,options:i});for(const[c,h]of this.instancesDeferred.entries()){const p=this.normalizeInstanceIdentifier(c);r===p&&h.resolve(o)}return o}onInit(e,i){var r;const o=this.normalizeInstanceIdentifier(i),c=(r=this.onInitCallbacks.get(o))!==null&&r!==void 0?r:new Set;c.add(e),this.onInitCallbacks.set(o,c);const h=this.instances.get(o);return h&&e(h,o),()=>{c.delete(e)}}invokeOnInitCallbacks(e,i){const r=this.onInitCallbacks.get(i);if(r)for(const o of r)try{o(e,i)}catch{}}getOrInitializeService({instanceIdentifier:e,options:i={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Za(e),options:i}),this.instances.set(e,r),this.instancesOptions.set(e,i),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=xe){return this.component?this.component.multipleInstances?e:xe:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Za(n){return n===xe?void 0:n}function ec(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tc{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const i=this.getProvider(e.name);if(i.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);i.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const i=new Qa(e,this);return this.providers.set(e,i),i}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var O;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(O||(O={}));const nc={debug:O.DEBUG,verbose:O.VERBOSE,info:O.INFO,warn:O.WARN,error:O.ERROR,silent:O.SILENT},ic=O.INFO,rc={[O.DEBUG]:"log",[O.VERBOSE]:"log",[O.INFO]:"info",[O.WARN]:"warn",[O.ERROR]:"error"},sc=(n,e,...i)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),o=rc[e];if(o)console[o](`[${r}]  ${n.name}:`,...i);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class dn{constructor(e){this.name=e,this._logLevel=ic,this._logHandler=sc,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in O))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?nc[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,O.DEBUG,...e),this._logHandler(this,O.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,O.VERBOSE,...e),this._logHandler(this,O.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,O.INFO,...e),this._logHandler(this,O.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,O.WARN,...e),this._logHandler(this,O.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,O.ERROR,...e),this._logHandler(this,O.ERROR,...e)}}const oc=(n,e)=>e.some(i=>n instanceof i);let Ur,xr;function ac(){return Ur||(Ur=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function cc(){return xr||(xr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Ds=new WeakMap,ii=new WeakMap,Ns=new WeakMap,Gn=new WeakMap,fi=new WeakMap;function lc(n){const e=new Promise((i,r)=>{const o=()=>{n.removeEventListener("success",c),n.removeEventListener("error",h)},c=()=>{i(Oe(n.result)),o()},h=()=>{r(n.error),o()};n.addEventListener("success",c),n.addEventListener("error",h)});return e.then(i=>{i instanceof IDBCursor&&Ds.set(i,n)}).catch(()=>{}),fi.set(e,n),e}function hc(n){if(ii.has(n))return;const e=new Promise((i,r)=>{const o=()=>{n.removeEventListener("complete",c),n.removeEventListener("error",h),n.removeEventListener("abort",h)},c=()=>{i(),o()},h=()=>{r(n.error||new DOMException("AbortError","AbortError")),o()};n.addEventListener("complete",c),n.addEventListener("error",h),n.addEventListener("abort",h)});ii.set(n,e)}let ri={get(n,e,i){if(n instanceof IDBTransaction){if(e==="done")return ii.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Ns.get(n);if(e==="store")return i.objectStoreNames[1]?void 0:i.objectStore(i.objectStoreNames[0])}return Oe(n[e])},set(n,e,i){return n[e]=i,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function uc(n){ri=n(ri)}function dc(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...i){const r=n.call(qn(this),e,...i);return Ns.set(r,e.sort?e.sort():[e]),Oe(r)}:cc().includes(n)?function(...e){return n.apply(qn(this),e),Oe(Ds.get(this))}:function(...e){return Oe(n.apply(qn(this),e))}}function fc(n){return typeof n=="function"?dc(n):(n instanceof IDBTransaction&&hc(n),oc(n,ac())?new Proxy(n,ri):n)}function Oe(n){if(n instanceof IDBRequest)return lc(n);if(Gn.has(n))return Gn.get(n);const e=fc(n);return e!==n&&(Gn.set(n,e),fi.set(e,n)),e}const qn=n=>fi.get(n);function Ls(n,e,{blocked:i,upgrade:r,blocking:o,terminated:c}={}){const h=indexedDB.open(n,e),p=Oe(h);return r&&h.addEventListener("upgradeneeded",y=>{r(Oe(h.result),y.oldVersion,y.newVersion,Oe(h.transaction),y)}),i&&h.addEventListener("blocked",y=>i(y.oldVersion,y.newVersion,y)),p.then(y=>{c&&y.addEventListener("close",()=>c()),o&&y.addEventListener("versionchange",T=>o(T.oldVersion,T.newVersion,T))}).catch(()=>{}),p}const pc=["get","getKey","getAll","getAllKeys","count"],gc=["put","add","delete","clear"],Kn=new Map;function Fr(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Kn.get(e))return Kn.get(e);const i=e.replace(/FromIndex$/,""),r=e!==i,o=gc.includes(i);if(!(i in(r?IDBIndex:IDBObjectStore).prototype)||!(o||pc.includes(i)))return;const c=async function(h,...p){const y=this.transaction(h,o?"readwrite":"readonly");let T=y.store;return r&&(T=T.index(p.shift())),(await Promise.all([T[i](...p),o&&y.done]))[0]};return Kn.set(e,c),c}uc(n=>({...n,get:(e,i,r)=>Fr(e,i)||n.get(e,i,r),has:(e,i)=>!!Fr(e,i)||n.has(e,i)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mc{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(i=>{if(yc(i)){const r=i.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(i=>i).join(" ")}}function yc(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const si="@firebase/app",jr="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const we=new dn("@firebase/app"),vc="@firebase/app-compat",_c="@firebase/analytics-compat",Ic="@firebase/analytics",wc="@firebase/app-check-compat",Tc="@firebase/app-check",Ec="@firebase/auth",Ac="@firebase/auth-compat",bc="@firebase/database",Sc="@firebase/data-connect",Rc="@firebase/database-compat",kc="@firebase/functions",Cc="@firebase/functions-compat",Pc="@firebase/installations",Oc="@firebase/installations-compat",Dc="@firebase/messaging",Nc="@firebase/messaging-compat",Lc="@firebase/performance",Mc="@firebase/performance-compat",Uc="@firebase/remote-config",xc="@firebase/remote-config-compat",Fc="@firebase/storage",jc="@firebase/storage-compat",Bc="@firebase/firestore",$c="@firebase/vertexai-preview",Vc="@firebase/firestore-compat",Hc="firebase",zc="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oi="[DEFAULT]",Wc={[si]:"fire-core",[vc]:"fire-core-compat",[Ic]:"fire-analytics",[_c]:"fire-analytics-compat",[Tc]:"fire-app-check",[wc]:"fire-app-check-compat",[Ec]:"fire-auth",[Ac]:"fire-auth-compat",[bc]:"fire-rtdb",[Sc]:"fire-data-connect",[Rc]:"fire-rtdb-compat",[kc]:"fire-fn",[Cc]:"fire-fn-compat",[Pc]:"fire-iid",[Oc]:"fire-iid-compat",[Dc]:"fire-fcm",[Nc]:"fire-fcm-compat",[Lc]:"fire-perf",[Mc]:"fire-perf-compat",[Uc]:"fire-rc",[xc]:"fire-rc-compat",[Fc]:"fire-gcs",[jc]:"fire-gcs-compat",[Bc]:"fire-fst",[Vc]:"fire-fst-compat",[$c]:"fire-vertex","fire-js":"fire-js",[Hc]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nn=new Map,Gc=new Map,ai=new Map;function Br(n,e){try{n.container.addComponent(e)}catch(i){we.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,i)}}function le(n){const e=n.name;if(ai.has(e))return we.debug(`There were multiple attempts to register component ${e}.`),!1;ai.set(e,n);for(const i of nn.values())Br(i,n);for(const i of Gc.values())Br(i,n);return!0}function We(n,e){const i=n.container.getProvider("heartbeat").getImmediate({optional:!0});return i&&i.triggerHeartbeat(),n.container.getProvider(e)}function ye(n){return n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qc={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},De=new ze("app","Firebase",qc);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kc{constructor(e,i,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},i),this._name=i.name,this._automaticDataCollectionEnabled=i.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new oe("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw De.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nt=zc;function Ms(n,e={}){let i=n;typeof e!="object"&&(e={name:e});const r=Object.assign({name:oi,automaticDataCollectionEnabled:!1},e),o=r.name;if(typeof o!="string"||!o)throw De.create("bad-app-name",{appName:String(o)});if(i||(i=Rs()),!i)throw De.create("no-options");const c=nn.get(o);if(c){if(St(i,c.options)&&St(r,c.config))return c;throw De.create("duplicate-app",{appName:o})}const h=new tc(o);for(const y of ai.values())h.addComponent(y);const p=new Kc(i,r,h);return nn.set(o,p),p}function pi(n=oi){const e=nn.get(n);if(!e&&n===oi&&Rs())return Ms();if(!e)throw De.create("no-app",{appName:n});return e}function te(n,e,i){var r;let o=(r=Wc[n])!==null&&r!==void 0?r:n;i&&(o+=`-${i}`);const c=o.match(/\s|\//),h=e.match(/\s|\//);if(c||h){const p=[`Unable to register library "${o}" with version "${e}":`];c&&p.push(`library name "${o}" contains illegal characters (whitespace or "/")`),c&&h&&p.push("and"),h&&p.push(`version name "${e}" contains illegal characters (whitespace or "/")`),we.warn(p.join(" "));return}le(new oe(`${o}-version`,()=>({library:o,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jc="firebase-heartbeat-database",Xc=1,Rt="firebase-heartbeat-store";let Jn=null;function Us(){return Jn||(Jn=Ls(Jc,Xc,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Rt)}catch(i){console.warn(i)}}}}).catch(n=>{throw De.create("idb-open",{originalErrorMessage:n.message})})),Jn}async function Yc(n){try{const i=(await Us()).transaction(Rt),r=await i.objectStore(Rt).get(xs(n));return await i.done,r}catch(e){if(e instanceof ae)we.warn(e.message);else{const i=De.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});we.warn(i.message)}}}async function $r(n,e){try{const r=(await Us()).transaction(Rt,"readwrite");await r.objectStore(Rt).put(e,xs(n)),await r.done}catch(i){if(i instanceof ae)we.warn(i.message);else{const r=De.create("idb-set",{originalErrorMessage:i==null?void 0:i.message});we.warn(r.message)}}}function xs(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qc=1024,Zc=30*24*60*60*1e3;class el{constructor(e){this.container=e,this._heartbeatsCache=null;const i=this.container.getProvider("app").getImmediate();this._storage=new nl(i),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,i;try{const o=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),c=Vr();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((i=this._heartbeatsCache)===null||i===void 0?void 0:i.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===c||this._heartbeatsCache.heartbeats.some(h=>h.date===c)?void 0:(this._heartbeatsCache.heartbeats.push({date:c,agent:o}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(h=>{const p=new Date(h.date).valueOf();return Date.now()-p<=Zc}),this._storage.overwrite(this._heartbeatsCache))}catch(r){we.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const i=Vr(),{heartbeatsToSend:r,unsentEntries:o}=tl(this._heartbeatsCache.heartbeats),c=tn(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=i,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),c}catch(i){return we.warn(i),""}}}function Vr(){return new Date().toISOString().substring(0,10)}function tl(n,e=Qc){const i=[];let r=n.slice();for(const o of n){const c=i.find(h=>h.agent===o.agent);if(c){if(c.dates.push(o.date),Hr(i)>e){c.dates.pop();break}}else if(i.push({agent:o.agent,dates:[o.date]}),Hr(i)>e){i.pop();break}r=r.slice(1)}return{heartbeatsToSend:i,unsentEntries:r}}class nl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ps()?Os().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const i=await Yc(this.app);return i!=null&&i.heartbeats?i:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var i;if(await this._canUseIndexedDBPromise){const o=await this.read();return $r(this.app,{lastSentHeartbeatDate:(i=e.lastSentHeartbeatDate)!==null&&i!==void 0?i:o.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var i;if(await this._canUseIndexedDBPromise){const o=await this.read();return $r(this.app,{lastSentHeartbeatDate:(i=e.lastSentHeartbeatDate)!==null&&i!==void 0?i:o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...e.heartbeats]})}else return}}function Hr(n){return tn(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function il(n){le(new oe("platform-logger",e=>new mc(e),"PRIVATE")),le(new oe("heartbeat",e=>new el(e),"PRIVATE")),te(si,jr,n),te(si,jr,"esm2017"),te("fire-js","")}il("");var rl="firebase",sl="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */te(rl,sl,"app");function gi(n,e){var i={};for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&e.indexOf(r)<0&&(i[r]=n[r]);if(n!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,r=Object.getOwnPropertySymbols(n);o<r.length;o++)e.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(n,r[o])&&(i[r[o]]=n[r[o]]);return i}function Fs(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const ol=Fs,js=new ze("auth","Firebase",Fs());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rn=new dn("@firebase/auth");function al(n,...e){rn.logLevel<=O.WARN&&rn.warn(`Auth (${nt}): ${n}`,...e)}function Yt(n,...e){rn.logLevel<=O.ERROR&&rn.error(`Auth (${nt}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(n,...e){throw yi(n,...e)}function se(n,...e){return yi(n,...e)}function mi(n,e,i){const r=Object.assign(Object.assign({},ol()),{[e]:i});return new ze("auth","Firebase",r).create(e,{appName:n.name})}function Be(n){return mi(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function cl(n,e,i){const r=i;if(!(e instanceof r))throw r.name!==e.constructor.name&&he(n,"argument-error"),mi(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function yi(n,...e){if(typeof n!="string"){const i=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(i,...r)}return js.create(n,...e)}function b(n,e,...i){if(!n)throw yi(e,...i)}function ve(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Yt(e),new Error(e)}function Te(n,e){n||ve(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ci(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.href)||""}function ll(){return zr()==="http:"||zr()==="https:"}function zr(){var n;return typeof self<"u"&&((n=self.location)===null||n===void 0?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hl(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(ll()||Cs()||"connection"in navigator)?navigator.onLine:!0}function ul(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(e,i){this.shortDelay=e,this.longDelay=i,Te(i>e,"Short delay should be less than long delay!"),this.isMobile=Ua()||Fa()}get(){return hl()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vi(n,e){Te(n.emulator,"Emulator should always be set here");const{url:i}=n.emulator;return e?`${i}${e.startsWith("/")?e.slice(1):e}`:i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{static initialize(e,i,r){this.fetchImpl=e,i&&(this.headersImpl=i),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ve("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ve("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ve("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dl={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fl=new Pt(3e4,6e4);function _i(n,e){return n.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:n.tenantId}):e}async function it(n,e,i,r,o={}){return $s(n,o,async()=>{let c={},h={};r&&(e==="GET"?h=r:c={body:JSON.stringify(r)});const p=Ct(Object.assign({key:n.config.apiKey},h)).slice(1),y=await n._getAdditionalHeaders();y["Content-Type"]="application/json",n.languageCode&&(y["X-Firebase-Locale"]=n.languageCode);const T=Object.assign({method:e,headers:y},c);return xa()||(T.referrerPolicy="no-referrer"),Bs.fetch()(Vs(n,n.config.apiHost,i,p),T)})}async function $s(n,e,i){n._canInitEmulator=!1;const r=Object.assign(Object.assign({},dl),e);try{const o=new gl(n),c=await Promise.race([i(),o.promise]);o.clearNetworkTimeout();const h=await c.json();if("needConfirmation"in h)throw Jt(n,"account-exists-with-different-credential",h);if(c.ok&&!("errorMessage"in h))return h;{const p=c.ok?h.errorMessage:h.error.message,[y,T]=p.split(" : ");if(y==="FEDERATED_USER_ID_ALREADY_LINKED")throw Jt(n,"credential-already-in-use",h);if(y==="EMAIL_EXISTS")throw Jt(n,"email-already-in-use",h);if(y==="USER_DISABLED")throw Jt(n,"user-disabled",h);const A=r[y]||y.toLowerCase().replace(/[_\s]+/g,"-");if(T)throw mi(n,A,T);he(n,A)}}catch(o){if(o instanceof ae)throw o;he(n,"network-request-failed",{message:String(o)})}}async function pl(n,e,i,r,o={}){const c=await it(n,e,i,r,o);return"mfaPendingCredential"in c&&he(n,"multi-factor-auth-required",{_serverResponse:c}),c}function Vs(n,e,i,r){const o=`${e}${i}?${r}`;return n.config.emulator?vi(n.config,o):`${n.config.apiScheme}://${o}`}class gl{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((i,r)=>{this.timer=setTimeout(()=>r(se(this.auth,"network-request-failed")),fl.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function Jt(n,e,i){const r={appName:n.name};i.email&&(r.email=i.email),i.phoneNumber&&(r.phoneNumber=i.phoneNumber);const o=se(n,e,r);return o.customData._tokenResponse=i,o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ml(n,e){return it(n,"POST","/v1/accounts:delete",e)}async function Hs(n,e){return it(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tt(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function yl(n,e=!1){const i=ue(n),r=await i.getIdToken(e),o=Ii(r);b(o&&o.exp&&o.auth_time&&o.iat,i.auth,"internal-error");const c=typeof o.firebase=="object"?o.firebase:void 0,h=c==null?void 0:c.sign_in_provider;return{claims:o,token:r,authTime:Tt(Xn(o.auth_time)),issuedAtTime:Tt(Xn(o.iat)),expirationTime:Tt(Xn(o.exp)),signInProvider:h||null,signInSecondFactor:(c==null?void 0:c.sign_in_second_factor)||null}}function Xn(n){return Number(n)*1e3}function Ii(n){const[e,i,r]=n.split(".");if(e===void 0||i===void 0||r===void 0)return Yt("JWT malformed, contained fewer than 3 sections"),null;try{const o=bs(i);return o?JSON.parse(o):(Yt("Failed to decode base64 JWT payload"),null)}catch(o){return Yt("Caught error parsing JWT payload as JSON",o==null?void 0:o.toString()),null}}function Wr(n){const e=Ii(n);return b(e,"internal-error"),b(typeof e.exp<"u","internal-error"),b(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kt(n,e,i=!1){if(i)return e;try{return await e}catch(r){throw r instanceof ae&&vl(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function vl({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var i;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const o=((i=this.user.stsTokenManager.expirationTime)!==null&&i!==void 0?i:0)-Date.now()-3e5;return Math.max(0,o)}}schedule(e=!1){if(!this.isRunning)return;const i=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},i)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class li{constructor(e,i){this.createdAt=e,this.lastLoginAt=i,this._initializeTime()}_initializeTime(){this.lastSignInTime=Tt(this.lastLoginAt),this.creationTime=Tt(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sn(n){var e;const i=n.auth,r=await n.getIdToken(),o=await kt(n,Hs(i,{idToken:r}));b(o==null?void 0:o.users.length,i,"internal-error");const c=o.users[0];n._notifyReloadListener(c);const h=!((e=c.providerUserInfo)===null||e===void 0)&&e.length?zs(c.providerUserInfo):[],p=wl(n.providerData,h),y=n.isAnonymous,T=!(n.email&&c.passwordHash)&&!(p!=null&&p.length),A=y?T:!1,S={uid:c.localId,displayName:c.displayName||null,photoURL:c.photoUrl||null,email:c.email||null,emailVerified:c.emailVerified||!1,phoneNumber:c.phoneNumber||null,tenantId:c.tenantId||null,providerData:p,metadata:new li(c.createdAt,c.lastLoginAt),isAnonymous:A};Object.assign(n,S)}async function Il(n){const e=ue(n);await sn(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function wl(n,e){return[...n.filter(r=>!e.some(o=>o.providerId===r.providerId)),...e]}function zs(n){return n.map(e=>{var{providerId:i}=e,r=gi(e,["providerId"]);return{providerId:i,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tl(n,e){const i=await $s(n,{},async()=>{const r=Ct({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:o,apiKey:c}=n.config,h=Vs(n,o,"/v1/token",`key=${c}`),p=await n._getAdditionalHeaders();return p["Content-Type"]="application/x-www-form-urlencoded",Bs.fetch()(h,{method:"POST",headers:p,body:r})});return{accessToken:i.access_token,expiresIn:i.expires_in,refreshToken:i.refresh_token}}async function El(n,e){return it(n,"POST","/v2/accounts:revokeToken",_i(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){b(e.idToken,"internal-error"),b(typeof e.idToken<"u","internal-error"),b(typeof e.refreshToken<"u","internal-error");const i="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Wr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,i)}updateFromIdToken(e){b(e.length!==0,"internal-error");const i=Wr(e);this.updateTokensAndExpiration(e,null,i)}async getToken(e,i=!1){return!i&&this.accessToken&&!this.isExpired?this.accessToken:(b(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,i){const{accessToken:r,refreshToken:o,expiresIn:c}=await Tl(e,i);this.updateTokensAndExpiration(r,o,Number(c))}updateTokensAndExpiration(e,i,r){this.refreshToken=i||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,i){const{refreshToken:r,accessToken:o,expirationTime:c}=i,h=new Ye;return r&&(b(typeof r=="string","internal-error",{appName:e}),h.refreshToken=r),o&&(b(typeof o=="string","internal-error",{appName:e}),h.accessToken=o),c&&(b(typeof c=="number","internal-error",{appName:e}),h.expirationTime=c),h}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ye,this.toJSON())}_performRefresh(){return ve("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Re(n,e){b(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class _e{constructor(e){var{uid:i,auth:r,stsTokenManager:o}=e,c=gi(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new _l(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=i,this.auth=r,this.stsTokenManager=o,this.accessToken=o.accessToken,this.displayName=c.displayName||null,this.email=c.email||null,this.emailVerified=c.emailVerified||!1,this.phoneNumber=c.phoneNumber||null,this.photoURL=c.photoURL||null,this.isAnonymous=c.isAnonymous||!1,this.tenantId=c.tenantId||null,this.providerData=c.providerData?[...c.providerData]:[],this.metadata=new li(c.createdAt||void 0,c.lastLoginAt||void 0)}async getIdToken(e){const i=await kt(this,this.stsTokenManager.getToken(this.auth,e));return b(i,this.auth,"internal-error"),this.accessToken!==i&&(this.accessToken=i,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),i}getIdTokenResult(e){return yl(this,e)}reload(){return Il(this)}_assign(e){this!==e&&(b(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(i=>Object.assign({},i)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const i=new _e(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return i.metadata._copy(this.metadata),i}_onReload(e){b(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,i=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),i&&await sn(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ye(this.auth.app))return Promise.reject(Be(this.auth));const e=await this.getIdToken();return await kt(this,ml(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,i){var r,o,c,h,p,y,T,A;const S=(r=i.displayName)!==null&&r!==void 0?r:void 0,R=(o=i.email)!==null&&o!==void 0?o:void 0,N=(c=i.phoneNumber)!==null&&c!==void 0?c:void 0,C=(h=i.photoURL)!==null&&h!==void 0?h:void 0,x=(p=i.tenantId)!==null&&p!==void 0?p:void 0,M=(y=i._redirectEventId)!==null&&y!==void 0?y:void 0,de=(T=i.createdAt)!==null&&T!==void 0?T:void 0,Q=(A=i.lastLoginAt)!==null&&A!==void 0?A:void 0,{uid:j,emailVerified:ne,isAnonymous:Ne,providerData:K,stsTokenManager:_}=i;b(j&&_,e,"internal-error");const u=Ye.fromJSON(this.name,_);b(typeof j=="string",e,"internal-error"),Re(S,e.name),Re(R,e.name),b(typeof ne=="boolean",e,"internal-error"),b(typeof Ne=="boolean",e,"internal-error"),Re(N,e.name),Re(C,e.name),Re(x,e.name),Re(M,e.name),Re(de,e.name),Re(Q,e.name);const f=new _e({uid:j,auth:e,email:R,emailVerified:ne,displayName:S,isAnonymous:Ne,photoURL:C,phoneNumber:N,tenantId:x,stsTokenManager:u,createdAt:de,lastLoginAt:Q});return K&&Array.isArray(K)&&(f.providerData=K.map(g=>Object.assign({},g))),M&&(f._redirectEventId=M),f}static async _fromIdTokenResponse(e,i,r=!1){const o=new Ye;o.updateFromServerResponse(i);const c=new _e({uid:i.localId,auth:e,stsTokenManager:o,isAnonymous:r});return await sn(c),c}static async _fromGetAccountInfoResponse(e,i,r){const o=i.users[0];b(o.localId!==void 0,"internal-error");const c=o.providerUserInfo!==void 0?zs(o.providerUserInfo):[],h=!(o.email&&o.passwordHash)&&!(c!=null&&c.length),p=new Ye;p.updateFromIdToken(r);const y=new _e({uid:o.localId,auth:e,stsTokenManager:p,isAnonymous:h}),T={uid:o.localId,displayName:o.displayName||null,photoURL:o.photoUrl||null,email:o.email||null,emailVerified:o.emailVerified||!1,phoneNumber:o.phoneNumber||null,tenantId:o.tenantId||null,providerData:c,metadata:new li(o.createdAt,o.lastLoginAt),isAnonymous:!(o.email&&o.passwordHash)&&!(c!=null&&c.length)};return Object.assign(y,T),y}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gr=new Map;function Ie(n){Te(n instanceof Function,"Expected a class definition");let e=Gr.get(n);return e?(Te(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Gr.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ws{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,i){this.storage[e]=i}async _get(e){const i=this.storage[e];return i===void 0?null:i}async _remove(e){delete this.storage[e]}_addListener(e,i){}_removeListener(e,i){}}Ws.type="NONE";const qr=Ws;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qt(n,e,i){return`firebase:${n}:${e}:${i}`}class Qe{constructor(e,i,r){this.persistence=e,this.auth=i,this.userKey=r;const{config:o,name:c}=this.auth;this.fullUserKey=Qt(this.userKey,o.apiKey,c),this.fullPersistenceKey=Qt("persistence",o.apiKey,c),this.boundEventHandler=i._onStorageEvent.bind(i),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?_e._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const i=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,i)return this.setCurrentUser(i)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,i,r="authUser"){if(!i.length)return new Qe(Ie(qr),e,r);const o=(await Promise.all(i.map(async T=>{if(await T._isAvailable())return T}))).filter(T=>T);let c=o[0]||Ie(qr);const h=Qt(r,e.config.apiKey,e.name);let p=null;for(const T of i)try{const A=await T._get(h);if(A){const S=_e._fromJSON(e,A);T!==c&&(p=S),c=T;break}}catch{}const y=o.filter(T=>T._shouldAllowMigration);return!c._shouldAllowMigration||!y.length?new Qe(c,e,r):(c=y[0],p&&await c._set(h,p.toJSON()),await Promise.all(i.map(async T=>{if(T!==c)try{await T._remove(h)}catch{}})),new Qe(c,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kr(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Js(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Gs(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ys(e))return"Blackberry";if(Qs(e))return"Webos";if(qs(e))return"Safari";if((e.includes("chrome/")||Ks(e))&&!e.includes("edge/"))return"Chrome";if(Xs(e))return"Android";{const i=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(i);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Gs(n=q()){return/firefox\//i.test(n)}function qs(n=q()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Ks(n=q()){return/crios\//i.test(n)}function Js(n=q()){return/iemobile/i.test(n)}function Xs(n=q()){return/android/i.test(n)}function Ys(n=q()){return/blackberry/i.test(n)}function Qs(n=q()){return/webos/i.test(n)}function wi(n=q()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function Al(n=q()){var e;return wi(n)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function bl(){return ja()&&document.documentMode===10}function Zs(n=q()){return wi(n)||Xs(n)||Qs(n)||Ys(n)||/windows phone/i.test(n)||Js(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eo(n,e=[]){let i;switch(n){case"Browser":i=Kr(q());break;case"Worker":i=`${Kr(q())}-${n}`;break;default:i=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${i}/JsCore/${nt}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sl{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,i){const r=c=>new Promise((h,p)=>{try{const y=e(c);h(y)}catch(y){p(y)}});r.onAbort=i,this.queue.push(r);const o=this.queue.length-1;return()=>{this.queue[o]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const i=[];try{for(const r of this.queue)await r(e),r.onAbort&&i.push(r.onAbort)}catch(r){i.reverse();for(const o of i)try{o()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rl(n,e={}){return it(n,"GET","/v2/passwordPolicy",_i(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kl=6;class Cl{constructor(e){var i,r,o,c;const h=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(i=h.minPasswordLength)!==null&&i!==void 0?i:kl,h.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=h.maxPasswordLength),h.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=h.containsLowercaseCharacter),h.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=h.containsUppercaseCharacter),h.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=h.containsNumericCharacter),h.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=h.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(o=(r=e.allowedNonAlphanumericCharacters)===null||r===void 0?void 0:r.join(""))!==null&&o!==void 0?o:"",this.forceUpgradeOnSignin=(c=e.forceUpgradeOnSignin)!==null&&c!==void 0?c:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var i,r,o,c,h,p;const y={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,y),this.validatePasswordCharacterOptions(e,y),y.isValid&&(y.isValid=(i=y.meetsMinPasswordLength)!==null&&i!==void 0?i:!0),y.isValid&&(y.isValid=(r=y.meetsMaxPasswordLength)!==null&&r!==void 0?r:!0),y.isValid&&(y.isValid=(o=y.containsLowercaseLetter)!==null&&o!==void 0?o:!0),y.isValid&&(y.isValid=(c=y.containsUppercaseLetter)!==null&&c!==void 0?c:!0),y.isValid&&(y.isValid=(h=y.containsNumericCharacter)!==null&&h!==void 0?h:!0),y.isValid&&(y.isValid=(p=y.containsNonAlphanumericCharacter)!==null&&p!==void 0?p:!0),y}validatePasswordLengthOptions(e,i){const r=this.customStrengthOptions.minPasswordLength,o=this.customStrengthOptions.maxPasswordLength;r&&(i.meetsMinPasswordLength=e.length>=r),o&&(i.meetsMaxPasswordLength=e.length<=o)}validatePasswordCharacterOptions(e,i){this.updatePasswordCharacterOptionsStatuses(i,!1,!1,!1,!1);let r;for(let o=0;o<e.length;o++)r=e.charAt(o),this.updatePasswordCharacterOptionsStatuses(i,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,i,r,o,c){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=i)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=o)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=c))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(e,i,r,o){this.app=e,this.heartbeatServiceProvider=i,this.appCheckServiceProvider=r,this.config=o,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Jr(this),this.idTokenSubscription=new Jr(this),this.beforeStateQueue=new Sl(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=js,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=o.sdkClientVersion}_initializeWithPersistence(e,i){return i&&(this._popupRedirectResolver=Ie(i)),this._initializationPromise=this.queue(async()=>{var r,o;if(!this._deleted&&(this.persistenceManager=await Qe.create(this,e),!this._deleted)){if(!((r=this._popupRedirectResolver)===null||r===void 0)&&r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(i),this.lastNotifiedUid=((o=this.currentUser)===null||o===void 0?void 0:o.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const i=await Hs(this,{idToken:e}),r=await _e._fromGetAccountInfoResponse(this,i,e);await this.directlySetCurrentUser(r)}catch(i){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",i),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(ye(this.app)){const h=this.app.settings.authIdToken;return h?new Promise(p=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(h).then(p,p))}):this.directlySetCurrentUser(null)}const r=await this.assertedPersistence.getCurrentUser();let o=r,c=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const h=(i=this.redirectUser)===null||i===void 0?void 0:i._redirectEventId,p=o==null?void 0:o._redirectEventId,y=await this.tryRedirectSignIn(e);(!h||h===p)&&(y!=null&&y.user)&&(o=y.user,c=!0)}if(!o)return this.directlySetCurrentUser(null);if(!o._redirectEventId){if(c)try{await this.beforeStateQueue.runMiddleware(o)}catch(h){o=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(h))}return o?this.reloadAndSetCurrentUserOrClear(o):this.directlySetCurrentUser(null)}return b(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===o._redirectEventId?this.directlySetCurrentUser(o):this.reloadAndSetCurrentUserOrClear(o)}async tryRedirectSignIn(e){let i=null;try{i=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return i}async reloadAndSetCurrentUserOrClear(e){try{await sn(e)}catch(i){if((i==null?void 0:i.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=ul()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ye(this.app))return Promise.reject(Be(this));const i=e?ue(e):null;return i&&b(i.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(i&&i._clone(this))}async _updateCurrentUser(e,i=!1){if(!this._deleted)return e&&b(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),i||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ye(this.app)?Promise.reject(Be(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ye(this.app)?Promise.reject(Be(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ie(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const i=this._getPasswordPolicyInternal();return i.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):i.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await Rl(this),i=new Cl(e);this.tenantId===null?this._projectPasswordPolicy=i:this._tenantPasswordPolicies[this.tenantId]=i}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new ze("auth","Firebase",e())}onAuthStateChanged(e,i,r){return this.registerStateListener(this.authStateSubscription,e,i,r)}beforeAuthStateChanged(e,i){return this.beforeStateQueue.pushCallback(e,i)}onIdTokenChanged(e,i,r){return this.registerStateListener(this.idTokenSubscription,e,i,r)}authStateReady(){return new Promise((e,i)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},i)}})}async revokeAccessToken(e){if(this.currentUser){const i=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:i};this.tenantId!=null&&(r.tenantId=this.tenantId),await El(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,i){const r=await this.getOrInitRedirectPersistenceManager(i);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const i=e&&Ie(e)||this._popupRedirectResolver;b(i,this,"argument-error"),this.redirectPersistenceManager=await Qe.create(this,[Ie(i._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var i,r;return this._isInitialized&&await this.queue(async()=>{}),((i=this._currentUser)===null||i===void 0?void 0:i._redirectEventId)===e?this._currentUser:((r=this.redirectUser)===null||r===void 0?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,i;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const r=(i=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&i!==void 0?i:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,i,r,o){if(this._deleted)return()=>{};const c=typeof i=="function"?i:i.next.bind(i);let h=!1;const p=this._isInitialized?Promise.resolve():this._initializationPromise;if(b(p,this,"internal-error"),p.then(()=>{h||c(this.currentUser)}),typeof i=="function"){const y=e.addObserver(i,r,o);return()=>{h=!0,y()}}else{const y=e.addObserver(i);return()=>{h=!0,y()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return b(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=eo(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const i={"X-Client-Version":this.clientVersion};this.app.options.appId&&(i["X-Firebase-gmpid"]=this.app.options.appId);const r=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());r&&(i["X-Firebase-Client"]=r);const o=await this._getAppCheckToken();return o&&(i["X-Firebase-AppCheck"]=o),i}async _getAppCheckToken(){var e;const i=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return i!=null&&i.error&&al(`Error while retrieving App Check token: ${i.error}`),i==null?void 0:i.token}}function fn(n){return ue(n)}class Jr{constructor(e){this.auth=e,this.observer=null,this.addObserver=Wa(i=>this.observer=i)}get next(){return b(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ti={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function Ol(n){Ti=n}function Dl(n){return Ti.loadJS(n)}function Nl(){return Ti.gapiScript}function Ll(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ml(n,e){const i=We(n,"auth");if(i.isInitialized()){const o=i.getImmediate(),c=i.getOptions();if(St(c,e??{}))return o;he(o,"already-initialized")}return i.initialize({options:e})}function Ul(n,e){const i=(e==null?void 0:e.persistence)||[],r=(Array.isArray(i)?i:[i]).map(Ie);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function xl(n,e,i){const r=fn(n);b(r._canInitEmulator,r,"emulator-config-failed"),b(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const o=!!(i!=null&&i.disableWarnings),c=to(e),{host:h,port:p}=Fl(e),y=p===null?"":`:${p}`;r.config.emulator={url:`${c}//${h}${y}/`},r.settings.appVerificationDisabledForTesting=!0,r.emulatorConfig=Object.freeze({host:h,port:p,protocol:c.replace(":",""),options:Object.freeze({disableWarnings:o})}),o||jl()}function to(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function Fl(n){const e=to(n),i=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!i)return{host:"",port:null};const r=i[2].split("@").pop()||"",o=/^(\[[^\]]+\])(:|$)/.exec(r);if(o){const c=o[1];return{host:c,port:Xr(r.substr(c.length+1))}}else{const[c,h]=r.split(":");return{host:c,port:Xr(h)}}}function Xr(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function jl(){function n(){const e=document.createElement("p"),i=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",i.position="fixed",i.width="100%",i.backgroundColor="#ffffff",i.border=".1em solid #000000",i.color="#b50000",i.bottom="0px",i.left="0px",i.margin="0px",i.zIndex="10000",i.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class no{constructor(e,i){this.providerId=e,this.signInMethod=i}toJSON(){return ve("not implemented")}_getIdTokenResponse(e){return ve("not implemented")}_linkToIdToken(e,i){return ve("not implemented")}_getReauthenticationResolver(e){return ve("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ze(n,e){return pl(n,"POST","/v1/accounts:signInWithIdp",_i(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bl="http://localhost";class $e extends no{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const i=new $e(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(i.idToken=e.idToken),e.accessToken&&(i.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(i.nonce=e.nonce),e.pendingToken&&(i.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(i.accessToken=e.oauthToken,i.secret=e.oauthTokenSecret):he("argument-error"),i}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const i=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:o}=i,c=gi(i,["providerId","signInMethod"]);if(!r||!o)return null;const h=new $e(r,o);return h.idToken=c.idToken||void 0,h.accessToken=c.accessToken||void 0,h.secret=c.secret,h.nonce=c.nonce,h.pendingToken=c.pendingToken||null,h}_getIdTokenResponse(e){const i=this.buildRequest();return Ze(e,i)}_linkToIdToken(e,i){const r=this.buildRequest();return r.idToken=i,Ze(e,r)}_getReauthenticationResolver(e){const i=this.buildRequest();return i.autoCreate=!1,Ze(e,i)}buildRequest(){const e={requestUri:Bl,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const i={};this.idToken&&(i.id_token=this.idToken),this.accessToken&&(i.access_token=this.accessToken),this.secret&&(i.oauth_token_secret=this.secret),i.providerId=this.providerId,this.nonce&&!this.pendingToken&&(i.nonce=this.nonce),e.postBody=Ct(i)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ei{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot extends Ei{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke extends Ot{constructor(){super("facebook.com")}static credential(e){return $e._fromParams({providerId:ke.PROVIDER_ID,signInMethod:ke.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ke.credentialFromTaggedObject(e)}static credentialFromError(e){return ke.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ke.credential(e.oauthAccessToken)}catch{return null}}}ke.FACEBOOK_SIGN_IN_METHOD="facebook.com";ke.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me extends Ot{constructor(){super("google.com"),this.addScope("profile")}static credential(e,i){return $e._fromParams({providerId:me.PROVIDER_ID,signInMethod:me.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:i})}static credentialFromResult(e){return me.credentialFromTaggedObject(e)}static credentialFromError(e){return me.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:i,oauthAccessToken:r}=e;if(!i&&!r)return null;try{return me.credential(i,r)}catch{return null}}}me.GOOGLE_SIGN_IN_METHOD="google.com";me.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce extends Ot{constructor(){super("github.com")}static credential(e){return $e._fromParams({providerId:Ce.PROVIDER_ID,signInMethod:Ce.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Ce.credentialFromTaggedObject(e)}static credentialFromError(e){return Ce.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Ce.credential(e.oauthAccessToken)}catch{return null}}}Ce.GITHUB_SIGN_IN_METHOD="github.com";Ce.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe extends Ot{constructor(){super("twitter.com")}static credential(e,i){return $e._fromParams({providerId:Pe.PROVIDER_ID,signInMethod:Pe.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:i})}static credentialFromResult(e){return Pe.credentialFromTaggedObject(e)}static credentialFromError(e){return Pe.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:i,oauthTokenSecret:r}=e;if(!i||!r)return null;try{return Pe.credential(i,r)}catch{return null}}}Pe.TWITTER_SIGN_IN_METHOD="twitter.com";Pe.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,i,r,o=!1){const c=await _e._fromIdTokenResponse(e,r,o),h=Yr(r);return new et({user:c,providerId:h,_tokenResponse:r,operationType:i})}static async _forOperation(e,i,r){await e._updateTokensIfNecessary(r,!0);const o=Yr(r);return new et({user:e,providerId:o,_tokenResponse:r,operationType:i})}}function Yr(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on extends ae{constructor(e,i,r,o){var c;super(i.code,i.message),this.operationType=r,this.user=o,Object.setPrototypeOf(this,on.prototype),this.customData={appName:e.name,tenantId:(c=e.tenantId)!==null&&c!==void 0?c:void 0,_serverResponse:i.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,i,r,o){return new on(e,i,r,o)}}function io(n,e,i,r){return(e==="reauthenticate"?i._getReauthenticationResolver(n):i._getIdTokenResponse(n)).catch(c=>{throw c.code==="auth/multi-factor-auth-required"?on._fromErrorAndOperation(n,c,e,r):c})}async function $l(n,e,i=!1){const r=await kt(n,e._linkToIdToken(n.auth,await n.getIdToken()),i);return et._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vl(n,e,i=!1){const{auth:r}=n;if(ye(r.app))return Promise.reject(Be(r));const o="reauthenticate";try{const c=await kt(n,io(r,o,e,n),i);b(c.idToken,r,"internal-error");const h=Ii(c.idToken);b(h,r,"internal-error");const{sub:p}=h;return b(n.uid===p,r,"user-mismatch"),et._forOperation(n,o,c)}catch(c){throw(c==null?void 0:c.code)==="auth/user-not-found"&&he(r,"user-mismatch"),c}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Hl(n,e,i=!1){if(ye(n.app))return Promise.reject(Be(n));const r="signIn",o=await io(n,r,e),c=await et._fromIdTokenResponse(n,r,o);return i||await n._updateCurrentUser(c.user),c}function zl(n,e,i,r){return ue(n).onIdTokenChanged(e,i,r)}function Wl(n,e,i){return ue(n).beforeAuthStateChanged(e,i)}function Gl(n,e,i,r){return ue(n).onAuthStateChanged(e,i,r)}function ql(n){return ue(n).signOut()}const an="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ro{constructor(e,i){this.storageRetriever=e,this.type=i}_isAvailable(){try{return this.storage?(this.storage.setItem(an,"1"),this.storage.removeItem(an),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,i){return this.storage.setItem(e,JSON.stringify(i)),Promise.resolve()}_get(e){const i=this.storage.getItem(e);return Promise.resolve(i?JSON.parse(i):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kl=1e3,Jl=10;class so extends ro{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,i)=>this.onStorageEvent(e,i),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Zs(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const i of Object.keys(this.listeners)){const r=this.storage.getItem(i),o=this.localCache[i];r!==o&&e(i,o,r)}}onStorageEvent(e,i=!1){if(!e.key){this.forAllChangedKeys((h,p,y)=>{this.notifyListeners(h,y)});return}const r=e.key;i?this.detachListener():this.stopPolling();const o=()=>{const h=this.storage.getItem(r);!i&&this.localCache[r]===h||this.notifyListeners(r,h)},c=this.storage.getItem(r);bl()&&c!==e.newValue&&e.newValue!==e.oldValue?setTimeout(o,Jl):o()}notifyListeners(e,i){this.localCache[e]=i;const r=this.listeners[e];if(r)for(const o of Array.from(r))o(i&&JSON.parse(i))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,i,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:i,newValue:r}),!0)})},Kl)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,i){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(i)}_removeListener(e,i){this.listeners[e]&&(this.listeners[e].delete(i),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,i){await super._set(e,i),this.localCache[e]=JSON.stringify(i)}async _get(e){const i=await super._get(e);return this.localCache[e]=JSON.stringify(i),i}async _remove(e){await super._remove(e),delete this.localCache[e]}}so.type="LOCAL";const Xl=so;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo extends ro{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,i){}_removeListener(e,i){}}oo.type="SESSION";const ao=oo;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yl(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(i){return{fulfilled:!1,reason:i}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const i=this.receivers.find(o=>o.isListeningto(e));if(i)return i;const r=new pn(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const i=e,{eventId:r,eventType:o,data:c}=i.data,h=this.handlersMap[o];if(!(h!=null&&h.size))return;i.ports[0].postMessage({status:"ack",eventId:r,eventType:o});const p=Array.from(h).map(async T=>T(i.origin,c)),y=await Yl(p);i.ports[0].postMessage({status:"done",eventId:r,eventType:o,response:y})}_subscribe(e,i){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(i)}_unsubscribe(e,i){this.handlersMap[e]&&i&&this.handlersMap[e].delete(i),(!i||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}pn.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ai(n="",e=10){let i="";for(let r=0;r<e;r++)i+=Math.floor(Math.random()*10);return n+i}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ql{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,i,r=50){const o=typeof MessageChannel<"u"?new MessageChannel:null;if(!o)throw new Error("connection_unavailable");let c,h;return new Promise((p,y)=>{const T=Ai("",20);o.port1.start();const A=setTimeout(()=>{y(new Error("unsupported_event"))},r);h={messageChannel:o,onMessage(S){const R=S;if(R.data.eventId===T)switch(R.data.status){case"ack":clearTimeout(A),c=setTimeout(()=>{y(new Error("timeout"))},3e3);break;case"done":clearTimeout(c),p(R.data.response);break;default:clearTimeout(A),clearTimeout(c),y(new Error("invalid_response"));break}}},this.handlers.add(h),o.port1.addEventListener("message",h.onMessage),this.target.postMessage({eventType:e,eventId:T,data:i},[o.port2])}).finally(()=>{h&&this.removeMessageHandler(h)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ce(){return window}function Zl(n){ce().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function co(){return typeof ce().WorkerGlobalScope<"u"&&typeof ce().importScripts=="function"}async function eh(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function th(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)===null||n===void 0?void 0:n.controller)||null}function nh(){return co()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lo="firebaseLocalStorageDb",ih=1,cn="firebaseLocalStorage",ho="fbase_key";class Dt{constructor(e){this.request=e}toPromise(){return new Promise((e,i)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{i(this.request.error)})})}}function gn(n,e){return n.transaction([cn],e?"readwrite":"readonly").objectStore(cn)}function rh(){const n=indexedDB.deleteDatabase(lo);return new Dt(n).toPromise()}function hi(){const n=indexedDB.open(lo,ih);return new Promise((e,i)=>{n.addEventListener("error",()=>{i(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(cn,{keyPath:ho})}catch(o){i(o)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(cn)?e(r):(r.close(),await rh(),e(await hi()))})})}async function Qr(n,e,i){const r=gn(n,!0).put({[ho]:e,value:i});return new Dt(r).toPromise()}async function sh(n,e){const i=gn(n,!1).get(e),r=await new Dt(i).toPromise();return r===void 0?null:r.value}function Zr(n,e){const i=gn(n,!0).delete(e);return new Dt(i).toPromise()}const oh=800,ah=3;class uo{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await hi(),this.db)}async _withRetries(e){let i=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(i++>ah)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return co()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=pn._getInstance(nh()),this.receiver._subscribe("keyChanged",async(e,i)=>({keyProcessed:(await this._poll()).includes(i.key)})),this.receiver._subscribe("ping",async(e,i)=>["keyChanged"])}async initializeSender(){var e,i;if(this.activeServiceWorker=await eh(),!this.activeServiceWorker)return;this.sender=new Ql(this.activeServiceWorker);const r=await this.sender._send("ping",{},800);r&&!((e=r[0])===null||e===void 0)&&e.fulfilled&&!((i=r[0])===null||i===void 0)&&i.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||th()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await hi();return await Qr(e,an,"1"),await Zr(e,an),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,i){return this._withPendingWrite(async()=>(await this._withRetries(r=>Qr(r,e,i)),this.localCache[e]=i,this.notifyServiceWorker(e)))}async _get(e){const i=await this._withRetries(r=>sh(r,e));return this.localCache[e]=i,i}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(i=>Zr(i,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(o=>{const c=gn(o,!1).getAll();return new Dt(c).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const i=[],r=new Set;if(e.length!==0)for(const{fbase_key:o,value:c}of e)r.add(o),JSON.stringify(this.localCache[o])!==JSON.stringify(c)&&(this.notifyListeners(o,c),i.push(o));for(const o of Object.keys(this.localCache))this.localCache[o]&&!r.has(o)&&(this.notifyListeners(o,null),i.push(o));return i}notifyListeners(e,i){this.localCache[e]=i;const r=this.listeners[e];if(r)for(const o of Array.from(r))o(i)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),oh)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,i){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(i)}_removeListener(e,i){this.listeners[e]&&(this.listeners[e].delete(i),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}uo.type="LOCAL";const ch=uo;new Pt(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fo(n,e){return e?Ie(e):(b(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bi extends no{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return Ze(e,this._buildIdpRequest())}_linkToIdToken(e,i){return Ze(e,this._buildIdpRequest(i))}_getReauthenticationResolver(e){return Ze(e,this._buildIdpRequest())}_buildIdpRequest(e){const i={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(i.idToken=e),i}}function lh(n){return Hl(n.auth,new bi(n),n.bypassAuthState)}function hh(n){const{auth:e,user:i}=n;return b(i,e,"internal-error"),Vl(i,new bi(n),n.bypassAuthState)}async function uh(n){const{auth:e,user:i}=n;return b(i,e,"internal-error"),$l(i,new bi(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class po{constructor(e,i,r,o,c=!1){this.auth=e,this.resolver=r,this.user=o,this.bypassAuthState=c,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(i)?i:[i]}execute(){return new Promise(async(e,i)=>{this.pendingPromise={resolve:e,reject:i};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:i,sessionId:r,postBody:o,tenantId:c,error:h,type:p}=e;if(h){this.reject(h);return}const y={auth:this.auth,requestUri:i,sessionId:r,tenantId:c||void 0,postBody:o||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(p)(y))}catch(T){this.reject(T)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return lh;case"linkViaPopup":case"linkViaRedirect":return uh;case"reauthViaPopup":case"reauthViaRedirect":return hh;default:he(this.auth,"internal-error")}}resolve(e){Te(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){Te(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dh=new Pt(2e3,1e4);async function fh(n,e,i){if(ye(n.app))return Promise.reject(se(n,"operation-not-supported-in-this-environment"));const r=fn(n);cl(n,e,Ei);const o=fo(r,i);return new Fe(r,"signInViaPopup",e,o).executeNotNull()}class Fe extends po{constructor(e,i,r,o,c){super(e,i,o,c),this.provider=r,this.authWindow=null,this.pollId=null,Fe.currentPopupAction&&Fe.currentPopupAction.cancel(),Fe.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return b(e,this.auth,"internal-error"),e}async onExecution(){Te(this.filter.length===1,"Popup operations only handle one event");const e=Ai();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(i=>{this.reject(i)}),this.resolver._isIframeWebStorageSupported(this.auth,i=>{i||this.reject(se(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject(se(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Fe.currentPopupAction=null}pollUserCancellation(){const e=()=>{var i,r;if(!((r=(i=this.authWindow)===null||i===void 0?void 0:i.window)===null||r===void 0)&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(se(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,dh.get())};e()}}Fe.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ph="pendingRedirect",Zt=new Map;class gh extends po{constructor(e,i,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],i,void 0,r),this.eventId=null}async execute(){let e=Zt.get(this.auth._key());if(!e){try{const r=await mh(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(i){e=()=>Promise.reject(i)}Zt.set(this.auth._key(),e)}return this.bypassAuthState||Zt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const i=await this.auth._redirectUserForId(e.eventId);if(i)return this.user=i,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function mh(n,e){const i=_h(e),r=vh(n);if(!await r._isAvailable())return!1;const o=await r._get(i)==="true";return await r._remove(i),o}function yh(n,e){Zt.set(n._key(),e)}function vh(n){return Ie(n._redirectPersistence)}function _h(n){return Qt(ph,n.config.apiKey,n.name)}async function Ih(n,e,i=!1){if(ye(n.app))return Promise.reject(Be(n));const r=fn(n),o=fo(r,e),h=await new gh(r,o,i).execute();return h&&!i&&(delete h.user._redirectEventId,await r._persistUserIfCurrent(h.user),await r._setRedirectUser(null,e)),h}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wh=10*60*1e3;class Th{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let i=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(i=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Eh(e)||(this.hasHandledPotentialRedirect=!0,i||(this.queuedRedirectEvent=e,i=!0)),i}sendToConsumer(e,i){var r;if(e.error&&!go(e)){const o=((r=e.error.code)===null||r===void 0?void 0:r.split("auth/")[1])||"internal-error";i.onError(se(this.auth,o))}else i.onAuthEvent(e)}isEventForConsumer(e,i){const r=i.eventId===null||!!e.eventId&&e.eventId===i.eventId;return i.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=wh&&this.cachedEventUids.clear(),this.cachedEventUids.has(es(e))}saveEventToCache(e){this.cachedEventUids.add(es(e)),this.lastProcessedEventTime=Date.now()}}function es(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function go({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function Eh(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return go(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ah(n,e={}){return it(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bh=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Sh=/^https?/;async function Rh(n){if(n.config.emulator)return;const{authorizedDomains:e}=await Ah(n);for(const i of e)try{if(kh(i))return}catch{}he(n,"unauthorized-domain")}function kh(n){const e=ci(),{protocol:i,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const h=new URL(n);return h.hostname===""&&r===""?i==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):i==="chrome-extension:"&&h.hostname===r}if(!Sh.test(i))return!1;if(bh.test(n))return r===n;const o=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+o+"|"+o+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ch=new Pt(3e4,6e4);function ts(){const n=ce().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let i=0;i<n.CP.length;i++)n.CP[i]=null}}function Ph(n){return new Promise((e,i)=>{var r,o,c;function h(){ts(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ts(),i(se(n,"network-request-failed"))},timeout:Ch.get()})}if(!((o=(r=ce().gapi)===null||r===void 0?void 0:r.iframes)===null||o===void 0)&&o.Iframe)e(gapi.iframes.getContext());else if(!((c=ce().gapi)===null||c===void 0)&&c.load)h();else{const p=Ll("iframefcb");return ce()[p]=()=>{gapi.load?h():i(se(n,"network-request-failed"))},Dl(`${Nl()}?onload=${p}`).catch(y=>i(y))}}).catch(e=>{throw en=null,e})}let en=null;function Oh(n){return en=en||Ph(n),en}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dh=new Pt(5e3,15e3),Nh="__/auth/iframe",Lh="emulator/auth/iframe",Mh={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Uh=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function xh(n){const e=n.config;b(e.authDomain,n,"auth-domain-config-required");const i=e.emulator?vi(e,Lh):`https://${n.config.authDomain}/${Nh}`,r={apiKey:e.apiKey,appName:n.name,v:nt},o=Uh.get(n.config.apiHost);o&&(r.eid=o);const c=n._getFrameworks();return c.length&&(r.fw=c.join(",")),`${i}?${Ct(r).slice(1)}`}async function Fh(n){const e=await Oh(n),i=ce().gapi;return b(i,n,"internal-error"),e.open({where:document.body,url:xh(n),messageHandlersFilter:i.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Mh,dontclear:!0},r=>new Promise(async(o,c)=>{await r.restyle({setHideOnLeave:!1});const h=se(n,"network-request-failed"),p=ce().setTimeout(()=>{c(h)},Dh.get());function y(){ce().clearTimeout(p),o(r)}r.ping(y).then(y,()=>{c(h)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jh={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Bh=500,$h=600,Vh="_blank",Hh="http://localhost";class ns{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function zh(n,e,i,r=Bh,o=$h){const c=Math.max((window.screen.availHeight-o)/2,0).toString(),h=Math.max((window.screen.availWidth-r)/2,0).toString();let p="";const y=Object.assign(Object.assign({},jh),{width:r.toString(),height:o.toString(),top:c,left:h}),T=q().toLowerCase();i&&(p=Ks(T)?Vh:i),Gs(T)&&(e=e||Hh,y.scrollbars="yes");const A=Object.entries(y).reduce((R,[N,C])=>`${R}${N}=${C},`,"");if(Al(T)&&p!=="_self")return Wh(e||"",p),new ns(null);const S=window.open(e||"",p,A);b(S,n,"popup-blocked");try{S.focus()}catch{}return new ns(S)}function Wh(n,e){const i=document.createElement("a");i.href=n,i.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),i.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gh="__/auth/handler",qh="emulator/auth/handler",Kh=encodeURIComponent("fac");async function is(n,e,i,r,o,c){b(n.config.authDomain,n,"auth-domain-config-required"),b(n.config.apiKey,n,"invalid-api-key");const h={apiKey:n.config.apiKey,appName:n.name,authType:i,redirectUrl:r,v:nt,eventId:o};if(e instanceof Ei){e.setDefaultLanguage(n.languageCode),h.providerId=e.providerId||"",za(e.getCustomParameters())||(h.customParameters=JSON.stringify(e.getCustomParameters()));for(const[A,S]of Object.entries(c||{}))h[A]=S}if(e instanceof Ot){const A=e.getScopes().filter(S=>S!=="");A.length>0&&(h.scopes=A.join(","))}n.tenantId&&(h.tid=n.tenantId);const p=h;for(const A of Object.keys(p))p[A]===void 0&&delete p[A];const y=await n._getAppCheckToken(),T=y?`#${Kh}=${encodeURIComponent(y)}`:"";return`${Jh(n)}?${Ct(p).slice(1)}${T}`}function Jh({config:n}){return n.emulator?vi(n,qh):`https://${n.authDomain}/${Gh}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yn="webStorageSupport";class Xh{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ao,this._completeRedirectFn=Ih,this._overrideRedirectResult=yh}async _openPopup(e,i,r,o){var c;Te((c=this.eventManagers[e._key()])===null||c===void 0?void 0:c.manager,"_initialize() not called before _openPopup()");const h=await is(e,i,r,ci(),o);return zh(e,h,Ai())}async _openRedirect(e,i,r,o){await this._originValidation(e);const c=await is(e,i,r,ci(),o);return Zl(c),new Promise(()=>{})}_initialize(e){const i=e._key();if(this.eventManagers[i]){const{manager:o,promise:c}=this.eventManagers[i];return o?Promise.resolve(o):(Te(c,"If manager is not set, promise should be"),c)}const r=this.initAndGetManager(e);return this.eventManagers[i]={promise:r},r.catch(()=>{delete this.eventManagers[i]}),r}async initAndGetManager(e){const i=await Fh(e),r=new Th(e);return i.register("authEvent",o=>(b(o==null?void 0:o.authEvent,e,"invalid-auth-event"),{status:r.onEvent(o.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=i,r}_isIframeWebStorageSupported(e,i){this.iframes[e._key()].send(Yn,{type:Yn},o=>{var c;const h=(c=o==null?void 0:o[0])===null||c===void 0?void 0:c[Yn];h!==void 0&&i(!!h),he(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const i=e._key();return this.originValidationPromises[i]||(this.originValidationPromises[i]=Rh(e)),this.originValidationPromises[i]}get _shouldInitProactively(){return Zs()||qs()||wi()}}const Yh=Xh;var rs="@firebase/auth",ss="1.7.9";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qh{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const i=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,i),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const i=this.internalListeners.get(e);i&&(this.internalListeners.delete(e),i(),this.updateProactiveRefresh())}assertAuthConfigured(){b(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zh(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function eu(n){le(new oe("auth",(e,{options:i})=>{const r=e.getProvider("app").getImmediate(),o=e.getProvider("heartbeat"),c=e.getProvider("app-check-internal"),{apiKey:h,authDomain:p}=r.options;b(h&&!h.includes(":"),"invalid-api-key",{appName:r.name});const y={apiKey:h,authDomain:p,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:eo(n)},T=new Pl(r,o,c,y);return Ul(T,i),T},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,i,r)=>{e.getProvider("auth-internal").initialize()})),le(new oe("auth-internal",e=>{const i=fn(e.getProvider("auth").getImmediate());return(r=>new Qh(r))(i)},"PRIVATE").setInstantiationMode("EXPLICIT")),te(rs,ss,Zh(n)),te(rs,ss,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tu=5*60,nu=ks("authIdTokenMaxAge")||tu;let os=null;const iu=n=>async e=>{const i=e&&await e.getIdTokenResult(),r=i&&(new Date().getTime()-Date.parse(i.issuedAtTime))/1e3;if(r&&r>nu)return;const o=i==null?void 0:i.token;os!==o&&(os=o,await fetch(n,{method:o?"POST":"DELETE",headers:o?{Authorization:`Bearer ${o}`}:{}}))};function ru(n=pi()){const e=We(n,"auth");if(e.isInitialized())return e.getImmediate();const i=Ml(n,{popupRedirectResolver:Yh,persistence:[ch,Xl,ao]}),r=ks("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const c=new URL(r,location.origin);if(location.origin===c.origin){const h=iu(c.toString());Wl(i,h,()=>h(i.currentUser)),zl(i,p=>h(p))}}const o=Ss("auth");return o&&xl(i,`http://${o}`),i}function su(){var n,e;return(e=(n=document.getElementsByTagName("head"))===null||n===void 0?void 0:n[0])!==null&&e!==void 0?e:document}Ol({loadJS(n){return new Promise((e,i)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=o=>{const c=se("internal-error");c.customData=o,i(c)},r.type="text/javascript",r.charset="UTF-8",su().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});eu("Browser");var as=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var mo;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(_,u){function f(){}f.prototype=u.prototype,_.D=u.prototype,_.prototype=new f,_.prototype.constructor=_,_.C=function(g,m,I){for(var d=Array(arguments.length-2),fe=2;fe<arguments.length;fe++)d[fe-2]=arguments[fe];return u.prototype[m].apply(g,d)}}function i(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(r,i),r.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function o(_,u,f){f||(f=0);var g=Array(16);if(typeof u=="string")for(var m=0;16>m;++m)g[m]=u.charCodeAt(f++)|u.charCodeAt(f++)<<8|u.charCodeAt(f++)<<16|u.charCodeAt(f++)<<24;else for(m=0;16>m;++m)g[m]=u[f++]|u[f++]<<8|u[f++]<<16|u[f++]<<24;u=_.g[0],f=_.g[1],m=_.g[2];var I=_.g[3],d=u+(I^f&(m^I))+g[0]+3614090360&4294967295;u=f+(d<<7&4294967295|d>>>25),d=I+(m^u&(f^m))+g[1]+3905402710&4294967295,I=u+(d<<12&4294967295|d>>>20),d=m+(f^I&(u^f))+g[2]+606105819&4294967295,m=I+(d<<17&4294967295|d>>>15),d=f+(u^m&(I^u))+g[3]+3250441966&4294967295,f=m+(d<<22&4294967295|d>>>10),d=u+(I^f&(m^I))+g[4]+4118548399&4294967295,u=f+(d<<7&4294967295|d>>>25),d=I+(m^u&(f^m))+g[5]+1200080426&4294967295,I=u+(d<<12&4294967295|d>>>20),d=m+(f^I&(u^f))+g[6]+2821735955&4294967295,m=I+(d<<17&4294967295|d>>>15),d=f+(u^m&(I^u))+g[7]+4249261313&4294967295,f=m+(d<<22&4294967295|d>>>10),d=u+(I^f&(m^I))+g[8]+1770035416&4294967295,u=f+(d<<7&4294967295|d>>>25),d=I+(m^u&(f^m))+g[9]+2336552879&4294967295,I=u+(d<<12&4294967295|d>>>20),d=m+(f^I&(u^f))+g[10]+4294925233&4294967295,m=I+(d<<17&4294967295|d>>>15),d=f+(u^m&(I^u))+g[11]+2304563134&4294967295,f=m+(d<<22&4294967295|d>>>10),d=u+(I^f&(m^I))+g[12]+1804603682&4294967295,u=f+(d<<7&4294967295|d>>>25),d=I+(m^u&(f^m))+g[13]+4254626195&4294967295,I=u+(d<<12&4294967295|d>>>20),d=m+(f^I&(u^f))+g[14]+2792965006&4294967295,m=I+(d<<17&4294967295|d>>>15),d=f+(u^m&(I^u))+g[15]+1236535329&4294967295,f=m+(d<<22&4294967295|d>>>10),d=u+(m^I&(f^m))+g[1]+4129170786&4294967295,u=f+(d<<5&4294967295|d>>>27),d=I+(f^m&(u^f))+g[6]+3225465664&4294967295,I=u+(d<<9&4294967295|d>>>23),d=m+(u^f&(I^u))+g[11]+643717713&4294967295,m=I+(d<<14&4294967295|d>>>18),d=f+(I^u&(m^I))+g[0]+3921069994&4294967295,f=m+(d<<20&4294967295|d>>>12),d=u+(m^I&(f^m))+g[5]+3593408605&4294967295,u=f+(d<<5&4294967295|d>>>27),d=I+(f^m&(u^f))+g[10]+38016083&4294967295,I=u+(d<<9&4294967295|d>>>23),d=m+(u^f&(I^u))+g[15]+3634488961&4294967295,m=I+(d<<14&4294967295|d>>>18),d=f+(I^u&(m^I))+g[4]+3889429448&4294967295,f=m+(d<<20&4294967295|d>>>12),d=u+(m^I&(f^m))+g[9]+568446438&4294967295,u=f+(d<<5&4294967295|d>>>27),d=I+(f^m&(u^f))+g[14]+3275163606&4294967295,I=u+(d<<9&4294967295|d>>>23),d=m+(u^f&(I^u))+g[3]+4107603335&4294967295,m=I+(d<<14&4294967295|d>>>18),d=f+(I^u&(m^I))+g[8]+1163531501&4294967295,f=m+(d<<20&4294967295|d>>>12),d=u+(m^I&(f^m))+g[13]+2850285829&4294967295,u=f+(d<<5&4294967295|d>>>27),d=I+(f^m&(u^f))+g[2]+4243563512&4294967295,I=u+(d<<9&4294967295|d>>>23),d=m+(u^f&(I^u))+g[7]+1735328473&4294967295,m=I+(d<<14&4294967295|d>>>18),d=f+(I^u&(m^I))+g[12]+2368359562&4294967295,f=m+(d<<20&4294967295|d>>>12),d=u+(f^m^I)+g[5]+4294588738&4294967295,u=f+(d<<4&4294967295|d>>>28),d=I+(u^f^m)+g[8]+2272392833&4294967295,I=u+(d<<11&4294967295|d>>>21),d=m+(I^u^f)+g[11]+1839030562&4294967295,m=I+(d<<16&4294967295|d>>>16),d=f+(m^I^u)+g[14]+4259657740&4294967295,f=m+(d<<23&4294967295|d>>>9),d=u+(f^m^I)+g[1]+2763975236&4294967295,u=f+(d<<4&4294967295|d>>>28),d=I+(u^f^m)+g[4]+1272893353&4294967295,I=u+(d<<11&4294967295|d>>>21),d=m+(I^u^f)+g[7]+4139469664&4294967295,m=I+(d<<16&4294967295|d>>>16),d=f+(m^I^u)+g[10]+3200236656&4294967295,f=m+(d<<23&4294967295|d>>>9),d=u+(f^m^I)+g[13]+681279174&4294967295,u=f+(d<<4&4294967295|d>>>28),d=I+(u^f^m)+g[0]+3936430074&4294967295,I=u+(d<<11&4294967295|d>>>21),d=m+(I^u^f)+g[3]+3572445317&4294967295,m=I+(d<<16&4294967295|d>>>16),d=f+(m^I^u)+g[6]+76029189&4294967295,f=m+(d<<23&4294967295|d>>>9),d=u+(f^m^I)+g[9]+3654602809&4294967295,u=f+(d<<4&4294967295|d>>>28),d=I+(u^f^m)+g[12]+3873151461&4294967295,I=u+(d<<11&4294967295|d>>>21),d=m+(I^u^f)+g[15]+530742520&4294967295,m=I+(d<<16&4294967295|d>>>16),d=f+(m^I^u)+g[2]+3299628645&4294967295,f=m+(d<<23&4294967295|d>>>9),d=u+(m^(f|~I))+g[0]+4096336452&4294967295,u=f+(d<<6&4294967295|d>>>26),d=I+(f^(u|~m))+g[7]+1126891415&4294967295,I=u+(d<<10&4294967295|d>>>22),d=m+(u^(I|~f))+g[14]+2878612391&4294967295,m=I+(d<<15&4294967295|d>>>17),d=f+(I^(m|~u))+g[5]+4237533241&4294967295,f=m+(d<<21&4294967295|d>>>11),d=u+(m^(f|~I))+g[12]+1700485571&4294967295,u=f+(d<<6&4294967295|d>>>26),d=I+(f^(u|~m))+g[3]+2399980690&4294967295,I=u+(d<<10&4294967295|d>>>22),d=m+(u^(I|~f))+g[10]+4293915773&4294967295,m=I+(d<<15&4294967295|d>>>17),d=f+(I^(m|~u))+g[1]+2240044497&4294967295,f=m+(d<<21&4294967295|d>>>11),d=u+(m^(f|~I))+g[8]+1873313359&4294967295,u=f+(d<<6&4294967295|d>>>26),d=I+(f^(u|~m))+g[15]+4264355552&4294967295,I=u+(d<<10&4294967295|d>>>22),d=m+(u^(I|~f))+g[6]+2734768916&4294967295,m=I+(d<<15&4294967295|d>>>17),d=f+(I^(m|~u))+g[13]+1309151649&4294967295,f=m+(d<<21&4294967295|d>>>11),d=u+(m^(f|~I))+g[4]+4149444226&4294967295,u=f+(d<<6&4294967295|d>>>26),d=I+(f^(u|~m))+g[11]+3174756917&4294967295,I=u+(d<<10&4294967295|d>>>22),d=m+(u^(I|~f))+g[2]+718787259&4294967295,m=I+(d<<15&4294967295|d>>>17),d=f+(I^(m|~u))+g[9]+3951481745&4294967295,_.g[0]=_.g[0]+u&4294967295,_.g[1]=_.g[1]+(m+(d<<21&4294967295|d>>>11))&4294967295,_.g[2]=_.g[2]+m&4294967295,_.g[3]=_.g[3]+I&4294967295}r.prototype.u=function(_,u){u===void 0&&(u=_.length);for(var f=u-this.blockSize,g=this.B,m=this.h,I=0;I<u;){if(m==0)for(;I<=f;)o(this,_,I),I+=this.blockSize;if(typeof _=="string"){for(;I<u;)if(g[m++]=_.charCodeAt(I++),m==this.blockSize){o(this,g),m=0;break}}else for(;I<u;)if(g[m++]=_[I++],m==this.blockSize){o(this,g),m=0;break}}this.h=m,this.o+=u},r.prototype.v=function(){var _=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);_[0]=128;for(var u=1;u<_.length-8;++u)_[u]=0;var f=8*this.o;for(u=_.length-8;u<_.length;++u)_[u]=f&255,f/=256;for(this.u(_),_=Array(16),u=f=0;4>u;++u)for(var g=0;32>g;g+=8)_[f++]=this.g[u]>>>g&255;return _};function c(_,u){var f=p;return Object.prototype.hasOwnProperty.call(f,_)?f[_]:f[_]=u(_)}function h(_,u){this.h=u;for(var f=[],g=!0,m=_.length-1;0<=m;m--){var I=_[m]|0;g&&I==u||(f[m]=I,g=!1)}this.g=f}var p={};function y(_){return-128<=_&&128>_?c(_,function(u){return new h([u|0],0>u?-1:0)}):new h([_|0],0>_?-1:0)}function T(_){if(isNaN(_)||!isFinite(_))return S;if(0>_)return M(T(-_));for(var u=[],f=1,g=0;_>=f;g++)u[g]=_/f|0,f*=4294967296;return new h(u,0)}function A(_,u){if(_.length==0)throw Error("number format error: empty string");if(u=u||10,2>u||36<u)throw Error("radix out of range: "+u);if(_.charAt(0)=="-")return M(A(_.substring(1),u));if(0<=_.indexOf("-"))throw Error('number format error: interior "-" character');for(var f=T(Math.pow(u,8)),g=S,m=0;m<_.length;m+=8){var I=Math.min(8,_.length-m),d=parseInt(_.substring(m,m+I),u);8>I?(I=T(Math.pow(u,I)),g=g.j(I).add(T(d))):(g=g.j(f),g=g.add(T(d)))}return g}var S=y(0),R=y(1),N=y(16777216);n=h.prototype,n.m=function(){if(x(this))return-M(this).m();for(var _=0,u=1,f=0;f<this.g.length;f++){var g=this.i(f);_+=(0<=g?g:4294967296+g)*u,u*=4294967296}return _},n.toString=function(_){if(_=_||10,2>_||36<_)throw Error("radix out of range: "+_);if(C(this))return"0";if(x(this))return"-"+M(this).toString(_);for(var u=T(Math.pow(_,6)),f=this,g="";;){var m=ne(f,u).g;f=de(f,m.j(u));var I=((0<f.g.length?f.g[0]:f.h)>>>0).toString(_);if(f=m,C(f))return I+g;for(;6>I.length;)I="0"+I;g=I+g}},n.i=function(_){return 0>_?0:_<this.g.length?this.g[_]:this.h};function C(_){if(_.h!=0)return!1;for(var u=0;u<_.g.length;u++)if(_.g[u]!=0)return!1;return!0}function x(_){return _.h==-1}n.l=function(_){return _=de(this,_),x(_)?-1:C(_)?0:1};function M(_){for(var u=_.g.length,f=[],g=0;g<u;g++)f[g]=~_.g[g];return new h(f,~_.h).add(R)}n.abs=function(){return x(this)?M(this):this},n.add=function(_){for(var u=Math.max(this.g.length,_.g.length),f=[],g=0,m=0;m<=u;m++){var I=g+(this.i(m)&65535)+(_.i(m)&65535),d=(I>>>16)+(this.i(m)>>>16)+(_.i(m)>>>16);g=d>>>16,I&=65535,d&=65535,f[m]=d<<16|I}return new h(f,f[f.length-1]&-2147483648?-1:0)};function de(_,u){return _.add(M(u))}n.j=function(_){if(C(this)||C(_))return S;if(x(this))return x(_)?M(this).j(M(_)):M(M(this).j(_));if(x(_))return M(this.j(M(_)));if(0>this.l(N)&&0>_.l(N))return T(this.m()*_.m());for(var u=this.g.length+_.g.length,f=[],g=0;g<2*u;g++)f[g]=0;for(g=0;g<this.g.length;g++)for(var m=0;m<_.g.length;m++){var I=this.i(g)>>>16,d=this.i(g)&65535,fe=_.i(m)>>>16,rt=_.i(m)&65535;f[2*g+2*m]+=d*rt,Q(f,2*g+2*m),f[2*g+2*m+1]+=I*rt,Q(f,2*g+2*m+1),f[2*g+2*m+1]+=d*fe,Q(f,2*g+2*m+1),f[2*g+2*m+2]+=I*fe,Q(f,2*g+2*m+2)}for(g=0;g<u;g++)f[g]=f[2*g+1]<<16|f[2*g];for(g=u;g<2*u;g++)f[g]=0;return new h(f,0)};function Q(_,u){for(;(_[u]&65535)!=_[u];)_[u+1]+=_[u]>>>16,_[u]&=65535,u++}function j(_,u){this.g=_,this.h=u}function ne(_,u){if(C(u))throw Error("division by zero");if(C(_))return new j(S,S);if(x(_))return u=ne(M(_),u),new j(M(u.g),M(u.h));if(x(u))return u=ne(_,M(u)),new j(M(u.g),u.h);if(30<_.g.length){if(x(_)||x(u))throw Error("slowDivide_ only works with positive integers.");for(var f=R,g=u;0>=g.l(_);)f=Ne(f),g=Ne(g);var m=K(f,1),I=K(g,1);for(g=K(g,2),f=K(f,2);!C(g);){var d=I.add(g);0>=d.l(_)&&(m=m.add(f),I=d),g=K(g,1),f=K(f,1)}return u=de(_,m.j(u)),new j(m,u)}for(m=S;0<=_.l(u);){for(f=Math.max(1,Math.floor(_.m()/u.m())),g=Math.ceil(Math.log(f)/Math.LN2),g=48>=g?1:Math.pow(2,g-48),I=T(f),d=I.j(u);x(d)||0<d.l(_);)f-=g,I=T(f),d=I.j(u);C(I)&&(I=R),m=m.add(I),_=de(_,d)}return new j(m,_)}n.A=function(_){return ne(this,_).h},n.and=function(_){for(var u=Math.max(this.g.length,_.g.length),f=[],g=0;g<u;g++)f[g]=this.i(g)&_.i(g);return new h(f,this.h&_.h)},n.or=function(_){for(var u=Math.max(this.g.length,_.g.length),f=[],g=0;g<u;g++)f[g]=this.i(g)|_.i(g);return new h(f,this.h|_.h)},n.xor=function(_){for(var u=Math.max(this.g.length,_.g.length),f=[],g=0;g<u;g++)f[g]=this.i(g)^_.i(g);return new h(f,this.h^_.h)};function Ne(_){for(var u=_.g.length+1,f=[],g=0;g<u;g++)f[g]=_.i(g)<<1|_.i(g-1)>>>31;return new h(f,_.h)}function K(_,u){var f=u>>5;u%=32;for(var g=_.g.length-f,m=[],I=0;I<g;I++)m[I]=0<u?_.i(I+f)>>>u|_.i(I+f+1)<<32-u:_.i(I+f);return new h(m,_.h)}r.prototype.digest=r.prototype.v,r.prototype.reset=r.prototype.s,r.prototype.update=r.prototype.u,h.prototype.add=h.prototype.add,h.prototype.multiply=h.prototype.j,h.prototype.modulo=h.prototype.A,h.prototype.compare=h.prototype.l,h.prototype.toNumber=h.prototype.m,h.prototype.toString=h.prototype.toString,h.prototype.getBits=h.prototype.i,h.fromNumber=T,h.fromString=A,mo=h}).apply(typeof as<"u"?as:typeof self<"u"?self:typeof window<"u"?window:{});var Xt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};(function(){var n,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(t,s,a){return t==Array.prototype||t==Object.prototype||(t[s]=a.value),t};function i(t){t=[typeof globalThis=="object"&&globalThis,t,typeof window=="object"&&window,typeof self=="object"&&self,typeof Xt=="object"&&Xt];for(var s=0;s<t.length;++s){var a=t[s];if(a&&a.Math==Math)return a}throw Error("Cannot find global object")}var r=i(this);function o(t,s){if(s)e:{var a=r;t=t.split(".");for(var l=0;l<t.length-1;l++){var v=t[l];if(!(v in a))break e;a=a[v]}t=t[t.length-1],l=a[t],s=s(l),s!=l&&s!=null&&e(a,t,{configurable:!0,writable:!0,value:s})}}function c(t,s){t instanceof String&&(t+="");var a=0,l=!1,v={next:function(){if(!l&&a<t.length){var w=a++;return{value:s(w,t[w]),done:!1}}return l=!0,{done:!0,value:void 0}}};return v[Symbol.iterator]=function(){return v},v}o("Array.prototype.values",function(t){return t||function(){return c(this,function(s,a){return a})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var h=h||{},p=this||self;function y(t){var s=typeof t;return s=s!="object"?s:t?Array.isArray(t)?"array":s:"null",s=="array"||s=="object"&&typeof t.length=="number"}function T(t){var s=typeof t;return s=="object"&&t!=null||s=="function"}function A(t,s,a){return t.call.apply(t.bind,arguments)}function S(t,s,a){if(!t)throw Error();if(2<arguments.length){var l=Array.prototype.slice.call(arguments,2);return function(){var v=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(v,l),t.apply(s,v)}}return function(){return t.apply(s,arguments)}}function R(t,s,a){return R=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?A:S,R.apply(null,arguments)}function N(t,s){var a=Array.prototype.slice.call(arguments,1);return function(){var l=a.slice();return l.push.apply(l,arguments),t.apply(this,l)}}function C(t,s){function a(){}a.prototype=s.prototype,t.aa=s.prototype,t.prototype=new a,t.prototype.constructor=t,t.Qb=function(l,v,w){for(var E=Array(arguments.length-2),D=2;D<arguments.length;D++)E[D-2]=arguments[D];return s.prototype[v].apply(l,E)}}function x(t){const s=t.length;if(0<s){const a=Array(s);for(let l=0;l<s;l++)a[l]=t[l];return a}return[]}function M(t,s){for(let a=1;a<arguments.length;a++){const l=arguments[a];if(y(l)){const v=t.length||0,w=l.length||0;t.length=v+w;for(let E=0;E<w;E++)t[v+E]=l[E]}else t.push(l)}}class de{constructor(s,a){this.i=s,this.j=a,this.h=0,this.g=null}get(){let s;return 0<this.h?(this.h--,s=this.g,this.g=s.next,s.next=null):s=this.i(),s}}function Q(t){return/^[\s\xa0]*$/.test(t)}function j(){var t=p.navigator;return t&&(t=t.userAgent)?t:""}function ne(t){return ne[" "](t),t}ne[" "]=function(){};var Ne=j().indexOf("Gecko")!=-1&&!(j().toLowerCase().indexOf("webkit")!=-1&&j().indexOf("Edge")==-1)&&!(j().indexOf("Trident")!=-1||j().indexOf("MSIE")!=-1)&&j().indexOf("Edge")==-1;function K(t,s,a){for(const l in t)s.call(a,t[l],l,t)}function _(t,s){for(const a in t)s.call(void 0,t[a],a,t)}function u(t){const s={};for(const a in t)s[a]=t[a];return s}const f="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function g(t,s){let a,l;for(let v=1;v<arguments.length;v++){l=arguments[v];for(a in l)t[a]=l[a];for(let w=0;w<f.length;w++)a=f[w],Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a])}}function m(t){var s=1;t=t.split(":");const a=[];for(;0<s&&t.length;)a.push(t.shift()),s--;return t.length&&a.push(t.join(":")),a}function I(t){p.setTimeout(()=>{throw t},0)}function d(){var t=vn;let s=null;return t.g&&(s=t.g,t.g=t.g.next,t.g||(t.h=null),s.next=null),s}class fe{constructor(){this.h=this.g=null}add(s,a){const l=rt.get();l.set(s,a),this.h?this.h.next=l:this.g=l,this.h=l}}var rt=new de(()=>new Vo,t=>t.reset());class Vo{constructor(){this.next=this.g=this.h=null}set(s,a){this.h=s,this.g=a,this.next=null}reset(){this.next=this.g=this.h=null}}let st,ot=!1,vn=new fe,Mi=()=>{const t=p.Promise.resolve(void 0);st=()=>{t.then(Ho)}};var Ho=()=>{for(var t;t=d();){try{t.h.call(t.g)}catch(a){I(a)}var s=rt;s.j(t),100>s.h&&(s.h++,t.next=s.g,s.g=t)}ot=!1};function Ee(){this.s=this.s,this.C=this.C}Ee.prototype.s=!1,Ee.prototype.ma=function(){this.s||(this.s=!0,this.N())},Ee.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function B(t,s){this.type=t,this.g=this.target=s,this.defaultPrevented=!1}B.prototype.h=function(){this.defaultPrevented=!0};var zo=function(){if(!p.addEventListener||!Object.defineProperty)return!1;var t=!1,s=Object.defineProperty({},"passive",{get:function(){t=!0}});try{const a=()=>{};p.addEventListener("test",a,s),p.removeEventListener("test",a,s)}catch{}return t}();function at(t,s){if(B.call(this,t?t.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,t){var a=this.type=t.type,l=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:null;if(this.target=t.target||t.srcElement,this.g=s,s=t.relatedTarget){if(Ne){e:{try{ne(s.nodeName);var v=!0;break e}catch{}v=!1}v||(s=null)}}else a=="mouseover"?s=t.fromElement:a=="mouseout"&&(s=t.toElement);this.relatedTarget=s,l?(this.clientX=l.clientX!==void 0?l.clientX:l.pageX,this.clientY=l.clientY!==void 0?l.clientY:l.pageY,this.screenX=l.screenX||0,this.screenY=l.screenY||0):(this.clientX=t.clientX!==void 0?t.clientX:t.pageX,this.clientY=t.clientY!==void 0?t.clientY:t.pageY,this.screenX=t.screenX||0,this.screenY=t.screenY||0),this.button=t.button,this.key=t.key||"",this.ctrlKey=t.ctrlKey,this.altKey=t.altKey,this.shiftKey=t.shiftKey,this.metaKey=t.metaKey,this.pointerId=t.pointerId||0,this.pointerType=typeof t.pointerType=="string"?t.pointerType:Wo[t.pointerType]||"",this.state=t.state,this.i=t,t.defaultPrevented&&at.aa.h.call(this)}}C(at,B);var Wo={2:"touch",3:"pen",4:"mouse"};at.prototype.h=function(){at.aa.h.call(this);var t=this.i;t.preventDefault?t.preventDefault():t.returnValue=!1};var ct="closure_listenable_"+(1e6*Math.random()|0),Go=0;function qo(t,s,a,l,v){this.listener=t,this.proxy=null,this.src=s,this.type=a,this.capture=!!l,this.ha=v,this.key=++Go,this.da=this.fa=!1}function Lt(t){t.da=!0,t.listener=null,t.proxy=null,t.src=null,t.ha=null}function Mt(t){this.src=t,this.g={},this.h=0}Mt.prototype.add=function(t,s,a,l,v){var w=t.toString();t=this.g[w],t||(t=this.g[w]=[],this.h++);var E=In(t,s,l,v);return-1<E?(s=t[E],a||(s.fa=!1)):(s=new qo(s,this.src,w,!!l,v),s.fa=a,t.push(s)),s};function _n(t,s){var a=s.type;if(a in t.g){var l=t.g[a],v=Array.prototype.indexOf.call(l,s,void 0),w;(w=0<=v)&&Array.prototype.splice.call(l,v,1),w&&(Lt(s),t.g[a].length==0&&(delete t.g[a],t.h--))}}function In(t,s,a,l){for(var v=0;v<t.length;++v){var w=t[v];if(!w.da&&w.listener==s&&w.capture==!!a&&w.ha==l)return v}return-1}var wn="closure_lm_"+(1e6*Math.random()|0),Tn={};function Ui(t,s,a,l,v){if(l&&l.once)return Fi(t,s,a,l,v);if(Array.isArray(s)){for(var w=0;w<s.length;w++)Ui(t,s[w],a,l,v);return null}return a=Sn(a),t&&t[ct]?t.K(s,a,T(l)?!!l.capture:!!l,v):xi(t,s,a,!1,l,v)}function xi(t,s,a,l,v,w){if(!s)throw Error("Invalid event type");var E=T(v)?!!v.capture:!!v,D=An(t);if(D||(t[wn]=D=new Mt(t)),a=D.add(s,a,l,E,w),a.proxy)return a;if(l=Ko(),a.proxy=l,l.src=t,l.listener=a,t.addEventListener)zo||(v=E),v===void 0&&(v=!1),t.addEventListener(s.toString(),l,v);else if(t.attachEvent)t.attachEvent(Bi(s.toString()),l);else if(t.addListener&&t.removeListener)t.addListener(l);else throw Error("addEventListener and attachEvent are unavailable.");return a}function Ko(){function t(a){return s.call(t.src,t.listener,a)}const s=Jo;return t}function Fi(t,s,a,l,v){if(Array.isArray(s)){for(var w=0;w<s.length;w++)Fi(t,s[w],a,l,v);return null}return a=Sn(a),t&&t[ct]?t.L(s,a,T(l)?!!l.capture:!!l,v):xi(t,s,a,!0,l,v)}function ji(t,s,a,l,v){if(Array.isArray(s))for(var w=0;w<s.length;w++)ji(t,s[w],a,l,v);else l=T(l)?!!l.capture:!!l,a=Sn(a),t&&t[ct]?(t=t.i,s=String(s).toString(),s in t.g&&(w=t.g[s],a=In(w,a,l,v),-1<a&&(Lt(w[a]),Array.prototype.splice.call(w,a,1),w.length==0&&(delete t.g[s],t.h--)))):t&&(t=An(t))&&(s=t.g[s.toString()],t=-1,s&&(t=In(s,a,l,v)),(a=-1<t?s[t]:null)&&En(a))}function En(t){if(typeof t!="number"&&t&&!t.da){var s=t.src;if(s&&s[ct])_n(s.i,t);else{var a=t.type,l=t.proxy;s.removeEventListener?s.removeEventListener(a,l,t.capture):s.detachEvent?s.detachEvent(Bi(a),l):s.addListener&&s.removeListener&&s.removeListener(l),(a=An(s))?(_n(a,t),a.h==0&&(a.src=null,s[wn]=null)):Lt(t)}}}function Bi(t){return t in Tn?Tn[t]:Tn[t]="on"+t}function Jo(t,s){if(t.da)t=!0;else{s=new at(s,this);var a=t.listener,l=t.ha||t.src;t.fa&&En(t),t=a.call(l,s)}return t}function An(t){return t=t[wn],t instanceof Mt?t:null}var bn="__closure_events_fn_"+(1e9*Math.random()>>>0);function Sn(t){return typeof t=="function"?t:(t[bn]||(t[bn]=function(s){return t.handleEvent(s)}),t[bn])}function $(){Ee.call(this),this.i=new Mt(this),this.M=this,this.F=null}C($,Ee),$.prototype[ct]=!0,$.prototype.removeEventListener=function(t,s,a,l){ji(this,t,s,a,l)};function z(t,s){var a,l=t.F;if(l)for(a=[];l;l=l.F)a.push(l);if(t=t.M,l=s.type||s,typeof s=="string")s=new B(s,t);else if(s instanceof B)s.target=s.target||t;else{var v=s;s=new B(l,t),g(s,v)}if(v=!0,a)for(var w=a.length-1;0<=w;w--){var E=s.g=a[w];v=Ut(E,l,!0,s)&&v}if(E=s.g=t,v=Ut(E,l,!0,s)&&v,v=Ut(E,l,!1,s)&&v,a)for(w=0;w<a.length;w++)E=s.g=a[w],v=Ut(E,l,!1,s)&&v}$.prototype.N=function(){if($.aa.N.call(this),this.i){var t=this.i,s;for(s in t.g){for(var a=t.g[s],l=0;l<a.length;l++)Lt(a[l]);delete t.g[s],t.h--}}this.F=null},$.prototype.K=function(t,s,a,l){return this.i.add(String(t),s,!1,a,l)},$.prototype.L=function(t,s,a,l){return this.i.add(String(t),s,!0,a,l)};function Ut(t,s,a,l){if(s=t.i.g[String(s)],!s)return!0;s=s.concat();for(var v=!0,w=0;w<s.length;++w){var E=s[w];if(E&&!E.da&&E.capture==a){var D=E.listener,F=E.ha||E.src;E.fa&&_n(t.i,E),v=D.call(F,l)!==!1&&v}}return v&&!l.defaultPrevented}function $i(t,s,a){if(typeof t=="function")a&&(t=R(t,a));else if(t&&typeof t.handleEvent=="function")t=R(t.handleEvent,t);else throw Error("Invalid listener argument");return 2147483647<Number(s)?-1:p.setTimeout(t,s||0)}function Vi(t){t.g=$i(()=>{t.g=null,t.i&&(t.i=!1,Vi(t))},t.l);const s=t.h;t.h=null,t.m.apply(null,s)}class Xo extends Ee{constructor(s,a){super(),this.m=s,this.l=a,this.h=null,this.i=!1,this.g=null}j(s){this.h=arguments,this.g?this.i=!0:Vi(this)}N(){super.N(),this.g&&(p.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function lt(t){Ee.call(this),this.h=t,this.g={}}C(lt,Ee);var Hi=[];function zi(t){K(t.g,function(s,a){this.g.hasOwnProperty(a)&&En(s)},t),t.g={}}lt.prototype.N=function(){lt.aa.N.call(this),zi(this)},lt.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Rn=p.JSON.stringify,Yo=p.JSON.parse,Qo=class{stringify(t){return p.JSON.stringify(t,void 0)}parse(t){return p.JSON.parse(t,void 0)}};function kn(){}kn.prototype.h=null;function Wi(t){return t.h||(t.h=t.i())}function Zo(){}var ht={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function Cn(){B.call(this,"d")}C(Cn,B);function Pn(){B.call(this,"c")}C(Pn,B);var Ge={},Gi=null;function On(){return Gi=Gi||new $}Ge.La="serverreachability";function qi(t){B.call(this,Ge.La,t)}C(qi,B);function ut(t){const s=On();z(s,new qi(s))}Ge.STAT_EVENT="statevent";function Ki(t,s){B.call(this,Ge.STAT_EVENT,t),this.stat=s}C(Ki,B);function W(t){const s=On();z(s,new Ki(s,t))}Ge.Ma="timingevent";function Ji(t,s){B.call(this,Ge.Ma,t),this.size=s}C(Ji,B);function dt(t,s){if(typeof t!="function")throw Error("Fn must not be null and must be a function");return p.setTimeout(function(){t()},s)}function ft(){this.g=!0}ft.prototype.xa=function(){this.g=!1};function ea(t,s,a,l,v,w){t.info(function(){if(t.g)if(w)for(var E="",D=w.split("&"),F=0;F<D.length;F++){var P=D[F].split("=");if(1<P.length){var V=P[0];P=P[1];var H=V.split("_");E=2<=H.length&&H[1]=="type"?E+(V+"="+P+"&"):E+(V+"=redacted&")}}else E=null;else E=w;return"XMLHTTP REQ ("+l+") [attempt "+v+"]: "+s+`
`+a+`
`+E})}function ta(t,s,a,l,v,w,E){t.info(function(){return"XMLHTTP RESP ("+l+") [ attempt "+v+"]: "+s+`
`+a+`
`+w+" "+E})}function qe(t,s,a,l){t.info(function(){return"XMLHTTP TEXT ("+s+"): "+ia(t,a)+(l?" "+l:"")})}function na(t,s){t.info(function(){return"TIMEOUT: "+s})}ft.prototype.info=function(){};function ia(t,s){if(!t.g)return s;if(!s)return null;try{var a=JSON.parse(s);if(a){for(t=0;t<a.length;t++)if(Array.isArray(a[t])){var l=a[t];if(!(2>l.length)){var v=l[1];if(Array.isArray(v)&&!(1>v.length)){var w=v[0];if(w!="noop"&&w!="stop"&&w!="close")for(var E=1;E<v.length;E++)v[E]=""}}}}return Rn(a)}catch{return s}}var Dn={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},ra={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},Nn;function xt(){}C(xt,kn),xt.prototype.g=function(){return new XMLHttpRequest},xt.prototype.i=function(){return{}},Nn=new xt;function Ae(t,s,a,l){this.j=t,this.i=s,this.l=a,this.R=l||1,this.U=new lt(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Xi}function Xi(){this.i=null,this.g="",this.h=!1}var Yi={},Ln={};function Mn(t,s,a){t.L=1,t.v=$t(pe(s)),t.m=a,t.P=!0,Qi(t,null)}function Qi(t,s){t.F=Date.now(),Ft(t),t.A=pe(t.v);var a=t.A,l=t.R;Array.isArray(l)||(l=[String(l)]),dr(a.i,"t",l),t.C=0,a=t.j.J,t.h=new Xi,t.g=Pr(t.j,a?s:null,!t.m),0<t.O&&(t.M=new Xo(R(t.Y,t,t.g),t.O)),s=t.U,a=t.g,l=t.ca;var v="readystatechange";Array.isArray(v)||(v&&(Hi[0]=v.toString()),v=Hi);for(var w=0;w<v.length;w++){var E=Ui(a,v[w],l||s.handleEvent,!1,s.h||s);if(!E)break;s.g[E.key]=E}s=t.H?u(t.H):{},t.m?(t.u||(t.u="POST"),s["Content-Type"]="application/x-www-form-urlencoded",t.g.ea(t.A,t.u,t.m,s)):(t.u="GET",t.g.ea(t.A,t.u,null,s)),ut(),ea(t.i,t.u,t.A,t.l,t.R,t.m)}Ae.prototype.ca=function(t){t=t.target;const s=this.M;s&&ge(t)==3?s.j():this.Y(t)},Ae.prototype.Y=function(t){try{if(t==this.g)e:{const H=ge(this.g);var s=this.g.Ba();const Xe=this.g.Z();if(!(3>H)&&(H!=3||this.g&&(this.h.h||this.g.oa()||_r(this.g)))){this.J||H!=4||s==7||(s==8||0>=Xe?ut(3):ut(2)),Un(this);var a=this.g.Z();this.X=a;t:if(Zi(this)){var l=_r(this.g);t="";var v=l.length,w=ge(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){Le(this),pt(this);var E="";break t}this.h.i=new p.TextDecoder}for(s=0;s<v;s++)this.h.h=!0,t+=this.h.i.decode(l[s],{stream:!(w&&s==v-1)});l.length=0,this.h.g+=t,this.C=0,E=this.h.g}else E=this.g.oa();if(this.o=a==200,ta(this.i,this.u,this.A,this.l,this.R,H,a),this.o){if(this.T&&!this.K){t:{if(this.g){var D,F=this.g;if((D=F.g?F.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!Q(D)){var P=D;break t}}P=null}if(a=P)qe(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,xn(this,a);else{this.o=!1,this.s=3,W(12),Le(this),pt(this);break e}}if(this.P){a=!0;let ie;for(;!this.J&&this.C<E.length;)if(ie=sa(this,E),ie==Ln){H==4&&(this.s=4,W(14),a=!1),qe(this.i,this.l,null,"[Incomplete Response]");break}else if(ie==Yi){this.s=4,W(15),qe(this.i,this.l,E,"[Invalid Chunk]"),a=!1;break}else qe(this.i,this.l,ie,null),xn(this,ie);if(Zi(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),H!=4||E.length!=0||this.h.h||(this.s=1,W(16),a=!1),this.o=this.o&&a,!a)qe(this.i,this.l,E,"[Invalid Chunked Response]"),Le(this),pt(this);else if(0<E.length&&!this.W){this.W=!0;var V=this.j;V.g==this&&V.ba&&!V.M&&(V.j.info("Great, no buffering proxy detected. Bytes received: "+E.length),Hn(V),V.M=!0,W(11))}}else qe(this.i,this.l,E,null),xn(this,E);H==4&&Le(this),this.o&&!this.J&&(H==4?Sr(this.j,this):(this.o=!1,Ft(this)))}else Ta(this.g),a==400&&0<E.indexOf("Unknown SID")?(this.s=3,W(12)):(this.s=0,W(13)),Le(this),pt(this)}}}catch{}finally{}};function Zi(t){return t.g?t.u=="GET"&&t.L!=2&&t.j.Ca:!1}function sa(t,s){var a=t.C,l=s.indexOf(`
`,a);return l==-1?Ln:(a=Number(s.substring(a,l)),isNaN(a)?Yi:(l+=1,l+a>s.length?Ln:(s=s.slice(l,l+a),t.C=l+a,s)))}Ae.prototype.cancel=function(){this.J=!0,Le(this)};function Ft(t){t.S=Date.now()+t.I,er(t,t.I)}function er(t,s){if(t.B!=null)throw Error("WatchDog timer not null");t.B=dt(R(t.ba,t),s)}function Un(t){t.B&&(p.clearTimeout(t.B),t.B=null)}Ae.prototype.ba=function(){this.B=null;const t=Date.now();0<=t-this.S?(na(this.i,this.A),this.L!=2&&(ut(),W(17)),Le(this),this.s=2,pt(this)):er(this,this.S-t)};function pt(t){t.j.G==0||t.J||Sr(t.j,t)}function Le(t){Un(t);var s=t.M;s&&typeof s.ma=="function"&&s.ma(),t.M=null,zi(t.U),t.g&&(s=t.g,t.g=null,s.abort(),s.ma())}function xn(t,s){try{var a=t.j;if(a.G!=0&&(a.g==t||Fn(a.h,t))){if(!t.K&&Fn(a.h,t)&&a.G==3){try{var l=a.Da.g.parse(s)}catch{l=null}if(Array.isArray(l)&&l.length==3){var v=l;if(v[0]==0){e:if(!a.u){if(a.g)if(a.g.F+3e3<t.F)qt(a),Wt(a);else break e;Vn(a),W(18)}}else a.za=v[1],0<a.za-a.T&&37500>v[2]&&a.F&&a.v==0&&!a.C&&(a.C=dt(R(a.Za,a),6e3));if(1>=ir(a.h)&&a.ca){try{a.ca()}catch{}a.ca=void 0}}else Ue(a,11)}else if((t.K||a.g==t)&&qt(a),!Q(s))for(v=a.Da.g.parse(s),s=0;s<v.length;s++){let P=v[s];if(a.T=P[0],P=P[1],a.G==2)if(P[0]=="c"){a.K=P[1],a.ia=P[2];const V=P[3];V!=null&&(a.la=V,a.j.info("VER="+a.la));const H=P[4];H!=null&&(a.Aa=H,a.j.info("SVER="+a.Aa));const Xe=P[5];Xe!=null&&typeof Xe=="number"&&0<Xe&&(l=1.5*Xe,a.L=l,a.j.info("backChannelRequestTimeoutMs_="+l)),l=a;const ie=t.g;if(ie){const Kt=ie.g?ie.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Kt){var w=l.h;w.g||Kt.indexOf("spdy")==-1&&Kt.indexOf("quic")==-1&&Kt.indexOf("h2")==-1||(w.j=w.l,w.g=new Set,w.h&&(jn(w,w.h),w.h=null))}if(l.D){const zn=ie.g?ie.g.getResponseHeader("X-HTTP-Session-Id"):null;zn&&(l.ya=zn,L(l.I,l.D,zn))}}a.G=3,a.l&&a.l.ua(),a.ba&&(a.R=Date.now()-t.F,a.j.info("Handshake RTT: "+a.R+"ms")),l=a;var E=t;if(l.qa=Cr(l,l.J?l.ia:null,l.W),E.K){rr(l.h,E);var D=E,F=l.L;F&&(D.I=F),D.B&&(Un(D),Ft(D)),l.g=E}else Ar(l);0<a.i.length&&Gt(a)}else P[0]!="stop"&&P[0]!="close"||Ue(a,7);else a.G==3&&(P[0]=="stop"||P[0]=="close"?P[0]=="stop"?Ue(a,7):$n(a):P[0]!="noop"&&a.l&&a.l.ta(P),a.v=0)}}ut(4)}catch{}}var oa=class{constructor(t,s){this.g=t,this.map=s}};function tr(t){this.l=t||10,p.PerformanceNavigationTiming?(t=p.performance.getEntriesByType("navigation"),t=0<t.length&&(t[0].nextHopProtocol=="hq"||t[0].nextHopProtocol=="h2")):t=!!(p.chrome&&p.chrome.loadTimes&&p.chrome.loadTimes()&&p.chrome.loadTimes().wasFetchedViaSpdy),this.j=t?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function nr(t){return t.h?!0:t.g?t.g.size>=t.j:!1}function ir(t){return t.h?1:t.g?t.g.size:0}function Fn(t,s){return t.h?t.h==s:t.g?t.g.has(s):!1}function jn(t,s){t.g?t.g.add(s):t.h=s}function rr(t,s){t.h&&t.h==s?t.h=null:t.g&&t.g.has(s)&&t.g.delete(s)}tr.prototype.cancel=function(){if(this.i=sr(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const t of this.g.values())t.cancel();this.g.clear()}};function sr(t){if(t.h!=null)return t.i.concat(t.h.D);if(t.g!=null&&t.g.size!==0){let s=t.i;for(const a of t.g.values())s=s.concat(a.D);return s}return x(t.i)}function aa(t){if(t.V&&typeof t.V=="function")return t.V();if(typeof Map<"u"&&t instanceof Map||typeof Set<"u"&&t instanceof Set)return Array.from(t.values());if(typeof t=="string")return t.split("");if(y(t)){for(var s=[],a=t.length,l=0;l<a;l++)s.push(t[l]);return s}s=[],a=0;for(l in t)s[a++]=t[l];return s}function ca(t){if(t.na&&typeof t.na=="function")return t.na();if(!t.V||typeof t.V!="function"){if(typeof Map<"u"&&t instanceof Map)return Array.from(t.keys());if(!(typeof Set<"u"&&t instanceof Set)){if(y(t)||typeof t=="string"){var s=[];t=t.length;for(var a=0;a<t;a++)s.push(a);return s}s=[],a=0;for(const l in t)s[a++]=l;return s}}}function or(t,s){if(t.forEach&&typeof t.forEach=="function")t.forEach(s,void 0);else if(y(t)||typeof t=="string")Array.prototype.forEach.call(t,s,void 0);else for(var a=ca(t),l=aa(t),v=l.length,w=0;w<v;w++)s.call(void 0,l[w],a&&a[w],t)}var ar=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function la(t,s){if(t){t=t.split("&");for(var a=0;a<t.length;a++){var l=t[a].indexOf("="),v=null;if(0<=l){var w=t[a].substring(0,l);v=t[a].substring(l+1)}else w=t[a];s(w,v?decodeURIComponent(v.replace(/\+/g," ")):"")}}}function Me(t){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,t instanceof Me){this.h=t.h,jt(this,t.j),this.o=t.o,this.g=t.g,Bt(this,t.s),this.l=t.l;var s=t.i,a=new yt;a.i=s.i,s.g&&(a.g=new Map(s.g),a.h=s.h),cr(this,a),this.m=t.m}else t&&(s=String(t).match(ar))?(this.h=!1,jt(this,s[1]||"",!0),this.o=gt(s[2]||""),this.g=gt(s[3]||"",!0),Bt(this,s[4]),this.l=gt(s[5]||"",!0),cr(this,s[6]||"",!0),this.m=gt(s[7]||"")):(this.h=!1,this.i=new yt(null,this.h))}Me.prototype.toString=function(){var t=[],s=this.j;s&&t.push(mt(s,lr,!0),":");var a=this.g;return(a||s=="file")&&(t.push("//"),(s=this.o)&&t.push(mt(s,lr,!0),"@"),t.push(encodeURIComponent(String(a)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a=this.s,a!=null&&t.push(":",String(a))),(a=this.l)&&(this.g&&a.charAt(0)!="/"&&t.push("/"),t.push(mt(a,a.charAt(0)=="/"?da:ua,!0))),(a=this.i.toString())&&t.push("?",a),(a=this.m)&&t.push("#",mt(a,pa)),t.join("")};function pe(t){return new Me(t)}function jt(t,s,a){t.j=a?gt(s,!0):s,t.j&&(t.j=t.j.replace(/:$/,""))}function Bt(t,s){if(s){if(s=Number(s),isNaN(s)||0>s)throw Error("Bad port number "+s);t.s=s}else t.s=null}function cr(t,s,a){s instanceof yt?(t.i=s,ga(t.i,t.h)):(a||(s=mt(s,fa)),t.i=new yt(s,t.h))}function L(t,s,a){t.i.set(s,a)}function $t(t){return L(t,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),t}function gt(t,s){return t?s?decodeURI(t.replace(/%25/g,"%2525")):decodeURIComponent(t):""}function mt(t,s,a){return typeof t=="string"?(t=encodeURI(t).replace(s,ha),a&&(t=t.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),t):null}function ha(t){return t=t.charCodeAt(0),"%"+(t>>4&15).toString(16)+(t&15).toString(16)}var lr=/[#\/\?@]/g,ua=/[#\?:]/g,da=/[#\?]/g,fa=/[#\?@]/g,pa=/#/g;function yt(t,s){this.h=this.g=null,this.i=t||null,this.j=!!s}function be(t){t.g||(t.g=new Map,t.h=0,t.i&&la(t.i,function(s,a){t.add(decodeURIComponent(s.replace(/\+/g," ")),a)}))}n=yt.prototype,n.add=function(t,s){be(this),this.i=null,t=Ke(this,t);var a=this.g.get(t);return a||this.g.set(t,a=[]),a.push(s),this.h+=1,this};function hr(t,s){be(t),s=Ke(t,s),t.g.has(s)&&(t.i=null,t.h-=t.g.get(s).length,t.g.delete(s))}function ur(t,s){return be(t),s=Ke(t,s),t.g.has(s)}n.forEach=function(t,s){be(this),this.g.forEach(function(a,l){a.forEach(function(v){t.call(s,v,l,this)},this)},this)},n.na=function(){be(this);const t=Array.from(this.g.values()),s=Array.from(this.g.keys()),a=[];for(let l=0;l<s.length;l++){const v=t[l];for(let w=0;w<v.length;w++)a.push(s[l])}return a},n.V=function(t){be(this);let s=[];if(typeof t=="string")ur(this,t)&&(s=s.concat(this.g.get(Ke(this,t))));else{t=Array.from(this.g.values());for(let a=0;a<t.length;a++)s=s.concat(t[a])}return s},n.set=function(t,s){return be(this),this.i=null,t=Ke(this,t),ur(this,t)&&(this.h-=this.g.get(t).length),this.g.set(t,[s]),this.h+=1,this},n.get=function(t,s){return t?(t=this.V(t),0<t.length?String(t[0]):s):s};function dr(t,s,a){hr(t,s),0<a.length&&(t.i=null,t.g.set(Ke(t,s),x(a)),t.h+=a.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const t=[],s=Array.from(this.g.keys());for(var a=0;a<s.length;a++){var l=s[a];const w=encodeURIComponent(String(l)),E=this.V(l);for(l=0;l<E.length;l++){var v=w;E[l]!==""&&(v+="="+encodeURIComponent(String(E[l]))),t.push(v)}}return this.i=t.join("&")};function Ke(t,s){return s=String(s),t.j&&(s=s.toLowerCase()),s}function ga(t,s){s&&!t.j&&(be(t),t.i=null,t.g.forEach(function(a,l){var v=l.toLowerCase();l!=v&&(hr(this,l),dr(this,v,a))},t)),t.j=s}function ma(t,s){const a=new ft;if(p.Image){const l=new Image;l.onload=N(Se,a,"TestLoadImage: loaded",!0,s,l),l.onerror=N(Se,a,"TestLoadImage: error",!1,s,l),l.onabort=N(Se,a,"TestLoadImage: abort",!1,s,l),l.ontimeout=N(Se,a,"TestLoadImage: timeout",!1,s,l),p.setTimeout(function(){l.ontimeout&&l.ontimeout()},1e4),l.src=t}else s(!1)}function ya(t,s){const a=new ft,l=new AbortController,v=setTimeout(()=>{l.abort(),Se(a,"TestPingServer: timeout",!1,s)},1e4);fetch(t,{signal:l.signal}).then(w=>{clearTimeout(v),w.ok?Se(a,"TestPingServer: ok",!0,s):Se(a,"TestPingServer: server error",!1,s)}).catch(()=>{clearTimeout(v),Se(a,"TestPingServer: error",!1,s)})}function Se(t,s,a,l,v){try{v&&(v.onload=null,v.onerror=null,v.onabort=null,v.ontimeout=null),l(a)}catch{}}function va(){this.g=new Qo}function _a(t,s,a){const l=a||"";try{or(t,function(v,w){let E=v;T(v)&&(E=Rn(v)),s.push(l+w+"="+encodeURIComponent(E))})}catch(v){throw s.push(l+"type="+encodeURIComponent("_badmap")),v}}function Vt(t){this.l=t.Ub||null,this.j=t.eb||!1}C(Vt,kn),Vt.prototype.g=function(){return new Ht(this.l,this.j)},Vt.prototype.i=function(t){return function(){return t}}({});function Ht(t,s){$.call(this),this.D=t,this.o=s,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}C(Ht,$),n=Ht.prototype,n.open=function(t,s){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=t,this.A=s,this.readyState=1,_t(this)},n.send=function(t){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const s={headers:this.u,method:this.B,credentials:this.m,cache:void 0};t&&(s.body=t),(this.D||p).fetch(new Request(this.A,s)).then(this.Sa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,vt(this)),this.readyState=0},n.Sa=function(t){if(this.g&&(this.l=t,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=t.headers,this.readyState=2,_t(this)),this.g&&(this.readyState=3,_t(this),this.g)))if(this.responseType==="arraybuffer")t.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof p.ReadableStream<"u"&&"body"in t){if(this.j=t.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;fr(this)}else t.text().then(this.Ra.bind(this),this.ga.bind(this))};function fr(t){t.j.read().then(t.Pa.bind(t)).catch(t.ga.bind(t))}n.Pa=function(t){if(this.g){if(this.o&&t.value)this.response.push(t.value);else if(!this.o){var s=t.value?t.value:new Uint8Array(0);(s=this.v.decode(s,{stream:!t.done}))&&(this.response=this.responseText+=s)}t.done?vt(this):_t(this),this.readyState==3&&fr(this)}},n.Ra=function(t){this.g&&(this.response=this.responseText=t,vt(this))},n.Qa=function(t){this.g&&(this.response=t,vt(this))},n.ga=function(){this.g&&vt(this)};function vt(t){t.readyState=4,t.l=null,t.j=null,t.v=null,_t(t)}n.setRequestHeader=function(t,s){this.u.append(t,s)},n.getResponseHeader=function(t){return this.h&&this.h.get(t.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const t=[],s=this.h.entries();for(var a=s.next();!a.done;)a=a.value,t.push(a[0]+": "+a[1]),a=s.next();return t.join(`\r
`)};function _t(t){t.onreadystatechange&&t.onreadystatechange.call(t)}Object.defineProperty(Ht.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(t){this.m=t?"include":"same-origin"}});function pr(t){let s="";return K(t,function(a,l){s+=l,s+=":",s+=a,s+=`\r
`}),s}function Bn(t,s,a){e:{for(l in a){var l=!1;break e}l=!0}l||(a=pr(a),typeof t=="string"?a!=null&&encodeURIComponent(String(a)):L(t,s,a))}function U(t){$.call(this),this.headers=new Map,this.o=t||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}C(U,$);var Ia=/^https?$/i,wa=["POST","PUT"];n=U.prototype,n.Ha=function(t){this.J=t},n.ea=function(t,s,a,l){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+t);s=s?s.toUpperCase():"GET",this.D=t,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():Nn.g(),this.v=this.o?Wi(this.o):Wi(Nn),this.g.onreadystatechange=R(this.Ea,this);try{this.B=!0,this.g.open(s,String(t),!0),this.B=!1}catch(w){gr(this,w);return}if(t=a||"",a=new Map(this.headers),l)if(Object.getPrototypeOf(l)===Object.prototype)for(var v in l)a.set(v,l[v]);else if(typeof l.keys=="function"&&typeof l.get=="function")for(const w of l.keys())a.set(w,l.get(w));else throw Error("Unknown input type for opt_headers: "+String(l));l=Array.from(a.keys()).find(w=>w.toLowerCase()=="content-type"),v=p.FormData&&t instanceof p.FormData,!(0<=Array.prototype.indexOf.call(wa,s,void 0))||l||v||a.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[w,E]of a)this.g.setRequestHeader(w,E);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{vr(this),this.u=!0,this.g.send(t),this.u=!1}catch(w){gr(this,w)}};function gr(t,s){t.h=!1,t.g&&(t.j=!0,t.g.abort(),t.j=!1),t.l=s,t.m=5,mr(t),zt(t)}function mr(t){t.A||(t.A=!0,z(t,"complete"),z(t,"error"))}n.abort=function(t){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=t||7,z(this,"complete"),z(this,"abort"),zt(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),zt(this,!0)),U.aa.N.call(this)},n.Ea=function(){this.s||(this.B||this.u||this.j?yr(this):this.bb())},n.bb=function(){yr(this)};function yr(t){if(t.h&&typeof h<"u"&&(!t.v[1]||ge(t)!=4||t.Z()!=2)){if(t.u&&ge(t)==4)$i(t.Ea,0,t);else if(z(t,"readystatechange"),ge(t)==4){t.h=!1;try{const E=t.Z();e:switch(E){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var s=!0;break e;default:s=!1}var a;if(!(a=s)){var l;if(l=E===0){var v=String(t.D).match(ar)[1]||null;!v&&p.self&&p.self.location&&(v=p.self.location.protocol.slice(0,-1)),l=!Ia.test(v?v.toLowerCase():"")}a=l}if(a)z(t,"complete"),z(t,"success");else{t.m=6;try{var w=2<ge(t)?t.g.statusText:""}catch{w=""}t.l=w+" ["+t.Z()+"]",mr(t)}}finally{zt(t)}}}}function zt(t,s){if(t.g){vr(t);const a=t.g,l=t.v[0]?()=>{}:null;t.g=null,t.v=null,s||z(t,"ready");try{a.onreadystatechange=l}catch{}}}function vr(t){t.I&&(p.clearTimeout(t.I),t.I=null)}n.isActive=function(){return!!this.g};function ge(t){return t.g?t.g.readyState:0}n.Z=function(){try{return 2<ge(this)?this.g.status:-1}catch{return-1}},n.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.Oa=function(t){if(this.g){var s=this.g.responseText;return t&&s.indexOf(t)==0&&(s=s.substring(t.length)),Yo(s)}};function _r(t){try{if(!t.g)return null;if("response"in t.g)return t.g.response;switch(t.H){case"":case"text":return t.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in t.g)return t.g.mozResponseArrayBuffer}return null}catch{return null}}function Ta(t){const s={};t=(t.g&&2<=ge(t)&&t.g.getAllResponseHeaders()||"").split(`\r
`);for(let l=0;l<t.length;l++){if(Q(t[l]))continue;var a=m(t[l]);const v=a[0];if(a=a[1],typeof a!="string")continue;a=a.trim();const w=s[v]||[];s[v]=w,w.push(a)}_(s,function(l){return l.join(", ")})}n.Ba=function(){return this.m},n.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function It(t,s,a){return a&&a.internalChannelParams&&a.internalChannelParams[t]||s}function Ir(t){this.Aa=0,this.i=[],this.j=new ft,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=It("failFast",!1,t),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=It("baseRetryDelayMs",5e3,t),this.cb=It("retryDelaySeedMs",1e4,t),this.Wa=It("forwardChannelMaxRetries",2,t),this.wa=It("forwardChannelRequestTimeoutMs",2e4,t),this.pa=t&&t.xmlHttpFactory||void 0,this.Xa=t&&t.Tb||void 0,this.Ca=t&&t.useFetchStreams||!1,this.L=void 0,this.J=t&&t.supportsCrossDomainXhr||!1,this.K="",this.h=new tr(t&&t.concurrentRequestLimit),this.Da=new va,this.P=t&&t.fastHandshake||!1,this.O=t&&t.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=t&&t.Rb||!1,t&&t.xa&&this.j.xa(),t&&t.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&t&&t.detectBufferingProxy||!1,this.ja=void 0,t&&t.longPollingTimeout&&0<t.longPollingTimeout&&(this.ja=t.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}n=Ir.prototype,n.la=8,n.G=1,n.connect=function(t,s,a,l){W(0),this.W=t,this.H=s||{},a&&l!==void 0&&(this.H.OSID=a,this.H.OAID=l),this.F=this.X,this.I=Cr(this,null,this.W),Gt(this)};function $n(t){if(wr(t),t.G==3){var s=t.U++,a=pe(t.I);if(L(a,"SID",t.K),L(a,"RID",s),L(a,"TYPE","terminate"),wt(t,a),s=new Ae(t,t.j,s),s.L=2,s.v=$t(pe(a)),a=!1,p.navigator&&p.navigator.sendBeacon)try{a=p.navigator.sendBeacon(s.v.toString(),"")}catch{}!a&&p.Image&&(new Image().src=s.v,a=!0),a||(s.g=Pr(s.j,null),s.g.ea(s.v)),s.F=Date.now(),Ft(s)}kr(t)}function Wt(t){t.g&&(Hn(t),t.g.cancel(),t.g=null)}function wr(t){Wt(t),t.u&&(p.clearTimeout(t.u),t.u=null),qt(t),t.h.cancel(),t.s&&(typeof t.s=="number"&&p.clearTimeout(t.s),t.s=null)}function Gt(t){if(!nr(t.h)&&!t.s){t.s=!0;var s=t.Ga;st||Mi(),ot||(st(),ot=!0),vn.add(s,t),t.B=0}}function Ea(t,s){return ir(t.h)>=t.h.j-(t.s?1:0)?!1:t.s?(t.i=s.D.concat(t.i),!0):t.G==1||t.G==2||t.B>=(t.Va?0:t.Wa)?!1:(t.s=dt(R(t.Ga,t,s),Rr(t,t.B)),t.B++,!0)}n.Ga=function(t){if(this.s)if(this.s=null,this.G==1){if(!t){this.U=Math.floor(1e5*Math.random()),t=this.U++;const v=new Ae(this,this.j,t);let w=this.o;if(this.S&&(w?(w=u(w),g(w,this.S)):w=this.S),this.m!==null||this.O||(v.H=w,w=null),this.P)e:{for(var s=0,a=0;a<this.i.length;a++){t:{var l=this.i[a];if("__data__"in l.map&&(l=l.map.__data__,typeof l=="string")){l=l.length;break t}l=void 0}if(l===void 0)break;if(s+=l,4096<s){s=a;break e}if(s===4096||a===this.i.length-1){s=a+1;break e}}s=1e3}else s=1e3;s=Er(this,v,s),a=pe(this.I),L(a,"RID",t),L(a,"CVER",22),this.D&&L(a,"X-HTTP-Session-Id",this.D),wt(this,a),w&&(this.O?s="headers="+encodeURIComponent(String(pr(w)))+"&"+s:this.m&&Bn(a,this.m,w)),jn(this.h,v),this.Ua&&L(a,"TYPE","init"),this.P?(L(a,"$req",s),L(a,"SID","null"),v.T=!0,Mn(v,a,null)):Mn(v,a,s),this.G=2}}else this.G==3&&(t?Tr(this,t):this.i.length==0||nr(this.h)||Tr(this))};function Tr(t,s){var a;s?a=s.l:a=t.U++;const l=pe(t.I);L(l,"SID",t.K),L(l,"RID",a),L(l,"AID",t.T),wt(t,l),t.m&&t.o&&Bn(l,t.m,t.o),a=new Ae(t,t.j,a,t.B+1),t.m===null&&(a.H=t.o),s&&(t.i=s.D.concat(t.i)),s=Er(t,a,1e3),a.I=Math.round(.5*t.wa)+Math.round(.5*t.wa*Math.random()),jn(t.h,a),Mn(a,l,s)}function wt(t,s){t.H&&K(t.H,function(a,l){L(s,l,a)}),t.l&&or({},function(a,l){L(s,l,a)})}function Er(t,s,a){a=Math.min(t.i.length,a);var l=t.l?R(t.l.Na,t.l,t):null;e:{var v=t.i;let w=-1;for(;;){const E=["count="+a];w==-1?0<a?(w=v[0].g,E.push("ofs="+w)):w=0:E.push("ofs="+w);let D=!0;for(let F=0;F<a;F++){let P=v[F].g;const V=v[F].map;if(P-=w,0>P)w=Math.max(0,v[F].g-100),D=!1;else try{_a(V,E,"req"+P+"_")}catch{l&&l(V)}}if(D){l=E.join("&");break e}}}return t=t.i.splice(0,a),s.D=t,l}function Ar(t){if(!t.g&&!t.u){t.Y=1;var s=t.Fa;st||Mi(),ot||(st(),ot=!0),vn.add(s,t),t.v=0}}function Vn(t){return t.g||t.u||3<=t.v?!1:(t.Y++,t.u=dt(R(t.Fa,t),Rr(t,t.v)),t.v++,!0)}n.Fa=function(){if(this.u=null,br(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var t=2*this.R;this.j.info("BP detection timer enabled: "+t),this.A=dt(R(this.ab,this),t)}},n.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,W(10),Wt(this),br(this))};function Hn(t){t.A!=null&&(p.clearTimeout(t.A),t.A=null)}function br(t){t.g=new Ae(t,t.j,"rpc",t.Y),t.m===null&&(t.g.H=t.o),t.g.O=0;var s=pe(t.qa);L(s,"RID","rpc"),L(s,"SID",t.K),L(s,"AID",t.T),L(s,"CI",t.F?"0":"1"),!t.F&&t.ja&&L(s,"TO",t.ja),L(s,"TYPE","xmlhttp"),wt(t,s),t.m&&t.o&&Bn(s,t.m,t.o),t.L&&(t.g.I=t.L);var a=t.g;t=t.ia,a.L=1,a.v=$t(pe(s)),a.m=null,a.P=!0,Qi(a,t)}n.Za=function(){this.C!=null&&(this.C=null,Wt(this),Vn(this),W(19))};function qt(t){t.C!=null&&(p.clearTimeout(t.C),t.C=null)}function Sr(t,s){var a=null;if(t.g==s){qt(t),Hn(t),t.g=null;var l=2}else if(Fn(t.h,s))a=s.D,rr(t.h,s),l=1;else return;if(t.G!=0){if(s.o)if(l==1){a=s.m?s.m.length:0,s=Date.now()-s.F;var v=t.B;l=On(),z(l,new Ji(l,a)),Gt(t)}else Ar(t);else if(v=s.s,v==3||v==0&&0<s.X||!(l==1&&Ea(t,s)||l==2&&Vn(t)))switch(a&&0<a.length&&(s=t.h,s.i=s.i.concat(a)),v){case 1:Ue(t,5);break;case 4:Ue(t,10);break;case 3:Ue(t,6);break;default:Ue(t,2)}}}function Rr(t,s){let a=t.Ta+Math.floor(Math.random()*t.cb);return t.isActive()||(a*=2),a*s}function Ue(t,s){if(t.j.info("Error code "+s),s==2){var a=R(t.fb,t),l=t.Xa;const v=!l;l=new Me(l||"//www.google.com/images/cleardot.gif"),p.location&&p.location.protocol=="http"||jt(l,"https"),$t(l),v?ma(l.toString(),a):ya(l.toString(),a)}else W(2);t.G=0,t.l&&t.l.sa(s),kr(t),wr(t)}n.fb=function(t){t?(this.j.info("Successfully pinged google.com"),W(2)):(this.j.info("Failed to ping google.com"),W(1))};function kr(t){if(t.G=0,t.ka=[],t.l){const s=sr(t.h);(s.length!=0||t.i.length!=0)&&(M(t.ka,s),M(t.ka,t.i),t.h.i.length=0,x(t.i),t.i.length=0),t.l.ra()}}function Cr(t,s,a){var l=a instanceof Me?pe(a):new Me(a);if(l.g!="")s&&(l.g=s+"."+l.g),Bt(l,l.s);else{var v=p.location;l=v.protocol,s=s?s+"."+v.hostname:v.hostname,v=+v.port;var w=new Me(null);l&&jt(w,l),s&&(w.g=s),v&&Bt(w,v),a&&(w.l=a),l=w}return a=t.D,s=t.ya,a&&s&&L(l,a,s),L(l,"VER",t.la),wt(t,l),l}function Pr(t,s,a){if(s&&!t.J)throw Error("Can't create secondary domain capable XhrIo object.");return s=t.Ca&&!t.pa?new U(new Vt({eb:a})):new U(t.pa),s.Ha(t.J),s}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Or(){}n=Or.prototype,n.ua=function(){},n.ta=function(){},n.sa=function(){},n.ra=function(){},n.isActive=function(){return!0},n.Na=function(){};function ee(t,s){$.call(this),this.g=new Ir(s),this.l=t,this.h=s&&s.messageUrlParams||null,t=s&&s.messageHeaders||null,s&&s.clientProtocolHeaderRequired&&(t?t["X-Client-Protocol"]="webchannel":t={"X-Client-Protocol":"webchannel"}),this.g.o=t,t=s&&s.initMessageHeaders||null,s&&s.messageContentType&&(t?t["X-WebChannel-Content-Type"]=s.messageContentType:t={"X-WebChannel-Content-Type":s.messageContentType}),s&&s.va&&(t?t["X-WebChannel-Client-Profile"]=s.va:t={"X-WebChannel-Client-Profile":s.va}),this.g.S=t,(t=s&&s.Sb)&&!Q(t)&&(this.g.m=t),this.v=s&&s.supportsCrossDomainXhr||!1,this.u=s&&s.sendRawJson||!1,(s=s&&s.httpSessionIdParam)&&!Q(s)&&(this.g.D=s,t=this.h,t!==null&&s in t&&(t=this.h,s in t&&delete t[s])),this.j=new Je(this)}C(ee,$),ee.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},ee.prototype.close=function(){$n(this.g)},ee.prototype.o=function(t){var s=this.g;if(typeof t=="string"){var a={};a.__data__=t,t=a}else this.u&&(a={},a.__data__=Rn(t),t=a);s.i.push(new oa(s.Ya++,t)),s.G==3&&Gt(s)},ee.prototype.N=function(){this.g.l=null,delete this.j,$n(this.g),delete this.g,ee.aa.N.call(this)};function Dr(t){Cn.call(this),t.__headers__&&(this.headers=t.__headers__,this.statusCode=t.__status__,delete t.__headers__,delete t.__status__);var s=t.__sm__;if(s){e:{for(const a in s){t=a;break e}t=void 0}(this.i=t)&&(t=this.i,s=s!==null&&t in s?s[t]:void 0),this.data=s}else this.data=t}C(Dr,Cn);function Nr(){Pn.call(this),this.status=1}C(Nr,Pn);function Je(t){this.g=t}C(Je,Or),Je.prototype.ua=function(){z(this.g,"a")},Je.prototype.ta=function(t){z(this.g,new Dr(t))},Je.prototype.sa=function(t){z(this.g,new Nr)},Je.prototype.ra=function(){z(this.g,"b")},ee.prototype.send=ee.prototype.o,ee.prototype.open=ee.prototype.m,ee.prototype.close=ee.prototype.close,Dn.NO_ERROR=0,Dn.TIMEOUT=8,Dn.HTTP_ERROR=6,ra.COMPLETE="complete",Zo.EventType=ht,ht.OPEN="a",ht.CLOSE="b",ht.ERROR="c",ht.MESSAGE="d",$.prototype.listen=$.prototype.K,U.prototype.listenOnce=U.prototype.L,U.prototype.getLastError=U.prototype.Ka,U.prototype.getLastErrorCode=U.prototype.Ba,U.prototype.getStatus=U.prototype.Z,U.prototype.getResponseJson=U.prototype.Oa,U.prototype.getResponseText=U.prototype.oa,U.prototype.send=U.prototype.ea,U.prototype.setWithCredentials=U.prototype.Ha}).apply(typeof Xt<"u"?Xt:typeof self<"u"?self:typeof window<"u"?window:{});const cs="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}G.UNAUTHENTICATED=new G(null),G.GOOGLE_CREDENTIALS=new G("google-credentials-uid"),G.FIRST_PARTY=new G("first-party-uid"),G.MOCK_USER=new G("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Nt="10.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt=new dn("@firebase/firestore");function re(n,...e){if(tt.logLevel<=O.DEBUG){const i=e.map(Si);tt.debug(`Firestore (${Nt}): ${n}`,...i)}}function yo(n,...e){if(tt.logLevel<=O.ERROR){const i=e.map(Si);tt.error(`Firestore (${Nt}): ${n}`,...i)}}function ou(n,...e){if(tt.logLevel<=O.WARN){const i=e.map(Si);tt.warn(`Firestore (${Nt}): ${n}`,...i)}}function Si(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return function(i){return JSON.stringify(i)}(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ri(n="Unexpected state"){const e=`FIRESTORE (${Nt}) INTERNAL ASSERTION FAILED: `+n;throw yo(e),new Error(e)}function Et(n,e){n||Ri()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const J={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class X extends ae{constructor(e,i){super(e,i),this.code=e,this.message=i,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(){this.promise=new Promise((e,i)=>{this.resolve=e,this.reject=i})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vo{constructor(e,i){this.user=i,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class au{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,i){e.enqueueRetryable(()=>i(G.UNAUTHENTICATED))}shutdown(){}}class cu{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,i){this.changeListener=i,e.enqueueRetryable(()=>i(this.token.user))}shutdown(){this.changeListener=null}}class lu{constructor(e){this.t=e,this.currentUser=G.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,i){Et(this.o===void 0);let r=this.i;const o=y=>this.i!==r?(r=this.i,i(y)):Promise.resolve();let c=new At;this.o=()=>{this.i++,this.currentUser=this.u(),c.resolve(),c=new At,e.enqueueRetryable(()=>o(this.currentUser))};const h=()=>{const y=c;e.enqueueRetryable(async()=>{await y.promise,await o(this.currentUser)})},p=y=>{re("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=y,this.o&&(this.auth.addAuthTokenListener(this.o),h())};this.t.onInit(y=>p(y)),setTimeout(()=>{if(!this.auth){const y=this.t.getImmediate({optional:!0});y?p(y):(re("FirebaseAuthCredentialsProvider","Auth not yet detected"),c.resolve(),c=new At)}},0),h()}getToken(){const e=this.i,i=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(i).then(r=>this.i!==e?(re("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(Et(typeof r.accessToken=="string"),new vo(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Et(e===null||typeof e=="string"),new G(e)}}class hu{constructor(e,i,r){this.l=e,this.h=i,this.P=r,this.type="FirstParty",this.user=G.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class uu{constructor(e,i,r){this.l=e,this.h=i,this.P=r}getToken(){return Promise.resolve(new hu(this.l,this.h,this.P))}start(e,i){e.enqueueRetryable(()=>i(G.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class du{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class fu{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,i){Et(this.o===void 0);const r=c=>{c.error!=null&&re("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${c.error.message}`);const h=c.token!==this.R;return this.R=c.token,re("FirebaseAppCheckTokenProvider",`Received ${h?"new":"existing"} token.`),h?i(c.token):Promise.resolve()};this.o=c=>{e.enqueueRetryable(()=>r(c))};const o=c=>{re("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=c,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(c=>o(c)),setTimeout(()=>{if(!this.appCheck){const c=this.A.getImmediate({optional:!0});c?o(c):re("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(i=>i?(Et(typeof i.token=="string"),this.R=i.token,new du(i.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}function pu(n){return n.name==="IndexedDbTransactionError"}class ln{constructor(e,i){this.projectId=e,this.database=i||"(default)"}static empty(){return new ln("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof ln&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ls,k;(k=ls||(ls={}))[k.OK=0]="OK",k[k.CANCELLED=1]="CANCELLED",k[k.UNKNOWN=2]="UNKNOWN",k[k.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",k[k.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",k[k.NOT_FOUND=5]="NOT_FOUND",k[k.ALREADY_EXISTS=6]="ALREADY_EXISTS",k[k.PERMISSION_DENIED=7]="PERMISSION_DENIED",k[k.UNAUTHENTICATED=16]="UNAUTHENTICATED",k[k.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",k[k.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",k[k.ABORTED=10]="ABORTED",k[k.OUT_OF_RANGE=11]="OUT_OF_RANGE",k[k.UNIMPLEMENTED=12]="UNIMPLEMENTED",k[k.INTERNAL=13]="INTERNAL",k[k.UNAVAILABLE=14]="UNAVAILABLE",k[k.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new mo([4294967295,4294967295],0);function Qn(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gu{constructor(e,i,r=1e3,o=1.5,c=6e4){this.ui=e,this.timerId=i,this.ko=r,this.qo=o,this.Qo=c,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(e){this.cancel();const i=Math.floor(this.Ko+this.zo()),r=Math.max(0,Date.now()-this.Uo),o=Math.max(0,i-r);o>0&&re("ExponentialBackoff",`Backing off for ${o} ms (base delay: ${this.Ko} ms, delay with jitter: ${i} ms, last attempt: ${r} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,o,()=>(this.Uo=Date.now(),e())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){this.$o!==null&&(this.$o.skipDelay(),this.$o=null)}cancel(){this.$o!==null&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ki{constructor(e,i,r,o,c){this.asyncQueue=e,this.timerId=i,this.targetTimeMs=r,this.op=o,this.removalCallback=c,this.deferred=new At,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(h=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,i,r,o,c){const h=Date.now()+r,p=new ki(e,i,h,o,c);return p.start(r),p}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new X(J.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}var hs,us;(us=hs||(hs={})).ea="default",us.Cache="cache";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mu(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ds=new Map;function yu(n,e,i,r){if(e===!0&&r===!0)throw new X(J.INVALID_ARGUMENT,`${n} and ${i} cannot be used together.`)}function vu(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":Ri()}function _u(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new X(J.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const i=vu(n);throw new X(J.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${i}`)}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fs{constructor(e){var i,r;if(e.host===void 0){if(e.ssl!==void 0)throw new X(J.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(i=e.ssl)===null||i===void 0||i;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new X(J.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}yu("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=mu((r=e.experimentalLongPollingOptions)!==null&&r!==void 0?r:{}),function(c){if(c.timeoutSeconds!==void 0){if(isNaN(c.timeoutSeconds))throw new X(J.INVALID_ARGUMENT,`invalid long polling timeout: ${c.timeoutSeconds} (must not be NaN)`);if(c.timeoutSeconds<5)throw new X(J.INVALID_ARGUMENT,`invalid long polling timeout: ${c.timeoutSeconds} (minimum allowed value is 5)`);if(c.timeoutSeconds>30)throw new X(J.INVALID_ARGUMENT,`invalid long polling timeout: ${c.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,o){return r.timeoutSeconds===o.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class _o{constructor(e,i,r,o){this._authCredentials=e,this._appCheckCredentials=i,this._databaseId=r,this._app=o,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new fs({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new X(J.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new X(J.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new fs(e),e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new au;switch(r.type){case"firstParty":return new uu(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new X(J.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(i){const r=ds.get(i);r&&(re("ComponentProvider","Removing Datastore"),ds.delete(i),r.terminate())}(this),Promise.resolve()}}function Iu(n,e,i,r={}){var o;const c=(n=_u(n,_o))._getSettings(),h=`${e}:${i}`;if(c.host!=="firestore.googleapis.com"&&c.host!==h&&ou("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),n._setSettings(Object.assign(Object.assign({},c),{host:h,ssl:!1})),r.mockUserToken){let p,y;if(typeof r.mockUserToken=="string")p=r.mockUserToken,y=G.MOCK_USER;else{p=Ma(r.mockUserToken,(o=n._app)===null||o===void 0?void 0:o.options.projectId);const T=r.mockUserToken.sub||r.mockUserToken.user_id;if(!T)throw new X(J.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");y=new G(T)}n._authCredentials=new cu(new vo(p,y))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ps{constructor(e=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new gu(this,"async_queue_retry"),this.Vu=()=>{const r=Qn();r&&re("AsyncQueue","Visibility state changed to "+r.visibilityState),this.t_.jo()},this.mu=e;const i=Qn();i&&typeof i.addEventListener=="function"&&i.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.fu(),this.gu(e)}enterRestrictedMode(e){if(!this.Iu){this.Iu=!0,this.Au=e||!1;const i=Qn();i&&typeof i.removeEventListener=="function"&&i.removeEventListener("visibilitychange",this.Vu)}}enqueue(e){if(this.fu(),this.Iu)return new Promise(()=>{});const i=new At;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(e().then(i.resolve,i.reject),i.promise)).then(()=>i.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Pu.push(e),this.pu()))}async pu(){if(this.Pu.length!==0){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(e){if(!pu(e))throw e;re("AsyncQueue","Operation failed with retryable error: "+e)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(e){const i=this.mu.then(()=>(this.du=!0,e().catch(r=>{this.Eu=r,this.du=!1;const o=function(h){let p=h.message||"";return h.stack&&(p=h.stack.includes(h.message)?h.stack:h.message+`
`+h.stack),p}(r);throw yo("INTERNAL UNHANDLED ERROR: ",o),r}).then(r=>(this.du=!1,r))));return this.mu=i,i}enqueueAfterDelay(e,i,r){this.fu(),this.Ru.indexOf(e)>-1&&(i=0);const o=ki.createAndSchedule(this,e,i,r,c=>this.yu(c));return this.Tu.push(o),o}fu(){this.Eu&&Ri()}verifyOperationInProgress(){}async wu(){let e;do e=this.mu,await e;while(e!==this.mu)}Su(e){for(const i of this.Tu)if(i.timerId===e)return!0;return!1}bu(e){return this.wu().then(()=>{this.Tu.sort((i,r)=>i.targetTimeMs-r.targetTimeMs);for(const i of this.Tu)if(i.skipDelay(),e!=="all"&&i.timerId===e)break;return this.wu()})}Du(e){this.Ru.push(e)}yu(e){const i=this.Tu.indexOf(e);this.Tu.splice(i,1)}}class wu extends _o{constructor(e,i,r,o){super(e,i,r,o),this.type="firestore",this._queue=new ps,this._persistenceKey=(o==null?void 0:o.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new ps(e),this._firestoreClient=void 0,await e}}}function Tu(n,e){const i=typeof n=="object"?n:pi(),r=typeof n=="string"?n:e||"(default)",o=We(i,"firestore").getImmediate({identifier:r});if(!o._initialized){const c=Na("firestore");c&&Iu(o,...c)}return o}(function(e,i=!0){(function(o){Nt=o})(nt),le(new oe("firestore",(r,{instanceIdentifier:o,options:c})=>{const h=r.getProvider("app").getImmediate(),p=new wu(new lu(r.getProvider("auth-internal")),new fu(r.getProvider("app-check-internal")),function(T,A){if(!Object.prototype.hasOwnProperty.apply(T.options,["projectId"]))throw new X(J.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ln(T.options.projectId,A)}(h,o),h);return c=Object.assign({useFetchStreams:i},c),p._setSettings(c),p},"PUBLIC").setMultipleInstances(!0)),te(cs,"4.7.3",e),te(cs,"4.7.3","esm2017")})();const Io="@firebase/installations",Ci="0.6.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wo=1e4,To=`w:${Ci}`,Eo="FIS_v2",Eu="https://firebaseinstallations.googleapis.com/v1",Au=60*60*1e3,bu="installations",Su="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ru={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Ve=new ze(bu,Su,Ru);function Ao(n){return n instanceof ae&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bo({projectId:n}){return`${Eu}/projects/${n}/installations`}function So(n){return{token:n.token,requestStatus:2,expiresIn:Cu(n.expiresIn),creationTime:Date.now()}}async function Ro(n,e){const r=(await e.json()).error;return Ve.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function ko({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function ku(n,{refreshToken:e}){const i=ko(n);return i.append("Authorization",Pu(e)),i}async function Co(n){const e=await n();return e.status>=500&&e.status<600?n():e}function Cu(n){return Number(n.replace("s","000"))}function Pu(n){return`${Eo} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ou({appConfig:n,heartbeatServiceProvider:e},{fid:i}){const r=bo(n),o=ko(n),c=e.getImmediate({optional:!0});if(c){const T=await c.getHeartbeatsHeader();T&&o.append("x-firebase-client",T)}const h={fid:i,authVersion:Eo,appId:n.appId,sdkVersion:To},p={method:"POST",headers:o,body:JSON.stringify(h)},y=await Co(()=>fetch(r,p));if(y.ok){const T=await y.json();return{fid:T.fid||i,registrationStatus:2,refreshToken:T.refreshToken,authToken:So(T.authToken)}}else throw await Ro("Create Installation",y)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Po(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Du(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nu=/^[cdef][\w-]{21}$/,ui="";function Lu(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const i=Mu(n);return Nu.test(i)?i:ui}catch{return ui}}function Mu(n){return Du(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mn(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oo=new Map;function Do(n,e){const i=mn(n);No(i,e),Uu(i,e)}function No(n,e){const i=Oo.get(n);if(i)for(const r of i)r(e)}function Uu(n,e){const i=xu();i&&i.postMessage({key:n,fid:e}),Fu()}let je=null;function xu(){return!je&&"BroadcastChannel"in self&&(je=new BroadcastChannel("[Firebase] FID Change"),je.onmessage=n=>{No(n.data.key,n.data.fid)}),je}function Fu(){Oo.size===0&&je&&(je.close(),je=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ju="firebase-installations-database",Bu=1,He="firebase-installations-store";let Zn=null;function Pi(){return Zn||(Zn=Ls(ju,Bu,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(He)}}})),Zn}async function hn(n,e){const i=mn(n),o=(await Pi()).transaction(He,"readwrite"),c=o.objectStore(He),h=await c.get(i);return await c.put(e,i),await o.done,(!h||h.fid!==e.fid)&&Do(n,e.fid),e}async function Lo(n){const e=mn(n),r=(await Pi()).transaction(He,"readwrite");await r.objectStore(He).delete(e),await r.done}async function yn(n,e){const i=mn(n),o=(await Pi()).transaction(He,"readwrite"),c=o.objectStore(He),h=await c.get(i),p=e(h);return p===void 0?await c.delete(i):await c.put(p,i),await o.done,p&&(!h||h.fid!==p.fid)&&Do(n,p.fid),p}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Oi(n){let e;const i=await yn(n.appConfig,r=>{const o=$u(r),c=Vu(n,o);return e=c.registrationPromise,c.installationEntry});return i.fid===ui?{installationEntry:await e}:{installationEntry:i,registrationPromise:e}}function $u(n){const e=n||{fid:Lu(),registrationStatus:0};return Mo(e)}function Vu(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const o=Promise.reject(Ve.create("app-offline"));return{installationEntry:e,registrationPromise:o}}const i={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=Hu(n,i);return{installationEntry:i,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:zu(n)}:{installationEntry:e}}async function Hu(n,e){try{const i=await Ou(n,e);return hn(n.appConfig,i)}catch(i){throw Ao(i)&&i.customData.serverCode===409?await Lo(n.appConfig):await hn(n.appConfig,{fid:e.fid,registrationStatus:0}),i}}async function zu(n){let e=await gs(n.appConfig);for(;e.registrationStatus===1;)await Po(100),e=await gs(n.appConfig);if(e.registrationStatus===0){const{installationEntry:i,registrationPromise:r}=await Oi(n);return r||i}return e}function gs(n){return yn(n,e=>{if(!e)throw Ve.create("installation-not-found");return Mo(e)})}function Mo(n){return Wu(n)?{fid:n.fid,registrationStatus:0}:n}function Wu(n){return n.registrationStatus===1&&n.registrationTime+wo<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gu({appConfig:n,heartbeatServiceProvider:e},i){const r=qu(n,i),o=ku(n,i),c=e.getImmediate({optional:!0});if(c){const T=await c.getHeartbeatsHeader();T&&o.append("x-firebase-client",T)}const h={installation:{sdkVersion:To,appId:n.appId}},p={method:"POST",headers:o,body:JSON.stringify(h)},y=await Co(()=>fetch(r,p));if(y.ok){const T=await y.json();return So(T)}else throw await Ro("Generate Auth Token",y)}function qu(n,{fid:e}){return`${bo(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Di(n,e=!1){let i;const r=await yn(n.appConfig,c=>{if(!Uo(c))throw Ve.create("not-registered");const h=c.authToken;if(!e&&Xu(h))return c;if(h.requestStatus===1)return i=Ku(n,e),c;{if(!navigator.onLine)throw Ve.create("app-offline");const p=Qu(c);return i=Ju(n,p),p}});return i?await i:r.authToken}async function Ku(n,e){let i=await ms(n.appConfig);for(;i.authToken.requestStatus===1;)await Po(100),i=await ms(n.appConfig);const r=i.authToken;return r.requestStatus===0?Di(n,e):r}function ms(n){return yn(n,e=>{if(!Uo(e))throw Ve.create("not-registered");const i=e.authToken;return Zu(i)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function Ju(n,e){try{const i=await Gu(n,e),r=Object.assign(Object.assign({},e),{authToken:i});return await hn(n.appConfig,r),i}catch(i){if(Ao(i)&&(i.customData.serverCode===401||i.customData.serverCode===404))await Lo(n.appConfig);else{const r=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await hn(n.appConfig,r)}throw i}}function Uo(n){return n!==void 0&&n.registrationStatus===2}function Xu(n){return n.requestStatus===2&&!Yu(n)}function Yu(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+Au}function Qu(n){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},n),{authToken:e})}function Zu(n){return n.requestStatus===1&&n.requestTime+wo<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ed(n){const e=n,{installationEntry:i,registrationPromise:r}=await Oi(e);return r?r.catch(console.error):Di(e).catch(console.error),i.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function td(n,e=!1){const i=n;return await nd(i),(await Di(i,e)).token}async function nd(n){const{registrationPromise:e}=await Oi(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function id(n){if(!n||!n.options)throw ei("App Configuration");if(!n.name)throw ei("App Name");const e=["projectId","apiKey","appId"];for(const i of e)if(!n.options[i])throw ei(i);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function ei(n){return Ve.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xo="installations",rd="installations-internal",sd=n=>{const e=n.getProvider("app").getImmediate(),i=id(e),r=We(e,"heartbeat");return{app:e,appConfig:i,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},od=n=>{const e=n.getProvider("app").getImmediate(),i=We(e,xo).getImmediate();return{getId:()=>ed(i),getToken:o=>td(i,o)}};function ad(){le(new oe(xo,sd,"PUBLIC")),le(new oe(rd,od,"PRIVATE"))}ad();te(Io,Ci);te(Io,Ci,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const un="analytics",cd="firebase_id",ld="origin",hd=60*1e3,ud="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Ni="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Y=new dn("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dd={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},Z=new ze("analytics","Analytics",dd);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fd(n){if(!n.startsWith(Ni)){const e=Z.create("invalid-gtag-resource",{gtagURL:n});return Y.warn(e.message),""}return n}function Fo(n){return Promise.all(n.map(e=>e.catch(i=>i)))}function pd(n,e){let i;return window.trustedTypes&&(i=window.trustedTypes.createPolicy(n,e)),i}function gd(n,e){const i=pd("firebase-js-sdk-policy",{createScriptURL:fd}),r=document.createElement("script"),o=`${Ni}?l=${n}&id=${e}`;r.src=i?i==null?void 0:i.createScriptURL(o):o,r.async=!0,document.head.appendChild(r)}function md(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function yd(n,e,i,r,o,c){const h=r[o];try{if(h)await e[h];else{const y=(await Fo(i)).find(T=>T.measurementId===o);y&&await e[y.appId]}}catch(p){Y.error(p)}n("config",o,c)}async function vd(n,e,i,r,o){try{let c=[];if(o&&o.send_to){let h=o.send_to;Array.isArray(h)||(h=[h]);const p=await Fo(i);for(const y of h){const T=p.find(S=>S.measurementId===y),A=T&&e[T.appId];if(A)c.push(A);else{c=[];break}}}c.length===0&&(c=Object.values(e)),await Promise.all(c),n("event",r,o||{})}catch(c){Y.error(c)}}function _d(n,e,i,r){async function o(c,...h){try{if(c==="event"){const[p,y]=h;await vd(n,e,i,p,y)}else if(c==="config"){const[p,y]=h;await yd(n,e,i,r,p,y)}else if(c==="consent"){const[p,y]=h;n("consent",p,y)}else if(c==="get"){const[p,y,T]=h;n("get",p,y,T)}else if(c==="set"){const[p]=h;n("set",p)}else n(c,...h)}catch(p){Y.error(p)}}return o}function Id(n,e,i,r,o){let c=function(...h){window[r].push(arguments)};return window[o]&&typeof window[o]=="function"&&(c=window[o]),window[o]=_d(c,n,e,i),{gtagCore:c,wrappedGtag:window[o]}}function wd(n){const e=window.document.getElementsByTagName("script");for(const i of Object.values(e))if(i.src&&i.src.includes(Ni)&&i.src.includes(n))return i;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Td=30,Ed=1e3;class Ad{constructor(e={},i=Ed){this.throttleMetadata=e,this.intervalMillis=i}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,i){this.throttleMetadata[e]=i}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const jo=new Ad;function bd(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function Sd(n){var e;const{appId:i,apiKey:r}=n,o={method:"GET",headers:bd(r)},c=ud.replace("{app-id}",i),h=await fetch(c,o);if(h.status!==200&&h.status!==304){let p="";try{const y=await h.json();!((e=y.error)===null||e===void 0)&&e.message&&(p=y.error.message)}catch{}throw Z.create("config-fetch-failed",{httpStatus:h.status,responseMessage:p})}return h.json()}async function Rd(n,e=jo,i){const{appId:r,apiKey:o,measurementId:c}=n.options;if(!r)throw Z.create("no-app-id");if(!o){if(c)return{measurementId:c,appId:r};throw Z.create("no-api-key")}const h=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},p=new Pd;return setTimeout(async()=>{p.abort()},i!==void 0?i:hd),Bo({appId:r,apiKey:o,measurementId:c},h,p,e)}async function Bo(n,{throttleEndTimeMillis:e,backoffCount:i},r,o=jo){var c;const{appId:h,measurementId:p}=n;try{await kd(r,e)}catch(y){if(p)return Y.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${p} provided in the "measurementId" field in the local Firebase config. [${y==null?void 0:y.message}]`),{appId:h,measurementId:p};throw y}try{const y=await Sd(n);return o.deleteThrottleMetadata(h),y}catch(y){const T=y;if(!Cd(T)){if(o.deleteThrottleMetadata(h),p)return Y.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${p} provided in the "measurementId" field in the local Firebase config. [${T==null?void 0:T.message}]`),{appId:h,measurementId:p};throw y}const A=Number((c=T==null?void 0:T.customData)===null||c===void 0?void 0:c.httpStatus)===503?Mr(i,o.intervalMillis,Td):Mr(i,o.intervalMillis),S={throttleEndTimeMillis:Date.now()+A,backoffCount:i+1};return o.setThrottleMetadata(h,S),Y.debug(`Calling attemptFetch again in ${A} millis`),Bo(n,S,r,o)}}function kd(n,e){return new Promise((i,r)=>{const o=Math.max(e-Date.now(),0),c=setTimeout(i,o);n.addEventListener(()=>{clearTimeout(c),r(Z.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function Cd(n){if(!(n instanceof ae)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class Pd{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function Od(n,e,i,r,o){if(o&&o.global){n("event",i,r);return}else{const c=await e,h=Object.assign(Object.assign({},r),{send_to:c});n("event",i,h)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Dd(){if(Ps())try{await Os()}catch(n){return Y.warn(Z.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return Y.warn(Z.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Nd(n,e,i,r,o,c,h){var p;const y=Rd(n);y.then(N=>{i[N.measurementId]=N.appId,n.options.measurementId&&N.measurementId!==n.options.measurementId&&Y.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${N.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(N=>Y.error(N)),e.push(y);const T=Dd().then(N=>{if(N)return r.getId()}),[A,S]=await Promise.all([y,T]);wd(c)||gd(c,A.measurementId),o("js",new Date);const R=(p=h==null?void 0:h.config)!==null&&p!==void 0?p:{};return R[ld]="firebase",R.update=!0,S!=null&&(R[cd]=S),o("config",A.measurementId,R),A.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ld{constructor(e){this.app=e}_delete(){return delete bt[this.app.options.appId],Promise.resolve()}}let bt={},ys=[];const vs={};let ti="dataLayer",Md="gtag",_s,$o,Is=!1;function Ud(){const n=[];if(Cs()&&n.push("This is a browser extension environment."),Ba()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,o)=>`(${o+1}) ${r}`).join(" "),i=Z.create("invalid-analytics-context",{errorInfo:e});Y.warn(i.message)}}function xd(n,e,i){Ud();const r=n.options.appId;if(!r)throw Z.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)Y.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw Z.create("no-api-key");if(bt[r]!=null)throw Z.create("already-exists",{id:r});if(!Is){md(ti);const{wrappedGtag:c,gtagCore:h}=Id(bt,ys,vs,ti,Md);$o=c,_s=h,Is=!0}return bt[r]=Nd(n,ys,vs,e,_s,ti,i),new Ld(n)}function Fd(n=pi()){n=ue(n);const e=We(n,un);return e.isInitialized()?e.getImmediate():jd(n)}function jd(n,e={}){const i=We(n,un);if(i.isInitialized()){const o=i.getImmediate();if(St(e,i.getOptions()))return o;throw Z.create("already-initialized")}return i.initialize({options:e})}function Bd(n,e,i,r){n=ue(n),Od($o,bt[n.app.options.appId],e,i,r).catch(o=>Y.error(o))}const ws="@firebase/analytics",Ts="0.10.8";function $d(){le(new oe(un,(e,{options:i})=>{const r=e.getProvider("app").getImmediate(),o=e.getProvider("installations-internal").getImmediate();return xd(r,o,i)},"PUBLIC")),le(new oe("analytics-internal",n,"PRIVATE")),te(ws,Ts),te(ws,Ts,"esm2017");function n(e){try{const i=e.getProvider(un).getImmediate();return{logEvent:(r,o,c)=>Bd(i,r,o,c)}}catch(i){throw Z.create("interop-component-reg-failed",{reason:i})}}}$d();const Vd={apiKey:"AIzaSyA3Mq1EgBB3gDzbzBRIB7WAO9UaHK9UV0Y",authDomain:"revision-a7a12.firebaseapp.com",projectId:"revision-a7a12",storageBucket:"revision-a7a12.firebasestorage.app",messagingSenderId:"140539996338",appId:"1:140539996338:web:23dfd4c91dcd6d8d3dc1ab",measurementId:"G-1W275X2WP0"},Li=Ms(Vd),ni=ru(Li);Tu(Li);let Hd=null;if(typeof window<"u")try{Hd=Fd(Li)}catch(n){const e=n instanceof Error?n.message:"Erreur inconnue";console.warn("Analytics non disponible:",e)}function zd(){const n={user:null,loading:!0,error:null},{subscribe:e,set:i,update:r}=Aa(n);return{subscribe:e,init(){Gl(ni,o=>{i({user:o,loading:!1,error:null})})},async signInWithGoogle(){try{i({user:null,loading:!0,error:null});const o=new me,c=await fh(ni,o);return i({user:c.user,loading:!1,error:null}),c.user}catch(o){const c=o instanceof Error?o.message:"Erreur de connexion";throw i({user:null,loading:!1,error:c}),o}},async signOut(){try{r(o=>({...o,loading:!0,error:null})),await ql(ni),i({user:null,loading:!1,error:null})}catch(o){const c=o instanceof Error?o.message:"Erreur de déconnexion";throw r(h=>({...h,loading:!1,error:c})),o}},clearError(){r(o=>({...o,error:null}))}}}const qd=zd(),Kd=ba("goto");export{me as G,qd as a,ni as b,Kd as g,fh as s};
