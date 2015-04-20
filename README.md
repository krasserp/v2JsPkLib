# v2JsPkLib
jQuery plugin for v2 with helper functions
Initial collection of some more or less usefull JS snippets which I keep on reusing. Needed is the file within the static folder of the project

To load the following could be used:

<style name="respview.client.css">
<![CDATA[
<link rel="stylesheet" href="[rel custom.css]">
]]>
</style>
<style name="respview.client.js" > 
<![CDATA[
<script  src="[rel v2PkLib.js]" ></script>
<script>
$ (document).ready(function() {
  pQ('body').helper('hillarious');
  if (pQ('.sq-atm1d-table-cell img').doesExist()){
    pQ('body').helper('makeImbBtn');
  }
  if(pQ('input[type="file"]').doesExist()){
    pQ('body').helper('fileExtensionCheck');
    console.log('found file input');
  }
    if(pQ('.sq-bcvideo-container').doesExist()){
    pQ('body').helper('videoSkip');
    console.log('video found');
  }
 });
  </script>
]]>
</style>
