// ==UserScript==
// @name            SaveTube
// @version         2020.10.15
// @description     Download videos from video sharing web sites.
// @author          sebaro
// @namespace       http://sebaro.pro/savetube
// @downloadURL     https://gitlab.com/sebaro/savetube/raw/master/savetube.user.js
// @updateURL       https://gitlab.com/sebaro/savetube/raw/master/savetube.user.js
// @icon            https://gitlab.com/sebaro/savetube/raw/master/savetube.png
// @include         http://youtube.com*
// @include         http://www.youtube.com*
// @include         https://youtube.com*
// @include         https://www.youtube.com*
// @include         http://m.youtube.com*
// @include         https://m.youtube.com*
// @include         http://dailymotion.com*
// @include         http://www.dailymotion.com*
// @include         https://dailymotion.com*
// @include         https://www.dailymotion.com*
// @include         http://vimeo.com*
// @include         http://www.vimeo.com*
// @include         https://vimeo.com*
// @include         https://www.vimeo.com*
// @include         http://metacafe.com*
// @include         http://www.metacafe.com*
// @include         https://metacafe.com*
// @include         https://www.metacafe.com*
// @include         http://veoh.com*
// @include         http://www.veoh.com*
// @include         https://veoh.com*
// @include         https://www.veoh.com*
// @include         http://viki.com*
// @include         http://www.viki.com*
// @include         https://viki.com*
// @include         https://www.viki.com*
// @include         http://imdb.com*
// @include         http://www.imdb.com*
// @include         https://imdb.com*
// @include         https://www.imdb.com*
// @noframes
// @grant           none
// @run-at          document-end
// ==/UserScript==


/*

	Copyright (C) 2010 - 2020 Sebastian Luncan

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
var website = 'http://sebaro.pro/savetube';
var contact = 'http://sebaro.pro/contact';

// Page
var page = {win: window, doc: window.document, body: window.document.body, url: window.location.href, site: window.location.hostname.match(/([^.]+)\.[^.]+$/)[1]};

// Saver
var saver = {};
var panelHeight = 30;

// Features/Options
var feature = {'definition': true, 'container': true, 'openpagelink': true, 'autosave': true, 'savedash': false, 'showsavelink': true};
var option = {'definition': 'High Definition', 'container': 'MP4', 'openpagelink': false, 'autosave': false, 'savedash': false, 'showsavelink': false};

// Media
var mediatypes = {'MP4': 'video/mp4', 'WebM': 'video/webm', 'M3U8': 'application/x-mpegURL', 'WebVTT': 'text/vtt'};

// Sources
var sources = {};


// ==========Functions========== //

function createMyElement(type, properties, event, listener) {
	var obj = page.doc.createElement(type);
	for (var propertykey in properties) {
		if (propertykey == 'target') obj.setAttribute('target', properties[propertykey]);
		else obj[propertykey] = properties[propertykey];
	}
	if (event && listener) {
		obj.addEventListener(event, listener, false);
	}
	return obj;
}

function modifyMyElement(obj, properties, event, listener) {
	for (var propertykey in properties) {
		if (propertykey == 'target') obj.setAttribute('target', properties[propertykey]);
		else obj[propertykey] = properties[propertykey];
	}
	if (event && listener) {
		obj.addEventListener(event, listener, false);
	}
}

function styleMyElement(obj, styles) {
	for (var stylekey in styles) {
		obj.style[stylekey] = styles[stylekey];
	}
}

function cleanMyElement(obj, hide) {
	if (hide) {
		for (var i = 0; i < obj.children.length; i++) {
			styleMyElement(obj.children[i], {display: 'none'});
		}
	}
	else {
		if (obj.hasChildNodes()) {
			while (obj.childNodes.length >= 1) {
				obj.removeChild(obj.firstChild);
			}
		}
	}
}

function getMyElement(obj, type, from, value, child, content) {
	var getObj, chObj, coObj;
	var pObj = (!obj) ? page.doc : obj;
	if (type == 'body') getObj = pObj.body;
	else {
		if (from == 'id') getObj = pObj.getElementById(value);
		else if (from == 'class') getObj = pObj.getElementsByClassName(value);
		else if (from == 'tag') getObj = pObj.getElementsByTagName(type);
		else if (from == 'ns') {
			if (pObj.getElementsByTagNameNS) getObj = pObj.getElementsByTagNameNS(value, type);
		}
		else if (from == 'query') {
			if (child > 0) {
				if (pObj.querySelectorAll) getObj = pObj.querySelectorAll(value);
			}
			else {
				if (pObj.querySelector)	getObj = pObj.querySelector(value);
			}
		}
	}
	chObj = (getObj && child >= 0) ? getObj[child] : getObj;
	if (content && chObj) {
		if (type == 'html' || type == 'body' || type == 'div' || type == 'option') coObj = chObj.innerHTML;
		else if (type == 'object') coObj = chObj.data;
		else if (type == 'img' || type == 'video' || type == 'embed') coObj = chObj.src;
		else coObj = chObj.textContent;
		return coObj;
	}
	else {
		return chObj;
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

function cleanMyContent(content, unesc, extra) {
	if (unesc) content = unescape(content);
	content = content.replace(/\\u0025/g, '%');
	content = content.replace(/\\u0026/g, '&');
	content = content.replace(/\\u002F/g, '/');
	content = content.replace(/\\/g, '');
	content = content.replace(/\n/g, '');
	if (extra) {
		content = content.replace(/&quot;/g, '\'').replace(/&#34;/g, '\'').replace(/&#034;/g, '\'').replace(/"/g, '\'');
		content = content.replace(/&#39;/g, '\'').replace(/&#039;/g, '\'').replace(/'/g, '\'');
		content = content.replace(/&amp;/g, 'and').replace(/&/g, 'and');
		content = content.replace(/[\/\|]/g, '-');
		content = content.replace(/[#:\*\?]/g, '');
		content = content.replace(/^\s+|\s+$/, '').replace(/\.+$/g, '');
	}
	return content;
}

function getMyContent(url, pattern, clean) {
	var myPageContent, myVideosParse, myVideosContent;
	if (!sources[url]) {
		var XHRequest = new XMLHttpRequest();
		XHRequest.open('GET', url, false);
		XHRequest.send();
		sources[url] = (XHRequest.responseText) ? XHRequest.responseText : XHRequest.responseXML;
		//console.log('Request: ' + url + ' ' + pattern);
		//console.log(sources[url]);
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

function createMySaver() {
	/* The Panel */
	saver['saverPanel'] = createMyElement('div');
	styleMyElement(saver['saverPanel'], {position: 'fixed', fontFamily: 'sans-serif', fontSize: '10px', minHeight: panelHeight + 'px', lineHeight: panelHeight + 'px', backgroundColor: '#FFFFFF', padding: '0px 10px 5px 10px', bottom: '0px', right: '25px', zIndex: '2000000000', borderTop: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC', borderRight: '1px solid #CCCCCC', borderRadius: '5px 5px 0px 0px', textAlign: 'center', boxSizing: 'content-box'});
	appendMyElement(page.body, saver['saverPanel']);

	/* Panel Logo */
	saver['panelLogo'] = createMyElement('div', {title: '{SaveTube: click to visit the script wesite}', textContent: userscript}, 'click', function() {
		page.win.location.href = website;
	});
	styleMyElement(saver['panelLogo'], {display: 'inline-block', color: '#32D132', fontSize: '14px', fontWeight: 'bold', border: '1px solid #32D132', borderRadius: '3px', padding: '0px 4px', marginRight: '10px', lineHeight: 'normal', verticalAlign: 'middle', cursor: 'pointer', boxSizing: 'content-box'});
	appendMyElement(saver['saverPanel'], saver['panelLogo']);

	/* Warnings */
	if (saver['warnMess']) {
		saver['saverMessage'] = createMyElement('div');
		styleMyElement(saver['saverMessage'], {display: 'inline-block', fontSize: '12px', color: '#AD0000'});
		appendMyElement(saver['saverPanel'], saver['saverMessage']);
		if (saver['warnContent']) showMyMessage(saver['warnMess'], saver['warnContent']);
		else showMyMessage(saver['warnMess']);
		return;
	}

	/* Panel Video Menu */
	saver['videoMenu'] = createMyElement('select', {title: '{Videos: select the video format for download}'}, 'change', function() {
		saver['videoSave'] = this.value;
		if (saver['isShowingLink']) {
			cleanMyElement(saver['buttonSaveLink'], false);
			saver['isShowingLink'] = false;
		}
		if (option['autosave']) {
			saveMyVideo();
		}
	});
	styleMyElement(saver['videoMenu'], {display: 'inline-block', width: 'auto', height: '20px', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold', padding: '0px 3px', overflow: 'hidden', border: '1px solid #CCCCCC', color: '#777777', backgroundColor: '#FFFFFF', lineHeight: 'normal', verticalAlign: 'middle', cursor: 'pointer', boxSizing: 'content-box'});
	appendMyElement(saver['saverPanel'], saver['videoMenu']);
	if (feature['openpagelink']) {
		saver['videoList']['Page Link'] = page.url;
	}
	var videosProgressive = [];
	var videosAdaptiveHLS = [];
	var videosAdaptiveDASHVideo = [];
	var videosAdaptiveDASHAudio = [];
	var videosAdaptiveDASHMuxed = [];
	var videosExtra = [];
	for (var videoCode in saver['videoList']) {
		if (videoCode.indexOf('Video') != -1) videosAdaptiveDASHVideo.push(videoCode);
		else if (videoCode.indexOf('Audio') != -1) videosAdaptiveDASHAudio.push(videoCode);
		else if (saver['videoList'][videoCode] == 'DASH') videosAdaptiveDASHMuxed.push(videoCode);
		else if (videoCode.indexOf('M3U8') != -1) videosAdaptiveHLS.push(videoCode);
		else if (videoCode.indexOf('MP4') != -1 || videoCode.indexOf('WebM') != -1) videosProgressive.push(videoCode);
		else videosExtra.push(videoCode);
	}
	if (videosProgressive.length > 0) {
		for (var i = 0; i < videosProgressive.length; i++) {
			saver['videoItem'] = createMyElement('option', {value: videosProgressive[i], textContent: videosProgressive[i]});
			styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(saver['videoMenu'], saver['videoItem']);
		}
	}
	if (videosAdaptiveHLS.length > 0) {
		saver['videoItem'] = createMyElement('option', {value: 'HLS', textContent: 'HLS'});
		styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', color: '#FF0000'});
		saver['videoItem'].disabled = 'disabled';
		appendMyElement(saver['videoMenu'], saver['videoItem']);
		for (var i = 0; i < videosAdaptiveHLS.length; i++) {
			saver['videoItem'] = createMyElement('option', {value: videosAdaptiveHLS[i], textContent: videosAdaptiveHLS[i]});
			styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(saver['videoMenu'], saver['videoItem']);
		}
	}
	if (videosAdaptiveDASHVideo.length > 0) {
		saver['videoItem'] = createMyElement('option', {value: 'DASH (Video Only)', textContent: 'DASH (Video Only)'});
		styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', color: '#FF0000'});
		saver['videoItem'].disabled = 'disabled';
		appendMyElement(saver['videoMenu'], saver['videoItem']);
		for (var i = 0; i < videosAdaptiveDASHVideo.length; i++) {
			saver['videoItem'] = createMyElement('option', {value: videosAdaptiveDASHVideo[i], textContent: videosAdaptiveDASHVideo[i]});
			styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(saver['videoMenu'], saver['videoItem']);
		}
	}
	if (videosAdaptiveDASHAudio.length > 0) {
		saver['videoItem'] = createMyElement('option', {value: 'DASH (Audio Only)', textContent: 'DASH (Audio Only)'});
		styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', color: '#FF0000'});
		saver['videoItem'].disabled = 'disabled';
		appendMyElement(saver['videoMenu'], saver['videoItem']);
		for (var i = 0; i < videosAdaptiveDASHAudio.length; i++) {
			saver['videoItem'] = createMyElement('option', {value: videosAdaptiveDASHAudio[i], textContent: videosAdaptiveDASHAudio[i]});
			styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(saver['videoMenu'], saver['videoItem']);
		}
	}
	if (videosAdaptiveDASHMuxed.length > 0) {
		feature['savedash'] = true;
		if (option['savedash']) {
			saver['videoItem'] = createMyElement('option', {value: 'DASH (Video With Audio)', textContent: 'DASH (Video With Audio)'});
			styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', color: '#FF0000'});
			saver['videoItem'].disabled = 'disabled';
			appendMyElement(saver['videoMenu'], saver['videoItem']);
			for (var i = 0; i < videosAdaptiveDASHMuxed.length; i++) {
				saver['videoItem'] = createMyElement('option', {value: videosAdaptiveDASHMuxed[i], textContent: videosAdaptiveDASHMuxed[i]});
				styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
				appendMyElement(saver['videoMenu'], saver['videoItem']);
			}
		}
		else {
			for (var videoCode in saver['videoList']) {
				if (saver['videoList'][videoCode] == 'DASH') delete saver['videoList'][videoCode];
			}
		}
	}
	if (videosExtra.length > 0) {
		saver['videoItem'] = createMyElement('option', {value: 'Extra', textContent: 'Extra'});
		styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', color: '#FF0000'});
		saver['videoItem'].disabled = 'disabled';
		appendMyElement(saver['videoMenu'], saver['videoItem']);
		for (var i = 0; i < videosExtra.length; i++) {
			saver['videoItem'] = createMyElement('option', {value: videosExtra[i], textContent: videosExtra[i]});
			styleMyElement(saver['videoItem'], {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(saver['videoMenu'], saver['videoItem']);
		}
	}

	/* Panel Options Button */
	saver['buttonOptions'] = createMyElement('div', {title: '{Options: click to show the available options}'}, 'click', function() {
		if (saver['showsOptions']) {
			saver['showsOptions'] = false;
			styleMyElement(saver['optionsContent'], {display: 'none'})
		}
		else {
			saver['showsOptions'] = true;
			styleMyElement(saver['optionsContent'], {display: 'block'})
		}
	});
	styleMyElement(saver['buttonOptions'], {width: '1px', height: '14px', display: 'inline-block', paddingTop: '3px', borderLeft: '3px dotted #777777', lineHeight: 'normal', verticalAlign: 'middle', marginLeft: '20px', cursor: 'pointer', boxSizing: 'content-box'});
	appendMyElement(saver['saverPanel'], saver['buttonOptions']);

	/* Panel Save Button */
	saver['buttonSave'] = createMyElement('div', {title: '{Save: click to download the selected video format}'}, 'click', function() {
		saveMyVideo();
	});
	styleMyElement(saver['buttonSave'], {width: '0px', height: '0px', display: 'inline-block', borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '15px solid #777777', borderBottom: '0px solid #777777', lineHeight: 'normal', verticalAlign: 'middle', marginTop: '2px', marginLeft: '20px', cursor: 'pointer', boxSizing: 'content-box'});
	appendMyElement(saver['saverPanel'], saver['buttonSave']);

	/* Panel Save Button Link */
	saver['buttonSaveLink'] = createMyElement('div', {title: '{Save: right click & save as to download the selected video format}'});
	styleMyElement(saver['buttonSaveLink'], {display: 'inline-block', color: '#777777', fontSize: '14px', fontWeight: 'bold', lineHeight: 'normal', verticalAlign: 'middle', marginLeft: '5px', marginBottom: '2px', boxSizing: 'content-box'});
	appendMyElement(saver['saverPanel'], saver['buttonSaveLink']);

	/* Disable Features */
	if (saver['videoDefinitions'].length < 2) feature['definition'] = false;
	if (saver['videoContainers'].length < 2) feature['container'] = false;

	/* Select The Video */
	if (feature['definition'] || feature['container'] || feature['openpagelink']) {
		if (!option['definition'] || saver['videoDefinitions'].indexOf(option['definition']) == -1) option['definition'] = saver['videoSave'].replace(/Definition.*/, 'Definition');
		if (!option['container'] || saver['videoContainers'].indexOf(option['container']) == -1) option['container'] = saver['videoSave'].replace(/.*\s/, '');
		selectMyVideo();
	}

	/* Save The Video On Autosave */
	if (option['autosave']) saveMyVideo();

	/* Panel Options */
	saver['optionsContent'] = createMyElement('div');
	styleMyElement(saver['optionsContent'], {display: 'none', fontSize: '14px', fontWeight: 'bold', padding: '10px', textAlign: 'center', boxSizing: 'content-box'});
	appendMyElement(saver['saverPanel'], saver['optionsContent']);

	/* Options Object => option: [label, options, new line, change video] */
	var options = {
		'definition': ['Definition', saver['videoDefinitions'], true, true],
		'container': ['Container', saver['videoContainers'], false, true],
		'openpagelink': ['Open Page Link', ['On', 'Off'], true, true],
		'autosave': ['Autosave', ['On', 'Off'], true, true],
		'showsavelink': ['Show Save Link', ['On', 'Off'], false, true],
		'savedash': ['Save DASH (Video With Audio)', ['On', 'Off'], true, false]
	};

	/* Options */
	var optionsBox, optionBox, optionLabel, optionMenu, optionMenuItem;
	for (var o in options) {
		if (feature[o] === false) continue;
		if (options[o][2]) {
			optionsBox = createMyElement('div');
			styleMyElement(optionsBox, {display: 'block', padding: '5px 0px 5px 0px'});
			appendMyElement(saver['optionsContent'], optionsBox);
		}
		optionBox = createMyElement('div');
		styleMyElement(optionBox, {display: 'inline-block'});
		optionLabel = createMyElement('div', {textContent: options[o][0]});
		styleMyElement(optionLabel, {display: 'inline-block', color: '#777777', marginRight: '10px', verticalAlign: 'middle'});
		optionMenu = createMyElement('select', {id: 'savetube-option-' + o}, 'change', function() {
			var id = this.id.replace('savetube-option-', '');
			if (this.value == 'On' || this.value == 'Off') {
				option[id] = (this.value == 'On') ? true : false;
			}
			else {
				option[id] = this.value;
			}
			setMyOptions(id, option[id]);
			if (options[id][3]) {
				if (saver['isShowingLink']) {
					cleanMyElement(saver['buttonSaveLink'], false);
					saver['isShowingLink'] = false;
				}
				selectMyVideo();
				if (option['autosave']) {
					saveMyVideo();
				}
			}
		});
		styleMyElement(optionMenu, {display: 'inline-block', width: 'auto', height: '20px', color: '#777777', backgroundColor: '#FFFFFF', border: '1px solid #CCCCCC', fontFamily: 'inherit', fontSize: '14px', fontWeight: 'bold', marginRight: '10px', verticalAlign: 'middle'});
		appendMyElement(optionBox, optionLabel);
		appendMyElement(optionBox, optionMenu);
		appendMyElement(optionsBox, optionBox);
		for (var i = 0; i < options[o][1].length; i++) {
			optionMenuItem = createMyElement('option', {value: options[o][1][i], textContent: options[o][1][i]});
			styleMyElement(optionMenuItem, {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
			appendMyElement(optionMenu, optionMenuItem);
		}
		if (optionMenu.value == 'On' || optionMenu.value == 'Off') {
			if (option[o]) optionMenu.value = 'On';
			else optionMenu.value = 'Off';
		}
		else {
			optionMenu.value = option[o];
		}
	}
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
	var boolOptions = ['openpagelink', 'autosave', 'showsavelink', 'savedash'];
	for (var i = 0; i < boolOptions.length; i++) {
		option[boolOptions[i]] = (option[boolOptions[i]] === true || option[boolOptions[i]] == 'true') ? true : false;
	}
}

function selectMyVideo() {
	if (option['openpagelink']) {
		saver['videoSave'] = 'Page Link';
	}
	else {
		var vdoCont = (option['container'] != 'Any') ? [option['container']] : saver['videoContainers'];
		var vdoDef = saver['videoDefinitions'];
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
			if (vdoDef[vD] == option['definition'] && keepDef == false) keepDef = true;
			if (keepDef == true) vdoDef2.push(vdoDef[vD])
		}
		for (var vD = 0; vD < vdoDef2.length; vD++) {
			if (vdoList[vdoDef2[vD]]) {
				saver['videoSave'] = vdoList[vdoDef2[vD]];
				break;
			}
		}
	}
	saver['videoMenu'].value = saver['videoSave'];
}

function saveMyVideo() {
	var vdoURL = saver['videoList'][saver['videoSave']];
	var vdoDef = ' (' + saver['videoSave'].split(' ').slice(0, -1).join('').match(/[A-Z]/g).join('') + ')';
	var vdoExt = saver['videoSave'].split(' ').slice(-1).join('');
	var vdoTle = (saver['videoTitle']) ? saver['videoTitle'] : page.url.replace(/https?:\/\//, '').replace(/[^0-9a-zA-Z]/g, '-');
	if (saver['videoSave'] == 'Page Link' || vdoURL == 'DASH' || (vdoExt == 'M3U8' && !option['showsavelink'])) {
		var vdoV, vdoA;
		if (saver['videoSave'] == 'Page Link' || vdoExt == 'M3U8') {
			vdoV = vdoURL;
			vdoA = '';
			vdoDef = '';
		}
		else {
			if (saver['videoSave'].indexOf('MP4') != -1) {
				vdoV = saver['videoList'][saver['videoSave'].replace('MP4', 'Video MP4')];
				vdoA = saver['videoList']['Medium Bitrate Audio MP4'] || saver['videoList'][saver['videoSave'].replace('MP4', 'Audio MP4')];
			}
			else {
				vdoV = saver['videoList'][saver['videoSave'].replace('WebM', 'Video WebM')];
				vdoA = saver['videoList']['High Bitrate Audio WebM'] || saver['videoList']['Medium Bitrate Audio WebM'] || saver['videoList']['Medium Bitrate Audio MP4'];
			}
		}
		var vdoT = vdoTle + vdoDef;
		page.win.location.href = 'savetube:' + vdoT + 'SEPARATOR' + vdoV + 'SEPARATOR' + vdoA;
	}
	else {
		var vdoLnk = createMyElement('a', {href: vdoURL, target: '_blank', textContent: '[Link]'});
		styleMyElement(vdoLnk, {color: '#777777', textDecoration: 'underline'});
		var vdoT = vdoTle + vdoDef;
		if (option['showsavelink'] || vdoExt == 'M3U8') {
			appendMyElement(saver['buttonSaveLink'], vdoLnk);
			saver['isShowingLink'] = true;
			if (page.site == 'youtube' && saver['videoSave'] == 'High Definition MP4') {
				if (!page.win.URL || !page.win.URL.createObjectURL) {
					page.win.location.href = vdoURL + '&title=' + vdoT;
				}
			}
		}
		else {
			if (!saver['isSaving']) {
				if (page.site == 'youtube' && saver['videoSave'] == 'High Definition MP4') {
					page.win.location.href = vdoURL + '&title=' + vdoT;
				}
				else {
					if (page.win.URL && page.win.URL.createObjectURL) {
						saver['isSaving'] = true;
						styleMyElement(saver['buttonSave'], {borderBottomWidth: '1px', cursor: 'none'});
						var vdoLnkBlob, vdoBlob, vdoBlobLnk;
						vdoLnkBlob = createMyElement('a');
						styleMyElement(vdoLnkBlob, {display: 'none'});
						appendMyElement(page.body, vdoLnkBlob);
						var XHRequest = new XMLHttpRequest();
						XHRequest.open('GET', vdoURL);
						XHRequest.responseType = 'arraybuffer';
						XHRequest.onload = function() {
							if (this.status === 200 && this.response) {
								vdoBlob = new Blob([this.response], {type: mediatypes[vdoExt]});
								vdoBlobLnk = page.win.URL.createObjectURL(vdoBlob);
								modifyMyElement(vdoLnkBlob, {href: vdoBlobLnk, target: '_blank', download: vdoT + '.' + vdoExt.toLowerCase()});
								vdoLnkBlob.click();
								page.win.URL.revokeObjectURL(vdoBlobLnk);
								removeMyElement(page.body, vdoLnkBlob);
								saver['isSaving'] = false;
								styleMyElement(saver['buttonSave'], {borderBottomWidth: '0px', cursor: 'pointer'});
							}
							else {
								saver['isSaving'] = false;
								styleMyElement(saver['buttonSave'], {borderBottomWidth: '0px', cursor: 'pointer'});
								if (!saver['isShowingLink']) {
									appendMyElement(saver['buttonSaveLink'], vdoLnk);
									saver['isShowingLink'] = true;
								}
							}
						}
						XHRequest.onerror = function() {
							saver['isSaving'] = false;
							styleMyElement(saver['buttonSave'], {borderBottomWidth: '0px', cursor: 'pointer'});
							if (!saver['isShowingLink']) {
								appendMyElement(saver['buttonSaveLink'], vdoLnk);
								saver['isShowingLink'] = true;
							}
						}
						XHRequest.send();
					}
					else {
						appendMyElement(saver['buttonSaveLink'], vdoLnk);
						saver['isShowingLink'] = true;
					}
				}
			}
		}
	}
}

function showMyMessage(cause, content) {
	if (cause == '!content') {
		modifyMyElement(saver['saverMessage'], {innerHTML: 'Couldn\'t get the videos content. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.'});
	}
	else if (cause == '!videos') {
		modifyMyElement(saver['saverMessage'], {innerHTML: 'Couldn\'t get any video. Please report it <a href="' + contact + '" style="color:#00892C">here</a>.'});
	}
	else if (cause == '!support') {
		modifyMyElement(saver['saverMessage'], {innerHTML: 'This video uses the RTMP protocol which is not supported.'});
	}
	else if (cause == 'embed') {
		modifyMyElement(saver['saverMessage'], {innerHTML: 'This is an embedded video. You can get it <a href="' + content + '" style="color:#00892C">here</a>.'});
	}
	else if (cause == 'other') {
		modifyMyElement(saver['saverMessage'], {innerHTML: content});
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
			if (!ytSignFuncName) ytSignFuncName = ytScriptSrc.match(/c&&\([a-zA-Z0-9$]+=([a-zA-Z0-9$]+)\(decodeURIComponent/);
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
		var ytVideoTitle = getMyContent(page.url, '"videoDetails".*?"title":"((\\\\"|[^"])*?)"', false);
		if (!ytVideoTitle) ytVideoTitle = getMyContent(page.url, '"title":\\{"runs":\\[\\{"text":"((\\\\"|[^"])*?)"', false);
		if (!ytVideoTitle) ytVideoTitle = getMyContent(page.url, 'meta\\s+property="og:title"\\s+content="(.*?)"', false);
		if (!ytVideoTitle) ytVideoTitle = getMyContent(page.url, 'meta\\s+itemprop="name"\\s+content="(.*?)"', false);
		if (ytVideoTitle) {
			var ytVideoAuthor = getMyContent(page.url, '"(?:author|name)":\\s*"((\\\\"|[^"])*?)"', false);
			if (ytVideoAuthor) ytVideoTitle = ytVideoTitle + ' by ' + ytVideoAuthor;
			ytVideoTitle = cleanMyContent(ytVideoTitle, false, true);
		}

		/* Get Videos Content */
		var ytVideosEncodedFmts, ytVideosEncodedFmtsNew, ytVideosAdaptiveFmts, ytVideosAdaptiveFmtsNew, ytVideosContent, ytHLSVideos, ytHLSContent;
		ytVideosEncodedFmts = getMyContent(page.url, '"url_encoded_fmt_stream_map\\\\?":\\s*\\\\?"(.*?)\\\\?"', false);
		if (!ytVideosEncodedFmts) {
			ytVideosEncodedFmtsNew = getMyContent(page.url, '"formats\\\\?":\\s*(\\[.*?\\])', false);
			if (ytVideosEncodedFmtsNew) {
				ytVideosEncodedFmts = '';
				ytVideosEncodedFmtsNew = cleanMyContent(ytVideosEncodedFmtsNew, false);
				ytVideosEncodedFmtsNew = ytVideosEncodedFmtsNew.match(new RegExp('"(url|cipher|signatureCipher)":\s*".*?"', 'g'));
				if (ytVideosEncodedFmtsNew) {
					for (var i = 0 ; i < ytVideosEncodedFmtsNew.length; i++) {
						ytVideosEncodedFmts += ytVideosEncodedFmtsNew[i].replace(/"/g, '').replace('url:', 'url=').replace('cipher:', '').replace('signatureCipher:', '') + ',';
					}
					if (ytVideosEncodedFmts.indexOf('itag%3D') != -1) {
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
				ytVideosAdaptiveFmtsNew = ytVideosAdaptiveFmtsNew.match(new RegExp('"(url|cipher|signatureCipher)":\s*".*?"', 'g'));
				if (ytVideosAdaptiveFmtsNew) {
					for (var i = 0 ; i < ytVideosAdaptiveFmtsNew.length; i++) {
						ytVideosAdaptiveFmts += ytVideosAdaptiveFmtsNew[i].replace(/"/g, '').replace('url:', 'url=').replace('cipher:', '').replace('signatureCipher:', '') + ',';
					}
					if (ytVideosAdaptiveFmts.indexOf('itag%3D') != -1) {
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
							ytVideosEncodedFmtsNew = ytVideosEncodedFmtsNew.match(new RegExp('"(url|cipher|signatureCipher)":\s*".*?"', 'g'));
							if (ytVideosEncodedFmtsNew) {
								for (var i = 0 ; i < ytVideosEncodedFmtsNew.length; i++) {
									ytVideosEncodedFmts += ytVideosEncodedFmtsNew[i].replace(/"/g, '').replace('url:', 'url=').replace('cipher:', '').replace('signatureCipher:', '') + ',';
								}
								if (ytVideosEncodedFmts.indexOf('itag%3D') != -1) {
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
								ytVideosAdaptiveFmtsNew = ytVideosAdaptiveFmtsNew.match(new RegExp('"(url|cipher|signatureCipher)":\s*".*?"', 'g'));
								if (ytVideosAdaptiveFmtsNew) {
									for (var i = 0 ; i < ytVideosAdaptiveFmtsNew.length; i++) {
										ytVideosAdaptiveFmts += ytVideosAdaptiveFmtsNew[i].replace(/"/g, '').replace('url:', 'url=').replace('cipher:', '').replace('signatureCipher:', '') + ',';
									}
									if (ytVideosAdaptiveFmts.indexOf('itag%3D') != -1) {
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
			saver = {
				'videoList': ytVideoList,
				'videoDefinitions': ['Ultra High Definition', 'Quad High Definition', 'Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'],
				'videoContainers': ['MP4', 'WebM', 'M3U8', 'Any'],
				'videoSave': ytDefaultVideo,
				'videoTitle': ytVideoTitle
			};
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
				/* Save DASH */
				if (ytVideoList['Medium Bitrate Audio MP4'] || ytVideoList['Medium Bitrate Audio WebM']) {
					for (var myVideoCode in ytVideoList) {
						if (myVideoCode.indexOf('Video') != -1) {
							if (!ytVideoList[myVideoCode.replace(' Video', '')]) {
								ytVideoList[myVideoCode.replace(' Video', '')] = 'DASH';
							}
						}
					}
				}
				/* Create Saver */
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
				'92': 'Very Low Definition M3U8',
				'93': 'Low Definition M3U8',
				'94': 'Standard Definition M3U8',
				'95': 'High Definition M3U8',
				'96': 'Full High Definition M3U8'
			};
			ytVideoList["Multi Definition M3U8"] = ytHLSVideos;
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
			ytDefaultVideo = 'Multi Definition M3U8';
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
		var dmVideoTitle = getMyContent(page.url.replace(/\/video\//, "/embed/video/"), '"title":"((\\\\"|[^"])*?)"', false);
		if (dmVideoTitle) {
			var dmVideoAuthor = getMyContent(page.url.replace(/\/video\//, "/embed/video/"), '"screenname":"((\\\\"|[^"])*?)"', false);
			if (dmVideoAuthor) dmVideoTitle = dmVideoTitle + ' by ' + dmVideoAuthor;
			dmVideoTitle = cleanMyContent(dmVideoTitle, false, true);
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
				dmVideo = (dmVideoParse) ? dmVideoParse[1] : null;
				if (dmVideo) {
					if (!dmVideoFound) dmVideoFound = true;
					dmVideo = cleanMyContent(dmVideo, true);
					myVideoCode = dmVideoFormats[dmVideoCode];
					if (!dmVideoList[myVideoCode]) dmVideoList[myVideoCode] = dmVideo;
				}
			}
			if (!dmVideoFound) {
				dmVideoParser = '"' + dmVideoCode + '".*?"type":"application.*?mpegURL","url":"(.*?)"';
				dmVideoParse = dmVideosContent.match(dmVideoParser);
				if (dmVideoParse) {
					dmVideo = (dmVideoParse) ? dmVideoParse[1] : null;
					if (!dmVideoFound) dmVideoFound = true;
					dmVideo = cleanMyContent(dmVideo, true);
					dmVideoList["Multi Definition M3U8"] = dmVideo;
					var dmManifestSource = getMyContent(dmVideo, 'TEXT', false);
					if (dmManifestSource) {
						dmManifestSource = cleanMyContent(dmManifestSource, false);
						for (var dmVideoCode in dmVideoFormats) {
							dmVideoParser = 'RESOLUTION=\\d*x\\d*?,NAME="' + dmVideoCode + '",PROGRESSIVE-URI="(.*?)"([^"]*)(#|$)';
							dmVideoParse = dmManifestSource.match(dmVideoParser);
							dmVideo = (dmVideoParse) ? dmVideoParse[1] : null;
							if (dmVideo) {
								myVideoCode = dmVideoFormats[dmVideoCode];
								if (!dmVideoList[myVideoCode]) dmVideoList[myVideoCode] = dmVideo;
							}
							dmVideo = (dmVideoParse) ? dmVideoParse[2] : null;
							if (dmVideo) {
								myVideoCode = dmVideoFormats[dmVideoCode].replace('MP4', 'M3U8');
								if (!dmVideoList[myVideoCode]) dmVideoList[myVideoCode] = dmVideo;
							}
						}
					}
				}
			}

			if (dmVideoFound) {
				/* Create Saver */
				var dmDefaultVideo = 'Low Definition MP4';
				if (!dmVideoList[dmDefaultVideo]) dmDefaultVideo = 'Low Definition M3U8';
				saver = {
					'videoList': dmVideoList,
					'videoDefinitions': ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'],
					'videoContainers': ['MP4'],
					'videoSave': dmDefaultVideo,
					'videoTitle': dmVideoTitle
				};
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
			viVideoTitle = getMyContent(page.url, '"title":"((\\\\"|[^"])*?)"', false);
		}
		if (viVideoTitle) {
			viVideoTitle = viVideoTitle.replace(/\s*on\s*Vimeo$/, '');
			var viVideoAuthor = getMyContent(page.url, '"display_name":"((\\\\"|[^"])*?)"', false);
			if (viVideoAuthor) viVideoTitle = viVideoTitle + ' by ' + viVideoAuthor;
			viVideoTitle = cleanMyContent(viVideoTitle, false, true);
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
				saver = {
					'videoList': viVideoList,
					'videoDefinitions': ['Quad High Definition', 'Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'],
					'videoContainers': ['MP4'],
					'videoSave': viDefaultVideo,
					'videoTitle': viVideoTitle
				};
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

		/* Get Video Title */
		var mcVideoTitle = getMyContent(page.url, 'meta\\s+property="og:title"\\s+content="(.*?)"', false);
		if (mcVideoTitle) mcVideoTitle = cleanMyContent(mcVideoTitle, false, true);

		/* Get Videos Content */
		var mcVideosContent = getMyContent(page.url, 'flashvars\\s*=\\s*\\{(.*?)\\};', false);

		/* Get Videos */
		if (mcVideosContent) {
			var mcVideoList = {};
			var mcVideoFound = false;
			var mcVideoFormats = {'video_alt_url2': 'High Definition M3U8', 'video_alt_url': 'Low Definition M3U8', 'video_url': 'Very Low Definition M3U8'};
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
				var mcDefaultVideo = 'Low Definition M3U8';
				saver = {
					'videoList': mcVideoList,
					'videoDefinitions': ['High Definition', 'Low Definition', 'Very Low Definition'],
					'videoContainers': ['M3U8'],
					'videoSave': mcDefaultVideo,
					'videoTitle': mcVideoTitle
				};
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
		if (!veVideoTitle) {
			veVideoTitle = getMyContent(page.url.replace(/\/watch\//, '/watch/getVideo/'), '"title":"((\\\\"|[^"])*?)"', false);
		}
		if (veVideoTitle) veVideoTitle = cleanMyContent(veVideoTitle, false, true);

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
				saver = {
					'videoList': veVideoList,
					'videoDefinitions': ['Standard Definition', 'Low Definition'],
					'videoContainers': ['MP4'],
					'videoSave': veDefaultVideo,
					'videoTitle': veVideoTitle
				};
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
		if (vkVideoTitle) vkVideoTitle = cleanMyContent(vkVideoTitle, false, true);

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
					if (SHA1FuncBody.indexOf('SHA-1') == -1) throw false;
				}
				else throw false;
			}
			catch(e) {
				SHA1FuncBody = getMyContent('https://raw.githack.com/Caligatio/jsSHA/master/dist/sha1.js', 'TEXT', false);
				localStorage.setItem(SHA1Key, SHA1FuncBody);
			}
			var SHA1Func = new Function('a', SHA1FuncBody);
			var SHA1 = new SHA1Func();
			var shaObj = (SHA1.jsSHA) ? new SHA1.jsSHA("SHA-1", "TEXT") : new jsSHA("SHA-1", "TEXT");
			var vkTimestamp = parseInt(Date.now() / 1000);
			var vkQuery = "/v5/videos/" + vkVideoID + "/streams.json?app=100005a&t=" + vkTimestamp + "&site=www.viki.com"
			var vkToken = "MM_d*yP@`&1@]@!AVrXf_o-HVEnoTnm$O-ti4[G~$JDI/Dc-&piU&z&5.;:}95\=Iad";
			shaObj.setHMACKey(vkToken, "TEXT");
			shaObj.update(vkQuery);
			var vkSig = shaObj.getHMAC("HEX");
			var vkSource = "https://api.viki.io" + vkQuery + "&sig=" + vkSig;
			vkVideosContent = getMyContent(vkSource, 'TEXT', false);
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
				vkVideoEncHLS = vkVideosContent.match(/x-mpegURL".*?stream=(.*?)"/);
				vkVideoEncHLS = (vkVideoEncHLS) ? vkVideoEncHLS[1] : null;
				vkVideoEncDASH = vkVideosContent.match(/dash\+xml".*?stream=(.*?)"/);
				vkVideoEncDASH = (vkVideoEncDASH) ? vkVideoEncDASH[1] : null;
				if (vkVideoEncHLS || vkVideoEncDASH) {
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
						var AESFuncKey = 'aesjs';
						try {
							if (localStorage.getItem(AESFuncKey)) {
								AESFuncBody = localStorage.getItem(AESFuncKey);
							}
							else throw false;
						}
						catch(e) {
							AESFuncBody = getMyContent('https://raw.githack.com/ricmoo/aes-js/master/index.js', 'TEXT', false);
							localStorage.setItem(AESFuncKey, AESFuncBody);
						}
						var AESFunc = new Function('a', AESFuncBody);
						var AES = new AESFunc();
						var AESKey = AES.aesjs.utils.utf8.toBytes(vkVideoEncKey);
						var AESIV = AES.aesjs.utils.utf8.toBytes(vkVideoEncIV);
						var encryptedBytes, decryptedBytes;
						// HLS
						if (vkVideoEncHLS) {
							encryptedBytes = AES.aesjs.utils.hex.toBytes(vkVideoEncHLS);
							AESCBC = new AES.aesjs.ModeOfOperation.cbc(AESKey, AESIV);
							decryptedBytes = AESCBC.decrypt(encryptedBytes);
							var vkHLSManifest = AES.aesjs.utils.utf8.fromBytes(decryptedBytes);
							if (vkHLSManifest) {
								if (!vkVideoFound) vkVideoFound = true;
								vkVideoList['Multi Definition M3U8'] = vkHLSManifest;
							}
						}
						// DASH
						if (vkVideoEncDASH) {
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
				}
				// Subtitles
				var vkSubtitles = vkVideosContent.match(/"srclang":"en".*?"src":"(.*?)"/);
				vkSubtitles = (vkSubtitles) ? vkSubtitles[1] : null;
				if (vkSubtitles) vkVideoList['EN Subtitles WebVTT'] = vkSubtitles;
			}

			/* Create Saver */
			if (vkVideoFound) {
				var vkDefaultVideo = 'Low Definition MP4';
				saver = {
					'videoList': vkVideoList,
					'videoDefinitions': ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'],
					'videoContainers': ['MP4', 'M3U8', 'Any'],
					'videoSave': vkDefaultVideo,
					'videoTitle': vkVideoTitle
				};
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
		if (imdbVideoTitle) imdbVideoTitle = cleanMyContent(imdbVideoTitle, false, true);

		/* Get Data Key */
		var imdbVideoId = page.url.replace(/^.*?\/(vi\d+).*/, '$1');
		var imdbDataJSON = '{"type": "VIDEO_PLAYER", "subType": "FORCE_LEGACY", "id": "' + imdbVideoId + '"}';
		var imdbDataKey = btoa(imdbDataJSON);

		/* Get Videos Content */
		var imdbVideosContent = getMyContent(page.url.replace(/video\/.*/, 've/data/VIDEO_PLAYBACK_DATA?key=' + imdbDataKey), '"videoLegacyEncodings":\\[(.*?)\\]', false);

		/* Get Videos */
		var imdbVideoList = {};
		if (imdbVideosContent) {
			var imdbVideoFormats = {'1080p': 'Full High Definition MP4', '720p': 'High Definition MP4', '480p': 'Standard Definition MP4',
															'360p': 'Low Definition MP4', 'SD': 'Low Definition MP4', '240p': 'Very Low Definition MP4', 'AUTO': 'Multi Definition M3U8'};
			var imdbVideoFound = false;
			var imdbVideoParser, imdbVideoParse, myVideoCode, imdbVideo;
			for (var imdbVideoCode in imdbVideoFormats) {
				imdbVideoParser = '"definition":"' + imdbVideoCode + '".*?"url":"(.*?)"';
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
				saver = {
					'videoList': imdbVideoList,
					'videoDefinitions': ['Full High Definition', 'High Definition', 'Standard Definition', 'Low Definition', 'Very Low Definition'],
					'videoContainers': ['MP4', 'M3U8', 'Any'],
					'videoSave': imdbDefaultVideo,
					'videoTitle': imdbVideoTitle
				};
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

}


// ==========Run========== //

getMyOptions();
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
