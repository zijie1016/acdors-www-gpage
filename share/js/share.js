"use strict";

// URL全局变量
// var ossUrl = 'https://acdors.oss-cn-beijing.aliyuncs.com/';
// var domainUrl = '/api/';
var domainUrl = 'http://dev.api.acdors.com/';
var shareApiUrl = domainUrl + 'web/share';

//获取查询字符串
function GetQueryString(name)
{
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  decodeURI(r[2]); return null;
}
//判断是否有id值
function ready(id){
  return id != null && id != undefined && id != "";
}

// 构建分享页能用顶部封面
function buildHeadCover(){
  return '<div id="cover" class="touchable">' +
    '<table cellspacing="0">' +
      '<tr>' +
        '<td id="logo"> <div> <img src="../img/logo.png" alt="logo"> </div> </td>' +
        '<td id="slogan"> <div>你，绝对有戏</div> </td>' +
        '<td id="open"> <div class="pill-btn">打开</div> </td>' +
      '</tr>' +
    '</table>' +
  '</div> ';
}

//分享页数据通用ajax请求
function ajaxGetShare(settings){ /* cid = content id */
  var uid = settings.data.uid, cid = settings.data.cid;
  // 取得有效ID值才请求数据
  if(!ready(uid) || !ready(cid)){return;}
  // 判断页面类型
  var data;
  switch(settings.pageType){
    case 'video': 
      data = {uid: uid, did: cid}; 
      break;
    case 'topic':
      data = {uid: uid, topic_id: cid};
      break;
    case 'activity':
      data = {uid: uid, activity_id: cid}; 
      break;
    default: break;
  }

  // 请求数据
  $.ajax({
    type:"get",
    url: shareApiUrl,
    async: true,
    dataType: "json",
    data: data,
    success: settings.success
  });
} 

// 构建视频分享页面
function buildVidShare(){
  // #wrapper
  $('body').prepend('<div id="wrapper"></div>');
  $('#wrapper').append(buildHeadCover());
  $('#wrapper').append(buildVidUIDock());
  $('#wrapper').append(buildVidProfileDock());
  $('#wrapper').append(buildSeeMoreModal());
}
function buildVidUIDock(){
  return '<div id="ui-dock" class="touchable">' +
    '  <div class="share-ui">' +
    '    <div id="like-btn" class="share-btn"> <img  src="img/likes-red.png" alt="赞"> </div>' +
    '    <div id="likes" class="share-btn-text"></div>' +
    '  </div>' +
    '  <div class="share-ui">' +
    '    <div id="comments-btn" class="share-btn"> <img src="img/comments.png" alt="评论"> </div>' +
    '    <div id="comments" class="share-btn-text"></div>' +
    '  </div>' +
    '  <div class="share-ui">' +
    '    <div class="share-btn"> <img src="img/share.png" alt="分享"> </div>' +
    '  </div>' +
    '</div> ';
}
function buildVidProfileDock(){
  return '<div id="profile-dock" class="touchable">' +
    '<div id="profile-pic"></div>' +
      '<table>' +
      '  <tr> <td> <div id="author-name"></div> <div id="follow"> <div class="pill-btn">+关注</div> </div> </td> </tr>' +
      '  <tr> <td> <div id="video-info"></div> </td> </tr>' +
      '</table>' +
    '</div>';
}
function buildSeeMoreModal(){
  return '<div id="modal" class="modal fade dim">' +
      '<div class="modal-content">' +
        '<a class="pill-btn" href="http://www.acdors.com">了解更多</a>' +
      '</div>' +
    '</div> ';
}

// 构建话题分享页面
function buildTopicShare(){
  
}

// 构建活动分享页面
function buildActivityShare(){

}