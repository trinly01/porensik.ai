(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["6d59753f"],{"0972":function(e,t,s){"use strict";var o=s("8609"),r=s.n(o);r.a},"5c2e":function(e,t,s){"use strict";s.r(t);var o=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",{staticClass:"q-pa-md ",attrs:{id:"t-main-body"},nativeOn:{click:function(t){e.$root.clickedItem=e.$root.currentFolder}}},[s("div",{staticClass:"text-body2 q-pb-md"},[e._v("Quick Access")]),s("div",{staticClass:"row items-start q-gutter-md q-pb-md q-pr-md"}),s("div",{staticClass:"text-caption q-pb-md"},[e._v("Folders")]),s("div",{staticClass:"row items-start q-gutter-md q-pb-md q-pr-md"},e._l(e.folders,function(t){return s("q-card",{directives:[{name:"show",rawName:"v-show",value:t.trash,expression:"folder.trash"}],key:t._id,staticClass:"my-card col-xs-12 col-sm-6 col-md-4 no-shadow",style:{"background-color":e.$root.clickedItem._id===t._id?"#E1F5FE":"white"},attrs:{bordered:""},nativeOn:{dblclick:function(s){return e.dblclick(t)},click:function(s){e.$timeout(function(){e.$root.clickedItem=t},10)}}},[s("q-card-section",{staticClass:"row items-center no-wrap",staticStyle:{"max-height":"56px"}},[s("div",{staticClass:"col text-weight-regular limited-text",class:{"text-primary":e.$root.clickedItem._id===t._id,"text-blue-grey-14":e.$root.clickedItem._id!==t._id}},[s("q-btn",{staticClass:"bg-white q-mr-sm",attrs:{round:"",flat:"",color:"blue-grey-14",size:"sm",icon:"folder"}}),e._v("\n            "+e._s(t.label)+" "+e._s(t.trash)+"\n          ")],1),s("div",{staticClass:"col-auto"},[s("q-btn",{attrs:{color:"grey-7",size:"sm",round:"",flat:"",icon:"more_vert"}},[s("node-menu",{attrs:{node:t}})],1)],1)])],1)}),1),s("div",{staticClass:"row text-caption q-mt-md"},[e._v("Files")]),s("div",{staticClass:"row items-start q-gutter-md q-pb-md q-pr-md"},e._l(e.files,function(t){return s("q-card",{directives:[{name:"show",rawName:"v-show",value:t.trash,expression:"file.trash"}],key:t._id,staticClass:"my-card col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 no-shadow",style:{"background-color":e.$root.clickedItem._id===t._id?"#E1F5FE":"white"},attrs:{bordered:""},nativeOn:{click:function(s){e.$timeout(function(){e.$root.clickedItem=t},10)}}},[t.versions&&e.$lodash.isImage(e.currentVersion(t).fileName)?s("div",{staticClass:"thumbnail row justify-center bg-blue-grey-1"},[s("img",{key:t._id,staticClass:"portrait",attrs:{src:e.$dbCon.io.io.uri+"/uploads?_id="+t._id+(!0!==t.security.public?"&t="+e.$root.jwt:""),alt:"Image"}})]):t.versions&&e.$lodash.isVideo(e.currentVersion(t).fileName)?s("div",{staticClass:"thumbnail"},[s("video",{staticClass:"thumbnail",attrs:{controls:"",preload:"none"}},[s("source",{attrs:{src:e.$dbCon.io.io.uri+"/uploads?_id="+t._id+(!0!==t.security.public?"&t="+e.$root.jwt:"")}}),e._v("\n          Your browser does not support the "),s("code",[e._v("video")]),e._v(" tag.\n        ")])]):t.versions&&e.$lodash.isAudio(e.currentVersion(t).fileName)?s("div",{staticClass:"thumbnail bg-blue-grey-1"},[s("audio",{staticClass:"q-pa-md",staticStyle:{position:"absolute",width:"100%",top:"32px"},attrs:{controls:"",preload:"none"}},[s("source",{attrs:{src:e.$dbCon.io.io.uri+"/uploads?_id="+e.currentVersion(t)._id}}),e._v("\n          Your browser does not support the "),s("code",[e._v("audio")]),e._v(" tag.\n        ")])]):s("div",{staticClass:"row justify-center bg-blue-grey-1"},[t.type&&"doc"===t.type?s("q-icon",{staticClass:"q-pt-md q-pb-md thumbnail",attrs:{name:"fas fa-file-alt",size:"64px",color:"blue-grey-3"}}):t.type&&"form"===t.type?s("q-icon",{staticClass:"q-pt-md q-pb-md thumbnail",attrs:{name:"fas fa-file-signature",size:"64px",color:"blue-grey-3"}}):s("q-icon",{staticClass:"q-pt-md q-pb-md thumbnail",attrs:{name:"fas fa-file",size:"64px",color:"blue-grey-3"}})],1),s("q-card-section",{staticClass:"row items-center no-wrap",staticStyle:{"max-height":"56px"}},[s("div",{staticClass:"col text-weight-regular limited-text",class:{"text-primary":e.$root.clickedItem._id===t._id,"text-blue-grey-14":e.$root.clickedItem._id!==t._id}},[t.type&&"doc"===t.type?s("q-btn",{staticClass:"bg-white q-mr-sm",attrs:{icon:"fas fa-file-alt",round:"",flat:"",color:"blue",size:"sm"}}):t.type&&"form"===t.type?s("q-btn",{staticClass:"bg-white q-mr-sm",attrs:{icon:"fas fa-file-signature",round:"",flat:"",color:"purple",size:"sm"}}):t.versions&&e.$lodash.isImage(e.currentVersion(t).fileName)?s("q-btn",{staticClass:"bg-white q-mr-sm",attrs:{icon:"photo_size_select_actual",round:"",flat:"",color:"red",size:"sm"}}):t.versions&&e.$lodash.isVideo(e.currentVersion(t).fileName)?s("q-btn",{staticClass:"bg-white q-mr-sm",attrs:{icon:"videocam",round:"",flat:"",color:"red",size:"sm"}}):t.versions&&e.$lodash.isAudio(e.currentVersion(t).fileName)?s("q-btn",{staticClass:"bg-white q-mr-sm",attrs:{icon:"volume_up",round:"",flat:"",color:"red",size:"sm"}}):s("q-btn",{staticClass:"bg-white q-mr-sm",attrs:{icon:"fas fa-file",round:"",flat:"",color:"blue",size:"sm"}}),e._v("\n          "+e._s(t.label)+"\n        ")],1),s("div",{staticClass:"col-auto"},[s("q-btn",{attrs:{color:"grey-7",size:"sm",round:"",flat:"",icon:"more_vert"}},[s("node-menu",{attrs:{node:t}})],1)],1)])],1)}),1)])},r=[],i=s("967e"),n=s.n(i),a=(s("96cf"),s("fa84")),l=s.n(a),c=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-menu",{ref:"newMenu",attrs:{"touch-position":""}},[s("q-list",{staticClass:"q-pt-sm q-pb-sm",staticStyle:{"min-width":"200px"},attrs:{dense:""}},[s("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"},{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:e.restore}},[s("q-item-section",{attrs:{avatar:""}},[s("q-icon",{attrs:{color:"blue-grey",name:"restore"}})],1),s("q-item-section",[e._v("Restore")])],1),s("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"},{name:"show",rawName:"v-show",value:e.node.owner===e.$root.user._id,expression:"node.owner === $root.user._id"},{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:e.removeAuth}},[s("q-item-section",{attrs:{avatar:""}},[s("q-icon",{attrs:{color:"blue-grey",name:"delete_outline"}})],1),s("q-item-section",[e._v("Remove")])],1)],1)],1)},d=[],u={mounted:function(){this.security=this.$lodash.cloneDeep(this.node.security)},props:["node"],data:function(){return{tempNode:{label:""}}},methods:{restore:function(){var e=l()(n.a.mark(function e(){var t,s=this;return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return console.log("RESTORE",this.node._id),t={action:"Recovered",timestamp:Date.now(),user:this.$root.user},e.next=4,this.$dbCon.service("juan-".concat(this.node.isFolder?"folders":"files")).patch(this.node._id,{trash:!1,logs:this.node.logs.concat([t])});case 4:this.$q.notify({message:this.node.label+" was restored",position:"bottom-left",actions:[{label:"Open",handler:function(){var e=l()(n.a.mark(function e(){return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return s.$router.push("/myDrive/"+s.node.parentFolder),e.next=3,s.$dbCon.services["juan-folders"].reQuery({query:{parentFolder:s.node.parentFolder,trash:{$ne:!0}}});case 3:s.$root.currentFolder=s.node,s.$root.clickedItem=s.node,s.$q.notify({message:s.node.label+"was restored",position:"bottom-left"});case 6:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}()}]});case 5:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),removeAuth:function(){var e=this;this.$q.dialog({title:"Approval Authentication",message:"Enter Password",prompt:{model:"",type:"password"},cancel:!0,persistent:!0}).onOk(function(){var t=l()(n.a.mark(function t(s){return n.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return console.log(">>>> OK, received",s),t.prev=1,t.next=4,e.$axios.post(e.$dbCon.io.io.uri+"/authentication",{email:e.$root.user.email,password:s,strategy:"sso"});case 4:e.remove(),t.next=10;break;case 7:t.prev=7,t.t0=t["catch"](1),e.$q.notify({message:"Wrong Password",position:"bottom-right",color:"negative"});case 10:case"end":return t.stop()}},t,null,[[1,7]])}));return function(e){return t.apply(this,arguments)}}())},remove:function(){var e=this;this.$root.clickedItem=this.$root.currentFolder,this.$q.dialog({title:"Delete forever?",message:"".concat(this.node.label," is about to be permanently deleted\nWarning: You can’t undo this action."),ok:{label:"Delete forever",color:"negative"},cancel:{},persistent:!0}).onOk(l()(n.a.mark(function t(){var s;return n.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e.$root.clickedItem=e.$root.currentFolder,s=[{_id:e.node._id}],e.node.isFolder&&s.push({parentFolder:e.node._id}),t.next=5,e.$dbCon.services["juan-".concat(e.node.isFolder?"folders":"files")].remove(null,{query:{$or:s}});case 5:return e.$dbCon.service("uploads").remove(null,{query:{parentNode:e.node._id}}),t.next=8,e.$dbCon.services["juan-notifs"].remove(null,{query:{$or:[{"data._id":e.node._id},{"data.parentFolder":e.node._id}]}});case 8:e.$q.notify({message:e.node.label+" was permanently removed",position:"bottom-left"});case 9:case"end":return t.stop()}},t)})))}}},m=u,p=s("2877"),h=Object(p["a"])(m,c,d,!1,null,null,null),f=h.exports,v={name:"PageIndex",components:{nodeMenu:f},data:function(){return{folderListner:null,fileListner:null,listKey:Date.now(),foldersSrvc:null,filesSrvc:null,onAuth:null,folders:[],files:[]}},beforeDestroy:function(){this.foldersSrvc.destroy(),this.filesSrvc.destroy(),this.$dbCon.removeListener("authenticated",this.onAuth)},mounted:function(){var e=this;this.foldersSrvc=this.$dbCon.wingsService("juan-folders").on("dataChange",function(t){e.folders=t,console.log("folders",t)}),this.filesSrvc=this.$dbCon.wingsService("juan-files").on("dataChange",function(t){e.files=t}),this.onAuth=function(){var t=l()(n.a.mark(function t(s){return n.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:delete s.user.training_programs,delete s.user.voluntary_work,delete s.user.work_experience,delete s.user.civil_service_eligibility,delete s.user.educational_background,delete s.user.family_background,delete s.user.other_information,delete s.user.extra_information.signature,e.$root.user=s.user,console.log("LOGGED IN"),e.getFoldersAndFiles();case 11:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}(),console.log("this.onAuth",this.onAuth),this.$root.user&&this.getFoldersAndFiles(),this.$dbCon.on("authenticated",this.onAuth)},methods:{currentVersion:function(e){var t=null;return t="undefined"===typeof e.versions[0].approved?0:e.versions[0].approved?0:1,e.versions[t].fileName=e.versions[t].fileName||"",e.versions[t]},getFoldersAndFiles:function(){var e={query:{trash:!0,owner:this.$root.user._id,$limit:500}},t={debug:!0,channels:[{value:this.$root.user._id,prop:"owner"}]};this.foldersSrvc.reset(e,t),this.filesSrvc.reset(e,t)}}},b=v,w=(s("0972"),Object(p["a"])(b,o,r,!1,null,null,null));t["default"]=w.exports},8609:function(e,t,s){}}]);