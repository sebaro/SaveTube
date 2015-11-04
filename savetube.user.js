// ==UserScript==
// @name		SaveTube
// @version		2015.11.04
// @description		Download videos from video sharing web sites.
// @author		sebaro
// @namespace		http://isebaro.com/savetube
// @license		GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL		https://raw.githubusercontent.com/sebaro/savetube/master/savetube.user.js
// @updateURL		https://raw.githubusercontent.com/sebaro/savetube/master/savetube.user.js
// @icon		http://s3.amazonaws.com/uso_ss/icon/130917/large.png
// @include		http://youtube.com*
// @include		http://www.youtube.com*
// @include		https://youtube.com*
// @include		https://www.youtube.com*
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
// @include		http://videojug.com*
// @include		http://www.videojug.com*
// @include		https://videojug.com*
// @include		https://www.videojug.com*
// @include		http://blip.tv*
// @include		http://www.blip.tv*
// @include		https://blip.tv*
// @include		https://www.blip.tv*
// @include		http://veoh.com*
// @include		http://www.veoh.com*
// @include		https://veoh.com*
// @include		https://www.veoh.com*
// @include		http://crackle.com*
// @include		http://www.crackle.com*
// @include		https://crackle.com*
// @include		https://www.crackle.com*
// @include		http://viki.com*
// @include		http://www.viki.com*
// @include		https://viki.com*
// @include		https://www.viki.com*
// @include		http://imdb.com*
// @include		http://www.imdb.com*
// @include		https://imdb.com*
// @include		https://www.imdb.com*
// @include		http://facebook.com*
// @include		http://www.facebook.com*
// @include		https://facebook.com*
// @include		https://www.facebook.com*
// @include		https://screen.yahoo.com*
// @grant		GM_xmlhttpRequest
// @grant		GM_setValue
// @grant		GM_getValue
// ==/UserScript==


/*

  Copyright (C) 2010 - 2015 Sebastian Luncan

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
var page = {win: window, doc: document, body: document.body, url: window.location.href, site: window.location.hostname.match(/([^.]+)\.[^.]+$/)[1]};

// Saver
var saver = {};
var feature = {'definition': true, 'container': true, 'autoget': false};
var option = {'definition': 'HD', 'container': 'MP4', 'autoget': false};

// Links
var website = 'http://isebaro.com/savetube/?ln=en';
var contact = 'http://isebaro.com/contact/?ln=en&sb=savetube';


// ==========Functions========== //

function createMyElement (type, content, event, action, target) {
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
      obj.addEventListener ('change', function () {
	saver['videoSave'] = this.value;
	if (feature['autoget']) {
	  if (option['autoget']) getMyVideo();
	}
	else {
	  modifyMyElement (saver['buttonGet'] , 'div', 'Get', false);
	}
      }, false);
    }
  }
  else if (event == 'click') {
    obj.addEventListener ('click', function () {
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
	  styleMyElement (saver['buttonGet'], {display: 'none'});
	  styleMyElement (saver['buttonAutoget'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
	  getMyVideo();
	}
	else {
	  styleMyElement (saver['buttonGet'], {display: 'inline'});
	  styleMyElement (saver['buttonAutoget'], {color: '#CCCCCC', textShadow: '0px 0px 0px'});
	}
	setMyOptions ('autoget', option['autoget']);
      }
      else if (action == 'definition') {
	for (var itemDef = 0; itemDef < option['definitions'].length; itemDef++) {
	  if (option['definitions'][itemDef].match(/[A-Z]/g).join('') == option['definition']) {
	    var nextDef = (itemDef + 1 < option['definitions'].length) ? itemDef + 1 : 0;
	    option['definition'] = option['definitions'][nextDef].match(/[A-Z]/g).join('');
	    break;
	  }
	}
	modifyMyElement (saver['buttonDefinition'], 'div', option['definition'], false);
	setMyOptions ('definition', option['definition']);
	modifyMyElement (saver['buttonGet'] , 'div', 'Get', false);
	selectMyVideo ();
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
	modifyMyElement (saver['buttonContainer'], 'div', option['container'], false);
	setMyOptions ('container', option['container']);
	modifyMyElement (saver['buttonGet'] , 'div', 'Get', false);
	selectMyVideo ();
	if (option['autoget']) getMyVideo();
      }
    }, false);
  }
  return obj;
}

function getMyElement (obj, type, from, value, child, content) {
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

function modifyMyElement (obj, type, content, clear) {
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

function styleMyElement (obj, styles) {
  for (var property in styles) {
    if (styles.hasOwnProperty(property)) obj.style[property] = styles[property];
  }
}

function appendMyElement (parent, child) {
  parent.appendChild(child);
}

function removeMyElement (parent, child) {
  parent.removeChild(child);
}

function replaceMyElement (parent, orphan, child) {
  parent.replaceChild(orphan, child);
}

function createMySaver () {
  /* Get My Options */
  getMyOptions ();

  /* Saver Settings */
  saver['panelHeight'] = 18;
  saver['panelPadding'] = 2;

  /* The Panel */
  var panelWidth = saver['saverWidth'] - saver['panelPadding'] * 2;
  saver['saverPanel'] = createMyElement ('div', '', '', '', '');
  styleMyElement (saver['saverPanel'], {position: 'relative', width: panelWidth + 'px', height: saver['panelHeight'] + 'px', display: 'block', padding: saver['panelPadding'] + 'px', backgroundColor: '#F4F4F4', fontSize: '12px', textAlign: 'center'});
  appendMyElement (saver['saverSocket'], saver['saverPanel']);

  /* Warnings */
  if (saver['warnMess']) {
    if (saver['warnContent']) showMyMessage (saver['warnMess'], saver['warnContent']);
    else showMyMessage (saver['warnMess']);
    return;
  }

  /* Panel Items */
  var panelItemBorder = 1;
  var panelItemHeight = saver['panelHeight'] - panelItemBorder * 2;

  /* Panel Logo */
  saver['panelLogo'] = createMyElement ('div', userscript + ': ', 'click', 'logo', '');
  saver['panelLogo'].title = '{SaveTube: click to visit the script web page}';
  styleMyElement (saver['panelLogo'], {height: panelItemHeight + 'px', padding: '0px', display: 'inline', color: '#336699', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
  appendMyElement (saver['saverPanel'], saver['panelLogo']);

  /* Panel Video Menu */
  saver['videoMenu'] = createMyElement ('select', '', 'change', '', 'video');
  saver['videoMenu'].title = '{Videos: select the video format for download}';
  styleMyElement (saver['videoMenu'], {width: '200px', height: panelItemHeight + 'px', border: '1px solid transparent', padding: '0px', display: 'inline', backgroundColor: 'inherit', color: '#336699', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', verticalAlign: 'baseline', cursor: 'pointer'});
  appendMyElement (saver['saverPanel'], saver['videoMenu'] );
  for (var videoCode in saver['videoList']) {
    saver['videoItem'] = createMyElement ('option', videoCode, '', '', '');
    styleMyElement (saver['videoItem'], {padding: '0px', display: 'block', color: '#336699', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
    if (videoCode.indexOf('Video') != -1 || videoCode.indexOf('Audio') != -1) styleMyElement (saver['videoItem'], {color: '#8F6B32'});
    appendMyElement (saver['videoMenu'], saver['videoItem']);
  }

  /* Panel Get Button */
  saver['buttonGet'] = createMyElement ('div', 'Get', 'click', 'get', '');
  saver['buttonGet'].title = '{Get: click to download the selected video format}';
  styleMyElement (saver['buttonGet'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#C000C0', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
  if (option['autoget']) styleMyElement (saver['buttonGet'], {display: 'none'});
  appendMyElement (saver['saverPanel'], saver['buttonGet']);

  /* Panel Autoget Button */
  if (feature['autoget']) {
    saver['buttonAutoget'] = createMyElement ('div', 'Autoget', 'click', 'autoget', '');
    saver['buttonAutoget'].title = '{Get: click to enable/disable auto download on page load}';
    styleMyElement (saver['buttonAutoget'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#CCCCCC', fontSize: '12px', cursor: 'pointer'});
    if (option['autoget']) styleMyElement (saver['buttonAutoget'], {color: '#008080', textShadow: '0px 1px 1px #CCCCCC'});
    appendMyElement (saver['saverPanel'], saver['buttonAutoget']);
  }

  /* Panel Definition Button */
  if (feature['definition']) {
    saver['buttonDefinition'] = createMyElement ('div', option['definition'], 'click', 'definition', '');
    saver['buttonDefinition'].title = '{Definition: click to change the preferred video definition}';
    styleMyElement (saver['buttonDefinition'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#008000', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
    appendMyElement (saver['saverPanel'], saver['buttonDefinition']);
  }

  /* Panel Container Button */
  if (feature['container']) {
    saver['buttonContainer'] = createMyElement ('div', option['container'], 'click', 'container', '');
    saver['buttonContainer'].title = '{Container: click to change the preferred video container}';
    styleMyElement (saver['buttonContainer'], {height: panelItemHeight + 'px', border: '1px solid #CCCCCC', borderRadius: '3px', padding: '0px 5px', display: 'inline', color: '#008000', fontSize: '12px', textShadow: '0px 1px 1px #CCCCCC', cursor: 'pointer'});
    appendMyElement (saver['saverPanel'], saver['buttonContainer']);
  }

  /* Select The Video */
  if (feature['definition'] || feature['container']) selectMyVideo ();

  /* Get The Video On Autoget */
  if (option['autoget']) getMyVideo();
}

function selectMyVideo () {
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

function getMyVideo () {
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
  if (feature['autoget'] && !saver['videoSave'].match(/(Video|Audio)/)) page.win.location.href = vdoURL;
  else {
    var vdoLink = 'Get <a href="' + vdoURL + '" style="color:#00892C">Link</a>';
    modifyMyElement (saver['buttonGet'] , 'div', vdoLink, false);
  }
}

function cleanMyContent (content, unesc) {
  var myNewContent = content;
  if (unesc) myNewContent = unescape (myNewContent);
  myNewContent = myNewContent.replace (/\\u0025/g,'%');
  myNewContent = myNewContent.replace (/\\u0026/g,'&');
  myNewContent = myNewContent.replace (/\\/g,'');
  myNewContent = myNewContent.replace (/\n/g,'');
  return myNewContent;
}

function getMyContent (url, pattern, clean) {
  var myPageContent, myVideosParse, myVideosContent;
  var isIE = (navigator.appName.indexOf('Internet Explorer') != -1) ? true : false;
  var getMethod = (url != page.url || isIE) ? 'XHR' : 'DOM';
  if (getMethod == 'DOM') {
    myPageContent = getMyElement ('', 'html', 'tag', '', 0, true);
    if (!myPageContent) myPageContent = getMyElement ('', 'body', '', '', -1, true);
    if (clean) myPageContent = cleanMyContent (myPageContent, true);
    myVideosParse = myPageContent.match (pattern);
    myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
    if (myVideosContent) return myVideosContent;
    else getMethod = 'XHR';
  }
  if (getMethod == 'XHR') {
    var xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET', url, false);
    xmlHTTP.send();
    if (pattern == 'XML') {
      myVideosContent = xmlHTTP.responseXML;
    }
    else if (pattern == 'TEXT') {
      myVideosContent = xmlHTTP.responseText;
    }
    else {
      myPageContent = xmlHTTP.responseText;
      if (clean) myPageContent = cleanMyContent (myPageContent, true);
      myVideosParse = myPageContent.match (pattern);
      myVideosContent = (myVideosParse) ? myVideosParse[1] : null;
    }
    return myVideosContent;
  }
}

function setMyOptions (key, value) {
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

function getMyOptions () {
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
      catch (e) {
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
}

function showMyMessage (cause, content) {
  var myScriptLogo = createMyElement ('div', userscript, '', '', '');
  styleMyElement (myScriptLogo, {margin: '0px auto', padding: '10px', color: '#666666', fontSize: '24px', textAlign: 'center', textShadow: '#FFFFFF -1px -1px 2px'});
  var myScriptMess = createMyElement ('div', '', '', '', '');
  styleMyElement (myScriptMess, {border: '1px solid #F4F4F4', margin: '5px auto 5px auto', padding: '10px', backgroundColor: '#FFFFFF', color: '#AD0000', textAlign: 'center'});
  if (cause == '!player') {
    var myScriptAlert = createMyElement ('div', '', '', '', '');
    styleMyElement (myScriptAlert, {position: 'absolute', top: '30%', left: '35%', border: '1px solid #F4F4F4', borderRadius: '3px', padding: '10px', backgroundColor: '#FFFFFF', fontSize: '14px', textAlign: 'center', zIndex: '99999'});
    appendMyElement (myScriptAlert, myScriptLogo);
    var myNoPlayerMess = 'Couldn\'t get the player element. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.';
    modifyMyElement (myScriptMess, 'div', myNoPlayerMess, false);
    appendMyElement (myScriptAlert, myScriptMess);
    var myScriptAlertButton = createMyElement ('div', 'OK', 'click', 'close', myScriptAlert);
    styleMyElement (myScriptAlertButton, {width: '100px', border: '3px solid #EEEEEE', borderRadius: '5px', margin: '0px auto', backgroundColor: '#EEEEEE', color: '#666666', fontSize: '18px', textAlign: 'center', textShadow: '#FFFFFF -1px -1px 2px', cursor: 'pointer'});
    appendMyElement (myScriptAlert, myScriptAlertButton);
    appendMyElement (page.body, myScriptAlert);
  }
  else {
    styleMyElement (saver['saverPanel'], {color: '#AD0000'});
    if (cause == '!content') {
      var myNoContentMess = '<b>SaveTube:</b> Couldn\'t get the videos content. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.';
      modifyMyElement (saver['saverPanel'], 'div', myNoContentMess, false);
    }
    else if (cause == '!videos') {
      var myNoVideosMess = '<b>SaveTube:</b> Couldn\'t get any video. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.';
      modifyMyElement (saver['saverPanel'], 'div', myNoVideosMess, false);
    }
    else if (cause == '!support') {
      var myNoSupportMess = '<b>SaveTube:</b> This video uses the RTMP protocol which is not supported.';
      modifyMyElement (saver['saverPanel'], 'div', myNoSupportMess, false);
    }
    else if (cause == 'embed') {
      var myEmbedMess = '<b>SaveTube:</b> This is an embedded video. You can get it <a href="' + content + '" style="color:#00892C">here</a>.';
      modifyMyElement (saver['saverPanel'], 'div', myEmbedMess, false);
    }
  }
}


// ==========Websites========== //

// Force page reload on href change
page.win.setInterval(function() {
  nurl = page.win.location.href;
  if (page.url != nurl) {
    // YouTube
    if (nurl.indexOf('youtube.com') != -1) {
      if (nurl.indexOf('youtube.com/watch') != -1) page.win.location.href = nurl;
    }
    // Facebook
    else if (nurl.indexOf('facebook.com') != -1) {
      if (nurl.match('facebook.com/(video.php|.*/videos/)')) {
	page.win.location.href = nurl.replace('&theater', '');
      }
    }
    // Others
    else {
      page.win.location.href = nurl;
    }
  }
}, 500);

// =====YouTube===== //

if (page.url.indexOf('youtube.com/watch') != -1) {

  /* Video Availability */
  var ytVideoUnavailable = getMyElement ('', 'div', 'id', 'player-unavailable', -1, false);
  if (ytVideoUnavailable) {
    if (ytVideoUnavailable.className.indexOf('hid') == -1) {
      var ytAgeGateContent = getMyElement ('', 'div', 'id', 'watch7-player-age-gate-content', -1, true);
      if (!ytAgeGateContent) return;
      else {
	if(ytAgeGateContent.indexOf('feature=private_video') != -1) return;
      }
    }
  }

  /* Decrypt Signature */
  var ytScriptSrc;
  function ytDecryptSignature (s) {return null;}
  function ytDecryptFunction () {
    var ytSignFuncName, ytSignFuncBody, ytSwapFuncName, ytSwapFuncBody, ytFuncMatch;
    ytSignFuncName = ytScriptSrc.match(/\.signature\s*=\s*((\$|_|\w)+)\(\w+\)/);
    ytSignFuncName = (ytSignFuncName) ? ytSignFuncName[1] : null;
    if (!ytSignFuncName) {
      ytSignFuncName = ytScriptSrc.match(/"signature"\s*,\s*(.*?)\(/);
      ytSignFuncName = (ytSignFuncName) ? ytSignFuncName[1] : null;
    }
    if (ytSignFuncName) {
      ytFuncMatch = 'function\\s+' + ytSignFuncName.replace(/\$/, '\\$') + '\\s*\\(\\w+\\)\\s*\\{(.*?)\\}';
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

  /* Get Player Window */
  var ytPlayerWindow = getMyElement ('', 'div', 'id', 'placeholder-player', -1, false);
  if (!ytPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Video Title */
    var ytVideoTitle = getMyContent (page.url, 'meta\\s+itemprop="name"\\s+content="(.*?)"', false);
    if (!ytVideoTitle) ytVideoTitle = getMyContent (page.url, 'meta\\s+property="og:title"\\s+content="(.*?)"', false);
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
    var ytVideosContent, ytHLSContent;
    var ytVideosEncodedFmts, ytVideosAdaptiveFmts;
    ytVideosEncodedFmts = getMyContent(page.url, '"url_encoded_fmt_stream_map":\\s*"(.*?)"', false);
    if (ytVideosEncodedFmts) ytVideosEncodedFmts = cleanMyContent(ytVideosEncodedFmts, false);
    ytVideosAdaptiveFmts = getMyContent(page.url, '"adaptive_fmts":\\s*"(.*?)"', false);
    if (ytVideosAdaptiveFmts) ytVideosAdaptiveFmts = cleanMyContent(ytVideosAdaptiveFmts, false);
    if (ytVideosEncodedFmts) {
      ytVideosContent = ytVideosEncodedFmts;
    }
    else {
      if (!ytVideoID) {
	var ytVideoID = page.url.match (/(\?|&)v=(.*?)(&|$)/);
	ytVideoID = (ytVideoID) ? ytVideoID[2] : null;
      }
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
    if (ytVideosAdaptiveFmts) {
      ytVideosAdaptiveFmts = ytVideosAdaptiveFmts.replace(/clen=\d+&/g, '').replace(/&clen=\d+/g, '');
      ytVideosAdaptiveFmts = ytVideosAdaptiveFmts.replace(/lmt=\d+&/g, '').replace(/&lmt=\d+/g, '');
      if (ytVideosContent) ytVideosContent += ',' + ytVideosAdaptiveFmts;
      else ytVideosContent = ytVideosAdaptiveFmts;
    }

    /* Get HLS Content */
    if (!ytVideosContent) {
      var ytHLSVideos, ytHLSContent;
      ytHLSVideos = getMyContent(page.url, '"hlsvp":\\s*"(.*?)"', false);
      if (ytHLSVideos) ytHLSVideos = cleanMyContent(ytHLSVideos, false);
    }

    /* Fix Sidebar */
    //var ytSidebarWindow = getMyElement ('', 'div', 'id', 'watch7-sidebar', -1, false);
    //if (ytSidebarWindow) styleMyElement(ytSidebarWindow, {marginTop: '-412px'});

    /* Create Saver */
    var ytDefaultVideo = 'Low Definition MP4';
    function ytSaver () {
      saver = {'saverSocket': ytPlayerWindow, 'videoList': ytVideoList, 'videoSave': ytDefaultVideo, 'videoTitle': ytVideoTitle, 'saverWidth': 640};
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
	ytVideoCodeParse = ytVideos[i].match (/itag=(\d{1,3})/);
	ytVideoCode = (ytVideoCodeParse) ? ytVideoCodeParse[1] : null;
	if (ytVideoCode) {
	  myVideoCode = ytVideoFormats[ytVideoCode];
	  if (myVideoCode) {
	    ytVideo = ytVideos[i].replace (/url=/, '').replace(/&$/, '').replace(/&itag=\d{1,3}/, '');
	    if (ytVideo.match(/type=(video|audio).*?&/)) ytVideo = ytVideo.replace(/type=(video|audio).*?&/, '');
	    else ytVideo = ytVideo.replace(/&type=(video|audio).*$/, '');
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
	    ytVideo = cleanMyContent (ytVideo, true);
	    if (ytVideo.indexOf('ratebypass') == -1) ytVideo += '&ratebypass=yes';
	    if (ytVideo && ytVideo.indexOf('http') == 0) {
	      if (!ytVideoFound) ytVideoFound = true;
	      ytVideoList[myVideoCode] = ytVideo;
	    }
	  }
	}
      }

      if (ytVideoFound) {
	/* Create Saver */
	feature['autoget'] = true;
	ytSaver();
	createMySaver();
      }
      else {
	saver = {'saverSocket': ytPlayerWindow, 'saverWidth': 640};
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
      if (ytVideosContent.match(/&s=/) || ytVideosContent.match(/,s=/)) {
	var ytScriptURL = getMyContent(page.url, '"js":\\s*"(.*?)"', true);
	if (!ytScriptURL) ytScriptURL = getMyContent(page.url.replace(/watch.*?v=/, 'embed/').replace(/&.*$/, ''), '"js":\\s*"(.*?)"', true);
	if (ytScriptURL) {
	  ytScriptURL = page.win.location.protocol + ytScriptURL;
	  try {
	    ytScriptSrc = getMyContent(ytScriptURL, 'TEXT', false);
	    if (ytScriptSrc) ytDecryptFunction();
	    ytVideos();
	  }
	  catch (e) {
	    try {
	      GM_xmlhttpRequest({
		method: 'GET',
		url: ytScriptURL,
		onload: function(response) {
		  if (response.readyState === 4 && response.status === 200) {
		    ytScriptSrc = response.responseText;
		  }
		  if (ytScriptSrc) ytDecryptFunction();
		  ytVideos();
		}
	      });
	    }
	    catch (e) {
	      ytVideos();
	    }
	  }
	}
	else {
	  ytVideos();
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
	catch (e) {
	  try {
	    GM_xmlhttpRequest({
	      method: 'GET',
	      url: ytHLSVideos,
	      onload: function(response) {
		if (response.readyState === 4 && response.status === 200) {
		  ytHLSContent = response.responseText;
		}
		ytHLS();
	      }
	    });
	  }
	  catch (e) {
	    ytHLS();
	  }
	}
      }
      else {
	saver = {'saverSocket': ytPlayerWindow, 'saverWidth': 640, 'warnMess': '!content'};
	createMySaver ();
      }
    }
  }

}

// =====DailyMotion===== //

else if (page.url.indexOf('dailymotion.com/video') != -1 || page.url.indexOf('dailymotion.com/playlist') != -1) {

  /* Redirect Playlist To Video */
  if (page.url.indexOf('dailymotion.com/playlist') != -1 && page.url.indexOf('#video=') != -1) {
    page.win.location.href = page.url.replace(/playlist.*#/, '').replace("=", "/");
  }

  /* Get Player Window */
  var dmPlayerWindow = getMyElement ('', 'div', 'class', 'js-player-box', 0, false);
  if (!dmPlayerWindow) dmPlayerWindow = getMyElement ('', 'div', 'id', 'player_container', -1, false);
  if (!dmPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Videos Content */
    var dmEmbed;
    if (page.url.indexOf('dailymotion.com/video') != -1) dmEmbed = page.url.replace(/\/video\//, "/embed/video/");
    else dmEmbed = page.url.replace(/playlist.*=/, "embed/video/");
    dmVideosContent = getMyContent (dmEmbed, '"qualities":\\{(.*?)\\]\\},', false);

    /* Get Videos */
    if (dmVideosContent) {
      var dmVideoFormats = {'240': 'Very Low Definition MP4', '380': 'Low Definition MP4', '480': 'Standard Definition MP4',
			    '720': 'High Definition MP4', '1080': 'Full High Definition MP4'};
      var dmVideoList = {};
      var dmVideoFound = false;
      var dmVideoParser, dmVideoParse, myVideoCode, dmVideo;
      for (var dmVideoCode in dmVideoFormats) {
	dmVideoParser = '"' + dmVideoCode + '".*?"url":"(.*?)"';
	dmVideoParse = dmVideosContent.match (dmVideoParser);
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
	saver = {'saverSocket': dmPlayerWindow, 'videoList': dmVideoList, 'videoSave': dmDefaultVideo, 'saverWidth': 800};
	feature['container'] = false;
	option['definitions'] = ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
	option['containers'] = ['MP4'];
	createMySaver ();
      }
      else {
	saver = {'saverSocket': dmPlayerWindow, 'saverWidth': 800, 'warnMess': '!videos'};
	createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': dmPlayerWindow, 'saverWidth': 800, 'warnMess': '!content'};
      createMySaver ();
    }
  }

}

// =====Vimeo===== //

else if (page.url.match(/vimeo.com\/\d+/) || page.url.match(/vimeo.com\/channels\/[^\/]*($|\/page|\/\d+)/) || page.url.match(/vimeo.com\/originals\/[^\/]*\/\d+/) || page.url.match(/vimeo.com\/album\/\d+\/video\/\d+/)) {

  /* Multi Video Page */
  if (getMyElement('', 'div', 'class', 'player_container', -1, false).length > 1) return;

  /* Saver Width */
  var viSaverWidth = 960;
  if (page.url.indexOf('/channels/') != -1 && page.url.indexOf('/channels/staffpicks') == -1) {
    viSaverWidth = 630;
  }

  /* Get Player Window */
  var viPlayerWindow = getMyElement ('', 'div', 'class', 'player_container', 0, false) || null;
  if (!viPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Restyle Player Window */
    styleMyElement (viPlayerWindow, {margin: '0px 0px 20px 0px'});

    /* Get Content Source */
    var viVideoSource = getMyContent (page.url, 'data-config-url="(.*?)"', false).replace(/&amp;/g, '&');

    /* Get Videos Content */
    var viVideosContent;
    if (viVideoSource) {
      viVideosContent = getMyContent(viVideoSource, '"h264":\\{(.*?)\\}\\}', false);
      if (!viVideosContent) viVideosContent = getMyContent(viVideoSource, '"vp6":\\{(.*?)\\}\\}', false);
    }

    /* Get Videos */
    if (viVideosContent) {
      var viVideoFormats = {'hd': 'High Definition MP4', 'sd': 'Low Definition MP4', 'mobile': 'Very Low Definition MP4'};
      var viVideoList = {};
      var viVideoFound = false;
      var viPattern, viMatcher, viVideo, myVideoCode;
      for (var viVideoCode in viVideoFormats) {
	viPattern = '"' + viVideoCode + '":\\{.*?"url":"(.*?)"';
	viMatcher = viVideosContent.match(viPattern);
	viVideo = (viMatcher) ? viMatcher[1] : null;
	if (viVideo) {
	  if (!viVideoFound) viVideoFound = true;
	  myVideoCode = viVideoFormats[viVideoCode];
	  viVideoList[myVideoCode] = viVideo;
	}
      }

      if (viVideoFound) {
	/* Create Saver */
	var viDefaultVideo = 'Low Definition MP4';
	saver = {'saverSocket': viPlayerWindow, 'videoList': viVideoList, 'videoSave': viDefaultVideo, 'saverWidth': viSaverWidth};
	feature['container'] = false;
	option['definitions'] = ['High Definition', 'Low Definition', 'Very Low Definition'];
	option['containers'] = ['MP4'];
	createMySaver ();
      }
      else {
	saver = {'saverSocket': viPlayerWindow, 'saverWidth': viSaverWidth, 'warnMess': '!videos'};
	createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': viPlayerWindow, 'saverWidth': viSaverWidth, 'warnMess': '!content'};
      createMySaver ();
    }
  }

}

// =====MetaCafe===== //

else if (page.url.indexOf('metacafe.com/watch') != -1) {

  /* Get Player Window */
  var mcPlayerWindow = getMyElement ('', 'div', 'id', 'FlashWrap', -1, false);
  if (!mcPlayerWindow) mcPlayerWindow = getMyElement ('', 'div', 'id', 'ItemContainer', -1, false);
  if (!mcPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Check Video Availability */
    if (mcPlayerWindow.innerHTML.indexOf('This Video cannot be played on this device.') != -1) return;

    /* Restyle Player Window */
    styleMyElement (mcPlayerWindow, {margin: '0px 0px 30px 0px'});

    /* Get Videos Content */
    var mcVideosContent, mcVideo;
    var mcFlashVideo = getMyElement (mcPlayerWindow, 'embed', 'tag', '', 0, false) || getMyElement (mcPlayerWindow, 'object', 'tag', '', 0, false);
    if (mcFlashVideo) {
      mcVideosContent = getMyContent (page.url, '"mediaData":"(.*?)"', false);
      if (!mcVideosContent) {
	anyClipId = page.url.match(/\/an-(.*?)\//);
	if (anyClipId && anyClipId[1]) {
	  mcVideo = 'http://vid2.anyclip.com/' + anyClipId[1];
	}
      }
    }
    else mcVideo = getMyContent (page.url, 'video\\s+src="(.*?)"', false);
    /* New */
    if (!mcVideosContent && !mcVideo) {
      mcVideo = getMyContent (page.url, 'videoURL=(.*?)&', true);
    }

    /* Get Videos */
    if (mcVideosContent || mcVideo) {
      var mcVideoList = {};
      var mcVideoFound = false;
      if (mcVideosContent) {
	mcVideosContent = cleanMyContent(mcVideosContent, true);
	var mcVideoFormats = {'highDefinitionMP4': 'High Definition MP4', 'MP4': 'Low Definition MP4', 'flv': 'Low Definition FLV'};
	var mcVideoParser, mcVideoParse, myVideoCode, mcVideoPath, mcVideoKey, mcVideo;
	for (var mcVideoCode in mcVideoFormats) {
	  mcVideoParser = '"' + mcVideoCode + '":\\{.*?"mediaURL":"(.*?)","access":\\[\\{"key":"(.*?)","value":"(.*?)"\\}\\]\\}';
	  mcVideoParse = mcVideosContent.match (mcVideoParser);
	  mcVideoPath = (mcVideoParse) ? mcVideoParse[1] : null;
	  mcVideoKeyName = (mcVideoParse) ? mcVideoParse[2] : null;
	  mcVideoKeyValue = (mcVideoParse) ? mcVideoParse[3] : null;
	  if (mcVideoPath && mcVideoKeyName && mcVideoKeyValue) {
	    if (!mcVideoFound) mcVideoFound = true;
	    myVideoCode = mcVideoFormats[mcVideoCode];
	    mcVideo = mcVideoPath + '?' + mcVideoKeyName + '=' + mcVideoKeyValue;
	    mcVideoList[myVideoCode] = mcVideo;
	  }
	}
      }
      else {
	mcVideoList['Low Definition MP4'] = mcVideo;
	mcVideoFound = true;
	feature['definition'] = false;
	feature['container'] = false;
      }

      if (mcVideoFound) {
	/* Create Saver */
	var mcDefaultVideo = (mcVideoList['Low Definition MP4']) ? 'Low Definition MP4' : 'Low Definition FLV';
	saver = {'saverSocket': mcPlayerWindow, 'videoList': mcVideoList, 'videoSave': mcDefaultVideo, 'saverWidth': 640};
	option['definitions'] = ['High Definition', 'Low Definition'];
	option['containers'] = ['MP4', 'FLV', 'Any'];
	createMySaver ();
      }
      else {
	saver = {'saverSocket': mcPlayerWindow, 'saverWidth': 640, 'warnMess': '!videos'};
	createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': mcPlayerWindow, 'saverWidth': 640};
      var ytVideoId = page.url.match (/\/yt-(.*?)\//);
      if (ytVideoId && ytVideoId[1]) {
	var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId[1];
	saver['warnMess'] = 'embed';
	saver['warnContent'] = ytVideoLink;
      }
      else saver['warnMess'] = '!videos';
      createMySaver ();
    }
  }

}

// =====Break===== //

else if (page.url.indexOf('break.com/video') != -1 || page.url.indexOf('break.com/movies') != -1) {

  /* Get Player Window */
  var brPlayerWindow = getMyElement ('', 'div', 'id', 'video-player', -1, false);
  if (!brPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Saver Width */
    var brWindowWidth = page.win.innerWidth || page.doc.documentElement.clientWidth;
    var brSaverWidth;
    if (page.url.indexOf('break.com/movies') != -1) {
      if (brWindowWidth >= 1400) brSaverWidth = 1152;
      else brSaverWidth = 912;
    }
    else {
      if (brWindowWidth >= 1400) brSaverWidth = 832;
      else brSaverWidth = 592;
    }

    /* Get Video ID */
    var brVideoID = page.url.match(/-(\d+)($|\?)/);
    brVideoID = (brVideoID) ? brVideoID[1] : null;

    /* Get Videos Content */
    var brSource = page.win.location.protocol + '//' + page.win.location.hostname + '/embed/' + brVideoID;
    var brVideosContent = getMyContent (brSource, 'TEXT', false);

    /* Get Videos */
    if (brVideosContent) {
      var brVideoList = {};
      var brVideoFormats = {};
      var brVideoFound = false;
      var brVideoFormats = {'320_kbps.mp4': 'Very Low Definition MP4', '496_kbps.mp4': 'Low Definition MP4', '864_kbps.mp4': 'Standard Definition MP4', '2240_kbps.mp4': 'High Definition MP4', '3264_kbps.mp4': 'Full High Definition MP4'};
      var brVideoPath, brVideoToken, brVideoThumb, brVideo, myVideoCode;
      brVideoPath = brVideosContent.match (/"videoUri":\s"(.*?)496_kbps/);
      brVideoPath = (brVideoPath) ? brVideoPath[1] : null;
      brVideoToken = brVideosContent.match (/"AuthToken":\s"(.*?)"/);
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
	saver = {'saverSocket': brPlayerWindow, 'videoList': brVideoList, 'videoSave': brDefaultVideo, 'saverWidth': brSaverWidth};
	option['definitions'] = ['Very Low Definition', 'Low Definition', 'Standard Definition', 'High Definition', 'Full High Definition'];
	option['containers'] = ['MP4', 'FLV', 'Any'];
	createMySaver ();
      }
      else {
	saver = {'saverSocket': brPlayerWindow, 'saverWidth': brSaverWidth};
	var ytVideoId =  brVideosContent.match (/"youtubeId":\s"(.*?)"/);
	if (ytVideoId && ytVideoId[1]) {
	  var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId[1];
	  saver['warnMess'] = 'embed';
	  saver['warnContent'] = ytVideoLink;
	}
	else saver['warnMess'] = '!videos';
	createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': brPlayerWindow, 'saverWidth': brSaverWidth, 'warnMess': '!content'};
      createMySaver ();
    }
  }

}

// =====FunnyOrDie===== //

else if (page.url.indexOf('funnyordie.com/videos') != -1) {

  /* Get Player Window */
  var fodPlayerWindow = getMyElement ('', 'div', 'class', 'video-content', 0, false);
  if (!fodPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* My Saver Socket */
    var fodSaverSocket = createMyElement ('div', '', '', '', '');
    styleMyElement (fodSaverSocket, {width: '100%', height: '24px', textAlign: 'center', padding: '0px 100px 0px 100px', backgroundColor: '#F4F4F4'});
    appendMyElement (fodPlayerWindow, fodSaverSocket);

    /* Get Videos Content */
    var fodVideosContent = getMyContent (page.url, '<video([\\s\\S]*?)video>', false);

    /* Get Videos */
    if (fodVideosContent) {
      var fodVideoFormats = {'v2500.mp4': 'High Definition MP4', 'v1800.mp4': 'Standard Definition MP4', 'v600.mp4': 'Low Definition MP4', 'v600.webm': 'Low Definition WebM', 'v110.mp4': 'Very Low Definition MP4'};
      var fodVideoList = {};
      var fodVideoFound = false;
      var fodVideoPath, fodVideoCodes, fodVideo, myVideoCode;
      fodVideoPath = fodVideosContent.match(/src="(.*?)v\d+.*?\.mp4"/);
      fodVideoPath = (fodVideoPath) ? fodVideoPath[1] : null;
      fodVideoCodes = fodVideosContent.match (/v,(.*?),\./);
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
	saver = {'saverSocket': fodSaverSocket, 'videoList': fodVideoList, 'videoSave': fodDefaultVideo, 'saverWidth': 570};
	feature['container'] = false;
	option['definitions'] = ['High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
	option['containers'] = ['MP4'];
	createMySaver ();
      }
      else {
	saver = {'saverSocket': fodPlayerWindow, 'saverWidth': 570, 'warnMess': '!videos'};
	createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': fodPlayerWindow, 'saverWidth': 570, 'warnMess': '!content'};
      createMySaver ();
    }
  }

}

// =====Videojug===== //

else if (page.url.indexOf('videojug.com/') != -1) {

  /* Get Player Window */
  var vjPlayerWindow = getMyElement ('', 'div', 'id', 'player_shadow', -1, false);
  var vjPlayerWidth;
  if (page.url.indexOf("videojug.com/film") != -1) vjPlayerWidth = 640;
  else if (page.url.indexOf("videojug.com/series") != -1) vjPlayerWidth = 768;
  else return;
  if (!vjPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Videos Content */
    var vjVideoID = getMyContent (page.url, 'data-videoid="(.*?)"', true);
    var vjVideoTitle = getMyContent (page.url, 'data-filenameprefix="(.*?)"', true);

    /* Get Videos */
    if (vjVideoID && vjVideoTitle) {
      var vjVideoID2 = vjVideoID.substring(0,2);
      var vjVideoProtocol = page.win.location.protocol;
      var vjVideoSource = vjVideoProtocol + '//' + page.win.location.hostname + '/views/film/playlist.aspx?id=' + vjVideoID;
      var vjVideoShapes = getMyContent(vjVideoSource, '<Shapes>(.*?)<\/Shapes>', false);
      var vjVideoFormats = {'VJ480PENG.mp4': 'Standard Definition MP4', 'VJ360PENG.mp4': 'Low Definition MP4', 'PHOENG.mp4': 'Very Low Definition MP4', 'FW8ENG.flv': 'Low Definition FLV', 'FS8ENG.flv': 'Very Low Definition FLV'};
      var vjVideoList = {};
      var vjVideoFound = false;
      var vjVideoPart, myVideoCode, vjVideo, vjVideoCodePart, vjVideoPattern, vjVideoLocation;
      if (vjVideoShapes) {
	vjVideoPart = vjVideoID2 + '/' + vjVideoID + '/' + vjVideoTitle;
	for (var vjVideoCode in vjVideoFormats) {
	  if (vjVideoCode.indexOf('VJ') != -1) vjVideoCodePart = vjVideoCode.substring(0, 6);
	  else vjVideoCodePart = vjVideoCode.substring(0, 3);
	  vjVideoPattern = 'Code="' + vjVideoCodePart + '"\\s+Locations="(.*?),';
	  vjVideoLocation = vjVideoShapes.match(vjVideoPattern);
	  vjVideoLocation = (vjVideoLocation) ? vjVideoProtocol + '//' + vjVideoLocation[1] : null;
	  if (vjVideoLocation) {
	    if (!vjVideoFound) vjVideoFound = true;
	    vjVideo = vjVideoLocation + '/' + vjVideoPart + '__' + vjVideoCode;
	    myVideoCode = vjVideoFormats[vjVideoCode];
	    vjVideoList[myVideoCode] = vjVideo;
	  }
	}
      }

      if (vjVideoFound) {
	/* Create Saver */
	var vjDefaultVideo = 'Low Definition MP4';
	saver = {'saverSocket': vjPlayerWindow, 'videoList': vjVideoList, 'videoSave': vjDefaultVideo, 'saverWidth': vjPlayerWidth};
	option['definition'] = 'SD';
	option['definitions'] = ['Standard Definition', 'Low Definition', 'Very Low Definition'];
	option['containers'] = ['MP4', 'FLV', 'Any'];
	createMySaver ();
      }
      else {
	saver = {'saverSocket': vjPlayerWindow, 'saverWidth': vjPlayerWidth, 'warnMess': '!videos'};
	createMySaver ();
      }
    }
    else {
	saver = {'saverSocket': vjPlayerWindow, 'saverWidth': vjPlayerWidth, 'warnMess': '!content'};
	createMySaver ();
    }
  }
  if (saver['saverPanel'] && vjPlayerWidth == 768) {
    styleMyElement(saver['saverPanel'], {marginTop: '10px'});
  }

}

// =====Blip===== //

else if (page.url.indexOf('blip.tv') != -1) {

  /* Get Page Type */
  var blipPageType = getMyContent (page.url, 'meta\\s+property="video:tag"\\s+content="(.*?)"', false);
  if (!blipPageType || blipPageType.indexOf('episode') == -1) return;

  /* Get Player Window */
  var blipSaverWidth;
  var blipPlayerWindow = getMyElement ('', 'div', 'class', 'Theater', 0, false) || getMyElement ('', 'div', 'id', 'ErrorWrap', -1, false);
  if (!blipPlayerWindow) {
    blipPlayerWindow = getMyElement ('', 'div', 'id', 'PlayerEmbed', -1, false);
    blipSaverWidth = 596;
  }
  else {
    blipSaverWidth = 960;
  }
  if (!blipPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* My Saver Socket */
    var blipSaverSocket = createMyElement ('div', '', '', '', '');
    styleMyElement (blipSaverSocket, {width: blipSaverWidth + 'px', textAlign: 'center', margin: '0px auto'});
    appendMyElement (blipPlayerWindow, blipSaverSocket);

    /* Get Videos Content */
    var blipVideosContent = getMyContent(page.url + '?skin=json', '"additionalMedia":\\[(.*?)\\]', false);

    /* Get Videos */
    if (blipVideosContent) {
      var blipVideoList = {};
      var blipVideoFound = false;
      var blipMimeTypes = {'video/x-m4v': 'M4V', 'video/quicktime': 'MOV', 'video/mp4': 'MP4', 'video/x-flv': 'FLV'};
      var blipVideos = blipVideosContent.split(',{');
      var blipVideoURL, blipVideoMime, blipVideoHeight, blipVideoRole, blipVideoDef, blipVideoCode;
      var blipDefaultVideo = 'Low Definition MP4';
      for (var blipV = 0; blipV < blipVideos.length; blipV++) {
	blipVideoMime = blipVideos[blipV].match(/"primary_mime_type":"(.*?)"/);
	blipVideoMime = (blipVideoMime) ? blipVideoMime[1] : null;
	if (blipMimeTypes[blipVideoMime]) {
	  blipVideoURL = blipVideos[blipV].match(/"url":"(.*?)"/);
	  blipVideoURL = (blipVideoURL) ? blipVideoURL[1] : null;
	  blipVideoHeight = blipVideos[blipV].match(/"media_height":"(.*?)"/);
	  blipVideoHeight = (blipVideoHeight) ? blipVideoHeight[1] : null;
	  blipVideoRole = blipVideos[blipV].match(/"role":"(.*?)"/);
	  blipVideoRole = (blipVideoRole) ? blipVideoRole[1] : null;
	  if (blipVideoURL && blipVideoHeight && blipVideoRole) {
	    if (!blipVideoFound) blipVideoFound = true;
	    if (blipVideoHeight >= 200 && blipVideoHeight < 400) blipVideoDef = 'Low Definition';
	    else if (blipVideoHeight >= 400 && blipVideoHeight < 700) blipVideoDef = 'Standard Definition';
	    else if (blipVideoHeight >= 700) blipVideoDef = 'High Definition';
	    blipVideoCode = blipVideoDef + ' ' + blipMimeTypes[blipVideoMime];
	    blipVideoList[blipVideoCode] = blipVideoURL;
	    if (blipVideoRole == 'Source') blipDefaultVideo = blipVideoCode;
	  }
	}
      }

      if (blipVideoFound) {
	/* Create Saver */
	saver = {'saverSocket': blipSaverSocket, 'videoList': blipVideoList, 'videoSave': blipDefaultVideo, 'saverWidth': blipSaverWidth};
	option['definitions'] = ['High Definition', 'Standard Definition', 'Low Definition'];
	option['containers'] = ['MP4', 'M4V', 'MOV', 'FLV', 'Any'];
	createMySaver ();
      }
      else {
	saver = {'saverSocket': blipPlayerWindow, 'saverWidth': blipSaverWidth, 'warnMess': '!videos'};
	createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': blipPlayerWindow, 'saverWidth': blipSaverWidth, 'warnMess': '!content'};
      createMySaver ();
    }
  }

}

// =====Veoh===== //

else if (page.url.indexOf('veoh.com/watch') != -1) {

  /* Get Video Availability */
  if (getMyElement ('', 'div', 'class', 'veoh-video-player-error', 0, false)) return;

  /* Get Player Window */
  var vePlayerWindow = getMyElement ('', 'div', 'id', 'videoPlayerContainer', -1, false);
  if (!vePlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Videos Content */
    var veVideosContent = getMyContent (page.url, '__watch.videoDetailsJSON = \'\\{(.*?)\\}', false);
    veVideosContent = cleanMyContent (veVideosContent, true);

    /* Restyle Player Window */
    styleMyElement (vePlayerWindow, {margin: '0px 0px 20px 0px'});

    /* Get Videos */
    if (veVideosContent) {
      var veVideoFormats = {'fullPreviewHashLowPath': 'Very Low Definition MP4', 'fullPreviewHashHighPath': 'Low Definition MP4'};
      var veVideoList = {};
      var veVideoFound = false;
      var veVideoParser, veVideoParse, veVideo, myVideoCode;
      for (var veVideoCode in veVideoFormats) {
	veVideoParser = veVideoCode + '":"(.*?)"';
	veVideoParse = veVideosContent.match (veVideoParser);
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
	saver = {'saverSocket': vePlayerWindow, 'videoList': veVideoList, 'videoSave': veDefaultVideo, 'saverWidth': 640};
	feature['container'] = false;
	feature['fullsize'] = false;
	option['definition'] = 'LD';
	option['definitions'] = ['Low Definition', 'Very Low Definition'];
	option['containers'] = ['MP4'];
	createMySaver ();
      }
      else {
	saver = {'saverSocket': vePlayerWindow, 'saverWidth': 640};
	var veVideoSource = getMyContent(page.url, '"videoContentSource":"(.*?)"', false);
	if (veVideoSource == 'YouTube') var ytVideoId = getMyContent(page.url, '"videoId":"yapi-(.*?)"', false);
	if (ytVideoId) {
	  var ytVideoLink = 'http://youtube.com/watch?v=' + ytVideoId;
	  saver['warnMess'] = 'embed';
	  saver['warnContent'] = ytVideoLink;
	  styleMyElement(vePlayerWindow, {margin: '0px 0px 20px 0px'});
	}
	else saver['warnMess'] = '!videos';
	createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': vePlayerWindow, 'saverWidth': 640, 'warnMess': '!content'};
      createMySaver ();
    }
  }

}

// =====Crackle===== //

else if (page.url.indexOf('crackle.com/') != -1) {

  /* Get Page Type */
  var crPageType = getMyContent (page.url, 'meta\\s+property="og:type"\\s+content="(.*?)"', false);
  if (!crPageType || crPageType.indexOf('video') == -1) return;

  /* Get Player Window */
  var crPlayerWindow = getMyElement ('', 'div', 'class', 'player-stage-area1', 0, false);
  if (!crPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Restyle */
    if (!getMyElement(crPlayerWindow, 'div', 'class', 'clearall', 0, false)) {
      var myClearFix = createMyElement ('div', '', '', '', '');
      styleMyElement (myClearFix, {clear: 'both'});
      appendMyElement (crPlayerWindow, myClearFix);
    }
    var crContent = getMyElement ('', 'div', 'id', 'content', -1, false);
    styleMyElement (crContent, {marginTop: '30px'});
    var crPlayerImage = getMyElement ('', 'div', 'class', 'image-stage-area', 0, false);
    if (crPlayerImage) removeMyElement (crPlayerImage.parentNode, crPlayerImage);

    /* Get Videos Content */
    var crVideoPath = getMyContent (page.url, 'images-us-am.crackle.com\/(.*?_)tnl', false);
    if (!crVideoPath) {
      var crVideoID = getMyContent (page.url, 'mediaId:\\s*(.*?),', false);
      if (crVideoID) {
	var crVidWallCache = page.win.location.protocol + '//' + page.win.location.hostname + '/app/vidwallcache.aspx?flags=-1&fm=' + crVideoID + '&partner=20';
	crVideoPath = getMyContent (crVidWallCache, '\\sp="(.*?)"', false);
      }
    }

    /* Get Videos */
    if (crVideoPath) {
      var crVideoList = {};
      var crVideoFormats = {'360p.mp4': 'Low Definition MP4', '480p.mp4': 'Standard Definition MP4'};
      var crVideoThumb, crVideo, myVideoCode;
      for (var crVideoCode in crVideoFormats) {
	crVideo = 'http://media-us-am.crackle.com/' + crVideoPath + crVideoCode;
	myVideoCode = crVideoFormats[crVideoCode];
	crVideoList[myVideoCode] = crVideo;
      }

      /* Create Saver */
      var crDefaultVideo = 'Low Definition MP4';
      saver = {'saverSocket': crPlayerWindow, 'videoList': crVideoList, 'videoSave': crDefaultVideo, 'saverWidth': 970};
      feature['container'] = false;
      option['definition'] = 'SD';
      option['definitions'] = ['Standard Definition', 'Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver ();

      /* Fix Thumbnails */
      var crThumbs = getMyElement('', 'div', 'class', 'thumbnail', -1, false);
      for (var crT = 0; crT < crThumbs.length; crT++) {
	if (crThumbs[crT].innerHTML.indexOf('AddObjectToQueue') != -1) {
	  var crLink = crThumbs[crT].innerHTML.match(/,\s+\d+,\s+'(.*?)'/);
	  crLink = (crLink) ? crLink[1] : null;
	  var crImg = crThumbs[crT].innerHTML.match(/src="(.*?)"/);
	  crImg = (crImg) ? crImg[1] : null;
	  crThumbs[crT].innerHTML = '<img src="' + crImg + '" onclick="window.location.href=\'' + crLink + '\'" style="cursor:pointer">';
	}
      }
    }
    else {
      saver = {'saverSocket': crPlayerWindow, 'saverWidth': 970, 'warnMess': '!videos'};
      createMySaver ();
    }

  }

}

// =====Viki===== //

else if (page.url.indexOf('viki.com/videos') != -1) {

  /* Get Player Window */
  var vkSaverWindow = getMyElement ('', 'div', 'class', 'card-content', 0, false);
  if (!vkSaverWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Video ID */
    var vkVideoID = page.url.match(/videos\/(.*?)v/);
    vkVideoID = (vkVideoID) ? vkVideoID[1] : null;

    /* Get Videos Content */
    var vkVideosContent;
    if (vkVideoID) vkVideosContent = getMyContent (page.win.location.protocol + '//' + page.win.location.host + '/player5_fragment/' + vkVideoID + 'v.json', 'TEXT', false);

    /* Saver Width*/
    var vkSaverWith = parseInt(vkSaverWindow.clientWidth) - 20;

    /* Get Videos */
    if (vkVideosContent) {
      var vkVideoList = {};
      var vkVideo = vkVideosContent.match(/"video_url":"(.*?)"/);
      vkVideo = (vkVideo) ? vkVideo[1] : null;

      /* Create Saver */
      if (vkVideo) {
	var vkDefaultVideo = 'Low Definition MP4';
	vkVideoList[vkDefaultVideo] = vkVideo
	saver = {'saverSocket': vkSaverWindow, 'videoList': vkVideoList, 'videoSave': vkDefaultVideo, 'saverWidth': vkSaverWith};
	feature['definition'] = false;
	feature['container'] = false;
	option['definition'] = 'LD';
	option['definitions'] = ['Low Definition'];
	option['containers'] = ['MP4'];
	createMySaver ();
      }
      else {
	saver = {'saverSocket': vkPlayerWindow, 'saverWidth': vkSaverWith, 'warnMess': '!videos'};
	createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': vkPlayerWindow, 'saverWidth': vkSaverWith, 'warnMess': '!content'};
      createMySaver ();
    }
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

  /* Get Player Window */
  var imdbPlayerWindow = getMyElement ('', 'div', 'id', 'player-article', -1, false);
  if (!imdbPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Videos Content */
    var imdbVideoList = {};
    var imdbVideoFormats = {'1': 'Low Definition MP4', '2': 'Standard Definition MP4', '3': 'High Definition MP4'};
    var imdbDefaultVideo, imdbURL, imdbVideo, myVideoCode;
    var imdbVideoFound = false;
    var imdbVideoRTMP = false;
    var imdbPageURL = page.url.replace(/\?.*$/, '').replace(/\/$/, '');
    for (var imdbVideoCode in imdbVideoFormats) {
      imdbURL = imdbPageURL + '/player?uff=' + imdbVideoCode;
      imdbVideo = getMyContent (imdbURL, 'so.addVariable\\("file",\\s+"(.*?)"\\);', true);
      if (imdbVideo) {
	if (imdbVideo.indexOf('rtmp') != -1) {
	  if (!imdbVideoRTMP) imdbVideoRTMP = true;
	}
   	else {
	  if (!imdbVideoFound) imdbVideoFound = true;
	  myVideoCode = imdbVideoFormats[imdbVideoCode];
	  imdbVideoList[myVideoCode] = imdbVideo;
	  if (!imdbDefaultVideo) imdbDefaultVideo = myVideoCode;
	}
      }
    }

    if (imdbVideoFound) {
      /* Create Saver */
      saver = {'saverSocket': imdbPlayerWindow, 'videoList': imdbVideoList, 'videoSave': imdbDefaultVideo, 'saverWidth': 1010};
      feature['container'] = false;
      option['definitions'] = ['High Definition', 'Standard Definition', 'Low Definition'];
      option['containers'] = ['MP4'];
      createMySaver ();
    }
    else {
      if (imdbVideoRTMP) {
	saver = {'saverSocket': imdbPlayerWindow, 'saverWidth': 1010, 'warnMess': '!support'};
	createMySaver ();
      }
      else {
	saver = {'saverSocket': imdbPlayerWindow, 'saverWidth': 1010, 'warnMess': '!videos'};
	createMySaver ();
      }
    }
  }

}

// =====Facebook===== //

else if (page.url.match('facebook.com/(video.php|.*/videos/)')) {

  /* Get Player Window */
  var fbPlayerWindow = getMyElement ('', 'div', 'class', 'stageButtons', 0, false);
  if (!fbPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Get Videos Content */
    var fbVideosContent = getMyContent(page.url, '"params","(.*?)"', false);
    var fbPattern = /\\u([\d\w]{4})/gi;
    fbVideosContent = fbVideosContent.replace(fbPattern, function (match, group) {
      return String.fromCharCode(parseInt(group, 16));
    });
    fbVideosContent = unescape(fbVideosContent);

    /* Get Videos */
    if (fbVideosContent) {
      var fbVideoList = {};
      var fbVideoFormats = {'sd_src': 'Low Definition MP4', 'hd_src': 'High Definition MP4'};
      var fbVideoFound = false;
      var fbVideoPattern, fbVideo, myVideoCode, fbVideoThumb, fbDefaultVideo;
      for (var fbVideoCode in fbVideoFormats) {
	fbVideoPattern = '"' + fbVideoCode + '":"(.*?)"';
	fbVideo = fbVideosContent.match(fbVideoPattern);
	fbVideo = (fbVideo) ? fbVideo[1] : null;
	if (fbVideo) {
	  fbVideo = cleanMyContent(fbVideo, false);
	  if (!fbVideoFound) fbVideoFound = true;
	  myVideoCode = fbVideoFormats[fbVideoCode];
	  if (fbVideo.indexOf('.flv') != -1) myVideoCode = myVideoCode.replace('MP4', 'FLV');
	  fbVideoList[myVideoCode] = fbVideo;
	  if (!fbDefaultVideo) fbDefaultVideo = myVideoCode;
	}
      }

      if (fbVideoFound) {
	/* Create Saver */
	saver = {'saverSocket': fbPlayerWindow, 'videoList': fbVideoList, 'videoSave': fbDefaultVideo, 'saverWidth': 760};
	option['definitions'] = ['High Definition', 'Low Definition'];
	option['containers'] = ['MP4', 'FLV', 'Any'];
	createMySaver ();
      }
      else {
	saver = {'saverSocket': fbPlayerWindow, 'saverWidth': 760, 'warnMess': '!videos'};
	createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': fbPlayerWindow, 'saverWidth': 760, 'warnMess': '!content'};
      createMySaver ();
    }
  }

}

// =====YahooScreen===== //

else if (page.url.indexOf('screen.yahoo.com') != -1) {

  /* Get Player Window */
  var ysPlayerWindow = getMyElement ('', 'div', 'class', 'vp-wd', 0, false);
  if (!ysPlayerWindow) {
    showMyMessage ('!player');
  }
  else {
    /* Restyle Player Window */
    styleMyElement (ysPlayerWindow, {height: '100%'});

    /* Get Videos Content */
    var ysVideosContent;
    var ysVideoID = getMyContent (page.url, '"first_videoid":"(.*?)"', false);
    if (ysVideoID) ysVideosContent = getMyContent('https://video.media.yql.yahoo.com/v1/video/sapi/streams/' + ysVideoID + '?protocol=http&region=US', '"streams":\\[(.*?)\\]', false);

    /* Get Videos */
    if (ysVideosContent) {
      var ysVideoList = {};
      var ysVideoFormats = {'240': 'Very Low Definition', '360': 'Low Definition', '432': 'Low Definition', '540': 'Standard Definition', '720': 'High Definition', '1080': 'Full High Definition'};
      var ysVideoFound;
      var ysVideoParts = ysVideosContent.split('},');
      var ysVideoPart, ysVideoPath, ysVideoHost, ysVideoHeight, myVideoCode;
      for (var i = 0; i < ysVideoParts.length; i++) {
	ysVideoPart = ysVideoParts[i];
	ysVideoPath = ysVideoPart.match(/"path":"(.*?)"/);
	ysVideoPath = (ysVideoPath) ? ysVideoPath[1] : null;
	ysVideoHost = ysVideoPart.match(/"host":"(.*?)"/);
	ysVideoHost = (ysVideoHost) ? ysVideoHost[1] : null;
	ysVideoHeight = ysVideoPart.match(/"height":(\d+),/);
	ysVideoHeight = (ysVideoHeight) ? ysVideoHeight[1] : null;
	ysVideoType = ysVideoPart.match(/"mime_type":"(.*?)"/);
	ysVideoType = (ysVideoType) ? ysVideoType[1] : null;
	if (ysVideoPath && ysVideoHost && ysVideoHeight && ysVideoType) {
	  for (var ysVideoCode in ysVideoFormats) {
	    if (ysVideoCode == ysVideoHeight) {
	      if (!ysVideoFound) ysVideoFound = true;
	      myVideoCode = ysVideoFormats[ysVideoCode]
	      if (ysVideoType == 'video/mp4') myVideoCode += ' MP4';
	      else if (ysVideoType == 'video/webm') myVideoCode += ' WebM';
	      ysVideoList[myVideoCode] = ysVideoHost + ysVideoPath;
	    }
	  }
	}
      }

      if (ysVideoFound) {
	/* Create Saver */
	var ysDefaultVideo = 'Low Definition MP4';
	saver = {'saverSocket': ysPlayerWindow, 'videoList': ysVideoList, 'videoSave': ysDefaultVideo, 'saverWidth': 640};
	option['definitions'] = ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'];
	option['containers'] = ['MP4', 'WebM', 'Any'];
	createMySaver ();
	styleMyElement(saver['saverPanel'], {padding: '0px 0px 7px 0px'});
      }
      else {
	saver = {'saverSocket': ysPlayerWindow, 'saverWidth': 640, 'warnMess': '!videos'};
	createMySaver ();
      }
    }
    else {
      saver = {'saverSocket': ysPlayerWindow, 'saverWidth': 640, 'warnMess': '!content'};
      createMySaver ();
    }
  }

}

})();
