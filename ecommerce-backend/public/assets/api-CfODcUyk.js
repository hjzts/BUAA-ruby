import{D as e}from"./index-RCYdGSFb.js";const t=e.create({baseURL:"http://22373058.project.rubyapp.act.buaa.edu.cn:9000",timeout:1e5,withCredentials:!0});t.interceptors.request.use((e=>{const t=localStorage.getItem("token");return t&&(e.headers.Authorization=`Bearer ${t}`),e})),t.interceptors.response.use((e=>e),(e=>{var t;return 401===(null==(t=e.response)?void 0:t.status)&&(localStorage.removeItem("token"),window.location.href="/login"),Promise.reject(e)}));export{t as a};