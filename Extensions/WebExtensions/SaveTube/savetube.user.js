// ==UserScript==
// @name		SaveTube
// @version		2019.09.13
// @description		Download videos from video sharing web sites.
// @author		sebaro
// @namespace		http://sebaro.pro/savetube
// @downloadURL		https://gitlab.com/sebaro/savetube/raw/master/savetube.user.js
// @updateURL		https://gitlab.com/sebaro/savetube/raw/master/savetube.user.js
// @icon		https://gitlab.com/sebaro/savetube/raw/master/savetube.png
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
// @noframes
// @grant		none
// @run-at		document-end
// ==/UserScript==


/*

  Copyright (C) 2010 - 2019 Sebastian Luncan

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

  Website: http://sebaro.pro/savetube
  Contact: http://sebaro.pro/contact

*/


(function() {


// Don't run on frames or iframes
if (window.top != window.self) return;


// ==========Variables========== //

// Userscript
var userscript = 'SaveTube';

// Page
var page = {win: window, doc: window.document, body: window.document.body, url: window.location.href, site: window.location.hostname.match(/([^.]+)\.[^.]+$/)[1]};

// Saver
var saver = {};
var feature = {'definition': true, 'container': true, 'autoget': false, 'dash': false};
var option = {'definition': 'HD', 'container': 'MP4', 'autoget': false, 'dash': false};
var sources = {};

// Links
var website = 'http://sebaro.pro/savetube';
var contact = 'http://sebaro.pro/contact';


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
  var panelItemHeight = 18;

  /* Panel Logo */
  saver['panelLogo'] = createMyElement('div', userscript, 'click', 'logo', '');
  saver['panelLogo'].title = '{SaveTube: click to visit the script web page}';
  styleMyElement(saver['panelLogo'], {height: panelItemHeight + 'px', border: '1px solid #32d132', borderRadius: '3px', padding: '0px 2px', marginRight: '3px', display: 'inline', color: '#32d132', fontSize: '12px', textShadow: '0px 1px 1px #AAAAAA', verticalAlign: 'middle', cursor: 'pointer'});
  appendMyElement(saver['saverPanel'], saver['panelLogo']);

  /* Panel Video Menu */
  saver['videoMenu'] = createMyElement('select', '', 'change', '', 'video');
  saver['videoMenu'].title = '{Videos: select the video format for download}';
  styleMyElement(saver['videoMenu'], {width: '200px', height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px', display: 'inline', backgroundColor: 'inherit', color: '#336699', fontSize: '12px', textShadow: '1px 1px 1px #CCCCCC', verticalAlign: 'middle', cursor: 'pointer'});
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
  styleMyElement(saver['buttonGet'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#C000C0', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'middle', cursor: 'pointer'});
  if (option['autoget']) styleMyElement(saver['buttonGet'], {display: 'none'});
  appendMyElement(saver['saverPanel'], saver['buttonGet']);

  /* Panel Autoget Button */
  if (feature['autoget']) {
    saver['buttonAutoget'] = createMyElement('div', 'AG', 'click', 'autoget', '');
    saver['buttonAutoget'].title = '{Autoget: click to enable/disable auto download on page load}';
    styleMyElement(saver['buttonAutoget'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#CCCCCC', fontSize: '12px', verticalAlign: 'middle', cursor: 'pointer'});
    if (option['autoget']) styleMyElement(saver['buttonAutoget'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
    appendMyElement(saver['saverPanel'], saver['buttonAutoget']);
  }

  /* Panel Definition Button */
  if (feature['definition']) {
    saver['buttonDefinition'] = createMyElement('div', option['definition'], 'click', 'definition', '');
    saver['buttonDefinition'].title = '{Definition: click to change the preferred video definition}';
    styleMyElement(saver['buttonDefinition'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#008000', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'middle', cursor: 'pointer'});
    appendMyElement(saver['saverPanel'], saver['buttonDefinition']);
  }

  /* Panel Container Button */
  if (feature['container']) {
    saver['buttonContainer'] = createMyElement('div', option['container'], 'click', 'container', '');
    saver['buttonContainer'].title = '{Container: click to change the preferred video container}';
    styleMyElement(saver['buttonContainer'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#008000', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'middle', cursor: 'pointer'});
    appendMyElement(saver['saverPanel'], saver['buttonContainer']);
  }

  /* Panel DASH Button */
  if (feature['dash']) {
    saver['buttonDASH'] = createMyElement('div', 'MD', 'click', 'dash', '');
    saver['buttonDASH'].title = '{MPEG-DASH: click to enable/disable DASH download using the SaveTube protocol}';
    styleMyElement(saver['buttonDASH'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#CCCCCC', fontSize: '12px', verticalAlign: 'middle', cursor: 'pointer'});
    if (option['dash']) styleMyElement(saver['buttonDASH'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
    appendMyElement(saver['saverPanel'], saver['buttonDASH']);
  }

  /* Panel Move Button */
  saver['buttonMove'] = createMyElement('div', '<', 'click', 'move', '');
  saver['buttonMove'].title = '{Move: click to toggle left/right panel position}';
  styleMyElement(saver['buttonMove'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#CCCCCC', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'middle', cursor: 'pointer'});
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
  var vdoDef2 = [];
  var keepDef = false;
  for (var vD = 0; vD < vdoDef.length; vD++) {
    var sD = vdoDef[vD].match(/[A-Z]/g).join('');
    if (sD == option['definition'] && keepDef == false) keepDef = true;
    if (keepDef == true) vdoDef2.push(vdoDef[vD])
  }
  for (var vD = 0; vD < vdoDef2.length; vD++) {
    if (vdoList[vdoDef2[vD]]) {
      saver['videoSave'] = vdoList[vdoDef2[vD]];
      break;
    }
  }
  saver['videoMenu'].value = saver['videoSave'];
}

function getMyVideo() {
  var vdoURL = saver['videoList'][saver['videoSave']];
  var vdoDef = ' (' + saver['videoSave'].split(' ').slice(0, -1).join('').match(/[A-Z]/g).join('') + ')';
  var vdoExt = '.' + saver['videoSave'].split(' ').slice(-1).join('').toLowerCase();
  var vdoTle = (saver['videoTitle']) ? saver['videoTitle'] : '';
  if (feature['autoget'] && vdoTle && saver['videoSave'] == 'High Definition MP4') {
    page.win.location.href = vdoURL + '&title=' + vdoTle + vdoDef;
  }
  else {
    if (saver['videoList'][saver['videoSave']] == 'DASH') {
      var vdoV, vdoA;
      if (saver['videoSave'].indexOf('MP4') != -1) {
	vdoV = saver['videoList'][saver['videoSave'].replace('MP4', 'Video MP4')];
	vdoA = saver['videoList']['Medium Bitrate Audio MP4'] || saver['videoList'][saver['videoSave'].replace('MP4', 'Audio MP4')];
      }
      else {
	vdoV = saver['videoList'][saver['videoSave'].replace('WebM', 'Video WebM')];
	vdoA = saver['videoList']['High Bitrate Audio WebM'] || saver['videoList']['Medium Bitrate Audio WebM'] || saver['videoList']['Medium Bitrate Audio MP4'];
      }
      var vdoT = (vdoTle) ? vdoTle + vdoDef : page.site + vdoDef;
      vdoURL = 'savetube:' + vdoT + 'SEPARATOR' + vdoV + 'SEPARATOR' + vdoA;
      page.win.location.href = vdoURL;
    }
    else {
      var vdoLnk = '';
      if (vdoTle) {
	var vdoNme = vdoTle + vdoDef + vdoExt;
	vdoLnk = 'Get <a href="' + vdoURL + '" style="color:#00892C" download="' + vdoNme + '" target="_blank">Link</a>';
      }
      else {
	vdoLnk = 'Get <a href="' + vdoURL + '" style="color:#00892C" target="_blank">Link</a>';
      }
      modifyMyElement(saver['buttonGet'] , 'div', vdoLnk, false);
    }
  }
}

function cleanMyContent(content, unesc) {
  var myNewContent = content;
  if (unesc) myNewContent = unescape(myNewContent);
  myNewContent = myNewContent.replace(/\\u0025/g, '%');
  myNewContent = myNewContent.replace(/\\u0026/g, '&');
  myNewContent = myNewContent.replace(/\\u002F/g, '/');
  myNewContent = myNewContent.replace(/\\/g, '');
  myNewContent = myNewContent.replace(/\n/g, '');
  return myNewContent;
}

function getMyContent(url, pattern, clean) {
  var myPageContent, myVideosParse, myVideosContent;
  if (!sources[url]) {
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url, false);
    xmlHTTP.send();
    sources[url] = (xmlHTTP.responseText) ? xmlHTTP.responseText : xmlHTTP.responseXML;
    //console.log('Request: ' + url + ' ' + pattern);
  }
  if (pattern == 'TEXT') {
    myVideosContent = sources[url];
  }
  else {
    myPageContent = (sources[url]) ? sources[url] : '';
    if (clean) myPageContent = cleanMyContent(myPageContent, true);
    myVideosParse = myPageContent.match(pattern);
    myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
  }
  return myVideosContent;
}

function setMyOptions(key, value) {
  key = page.site + '_' + userscript.toLowerCase() + '_' + key;
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

function SaveTube() {

  // =====YouTube===== //

  if (page.url.indexOf('youtube.com/watch') != -1) {

    /* Video Availability */
    if (getMyContent(page.url, '"playabilityStatus":\\{"status":"(ERROR|UNPLAYABLE)"', false)) return;
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
      ytSignFuncName = ytScriptSrc.match(/"signature"\s*,\s*([^\)]*?)\(/);
      if (!ytSignFuncName) ytSignFuncName = ytScriptSrc.match(/c&&.\.set\(b,(?:encodeURIComponent\()?.*?([$a-zA-Z0-9]+)\(/);
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
    var ytVideoTitle = getMyContent(page.url, '"title":"(.*?)"', false);
    if (!ytVideoTitle) ytVideoTitle = getMyContent(page.url, '"title":\\{"runs":\\[\\{"text":"(.*?)"', false);
    if (!ytVideoTitle) ytVideoTitle = getMyContent(page.url, 'meta\\s+property="og:title"\\s+content="(.*?)"', false);
    if (!ytVideoTitle) ytVideoTitle = getMyContent(page.url, 'meta\\s+itemprop="name"\\s+content="(.*?)"', false);
    if (ytVideoTitle) {
      ytVideoTitle = ytVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
      ytVideoTitle = ytVideoTitle.replace(/&#39;/g, '\'').replace(/'/g, '\'');
      ytVideoTitle = ytVideoTitle.replace(/&amp;/g, 'and').replace(/&/g, 'and');
      ytVideoTitle = ytVideoTitle.replace(/\?/g, '').replace(/[#:\*]/g, '-').replace(/\//g, '-');
      ytVideoTitle = ytVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
    }

    /* Get Videos Content */
    var ytVideosEncodedFmts, ytVideosEncodedFmtsNew, ytVideosAdaptiveFmts, ytVideosAdaptiveFmtsNew, ytVideosContent, ytHLSVideos, ytHLSContent;
    ytVideosEncodedFmts = getMyContent(page.url, '"url_encoded_fmt_stream_map\\\\?":\\s*\\\\?"(.*?)\\\\?"', false);
    if (!ytVideosEncodedFmts) {
      ytVideosEncodedFmtsNew = getMyContent(page.url, '"formats\\\\?":\\s*(\\[.*?\\])', false);
      if (ytVideosEncodedFmtsNew) {
	ytVideosEncodedFmts = '';
	ytVideosEncodedFmtsNew = cleanMyContent(ytVideosEncodedFmtsNew, false);
	ytVideosEncodedFmtsNew = ytVideosEncodedFmtsNew.match(new RegExp('"(url|cipher)":\s*".*?"', 'g'));
	if (ytVideosEncodedFmtsNew) {
	  for (var i = 0 ; i < ytVideosEncodedFmtsNew.length; i++) {
	    ytVideosEncodedFmts += ytVideosEncodedFmtsNew[i].replace(/"/g, '').replace('url:', 'url=').replace('cipher:', '') + ',';
	  }
	  if (ytVideosEncodedFmts.indexOf('%3A%2F%2F') != -1) {
	    ytVideosEncodedFmts = cleanMyContent(ytVideosEncodedFmts, true);
	  }
	}
      }
    }
    ytVideosAdaptiveFmts = getMyContent(page.url, '"adaptive_fmts\\\\?":\\s*\\\\?"(.*?)\\\\?"', false);
    if (!ytVideosAdaptiveFmts) {
      ytVideosAdaptiveFmtsNew = getMyContent(page.url, '"adaptiveFormats\\\\?":\\s*(\\[.*?\\])', false);
      if (ytVideosAdaptiveFmtsNew) {
	ytVideosAdaptiveFmts = '';
	ytVideosAdaptiveFmtsNew = cleanMyContent(ytVideosAdaptiveFmtsNew, false);
	ytVideosAdaptiveFmtsNew = ytVideosAdaptiveFmtsNew.match(new RegExp('"(url|cipher)":\s*".*?"', 'g'));
	if (ytVideosAdaptiveFmtsNew) {
	  for (var i = 0 ; i < ytVideosAdaptiveFmtsNew.length; i++) {
	    ytVideosAdaptiveFmts += ytVideosAdaptiveFmtsNew[i].replace(/"/g, '').replace('url:', 'url=').replace('cipher:', '') + ',';
	  }
	  if (ytVideosAdaptiveFmts.indexOf('%3A%2F%2F') != -1) {
	    ytVideosAdaptiveFmts = cleanMyContent(ytVideosAdaptiveFmts, true);
	  }
	}
      }
    }
    if (!ytVideosAdaptiveFmts) {
      var ytDASHVideos, ytDASHContent;
      ytDASHVideos = getMyContent(page.url, '"dash(?:mpd|ManifestUrl)\\\\?":\\s*\\\\?"(.*?)\\\\?"', false);
      if (ytDASHVideos) {
	ytDASHVideos = cleanMyContent(ytDASHVideos, false);
	ytDASHContent = getMyContent(ytDASHVideos + '?pacing=0', 'TEXT', false);
	if (ytDASHContent) {
	  var ytDASHVideo, ytDASHVideoParts, ytDASHVideoServer, ytDASHVideoParams;
	  ytDASHVideos = ytDASHContent.match(new RegExp('<BaseURL>.*?</BaseURL>', 'g'));
	  if (ytDASHVideos) {
	    ytVideosAdaptiveFmts = '';
	    for (var i = 0; i < ytDASHVideos.length; i++) {
	      ytDASHVideo = ytDASHVideos[i].replace('<BaseURL>', '').replace('</BaseURL>', '');
	      if (ytDASHVideo.indexOf('source/youtube') == -1) continue;
	      ytDASHVideoParts = ytDASHVideo.split('videoplayback/');
	      ytDASHVideoServer = ytDASHVideoParts[0] + 'videoplayback?';
	      ytDASHVideoParams = ytDASHVideoParts[1].split('/');
	      ytDASHVideo = '';
	      for (var p = 0; p < ytDASHVideoParams.length; p++) {
		if (p % 2) ytDASHVideo += ytDASHVideoParams[p] + '&';
		else ytDASHVideo += ytDASHVideoParams[p] + '=';
	      }
	      ytDASHVideo = encodeURIComponent(ytDASHVideoServer + ytDASHVideo);
	      ytDASHVideo = ytDASHVideo.replace('itag%3D', 'itag=');
	      ytVideosAdaptiveFmts += ytDASHVideo + ',';
	    }
	  }
	}
      }
    }
    if (ytVideosEncodedFmts) {
      ytVideosContent = ytVideosEncodedFmts;
    }
    else {
      ytHLSVideos = getMyContent(page.url, '"hls(?:vp|ManifestUrl)\\\\?":\\s*\\\\?"(.*?)\\\\?"', false);
      if (ytHLSVideos) {
	ytHLSVideos = cleanMyContent(ytHLSVideos, false);
	if (ytHLSVideos.indexOf('keepalive/yes/') != -1) ytHLSVideos = ytHLSVideos.replace('keepalive/yes/', '');
      }
      else {
	var ytVideoID = page.url.match(/(\?|&)v=(.*?)(&|$)/);
	ytVideoID = (ytVideoID) ? ytVideoID[2] : null;
	if (ytVideoID) {
	  var ytVideosInfoPage = page.win.location.protocol + '//' + page.win.location.hostname + '/get_video_info?video_id=' + ytVideoID + '&eurl=https://youtube.googleapis.com/v/';
	  ytVideosEncodedFmts = getMyContent(ytVideosInfoPage, 'url_encoded_fmt_stream_map=(.*?)&', false);
	  if (ytVideosEncodedFmts) {
	    ytVideosEncodedFmts = cleanMyContent(ytVideosEncodedFmts, true);
	    ytVideosContent = ytVideosEncodedFmts;
	  }
	  else {
	    ytVideosEncodedFmtsNew = getMyContent(ytVideosInfoPage, 'formats%22%3A(%5B.*?%5D)', false);
	    if (ytVideosEncodedFmtsNew) {
	      ytVideosEncodedFmts = '';
	      ytVideosEncodedFmtsNew = cleanMyContent(ytVideosEncodedFmtsNew, true);
	      ytVideosEncodedFmtsNew = ytVideosEncodedFmtsNew.match(new RegExp('"(url|cipher)":\s*".*?"', 'g'));
	      if (ytVideosEncodedFmtsNew) {
		for (var i = 0 ; i < ytVideosEncodedFmtsNew.length; i++) {
		  ytVideosEncodedFmts += ytVideosEncodedFmtsNew[i].replace(/"/g, '').replace('url:', 'url=').replace('cipher:', '') + ',';
		}
		if (ytVideosEncodedFmts.indexOf('%3A%2F%2F') != -1) {
		  ytVideosEncodedFmts = cleanMyContent(ytVideosEncodedFmts, true);
		}
		ytVideosContent = ytVideosEncodedFmts;
	      }
	    }
	  }
	  if (!ytVideosAdaptiveFmts) {
	    ytVideosAdaptiveFmts = getMyContent(ytVideosInfoPage, 'adaptive_fmts=(.*?)&', false);
	    if (ytVideosAdaptiveFmts) {
	      ytVideosAdaptiveFmts = cleanMyContent(ytVideosAdaptiveFmts, true);
	    }
	    else {
	      ytVideosAdaptiveFmtsNew = getMyContent(ytVideosInfoPage, 'adaptiveFormats%22%3A(%5B.*?%5D)', false);
	      if (ytVideosAdaptiveFmtsNew) {
		ytVideosAdaptiveFmts = '';
		ytVideosAdaptiveFmtsNew = cleanMyContent(ytVideosAdaptiveFmtsNew, true);
		ytVideosAdaptiveFmtsNew = ytVideosAdaptiveFmtsNew.match(new RegExp('"(url|cipher)":\s*".*?"', 'g'));
		if (ytVideosAdaptiveFmtsNew) {
		  for (var i = 0 ; i < ytVideosAdaptiveFmtsNew.length; i++) {
		    ytVideosAdaptiveFmts += ytVideosAdaptiveFmtsNew[i].replace(/"/g, '').replace('url:', 'url=').replace('cipher:', '') + ',';
		  }
		  if (ytVideosAdaptiveFmts.indexOf('%3A%2F%2F') != -1) {
		    ytVideosAdaptiveFmts = cleanMyContent(ytVideosAdaptiveFmts, true);
		  }
		}
	      }
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
      option['definitions'] = ['Ultra High Definition', 'Quad High Definition', 'Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
      option['containers'] = ['MP4', 'WebM', 'Any'];
    }

    /* Parse Videos */
    function ytVideos() {
      var ytVideoFormats = {
	'18': 'Low Definition MP4',
	'22': 'High Definition MP4',
	'43': 'Low Definition WebM',
	'133': 'Very Low Definition Video MP4',
	'134': 'Low Definition Video MP4',
	'135': 'Standard Definition Video MP4',
	'136': 'High Definition Video MP4',
	'137': 'Full High Definition Video MP4',
	'140': 'Medium Bitrate Audio MP4',
	'242': 'Very Low Definition Video WebM',
	'243': 'Low Definition Video WebM',
	'244': 'Standard Definition Video WebM',
	'247': 'High Definition Video WebM',
	'248': 'Full High Definition Video WebM',
	'249': 'Low Bitrate Audio WebM',
	'250': 'Medium Bitrate Audio WebM',
	'251': 'High Bitrate Audio WebM',
	'264': 'Quad High Definition Video MP4',
	'271': 'Quad High Definition Video WebM',
	'272': 'Ultra High Definition Video WebM',
	'298': 'High Definition Video MP4',
	'299': 'Full High Definition Video MP4',
	'302': 'High Definition Video WebM',
	'303': 'Full High Definition Video WebM',
	'308': 'Quad High Definition Video WebM',
	'313': 'Ultra High Definition Video WebM',
	'315': 'Ultra High Definition Video WebM',
	'333': 'Standard Definition Video WebM',
	'334': 'High Definition Video WebM',
	'335': 'Full High Definition Video WebM',
	'337': 'Ultra High Definition Video WebM'
      };
      var ytVideoFound = false;
      var ytVideos = ytVideosContent.split(',');
      var ytVideoParse, ytVideoCodeParse, ytVideoCode, myVideoCode, ytVideo, ytSign, ytSignP;
      for (var i = 0; i < ytVideos.length; i++) {
	ytVideo = ytVideos[i];
	ytVideoCodeParse = ytVideo.match(/itag=(\d{1,3})/);
	ytVideoCode = (ytVideoCodeParse) ? ytVideoCodeParse[1] : null;
	if (!ytVideoCode) continue;
	myVideoCode = ytVideoFormats[ytVideoCode];
	if (!myVideoCode) continue;
	if (!ytVideo.match(/^url/)) {
	  ytVideoParse = ytVideo.match(/(.*)(url=.*$)/);
	  if (ytVideoParse) ytVideo = ytVideoParse[2] + '&' + ytVideoParse[1];
	}
	ytVideo = cleanMyContent(ytVideo, true);
	if (myVideoCode.indexOf('Video') != -1) {
	  if (ytVideo.indexOf('source=yt_otf') != -1) continue;
	}
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
	if (ytVideo.match(/xtags=[^%=]*&/)) ytVideo = ytVideo.replace(/xtags=[^%=]*?&/, '');
	else if (ytVideo.match(/&xtags=[^%=]*$/)) ytVideo = ytVideo.replace(/&xtags=[^%=]*$/, '');
	if (ytVideo.match(/&sig=/) && !ytVideo.match(/&lsig=/)) ytVideo = ytVideo.replace(/&sig=/, '&signature=');
	else if (ytVideo.match(/&s=/)) {
	  ytSign = ytVideo.match(/&s=(.*?)(&|$)/);
	  ytSign = (ytSign) ? ytSign[1] : null;
	  if (ytSign) {
	    ytSign = ytDecryptSignature(ytSign);
	    if (ytSign) {
	      ytSignP = ytVideo.match(/&sp=(.*?)(&|$)/);
	      ytSignP = (ytSignP) ? ytSignP[1] : ((ytVideo.match(/&lsig=/)) ? 'sig' : 'signature');
	      ytVideo = ytVideo.replace(/&s=.*?(&|$)/, '&' + ytSignP + '=' + ytSign + '$1');
	    }
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

      if (ytVideoFound) {
	/* DASH */
	if (ytVideoList['Medium Bitrate Audio MP4'] || ytVideoList['Medium Bitrate Audio WebM']) {
	  for (var myVideoCode in ytVideoList) {
	    if (myVideoCode.indexOf('Video') != -1) {
	      if (!ytVideoList[myVideoCode.replace(' Video', '')]) {
		ytVideoList[myVideoCode.replace(' Video', '')] = 'DASH';
	      }
	    }
	  }
	}
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
      if (ytVideosContent.match(/^s=/) || ytVideosContent.match(/&s=/) || ytVideosContent.match(/,s=/) || ytVideosContent.match(/u0026s=/)) {
	var ytScriptURL = getMyContent(page.url, '"js":\\s*"(.*?)"', true);
	if (!ytScriptURL) ytScriptURL = getMyContent(page.url.replace(/watch.*?v=/, 'embed/').replace(/&.*$/, ''), '"js":\\s*"(.*?)"', true);
	if (ytScriptURL) {
	  ytScriptURL = page.win.location.protocol + '//' + page.win.location.hostname + ytScriptURL;
	  ytScriptSrc = getMyContent(ytScriptURL, 'TEXT', false);
	  if (ytScriptSrc) ytDecryptFunction();
	  ytVideos();
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
	ytHLSContent = getMyContent(ytHLSVideos, 'TEXT', false);
	ytHLS();
      }
      else {
	saver = {'warnMess': '!content'};
	createMySaver();
      }
    }

  }

  // =====DailyMotion===== //

  else if (page.url.indexOf('dailymotion.com/video') != -1) {

    /* Video Availability */
    if (getMyContent(page.url.replace(/\/video\//, "/embed/video/"), '"error":\\{"title":"(.*?)"', false)) return;
    if (getMyContent(page.url.replace(/\/video\//, "/embed/video/"), '"error_title":"(.*?)"', false)) return;

    /* Get Video Title */
    var dmVideoTitle = getMyContent(page.url.replace(/\/video\//, "/embed/video/"), '"title":"(.*?)"', false);
    if (dmVideoTitle) {
      dmVideoTitle = dmVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
      dmVideoTitle = dmVideoTitle.replace(/&#39;/g, '\'').replace(/'/g, '\'');
      dmVideoTitle = dmVideoTitle.replace(/&amp;/g, 'and').replace(/&/g, 'and');
      dmVideoTitle = dmVideoTitle.replace(/\?/g, '').replace(/[#:\*]/g, '-').replace(/\//g, '-');
      dmVideoTitle = dmVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
    }

    /* Get Videos Content */
    var dmVideosContent = getMyContent(page.url.replace(/\/video\//, "/embed/video/"), '"qualities":\\{(.*?)\\]\\},', false);

    /* Get Videos */
    if (dmVideosContent) {
      var dmVideoFormats = {'auto': 'Low Definition MP4', '240': 'Very Low Definition MP4', '380': 'Low Definition MP4',
			     '480': 'Standard Definition MP4', '720': 'High Definition MP4', '1080': 'Full High Definition MP4'};
      var dmVideoList = {};
      var dmVideoFound = false;
      var dmVideoParser, dmVideoParse, myVideoCode, dmVideo;
      for (var dmVideoCode in dmVideoFormats) {
	dmVideoParser = '"' + dmVideoCode + '".*?"type":"video.*?mp4","url":"(.*?)"';
	dmVideoParse = dmVideosContent.match(dmVideoParser);
	if (!dmVideoParse) {
	  dmVideoParser = '"' + dmVideoCode + '".*?"type":"application.*?mpegURL","url":"(.*?)"';
	  dmVideoParse = dmVideosContent.match(dmVideoParser);
	}
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
	saver = {'videoList': dmVideoList, 'videoSave': dmDefaultVideo, 'videoTitle': dmVideoTitle};
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

  else if (page.url.indexOf('vimeo.com/') != -1) {

    /* Page Type */
    var viPageType = getMyContent(page.url, 'meta\\s+property="og:type"\\s+content="(.*?)"', false);
    if (!viPageType || (viPageType != 'video' && viPageType != 'profile')) return;

    /* Get Video Title */
    var viVideoTitle;
    if (viPageType == 'video') {
      viVideoTitle = getMyContent(page.url, 'meta\\s+property="og:title"\\s+content="(.*?)"', false);
    }
    else {
      viVideoTitle = getMyContent(page.url, '"title":"(.*?)"', false);
    }
    if (viVideoTitle) {
      viVideoTitle = viVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
      viVideoTitle = viVideoTitle.replace(/&#39;/g, '\'').replace(/'/g, '\'');
      viVideoTitle = viVideoTitle.replace(/&amp;/g, 'and').replace(/&/g, 'and');
      viVideoTitle = viVideoTitle.replace(/\?/g, '').replace(/[#:\*]/g, '-').replace(/\//g, '-');
      viVideoTitle = viVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
      viVideoTitle = viVideoTitle.replace(/on\sVimeo$/, '');
    }

    /* Get Content Source */
    var viVideoSource = getMyContent(page.url, 'config_url":"(.*?)"', false);
    if (viVideoSource) viVideoSource = cleanMyContent(viVideoSource, false);
    else {
      viVideoSource = getMyContent(page.url, 'data-config-url="(.*?)"', false);
      if (viVideoSource) viVideoSource = viVideoSource.replace(/&amp;/g, '&');
    }

    /* Get Videos Content */
    var viVideosContent;
    if (viVideoSource) {
      viVideosContent = getMyContent(viVideoSource, '"progressive":\\[(.*?)\\]', false);
    }

    /* Get Videos */
    if (viVideosContent) {
      var viVideoFormats = {'1440p': 'Quad High Definition MP4', '1080p': 'Full High Definition MP4', '720p': 'High Definition MP4', '540p': 'Standard Definition MP4',
			     '480p': 'Standard Definition MP4', '360p': 'Low Definition MP4', '270p': 'Very Low Definition MP4', '240p': 'Very Low Definition MP4'};
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
	saver = {'videoList': viVideoList, 'videoSave': viDefaultVideo, 'videoTitle': viVideoTitle};
	feature['container'] = false;
	option['definitions'] = ['Quad High Definition', 'Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
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

  // =====Veoh===== //

  else if (page.url.indexOf('veoh.com/watch') != -1) {

    /* Get Video Availability */
    if (getMyElement('', 'div', 'class', 'veoh-video-player-error', 0, false)) return;

    /* Get Video Title */
    var veVideoTitle = getMyContent(page.url, 'meta\\s+name="og:title"\\s+content="(.*?)"', false);
    if (veVideoTitle) {
      veVideoTitle = veVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
      veVideoTitle = veVideoTitle.replace(/&#39;/g, '\'').replace(/'/g, '\'');
      veVideoTitle = veVideoTitle.replace(/&amp;/g, 'and').replace(/&/g, 'and');
      veVideoTitle = veVideoTitle.replace(/\?/g, '').replace(/[#:\*]/g, '-').replace(/\//g, '-');
      veVideoTitle = veVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
    }

    /* Get Videos Content */
    var veVideosContent = getMyContent(page.url.replace(/\/watch\//, '/watch/getVideo/'), '"src"\\s*:\\s*\\{(.*?)\\}', false);

    /* Get Videos */
    if (veVideosContent) {
      var veVideoFormats = {'Regular': 'Low Definition MP4', 'HQ': 'Standard Definition MP4'};
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
	  veVideoList[myVideoCode] = cleanMyContent(veVideo, false);
	}
      }

      if (veVideoFound) {
	/* Create Saver */
	var veDefaultVideo = 'Low Definition MP4';
	saver = {'videoList': veVideoList, 'videoSave': veDefaultVideo, 'videoTitle': veVideoTitle};
	feature['container'] = false;
	feature['fullsize'] = false;
	option['definition'] = 'LD';
	option['definitions'] = ['Standard Definition', 'Low Definition'];
	option['containers'] = ['MP4'];
	createMySaver();
      }
      else {
	saver = {};
	var ytVideoId = getMyContent(page.url, 'youtube.com/embed/(.*?)("|\\?)', false);
	if (!ytVideoId) ytVideoId = getMyContent(page.url, '"videoId":"yapi-(.*?)"', false);
	if (ytVideoId) {
	  var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId;
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

  // =====Viki===== //

  else if (page.url.indexOf('viki.com/videos') != -1) {

    /* Get Video Title */
    var vkVideoTitle = getMyContent(page.url, 'meta\\s+property="og:title"\\s+content="(.*?)"', false);
    if (vkVideoTitle) {
      vkVideoTitle = vkVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
      vkVideoTitle = vkVideoTitle.replace(/&#39;/g, '\'').replace(/'/g, '\'');
      vkVideoTitle = vkVideoTitle.replace(/&amp;/g, 'and').replace(/&/g, 'and');
      vkVideoTitle = vkVideoTitle.replace(/\?/g, '').replace(/[#:\*]/g, '-').replace(/\//g, '-');
      vkVideoTitle = vkVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
    }

    /* Get Video ID */
    var vkVideoID = page.url.match(/videos\/(\d+v)/);
    vkVideoID = (vkVideoID) ? vkVideoID[1] : null;

    /* Get Videos Content */
    var vkVideosContent;
    if (vkVideoID) {
      /* SHA-1
      Copyright 2008-2018 Brian Turek, 1998-2009 Paul Johnston & Contributors
      Distributed under the BSD License
      See https://caligatio.github.com/jsSHA/ for more information
      */
      var SHA1FuncBody;
      var SHA1Key = 'sha1js';
      try {
	if (localStorage.getItem(SHA1Key)) {
	  SHA1FuncBody = localStorage.getItem(SHA1Key);
	}
	else throw false;
      }
      catch(e) {
	SHA1FuncBody = getMyContent('https://raw.githack.com/Caligatio/jsSHA/master/src/sha1.js', 'TEXT', false);
	localStorage.setItem(SHA1Key, SHA1FuncBody);
      }
      var SHA1Func = new Function('a', SHA1FuncBody);
      var SHA1 = new SHA1Func();
      if (SHA1.jsSHA) {
	var shaObj = new SHA1.jsSHA("SHA-1", "TEXT");
	var vkTimestamp = parseInt(Date.now() / 1000);
	var vkQuery = "/v5/videos/" + vkVideoID + "/streams.json?app=100005a&t=" + vkTimestamp + "&site=www.viki.com"
	var vkToken = "MM_d*yP@`&1@]@!AVrXf_o-HVEnoTnm$O-ti4[G~$JDI/Dc-&piU&z&5.;:}95\=Iad";
	shaObj.setHMACKey(vkToken, "TEXT");
	shaObj.update(vkQuery);
	var vkSig = shaObj.getHMAC("HEX");
	var vkSource = "https://api.viki.io" + vkQuery + "&sig=" + vkSig;
	vkVideosContent = getMyContent(vkSource, 'TEXT', false);
      }
    }

    /* Get Videos */
    if (vkVideosContent) {
      var vkVideoList = {};
      var vkVideoFormats = {'1080p': 'Full High Definition MP4', '720p': 'High Definition MP4', '480p': 'Standard Definition MP4',
			    '360p': 'Low Definition MP4', '240p': 'Very Low Definition MP4'};
      var vkVideoFound = false;
      var vkVideoParser, vkVideoParse, vkVideo, myVideoCode;
      for (var vkVideoCode in vkVideoFormats) {
	vkVideoParser = '"' + vkVideoCode + '".*?"https":\{"url":"(.*?)"';
	vkVideoParse = vkVideosContent.match(vkVideoParser);
	vkVideo = (vkVideoParse) ? vkVideoParse[1] : null;
	if (vkVideo) {
	  if (!vkVideoFound) vkVideoFound = true;
	  myVideoCode = vkVideoFormats[vkVideoCode];
	  vkVideoList[myVideoCode] = vkVideo;
	}
      }

      // Unauthorized
      var vkUnauthorized = (vkVideosContent.indexOf('unauthorized') != -1) ? true : false;

      // DASH/HLS/Subtitles
      vkVideosContent = getMyContent(page.url.replace('/videos/', '/player5_fragment/'), 'TEXT', false);
      if (vkVideosContent) {
	vkVideoEncDASH = vkVideosContent.match(/dash\+xml".*?stream=(.*?)"/);
	vkVideoEncDASH = (vkVideoEncDASH) ? vkVideoEncDASH[1] : null;
	vkVideoEncHLS = vkVideosContent.match(/x-mpegURL".*?stream=(.*?)"/);
	vkVideoEncHLS = (vkVideoEncHLS) ? vkVideoEncHLS[1] : null;
	if (vkVideoEncDASH || vkVideoEncHLS) {
	  vkVideoEncKey = vkVideosContent.match(/chabi:\s*'(.*?)'/);
	  vkVideoEncKey = (vkVideoEncKey) ? vkVideoEncKey[1] : null;
	  vkVideoEncIV = vkVideosContent.match(/ecta:\s*'(.*?)'/);
	  vkVideoEncIV = (vkVideoEncIV) ? vkVideoEncIV[1] : null;
	  if (vkVideoEncKey && vkVideoEncIV) {
	    /* AES
	    Copyright 2015-2018 Richard Moore
	    MIT License.
	    See https://github.com/ricmoo/aes-js/ for more information
	    */
	    var AESFuncBody;
	    var AESKey = 'aesjs';
	    try {
	      if (localStorage.getItem(AESKey)) {
		AESFuncBody = localStorage.getItem(AESKey);
	      }
	      else throw false;
	    }
	    catch(e) {
	      AESFuncBody = getMyContent('https://raw.githack.com/ricmoo/aes-js/master/index.js', 'TEXT', false);
	      localStorage.setItem(AESKey, AESFuncBody);
	    }
	    var AESFunc = new Function('a', AESFuncBody);
	    var AES = new AESFunc();
	    var AESKey = AES.aesjs.utils.utf8.toBytes(vkVideoEncKey);
	    var AESIV = AES.aesjs.utils.utf8.toBytes(vkVideoEncIV);
	    var encryptedBytes, decryptedBytes;
	    // HLS
	    encryptedBytes = AES.aesjs.utils.hex.toBytes(vkVideoEncHLS);
	    AESCBC = new AES.aesjs.ModeOfOperation.cbc(AESKey, AESIV);
	    decryptedBytes = AESCBC.decrypt(encryptedBytes);
	    var vkHLSManifest = AES.aesjs.utils.utf8.fromBytes(decryptedBytes);
	    if (vkHLSManifest) {
	      if (!vkVideoFound) vkVideoFound = true;
	      vkVideoList['Any Definition HLS'] = vkHLSManifest;
	    }
	    // DASH
	    encryptedBytes = AES.aesjs.utils.hex.toBytes(vkVideoEncDASH);
	    AESCBC = new AES.aesjs.ModeOfOperation.cbc(AESKey, AESIV);
	    decryptedBytes = AESCBC.decrypt(encryptedBytes);
	    var vkDASHManifest = AES.aesjs.utils.utf8.fromBytes(decryptedBytes);
	    if (vkDASHManifest) {
	      var vkDASHDomain = vkDASHManifest.split('/').splice(0, 5).join('/');
	      var vkDASHContent = getMyContent(vkDASHManifest, 'TEXT', false);
	      if (vkDASHContent) {
		var vkDASHVideo;
		var vkDASHVideos = vkDASHContent.match(new RegExp('<BaseURL>.*?</BaseURL>', 'g'));
		if (vkDASHVideos) {
		  for (var i = 0; i < vkDASHVideos.length; i++) {
		    vkDASHVideo = vkDASHVideos[i].replace('<BaseURL>', '').replace('</BaseURL>', '');
		    if (vkDASHVideo.indexOf('http') != 0) vkDASHVideo = vkDASHDomain + '/' + vkDASHVideo;
		    for (var vkVideoCode in vkVideoFormats) {
		      if (vkDASHVideo.indexOf(vkVideoCode) != -1) {
			myVideoCode = vkVideoFormats[vkVideoCode];
			if (vkDASHVideo.indexOf('track1') != -1) {
			  if (!vkVideoFound) vkVideoFound = true;
			  if (!vkVideoList[myVideoCode]) {
			    vkVideoList[myVideoCode.replace('MP4', 'Video MP4')] = vkDASHVideo;
			  }
			}
			if (vkDASHVideo.indexOf('track2') != -1) {
			  if (!vkVideoList[myVideoCode]) {
			    vkVideoList[myVideoCode.replace('MP4', 'Audio MP4')] = vkDASHVideo;
			  }
			}
		      }
		    }
		  }
		}
		for (var vkVideoCode in vkVideoFormats) {
		  myVideoCode = vkVideoFormats[vkVideoCode];
		  if (!vkVideoList[myVideoCode]) {
		    if (vkVideoList[myVideoCode.replace('MP4', 'Video MP4')] && vkVideoList[myVideoCode.replace('MP4', 'Audio MP4')]) {
		      vkVideoList[myVideoCode] = 'DASH';
		    }
		  }
		}
	      }
	    }
	  }
	}
	// Subtitles
	var vkSubtitles = vkVideosContent.match(/"srclang":"en".*?"src":"(.*?)"/);
	vkSubtitles = (vkSubtitles) ? vkSubtitles[1] : null;
	if (vkSubtitles) vkVideoList['EN Subtitles WebVTT'] = vkSubtitles;
      }

      /* Create Saver */
      if (vkVideoFound) {
	var vkDefaultVideo = 'Low Definition MP4';
	saver = {'videoList': vkVideoList, 'videoSave': vkDefaultVideo, 'videoTitle': vkVideoTitle};
	feature['container'] = false;
	feature['dash'] = true;
	option['definition'] = 'LD';
	option['definitions'] = ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
	option['containers'] = ['MP4'];
	createMySaver();
      }
      else {
	if (vkUnauthorized) {
	  saver = {
	    'warnMess': 'other',
	    'warnContent': '<b>SaveTube:</b> Authorization required!'
	  };
	}
	else saver = {'warnMess': '!videos'};
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
    if (page.url.indexOf('/video/') == -1 && page.url.indexOf('/videoplayer/') == -1) {
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

    /* Get Video Title */
    var imdbVideoTitle = getMyContent(page.url, 'meta\\s+property="og:title"\\s+content="(.*?)"', false);
    if (imdbVideoTitle) {
      imdbVideoTitle = imdbVideoTitle.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/"/g, '\'');
      imdbVideoTitle = imdbVideoTitle.replace(/&#39;/g, '\'').replace(/'/g, '\'');
      imdbVideoTitle = imdbVideoTitle.replace(/&amp;/g, 'and').replace(/&/g, 'and');
      imdbVideoTitle = imdbVideoTitle.replace(/\?/g, '').replace(/[#:\*]/g, '-').replace(/\//g, '-');
      imdbVideoTitle = imdbVideoTitle.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
    }

    /* Get Video Id */
    var imdbVideoId = page.url.replace(/.*videoplayer\//, '').replace(/(\/|\?).*/, '');

    /* Get Videos Content */
    var imdbVideosContent = getMyContent(page.url, '"' + imdbVideoId + '":\\{("aggregateUpVotes.*?videoId)', false);

    /* Get Videos */
    var imdbVideoList = {};
    if (imdbVideosContent) {
      var imdbVideoFormats = {'1080p': 'Full High Definition MP4', '720p': 'High Definition MP4', '480p': 'Standard Definition MP4',
			       '360p': 'Low Definition MP4', 'SD': 'Low Definition MP4', '240p': 'Very Low Definition MP4'};
      var imdbVideoFound = false;
      var imdbVideoParser, imdbVideoParse, myVideoCode, imdbVideo;
      for (var imdbVideoCode in imdbVideoFormats) {
	imdbVideoParser = '"definition":"' + imdbVideoCode + '".*?"videoUrl":"(.*?)"';
	imdbVideoParse = imdbVideosContent.match(imdbVideoParser);
	imdbVideo = (imdbVideoParse) ? imdbVideoParse[1] : null;
	if (imdbVideo) {
	  imdbVideo = cleanMyContent(imdbVideo, false);
	  if (!imdbVideoFound) imdbVideoFound = true;
	  myVideoCode = imdbVideoFormats[imdbVideoCode];
	  if (!imdbVideoList[myVideoCode]) imdbVideoList[myVideoCode] = imdbVideo;
	}
      }

      if (imdbVideoFound) {
	/* Create Saver */
	var imdbDefaultVideo = 'Low Definition MP4';
	saver = {'videoList': imdbVideoList, 'videoSave': imdbDefaultVideo, 'videoTitle': imdbVideoTitle};
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
      imdbVideo = getMyContent(page.url, '"videoUrl":"(.*?)"', false);
      if (imdbVideo) {
	/* Create Saver */
	imdbVideo = cleanMyContent(imdbVideo, false);
	imdbVideoList[imdbDefaultVideo] = imdbVideo;
	var imdbDefaultVideo = 'Low Definition MP4';
	saver = {'videoList': imdbVideoList, 'videoSave': imdbDefaultVideo, 'videoTitle': imdbVideoTitle};
	feature['container'] = false;
	option['definitions'] = ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
	option['containers'] = ['MP4'];
	createMySaver();
      }
      else {
	saver = {'warnMess': '!content'};
	createMySaver();
      }
    }

  }

}


// ==========Run========== //

SaveTube();

page.win.setInterval(function() {
  if (page.url != page.win.location.href) {
    if (saver['saverPanel'] && saver['saverPanel'].parentNode) {
      removeMyElement(saver['saverPanel'].parentNode, saver['saverPanel']);
    }
    page.doc = page.win.document;
    page.body = page.doc.body;
    page.url = page.win.location.href;
    SaveTube();
  }
}, 500);

})();
