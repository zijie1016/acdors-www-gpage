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