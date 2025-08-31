import{s as fe,f as p,a as y,H as we,g,h as b,c as z,E as Me,d as f,j as _,I as ae,i as S,x as u,y as se,B as q,l as C,m as H,C as le,n as R,A as Ce,z as He,o as ye}from"../chunks/scheduler.02e0ea0e.js";import{S as me,i as _e,t as Z,c as ze,a as $,g as Ie,b as pe,d as ge,m as Ee,e as ke}from"../chunks/index.ee037b30.js";import{e as ee,u as be,d as je}from"../chunks/each.4470a8e9.js";import{c as Se}from"../chunks/content.d1a5111c.js";import{p as De,e as ie,a as oe,m as Le}from"../chunks/content.15b954d1.js";import{w as Ve}from"../chunks/index.3731fc92.js";function re(c,e,t){const n=c.slice();return n[10]=e[t],n}function ce(c){let e,t;function n(s,r){return s[1]?Pe:xe}let i=n(c),a=i(c);return{c(){e=p("div"),t=p("div"),a.c(),this.h()},l(s){e=g(s,"DIV",{class:!0});var r=b(e);t=g(r,"DIV",{class:!0});var v=b(t);a.l(v),v.forEach(f),r.forEach(f),this.h()},h(){_(t,"class","meta-info"),_(e,"class","content-meta svelte-zh4hvu")},m(s,r){S(s,e,r),u(e,t),a.m(t,null)},p(s,r){i===(i=n(s))&&a?a.p(s,r):(a.d(1),a=i(s),a&&(a.c(),a.m(t,null)))},d(s){s&&f(e),a.d()}}}function xe(c){let e,t,n,i,a,s,r,v,h=c[7].toFixed(2)+"",l,o;return{c(){e=p("div"),t=p("span"),n=C("📚 "),i=C(c[5]),a=C(" min de lecture"),s=y(),r=p("span"),v=C("⚡ "),l=C(h),o=C("ms"),this.h()},l(d){e=g(d,"DIV",{class:!0});var m=b(e);t=g(m,"SPAN",{class:!0});var k=b(t);n=H(k,"📚 "),i=H(k,c[5]),a=H(k," min de lecture"),k.forEach(f),s=z(m),r=g(m,"SPAN",{class:!0});var I=b(r);v=H(I,"⚡ "),l=H(I,h),o=H(I,"ms"),I.forEach(f),m.forEach(f),this.h()},h(){_(t,"class","meta-tag reading svelte-zh4hvu"),_(r,"class","meta-tag processing svelte-zh4hvu"),_(e,"class","meta-tags svelte-zh4hvu")},m(d,m){S(d,e,m),u(e,t),u(t,n),u(t,i),u(t,a),u(e,s),u(e,r),u(r,v),u(r,l),u(r,o)},p(d,m){m&32&&R(i,d[5]),m&128&&h!==(h=d[7].toFixed(2)+"")&&R(l,h)},d(d){d&&f(e)}}}function Pe(c){let e,t=c[1].titre+"",n,i,a,s=c[1].description+"",r,v,h,l,o,d=c[1].type+"",m,k,I,B,V=c[1].dureeEstimee+"",x,J,U,T,D,N,P;return{c(){e=p("h2"),n=C(t),i=y(),a=p("p"),r=C(s),v=y(),h=p("div"),l=p("span"),o=C("📖 "),m=C(d),k=y(),I=p("span"),B=C("⏱️ "),x=C(V),J=C(" min"),U=y(),T=p("span"),D=C("📚 "),N=C(c[5]),P=C(" min de lecture"),this.h()},l(j){e=g(j,"H2",{class:!0});var M=b(e);n=H(M,t),M.forEach(f),i=z(j),a=g(j,"P",{class:!0});var K=b(a);r=H(K,s),K.forEach(f),v=z(j),h=g(j,"DIV",{class:!0});var A=b(h);l=g(A,"SPAN",{class:!0});var F=b(l);o=H(F,"📖 "),m=H(F,d),F.forEach(f),k=z(A),I=g(A,"SPAN",{class:!0});var X=b(I);B=H(X,"⏱️ "),x=H(X,V),J=H(X," min"),X.forEach(f),U=z(A),T=g(A,"SPAN",{class:!0});var G=b(T);D=H(G,"📚 "),N=H(G,c[5]),P=H(G," min de lecture"),G.forEach(f),A.forEach(f),this.h()},h(){_(e,"class","content-title svelte-zh4hvu"),_(a,"class","content-description svelte-zh4hvu"),_(l,"class","meta-tag type svelte-zh4hvu"),_(I,"class","meta-tag duration svelte-zh4hvu"),_(T,"class","meta-tag reading svelte-zh4hvu"),_(h,"class","meta-tags svelte-zh4hvu")},m(j,M){S(j,e,M),u(e,n),S(j,i,M),S(j,a,M),u(a,r),S(j,v,M),S(j,h,M),u(h,l),u(l,o),u(l,m),u(h,k),u(h,I),u(I,B),u(I,x),u(I,J),u(h,U),u(h,T),u(T,D),u(T,N),u(T,P)},p(j,M){M&2&&t!==(t=j[1].titre+"")&&R(n,t),M&2&&s!==(s=j[1].description+"")&&R(r,s),M&2&&d!==(d=j[1].type+"")&&R(m,d),M&2&&V!==(V=j[1].dureeEstimee+"")&&R(x,V),M&32&&R(N,j[5])},d(j){j&&(f(e),f(i),f(a),f(v),f(h))}}}function ue(c){let e,t,n="📋 Table des matières",i,a,s=[],r=new Map,v=ee(c[6]);const h=l=>l[10].id;for(let l=0;l<v.length;l+=1){let o=re(c,v,l),d=h(o);r.set(d,s[l]=ve(d,o))}return{c(){e=p("nav"),t=p("h3"),t.textContent=n,i=y(),a=p("ul");for(let l=0;l<s.length;l+=1)s[l].c();this.h()},l(l){e=g(l,"NAV",{class:!0});var o=b(e);t=g(o,"H3",{class:!0,"data-svelte-h":!0}),q(t)!=="svelte-1l3xw6v"&&(t.textContent=n),i=z(o),a=g(o,"UL",{class:!0});var d=b(a);for(let m=0;m<s.length;m+=1)s[m].l(d);d.forEach(f),o.forEach(f),this.h()},h(){_(t,"class","svelte-zh4hvu"),_(a,"class","toc-list svelte-zh4hvu"),_(e,"class","table-of-contents svelte-zh4hvu")},m(l,o){S(l,e,o),u(e,t),u(e,i),u(e,a);for(let d=0;d<s.length;d+=1)s[d]&&s[d].m(a,null)},p(l,o){o&64&&(v=ee(l[6]),s=be(s,o,h,1,l,v,r,a,je,ve,null,re))},d(l){l&&f(e);for(let o=0;o<s.length;o+=1)s[o].d()}}}function ve(c,e){let t,n,i=e[10].text+"",a,s,r,v,h;function l(){return e[9](e[10])}return{key:c,first:null,c(){t=p("li"),n=p("button"),a=C(i),s=y(),this.h()},l(o){t=g(o,"LI",{class:!0});var d=b(t);n=g(d,"BUTTON",{class:!0});var m=b(n);a=H(m,i),m.forEach(f),s=z(d),d.forEach(f),this.h()},h(){_(n,"class","toc-link svelte-zh4hvu"),_(t,"class",r="toc-item level-"+e[10].level+" svelte-zh4hvu"),this.first=t},m(o,d){S(o,t,d),u(t,n),u(n,a),u(t,s),v||(h=le(n,"click",l),v=!0)},p(o,d){e=o,d&64&&i!==(i=e[10].text+"")&&R(a,i),d&64&&r!==(r="toc-item level-"+e[10].level+" svelte-zh4hvu")&&_(t,"class",r)},d(o){o&&f(t),v=!1,h()}}}function Ae(c){let e,t,n,i,a,s,r,v=c[2]&&(c[1]||c[0])&&ce(c),h=c[3]&&c[6].length>0&&ue(c);return{c(){e=p("div"),v&&v.c(),t=y(),n=p("div"),h&&h.c(),i=y(),a=p("div"),s=p("article"),r=new we(!1),this.h()},l(l){e=g(l,"DIV",{class:!0});var o=b(e);v&&v.l(o),t=z(o),n=g(o,"DIV",{class:!0});var d=b(n);h&&h.l(d),i=z(d),a=g(d,"DIV",{class:!0});var m=b(a);s=g(m,"ARTICLE",{class:!0});var k=b(s);r=Me(k,!1),k.forEach(f),m.forEach(f),d.forEach(f),o.forEach(f),this.h()},h(){r.a=null,_(s,"class","rendered-content svelte-zh4hvu"),_(a,"class","content-body svelte-zh4hvu"),ae(a,"with-toc",c[3]&&c[6].length>0),_(n,"class","content-layout svelte-zh4hvu"),_(e,"class","markdown-renderer svelte-zh4hvu")},m(l,o){S(l,e,o),v&&v.m(e,null),u(e,t),u(e,n),h&&h.m(n,null),u(n,i),u(n,a),u(a,s),r.m(c[4],s)},p(l,[o]){l[2]&&(l[1]||l[0])?v?v.p(l,o):(v=ce(l),v.c(),v.m(e,t)):v&&(v.d(1),v=null),l[3]&&l[6].length>0?h?h.p(l,o):(h=ue(l),h.c(),h.m(n,i)):h&&(h.d(1),h=null),o&16&&r.p(l[4]),o&72&&ae(a,"with-toc",l[3]&&l[6].length>0)},i:se,o:se,d(l){l&&f(e),v&&v.d(),h&&h.d()}}}function Re(c){const e=document.getElementById(c);e&&e.scrollIntoView({behavior:"smooth"})}function Ne(c,e,t){let{content:n=""}=e,{course:i=null}=e;const a={allowHtml:!1,highlight:!0,headingIds:!0,breaks:!0,enableCodeHighlight:!0,enableMath:!1,sanitizeHtml:!0};let{showMeta:s=!1}=e,{showToc:r=!1}=e,v="",h=0,l=[],o=0;const d=m=>Re(m.id);return c.$$set=m=>{"content"in m&&t(0,n=m.content),"course"in m&&t(1,i=m.course),"showMeta"in m&&t(2,s=m.showMeta),"showToc"in m&&t(3,r=m.showToc)},c.$$.update=()=>{if(c.$$.dirty&3){const m=performance.now();if(i){const I=De(i);t(4,v=I.contenuHtml||""),t(5,h=ie(i.contenuMarkdown)),t(6,l=oe(i.contenuMarkdown))}else n&&(t(4,v=Le(n)),t(5,h=ie(n)),t(6,l=oe(n)));const k=performance.now();t(7,o=k-m)}},[n,i,s,r,v,h,l,o,a,d]}class Te extends me{constructor(e){super(),_e(this,e,Ne,Ae,fe,{content:0,course:1,options:8,showMeta:2,showToc:3})}get options(){return this.$$.ctx[8]}}function he(c,e,t){const n=c.slice();return n[7]=e[t],n}function de(c,e){let t,n,i=e[7].nom+"",a,s,r,v;function h(){return e[6](e[7])}return{key:c,first:null,c(){t=p("button"),n=C("📖 Test cours: "),a=C(i),s=y(),this.h()},l(l){t=g(l,"BUTTON",{class:!0});var o=b(t);n=H(o,"📖 Test cours: "),a=H(o,i),s=z(o),o.forEach(f),this.h()},h(){_(t,"class","test-btn svelte-159gvuj"),this.first=t},m(l,o){S(l,t,o),u(t,n),u(t,a),u(t,s),r||(v=le(t,"click",h),r=!0)},p(l,o){e=l,o&2&&i!==(i=e[7].nom+"")&&R(a,i)},d(l){l&&f(t),r=!1,v()}}}function Fe(c){let e,t='<h3 class="svelte-159gvuj">Mode Markdown libre</h3> <p class="svelte-159gvuj">Rendu de contenu Markdown avec table des matières</p>',n,i,a;return i=new Te({props:{content:c[3],showMeta:!0,showToc:!0}}),{c(){e=p("div"),e.innerHTML=t,n=y(),pe(i.$$.fragment),this.h()},l(s){e=g(s,"DIV",{class:!0,"data-svelte-h":!0}),q(e)!=="svelte-1vyxhkw"&&(e.innerHTML=t),n=z(s),ge(i.$$.fragment,s),this.h()},h(){_(e,"class","demo-header svelte-159gvuj")},m(s,r){S(s,e,r),S(s,n,r),Ee(i,s,r),a=!0},p:se,i(s){a||($(i.$$.fragment,s),a=!0)},o(s){Z(i.$$.fragment,s),a=!1},d(s){s&&(f(e),f(n)),ke(i,s)}}}function Oe(c){let e,t='<h3 class="svelte-159gvuj">Mode Cours avec métadonnées</h3> <p class="svelte-159gvuj">Rendu d&#39;un cours complet avec toutes les informations</p>',n,i,a;return i=new Te({props:{course:c[0],showMeta:!0,showToc:!0}}),{c(){e=p("div"),e.innerHTML=t,n=y(),pe(i.$$.fragment),this.h()},l(s){e=g(s,"DIV",{class:!0,"data-svelte-h":!0}),q(e)!=="svelte-na1ej"&&(e.innerHTML=t),n=z(s),ge(i.$$.fragment,s),this.h()},h(){_(e,"class","demo-header svelte-159gvuj")},m(s,r){S(s,e,r),S(s,n,r),Ee(i,s,r),a=!0},p(s,r){const v={};r&1&&(v.course=s[0]),i.$set(v)},i(s){a||($(i.$$.fragment,s),a=!0)},o(s){Z(i.$$.fragment,s),a=!1},d(s){s&&(f(e),f(n)),ke(i,s)}}}function qe(c){let e,t,n,i='<h1 class="svelte-159gvuj">🧪 Test du composant MarkdownRenderer</h1> <p class="svelte-159gvuj">Validation du rendu Markdown avancé avec table des matières et métadonnées</p>',a,s,r,v="🎛️ Options de test",h,l,o,d="📝 Test Markdown brut",m,k=[],I=new Map,B,V,x,J="🎨 Démonstration",U,T,D,N,P,j='<h2 class="svelte-159gvuj">✨ Fonctionnalités testées</h2> <div class="features-grid svelte-159gvuj"><div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">🔒 Sécurité</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Sanitisation DOMPurify</li> <li class="svelte-159gvuj">✅ Protection XSS</li> <li class="svelte-159gvuj">✅ Tags HTML filtrés</li></ul></div> <div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">📋 Table des matières</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Extraction automatique</li> <li class="svelte-159gvuj">✅ Navigation fluide</li> <li class="svelte-159gvuj">✅ Hiérarchie respectée</li></ul></div> <div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">⚡ Performance</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Cache intelligent</li> <li class="svelte-159gvuj">✅ Temps de traitement</li> <li class="svelte-159gvuj">✅ Rendu optimisé</li></ul></div> <div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">🎨 Interface</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Design responsive</li> <li class="svelte-159gvuj">✅ Coloration syntaxique</li> <li class="svelte-159gvuj">✅ Métadonnées riches</li></ul></div></div>',M,K,A,F=ee(c[1]||[]);const X=E=>E[7].id;for(let E=0;E<F.length;E+=1){let L=he(c,F,E),w=X(L);I.set(w,k[E]=de(w,L))}const G=[Oe,Fe],O=[];function ne(E,L){return E[0]?0:1}return T=ne(c),D=O[T]=G[T](c),{c(){e=y(),t=p("div"),n=p("header"),n.innerHTML=i,a=y(),s=p("section"),r=p("h2"),r.textContent=v,h=y(),l=p("div"),o=p("button"),o.textContent=d,m=y();for(let E=0;E<k.length;E+=1)k[E].c();B=y(),V=p("section"),x=p("h2"),x.textContent=J,U=y(),D.c(),N=y(),P=p("section"),P.innerHTML=j,this.h()},l(E){Ce("svelte-8ipa0z",document.head).forEach(f),e=z(E),t=g(E,"DIV",{class:!0});var w=b(t);n=g(w,"HEADER",{class:!0,"data-svelte-h":!0}),q(n)!=="svelte-jqjcek"&&(n.innerHTML=i),a=z(w),s=g(w,"SECTION",{class:!0});var Q=b(s);r=g(Q,"H2",{class:!0,"data-svelte-h":!0}),q(r)!=="svelte-1jmi0bt"&&(r.textContent=v),h=z(Q),l=g(Q,"DIV",{class:!0});var W=b(l);o=g(W,"BUTTON",{class:!0,"data-svelte-h":!0}),q(o)!=="svelte-uy7ib"&&(o.textContent=d),m=z(W);for(let te=0;te<k.length;te+=1)k[te].l(W);W.forEach(f),Q.forEach(f),B=z(w),V=g(w,"SECTION",{class:!0});var Y=b(V);x=g(Y,"H2",{class:!0,"data-svelte-h":!0}),q(x)!=="svelte-41f1gd"&&(x.textContent=J),U=z(Y),D.l(Y),Y.forEach(f),N=z(w),P=g(w,"SECTION",{class:!0,"data-svelte-h":!0}),q(P)!=="svelte-18ccfoa"&&(P.innerHTML=j),w.forEach(f),this.h()},h(){document.title="Test MarkdownRenderer - FunLearning",_(n,"class","svelte-159gvuj"),_(r,"class","svelte-159gvuj"),_(o,"class","test-btn svelte-159gvuj"),_(l,"class","buttons svelte-159gvuj"),_(s,"class","controls svelte-159gvuj"),_(x,"class","svelte-159gvuj"),_(V,"class","demo-section svelte-159gvuj"),_(P,"class","features-section svelte-159gvuj"),_(t,"class","test-page svelte-159gvuj")},m(E,L){S(E,e,L),S(E,t,L),u(t,n),u(t,a),u(t,s),u(s,r),u(s,h),u(s,l),u(l,o),u(l,m);for(let w=0;w<k.length;w+=1)k[w]&&k[w].m(l,null);u(t,B),u(t,V),u(V,x),u(V,U),O[T].m(V,null),u(t,N),u(t,P),M=!0,K||(A=le(o,"click",c[5]),K=!0)},p(E,[L]){L&18&&(F=ee(E[1]||[]),k=be(k,L,X,1,E,F,I,l,je,de,null,he));let w=T;T=ne(E),T===w?O[T].p(E,L):(Ie(),Z(O[w],1,1,()=>{O[w]=null}),ze(),D=O[T],D?D.p(E,L):(D=O[T]=G[T](E),D.c()),$(D,1),D.m(V,null))},i(E){M||($(D),M=!0)},o(E){Z(D),M=!1},d(E){E&&(f(e),f(t));for(let L=0;L<k.length;L+=1)k[L].d();O[T].d(),K=!1,A()}}}function Be(c,e,t){let n,i=Ve([]);He(c,i,l=>t(1,n=l));let a=null,s=`# Test du MarkdownRenderer 🧪

## Introduction

Ce composant permet de **rendre du Markdown** de manière sécurisée avec des fonctionnalités avancées.

## Fonctionnalités

### 🔒 Sécurité
- Sanitisation HTML avec DOMPurify
- Protection contre les attaques XSS
- Validation du contenu

### ⚡ Performance
- Cache intelligent
- Rendu optimisé
- Temps de traitement affiché

### 🎨 Interface
- Table des matières automatique
- Métadonnées du contenu
- Design responsive

## Exemples de code

Voici un exemple en JavaScript :

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

Et en Python :

\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))  # 120
\`\`\`

## Liste de tâches

- [x] Composant créé
- [x] Sécurité implémentée  
- [x] Cache fonctionnel
- [ ] Tests unitaires
- [ ] Documentation complète

## Citation

> "Le code est plus souvent lu qu'écrit" - Guido van Rossum

## Tableau de comparaison

| Fonctionnalité | Avant | Maintenant |
|----------------|-------|------------|
| Sécurité | ❌ | ✅ |
| Cache | ❌ | ✅ |
| TOC | ❌ | ✅ |
| Performance | 🟡 | ✅ |

## Conclusion

Le composant MarkdownRenderer est maintenant **opérationnel** ! 🎉
`;ye(()=>{Se.loadMockData()});function r(l){t(0,a=l)}function v(){t(0,a=null)}return[a,n,i,s,r,v,l=>r(l)]}class We extends me{constructor(e){super(),_e(this,e,Be,qe,fe,{})}}export{We as component};
