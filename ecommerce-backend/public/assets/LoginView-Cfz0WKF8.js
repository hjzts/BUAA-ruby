import{d as S,v as D,r as f,x as _,b as B,e as o,u as N,f as n,g as U,h as t,i as r,y as j,j as q,t as A}from"./index-B0vVrGoP.js";import{_ as I}from"./_plugin-vue_export-helper-DlAUqK2U.js";const M={class:"text-center mt-6"},P=S({__name:"LoginView",setup($){const b=N(),g=D(),w=f(null),d=f(!1),u=f(!1),l=_({email:"",password:""}),a=_({show:!1,color:"success",text:""}),p=(i,e="success")=>{a.text=i,a.color=e,a.show=!0},x=async()=>{var i,e,c;d.value=!0;try{console.log("formData: ",l),await g.login(l),p("Login successful!"),b.push("/home")}catch(m){p(((c=(e=(i=m.response)==null?void 0:i.data)==null?void 0:e.status)==null?void 0:c.message)||"Login failed","error")}finally{d.value=!1}};return(i,e)=>{const c=n("v-card-title"),m=n("v-text-field"),v=n("v-btn"),y=n("v-form"),V=n("router-link"),k=n("v-card-text"),h=n("v-card"),C=n("v-snackbar"),L=n("v-container");return U(),B(L,{fluid:"",class:"d-flex justify-center align-center",style:{"min-height":"100vh",background:"linear-gradient(to bottom right, #e3f2fd, #bbdefb)"}},{default:o(()=>[t(h,{class:"elevation-12",style:{"border-radius":"16px",overflow:"hidden"}},{default:o(()=>[t(c,{class:"text-center text-h5 font-weight-bold pt-8"},{default:o(()=>e[5]||(e[5]=[r(" Login ")])),_:1}),t(k,null,{default:o(()=>[t(y,{onSubmit:j(x,["prevent"]),ref_key:"form",ref:w},{default:o(()=>[t(m,{modelValue:l.email,"onUpdate:modelValue":e[0]||(e[0]=s=>l.email=s),label:"Email","prepend-inner-icon":"mdi-email",variant:"outlined",class:"mb-3",required:""},null,8,["modelValue"]),t(m,{modelValue:l.password,"onUpdate:modelValue":e[1]||(e[1]=s=>l.password=s),type:u.value?"text":"password",label:"Password","prepend-inner-icon":"mdi-lock","append-inner-icon":u.value?"mdi-eye-off":"mdi-eye",variant:"outlined",class:"mb-6","onClick:appendInner":e[2]||(e[2]=s=>u.value=!u.value),required:""},null,8,["modelValue","type","append-inner-icon"]),t(v,{type:"submit",color:"primary",size:"large",block:"",loading:d.value,disabled:d.value},{default:o(()=>e[6]||(e[6]=[r(" Login ")])),_:1},8,["loading","disabled"])]),_:1},512),q("div",M,[e[8]||(e[8]=r(" Don’t have an account yet? ")),t(V,{to:"/register",class:"text-decoration-none"},{default:o(()=>e[7]||(e[7]=[r(" Create Account ")])),_:1})])]),_:1})]),_:1}),t(C,{modelValue:a.show,"onUpdate:modelValue":e[4]||(e[4]=s=>a.show=s),color:a.color,timeout:3e3},{actions:o(()=>[t(v,{color:"white",variant:"text",onClick:e[3]||(e[3]=s=>a.show=!1)},{default:o(()=>e[9]||(e[9]=[r(" Close ")])),_:1})]),default:o(()=>[r(A(a.text)+" ",1)]),_:1},8,["modelValue","color"])]),_:1})}}}),R=I(P,[["__scopeId","data-v-d0b6f812"]]);export{R as default};
