"use strict";

// URL全局变量
var ossUrl = 'https://acdors.oss-cn-beijing.aliyuncs.com/';
// var domainUrl = '/api/';
var domainUrl = 'http://dev.api.acdors.com/';
var shareApiUrl = domainUrl + 'web/share';

/*
*    通用组件
*/
//获取查询字符串
function GetQueryString(name)
{
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  decodeURI(r[2]); return null;
}
//将时间戳转换为当地时间
function getLocalTime(timestamp){
  var time = new Date(timestamp*1000);
  var m = time.getMonth() + 1,
      d = time.getDate(),
      h = time.getHours(),
      min = time.getMinutes();
  return addZero(m) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(min);
}
function addZero(n){
  return n<10 ? '0'+n : n;
}
// 点击.touchable UI后跳转（官网或app下载页）
function addModalEvent(settings){
  $(settings.class).click(function(){
    $(settings.id).modal({
      backdrop: false
    });
  });
  $(settings.id).click(function(){
    $(this).modal('hide');
  });
}

//判断是否有id值
function ready(id){
  return id != null && id != undefined && id != "";
}

// 构建一个包含元素
function buildWrapper(pageType){
  switch(pageType){
    case 'video':
      return '<div id="vid-wrapper"></div>';
    case 'topic':
    case 'activity':
      return '<div id="wrapper"></div>';
    default: return "";
  }
}

// 构建简单段落
function buildSimpleText(settings){
  return '<div class="simple-text">' +
      '<h4 style="color: '+ settings.captionColor +';">'+ settings.caption +'</h4>' +
      '<p>' + settings.content + '</p>' +
    '</div>';
}

// 构建分享页通用顶部封面
function buildHeadCover(settings){
  return '<div id="cover" class="touchable">' +
    '<table cellspacing="0">' +
      '<tr>' +
        '<td id="logo"> <div style="border-right-color:'+ settings.color +'"> <img src="'+ settings.logoUrl +'" alt="logo"> </div> </td>' +
        '<td id="slogan"> <div style="color:'+ settings.color +'; ">你，绝对有戏</div> </td>' +
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


/*
*    构建视频分享页面
*/
function buildVidShare(){
  // #wrapper
  $('body').prepend(buildWrapper('video'));
  $('#vid-wrapper').append(buildHeadCover({logoUrl: '../img/logo.png', color: '#fff'}));
  $('#vid-wrapper').append(buildVidUIDock());
  $('#vid-wrapper').append(buildVidProfileDock());
  $('#vid-wrapper').append(buildSeeMoreModal());
}
function buildVidUIDock(){
  return '<div id="ui-dock" class="touchable">' +
    '  <div class="share-ui">' +
    '    <div id="like-btn" class="share-btn"> <img  src="img/likes.png" alt="赞"> </div>' +
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
function buildTopicShare(data){
  $('body').prepend(buildWrapper('topic')); //非视频类分享包含元素
  $('#wrapper').append(buildHeadCover({logoUrl: '../img/logo-dark.png', color: '#111'})); //页头封面
  $('#wrapper').append(buildTopicInfo(data.topicinfo)); // 话题内容
  $('#wrapper').append(buildCommentList(data.data)); // 评论区
  $('#wrapper').append(buildSeeMoreModal()); // 弹出的跳转模态框
}
function buildTopicInfo(info){
  var $info = '<div class="topic">';
  $info += buildSimpleText({
    caption: info.topic_name,
    captionColor: '#111',
    content: info.topic_desc
  });
  $info += '<table class="topic-table">' + 
        '<tr><td colspan="3"><img class="topic-img" src="'+ ossUrl + info.topic_icon +'" alt="topic image"></td></tr>' +
        '<tr>' +
          '<td id="shares">' +
            '<div class="touchable">' + 
              '<img src="img/topic-shares.png" alt="shares">' +
            '</div>' +
          '</td>' +
          '<td id="comments">' +
            '<div class="touchable">' + 
              '<img src="img/topic-comments.png" alt="comments">' + info.comment_count +
            '</div' +
          '</td>' +
          '<td id="likes">' +
            '<div class="touchable">' + 
              '<img src="img/topic-likes.png" alt="likes">' + info.like_count +
            '</div>' +
          '</td>' +
        '</tr>' +
      '</table>'; 
  $info += '</div>';
  return $info;
}
function buildCommentList(data){
  var $comment = '<div class="comment-list"><p>评论</p>';
  for(var i=0,len=data.length; i<len; ++i){
    $comment += buildCommentItem(data[i]);
  }
  $comment += '</div>';
  return $comment;
}
function buildCommentItem(item){
  var $item = '<div class="comment-item">' +
        '<div class="user-pic">' +
          '<img src="'+ ossUrl + item.avatar +'">' + 
        '</div>' +
        '<div class="comment-text">' +
          '<div class="user-name">'+ item.nickname +'</div>' +
          '<div class="comment-time">' + getLocalTime(item.createtime) +'</div>' +
          '<div class="comment-content">'+ item.content +'</div>' +
        '</div>' +
      '</div>';
  return $item;
}

// 构建活动分享页面
function buildActivityShare(){

}