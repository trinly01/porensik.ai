(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["app"],{0:function(e,a,t){e.exports=t("2f39")},1:function(e,a){},"2f39":function(e,a,t){"use strict";t.r(a);var n=t("967e"),r=t.n(n),o=(t("96cf"),t("fa84")),s=t.n(o),c=(t("5c7d"),t("7d6e"),t("e54f"),t("62f2"),t("7e6d"),t("2b0e")),i=t("b05d"),u=t("4d5a"),d=t("9898"),l=t("f2cc"),f=t("c7a0"),p=t("2ea3"),b=t("65c6"),j=t("6ac5"),h=t("9c40"),g=t("0016"),m=t("497d"),v=t("6ab5"),y=t("033f"),w=t("e208"),k=t("27f9"),Q=t("2c91"),x=t("068f"),C=t("cb32"),D=t("4983"),q=t("7f41"),z=t("ead5"),O=t("079eb"),P=t("eb85"),A=t("f09f"),I=t("a370"),$=t("4b7e"),S=t("429b"),T=t("7460"),L=t("7867"),E=t("7cbe"),F=t("4e73"),_=t("24e8"),M=t("ddd8"),V=t("b047"),B=t("58a8"),N=t("adad"),R=t("823b"),U=t("ef35"),G=t("8380"),J=t("6f48"),H=t("ee89"),K=t("639d"),W=t("6ac0"),X=t("05c0"),Y=t("d66b"),Z=t("c859"),ee=t("9564"),ae=t("3786"),te=t("8f8e"),ne=t("714f"),re=t("7f67"),oe=t("2a19"),se=t("436b"),ce=t("f508");c["a"].use(i["a"],{config:{},components:{QLayout:u["a"],QHeader:d["a"],QDrawer:l["a"],QPageContainer:f["a"],QPage:p["a"],QToolbar:b["a"],QToolbarTitle:j["a"],QBtn:h["a"],QIcon:g["a"],QList:m["a"],QItem:v["a"],QItemSection:y["a"],QItemLabel:w["a"],QInput:k["a"],QSpace:Q["a"],QImg:x["a"],QAvatar:C["a"],QScrollArea:D["a"],QTree:q["a"],QBreadcrumbs:z["a"],QBreadcrumbsEl:O["a"],QSeparator:P["a"],QCard:A["a"],QCardSection:I["a"],QCardActions:$["a"],QTabs:S["a"],QTab:T["a"],QRouteTab:L["a"],QPopupProxy:E["a"],QMenu:F["a"],QDialog:_["a"],QSelect:M["a"],QChip:V["a"],QBadge:B["a"],QTabPanels:N["a"],QTabPanel:R["a"],QInfiniteScroll:U["a"],QSpinnerDots:G["a"],QBtnToggle:J["a"],QUploader:H["a"],QParallax:K["a"],QVideo:W["a"],QTooltip:X["a"],QEditor:Y["a"],QDate:Z["a"],QToggle:ee["a"],QRadio:ae["a"],QCheckbox:te["a"]},directives:{Ripple:ne["a"],ClosePopup:re["a"]},plugins:{Notify:oe["a"],Dialog:se["a"],Loading:ce["a"]}});var ie=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{attrs:{id:"q-app"}},[t("router-view")],1)},ue=[],de={name:"App"},le=de,fe=t("2877"),pe=Object(fe["a"])(le,ie,ue,!1,null,null,null),be=pe.exports,je=t("8c4f"),he=[{path:"/",component:function(){return t.e("49b105c6").then(t.bind(null,"f241"))},children:[{path:"",component:function(){return t.e("461a5054").then(t.bind(null,"8b24"))}},{path:"mydrive/:_id",component:function(){return Promise.all([t.e("05ab4153"),t.e("e4e3e832")]).then(t.bind(null,"194b"))}},{path:"trash",component:function(){return t.e("6d59753f").then(t.bind(null,"5c2e"))}},{path:"shared",component:function(){return Promise.all([t.e("05ab4153"),t.e("ed864002")]).then(t.bind(null,"c613"))}}]}];he.push({path:"*",component:function(){return t.e("4b47640d").then(t.bind(null,"e51e"))}});var ge=he;c["a"].use(je["a"]);var me=function(){var e=new je["a"]({scrollBehavior:function(){return{x:0,y:0}},routes:ge,mode:"hash",base:""});return e},ve=function(){var e="function"===typeof me?me({Vue:c["a"]}):me,a={el:"#q-app",router:e,render:function(e){return e(be)}};return{app:a,router:e}},ye=t("a925"),we={failed:"Action failed",success:"Action was successful"},ke={"en-us":we},Qe=function(){var e=s()(r.a.mark(function e(a){var t,n;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:t=a.app,n=a.Vue,n.use(ye["a"]),t.i18n=new ye["a"]({locale:"en-us",fallbackLocale:"en-us",messages:ke});case 3:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),xe=t("bc3a"),Ce=t.n(xe),De=function(){var e=s()(r.a.mark(function e(a){var t;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:t=a.Vue,t.prototype.$axios=Ce.a;case 2:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),qe=t("57f0"),ze=t.n(qe),Oe=t("88ad"),Pe=t.n(Oe),Ae=t("e552"),Ie=t("c1df"),$e=t.n(Ie),Se=t("310e"),Te=t.n(Se),Le=t("612d"),Ee=t("2ef0"),Fe=t("a4af").default,_e={transform:Le["transform"],isEqual:Le["isEqual"],isObject:Le["isObject"],findIndex:Ee["findIndex"],cloneDeep:Ee["cloneDeep"],reverse:Le["reverse"],isEmpty:Le["isEmpty"],isArray:Le["isArray"],isImage:ze.a,isVideo:Pe.a},Me=Le["transform"].convert({cap:!1}),Ve=function(e){return function(a,t,n){if(!Object(Le["isEqual"])(t,e[n])){var r=Object(Le["isObject"])(t)&&Object(Le["isObject"])(e[n]);a[n]=!0===r?Be(t,e[n]):t}}};function Be(e,a){return Me(Ve(a),null,e)}var Ne={_id:"My Drive",label:"My Drive",parentFolder:"My Drive",userId:"",security:{public:!1,viewers:[],uploaders:[],modifiers:[],removers:[],folderCreators:[],approvers:[]},isFolder:!0,fileVersions:[],logs:[],extras:{}},Re=Object(Ee["cloneDeep"])(Ne);Re.isFolder=!1;var Ue=Object(Ee["cloneDeep"])(Ne);Ue.isFolder=!1,Ue.type="form",Ue.label="",Ue.details="";var Ge={type:"text",value:"",isRequired:!1};Ue.format=[Object(Ee["cloneDeep"])(Ge)];var Je={global:{},user:!1,folders:[],files:[],notifs:[],newNotifs:0,currentFolder:Ne,clickedItem:Ne,nodeFormat:Ne,fileFormat:Re,formFormat:Ue,path:[Ne]},He=function(){var e=s()(r.a.mark(function e(a){var t,n,o;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:t=a.app,a.router,n=a.Vue,n.component("draggable",Te.a),t.data=Je,n.prototype.$log=console.log,n.prototype.$timeout=function(e,a){return setTimeout(e,a)},o="http://10.10.120.15:3232",n.prototype.$host=o,n.prototype.$dbCon=Fe(o),n.prototype.$sso=Fe("http://10.10.120.32:3536",{users:{}}),n.prototype.$sso.service("users"),n.prototype.$sso.authenticate({strategy:"local",email:"3364@mail.com",password:"3364"}),n.prototype.$deepDiff=Be,n.prototype.$moment=$e.a,n.prototype.$lodash=_e,n.prototype.$beautify=Ae["js"];case 15:case"end":return e.stop()}},e)}));return function(a){return e.apply(this,arguments)}}(),Ke=ve(),We=Ke.app,Xe=Ke.router;function Ye(){return Ze.apply(this,arguments)}function Ze(){return Ze=s()(r.a.mark(function e(){var a,t;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:a=[Qe,De,He],t=0;case 2:if(!(t<a.length)){e.next=20;break}if("function"===typeof a[t]){e.next=5;break}return e.abrupt("continue",17);case 5:return e.prev=5,e.next=8,a[t]({app:We,router:Xe,Vue:c["a"],ssrContext:null});case 8:e.next=17;break;case 10:if(e.prev=10,e.t0=e["catch"](5),!e.t0||!e.t0.url){e.next=15;break}return window.location.href=e.t0.url,e.abrupt("return");case 15:return console.error("[Quasar] boot error:",e.t0),e.abrupt("return");case 17:t++,e.next=2;break;case 20:new c["a"](We);case 21:case"end":return e.stop()}},e,null,[[5,10]])})),Ze.apply(this,arguments)}Ye()},4678:function(e,a,t){var n={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-SG":"cdab","./en-SG.js":"cdab","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-nz":"6f50","./en-nz.js":"6f50","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-tw":"90ea","./zh-tw.js":"90ea"};function r(e){var a=o(e);return t(a)}function o(e){if(!t.o(n,e)){var a=new Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}return n[e]}r.keys=function(){return Object.keys(n)},r.resolve=o,e.exports=r,r.id="4678"},"7e6d":function(e,a,t){},a4af:function(e,a,t){"use strict";t.r(a);t("5df3"),t("1c4c"),t("20d6");var n=t("967e"),r=t.n(n),o=(t("f751"),t("7514"),t("96cf"),t("fa84")),s=t.n(o),c=(t("6b54"),t("06db"),t("28a5"),t("8055")),i=t.n(c),u=t("1f71"),d=t.n(u),l=t("faa1"),f=t.n(l),p=t("2ef0"),b=d.a.authentication,j=d.a.socketio;a["default"]=function(e){e=e||"http://localhost:3030";var a=i()(e),t=d()();return t.configure(j(a,{timeout:18e4})).configure(b({jwtStrategy:"jwt",entity:"user",service:"users",cookie:e+"-jwt",storageKey:e+"-jwt",storage:window.localStorage})),t.wingsService=function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};a.query||(a.query={});var o=new f.a,c=t.service(e),i={service:c,query:a,total:0,data:[],skip:0,page:1,limit:10,channels:n.channels||[],debug:n.debug||!1,newDataPosition:n.newDataPosition||"end",paginate:n.paginate||!1,reset:function(a){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};i.total=0,i.data=[],i.skip=0,i.page=1,i.limit=10,i.query=a||i.query,i.query.query||(i.query.query={}),i.channels=t.channels||i.channels,i.debug=t.debug||i.debug,i.newDataPosition=t.newDataPosition||i.newDataPosition,i.paginate=t.paginate||i.paginate,i.log("".concat(e,".reset"),i.query),i.init()},log:function(){var e,a="\n        display: inline-block;\n        padding: 0 10px;\n        height: 50px;\n        line-height: 20px;\n        border-radius: 25px;\n        background-color: #FF5722;\n        color: white;\n        font-weight: bold;\n      ",t="%c".concat(arguments[0]);Array.prototype.shift.apply(arguments);var n=new Error,r=n.stack.toString().split("\n"),o=r[2].split("?!."),s=o[o.length-1].split("?")[0].split("///.");s=1===s.length?s[0]:s[1].split(":")[0];var c=n.stack.split("\n");c[0]="Error",c.splice(1,1),c.splice(2,8),n.stack=c.join("\n"),i.debug&&(e=console).log.apply(e,[t,a,s,n,"\n"].concat(Array.prototype.slice.call(arguments)))},on:function(e,a){return o.on(e,function(){a.bind(i),a.apply(void 0,Array.prototype.slice.call(arguments).concat([i]))}),i.listener=a,i},destroy:function(){t.io.removeListener("connect",i.onConnect),t.removeListener("authenticated",i.onAuthenticated),t.removeListener("logout",i.onLogout),delete o._events},init:function(){return s()(r.a.mark(function a(){var t;return r.a.wrap(function(a){while(1)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,c.find(i.query);case 3:return t=a.sent,i=Object.assign(i,t),o.emit("dataChange",t.data),i.log("".concat(e,".init"),t),a.abrupt("return",i);case 10:a.prev=10,a.t0=a["catch"](0),i.log("".concat(e,".init"),a.t0),o.emit("dataChange",i.data);case 14:case"end":return a.stop()}},a,null,[[0,10]])}))(),i},find:function(){return c.find.apply(c,arguments)},get:function(){return c.get.apply(c,arguments)},create:function(){return c.create.apply(c,arguments)},update:function(){return c.update.apply(c,arguments)},patch:function(){return c.patch.apply(c,arguments)},remove:function(){return c.remove.apply(c,arguments)},inChannel:function(e){return!i.channels[0]||-1!==Object(p["findIndex"])(i.channels,function(a){var t=a.prop.split(".").reduce(function(e,a){return e[a]},e);return Object(p["isFunction"])(a.value)?a.value(t,e):a.value===t})}};return c.on("created",function(e){i.total+=1,i.inChannel(e)&&("end"===i.newDataPosition?(i.data.push(e),i.paginate&&i.data.length>i.limit&&i.data.shift()):(i.data.unshift(e),i.paginate&&i.data.length>i.limit&&i.data.pop()),o.emit("dataChange",i.data))}),i.findIndex=function(e){for(var a=-1,t=i.data.length,n=0;n<t;n+=1)if(i.data[n]._id===e._id){a=n;break}return a},i.removeItem=function(e){var a=i.data.length-1;while(e<a)i.data[e]=i.data[++e];i.data.pop()},c.on("removed",function(a){i.total-=1;var t=i.findIndex(a);if(-1!==t){i.removeItem(t);var n=i.data.length;i.paginate&&n>0&&n<i.limit&&i.loadPage(i.page),i.paginate&&0===n&&i.loadPage(i.page-1),i.log("".concat(e,".removed"),a,t),o.emit("dataChange",Array.from(i.data))}}),i.modifyData=function(a){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"patched",n=i.findIndex(a),r=i.inChannel(a);-1!==n&&r?i.data[n]=a:-1===n||r?-1===n&&r&&!i.paginate&&("end"===i.newDataPosition?i.data.push(a):i.data.unshift(a)):i.removeItem(n),o.emit("dataChange",Array.from(i.data)),i.log("".concat(e,".on.").concat(t),a,"index",n,"inChannel",r)},c.on("patched",function(e){i.modifyData(e)}),c.on("updated",function(e){i.modifyData(e,"updated")}),i.loadMore=s()(r.a.mark(function a(){var t,n;return r.a.wrap(function(a){while(1)switch(a.prev=a.next){case 0:if(t=Object(p["ceil"])(i.total/i.limit),!(i.page<=t)){a.next=10;break}return i.query.query.$skip=i.page*i.limit,a.next=5,c.find(i.query);case 5:n=a.sent,++i.page,i.data=Object(p["unionBy"])(i.data,n.data,"_id"),o.emit("dataChange",i.data),i.log("".concat(e,".loadMore"),n);case 10:case"end":return a.stop()}},a)})),i.loadAll=s()(r.a.mark(function e(){var a;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(a=Object(p["ceil"])(i.total/i.limit),i.page===a){e.next=5;break}return e.next=4,i.loadMore();case 4:c.loadAll();case 5:case"end":return e.stop()}},e)})),i.loadPage=s()(r.a.mark(function a(){var t,n,s=arguments;return r.a.wrap(function(a){while(1)switch(a.prev=a.next){case 0:return t=s.length>0&&void 0!==s[0]?s[0]:1,i.paginate=!0,i.page=t,i.query.query.$skip=(i.page-1)*i.limit,a.next=6,c.find(i.query);case 6:n=a.sent,Object.assign(i,n),o.emit("dataChange",i.data),i.log("".concat(e,".loadPage"),n);case 10:case"end":return a.stop()}},a)})),i.onConnect=function(){i.data.length&&(i.log("".concat(e,".onConnect")),i.reset())},t.io.on("connect",i.onConnect),i.onLogout=function(){i.log("".concat(e,".onLogout")),i.reset()},t.on("logout",i.onLogout),i.onAuthenticated=function(){i.data.length&&(i.log("".concat(e,".onAuthenticated")),i.reset())},t.on("authenticated",i.onAuthenticated),i},t}}},[[0,"runtime","vendor"]]]);