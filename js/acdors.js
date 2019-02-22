"use strict";

// URL全局变量
var ossUrl = 'https://acdors.oss-cn-beijing.aliyuncs.com/';
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
function buildIntroBlk(settings){
  var $crewinfo = '<div class="row intro-blk">' +
    '<div class="intro-img col-xs-12 col-md-7">' +
      '<img class="img-responsive" src="' + ossUrl + settings.crewinfo.crew_picurl + '" alt="剧组图片">' +
    '</div>' +
    '<div class="intro-text col-xs-12 col-md-5">' +
      '<h3>' + settings.crewinfo.crew_name + '</h3>' +
      '<p>' +
        '剧组类型：' + settings.crewinfo.crew_type + '<br>' +
        '导演：' + settings.crewinfo.crew_director + '<br>' +
        '制作公司：' + settings.crewinfo.crew_producer + '<br>' +
        '出品方：' + settings.crewinfo.crew_investor + '<br>' +
        '开机日期：' + settings.crewinfo.crew_bootime + '<br>' +
        '拍摄地点：' + settings.crewinfo.crew_position +
      '</p>' +
    '</div>';
  if(settings.seeMore){ // 如果可以查看详情，加一个链接
    $crewinfo += '<a class="col-xs-12 col-md-5" href="crew-info.html?index='+encodeURI(settings.index)+'">查看剧组详情</a>';
  }
  $crewinfo += '</div>';

  return $crewinfo;
}

// 创建"敬请期待"结构(TBA = To Be Announced)
function buildTBA(src){
  return '<div id="img-tba"><img class="img-responsive" src="'+ src +'" alt="敬请期待"></div>'
}

// 请求剧组故事梗概
function buildSimpleText(content){
  return '<div class="simple-text">' +
    '<h4>故事梗概：</h4>' +
    '<p>' + content + '</p>' +
  '</div>'; 
}

// 请求轮播介绍文本
function getTextSlide(data){
  var $slideText = '<div class="swiper-slide"><table class="profile-info">' +
        '<thead>' +
          '<tr><th colspan="2"><h3>' + data.name + '</h3></th></tr>' +
        '</thead>' +
        '<tbody>';
  $slideText += getTextSlideRow('性别', ((data.gender == 1) ? '男' : '女'));
  $slideText += getTextSlideRow('职业', data.profession);
  $slideText += getTextSlideRow('饰演', data.role);
  $slideText += getTextSlideRow('作品', data.creation); //老师的作品
  $slideText += getTextSlideRow('作品', data.experiment); //明星的作品
  $slideText += getTextSlideRow('简介', data.content);
  $slideText += '</tbody></table></div>';
  return $slideText;
}
// 获取轮播介绍文本每一行
function getTextSlideRow(rowHead, rowData){
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
  $(settings.imgSlidesSelector + ' .' + settings.prevClass).on('click', function(e){
    e.preventDefault();
    imgSlides.swipePrev();
  });
  $(settings.imgSlidesSelector + ' .' + settings.nextClass).on('click', function(e){
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
    }
  });

  function updateTeacherInfo(index) {
    textSlides.swipeTo(index, settings.speed, false);
  }
}
// 创建轮播框架（不含轮播内容）
function buildSlideContainer(settings){
  var $container = '<div id="' + settings.id + '" class="' + settings.class + '">';
  if(settings.hasCWrapper){
    $container += '<div class="carousel-wrapper">';
  }
  if(settings.prevClass != undefined){ // 上一页按钮
    $container += '<a href="#" class="'+ settings.prevClass +'"></a>';
  }
  if(settings.nextClass != undefined){ //下一页按钮
    $container += '<a href="#" class="'+ settings.nextClass +'"></a>';
  }
  $container += '<div class="swiper-container">' +
        '<div class="swiper-wrapper">' +
        '</div>' +
      '</div>'; 
  if(settings.hasCWrapper){ 
    $container += '</div>'; // carousel-wrapper
  }
  if(settings.pagiClass != undefined){ // 页面选择按钮
    $container += '<div class="' + settings.pagiClass + '"></div>';
  }
  $container += '</div>'; 

  return $container;
}

// 创建单个图片轮播项，获取图片资源
function getImgSlide(url, alt){
  return  '<div class="swiper-slide"><img src="' + url + '" alt=' + alt +'></div>';
}

// 创建剧组信息结构
function buildCrewInfo(id, caption){
  return '<div id="' + id + '" class="container">' + buildSecCaption(caption) + '</div>';
}

// 创建模块大标题
function buildSecCaption(caption){
  return '<div class="row"><div class="sec-caption col-xs-12">' +
            '<p>' + caption + '</p>' +
            '<div class="padding"></div>' +
          '</div></div>';
}