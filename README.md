Cat-Avatar-Generator
====================

![cover picture](http://www.peppercarrot.com/data/images/lab/2016-11-30_cdn/2016-11-29_the-quest-to-free-peppercarrot-website_02a-avatar.jpg)

A generator of cats pictures optimised to generate or random avatars, or defined avatar from a "seed". A derivation by [David Revoy](http://www.peppercarrot.com) from the original [MonsterID by Andreas Gohr's](https://www.splitbrain.org/blog/2007-01/20_monsterid_as_gravatar_fallback).

## License:

**Artworks:**
PNG and ORA files licensed under: [CC-By 4.0](https://creativecommons.org/licenses/by/4.0/) attribution: David Revoy with the following exception: Generated cats used as Avatar (for blog,forum,social-network) don't need direct attribution and so, can be used as regular avatars without pasting David Revoy's name all over the place.

**Code**
This PHP is licensed under the short and simple permissive:
[MIT License](https://en.wikipedia.org/wiki/MIT_License)
 
## Usage:

Call the script this way: 
```
echo '<img height="70px" width="70px" src="your/path/to/cat-avatar-generator?seed='.$var.'"/>';
```
_(Note: for the seed, I advice to use author's name to not expose email or sensitive datas, even hashed on a public code.)_

## How to edit artworks

1. Open img/00_SRC.ora with Krita ( or Gimp,Mypaint,Pinta) Do your edit/draw/paint, respect layer naming, save.
2. Open it again in Gimp 2.8, with the [export layer plugin](https://github.com/khalim19/gimp-plugin-export-layers/releases/download/2.4/export-layers-2.4.zip)
3. Scale the image down to the result you want (eg. 256px x 256px as on the demo ) LancZos filter
3. File > Export layer (Allow invisible layer to be exported, check 'image size', PNG file format )
4. Done. 

All PNG files of 'parts' are extracted this way and keep their layer name.
