// ==UserScript==
// @name		SaveTube
// @version		2016.08.30
// @description		Download videos from video sharing web sites.
// @author		sebaro
// @namespace		http://isebaro.com/savetube
// @license		GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL		https://raw.githubusercontent.com/sebaro/savetube/master/savetube.user.js
// @updateURL		https://raw.githubusercontent.com/sebaro/savetube/master/savetube.user.js
// @icon		https://raw.githubusercontent.com/sebaro/saveTube/master/savetube.png
// @include		http://youtube.com*
// @include		http://www.youtube.com*
// @include		https://youtube.com*
// @include		https://www.youtube.com*
// @include		http://gaming.youtube.com*
// @include		https://gaming.youtube.com*
// @include		http://m.youtube.com*
// @include		https://m.youtube.com*
// @include		http://dailymotion.com*
// @include		http://www.dailymotion.com*
// @include		https://dailymotion.com*
// @include		https://www.dailymotion.com*
// @include		http://vimeo.com*
// @include		http://www.vimeo.com*
// @include		https://vimeo.com*
// @include		https://www.vimeo.com*
// @include		http://metacafe.com*
// @include		http://www.metacafe.com*
// @include		https://metacafe.com*
// @include		https://www.metacafe.com*
// @include		http://break.com*
// @include		http://www.break.com*
// @include		https://break.com*
// @include		https://www.break.com*
// @include		http://funnyordie.com*
// @include		http://www.funnyordie.com*
// @include		https://funnyordie.com*
// @include		https://www.funnyordie.com*
// @include		http://veoh.com*
// @include		http://www.veoh.com*
// @include		https://veoh.com*
// @include		https://www.veoh.com*
// @include		http://viki.com*
// @include		http://www.viki.com*
// @include		https://viki.com*
// @include		https://www.viki.com*
// @include		http://imdb.com*
// @include		http://www.imdb.com*
// @include		https://imdb.com*
// @include		https://www.imdb.com*
// @grant		GM_xmlhttpRequest
// @grant		GM_setValue
// @grant		GM_getValue
// ==/UserScript==


/*

  Copyright (C) 2010 - 2016 Sebastian Luncan

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program. If not, see <http://www.gnu.org/licenses/>.

  Website: http://isebaro.com/savetube
  Contact: http://isebaro.com/contact

*/


(function() {


// Don't run on frames or iframes
if (window.top != window.self) return;


// ==========Variables========== //

// Userscript
var userscript = 'SaveTube';

// Page
var page = {win: window, doc: document, body: document.body, url: window.location.href, title: document.title, site: window.location.hostname.match(/([^.]+)\.[^.]+$/)[1]};

// Saver
var saver = {};
var feature = {'definition': true, 'container': true, 'autoget': false, 'dash': false};
var option = {'definition': 'HD', 'container': 'MP4', 'autoget': false, 'dash': false};
var sources = {};

// Links
var website = 'http://isebaro.com/savetube/?ln=en';
var contact = 'http://isebaro.com/contact/?ln=en&sb=savetube';


// ==========Functions========== //

function createMyElement(type, content, event, action, target) {
  var obj = page.doc.createElement(type);
  if (content) {
    if (type == 'div') obj.innerHTML = content;
    else if (type == 'option') {
      obj.value = content;
      obj.innerHTML = content;
    }
  }
  if (event == 'change') {
    if (target == 'video') {
      obj.addEventListener('change', function() {
	saver['videoSave'] = this.value;
	if (feature['autoget'] && saver['buttonGet'] == 'Get') {
	  if (option['autoget']) getMyVideo();
	}
	else {
	  modifyMyElement(saver['buttonGet'] , 'div', 'Get', false);
	}
      }, false);
    }
  }
  else if (event == 'click') {
    obj.addEventListener('click', function() {
      if (action == 'close') {
	removeMyElement(page.body, target);
      }
      else if (action == 'logo') {
	page.win.location.href = website;
      }
      else if (action == 'get') {
	getMyVideo();
      }
      else if (action == 'autoget') {
	option['autoget'] = (option['autoget']) ? false : true;
	if (option['autoget']) {
	  styleMyElement(saver['buttonGet'], {display: 'none'});
	  styleMyElement(saver['buttonAutoget'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
	  getMyVideo();
	}
	else {
	  styleMyElement(saver['buttonGet'], {display: 'inline'});
	  styleMyElement(saver['buttonAutoget'], {color: '#CCCCCC', textShadow: '0px 0px 0px'});
	}
	setMyOptions('autoget', option['autoget']);
      }
      else if (action == 'definition') {
	for (var itemDef = 0; itemDef < option['definitions'].length; itemDef++) {
	  if (option['definitions'][itemDef].match(/[A-Z]/g).join('') == option['definition']) {
	    var nextDef = (itemDef + 1 < option['definitions'].length) ? itemDef + 1 : 0;
	    option['definition'] = option['definitions'][nextDef].match(/[A-Z]/g).join('');
	    break;
	  }
	}
	modifyMyElement(saver['buttonDefinition'], 'div', option['definition'], false);
	setMyOptions('definition', option['definition']);
	modifyMyElement(saver['buttonGet'] , 'div', 'Get', false);
	selectMyVideo();
	if (option['autoget']) getMyVideo();
      }
      else if (action == 'container') {
	for (var itemCont = 0; itemCont < option['containers'].length; itemCont++) {
	  if (option['containers'][itemCont] == option['container']) {
	    var nextCont = (itemCont + 1 < option['containers'].length) ? itemCont + 1 : 0;
	    option['container'] = option['containers'][nextCont];
	    break;
	  }
	}
	modifyMyElement(saver['buttonContainer'], 'div', option['container'], false);
	setMyOptions('container', option['container']);
	modifyMyElement(saver['buttonGet'] , 'div', 'Get', false);
	selectMyVideo();
	if (option['autoget']) getMyVideo();
      }
      else if (action == 'dash') {
	option['dash'] = (option['dash']) ? false : true;
	if (option['dash']) {
	  styleMyElement(saver['buttonDASH'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
	}
	else {
	  styleMyElement(saver['buttonDASH'], {color: '#CCCCCC', textShadow: '0px 0px 0px'});
	}
	setMyOptions('dash', option['dash']);
      }
      else if (action == 'move') {
	if (saver['saverPanel'].style.right == '25px') {
	  styleMyElement(saver['saverPanel'], {left: '25px', right: 'auto'});
	  modifyMyElement(saver['buttonMove'], 'div', '>', false);
	}
	else {
	  styleMyElement(saver['saverPanel'], {left: 'auto', right: '25px'});
	  modifyMyElement(saver['buttonMove'], 'div', '<', false);
	}
      }
    }, false);
  }
  return obj;
}

function getMyElement(obj, type, from, value, child, content) {
  var getObj, chObj, coObj;
  var pObj = (!obj) ? page.doc : obj;
  if (type == 'body') getObj = pObj.body;
  else {
    if (from == 'id') getObj = pObj.getElementById(value);
    else if (from == 'class') getObj = pObj.getElementsByClassName(value);
    else if (from == 'tag') getObj = pObj.getElementsByTagName(type);
    else if (from == 'ns') getObj = pObj.getElementsByTagNameNS(value, type);
  }
  chObj = (child >= 0) ? getObj[child] : getObj;
  if (content && chObj) {
    if (type == 'html' || type == 'body' || type == 'div' || type == 'option') coObj = chObj.innerHTML;
    else if (type == 'object') coObj = chObj.data;
    else coObj = chObj.textContent;
    return coObj;
  }
  else {
    return chObj;
  }
}

function modifyMyElement(obj, type, content, clear) {
  if (content) {
    if (type == 'div') obj.innerHTML = content;
    else if (type == 'option') {
      obj.value = content;
      obj.innerHTML = content;
    }
  }
  if (clear) {
    if (obj.hasChildNodes()) {
      while (obj.childNodes.length >= 1) {
        obj.removeChild(obj.firstChild);
      }
    }
  }
}

function styleMyElement(obj, styles) {
  for (var property in styles) {
    if (styles.hasOwnProperty(property)) obj.style[property] = styles[property];
  }
}

function appendMyElement(parent, child) {
  parent.appendChild(child);
}

function removeMyElement(parent, child) {
  parent.removeChild(child);
}

function replaceMyElement(parent, orphan, child) {
  parent.replaceChild(orphan, child);
}

function createMySaver() {
  /* Get My Options */
  getMyOptions();

  /* The Panel */
  saver['saverPanel'] = createMyElement('div', '', '', '', '');
  styleMyElement(saver['saverPanel'], {position: 'fixed', backgroundColor: '#FFFFFF', padding: '5px 5px 10px 5px', bottom: '0px', right: '25px', zIndex: '2000000000', borderTop: '3px solid #EEEEEE', borderLeft: '3px solid #EEEEEE', borderRight: '3px solid #EEEEEE', borderRadius: '5px 5px 0px 0px'});
  appendMyElement(page.body, saver['saverPanel']);

  /* Warnings */
  if (saver['warnMess']) {
    if (saver['warnContent']) showMyMessage(saver['warnMess'], saver['warnContent']);
    else showMyMessage(saver['warnMess']);
    return;
  }

  /* Panel Items */
  saver['panelHeight'] = 18;
  var panelItemBorder = 1;
  var panelItemHeight = saver['panelHeight'] - panelItemBorder * 2;

  /* Panel Logo */
  saver['panelLogo'] = createMyElement('div', userscript + ': ', 'click', 'logo', '');
  saver['panelLogo'].title = '{SaveTube: click to visit the script web page}';
  styleMyElement(saver['panelLogo'], {height: panelItemHeight + 'px', padding: '0px', display: 'inline', color: '#336699', fontSize: '12px', fontWeight: 'bold', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
  appendMyElement(saver['saverPanel'], saver['panelLogo']);

  /* Panel Video Menu */
  saver['videoMenu'] = createMyElement('select', '', 'change', '', 'video');
  saver['videoMenu'].title = '{Videos: select the video format for download}';
  styleMyElement(saver['videoMenu'], {width: '200px', height: panelItemHeight + 'px', border: '1px solid transparent', padding: '0px', display: 'inline', backgroundColor: 'inherit', color: '#336699', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
  appendMyElement(saver['saverPanel'], saver['videoMenu'] );
  for (var videoCode in saver['videoList']) {
    saver['videoItem'] = createMyElement('option', videoCode, '', '', '');
    styleMyElement(saver['videoItem'], {padding: '0px', display: 'block', color: '#336699', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
    if (videoCode.indexOf('Video') != -1 || videoCode.indexOf('Audio') != -1) styleMyElement(saver['videoItem'], {color: '#8F6B32'});
    if (saver['videoList'][videoCode] == 'DASH') styleMyElement(saver['videoItem'], {color: '#CF4913'});
    if (saver['videoList'][videoCode] != 'DASH' || option['dash']) appendMyElement(saver['videoMenu'], saver['videoItem']);
    else delete saver['videoList'][videoCode];
  }

  /* Panel Get Button */
  saver['buttonGet'] = createMyElement('div', 'Get', 'click', 'get', '');
  saver['buttonGet'].title = '{Get: click to download the selected video format}';
  styleMyElement(saver['buttonGet'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#C000C0', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
  if (option['autoget']) styleMyElement(saver['buttonGet'], {display: 'none'});
  appendMyElement(saver['saverPanel'], saver['buttonGet']);

  /* Panel Autoget Button */
  if (feature['autoget']) {
    saver['buttonAutoget'] = createMyElement('div', 'AG', 'click', 'autoget', '');
    saver['buttonAutoget'].title = '{Autoget: click to enable/disable auto download on page load}';
    styleMyElement(saver['buttonAutoget'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#CCCCCC', fontSize: '12px', cursor: 'pointer'});
    if (option['autoget']) styleMyElement(saver['buttonAutoget'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
    appendMyElement(saver['saverPanel'], saver['buttonAutoget']);
  }

  /* Panel Definition Button */
  if (feature['definition']) {
    saver['buttonDefinition'] = createMyElement('div', option['definition'], 'click', 'definition', '');
    saver['buttonDefinition'].title = '{Definition: click to change the preferred video definition}';
    styleMyElement(saver['buttonDefinition'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#008000', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
    appendMyElement(saver['saverPanel'], saver['buttonDefinition']);
  }

  /* Panel Container Button */
  if (feature['container']) {
    saver['buttonContainer'] = createMyElement('div', option['container'], 'click', 'container', '');
    saver['buttonContainer'].title = '{Container: click to change the preferred video container}';
    styleMyElement(saver['buttonContainer'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#008000', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
    appendMyElement(saver['saverPanel'], saver['buttonContainer']);
  }

  /* Panel DASH Button */
  if (feature['dash']) {
    saver['buttonDASH'] = createMyElement('div', 'MD', 'click', 'dash', '');
    saver['buttonDASH'].title = '{MPEG-DASH: click to enable/disable DASH download using the SaveTube protocol}';
    styleMyElement(saver['buttonDASH'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#CCCCCC', fontSize: '12px', cursor: 'pointer'});
    if (option['dash']) styleMyElement(saver['buttonDASH'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
    appendMyElement(saver['saverPanel'], saver['buttonDASH']);
  }

  /* Panel Move Button */
  saver['buttonMove'] = createMyElement('div', '<', 'click', 'move', '');
  saver['buttonMove'].title = '{Move: click to toggle left/right panel position}';
  styleMyElement(saver['buttonMove'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#CCCCCC', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
  appendMyElement(saver['saverPanel'], saver['buttonMove']);

  /* Disabled Features */
  if (!feature['autoget']) option['autoget'] = false;
  if (!feature['dash']) option['dash'] = false;

  /* Select The Video */
  if (feature['definition'] || feature['container']) selectMyVideo();

  /* Get The Video On Autoget */
  if (option['autoget']) getMyVideo();
}

function selectMyVideo() {
  var vdoCont = (option['container'] != 'Any') ? [option['container']] : option['containers'];
  var vdoDef = option['definitions'];
  var vdoList = {};
  for (var vC = 0; vC < vdoCont.length; vC++) {
    if (vdoCont[vC] != 'Any') {
      for (var vD = 0; vD < vdoDef.length; vD++) {
	var format = vdoDef[vD] + ' ' + vdoCont[vC];
	if (!vdoList[vdoDef[vD]]) {
	  for (var vL in saver['videoList']) {
	    if (vL == format) {
	      vdoList[vdoDef[vD]] = vL;
	      break;
	    }
	  }
	}
      }
    }
  }
  if (option['definition'] == 'UHD') {
    if (vdoList['Ultra High Definition']) saver['videoSave'] = vdoList['Ultra High Definition'];
    else if (vdoList['Full High Definition']) saver['videoSave'] = vdoList['Full High Definition'];
    else if (vdoList['High Definition']) saver['videoSave'] = vdoList['High Definition'];
    else if (vdoList['Standard Definition']) saver['videoSave'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'FHD') {
    if (vdoList['Full High Definition']) saver['videoSave'] = vdoList['Full High Definition'];
    else if (vdoList['High Definition']) saver['videoSave'] = vdoList['High Definition'];
    else if (vdoList['Standard Definition']) saver['videoSave'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'HD') {
    if (vdoList['High Definition']) saver['videoSave'] = vdoList['High Definition'];
    else if (vdoList['Standard Definition']) saver['videoSave'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'SD') {
    if (vdoList['Standard Definition']) saver['videoSave'] = vdoList['Standard Definition'];
    else if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'LD') {
    if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
    else if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
  }
  else if (option['definition'] == 'VLD') {
    if (vdoList['Very Low Definition']) saver['videoSave'] = vdoList['Very Low Definition'];
    else if (vdoList['Low Definition']) saver['videoSave'] = vdoList['Low Definition'];
  }
  saver['videoMenu'].value = saver['videoSave'];
}

function getMyVideo() {
  var vdoURL = saver['videoList'][saver['videoSave']];
  if (saver['videoTitle']) {
    var vdoD = ' (' + saver['videoSave'] + ')';
    vdoD = vdoD.replace(/Ultra High Definition/, 'UHD');
    vdoD = vdoD.replace(/Full High Definition/, 'FHD');
    vdoD = vdoD.replace(/High Definition/, 'HD');
    vdoD = vdoD.replace(/Standard Definition/, 'SD');
    vdoD = vdoD.replace(/Very Low Definition/, 'VLD');
    vdoD = vdoD.replace(/Low Definition/, 'LD');
    vdoD = vdoD.replace(/\sFLV|\sMP4|\sWebM|\s3GP/g, '');
    vdoURL = vdoURL + '&title=' + saver['videoTitle'] + vdoD;
  }
  if (saver['videoList'][saver['videoSave']] == 'DASH') {
    if (saver['videoSave'].indexOf('MP4') != -1) {
      var vdoV = saver['videoList'][saver['videoSave'].replace(/MP4/, 'Video MP4')];
      if (saver['videoList']['High Bitrate Audio MP4']) {
	var vdoA = saver['videoList']['High Bitrate Audio MP4'];
      }
      else if (saver['videoList']['Medium Bitrate Audio MP4']) {
	var vdoA = saver['videoList']['Medium Bitrate Audio MP4'];
      }
      else {
	var vdoA = saver['videoList']['Low Bitrate Audio MP4'];
      }
    }
    else {
      var vdoV = saver['videoList'][saver['videoSave'].replace(/WebM/, 'Video WebM')];
      if (saver['videoList']['High Bitrate Audio Opus']) {
	var vdoA = saver['videoList']['High Bitrate Audio Opus'];
      }
      else if (saver['videoList']['Medium Bitrate Audio Opus']) {
	var vdoA = saver['videoList']['Medium Bitrate Audio Opus'];
      }
      else {
	var vdoA = saver['videoList']['Low Bitrate Audio Opus'];
      }
    }
    var vdoT = 'video';
    if (saver['videoTitle']) vdoT = saver['videoTitle'] + vdoD;
    vdoURL = 'savetube:' + vdoT + '=SAVETUBE=' + vdoV + '=SAVETUBE=' + vdoA;
  }
  if (feature['autoget'] && !saver['videoSave'].match(/(Video|Audio)/)) page.win.location.href = vdoURL;
  else {
    var vdoLink = 'Get <a href="' + vdoURL + '" style="color:#00892C">Link</a>';
    modifyMyElement(saver['buttonGet'] , 'div', vdoLink, false);
  }
}

function cleanMyContent(content, unesc) {
  var myNewContent = content;
  if (unesc) myNewContent = unescape(myNewContent);
  myNewContent = myNewContent.replace(/\\u0025/g,'%');
  myNewContent = myNewContent.replace(/\\u0026/g,'&');
  myNewContent = myNewContent.replace(/\\/g,'');
  myNewContent = myNewContent.replace(/\n/g,'');
  return myNewContent;
}

function getMyContent(url, pattern, clean) {
  var myPageContent, myVideosParse, myVideosContent;
  var isIE = (navigator.appName.indexOf('Internet Explorer') != -1) ? true : false;
  var getMethod = (url != page.url || isIE) ? 'XHR' : 'DOM';
  if (!sources[url]) sources[url] = {};
  if (getMethod == 'DOM') {
    if (!sources[url]['DOM']) {
      sources[url]['DOM'] = getMyElement('', 'html', 'tag', '', 0, true);
      if (!sources[url]['DOM']) sources[url]['DOM'] = getMyElement('', 'body', '', '', -1, true);
    }
    myPageContent = sources[url]['DOM'];
    if (clean) myPageContent = cleanMyContent(myPageContent, true);
    myVideosParse = myPageContent.match(pattern);
    myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
    if (myVideosContent) return myVideosContent;
    else getMethod = 'XHR';
  }
  if (getMethod == 'XHR') {
    if (!sources[url]['XHR']) sources[url]['XHR'] = {};
    if ((pattern == 'XML' && !sources[url]['XHR']['XML']) || (pattern != 'XML' && !sources[url]['XHR']['TEXT'])) {
      var xmlHTTP = new XMLHttpRequest();
      xmlHTTP.open('GET', url, false);
      xmlHTTP.send();
      if (pattern == 'XML') sources[url]['XHR']['XML'] = xmlHTTP.responseXML;
      else sources[url]['XHR']['TEXT'] = xmlHTTP.responseText;
    }
    if (pattern == 'XML') {
      myVideosContent = sources[url]['XHR']['XML'];
    }
    else if (pattern == 'TEXT') {
      myVideosContent = sources[url]['XHR']['TEXT'];
    }
    else {
      myPageContent = sources[url]['XHR']['TEXT'];
      if (clean) myPageContent = cleanMyContent(myPageContent, true);
      myVideosParse = myPageContent.match(pattern);
      myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
    }
    return myVideosContent;
  }
}

function setMyOptions(key, value) {
  key = page.site + '_' + userscript.toLowerCase() + '_' + key;
  if (typeof GM_setValue === 'function') {
    GM_setValue(key, value);
    if (typeof GM_getValue === 'function' && GM_getValue(key) == value) return;
  }
  try {
    localStorage.setItem(key, value);
    if (localStorage.getItem(key) == value) return;
    else throw false;
  }
  catch(e) {
    var date = new Date();
    date.setTime(date.getTime() + (356*24*60*60*1000));
    var expires = '; expires=' + date.toGMTString();
    page.doc.cookie = key + '=' + value + expires + '; path=/';
  }
}

function getMyOptions() {
  for (var opt in option) {
    if (option.hasOwnProperty(opt)) {
      var key = page.site + '_' + userscript.toLowerCase() + '_' + opt;
      if (typeof GM_getValue === 'function') {
	if (GM_getValue(key)) {
	  option[opt] = GM_getValue(key);
	  continue;
	}
      }
      try {
	if (localStorage.getItem(key)) {
	  option[opt] = localStorage.getItem(key);
	  continue;
	}
	else throw false;
      }
      catch(e) {
	var cookies = page.doc.cookie.split(';');
	for (var i=0; i < cookies.length; i++) {
	  var cookie = cookies[i];
	  while (cookie.charAt(0) == ' ') cookie = cookie.substring(1, cookie.length);
	  option[opt] = (cookie.indexOf(key) == 0) ? cookie.substring(key.length + 1, cookie.length) : option[opt];
	}
      }
    }
  }
  option['autoget'] = (option['autoget'] === true || option['autoget'] == 'true') ? true : false;
  option['dash'] = (option['dash'] === true || option['dash'] == 'true') ? true : false;
}

function showMyMessage(cause, content) {
  styleMyElement(saver['saverPanel'], {color: '#AD0000', fontSize: '12px'});
  if (cause == '!content') {
    var myNoContentMess = '<b>SaveTube:</b> Couldn\'t get the videos content. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.';
    modifyMyElement(saver['saverPanel'], 'div', myNoContentMess, false);
  }
  else if (cause == '!videos') {
    var myNoVideosMess = '<b>SaveTube:</b> Couldn\'t get any video. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.';
    modifyMyElement(saver['saverPanel'], 'div', myNoVideosMess, false);
  }
  else if (cause == '!support') {
    var myNoSupportMess = '<b>SaveTube:</b> This video uses the RTMP protocol which is not supported.';
    modifyMyElement(saver['saverPanel'], 'div', myNoSupportMess, false);
  }
  else if (cause == 'embed') {
    var myEmbedMess = '<b>SaveTube:</b> This is an embedded video. You can get it <a href="' + content + '" style="color:#00892C">here</a>.';
    modifyMyElement(saver['saverPanel'], 'div', myEmbedMess, false);
  }
  else if (cause == 'other') {
    modifyMyElement(saver['saverPanel'], 'div', content, false);
  }
}


// ==========Websites========== //

// Force page reload on title and location change
page.win.setInterval(function() {
  if (page.title != page.doc.title && page.url != page.win.location.href) {
    page.title = page.doc.title;
    page.url = page.win.location.href;
    page.win.location.reload();
  }
}, 500);

// =====YouTube===== //

if (page.url.indexOf('youtube.com/watch') != -1) {

  /* Redirect Categories */
  if (page.url.indexOf('gaming.youtube.com') != -1) {
    page.win.location.href = page.url.replace('gaming', 'www');
  }

  /* Video Availability */
  var ytVideoUnavailable = getMyElement('', 'div', 'id', 'player-unavailable', -1, false);
  if (ytVideoUnavailable) {
    if (ytVideoUnavailable.className.indexOf('hid') == -1) {
      var ytAgeGateContent = getMyElement('', 'div', 'id', 'watch7-player-age-gate-content', -1, true);
      if (!ytAgeGateContent) return;
      else {
	if(ytAgeGateContent.indexOf('feature=private_video') != -1) return;
      }
    }
  }

  /* Decrypt Signature */
  var ytScriptSrc;
  function ytDecryptSignature(s) {return null;}
  function ytDecryptFunction() {
    var ytSignFuncName, ytSignFuncBody, ytSwapFuncName, ytSwapFuncBody, ytFuncMatch;
    ytScriptSrc = ytScriptSrc.replace(/(\r\n|\n|\r)/gm, '');
    ytSignFuncName = ytScriptSrc.match(/"signature"\s*,\s*(.*?)\(/);
    ytSignFuncName = (ytSignFuncName) ? ytSignFuncName[1] : null;
    if (ytSignFuncName) {
      ytFuncMatch = ytSignFuncName.replace(/\$/, '\\$') + '\\s*=\\s*function\\s*' + '\\s*\\(\\w+\\)\\s*\\{(.*?)\\}';
      ytSignFuncBody = ytScriptSrc.match(ytFuncMatch);
      ytSignFuncBody = (ytSignFuncBody) ? ytSignFuncBody[1] : null;
      if (ytSignFuncBody) {
	ytSwapFuncName = ytSignFuncBody.match(/((\$|_|\w)+)\.(\$|_|\w)+\(\w,[0-9]+\)/);
	ytSwapFuncName = (ytSwapFuncName) ? ytSwapFuncName[1] : null;
	if (ytSwapFuncName) {
	  ytFuncMatch = 'var\\s+' + ytSwapFuncName.replace(/\$/, '\\$') + '=\\s*\\{(.*?)\\};';
	  ytSwapFuncBody = ytScriptSrc.match(ytFuncMatch);
	  ytSwapFuncBody = (ytSwapFuncBody) ? ytSwapFuncBody[1] : null;
	}
	if (ytSwapFuncBody) ytSignFuncBody = 'var ' + ytSwapFuncName + '={' + ytSwapFuncBody + '};' + ytSignFuncBody;
	ytSignFuncBody = 'try {' + ytSignFuncBody + '} catch(e) {return null}';
	ytDecryptSignature = new Function('a', ytSignFuncBody);
      }
    }
  }

  /* Get Video Title */
  var ytVideoTitle = getMyContent(page.url, 'meta\\s+itemprop="name"\\s+content="(.*?)"', false);
  if (!ytVideoTitle) ytVideoTitle = getMyContent(page.url, 'meta\\s+property="og:title"\\s+content="(.*?)"', false);
  if (!ytVideoTitle) ytVideoTitle = page.doc.title;
  if (ytVideoTitle) {
    ytVideoTitle = ytVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
    ytVideoTitle = ytVideoTitle.replace(/&#39;/g, '\'').replace(/'/g, '\'');
    ytVideoTitle = ytVideoTitle.replace(/&amp;/g, 'and').replace(/&/g, 'and');
    ytVideoTitle = ytVideoTitle.replace(/\?/g, '').replace(/[#:\*]/g, '-').replace(/\//g, '-');
    ytVideoTitle = ytVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
    ytVideoTitle = ytVideoTitle.replace(/^YouTube\s-\s/, '');
  }

  /* Get Videos Content */
  var ytVideosEncodedFmts, ytVideosAdaptiveFmts, ytVideosContent, ytHLSVideos, ytHLSContent;
  ytVideosEncodedFmts = getMyContent(page.url, '"url_encoded_fmt_stream_map":\\s*"(.*?)"', false);
  if (!ytVideosEncodedFmts) ytVideosEncodedFmts = getMyContent(page.url, '\\\\"url_encoded_fmt_stream_map\\\\":\\s*\\\\"(.*?)\\\\"', false);
  ytVideosAdaptiveFmts = getMyContent(page.url, '"adaptive_fmts":\\s*"(.*?)"', false);
  if (!ytVideosAdaptiveFmts) ytVideosAdaptiveFmts = getMyContent(page.url, '\\\\"adaptive_fmts\\\\":\\s*\\\\"(.*?)\\\\"', false);
  if (ytVideosEncodedFmts) {
    ytVideosContent = ytVideosEncodedFmts;
  }
  else {
    ytHLSVideos = getMyContent(page.url, '"hlsvp":\\s*"(.*?)"', false);
    if (!ytHLSVideos) ytHLSVideos = getMyContent(page.url, '\\\\"hlsvp\\\\":\\s*\\\\"(.*?)\\\\"', false);
    if (ytHLSVideos) {
      ytHLSVideos = cleanMyContent(ytHLSVideos, false);
    }
    else {
      var ytVideoID = page.url.match(/(\?|&)v=(.*?)(&|$)/);
      ytVideoID = (ytVideoID) ? ytVideoID[2] : null;
      if (ytVideoID) {
	var ytVideoSts = getMyContent(page.url.replace(/watch.*?v=/, 'embed/').replace(/&.*$/, ''), '"sts"\\s*:\\s*(\\d+)', false);
	var ytVideosInfoURL = page.win.location.protocol + '//' + page.win.location.hostname + '/get_video_info?video_id=' + ytVideoID + '&eurl=https://youtube.googleapis.com/v/' + ytVideoID + '&sts=' + ytVideoSts;
	var ytVideosInfo = getMyContent(ytVideosInfoURL, 'TEXT', false);
	if (ytVideosInfo) {
	  ytVideosEncodedFmts = ytVideosInfo.match(/url_encoded_fmt_stream_map=(.*?)&/);
	  ytVideosEncodedFmts = (ytVideosEncodedFmts) ? ytVideosEncodedFmts[1] : null;
	  if (ytVideosEncodedFmts) {
	    ytVideosEncodedFmts = cleanMyContent(ytVideosEncodedFmts, true);
	    ytVideosContent = ytVideosEncodedFmts;
	  }
	  if (!ytVideosAdaptiveFmts) {
	    ytVideosAdaptiveFmts = ytVideosInfo.match(/adaptive_fmts=(.*?)&/);
	    ytVideosAdaptiveFmts = (ytVideosAdaptiveFmts) ? ytVideosAdaptiveFmts[1] : null;
	    if (ytVideosAdaptiveFmts) ytVideosAdaptiveFmts = cleanMyContent(ytVideosAdaptiveFmts, true);
	  }
	}
      }
    }
  }
  if (ytVideosAdaptiveFmts && !ytHLSVideos) {
    if (ytVideosContent) ytVideosContent += ',' + ytVideosAdaptiveFmts;
    else ytVideosContent = ytVideosAdaptiveFmts;
  }

  /* Create Saver */
  var ytDefaultVideo = 'Low Definition MP4';
  function ytSaver() {
    saver = {'videoList': ytVideoList, 'videoSave': ytDefaultVideo, 'videoTitle': ytVideoTitle};
    option['definitions'] = ['Ultra High Definition', 'Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
    option['containers'] = ['MP4', 'WebM', 'FLV', '3GP', 'Any'];
  }

  /* Parse Videos */
  function ytVideos() {
    var ytVideoFormats = {
      '5': 'Very Low Definition FLV',
      '17': 'Very Low Definition 3GP',
      '18': 'Low Definition MP4',
      '22': 'High Definition MP4',
      '34': 'Low Definition FLV',
      '35': 'Standard Definition FLV',
      '36': 'Low Definition 3GP',
      '37': 'Full High Definition MP4',
      '38': 'Ultra High Definition MP4',
      '43': 'Low Definition WebM',
      '44': 'Standard Definition WebM',
      '45': 'High Definition WebM',
      '46': 'Full High Definition WebM',
      '82': 'Low Definition 3D MP4',
      '83': 'Standard Definition 3D MP4',
      '84': 'High Definition 3D MP4',
      '85': 'Full High Definition 3D MP4',
      '100': 'Low Definition 3D WebM',
      '101': 'Standard Definition 3D WebM',
      '102': 'High Definition 3D WebM',
      '135': 'Standard Definition Video MP4',
      '136': 'High Definition Video MP4',
      '137': 'Full High Definition Video MP4',
      '138': 'Ultra High Definition Video MP4',
      '139': 'Low Bitrate Audio MP4',
      '140': 'Medium Bitrate Audio MP4',
      '141': 'High Bitrate Audio MP4',
      '171': 'Medium Bitrate Audio WebM',
      '172': 'High Bitrate Audio WebM',
      '244': 'Standard Definition Video WebM',
      '247': 'High Definition Video WebM',
      '248': 'Full High Definition Video WebM',
      '249': 'Low Bitrate Audio Opus',
      '250': 'Medium Bitrate Audio Opus',
      '251': 'High Bitrate Audio Opus',
      '266': 'Ultra High Definition Video MP4',
      '272': 'Ultra High Definition Video WebM',
      '298': 'High Definition Video MP4',
      '299': 'Full High Definition Video MP4',
      '302': 'High Definition Video WebM',
      '303': 'Full High Definition Video WebM',
      '313': 'Ultra High Definition Video WebM'
    };
    var ytVideoFound = false;
    var ytVideos = ytVideosContent.split(',');
    var ytVideoParse, ytVideoCodeParse, ytVideoCode, myVideoCode, ytVideo;
    for (var i = 0; i < ytVideos.length; i++) {
      if (!ytVideos[i].match(/^url/)) {
	ytVideoParse = ytVideos[i].match(/(.*)(url=.*$)/);
	if (ytVideoParse) ytVideos[i] = ytVideoParse[2] + '&' + ytVideoParse[1];
      }
      ytVideoCodeParse = ytVideos[i].match(/itag=(\d{1,3})/);
      ytVideoCode = (ytVideoCodeParse) ? ytVideoCodeParse[1] : null;
      if (ytVideoCode) {
	myVideoCode = ytVideoFormats[ytVideoCode];
	if (myVideoCode) {
	  ytVideo = cleanMyContent(ytVideos[i], true);
	  ytVideo = ytVideo.replace(/url=/, '').replace(/&$/, '');
	  if (ytVideo.match(/itag=/) && ytVideo.match(/itag=/g).length > 1) {
	    if (ytVideo.match(/itag=\d{1,3}&/)) ytVideo = ytVideo.replace(/itag=\d{1,3}&/, '');
	    else if (ytVideo.match(/&itag=\d{1,3}/)) ytVideo = ytVideo.replace(/&itag=\d{1,3}/, '');
	  }
	  if (ytVideo.match(/clen=/) && ytVideo.match(/clen=/g).length > 1) {
	    if (ytVideo.match(/clen=\d+&/)) ytVideo = ytVideo.replace(/clen=\d+&/, '');
	    else if (ytVideo.match(/&clen=\d+/)) ytVideo = ytVideo.replace(/&clen=\d+/, '');
	  }
	  if (ytVideo.match(/lmt=/) && ytVideo.match(/lmt=/g).length > 1) {
	    if (ytVideo.match(/lmt=\d+&/)) ytVideo = ytVideo.replace(/lmt=\d+&/, '');
	    else if (ytVideo.match(/&lmt=\d+/)) ytVideo = ytVideo.replace(/&lmt=\d+/, '');
	  }
	  if (ytVideo.match(/type=(video|audio).*?&/)) ytVideo = ytVideo.replace(/type=(video|audio).*?&/, '');
	  else ytVideo = ytVideo.replace(/&type=(video|audio).*$/, '');
	  if (ytVideo.match(/&xtags=/)) ytVideo = ytVideo.replace(/&xtags=/, '');
	  if (ytVideo.match(/&sig=/)) ytVideo = ytVideo.replace (/&sig=/, '&signature=');
	  else if (ytVideo.match(/&s=/)) {
	    var ytSig = ytVideo.match(/&s=(.*?)(&|$)/);
	    if (ytSig) {
	      var s = ytSig[1];
	      s = ytDecryptSignature(s);
	      if (s) ytVideo = ytVideo.replace(/&s=.*?(&|$)/, '&signature=' + s + '$1');
	      else ytVideo = '';
	    }
	    else ytVideo = '';
	  }
	  ytVideo = cleanMyContent(ytVideo, true);
	  if (ytVideo.indexOf('ratebypass') == -1) ytVideo += '&ratebypass=yes';
	  if (ytVideo && ytVideo.indexOf('http') == 0) {
	    if (!ytVideoFound) ytVideoFound = true;
	    ytVideoList[myVideoCode] = ytVideo;
	  }
	}
      }
    }

    if (ytVideoFound) {
      /* DASH */
      if (!ytVideoList['Standard Definition MP4'] && ytVideoList['Standard Definition Video MP4']) ytVideoList['Standard Definition MP4'] = 'DASH';
      if (!ytVideoList['High Definition MP4'] && ytVideoList['High Definition Video MP4']) ytVideoList['High Definition MP4'] = 'DASH';
      if (!ytVideoList['Full High Definition MP4'] && ytVideoList['Full High Definition Video MP4']) ytVideoList['Full High Definition MP4'] = 'DASH';
      if (!ytVideoList['Ultra High Definition MP4'] && ytVideoList['Ultra High Definition Video MP4']) ytVideoList['Ultra High Definition MP4'] = 'DASH';
      if (!ytVideoList['Standard Definition WebM'] && ytVideoList['Standard Definition Video WebM']) ytVideoList['Standard Definition WebM'] = 'DASH';
      if (!ytVideoList['High Definition WebM'] && ytVideoList['High Definition Video WebM']) ytVideoList['High Definition WebM'] = 'DASH';
      if (!ytVideoList['Full High Definition WebM'] && ytVideoList['Full High Definition Video WebM']) ytVideoList['Full High Definition WebM'] = 'DASH';
      if (!ytVideoList['Ultra High Definition WebM'] && ytVideoList['Ultra High Definition Video WebM']) ytVideoList['Ultra High Definition WebM'] = 'DASH';
      feature['dash'] = true;

      /* Create Saver */
      feature['autoget'] = true;
      ytSaver();
      createMySaver();
    }
    else {
      saver = {};
      if (ytVideosContent.indexOf('conn=rtmp') != -1) saver['warnMess'] = '!support';
      else saver['warnMess'] = '!videos';
      createMySaver();
    }
  }

  /* Parse HLS */
  function ytHLS() {
    var ytHLSFormats = {
      '92': 'Very Low Definition MP4',
      '93': 'Low Definition MP4',
      '94': 'Standard Definition MP4',
      '95': 'High Definition MP4',
      '96': 'Full High Definition MP4'
    };
    ytVideoList["Any Definition MP4"] = ytHLSVideos;
    if (ytHLSContent) {
      var ytHLSVideo, ytVideoCodeParse, ytVideoCode, myVideoCode;
      var ytHLSMatcher = new RegExp('(http.*?m3u8)', 'g');
      ytHLSVideos = ytHLSContent.match(ytHLSMatcher);
      if (ytHLSVideos) {
	for (var i = 0; i < ytHLSVideos.length; i++) {
	  ytHLSVideo = ytHLSVideos[i];
	  ytVideoCodeParse = ytHLSVideo.match(/\/itag\/(\d{1,3})\//);
	  ytVideoCode = (ytVideoCodeParse) ? ytVideoCodeParse[1] : null;
	  if (ytVideoCode) {
	    myVideoCode = ytHLSFormats[ytVideoCode];
	    if (myVideoCode && ytHLSVideo) {
	      ytVideoList[myVideoCode] = ytHLSVideo;
	    }
	  }
	}
      }
    }

    /* Create Saver */
    ytVideoTitle = null;
    ytDefaultVideo = 'Any Definition MP4';
    ytSaver();
    createMySaver();
  }

  /* Get Videos */
  var ytVideoList = {};
  if (ytVideosContent) {
    if (ytVideosContent.match(/&s=/) || ytVideosContent.match(/,s=/) || ytVideosContent.match(/u0026s=/)) {
      var ytScriptURL = getMyContent(page.url, '"js":\\s*"(.*?)"', true);
      if (!ytScriptURL) ytScriptURL = getMyContent(page.url.replace(/watch.*?v=/, 'embed/').replace(/&.*$/, ''), '"js":\\s*"(.*?)"', true);
      if (ytScriptURL) {
	ytScriptURL = page.win.location.protocol + ytScriptURL;
	try {
	  ytScriptSrc = getMyContent(ytScriptURL, 'TEXT', false);
	  if (ytScriptSrc) ytDecryptFunction();
	  ytVideos();
	}
	catch(e) {
	  try {
	    GM_xmlhttpRequest({
	      method: 'GET',
	      url: ytScriptURL,
	      onload: function(response) {
		if (response.readyState === 4 && response.status === 200 && response.responseText) {
		  ytScriptSrc = response.responseText;
		  ytDecryptFunction();
		  ytVideos();
		}
		else {
		  saver = {
		    'warnMess': 'other',
		    'warnContent': '<b>SaveTube:</b> Couldn\'t get the signature content. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.'
		  };
		  createMySaver();
		}
	      },
	      onerror: function() {
		saver = {
		  'warnMess': 'other',
		  'warnContent': '<b>SaveTube:</b> Couldn\'t make the request. Make sure your browser user scripts extension supports cross-domain requests.'
		};
		createMySaver();
	      }
	    });
	  }
	  catch(e) {
	    saver = {
	      'warnMess': 'other',
	      'warnContent': '<b>SaveTube:</b> Couldn\'t make the request. Make sure your browser user scripts extension supports cross-domain requests.'
	    };
	    createMySaver();
	  }
	}
      }
      else {
	saver = {
	  'warnMess': 'other',
	  'warnContent': '<b>SaveTube:</b> Couldn\'t get the signature link. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.'
	};
	createMySaver();
      }
    }
    else {
      ytVideos();
    }
  }
  else {
    if (ytHLSVideos) {
      try {
	ytHLSContent = getMyContent(ytHLSVideos, 'TEXT', false);
	ytHLS();
      }
      catch(e) {
	try {
	  GM_xmlhttpRequest({
	    method: 'GET',
	    url: ytHLSVideos,
	    onload: function(response) {
	      if (response.readyState === 4 && response.status === 200 && response.responseText) {
		ytHLSContent = response.responseText;
	      }
	      ytHLS();
	    },
	    onerror: function() {
	      ytHLS();
	    }
	  });
	}
	catch(e) {
	  ytHLS();
	}
      }
    }
    else {
      saver = {'warnMess': '!content'};
      createMySaver();
    }
  }

}

// =====DailyMotion===== //

else if (page.url.indexOf('dailymotion.com/video') != -1) {

  /* Get Videos Content */
  var dmVideosContent = getMyContent(page.url, '"qualities":\\{(.*?)\\]\\},', false);
  if (!dmVideosContent) dmVideosContent = getMyContent(page.url.replace(/\/video\//, "/embed/video/"), '"qualities":\\{(.*?)\\]\\},', false);

  /* Get Videos */
  if (dmVideosContent) {
    var dmVideoFormats = {'240': 'Very Low Definition MP4', '380': 'Low Definition MP4', '480': 'Standard Definition MP4',
			  '720': 'High Definition MP4', '1080': 'Full High Definition MP4'};
    var dmVideoList = {};
    var dmVideoFound = false;
    var dmVideoParser, dmVideoParse, myVideoCode, dmVideo;
    for (var dmVideoCode in dmVideoFormats) {
      dmVideoParser = '"' + dmVideoCode + '".*?"url":"(.*?)"';
      dmVideoParse = dmVideosContent.match(dmVideoParser);
      dmVideo = (dmVideoParse) ? dmVideoParse[1] : null;
      if (dmVideo) {
	if (!dmVideoFound) dmVideoFound = true;
	dmVideo = cleanMyContent(dmVideo, true);
	myVideoCode = dmVideoFormats[dmVideoCode];
	if (!dmVideoList[myVideoCode]) dmVideoList[myVideoCode] = dmVideo;
      }
    }

    if (dmVideoFound) {
      /* Create Saver */
      var dmDefaultVideo = 'Low Definition MP4';
      saver = {'videoList': dmVideoList, 'videoSave': dmDefaultVideo};
      feature['container'] = false;
      option['definitions'] = ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver();
    }
    else {
      saver = {'warnMess': '!videos'};
      createMySaver();
    }
  }
  else {
    saver = {'warnMess': '!content'};
    createMySaver();
  }

}

// =====Vimeo===== //

else if (page.url.match(/vimeo.com\/\d+/) || page.url.match(/vimeo.com\/channels\/[^\/]*($|\/$|\/page|\/\d+)/) || page.url.match(/vimeo.com\/originals\/[^\/]*($|\/$|\/\d+)/) || page.url.match(/vimeo.com\/album\/\d+\/video\/\d+/) || page.url.match(/vimeo.com\/groups\/[^\/]*\/videos\/\d+/)) {

  /* Multi Video Page */
  if (getMyElement('', 'div', 'class', 'player_container', -1, false).length > 1) return;

  /* Get Content Source */
  var viVideoSource = getMyContent(page.url, '"config_url":"(.*?)"', false);
  if (viVideoSource) viVideoSource = cleanMyContent(viVideoSource, false);
  else viVideoSource = getMyContent(page.url, 'data-config-url="(.*?)"', false).replace(/&amp;/g, '&');

  /* Get Videos Content */
  var viVideosContent;
  if (viVideoSource) {
    viVideosContent = getMyContent(viVideoSource, '"progressive":\\[(.*?)\\]', false);
  }

  /* Get Videos */
  if (viVideosContent) {
    var viVideoFormats = {'1080p': 'Full High Definition MP4', '720p': 'High Definition MP4', '480p': 'Standard Definition MP4', '360p': 'Low Definition MP4', '270p': 'Very Low Definition MP4'};
    var viVideoList = {};
    var viVideoFound = false;
    var viVideo, myVideoCode;
    var viVideos = viVideosContent.split('},');
    for (var i = 0; i < viVideos.length; i++) {
      for (var viVideoCode in viVideoFormats) {
	if (viVideos[i].indexOf('"quality":"' + viVideoCode + '"') != -1) {
	  viVideo = viVideos[i].match(/"url":"(.*?)"/);
	  viVideo = (viVideo) ? viVideo[1] : null;
	  if (viVideo) {
	    if (!viVideoFound) viVideoFound = true;
	    myVideoCode = viVideoFormats[viVideoCode];
	    viVideoList[myVideoCode] = viVideo;
	  }
	}
      }
    }

    if (viVideoFound) {
      /* Create Saver */
      var viDefaultVideo = 'Low Definition MP4';
      saver = {'videoList': viVideoList, 'videoSave': viDefaultVideo};
      feature['container'] = false;
      option['definitions'] = ['High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver();
    }
    else {
      saver = {'warnMess': '!videos'};
      createMySaver();
    }
  }
  else {
    saver = {'warnMess': '!content'};
    createMySaver();
  }

}

// =====MetaCafe===== //

else if (page.url.indexOf('metacafe.com/watch') != -1) {

  /* Get Videos Content */
  var mcVideosContent = getMyContent(page.url, 'flashvars\\s*=\\s*\\{(.*?)\\};', false);

  /* Get Videos */
  if (mcVideosContent) {
    var mcVideoList = {};
    var mcVideoFound = false;
    var mcVideoFormats = {'video_alt_url2': 'High Definition MP4', 'video_alt_url': 'Low Definition MP4', 'video_url': 'Very Low Definition MP4'};
    var mcVideoFormatz = {'video_alt_url2': '_720p', 'video_alt_url': '_360p', 'video_url': '_240p'};
    var mcVideoHLS = mcVideosContent.match(/"src":"(.*?)"/);
    mcVideoHLS = (mcVideoHLS) ? cleanMyContent(mcVideoHLS[1], false) : null;
    if (mcVideoHLS) {
      var mcVideoParser, mcVideoParse, myVideoCode, mcVideo;
      for (var mcVideoCode in mcVideoFormats) {
	mcVideoParser = '"' + mcVideoCode + '":"(.*?)"';
	mcVideoParse = mcVideosContent.match(mcVideoParser);
	mcVideo = (mcVideoParse) ? mcVideoParse[1] : null;
	if (mcVideo) {
	  if (!mcVideoFound) mcVideoFound = true;
	  myVideoCode = mcVideoFormats[mcVideoCode];
	  mcVideoList[myVideoCode] = mcVideoHLS.replace('.m3u8', mcVideoFormatz[mcVideoCode] + '.m3u8');
	}
      }
    }

    if (mcVideoFound) {
      /* Create Saver */
      var mcDefaultVideo = 'Low Definition MP4';
      saver = {'videoList': mcVideoList, 'videoSave': mcDefaultVideo};
      feature['container'] = false;
      option['definitions'] = ['High Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver();
    }
    else {
      saver = {'warnMess': '!videos'};
      createMySaver();
    }
  }
  else {
    saver = {};
    var ytVideoId = page.url.match(/\/yt-(.*?)\//);
    if (ytVideoId && ytVideoId[1]) {
      var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId[1];
      saver['warnMess'] = 'embed';
      saver['warnContent'] = ytVideoLink;
    }
    else saver['warnMess'] = '!videos';
    createMySaver();
  }

}

// =====Break===== //

else if (page.url.indexOf('break.com/video') != -1 || page.url.indexOf('break.com/movies') != -1) {

  /* Get Video ID */
  var brVideoID = page.url.match(/-(\d+)($|\?)/);
  brVideoID = (brVideoID) ? brVideoID[1] : null;

  /* Get Videos Content */
  var brSource = page.win.location.protocol + '//' + page.win.location.hostname + '/embed/' + brVideoID;
  var brVideosContent = getMyContent(brSource, 'TEXT', false);

  /* Get Videos */
  if (brVideosContent) {
    var brVideoList = {};
    var brVideoFormats = {};
    var brVideoFound = false;
    var brVideoFormats = {'320_kbps.mp4': 'Very Low Definition MP4', '496_kbps.mp4': 'Low Definition MP4', '864_kbps.mp4': 'Standard Definition MP4', '2240_kbps.mp4': 'High Definition MP4', '3264_kbps.mp4': 'Full High Definition MP4'};
    var brVideoPath, brVideoToken, brVideoThumb, brVideo, myVideoCode;
    brVideoPath = brVideosContent.match(/"videoUri":\s"(.*?)496_kbps/);
    brVideoPath = (brVideoPath) ? brVideoPath[1] : null;
    brVideoToken = brVideosContent.match(/"AuthToken":\s"(.*?)"/);
    brVideoToken = (brVideoToken) ? brVideoToken[1] : null;
    if (brVideoPath && brVideoToken) {
      for (var brVideoCode in brVideoFormats) {
	if (brVideosContent.match(brVideoPath + brVideoCode)) {
	  if (!brVideoFound) brVideoFound = true;
	  myVideoCode = brVideoFormats[brVideoCode];
	  brVideo = brVideoPath + brVideoCode + '?' + brVideoToken;
	  brVideoList[myVideoCode] = brVideo;
	}
      }
    }

    if (brVideoFound) {
      /* Create Saver */
      var brDefaultVideo = 'Low Definition MP4';
      saver = {'videoList': brVideoList, 'videoSave': brDefaultVideo};
      option['definitions'] = ['Very Low Definition', 'Low Definition', 'Standard Definition', 'High Definition', 'Full High Definition'];
      option['containers'] = ['MP4', 'FLV', 'Any'];
      createMySaver();
    }
    else {
      saver = {};
      var ytVideoId =  brVideosContent.match(/"youtubeId":\s"(.*?)"/);
      if (ytVideoId && ytVideoId[1]) {
	var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId[1];
	saver['warnMess'] = 'embed';
	saver['warnContent'] = ytVideoLink;
      }
      else saver['warnMess'] = '!videos';
      createMySaver();
    }
  }
  else {
    saver = {'warnMess': '!content'};
    createMySaver();
  }

}

// =====FunnyOrDie===== //

else if (page.url.indexOf('funnyordie.com/videos') != -1) {

  /* Get Videos Content */
  var fodVideosContent = getMyContent(page.url, '<video([\\s\\S]*?)video>', false);

  /* Get Videos */
  if (fodVideosContent) {
    var fodVideoFormats = {'v2500.mp4': 'High Definition MP4', 'v1800.mp4': 'Standard Definition MP4', 'v600.mp4': 'Low Definition MP4', 'v600.webm': 'Low Definition WebM', 'v110.mp4': 'Very Low Definition MP4'};
    var fodVideoList = {};
    var fodVideoFound = false;
    var fodVideoPath, fodVideoCodes, fodVideo, myVideoCode;
    fodVideoPath = fodVideosContent.match(/src="(.*?)v\d+.*?\.mp4"/);
    fodVideoPath = (fodVideoPath) ? fodVideoPath[1] : null;
    fodVideoCodes = fodVideosContent.match(/v([^\/]*?)\/master/);
    fodVideoCodes = (fodVideoCodes) ? fodVideoCodes[1] : '';
    if (fodVideoPath) {
      if (fodVideoCodes) {
	for (var fodVideoCode in fodVideoFormats) {
	  if (fodVideoCodes.indexOf(fodVideoCode.replace(/v/, '').replace(/\..*/, '')) != -1) {
	    if (!fodVideoFound) fodVideoFound = true;
	    fodVideo = fodVideoPath + fodVideoCode;
	    myVideoCode = fodVideoFormats[fodVideoCode];
	    fodVideoList[myVideoCode] = fodVideo;
	  }
	}
      }
      else {
	for (var fodVideoCode in fodVideoFormats) {
	  fodVideo = fodVideoPath + fodVideoCode;
	  if (fodVideosContent.match(fodVideo)) {
	    if (!fodVideoFound) fodVideoFound = true;
	    myVideoCode = fodVideoFormats[fodVideoCode];
	    fodVideoList[myVideoCode] = fodVideo;
	  }
	}
      }
    }

    if (fodVideoFound) {
      /* Create Saver */
      fodDefaultVideo = 'Low Definition MP4';
      saver = {'videoList': fodVideoList, 'videoSave': fodDefaultVideo};
      feature['container'] = false;
      option['definitions'] = ['High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver();
    }
    else {
      saver = {'warnMess': '!videos'};
      createMySaver();
    }
  }
  else {
    saver = {'warnMess': '!content'};
    createMySaver();
  }


}

// =====Veoh===== //

else if (page.url.indexOf('veoh.com/watch') != -1) {

  /* Get Video Availability */
  if (getMyElement('', 'div', 'class', 'veoh-video-player-error', 0, false)) return;

  /* Get Videos Content */
  var veVideosContent = getMyContent(page.url, '__watch.videoDetailsJSON = \'\\{(.*?)\\}', false);
  veVideosContent = cleanMyContent(veVideosContent, true);

  /* Get Videos */
  if (veVideosContent) {
    var veVideoFormats = {'fullPreviewHashLowPath': 'Very Low Definition MP4', 'fullPreviewHashHighPath': 'Low Definition MP4'};
    var veVideoList = {};
    var veVideoFound = false;
    var veVideoParser, veVideoParse, veVideo, myVideoCode;
    for (var veVideoCode in veVideoFormats) {
      veVideoParser = veVideoCode + '":"(.*?)"';
      veVideoParse = veVideosContent.match(veVideoParser);
      veVideo = (veVideoParse) ? veVideoParse[1] : null;
      if (veVideo) {
	if (!veVideoFound) veVideoFound = true;
	myVideoCode = veVideoFormats[veVideoCode];
	veVideoList[myVideoCode] = veVideo;
      }
    }

    if (veVideoFound) {
      /* Create Saver */
      var veDefaultVideo = 'Low Definition MP4';
      saver = {'videoList': veVideoList, 'videoSave': veDefaultVideo};
      feature['container'] = false;
      feature['fullsize'] = false;
      option['definition'] = 'LD';
      option['definitions'] = ['Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver();
    }
    else {
      saver = {};
      var veVideoSource = getMyContent(page.url, '"videoContentSource":"(.*?)"', false);
      if (veVideoSource == 'YouTube') var ytVideoId = getMyContent(page.url, '"videoId":"yapi-(.*?)"', false);
      if (ytVideoId) {
	var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId;
	saver['warnMess'] = 'embed';
	saver['warnContent'] = ytVideoLink;
	styleMyElement(vePlayerWindow, {margin: '0px 0px 20px 0px'});
      }
      else saver['warnMess'] = '!videos';
      createMySaver();
    }
  }
  else {
    saver = {'warnMess': '!content'};
    createMySaver();
  }

}

// =====Viki===== //

else if (page.url.indexOf('viki.com/videos') != -1) {

  /* Get Video ID */
  var vkVideoID = page.url.match(/videos\/(.*?)v/);
  vkVideoID = (vkVideoID) ? vkVideoID[1] : null;

  /* Get Videos Content */
  var vkVideosContent;
  if (vkVideoID) vkVideosContent = getMyContent(page.win.location.protocol + '//' + page.win.location.host + '/player5_fragment/' + vkVideoID + 'v.json', 'TEXT', false);
  if (vkVideosContent.replace(/\n/, '') == '{}') return;

  /* Get Videos */
  if (vkVideosContent) {
    var vkVideoList = {};
    var vkVideo = vkVideosContent.match(/"video_url":"(.*?)"/);
    vkVideo = (vkVideo) ? vkVideo[1] : null;

    /* Create Saver */
    if (vkVideo) {
      var vkDefaultVideo = 'Low Definition MP4';
      vkVideoList[vkDefaultVideo] = vkVideo
      saver = {'videoList': vkVideoList, 'videoSave': vkDefaultVideo};
      feature['definition'] = false;
      feature['container'] = false;
      option['definition'] = 'LD';
      option['definitions'] = ['Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver();
    }
    else {
      saver = {'warnMess': '!videos'};
      createMySaver();
    }
  }
  else {
    saver = {'warnMess': '!content'};
    createMySaver();
  }

}

// =====IMDB===== //

else if (page.url.indexOf('imdb.com') != -1) {

  /* Redirect To Video Page */
  if (page.url.indexOf('imdb.com/video/') == -1) {
    page.doc.addEventListener('click', function(e) {
      var p = e.target.parentNode;
      while (p) {
	if (p.tagName === 'A' && p.href.indexOf('/video/imdb') != -1) {
	  page.win.location.href = p.href.replace(/imdb\/inline.*/, '');
	}
	p = p.parentNode;
      }
    }, false);
    return;
  }

  /* Get Videos Content */
  var imdbVideoList = {};
  var imdbVideoFormats = {'SD': 'Low Definition MP4', '720p': 'High Definition MP4'};
  var imdbURL, imdbVideo, myVideoCode;
  var imdbVideoFound = false;
  var imdbPageURL = page.url.replace(/\?.*$/, '').replace(/\/$/, '');
  for (var imdbVideoCode in imdbVideoFormats) {
    imdbURL = imdbPageURL + '/imdb/single?vPage=1&format=' + imdbVideoCode;
    imdbVideo = getMyContent(imdbURL, '"videoUrl":"(.*?)"', false);
    if (imdbVideo) {
      if (!imdbVideoFound) imdbVideoFound = true;
      myVideoCode = imdbVideoFormats[imdbVideoCode];
      imdbVideoList[myVideoCode] = imdbVideo;
    }
    if (imdbVideoCode == 'SD') {
      if (!getMyContent(imdbURL, 'format=(.*?)&', false)) break;
    }
  }

  if (imdbVideoFound) {
    /* Create Saver */
    var imdbDefaultVideo = 'Low Definition MP4';
    saver = {'videoList': imdbVideoList, 'videoSave': imdbDefaultVideo};
    feature['container'] = false;
    option['definitions'] = ['High Definition', 'Low Definition'];
    option['containers'] = ['MP4'];
    createMySaver();
  }
  else {
    saver = {'warnMess': '!videos'};
    createMySaver();
  }

}

})();
