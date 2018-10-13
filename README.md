
SaveTube is a browser user script for downloading videos from video websites.

![](https://gitlab.com/sebaro/SaveTube/raw/master/Images/screenshot.png)


## Installation

#### Mozilla (Firefox, Seamonkey, IceWeasel, IceCat, TenFourFox etc):
   - with Greasemonkey add-on:
   > https://addons.mozilla.org/firefox/addon/greasemonkey
   - with Scriptish add-on:
   > https://addons.mozilla.org/firefox/addon/scriptish
   - WebExtensions add-on:
   > https://addons.mozilla.org/firefox/addon/savetube

#### Chromium (or based on: Chrome, Iron etc):
   - save the script and drag & drop it on the extensions page
   - with Tampermonkey add-on:
   > https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
   - with Violentmonkey add-on:
   > https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag
   - WebExtensions add-on:
   > https://chrome.google.com/webstore/detail/savetube/olnfnfnjjobemjofpilijbdnmojefabe

#### Opera:
   - for versions <= 12 no add-on needed, just place the script in the JavaScript files directory
   - with Violentmonkey extension:
   > https://addons.opera.com/en/extensions/details/violent-monkey
   - with Tampermonkey extension:
   > https://addons.opera.com/en/extensions/details/tampermonkey-beta

#### Safari:
   - for versions < 5.1 with GreaseKit add-on:
   > http://safariaddons.com/en-US/safari/addon/43
   - for all versions (?) with NinjaKit add-on:
   > http://d.hatena.ne.jp/os0x/20100612/1276330696
   - as bookmarklet with Geekmonkey add-on:
   > http://surber.us/2006/04/14/geekmonkey

#### Epiphany:
   - with the Greasemonkey extension from Epiphany extensions

#### Midori:
   - with "User Addons" extension

#### Falkon/QupZilla:
   - with the Greasemonkey plugin

#### Maxthon:
   - with Violentmonkey extension:
   > http://extension.maxthon.com/detail/index.php?view_id=1680
   - with Tampermonkey Chrome extension:
   > https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo

#### Internet Explorer:
   - with IE7Pro extension:
   > http://ie7pro.com
   - IE11:
   > https://sourceforge.net/projects/trixiewpf45


## Options

#### Autoget:
   - Click 'Autoget' button to turn autoget on/off. If it's on, the video download will start when the video page is loaded or when a new video format is selected.

#### Definition (SD, HD etc):
   - Click this button to change the default video definition.

#### Container (MP4, WebM etc):
   - Click this button to change the default video container.

#### MPEG-DASH (MD):
   - Click this button to enable/disable MPEG-DASH streams (video with audio) download. It requires an external application for muxing the audio and video streams, see http://sebaro.pro/savetube
