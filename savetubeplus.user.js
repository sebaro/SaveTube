// ==UserScript==
// @name		SaveTube+
// @version		2014.12.05
// @description		Download videos from web sites.
// @author		sebaro
// @namespace		http://isebaro.com/savetube
// @downloadURL		http://isebaro.com/savetube/include/files/savetubeplus.user.js
// @updateURL		http://isebaro.com/savetube/include/files/savetubeplus.user.js
// @icon		http://s3.amazonaws.com/uso_ss/icon/130917/large.png
// @include		*
// @grant		none
// ==/UserScript==


/*
  
  Copyright (C) 2011 - 2014 Sebastian Luncan

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


// ==========Variables========== //

// Userscript
var userscript = 'SaveTube';

// Contact
var contact = 'http://isebaro.com/contact/?ln=en&sb=savetube';


// ==========Fixes========== //

// Don't run on frames or iframes
if (window.top && window.top != window.self)  return;


// ==========Websites========== //

/* Page Source */
var xmlHTTP = new XMLHttpRequest();
xmlHTTP.open('GET', window.location.href, false);
xmlHTTP.send();
var source = xmlHTTP.responseText;
if (!source) source = document.getElementsByTagName('html')[0].innerHTML;
if (!source) source = document.body.innerHTML;
if (!source) return;

/* Video Patterns */
var patterns = [
  '=(http[^=]*?\\.(mp4|flv|webm|m3u8).*?)&',
  'file\s*:\s*"(http[^")]*?\\.(mp4|flv|webm|m3u8).*?)"',
  'src="(http[^"]*?\\.(mp4|flv|webm|m3u8).*?)"',
  '"(http[^"]*?\\.(mp4|flv|webm|m3u8).*?)"',
  '\'(http[^\']*?\\.(mp4|flv|webm|m3u8).*?)\''
  ];

/* Video Matcher */
var pattern, matches, matcher, video, type;
var links = '';
for (var i = 0; i < patterns.length; i++) {
  pattern = new RegExp(patterns[i], 'g');
  matches = source.match(pattern);
  if (matches) {
    for (var v = 0; v < matches.length; v++) {
      matcher = matches[v].match(patterns[i]);
      video = (matcher) ? matcher[1] : null;
      if (video) {
	if (video.indexOf('%') != -1) video = unescape(video);
	if (video.indexOf('&amp;') != -1) video = video.replace(/&amp;/g, '&');
	if (video.indexOf('http') == 0 && !video.match(/(thumb|\.jpg|\.png|\/\/[^\/]*?(mp4|flv|webm|m3u8))/)) {
	  if (video.indexOf('.mp4') != -1) type = 'MP4';
	  else if (video.indexOf('.flv') != -1) type = 'FLV';
	  else if (video.indexOf('.webm') != -1) type = 'WebM';
	  else if (video.indexOf('.m3u8') != -1) type = 'M3U8';
	  else type = 'Video';
	  if (links.indexOf(video) == -1) links += ' <a href="' + video + '" style="color:#2C72C7">' + type + '</a>';
	}
      }
    }
  }
}
if (links) {
  var panel = document.createElement('div');
  panel.style.position = 'fixed';
  panel.style.bottom = '0px';
  panel.style.right = '5%';
  panel.style.zIndex = '9999999999';
  panel.style.minWidth = '200px';
  panel.style.height = '30px';
  panel.style.color = '#336699';
  panel.style.backgroundColor = '#EEEEEE';
  panel.style.padding = '5px';
  panel.style.fontSize = '14px';
  panel.style.fontWeight = 'bold';
  panel.style.textAlign = 'center';
  panel.style.borderLeft = '1px solid #999999';
  panel.style.borderRight = '1px solid #999999';
  panel.style.borderTop = '1px solid #999999';
  panel.style.borderRadius = '5px 5px 0px 0px';
  panel.style.opacity = '0.9';  
  panel.innerHTML = '<a href="' + contact + '" style="color:#77B753">' + userscript + '</a>: ' + links;
  document.body.appendChild(panel);
}

})();
