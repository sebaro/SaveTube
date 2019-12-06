// ==UserScript==
// @name		SaveTube+
// @version		2019.12.05
// @description		Download videos from web sites.
// @author		sebaro
// @namespace		http://sebaro.pro/savetube
// @downloadURL		https://gitlab.com/sebaro/savetube/raw/master/savetubeplus.user.js
// @updateURL		https://gitlab.com/sebaro/savetube/raw/master/savetubeplus.user.js
// @icon		https://gitlab.com/sebaro/savetube/raw/master/savetube.png
// @include		*
// @noframes
// @grant		none
// @run-at		document-end
// ==/UserScript==


/*

  Copyright (C) 2014 - 2019 Sebastian Luncan

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


// ==========Variables========== //

// Userscript
var userscript = 'SaveTube+';
var website = 'http://sebaro.pro/savetube';
var contact = 'http://sebaro.pro/contact';

// Saver
var panelHeight = 30;

// ==========Fixes========== //

// Don't run on frames or iframes
if (window.top && window.top != window.self)  return;


// ==========Functions========== //

function styleMyElement(obj, styles) {
  for (var stylekey in styles) {
    obj.style[stylekey] = styles[stylekey];
  }
}


// ==========Websites========== //

/* Page Source */
var xmlHTTP = new XMLHttpRequest();
xmlHTTP.open('GET', window.location.href, false);
xmlHTTP.send();
var source = xmlHTTP.responseText + document.getElementsByTagName('html')[0].innerHTML;
if (!source) return;

/* Video Patterns */
var patterns = [
  '=(http[^=\'"]*?\\.(mp4|flv|webm|m3u8).*?)&',
  'file\s*:\s*"(http[^")]*?\\.(mp4|flv|webm|m3u8).*?)"',
  'src="(http[^"]*?\\.(mp4|flv|webm|m3u8).*?)"',
  '"(http[^"]*?\\.(mp4|flv|webm|m3u8).*?)"',
  '\'(http[^\']*?\\.(mp4|flv|webm|m3u8).*?)\''
  ];

var exclude = '(thumb|\\.jpg|\\.png|\\.gif|\\.htm|format=|\\/\\/[^\\/]*?(mp4|flv|webm|m3u8)|(mp4|flv|webm|m3u8)[0-9a-zA-Z])';

/* Video Matcher */
var pattern, matches, matcher, video, type;
var links = [];
for (var i = 0; i < patterns.length; i++) {
  pattern = new RegExp(patterns[i], 'g');
  matches = source.match(pattern);
  if (matches) {
    for (var v = 0; v < matches.length; v++) {
      matcher = matches[v].match(patterns[i]);
      video = (matcher) ? matcher[1] : null;
      if (video) {
	if (video.indexOf('%') != -1) video = unescape(video);
	if (video.indexOf('\\u00') != -1) video = video.replace(/\\u002F/g, '/').replace(/\\u0026/g, '&');
	if (video.indexOf('&amp;') != -1) video = video.replace(/&amp;/g, '&');
	video = video.replace(/\\/g, '');
	if (video.indexOf('http') == 0 && !video.match(exclude)) {
	  if (links.indexOf(video) == -1) links.push(video);
	}
      }
    }
  }
}
if (links.length > 0) {
  var panel = document.createElement('div');
  styleMyElement(panel, {position: 'fixed', height: panelHeight + 'px', backgroundColor: '#FFFFFF', padding: '0px 10px 5px 10px', bottom: '0px', right: '25px', lineHeight: (panelHeight - 2) + 'px', zIndex: '2000000000', borderTop: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC', borderRight: '1px solid #CCCCCC', borderRadius: '5px 5px 0px 0px', boxSizing: 'content-box'});
  document.body.appendChild(panel);
  var logo = document.createElement('div');
  styleMyElement(logo, {display: 'inline-block', color: '#32d132', fontSize: '14px', fontWeight: 'bold', border: '1px solid #32d132', borderRadius: '3px', padding: '0px 4px', marginRight: '10px', lineHeight: 'normal', verticalAlign: 'middle'});
  panel.appendChild(logo);
  logo.innerHTML = userscript;
  var menu = document.createElement('select');
  styleMyElement(menu, {width: '270px', display: 'inline-block', fontSize: '14px', fontWeight: 'bold', padding: '0px 3px', overflow: 'hidden', border: '1px solid #CCCCCC', color: '#777777', backgroundColor: '#FFFFFF', lineHeight: 'normal', verticalAlign: 'middle', cursor: 'pointer'});
  var option;
  for (var i = 0; i < links.length; i++) {
    option = document.createElement('option');
    styleMyElement(option, {fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'});
    option.value = links[i];
    option.innerHTML = links[i].substr(0, 50) + '...';
    option.title = links[i];
    menu.appendChild(option);
  }
  panel.appendChild(menu);
  var linkb = document.createElement('div');
  styleMyElement(linkb, {display: 'inline-block', color: '#777777', fontSize: '14px', fontWeight: 'bold', padding: '0px 4px', verticalAlign: 'middle', marginLeft: '5px', cursor: 'pointer'});
  panel.appendChild(linkb);
  var link = document.createElement('a');
  styleMyElement(link, {color: '#777777', textDecoration: 'underline'});
  link.innerHTML = '[Link]';
  link.href = links[0];
  linkb.appendChild(link);
  menu.addEventListener('change', function() {
    link.href = this.value;
  }, false);
}

})();
