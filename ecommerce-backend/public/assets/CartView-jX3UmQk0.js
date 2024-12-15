import{d as ce,r as v,c as B,w as pe,o as me,k as g,h as t,e as a,F as I,u as ve,f as s,g as _,j as n,i as r,t as u,b as $,l as X,m as _e,n as fe}from"./index-B0vVrGoP.js";import{c as V}from"./cart-DAnYCAh8.js";import{o as be}from"./order-CEDnoQ5w.js";import{_ as ye}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./api-D7B8soog.js";const ge={class:"d-flex align-center mb-6"},xe={class:"d-flex flex-column"},Ce={class:"text-primary"},ke={key:0,class:"text-error"},he={class:"d-flex flex-column align-end"},Ve={class:"quantity-control mb-2"},we={class:"mx-3"},qe={class:"text-h6"},Fe={class:"d-flex justify-space-between mb-4"},Ie={class:"d-flex justify-space-between mb-4"},$e={class:"d-flex justify-space-between mb-4"},Se={class:"text-h6"},ze={key:1,class:"d-flex justify-center align-center",style:{"min-height":"400px"}},Ue={class:"text-primary"},Ne={class:"text-h6 text-primary"},Pe=ce({__name:"CartView",setup(je){const Q=ve(),S=v(!1),f=v(!1),i=v([]),d=v([]),x=v(!1),b=v(!1),z=v(!1),w=v(null),C=v({show:!1,text:"",color:"success"}),Z=B(()=>i.value.reduce((o,e)=>o+e.attributes.quantity,0)),R=B(()=>i.value.filter(o=>d.value.includes(o.id)).reduce((o,e)=>o+e.attributes.product.price*e.attributes.quantity,0)),T=async()=>{S.value=!0;try{const o=await V.getCartItems();i.value=o.data,d.value=i.value.map(e=>e.id),console.log("cartItems: ",i.value),console.log("get cart items response: ",o.data)}catch(o){console.error("Failed to fetch cart items:",o)}finally{S.value=!1}},E=async(o,e)=>{const p=o.attributes.quantity+e;if(!(p<1||p>o.attributes.product.stock_quantity))try{await V.updateCartItem(o.id,p),o.attributes.quantity=p}catch(U){console.error("Failed to update quantity:",U)}},ee=async o=>{try{await V.removeFromCart(o.id),i.value=i.value.filter(e=>e.id!==o.id),d.value=d.value.filter(e=>e!==o.id)}catch(e){console.error("Failed to remove item:",e)}},te=()=>{x.value=!0},le=async()=>{f.value=!0;try{await V.clearCart(),i.value=[],d.value=[],x.value=!1}catch(o){console.error("Failed to clear cart:",o)}finally{f.value=!1}},c=v({recipient_name:"",phone_number:"",shipping_address:"",postal_code:""}),q=B(()=>i.value.filter(o=>d.value.includes(o.id))),M=(o,e="success")=>{C.value={show:!0,text:o,color:e}},ae=()=>{d.value.length&&(console.log("selectedItems: ",q.value),b.value=!0)},oe=async()=>{if(w.value.validate()){f.value=!0;try{console.log("shippingForm: ",c.value);const o={order:c.value,items:q.value.map(p=>({product_id:p.attributes.product.id,quantity:p.attributes.quantity}))};console.log("orderData: ",o);const e=await be.createOrder(o);console.log("create order response: ",e),await Promise.all(q.value.map(p=>V.removeFromCart(p.id))),M("Order placed successfully!"),b.value=!1,c.value={recipient_name:"",phone_number:"",shipping_address:"",postal_code:""},await T(),Q.push({name:"order-detail",params:{id:e.data.id}})}catch(o){console.error("Failed to create order:",o),M("Failed to place order. Please try again.","error")}finally{f.value=!1}}};return pe(b,o=>{o||(c.value={recipient_name:"",phone_number:"",shipping_address:"",postal_code:""},w.value&&w.value.reset())}),me(()=>{T()}),(o,e)=>{const p=s("v-icon"),U=s("v-chip"),N=s("v-spacer"),m=s("v-btn"),y=s("v-col"),F=s("v-row"),se=s("v-checkbox"),L=s("v-progress-circular"),Y=s("v-img"),P=s("v-list-item-title"),G=s("v-list-item-subtitle"),j=s("v-list-item"),H=s("v-list"),k=s("v-card"),D=s("v-card-title"),J=s("v-divider"),O=s("v-card-text"),K=s("v-card-actions"),W=s("v-dialog"),ne=s("v-container"),re=s("v-avatar"),A=s("v-text-field"),ue=s("v-textarea"),ie=s("v-form"),de=s("v-snackbar");return _(),g(I,null,[t(ne,null,{default:a(()=>[t(F,null,{default:a(()=>[t(y,{cols:"12"},{default:a(()=>[n("div",ge,[t(p,{icon:"mdi-cart",size:"x-large",class:"me-3"}),e[12]||(e[12]=n("h1",{class:"text-h4 mb-0"},"Shopping Cart",-1)),t(U,{class:"ml-4",color:"primary",size:"large"},{default:a(()=>[r(u(i.value.length)+" "+u(i.value.length===1?"item":"items"),1)]),_:1}),t(N),t(m,{color:"error",variant:"text","prepend-icon":"mdi-delete",disabled:!i.value.length,onClick:te},{default:a(()=>e[11]||(e[11]=[r(" Clear Cart ")])),_:1},8,["disabled"])])]),_:1})]),_:1}),S.value?(_(),g("div",ze,[t(L,{indeterminate:"",size:"64",color:"primary"})])):(_(),$(F,{key:0},{default:a(()=>[i.value.length?(_(),g(I,{key:0},[t(y,{cols:"12",md:"8"},{default:a(()=>[t(k,null,{default:a(()=>[t(H,null,{default:a(()=>[(_(!0),g(I,null,X(i.value,l=>(_(),$(j,{key:l.id,value:l.id},{prepend:a(()=>[t(se,{modelValue:d.value,"onUpdate:modelValue":e[0]||(e[0]=h=>d.value=h),value:l.id,"hide-details":""},null,8,["modelValue","value"])]),append:a(()=>[n("div",he,[n("div",Ve,[t(m,{icon:"mdi-minus",size:"small",variant:"outlined",disabled:l.attributes.quantity<=1,onClick:h=>E(l,-1)},null,8,["disabled","onClick"]),n("span",we,u(l.attributes.quantity),1),t(m,{icon:"mdi-plus",size:"small",variant:"outlined",disabled:l.attributes.quantity>=l.attributes.product.stock_quantity,onClick:h=>E(l,1)},null,8,["disabled","onClick"])]),n("div",qe,"$"+u((l.attributes.product.price*l.attributes.quantity).toFixed(2)),1),t(m,{class:"mt-2",density:"compact",color:"error",variant:"text","prepend-icon":"mdi-delete",onClick:h=>ee(l)},{default:a(()=>e[13]||(e[13]=[r(" Remove ")])),_:2},1032,["onClick"])])]),default:a(()=>[n("template",null,[t(Y,{src:l.attributes.product.image_url||"/placeholder.png",width:"100",height:"100",cover:"",class:"ma-2 rounded",onClick:h=>_e(Q).push(`/products/${l.attributes.product.id}`),style:{cursor:"pointer"}},{placeholder:a(()=>[t(F,{class:"fill-height ma-0",align:"center",justify:"center"},{default:a(()=>[t(L,{indeterminate:"",color:"grey-lighten-5"})]),_:1})]),_:2},1032,["src","onClick"])]),t(P,{class:"text-subtitle-1 mb-1"},{default:a(()=>[r(u(l.attributes.product.product_name),1)]),_:2},1024),t(G,null,{default:a(()=>[n("div",xe,[n("span",Ce,"$"+u(l.attributes.product.price),1),l.attributes.product.in_stock?fe("",!0):(_(),g("span",ke," Out of Stock "))])]),_:2},1024)]),_:2},1032,["value"]))),128))]),_:1})]),_:1})]),_:1}),t(y,{cols:"12",md:"4"},{default:a(()=>[t(k,{class:"sticky-card"},{default:a(()=>[t(D,{class:"bg-surface-variant"},{default:a(()=>e[14]||(e[14]=[r(" Order Summary ")])),_:1}),t(O,{class:"pt-4"},{default:a(()=>[n("div",Fe,[e[15]||(e[15]=n("span",null,"Selected Items:",-1)),n("span",null,u(d.value.length),1)]),n("div",Ie,[e[16]||(e[16]=n("span",null,"Total Items:",-1)),n("span",null,u(Z.value),1)]),n("div",$e,[e[17]||(e[17]=n("span",{class:"text-subtitle-1"},"Subtotal:",-1)),n("span",Se,"$"+u(R.value.toFixed(2)),1)]),t(J,{class:"mb-4"}),t(m,{color:"primary",size:"large",block:"","prepend-icon":"mdi-cart-check",disabled:!d.value.length,onClick:ae},{default:a(()=>[r(" Checkout ("+u(d.value.length)+" items) ",1)]),_:1},8,["disabled"])]),_:1})]),_:1})]),_:1})],64)):(_(),$(y,{key:1,cols:"12"},{default:a(()=>[t(k,{class:"text-center pa-12"},{default:a(()=>[t(p,{icon:"mdi-cart-outline",size:"100",color:"grey-lighten-1",class:"mb-4"}),e[19]||(e[19]=n("h3",{class:"text-h5 mb-2"},"Your Cart is Empty",-1)),e[20]||(e[20]=n("p",{class:"text-body-1 mb-6"},"Start adding items to your cart!",-1)),t(m,{color:"primary",size:"large",to:"/products","prepend-icon":"mdi-shopping"},{default:a(()=>e[18]||(e[18]=[r(" Continue Shopping ")])),_:1})]),_:1})]),_:1}))]),_:1})),t(W,{modelValue:x.value,"onUpdate:modelValue":e[2]||(e[2]=l=>x.value=l),"max-width":"400"},{default:a(()=>[t(k,null,{default:a(()=>[t(D,null,{default:a(()=>e[21]||(e[21]=[r("Clear Shopping Cart")])),_:1}),t(O,null,{default:a(()=>e[22]||(e[22]=[r(" Are you sure you want to remove all items from your cart? ")])),_:1}),t(K,null,{default:a(()=>[t(N),t(m,{variant:"text",onClick:e[1]||(e[1]=l=>x.value=!1)},{default:a(()=>e[23]||(e[23]=[r(" Cancel ")])),_:1}),t(m,{color:"error",variant:"text",loading:f.value,onClick:le},{default:a(()=>e[24]||(e[24]=[r(" Clear Cart ")])),_:1},8,["loading"])]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1}),t(W,{modelValue:b.value,"onUpdate:modelValue":e[9]||(e[9]=l=>b.value=l),"max-width":"800",persistent:""},{default:a(()=>[t(k,null,{default:a(()=>[t(D,{class:"bg-primary text-white"},{default:a(()=>e[25]||(e[25]=[r(" Checkout ")])),_:1}),t(O,{class:"pt-4"},{default:a(()=>[t(F,null,{default:a(()=>[t(y,{cols:"12",md:"6"},{default:a(()=>[e[27]||(e[27]=n("h3",{class:"text-h6 mb-4"},"Order Items",-1)),t(H,null,{default:a(()=>[(_(!0),g(I,null,X(q.value,l=>(_(),$(j,{key:l.id,density:"compact"},{prepend:a(()=>[t(re,{size:"40"},{default:a(()=>[t(Y,{src:l.attributes.product.image_url||"/placeholder.png",cover:""},null,8,["src"])]),_:2},1024)]),append:a(()=>[n("div",Ue," $"+u((l.attributes.quantity*l.attributes.product.price).toFixed(2)),1)]),default:a(()=>[t(P,null,{default:a(()=>[r(u(l.attributes.product.product_name),1)]),_:2},1024),t(G,null,{default:a(()=>[r(" Qty: "+u(l.attributes.quantity)+" × $"+u(l.attributes.product.price),1)]),_:2},1024)]),_:2},1024))),128)),t(J,{class:"my-2"}),t(j,null,{append:a(()=>[n("div",Ne," $"+u(R.value.toFixed(2)),1)]),default:a(()=>[t(P,{class:"text-h6"},{default:a(()=>e[26]||(e[26]=[r(" Total Amount ")])),_:1})]),_:1})]),_:1})]),_:1}),t(y,{cols:"12",md:"6"},{default:a(()=>[e[28]||(e[28]=n("h3",{class:"text-h6 mb-4"},"Shipping Information",-1)),t(ie,{ref_key:"form",ref:w,modelValue:z.value,"onUpdate:modelValue":e[7]||(e[7]=l=>z.value=l)},{default:a(()=>[t(A,{modelValue:c.value.recipient_name,"onUpdate:modelValue":e[3]||(e[3]=l=>c.value.recipient_name=l),label:"Recipient Name",rules:[l=>!!l||"Name is required"],variant:"outlined",density:"comfortable",class:"mb-2"},null,8,["modelValue","rules"]),t(A,{modelValue:c.value.phone_number,"onUpdate:modelValue":e[4]||(e[4]=l=>c.value.phone_number=l),label:"Phone Number",rules:[l=>!!l||"Phone number is required",l=>/^\d{10,11}$/.test(l)||"Invalid phone number"],variant:"outlined",density:"comfortable",class:"mb-2"},null,8,["modelValue","rules"]),t(ue,{modelValue:c.value.shipping_address,"onUpdate:modelValue":e[5]||(e[5]=l=>c.value.shipping_address=l),label:"Shipping Address",rules:[l=>!!l||"Address is required"],variant:"outlined",density:"comfortable","auto-grow":"",rows:"3",class:"mb-2"},null,8,["modelValue","rules"]),t(A,{modelValue:c.value.postal_code,"onUpdate:modelValue":e[6]||(e[6]=l=>c.value.postal_code=l),label:"Postal Code",rules:[l=>!!l||"Postal code is required",l=>/^\d{5,6}$/.test(l)||"Invalid postal code"],variant:"outlined",density:"comfortable"},null,8,["modelValue","rules"])]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1}),t(K,null,{default:a(()=>[t(N),t(m,{variant:"text",onClick:e[8]||(e[8]=l=>b.value=!1),disabled:f.value},{default:a(()=>e[29]||(e[29]=[r(" Cancel ")])),_:1},8,["disabled"]),t(m,{color:"primary",loading:f.value,disabled:!z.value,onClick:oe},{default:a(()=>e[30]||(e[30]=[r(" Place Order ")])),_:1},8,["loading","disabled"])]),_:1})]),_:1})]),_:1},8,["modelValue"]),t(de,{modelValue:C.value.show,"onUpdate:modelValue":e[10]||(e[10]=l=>C.value.show=l),color:C.value.color,timeout:3e3},{default:a(()=>[r(u(C.value.text),1)]),_:1},8,["modelValue","color"])],64)}}}),Re=ye(Pe,[["__scopeId","data-v-8118c9a1"]]);export{Re as default};