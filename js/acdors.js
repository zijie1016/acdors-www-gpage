"use strict";

// URL全局变量
var ossUrl = 'https://acdors.oss-cn-beijing.aliyuncs.com/';
// var domainUrl = '/api/';
var domainUrl = 'http://dev.api.acdors.com/';

//获取查询字符串
function GetQueryString(name)
{
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)return  decodeURI(r[2]); return null;
}

// 创建导航栏，根据序号index选择高亮链接
function createNavbar(index){
  var $navbar = '<nav class="navbar">' + 
    '<div class="container">' + 
      '<div class="navbar-header">' + 
        '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">' + 
          '<span class="icon-bar"></span>' + 
          '<span class="icon-bar"></span>' + 
          '<span class="icon-bar"></span>' + 
        '</button>' + 
        '<a class="navbar-brand" href="#">' + 
          '<img src="/img/logo.png" alt="acdors logo">' + 
        '</a>' + 
      '</div>' + 
      '<div id="navbar" class="navbar-collapse collapse">' + 
        '<ul class="nav nav-pills navbar-right nav-justified">' + 
          '<li><a href="/index.html">首页</a></li>' + 
          '<li><a href="/html/recruiting.html">剧组招募</a></li>' + 
          '<li><a href="/html/partners.html">合作伙伴</a></li>' + 
          '<li><a href="/html/teachers.html">师资介绍</a></li>' + 
          '<li><a href="/html/about-us.html">关于我们</a></li>' + 
        '</ul>' + 
      '</div>' + 
    '</div>' + 
  '</nav>'; 

  $('body').prepend($navbar);
  $('.nav > li:nth-child(' + index +')').addClass('active');
} // function createNavbar()

// 创建页脚
function createFooter(){
  var $footer = '<div class="footer">' + 
    '<div class="container">' +
      '<p>版权所有:北京温暖阳光下教育科技有限公司</p>' +
      '<div class="divider"></div>' +
      '<p>公司电话：400-898-9680</p>' +
      '<div class="divider"></div>' +
      '<p>公司地址：北京市朝阳区酒仙桥路酒仙公寓B座2021</p>' +
      '<div class="divider"></div>' +
      '<p>备案号：京ICP备18028385号-1</p>' +
    '</div>' +
  '</div>';
  $('body').append($footer);
} // function createFooter()

// 创建每个页面的公共组件
function createCommonComponents(index){
  // 插入导航栏,页脚
  createNavbar(index);
  createFooter()
}

// 提取$.ajax Get请求的重复项
function ajaxGet(settings) {
  $.ajax({
    type: "get",
    async: true,
    dataType: "json",
    url: settings.url,
    data: settings.data,
    success: settings.success
  });
}

// 请求大轮播图数据 (首页大轮播图和剧组招募的活动轮播图)
function getBannerSlides(data, slideId){
  data = data.data;
  for (var i=0, length=data.length; i<length; ++i) {
    var $slides = '<div class="swiper-slide">' +
        '<img src="' + ossUrl + data[i].banner + '" alt="大轮播图">' +
      '</div>';
    $(slideId + ' .swiper-wrapper').append($slides);
  }

  // 多于一张图才显示翻页按钮,自动循环
  var pagi = '';
  var loop = false;
  var autoplay = 0;

  if(data.length > 1) {
    pagi = '.pagination';
    loop = true;
    autoplay = 5000;
  }
  var Slides = $(slideId + ' .swiper-container').swiper({
    pagination: pagi,
    loop: loop,
    autoplay: autoplay,
    speed: 1000,
    grabCursor: true,
    paginationClickable: true,
    slidesPerView: 1,
    centeredSlides: true
  }); // swiper({})
}

// 请求剧组信息（图片与简单信息）
function getIntroBlk(data, containerId, seeMore){
  var crewinfo = data.crewinfo;
  var $introBlk = '<div class="row intro-blk">' +
      '<div class="intro-img col-xs-12 col-md-7">' +
        '<img class="img-responsive" src="' + ossUrl + crewinfo.crew_picurl + '" alt="剧组图片">' +
      '</div>' +
      '<div class="intro-text col-xs-12 col-md-5">' +
        '<h3>' + crewinfo.crew_name + '</h3>' +
        '<p>' +
          '剧组类型：' + crewinfo.crew_type + '<br>' +
          '导演：' + crewinfo.crew_director + '<br>' +
          '制作公司：' + crewinfo.crew_producer + '<br>' +
          '出品方：' + crewinfo.crew_investor + '<br>' +
          '开机日期：' + crewinfo.crew_bootime + '<br>' +
          '拍摄地点：' + crewinfo.crew_position +
        '</p>' +
      '</div>';
  if(seeMore){ // 如果可以查看详情，加一个链接
      $introBlk += '<a class="col-xs-12 col-md-5" href="crew-info.html">查看剧组详情</a>';
  }
  $introBlk += '</div>';
  $(containerId).append($introBlk);
}

// 后台没有上传热门剧组数据，展示"敬请期待"图片
function showTBA(containerId){
  var $img = '<img class="img-responsive" src="/img/tba.png" alt="敬请期待">';
  $(containerId + ' > #img-tba').append($img)
}

// 请求剧组故事梗概
function getStory(data, containerId){
  var $story = '<div class="simple-text">' +
                '<h4>故事梗概：</h4>' +
                '<p>' + data.crewinfo.introduction + '</p>' +
              '</div>';
  $(containerId).append($story);
}

// 请求轮播介绍文本
function getSlideText(data, containerId){
  var $slideText = '<div class="swiper-slide">' +
      '<table class="profile-info">' +
        '<thead>' +
          '<tr><th colspan="2"><h3>' + data.name + '</h3></th></tr>' +
        '</thead>' +
        '<tbody>';
  $slideText += getSlideTextRow('性别', ((data.gender == 1) ? '男' : '女'));
  $slideText += getSlideTextRow('职业', data.profession);
  $slideText += getSlideTextRow('饰演', data.role);
  $slideText += getSlideTextRow('作品', data.creation); //老师的作品
  $slideText += getSlideTextRow('作品', data.experiment); //明星的作品
  $slideText += getSlideTextRow('简介', data.content);
  $slideText += '</tbody>' +
      '</table>' +
    '</div>';
  $(containerId + ' .swiper-wrapper').append($slideText);
}
// 获取轮播介绍文本每一行
function getSlideTextRow(rowHead, rowData){
  var $str = "";
  if(rowData!="" && rowData!=undefined){ //如果没有数据，则不显示此行
    $str = '<tr>' +
            '<th>' + rowHead + '：</th>' +
            '<td>' + rowData + '</td>' +
          '</tr>';
  }
  return $str;
}

// 关联轮播图（图->文）的swiper.js配置
function setBoundSlides(settings){
  //图片轮播 swiperjs配置
  var imgSlides = $(settings.imgSlidesSelector + ' .swiper-container').swiper({
    autoplay: settings.frequency,
    speed: settings.speed,
    autoplayDisableOnInteraction: true,
    grabCursor: true,
    slidesPerView: 3,
    centeredSlides: true,
    watchActiveIndex: true,
    onSlideChangeStart: function () {
      updateTeacherInfo(imgSlides.activeIndex);
    },
    onTouchEnd: function(){
      imgSlides.swipeNext();
    }
  });
  var arrowColor = settings.arrowColor=='' ? '' : '-' + settings.arrowColor; // 左右翻页箭头图标可选
  $(settings.imgSlidesSelector + ' .arrow-left' + arrowColor).on('click', function(e){
    e.preventDefault();
    imgSlides.swipePrev();
  });
  $(settings.imgSlidesSelector + ' .arrow-right' + arrowColor).on('click', function(e){
    e.preventDefault();
    imgSlides.swipeNext();
  });

  // 文本轮播 swiperjs 配置
  var textSlides = $(settings.textSlidesSelector + ' .swiper-container').swiper({
    autoplay: settings.frequency,
    speed: settings.speed,
    autoplayDisableOnInteraction: true,
    slidesPerView: 1,
    centeredSlides: true,
    grabCursor: true,
    onSlideChangeStart: function(){ //teacherInfo和teachersCarousel互相控制
      imgSlides.swipeTo(textSlides.activeIndex, settings.speed, false);
    },
  });

  function updateTeacherInfo(index) {
    textSlides.swipeTo(index, settings.speed, false);
  }
}