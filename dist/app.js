import{defineInterface as e}from"@directus/extensions-sdk";import{defineComponent as t,ref as n,resolveComponent as l,openBlock as i,createElementBlock as a,Fragment as o,createVNode as r,withCtx as u,createTextVNode as p,toDisplayString as s}from"vue";const d=[e({id:"encrypted-input",name:"Encryption input",icon:"lock",description:"This is an input for data encryption ",component:((e,t)=>{const n=e.__vccOpts||e;for(const[e,l]of t)n[e]=l;return n})(t({__name:"interface",props:{value:{type:String,default:null},collection:{type:String,default:null},field:{type:String,default:null},primaryKey:{type:String,default:null}},emits:["input"],setup(e,{emit:t}){const d=e;console.log(d);const c=n(!0),f=t;return(t,n)=>{const d=l("VInput"),m=l("VIcon"),v=l("VButton");return i(),a(o,null,[r(d,{"model-value":e.value,placeholder:"encrypted input",type:c.value?"password":"text",onChange:n[0]||(n[0]=e=>{return t=e.target.value,void f("input",t);var t}),suffix:c.value?"masked":"visible"},null,8,["model-value","type","suffix"]),r(v,{style:{"margin-top":"5px"},onClick:n[1]||(n[1]=e=>{c.value=!c.value}),xSmall:!0,outlined:!0,danger:c.value},{default:u((()=>[r(m,{name:c.value?"visibility_off":"visibility",style:{"margin-right":"5px"}},null,8,["name"]),p(" "+s(c.value?"Show Data":"Hide Data"),1)])),_:1},8,["danger"])],64)}}}),[["__file","interface.vue"]]),options:null,group:"standard",types:["string"],recommendedDisplays:["encrypted-string"]})],c=[],f=[],m=[],v=[],y=[],g=[];export{c as displays,d as interfaces,f as layouts,m as modules,g as operations,v as panels,y as themes};
