import{a as t}from"./index-B0vVrGoP.js";const p={async updateProfile(e){const a=new FormData;return Object.entries(e).forEach(([s,r])=>{r!==void 0&&a.append(s,r)}),(await t.put("/api/v1/profile",a,{headers:{"Content-Type":"multipart/form-data"}})).data},async updatePassword(e){return(await t.put("/api/v1/password",e)).data},async getProfile(){const e=await t.get("/api/v1/profile");return console.log("response: ",e),e.data}};export{p as u};
