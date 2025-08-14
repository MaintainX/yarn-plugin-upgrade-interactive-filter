/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-upgrade-interactive-filter",
factory: function (require) {
"use strict";var plugin=(()=>{var p=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var P=Object.prototype.hasOwnProperty;var m=(r=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(r,{get:(e,o)=>(typeof require<"u"?require:e)[o]}):r)(function(r){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+r+'" is not supported')});var k=(r,e)=>{for(var o in e)p(r,o,{get:e[o],enumerable:!0})},g=(r,e,o,n)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of u(e))!P.call(r,t)&&t!==o&&p(r,t,{get:()=>e[t],enumerable:!(n=d(e,t))||n.enumerable});return r};var w=r=>g(p({},"__esModule",{value:!0}),r);var x={};k(x,{default:()=>j});var f=m("@yarnpkg/plugin-interactive-tools"),l=m("clipanion"),i=m("@yarnpkg/core"),c=class extends f.UpgradeInteractiveCommand{workspaces=l.Option.Rest({required:1});static paths=[["upgrade-interactive-filter"]];async execute(){if(!this.workspaces||this.workspaces.length===0)return super.execute();let e=i.Project.find;i.Project.find=async(o,n)=>{let{project:t,...a}=await e.call(i.Project,o,n),s=this.createFilteredProject(t,this.workspaces);return{...a,project:s}};try{return await super.execute()}finally{i.Project.find=e}}createFilteredProject(e,o){let n=new Set(o),t=[];for(let a of e.workspaces){let s=a.manifest.name?.name;s&&n.has(s)&&t.push(a)}return console.log("filtered workspaces:",t.map(a=>a.manifest.name?.name)),new Proxy(e,{get(a,s){return s==="workspaces"?t:a[s]}})}};var h={commands:[c]},j=h;return w(x);})();
return plugin;
}
};
