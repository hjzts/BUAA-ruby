import{z as h,A as be,a as j}from"./index-B0vVrGoP.js";var R,z;function ae(){if(z)return R;z=1;function e(r){var n=typeof r;return r!=null&&(n=="object"||n=="function")}return R=e,R}var x,H;function me(){if(H)return x;H=1;var e=typeof h=="object"&&h&&h.Object===Object&&h;return x=e,x}var w,X;function oe(){if(X)return w;X=1;var e=me(),r=typeof self=="object"&&self&&self.Object===Object&&self,n=e||r||Function("return this")();return w=n,w}var E,J;function ve(){if(J)return E;J=1;var e=oe(),r=function(){return e.Date.now()};return E=r,E}var k,K;function le(){if(K)return k;K=1;var e=/\s/;function r(n){for(var i=n.length;i--&&e.test(n.charAt(i)););return i}return k=r,k}var G,Q;function ge(){if(Q)return G;Q=1;var e=le(),r=/^\s+/;function n(i){return i&&i.slice(0,e(i)+1).replace(r,"")}return G=n,G}var N,V;function ue(){if(V)return N;V=1;var e=oe(),r=e.Symbol;return N=r,N}var P,Y;function pe(){if(Y)return P;Y=1;var e=ue(),r=Object.prototype,n=r.hasOwnProperty,i=r.toString,o=e?e.toStringTag:void 0;function m(u){var s=n.call(u,o),c=u[o];try{u[o]=void 0;var t=!0}catch{}var f=i.call(u);return t&&(s?u[o]=c:delete u[o]),f}return P=m,P}var L,Z;function Te(){if(Z)return L;Z=1;var e=Object.prototype,r=e.toString;function n(i){return r.call(i)}return L=n,L}var W,ee;function ye(){if(ee)return W;ee=1;var e=ue(),r=pe(),n=Te(),i="[object Null]",o="[object Undefined]",m=e?e.toStringTag:void 0;function u(s){return s==null?s===void 0?o:i:m&&m in Object(s)?r(s):n(s)}return W=u,W}var $,re;function je(){if(re)return $;re=1;function e(r){return r!=null&&typeof r=="object"}return $=e,$}var A,te;function Se(){if(te)return A;te=1;var e=ye(),r=je(),n="[object Symbol]";function i(o){return typeof o=="symbol"||r(o)&&e(o)==n}return A=i,A}var C,ne;function _e(){if(ne)return C;ne=1;var e=ge(),r=ae(),n=Se(),i=NaN,o=/^[-+]0x[0-9a-f]+$/i,m=/^0b[01]+$/i,u=/^0o[0-7]+$/i,s=parseInt;function c(t){if(typeof t=="number")return t;if(n(t))return i;if(r(t)){var f=typeof t.valueOf=="function"?t.valueOf():t;t=r(f)?f+"":f}if(typeof t!="string")return t===0?t:+t;t=e(t);var b=m.test(t);return b||u.test(t)?s(t.slice(2),b?2:8):o.test(t)?i:+t}return C=c,C}var D,ie;function he(){if(ie)return D;ie=1;var e=ae(),r=ve(),n=_e(),i="Expected a function",o=Math.max,m=Math.min;function u(s,c,t){var f,b,S,g,d,l,p=0,F=!1,T=!1,q=!0;if(typeof s!="function")throw new TypeError(i);c=n(c)||0,e(t)&&(F=!!t.leading,T="maxWait"in t,S=T?o(n(t.maxWait)||0,c):S,q="trailing"in t?!!t.trailing:q);function O(a){var v=f,y=b;return f=b=void 0,p=a,g=s.apply(y,v),g}function se(a){return p=a,d=setTimeout(_,c),F?O(a):g}function ce(a){var v=a-l,y=a-p,U=c-v;return T?m(U,S-y):U}function M(a){var v=a-l,y=a-p;return l===void 0||v>=c||v<0||T&&y>=S}function _(){var a=r();if(M(a))return B(a);d=setTimeout(_,ce(a))}function B(a){return d=void 0,q&&f?O(a):(f=b=void 0,g)}function fe(){d!==void 0&&clearTimeout(d),p=0,f=l=b=d=void 0}function de(){return d===void 0?g:B(r())}function I(){var a=r(),v=M(a);if(f=arguments,b=this,l=a,v){if(d===void 0)return se(l);if(T)return clearTimeout(d),d=setTimeout(_,c),O(l)}return d===void 0&&(d=setTimeout(_,c)),g}return I.cancel=fe,I.flush=de,I}return D=u,D}var qe=he();const Ie=be(qe),Re={async getProducts(e={}){return(await j.get("/api/v1/products",{params:e})).data},async getProduct(e){return(await j.get(`/api/v1/products/${e}`)).data},async createProduct(e){return(await j.post("/api/v1/admin/products",e)).data},async updateProduct(e,r){return(await j.put(`/api/v1/admin/products/${e}`,r)).data},async deleteProduct(e){await j.delete(`/api/v1/admin/products/${e}`)}};export{Ie as d,Re as p};
