(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["6d59753f"],{"0972":function(e,t,o){"use strict";var r=o("8609"),s=o.n(r);s.a},"5c2e":function(e,t,o){"use strict";o.r(t);var r=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-page",{staticClass:"q-pa-md ",attrs:{id:"t-main-body"},nativeOn:{click:function(t){e.$root.clickedItem=e.$root.currentFolder}}},[o("div",{staticClass:"text-body2 q-pb-md"},[e._v("Quick Access")]),o("div",{staticClass:"row items-start q-gutter-md q-pb-md q-pr-md"}),o("div",{staticClass:"text-caption q-pb-md"},[e._v("Folders")]),o("div",{staticClass:"row items-start q-gutter-md q-pb-md q-pr-md"},e._l(e.folders,function(t){return o("q-card",{directives:[{name:"show",rawName:"v-show",value:t.trash,expression:"folder.trash"}],key:t._id,staticClass:"my-card col-xs-12 col-sm-6 col-md-4 no-shadow",style:{"background-color":e.$root.clickedItem._id===t._id?"#E1F5FE":"white"},attrs:{bordered:""},nativeOn:{dblclick:function(o){return e.dblclick(t)},click:function(o){e.$timeout(function(){e.$root.clickedItem=t},10)}}},[o("q-card-section",{staticClass:"row items-center no-wrap",staticStyle:{"max-height":"56px"}},[o("div",{staticClass:"col text-weight-regular limited-text",class:{"text-primary":e.$root.clickedItem._id===t._id,"text-blue-grey-14":e.$root.clickedItem._id!==t._id}},[o("q-btn",{staticClass:"bg-white q-mr-sm",attrs:{round:"",flat:"",color:"blue-grey-14",size:"sm",icon:"folder"}}),e._v("\n            "+e._s(t.label)+" "+e._s(t.trash)+"\n          ")],1),o("div",{staticClass:"col-auto"},[o("q-btn",{attrs:{color:"grey-7",size:"sm",round:"",flat:"",icon:"more_vert"}},[o("node-menu",{attrs:{node:t}})],1)],1)])],1)}),1),o("div",{staticClass:"row text-caption q-mt-md"},[e._v("Files")]),o("div",{staticClass:"row items-start q-gutter-md q-pb-md q-pr-md"},e._l(e.files,function(t){return o("q-card",{directives:[{name:"show",rawName:"v-show",value:t.trash,expression:"file.trash"}],key:t._id,staticClass:"my-card col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 no-shadow",style:{"background-color":e.$root.clickedItem._id===t._id?"#E1F5FE":"white"},attrs:{bordered:""},nativeOn:{click:function(o){e.$timeout(function(){e.$root.clickedItem=t},10)}}},[e.$lodash.isImage(t.versions[t.versions.length-1].fileName)?o("div",{staticClass:"thumbnail"},[o("img",{staticClass:"portrait",attrs:{src:e.$dbCon.io.io.uri+"/uploads?_id="+t.versions[t.versions.length-1]._id,alt:"Image"}})]):e.$lodash.isVideo(t.versions[t.versions.length-1].fileName)?o("div",{staticClass:"thumbnail"},[o("video",{staticClass:"thumbnail",attrs:{controls:""}},[o("source",{attrs:{src:e.$dbCon.io.io.uri+"/uploads?_id="+t.versions[t.versions.length-1]._id}}),e._v("\n          Your browser does not support the video tag.\n        ")])]):o("div",{staticClass:"row justify-center bg-blue-grey-1"},[o("q-icon",{staticClass:"q-mt-md q-mb-md",attrs:{name:"insert_drive_file",size:"72px",color:"blue-grey-14"}})],1),o("q-card-section",{staticClass:"row items-center no-wrap",staticStyle:{"max-height":"56px"}},[o("div",{staticClass:"col text-weight-regular limited-text",class:{"text-primary":e.$root.clickedItem._id===t._id,"text-blue-grey-14":e.$root.clickedItem._id!==t._id}},[o("q-btn",{staticClass:"bg-white q-mr-sm",attrs:{round:"",flat:"",color:"blue-grey-14",size:"sm",icon:"insert_drive_file"}}),e._v("\n          "+e._s(t.label)+"\n        ")],1),o("div",{staticClass:"col-auto"},[o("q-btn",{attrs:{color:"grey-7",size:"sm",round:"",flat:"",icon:"more_vert"}},[o("node-menu",{attrs:{node:t}})],1)],1)])],1)}),1)])},s=[],i=o("967e"),n=o.n(i),a=(o("96cf"),o("fa84")),l=o.n(a),c=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("q-menu",{ref:"newMenu",attrs:{"touch-position":""}},[o("q-list",{staticClass:"q-pt-sm q-pb-sm",staticStyle:{"min-width":"200px"},attrs:{dense:""}},[o("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"},{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:e.restore}},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{color:"blue-grey",name:"restore"}})],1),o("q-item-section",[e._v("Restore")])],1),o("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"},{name:"show",rawName:"v-show",value:e.node.owner===e.$root.user._id,expression:"node.owner === $root.user._id"},{name:"ripple",rawName:"v-ripple"}],attrs:{clickable:""},on:{click:e.removeAuth}},[o("q-item-section",{attrs:{avatar:""}},[o("q-icon",{attrs:{color:"blue-grey",name:"delete_outline"}})],1),o("q-item-section",[e._v("Remove")])],1)],1)],1)},d=[],u={mounted:function(){this.security=this.$lodash.cloneDeep(this.node.security)},props:["node"],data:function(){return{tempNode:{label:""}}},methods:{restore:function(){var e=l()(n.a.mark(function e(){var t,o=this;return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return console.log("RESTORE",this.node._id),t={action:"Recovered",timestamp:Date.now(),user:this.$root.user},e.next=4,this.$dbCon.service("juan-".concat(this.node.isFolder?"folders":"files")).patch(this.node._id,{trash:!1,logs:this.node.logs.concat([t])});case 4:this.$q.notify({message:this.node.label+" was restored",position:"bottom-left",actions:[{label:"Open",handler:function(){var e=l()(n.a.mark(function e(){return n.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return o.$router.push("/myDrive/"+o.node.parentFolder),e.next=3,o.$dbCon.services["juan-folders"].reQuery({query:{parentFolder:o.node.parentFolder,trash:{$ne:!0}}});case 3:o.$root.currentFolder=o.node,o.$root.clickedItem=o.node,o.$q.notify({message:o.node.label+"was restored",position:"bottom-left"});case 6:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}()}]});case 5:case"end":return e.stop()}},e,this)}));function t(){return e.apply(this,arguments)}return t}(),removeAuth:function(){var e=this;this.$q.dialog({title:"Approval Authentication",message:"Enter Password",prompt:{model:"",type:"password"},cancel:!0,persistent:!0}).onOk(function(){var t=l()(n.a.mark(function t(o){return n.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return console.log(">>>> OK, received",o),t.prev=1,t.next=4,e.$axios.post(e.$dbCon.io.io.uri+"/authentication",{email:e.$root.user.email,password:o,strategy:"sso"});case 4:e.remove(),t.next=10;break;case 7:t.prev=7,t.t0=t["catch"](1),e.$q.notify({message:"Wrong Password",position:"bottom-right",color:"negative"});case 10:case"end":return t.stop()}},t,null,[[1,7]])}));return function(e){return t.apply(this,arguments)}}())},remove:function(){var e=this;this.$root.clickedItem=this.$root.currentFolder,this.$q.dialog({title:"Delete forever?",message:"".concat(this.node.label," is about to be permanently deleted\nWarning: You can’t undo this action."),ok:{label:"Delete forever",color:"negative"},cancel:{},persistent:!0}).onOk(l()(n.a.mark(function t(){var o;return n.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e.$root.clickedItem=e.$root.currentFolder,o=[{_id:e.node._id}],e.node.isFolder&&o.push({parentFolder:e.node._id}),t.next=5,e.$dbCon.services["juan-".concat(e.node.isFolder?"folders":"files")].remove(null,{query:{$or:o}});case 5:return e.$dbCon.service("uploads").remove(null,{query:{parentNode:e.node._id}}),t.next=8,e.$dbCon.services["juan-notifs"].remove(null,{query:{$or:[{"data._id":e.node._id},{"data.parentFolder":e.node._id}]}});case 8:e.$q.notify({message:e.node.label+" was permanently removed",position:"bottom-left"});case 9:case"end":return t.stop()}},t)})))}}},m=u,h=o("2877"),p=Object(h["a"])(m,c,d,!1,null,null,null),v=p.exports,f={name:"PageIndex",components:{nodeMenu:v},data:function(){return{folderListner:null,fileListner:null,listKey:Date.now(),foldersSrvc:null,filesSrvc:null,onAuth:null,folders:[],files:[]}},beforeDestroy:function(){this.foldersSrvc.destroy(),this.filesSrvc.destroy(),this.$dbCon.removeListener("authenticated",this.onAuth)},mounted:function(){var e=this;this.foldersSrvc=this.$dbCon.wingsService("juan-folders").on("dataChange",function(t){e.folders=t,console.log("folders",t)}),this.filesSrvc=this.$dbCon.wingsService("juan-files").on("dataChange",function(t){e.files=t}),this.onAuth=function(){var t=l()(n.a.mark(function t(o){return n.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:delete o.user.training_programs,delete o.user.voluntary_work,delete o.user.work_experience,delete o.user.civil_service_eligibility,delete o.user.educational_background,delete o.user.family_background,delete o.user.other_information,delete o.user.extra_information.signature,e.$root.user=o.user,console.log("LOGGED IN"),e.getFoldersAndFiles();case 11:case"end":return t.stop()}},t)}));return function(e){return t.apply(this,arguments)}}(),console.log("this.onAuth",this.onAuth),this.$root.user&&this.getFoldersAndFiles(),this.$dbCon.on("authenticated",this.onAuth)},methods:{getFoldersAndFiles:function(){var e={query:{trash:!0,owner:this.$root.user._id,$limit:500}},t={debug:!0,channels:[{value:this.$root.user._id,prop:"owner"}]};this.foldersSrvc.reset(e,t),this.filesSrvc.reset(e,t)}}},b=f,w=(o("0972"),Object(h["a"])(b,r,s,!1,null,null,null));t["default"]=w.exports},8609:function(e,t,o){}}]);