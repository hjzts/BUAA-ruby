import{d as e,r as a,o as l,b as u,e as r,f as o,g as d,h as n,i as s,y as t}from"./index-IlJQo5zm.js";import{u as m}from"./user-Bjhc5hA6.js";const i=e({__name:"ProfileEdit",setup(e){const i=a(null),c=a(null),v=a({username:"",phone_number:"",address:"",bio:"这是我的个性签名~這是我的個性簽名~~"}),p=a({username:"",phone_number:"",address:"",bio:"这是我的个性签名~這是我的個性簽名"});async function b(){try{const e={username:v.value.username,phone_number:v.value.phone_number,address:v.value.address,avatar:i.value};await m.updateProfile(e)}catch(e){}}return l((async()=>{try{const e=await m.getProfile(),{username:a,phone_number:l,address:u,bio:r}=e;v.value={username:a,phone_number:l,address:u,bio:r},p.value={username:a,phone_number:l,address:u,bio:r}}catch(e){}})),(e,a)=>{const l=o("v-card-title"),m=o("v-img"),p=o("v-icon"),f=o("v-avatar"),h=o("v-file-input"),_=o("v-text-field"),V=o("v-textarea"),y=o("v-btn"),U=o("v-form"),P=o("v-card-text"),x=o("v-card"),g=o("v-col"),j=o("v-row"),w=o("v-container");return d(),u(w,null,{default:r((()=>[n(j,{justify:"center"},{default:r((()=>[n(g,{cols:"12",sm:"8",md:"6"},{default:r((()=>[n(x,null,{default:r((()=>[n(l,null,{default:r((()=>a[5]||(a[5]=[s("Edit Profile")]))),_:1}),n(P,null,{default:r((()=>[n(U,{onSubmit:t(b,["prevent"])},{default:r((()=>[n(f,{size:"100",class:"mb-3"},{default:r((()=>[c.value?(d(),u(m,{key:0,src:c.value,alt:"Avatar"},null,8,["src"])):(d(),u(p,{key:1,size:"80"},{default:r((()=>a[6]||(a[6]=[s("mdi-account-circle")]))),_:1}))])),_:1}),n(h,{modelValue:i.value,"onUpdate:modelValue":a[0]||(a[0]=e=>i.value=e),label:"Avatar",accept:"image/*","show-size":!0,"prepend-icon":"mdi-camera"},null,8,["modelValue"]),n(_,{modelValue:v.value.username,"onUpdate:modelValue":a[1]||(a[1]=e=>v.value.username=e),label:"Username",required:"",placeholder:v.value.username,clearable:""},null,8,["modelValue","placeholder"]),n(_,{modelValue:v.value.phone_number,"onUpdate:modelValue":a[2]||(a[2]=e=>v.value.phone_number=e),label:"Phone",rules:[e=>!e||/^\d{10,11}$/.test(e)||"Invalid phone number"],placeholder:v.value.phone_number},null,8,["modelValue","rules","placeholder"]),n(V,{modelValue:v.value.address,"onUpdate:modelValue":a[3]||(a[3]=e=>v.value.address=e),label:"Address",placeholder:v.value.address},null,8,["modelValue","placeholder"]),n(V,{modelValue:v.value.bio,"onUpdate:modelValue":a[4]||(a[4]=e=>v.value.bio=e),label:"Bio",placeholder:v.value.bio},null,8,["modelValue","placeholder"]),n(y,{type:"submit",color:"primary",block:""},{default:r((()=>a[7]||(a[7]=[s(" Update Profile ")]))),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})])),_:1})}}});export{i as default};
