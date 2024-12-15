import{d as K,r as m,o as Q,b,e as o,u as W,f as a,g as i,h as t,j as c,i as s,k as B,l as X,F as Z,t as u,q as H}from"./index-B0vVrGoP.js";import{f as D}from"./favorite-xVBpMoC3.js";import{c as ee}from"./cart-DAnYCAh8.js";import{f as te}from"./format-BzRktsyD.js";import{_ as oe}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./api-D7B8soog.js";const re={class:"d-flex align-center mb-6"},ae={class:"favorite-time"},le={class:"d-flex align-center"},se={class:"text-primary text-h6"},ne={key:1,class:"d-flex justify-center align-center",style:{"min-height":"400px"}},ce=K({__name:"FavoritesView",setup(de){const R=W(),p=m(!1),k=m(!1),n=m([]),v=m(!1),_=m(null),C=async()=>{p.value=!0;try{const l=await D.getFavorites();n.value=l.data.map(e=>({...e,showAddedSnackbar:!1})),console.log("favorites: ",n.value),console.log("favorites length : ",n.value.length)}catch(l){console.error("Failed to fetch favorites:",l)}finally{p.value=!1}},M=l=>te(new Date(l),"MMM d, yyyy"),T=l=>{R.push(`/products/${l}`)},j=async l=>{try{await ee.addToCart(l.id,1);const e=n.value.find(f=>f.product.id===l.id);e&&(e.showAddedSnackbar=!0)}catch(e){console.error("Failed to add to cart:",e)}},N=l=>{_.value=l,v.value=!0},P=async()=>{if(_.value){k.value=!0;try{await D.removeFavorite(_.value.id),n.value=n.value.filter(l=>{var e;return l.id!==((e=_.value)==null?void 0:e.id)}),v.value=!1}catch(l){console.error("Failed to remove favorite:",l)}finally{k.value=!1}}};return Q(()=>{C()}),(l,e)=>{const f=a("v-icon"),g=a("v-spacer"),d=a("v-btn"),x=a("v-col"),h=a("v-row"),F=a("v-progress-circular"),V=a("v-chip"),U=a("v-img"),S=a("v-card-title"),E=a("v-card-subtitle"),I=a("v-card-item"),A=a("v-card-text"),L=a("v-divider"),z=a("v-card-actions"),q=a("v-snackbar"),w=a("v-card"),O=a("v-hover"),Y=a("v-dialog"),G=a("v-container");return i(),b(G,null,{default:o(()=>[t(h,null,{default:o(()=>[t(x,{cols:"12"},{default:o(()=>[c("div",re,[t(f,{icon:"mdi-heart",color:"error",size:"x-large",class:"me-3"}),e[3]||(e[3]=c("h1",{class:"text-h4 mb-0"},"我的收藏",-1)),t(g),t(d,{"prepend-icon":"mdi-refresh",onClick:C,loading:p.value},{default:o(()=>e[2]||(e[2]=[s(" Refresh ")])),_:1},8,["loading"])])]),_:1})]),_:1}),p.value?(i(),B("div",ne,[t(F,{indeterminate:"",size:"64",color:"primary"})])):(i(),b(h,{key:0},{default:o(()=>[n.value.length?(i(!0),B(Z,{key:0},X(n.value,r=>(i(),b(x,{key:r.id,cols:"12",sm:"6",md:"4",lg:"3"},{default:o(()=>[t(O,null,{default:o(({isHovering:$,props:J})=>[t(w,H({ref_for:!0},J,{elevation:$?8:2,class:["h-100 favorite-card",{"on-hover":$}]}),{default:o(()=>[t(U,{src:r.attributes.product.image_url||"/placeholder.png","aspect-ratio":1,cover:"",class:"bg-grey-lighten-2",onClick:y=>T(r.attributes.product.id)},{placeholder:o(()=>[t(h,{class:"fill-height ma-0",align:"center",justify:"center"},{default:o(()=>[t(F,{indeterminate:"",color:"grey-lighten-5"})]),_:1})]),default:o(()=>[c("div",ae,[t(V,{size:"small",color:"white",variant:"flat"},{default:o(()=>[s(" Added "+u(M(r.attributes.added_at)),1)]),_:2},1024)])]),_:2},1032,["src","onClick"]),t(I,null,{default:o(()=>[t(S,{class:"text-subtitle-1 mb-1"},{default:o(()=>[s(u(r.attributes.product.product_name),1)]),_:2},1024),t(E,null,{default:o(()=>[c("div",le,[c("span",se,"$"+u(r.attributes.product.price),1),t(g),t(V,{color:r.attributes.product.in_stock?"success":"error",size:"small"},{default:o(()=>[s(u(r.attributes.product.in_stock?"In Stock":"Out of Stock"),1)]),_:2},1032,["color"])])]),_:2},1024)]),_:2},1024),t(A,{class:"text-truncate"},{default:o(()=>[s(u(r.attributes.product.description),1)]),_:2},1024),t(L),t(z,null,{default:o(()=>[t(d,{variant:"text",color:"primary","prepend-icon":"mdi-cart",disabled:!r.attributes.product.in_stock,onClick:y=>j(r.attributes.product)},{default:o(()=>e[4]||(e[4]=[s(" Add to Cart ")])),_:2},1032,["disabled","onClick"]),t(g),t(d,{variant:"text",color:"error",icon:"mdi-heart-off",onClick:y=>N(r)},null,8,["onClick"])]),_:2},1024),t(q,{modelValue:r.showAddedSnackbar,"onUpdate:modelValue":y=>r.showAddedSnackbar=y,timeout:2e3,color:"success",location:"top"},{default:o(()=>e[5]||(e[5]=[s(" Added to cart successfully! ")])),_:2},1032,["modelValue","onUpdate:modelValue"])]),_:2},1040,["elevation","class"])]),_:2},1024)]),_:2},1024))),128)):(i(),b(x,{key:1,cols:"12"},{default:o(()=>[t(w,{class:"text-center pa-12"},{default:o(()=>[t(f,{icon:"mdi-heart-outline",size:"100",color:"grey-lighten-1",class:"mb-4"}),e[7]||(e[7]=c("h3",{class:"text-h5 mb-2"},"Your Favorites List is Empty",-1)),e[8]||(e[8]=c("p",{class:"text-body-1 mb-6"},"Start exploring our products and save your favorites!",-1)),t(d,{color:"primary",size:"large",to:"/products","prepend-icon":"mdi-shopping"},{default:o(()=>e[6]||(e[6]=[s(" Browse Products ")])),_:1})]),_:1})]),_:1}))]),_:1})),t(Y,{modelValue:v.value,"onUpdate:modelValue":e[1]||(e[1]=r=>v.value=r),"max-width":"400"},{default:o(()=>[t(w,null,{default:o(()=>[t(S,{class:"text-h5"},{default:o(()=>e[9]||(e[9]=[s(" Remove from Favorites? ")])),_:1}),t(A,null,{default:o(()=>{var r;return[e[10]||(e[10]=s(" Are you sure you want to remove ")),c("strong",null,u((r=_.value)==null?void 0:r.product.product_name),1),e[11]||(e[11]=s(" from your favorites? "))]}),_:1}),t(z,null,{default:o(()=>[t(g),t(d,{color:"grey-darken-1",variant:"text",onClick:e[0]||(e[0]=r=>v.value=!1)},{default:o(()=>e[12]||(e[12]=[s(" Cancel ")])),_:1}),t(d,{color:"error",variant:"text",loading:k.value,onClick:P},{default:o(()=>e[13]||(e[13]=[s(" Remove ")])),_:1},8,["loading"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1})}}}),fe=oe(ce,[["__scopeId","data-v-bded1f16"]]);export{fe as default};
