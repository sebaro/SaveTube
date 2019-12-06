
SaveTube is a browser user script for downloading videos from video websites.

![](https://gitlab.com/sebaro/SaveTube/raw/master/Images/screenshot.png)


## Installation

#### Mozilla (Firefox, Seamonkey, IceWeasel, IceCat, TenFourFox etc):
   - with Greasemonkey add-on:
   > https://addons.mozilla.org/firefox/addon/greasemonkey
   - with Tampermonkey add-on:
   > https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
   > https://www.tampermonkey.net/?browser=firefox
   - with Violentmonkey add-on:
   > https://addons.mozilla.org/firefox/addon/violentmonkey/
   > https://violentmonkey.github.io/get-it/
   - with Scriptish add-on:
   > https://github.com/scriptish/scriptish
   - WebExtensions add-on:
   > https://addons.mozilla.org/firefox/addon/savetube

#### Chromium (or based on: Chrome, Iron etc):
   - save the script and drag & drop it on the extensions page
   - with Tampermonkey add-on:
   > https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
   > https://www.tampermonkey.net/?browser=chrome
   - with Violentmonkey add-on:
   > https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag
   > https://violentmonkey.github.io/get-it/
   - WebExtensions add-on:
   > http://sebaro.pro/savetube/files/savetube.crx

#### Opera:
   - for versions <= 12 download and save the script in the JavaScript files directory (Settings/Preferences/Advanced/Content/JavaScript Options.../User JavaScript folder) and enable "User JavaScript on HTTPS" in "opera:config".
   - with Violentmonkey extension:
   > https://violentmonkey.github.io/get-it/
   - with Tampermonkey extension:
   > https://addons.opera.com/en/extensions/details/tampermonkey-beta
   > https://www.tampermonkey.net/?browser=opera

#### Safari:
   - for versions < 5.1 with GreaseKit add-on:
   > http://safariaddons.com/en-US/safari/addon/43
   - for versions < 5.0.1 with NinjaKit add-on:
   > http://os0x.hatenablog.com/entry/20100612/1276330696
   - for versions >= 6 with Tampermonkey add-on:
   > https://www.tampermonkey.net/?browser=safari

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
   > https://www.tampermonkey.net/?browser=chrome
   - Maxthon extension:
   > http://extension.maxthon.com/detail/index.php?view_id=2816


## Options

#### Definition (SD, HD etc)
   - Select the default (highest) video definition.

#### Container (MP4, WebM etc)
   - Select the default video container.

#### Autoget:
   - Enable/disable video autodownload. If it's on, the video download will start when the video page is loaded or when a new video format is selected.

#### MPEG-DASH (MD):
   - Enable/disable DASH streams (video with audio) download. It requires an external application for muxing the audio and video streams, see http://sebaro.pro/savetube
