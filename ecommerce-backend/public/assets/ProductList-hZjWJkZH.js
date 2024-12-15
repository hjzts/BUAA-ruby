import{a as c,d as fe,r as m,c as ye,w as Ce,o as we,b as v,e as a,u as ke,f as r,g as d,h as l,i as p,t as y,j as C,k as _,l as x,F as w,m as $e,n as V,p as T,q as ze,s as xe}from"./index-B0vVrGoP.js";import{d as Se,p as be}from"./product-DW-W9-od.js";import{_ as he}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Pe={async getAllColors(){return(await c.get("/api/v1/colors")).data},async createColor(s){return(await c.post("/api/v1/colors",s)).data},async updateColor(s,o){return(await c.put(`/api/v1/colors/${s}`,o)).data},async deleteColor(s){await c.delete(`/api/v1/colors/${s}`)},async getProductColors(s){return(await c.get(`/api/v1/products/${s}/colors`)).data},async addProductColor(s,o){return(await c.post(`/api/v1/products/${s}/colors`,o)).data},async updateProductColor(s,o,u){return(await c.put(`/api/v1/products/${s}/colors/${o}`,u)).data},async deleteProductColor(s,o){await c.delete(`/api/v1/products/${s}/colors/${o}`)}},De={async getAllSizes(){return(await c.get("/api/v1/sizes")).data},async createSize(s){return(await c.post("/api/v1/sizes",s)).data},async updateSize(s,o){return(await c.put(`/api/v1/sizes/${s}`,o)).data},async deleteSize(s){await c.delete(`/api/v1/sizes/${s}`)},async getProductSizes(s){return(await c.get(`/api/v1/products/${s}/sizes`)).data},async addProductSize(s,o){return(await c.post(`/api/v1/products/${s}/sizes`,o)).data},async updateProductSize(s,o,u){return(await c.put(`/api/v1/products/${s}/sizes/${o}`,u)).data},async deleteProductSize(s,o){await c.delete(`/api/v1/products/${s}/sizes/${o}`)}},Ve={async getAllDesigns(){return(await c.get("/api/v1/designs")).data},async createDesign(s){return(await c.post("/api/v1/designs",s)).data},async updateDesign(s,o){return(await c.put(`/api/v1/designs/${s}`,o)).data},async deleteDesign(s){await c.delete(`/api/v1/designs/${s}`)},async getProductDesigns(s){return(await c.get(`/api/v1/products/${s}/designs`)).data},async addProductDesign(s,o){return(await c.post(`/api/v1/products/${s}/designs`,o)).data},async updateProductDesign(s,o,u){return(await c.put(`/api/v1/products/${s}/designs/${o}`,u)).data},async deleteProductDesign(s,o){await c.delete(`/api/v1/products/${s}/designs/${o}`)}},Re={class:"d-flex flex-wrap gap-2 mt-2"},Ne={class:"d-flex flex-wrap gap-2 mt-2"},Ae={class:"d-flex align-center"},Fe={class:"text-h6"},Ue={class:"color-dots"},Be={key:0,class:"more-colors"},Oe={key:1,class:"color-dot default-color"},je={class:"text-truncate"},Le={class:"mt-2"},Me={key:1,class:"d-flex justify-center align-center",style:{height:"400px"}},Te=fe({__name:"ProductList",setup(s){const o=ke(),u=m(!1),g=m("grid"),R=m(!1),N=m([]),O=m([]),j=m([]),L=m([]),z=m(1),A=m(0),n=m({search:"",priceRange:[0,1e3],selectedColors:[],selectedSizes:[],selectedDesigns:[]}),q=ye(()=>({search:n.value.search,min_price:n.value.priceRange[0],max_price:n.value.priceRange[1],color_ids:n.value.selectedColors.length>0?n.value.selectedColors:void 0,size_ids:n.value.selectedSizes.length>0?n.value.selectedSizes:void 0,design_ids:n.value.selectedDesigns.length>0?n.value.selectedDesigns:void 0})),E=async()=>{try{const[i,e,F]=await Promise.all([Pe.getAllColors(),De.getAllSizes(),Ve.getAllDesigns()]);O.value=i,j.value=e,L.value=F}catch(i){console.error("Failed to fetch filter options:",i)}},S=async()=>{R.value=!0;try{const i=await be.getProducts({page:z.value,...q.value});console.log("response:",i),N.value=i.products.map(e=>({id:Number(e.id),...e.attributes})),A.value=i.meta.total_pages}catch(i){console.error("Failed to fetch products:",i)}finally{R.value=!1}},G=i=>{const e=n.value.selectedColors.indexOf(i);e===-1?n.value.selectedColors.push(i):n.value.selectedColors.splice(e,1)},J=i=>{const e=n.value.selectedSizes.indexOf(i);e===-1?n.value.selectedSizes.push(i):n.value.selectedSizes.splice(e,1)},K=Se(()=>{z.value=1,S()},300),Q=i=>{o.push(`/products/${i}`)};Ce([()=>n.value.priceRange,()=>n.value.selectedColors,()=>n.value.selectedSizes,()=>n.value.selectedDesigns],()=>{z.value=1,S()},{deep:!0}),we(()=>{S(),E()});const W=i=>{var e;return((e=i==null?void 0:i.color)==null?void 0:e.rgb)??"#CCCCCC"},X=i=>{var e;return((e=i==null?void 0:i.size)==null?void 0:e.size_name)??"N/A"};return(i,e)=>{const F=r("v-list-subheader"),b=r("v-list-item-title"),Y=r("v-range-slider"),h=r("v-list-item"),k=r("v-chip"),Z=r("v-select"),H=r("v-list"),I=r("v-navigation-drawer"),ee=r("v-app-bar-nav-icon"),se=r("v-toolbar-title"),M=r("v-spacer"),te=r("v-text-field"),U=r("v-btn"),ae=r("v-btn-group"),le=r("v-app-bar"),P=r("v-col"),oe=r("v-img"),ne=r("v-card-title"),re=r("v-card-subtitle"),ie=r("v-card-text"),ce=r("v-card-actions"),de=r("v-card"),ue=r("v-hover"),pe=r("v-alert"),B=r("v-row"),ve=r("v-progress-circular"),_e=r("v-pagination"),ge=r("v-container");return d(),v(ge,{fluid:""},{default:a(()=>[l(I,{modelValue:u.value,"onUpdate:modelValue":e[2]||(e[2]=t=>u.value=t),location:"left",temporary:"",width:"300"},{default:a(()=>[l(H,null,{default:a(()=>[l(F,null,{default:a(()=>e[8]||(e[8]=[p("Filters")])),_:1}),l(h,null,{default:a(()=>[l(b,null,{default:a(()=>e[9]||(e[9]=[p("Price Range")])),_:1}),l(Y,{modelValue:n.value.priceRange,"onUpdate:modelValue":e[0]||(e[0]=t=>n.value.priceRange=t),max:1e3,step:10,class:"mt-4"},{prepend:a(()=>[p(" $"+y(n.value.priceRange[0]),1)]),append:a(()=>[p(" $"+y(n.value.priceRange[1]),1)]),_:1},8,["modelValue"])]),_:1}),l(h,null,{default:a(()=>[l(b,null,{default:a(()=>e[10]||(e[10]=[p("Colors")])),_:1}),C("div",Re,[(d(!0),_(w,null,x(O.value,t=>(d(),v(k,{key:t.id,color:t.rgb,text:t.description,class:T({selected:n.value.selectedColors.includes(t.id)}),onClick:D=>G(t.id)},null,8,["color","text","class","onClick"]))),128))])]),_:1}),l(h,null,{default:a(()=>[l(b,null,{default:a(()=>e[11]||(e[11]=[p("Sizes")])),_:1}),C("div",Ne,[(d(!0),_(w,null,x(j.value,t=>(d(),v(k,{key:t.id,class:T({selected:n.value.selectedSizes.includes(t.id)}),onClick:D=>J(t.id)},{default:a(()=>[p(y(t.size_name),1)]),_:2},1032,["class","onClick"]))),128))])]),_:1}),l(h,null,{default:a(()=>[l(b,null,{default:a(()=>e[12]||(e[12]=[p("Designs")])),_:1}),l(Z,{modelValue:n.value.selectedDesigns,"onUpdate:modelValue":e[1]||(e[1]=t=>n.value.selectedDesigns=t),items:L.value,"item-title":"design_number","item-value":"id",multiple:"",chips:""},null,8,["modelValue","items"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),l(B,null,{default:a(()=>[l(P,{cols:"12"},{default:a(()=>[l(le,{flat:""},{default:a(()=>[l(ee,{onClick:e[3]||(e[3]=t=>u.value=!u.value)}),l(se,null,{default:a(()=>e[13]||(e[13]=[p("Products")])),_:1}),l(M),l(te,{modelValue:n.value.search,"onUpdate:modelValue":[e[4]||(e[4]=t=>n.value.search=t),$e(K)],"prepend-inner-icon":"mdi-magnify",label:"Search","single-line":"","hide-details":""},null,8,["modelValue","onUpdate:modelValue"]),l(ae,{class:"ml-4"},{default:a(()=>[l(U,{color:g.value==="grid"?"primary":"",icon:"mdi-grid",onClick:e[5]||(e[5]=t=>g.value="grid")},null,8,["color"]),l(U,{color:g.value==="list"?"primary":"",icon:"mdi-view-list",onClick:e[6]||(e[6]=t=>g.value="list")},null,8,["color"])]),_:1})]),_:1})]),_:1}),l(P,{cols:"12"},{default:a(()=>[R.value?(d(),_("div",Me,[l(ve,{indeterminate:"",color:"primary"})])):(d(),v(B,{key:0},{default:a(()=>[N.value.length?(d(!0),_(w,{key:0},x(N.value,t=>(d(),v(P,{key:t.id,cols:g.value==="grid"?12:6,sm:g.value==="grid"?6:4,md:g.value==="grid"?4:3},{default:a(()=>[l(ue,null,{default:a(({isHovering:D,props:me})=>[l(de,ze({ref_for:!0},me,{elevation:D?8:2,class:{"on-hover":D},onClick:$=>Q(t.id)}),{default:a(()=>[l(oe,{src:t.image_url||"/placeholder.png",height:"200",cover:"",class:"align-end"},{default:a(()=>[t.in_stock?V("",!0):(d(),v(k,{key:0,color:"error",class:"ma-2"},{default:a(()=>e[14]||(e[14]=[p(" Out of Stock ")])),_:1}))]),_:2},1032,["src"]),l(ne,null,{default:a(()=>[p(y(t.product_name),1)]),_:2},1024),l(re,null,{default:a(()=>{var $;return[C("div",Ae,[C("span",Fe,"$"+y(t.price),1),l(M),C("div",Ue,[($=t==null?void 0:t.product_colors)!=null&&$.length?(d(),_(w,{key:0},[(d(!0),_(w,null,x(t.product_colors.slice(0,3),f=>(d(),_("span",{key:f==null?void 0:f.id,class:"color-dot",style:xe({backgroundColor:W(f)})},null,4))),128)),t.product_colors.length>3?(d(),_("span",Be," +"+y(t.product_colors.length-3),1)):V("",!0)],64)):(d(),_("span",Oe))])])]}),_:2},1024),l(ie,null,{default:a(()=>{var $;return[C("div",je,y(t.description),1),C("div",Le,[($=t==null?void 0:t.product_sizes)!=null&&$.length?(d(),_(w,{key:0},[(d(!0),_(w,null,x(t.product_sizes.slice(0,3),f=>(d(),v(k,{key:(f==null?void 0:f.id)||i.index,size:"small",class:"mr-1"},{default:a(()=>[p(y(X(f)),1)]),_:2},1024))),128)),t.product_sizes.length>3?(d(),v(k,{key:0,size:"small",class:"mr-1",variant:"outlined"},{default:a(()=>[p(" +"+y(t.product_sizes.length-3),1)]),_:2},1024)):V("",!0)],64)):(d(),v(k,{key:1,size:"small",class:"mr-1",color:"grey-lighten-1"},{default:a(()=>e[15]||(e[15]=[p(" No size available ")])),_:1}))])]}),_:2},1024),l(ce,null,{default:a(()=>[l(U,{color:"primary",variant:"text",block:"",disabled:!t.in_stock},{default:a(()=>e[16]||(e[16]=[p(" View Details ")])),_:2},1032,["disabled"])]),_:2},1024)]),_:2},1040,["elevation","class","onClick"])]),_:2},1024)]),_:2},1032,["cols","sm","md"]))),128)):(d(),v(P,{key:1,cols:"12",class:"text-center"},{default:a(()=>[l(pe,{type:"info",text:"No products found"})]),_:1}))]),_:1})),A.value>1?(d(),v(B,{key:2,justify:"center",class:"mt-4"},{default:a(()=>[l(_e,{modelValue:z.value,"onUpdate:modelValue":[e[7]||(e[7]=t=>z.value=t),S],length:A.value},null,8,["modelValue","length"])]),_:1})):V("",!0)]),_:1})]),_:1})]),_:1})}}}),Je=he(Te,[["__scopeId","data-v-75ca75c9"]]);export{Je as default};