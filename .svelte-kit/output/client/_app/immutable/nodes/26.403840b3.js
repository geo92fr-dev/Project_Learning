import{s as ue,a as k,f as g,A as ve,d as h,c as b,g as j,h as H,B as y,j as x,i as S,x as v,C as ne,z as de,o as fe,l as Z,m as ee,n as he,y as me}from"../chunks/scheduler.8dd50edf.js";import{S as pe,i as _e,t as O,c as ge,a as P,g as je,b as ae,d as oe,m as ie,e as re}from"../chunks/index.af76732a.js";import{e as te,u as xe,d as Ee}from"../chunks/each.6b27af3a.js";import{contentActions as ke}from"../chunks/content.ad934cc6.js";import{M as ce}from"../chunks/MarkdownRenderer.26be611d.js";import{w as be}from"../chunks/index.1e5ee360.js";function se(d,s,t){const a=d.slice();return a[7]=s[t],a}function le(d,s){let t,a,n=s[7].nom+"",r,e,o,E;function $(){return s[6](s[7])}return{key:d,first:null,c(){t=g("button"),a=Z("📖 Test cours: "),r=Z(n),e=k(),this.h()},l(i){t=j(i,"BUTTON",{class:!0});var u=H(t);a=ee(u,"📖 Test cours: "),r=ee(u,n),e=b(u),u.forEach(h),this.h()},h(){x(t,"class","test-btn svelte-159gvuj"),this.first=t},m(i,u){S(i,t,u),v(t,a),v(t,r),v(t,e),o||(E=ne(t,"click",$),o=!0)},p(i,u){s=i,u&2&&n!==(n=s[7].nom+"")&&he(r,n)},d(i){i&&h(t),o=!1,E()}}}function Ce(d){let s,t='<h3 class="svelte-159gvuj">Mode Markdown libre</h3> <p class="svelte-159gvuj">Rendu de contenu Markdown avec table des matières</p>',a,n,r;return n=new ce({props:{content:d[3],showMeta:!0,showToc:!0}}),{c(){s=g("div"),s.innerHTML=t,a=k(),ae(n.$$.fragment),this.h()},l(e){s=j(e,"DIV",{class:!0,"data-svelte-h":!0}),y(s)!=="svelte-1vyxhkw"&&(s.innerHTML=t),a=b(e),oe(n.$$.fragment,e),this.h()},h(){x(s,"class","demo-header svelte-159gvuj")},m(e,o){S(e,s,o),S(e,a,o),ie(n,e,o),r=!0},p:me,i(e){r||(P(n.$$.fragment,e),r=!0)},o(e){O(n.$$.fragment,e),r=!1},d(e){e&&(h(s),h(a)),re(n,e)}}}function Me(d){let s,t='<h3 class="svelte-159gvuj">Mode Cours avec métadonnées</h3> <p class="svelte-159gvuj">Rendu d&#39;un cours complet avec toutes les informations</p>',a,n,r;return n=new ce({props:{course:d[0],showMeta:!0,showToc:!0}}),{c(){s=g("div"),s.innerHTML=t,a=k(),ae(n.$$.fragment),this.h()},l(e){s=j(e,"DIV",{class:!0,"data-svelte-h":!0}),y(s)!=="svelte-na1ej"&&(s.innerHTML=t),a=b(e),oe(n.$$.fragment,e),this.h()},h(){x(s,"class","demo-header svelte-159gvuj")},m(e,o){S(e,s,o),S(e,a,o),ie(n,e,o),r=!0},p(e,o){const E={};o&1&&(E.course=e[0]),n.$set(E)},i(e){r||(P(n.$$.fragment,e),r=!0)},o(e){O(n.$$.fragment,e),r=!1},d(e){e&&(h(s),h(a)),re(n,e)}}}function Te(d){let s,t,a,n='<h1 class="svelte-159gvuj">🧪 Test du composant MarkdownRenderer</h1> <p class="svelte-159gvuj">Validation du rendu Markdown avancé avec table des matières et métadonnées</p>',r,e,o,E="🎛️ Options de test",$,i,u,U="📝 Test Markdown brut",q,m=[],X=new Map,A,C,T,G="🎨 Démonstration",V,p,_,N,w,J='<h2 class="svelte-159gvuj">✨ Fonctionnalités testées</h2> <div class="features-grid svelte-159gvuj"><div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">🔒 Sécurité</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Sanitisation DOMPurify</li> <li class="svelte-159gvuj">✅ Protection XSS</li> <li class="svelte-159gvuj">✅ Tags HTML filtrés</li></ul></div> <div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">📋 Table des matières</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Extraction automatique</li> <li class="svelte-159gvuj">✅ Navigation fluide</li> <li class="svelte-159gvuj">✅ Hiérarchie respectée</li></ul></div> <div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">⚡ Performance</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Cache intelligent</li> <li class="svelte-159gvuj">✅ Temps de traitement</li> <li class="svelte-159gvuj">✅ Rendu optimisé</li></ul></div> <div class="feature-card svelte-159gvuj"><h3 class="svelte-159gvuj">🎨 Interface</h3> <ul class="svelte-159gvuj"><li class="svelte-159gvuj">✅ Design responsive</li> <li class="svelte-159gvuj">✅ Coloration syntaxique</li> <li class="svelte-159gvuj">✅ Métadonnées riches</li></ul></div></div>',L,B,K,D=te(d[1]||[]);const Q=l=>l[7].id;for(let l=0;l<D.length;l+=1){let f=se(d,D,l),c=Q(f);X.set(c,m[l]=le(c,f))}const W=[Me,Ce],M=[];function Y(l,f){return l[0]?0:1}return p=Y(d),_=M[p]=W[p](d),{c(){s=k(),t=g("div"),a=g("header"),a.innerHTML=n,r=k(),e=g("section"),o=g("h2"),o.textContent=E,$=k(),i=g("div"),u=g("button"),u.textContent=U,q=k();for(let l=0;l<m.length;l+=1)m[l].c();A=k(),C=g("section"),T=g("h2"),T.textContent=G,V=k(),_.c(),N=k(),w=g("section"),w.innerHTML=J,this.h()},l(l){ve("svelte-8ipa0z",document.head).forEach(h),s=b(l),t=j(l,"DIV",{class:!0});var c=H(t);a=j(c,"HEADER",{class:!0,"data-svelte-h":!0}),y(a)!=="svelte-jqjcek"&&(a.innerHTML=n),r=b(c),e=j(c,"SECTION",{class:!0});var R=H(e);o=j(R,"H2",{class:!0,"data-svelte-h":!0}),y(o)!=="svelte-1jmi0bt"&&(o.textContent=E),$=b(R),i=j(R,"DIV",{class:!0});var I=H(i);u=j(I,"BUTTON",{class:!0,"data-svelte-h":!0}),y(u)!=="svelte-uy7ib"&&(u.textContent=U),q=b(I);for(let z=0;z<m.length;z+=1)m[z].l(I);I.forEach(h),R.forEach(h),A=b(c),C=j(c,"SECTION",{class:!0});var F=H(C);T=j(F,"H2",{class:!0,"data-svelte-h":!0}),y(T)!=="svelte-41f1gd"&&(T.textContent=G),V=b(F),_.l(F),F.forEach(h),N=b(c),w=j(c,"SECTION",{class:!0,"data-svelte-h":!0}),y(w)!=="svelte-18ccfoa"&&(w.innerHTML=J),c.forEach(h),this.h()},h(){document.title="Test MarkdownRenderer - FunLearning",x(a,"class","svelte-159gvuj"),x(o,"class","svelte-159gvuj"),x(u,"class","test-btn svelte-159gvuj"),x(i,"class","buttons svelte-159gvuj"),x(e,"class","controls svelte-159gvuj"),x(T,"class","svelte-159gvuj"),x(C,"class","demo-section svelte-159gvuj"),x(w,"class","features-section svelte-159gvuj"),x(t,"class","test-page svelte-159gvuj")},m(l,f){S(l,s,f),S(l,t,f),v(t,a),v(t,r),v(t,e),v(e,o),v(e,$),v(e,i),v(i,u),v(i,q);for(let c=0;c<m.length;c+=1)m[c]&&m[c].m(i,null);v(t,A),v(t,C),v(C,T),v(C,V),M[p].m(C,null),v(t,N),v(t,w),L=!0,B||(K=ne(u,"click",d[5]),B=!0)},p(l,[f]){f&18&&(D=te(l[1]||[]),m=xe(m,f,Q,1,l,D,X,i,Ee,le,null,se));let c=p;p=Y(l),p===c?M[p].p(l,f):(je(),O(M[c],1,1,()=>{M[c]=null}),ge(),_=M[p],_?_.p(l,f):(_=M[p]=W[p](l),_.c()),P(_,1),_.m(C,null))},i(l){L||(P(_),L=!0)},o(l){O(_),L=!1},d(l){l&&(h(s),h(t));for(let f=0;f<m.length;f+=1)m[f].d();M[p].d(),B=!1,K()}}}function we(d,s,t){let a,n=be([]);de(d,n,i=>t(1,a=i));let r=null,e=`# Test du MarkdownRenderer 🧪

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
`;fe(()=>{ke.loadMockData()});function o(i){t(0,r=i)}function E(){t(0,r=null)}return[r,a,n,e,o,E,i=>o(i)]}class Re extends pe{constructor(s){super(),_e(this,s,we,Te,ue,{})}}export{Re as component};
