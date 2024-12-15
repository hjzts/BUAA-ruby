import{p as I}from"./product-CVo1VQMq.js";import{c as w}from"./cart-DAnYCAh8.js";import{o as g}from"./order-CEDnoQ5w.js";import{f as V}from"./favorite-xVBpMoC3.js";import{d as q,r as f,b as E,e as t,f as u,g as H,j as O,h as e,i as s,t as K}from"./index-B0vVrGoP.js";import{_ as M}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./api-D7B8soog.js";const W={class:"response-box"},X=q({__name:"TestAPI",setup(Y){const P=f(null),m=f(""),p=f(""),v=f(""),d=f(""),_=f(""),r=l=>{P.value=JSON.stringify(l,null,2)},x=()=>{P.value=null},N=async()=>{try{const l=await I.getProducts({page:1,per_page:10});r(l)}catch(l){r(l)}},A=async()=>{if(m.value)try{const l=await I.getProduct(Number(m.value));r(l)}catch(l){r(l)}},D=async()=>{try{const l=await w.getCartItems();r(l)}catch(l){r(l)}},T=async()=>{if(!(!p.value||!v.value))try{const l=await w.addToCart(Number(p.value),Number(v.value));r(l)}catch(l){r(l)}},F=async()=>{try{await w.clearCart(),r({message:"Cart cleared successfully"})}catch(l){r(l)}},S=async()=>{try{const l=await g.getOrders();r(l)}catch(l){r(l)}},G=async()=>{try{const l=await g.createOrder({recipient_name:"admin",shipping_address:"Test Address",phone_number:"1234567890",postal_code:"12345"});r(l)}catch(l){r(l)}},U=async()=>{if(d.value)try{const l=await g.payOrder(Number(d.value));r(l)}catch(l){r(l)}},B=async()=>{if(d.value)try{const l=await g.confirmDelivery(Number(d.value));r(l)}catch(l){r(l)}},L=async()=>{if(d.value)try{const l=await g.cancelOrder(Number(d.value),"Test cancellation");r(l)}catch(l){r(l)}},R=async()=>{try{const l=await V.getFavorites();r(l)}catch(l){r(l)}},Q=async()=>{if(_.value)try{const l=await V.addFavorite(Number(_.value));r(l)}catch(l){r(l)}};return(l,o)=>{const j=u("v-spacer"),n=u("v-btn"),b=u("v-card-title"),y=u("v-card-text"),C=u("v-card"),a=u("v-col"),i=u("v-row"),k=u("v-text-field"),z=u("v-btn-group"),J=u("v-container");return H(),E(J,null,{default:t(()=>[o[22]||(o[22]=O("h1",{class:"text-h4 mb-6"},"API Testing Page",-1)),e(i,{class:"mb-6"},{default:t(()=>[e(a,{cols:"12"},{default:t(()=>[e(C,null,{default:t(()=>[e(b,{class:"d-flex align-center"},{default:t(()=>[o[5]||(o[5]=s(" Response ")),e(j),e(n,{size:"small",icon:"mdi-refresh",onClick:x})]),_:1}),e(y,null,{default:t(()=>[O("pre",W,K(P.value),1)]),_:1})]),_:1})]),_:1})]),_:1}),e(i,null,{default:t(()=>[e(a,{cols:"12",md:"6"},{default:t(()=>[e(C,{class:"mb-4"},{default:t(()=>[e(b,null,{default:t(()=>o[6]||(o[6]=[s("Products API")])),_:1}),e(y,null,{default:t(()=>[e(i,null,{default:t(()=>[e(a,{cols:"12"},{default:t(()=>[e(n,{block:"",color:"primary",onClick:N},{default:t(()=>o[7]||(o[7]=[s(" Get Products List ")])),_:1})]),_:1}),e(a,{cols:"12"},{default:t(()=>[e(k,{modelValue:m.value,"onUpdate:modelValue":o[0]||(o[0]=c=>m.value=c),label:"Product ID",type:"number"},null,8,["modelValue"]),e(n,{block:"",color:"info",onClick:A,disabled:!m.value},{default:t(()=>o[8]||(o[8]=[s(" Get Product Detail ")])),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(a,{cols:"12",md:"6"},{default:t(()=>[e(C,{class:"mb-4"},{default:t(()=>[e(b,null,{default:t(()=>o[9]||(o[9]=[s("Cart API")])),_:1}),e(y,null,{default:t(()=>[e(i,null,{default:t(()=>[e(a,{cols:"12"},{default:t(()=>[e(n,{block:"",color:"primary",onClick:D},{default:t(()=>o[10]||(o[10]=[s(" Get Cart Items ")])),_:1})]),_:1}),e(a,{cols:"6"},{default:t(()=>[e(k,{modelValue:p.value,"onUpdate:modelValue":o[1]||(o[1]=c=>p.value=c),label:"Product ID",type:"number"},null,8,["modelValue"])]),_:1}),e(a,{cols:"6"},{default:t(()=>[e(k,{modelValue:v.value,"onUpdate:modelValue":o[2]||(o[2]=c=>v.value=c),label:"Quantity",type:"number"},null,8,["modelValue"])]),_:1}),e(a,{cols:"12"},{default:t(()=>[e(n,{block:"",color:"success",onClick:T,disabled:!p.value||!v.value},{default:t(()=>o[11]||(o[11]=[s(" Add to Cart ")])),_:1},8,["disabled"])]),_:1}),e(a,{cols:"12"},{default:t(()=>[e(n,{block:"",color:"error",onClick:F},{default:t(()=>o[12]||(o[12]=[s(" Clear Cart ")])),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(a,{cols:"12",md:"6"},{default:t(()=>[e(C,{class:"mb-4"},{default:t(()=>[e(b,null,{default:t(()=>o[13]||(o[13]=[s("Orders API")])),_:1}),e(y,null,{default:t(()=>[e(i,null,{default:t(()=>[e(a,{cols:"12"},{default:t(()=>[e(n,{block:"",color:"primary",onClick:S},{default:t(()=>o[14]||(o[14]=[s(" Get Orders List ")])),_:1})]),_:1}),e(a,{cols:"12"},{default:t(()=>[e(n,{block:"",color:"success",onClick:G},{default:t(()=>o[15]||(o[15]=[s(" Create Order from Cart ")])),_:1})]),_:1}),e(a,{cols:"12"},{default:t(()=>[e(k,{modelValue:d.value,"onUpdate:modelValue":o[3]||(o[3]=c=>d.value=c),label:"Order ID",type:"number"},null,8,["modelValue"]),e(z,{variant:"outlined",class:"w-100"},{default:t(()=>[e(n,{color:"primary",onClick:U,disabled:!d.value},{default:t(()=>o[16]||(o[16]=[s(" Pay ")])),_:1},8,["disabled"]),e(n,{color:"warning",onClick:B,disabled:!d.value},{default:t(()=>o[17]||(o[17]=[s(" Confirm Delivery ")])),_:1},8,["disabled"]),e(n,{color:"error",onClick:L,disabled:!d.value},{default:t(()=>o[18]||(o[18]=[s(" Cancel ")])),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1}),e(a,{cols:"12",md:"6"},{default:t(()=>[e(C,{class:"mb-4"},{default:t(()=>[e(b,null,{default:t(()=>o[19]||(o[19]=[s("Favorites API")])),_:1}),e(y,null,{default:t(()=>[e(i,null,{default:t(()=>[e(a,{cols:"12"},{default:t(()=>[e(n,{block:"",color:"primary",onClick:R},{default:t(()=>o[20]||(o[20]=[s(" Get Favorites List ")])),_:1})]),_:1}),e(a,{cols:"12"},{default:t(()=>[e(k,{modelValue:_.value,"onUpdate:modelValue":o[4]||(o[4]=c=>_.value=c),label:"Product ID",type:"number"},null,8,["modelValue"]),e(n,{block:"",color:"success",onClick:Q,disabled:!_.value},{default:t(()=>o[21]||(o[21]=[s(" Add to Favorites ")])),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}}),re=M(X,[["__scopeId","data-v-5d09c487"]]);export{re as default};
