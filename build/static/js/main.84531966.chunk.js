(this["webpackJsonpwater-tank-switch"]=this["webpackJsonpwater-tank-switch"]||[]).push([[0],{37:function(t,e,n){t.exports=n(78)},42:function(t,e,n){},43:function(t,e,n){},72:function(t,e){},78:function(t,e,n){"use strict";n.r(e);var a=n(1),o=n.n(a),r=n(29),c=n.n(r),s=(n(42),n(30)),i=n(31),l=n(35),u=n(32),h=n(36),f=(n(43),n(80)),m=n(33),w=n.n(m)()(),d={color:"white"},g=function(t){function e(t){var n;return Object(s.a)(this,e),(n=Object(l.a)(this,Object(u.a)(e).call(this,t))).state={status:!1},n}return Object(h.a)(e,t),Object(i.a)(e,[{key:"componentDidMount",value:function(){var t=this;w.on("newStatus",(function(e){console.log(e),t.setState({status:e})})),fetch("http://localhost:5000/api/status").then((function(t){return t.text()})).then((function(e){t.setState({status:"true"===e})}))}},{key:"render",value:function(){var t=this.state.status;return o.a.createElement("div",{className:"text-center"},o.a.createElement("br",null),o.a.createElement("br",null),o.a.createElement("h1",{style:d},o.a.createElement("u",null,"Water Tank Switch")),o.a.createElement("h1",{style:d},JSON.stringify(t)),o.a.createElement(f.a,{color:t?"danger":"light",size:"lg",onClick:function(){return fetch("http://localhost:5000/api/toggleStatus")}},t?"Turn Water Heater Off":"Turn Water Heater On"))}}]),e}(o.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));n(77);document.body.style="background: #0e9aa7;",c.a.render(o.a.createElement(g,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[37,1,2]]]);
//# sourceMappingURL=main.84531966.chunk.js.map