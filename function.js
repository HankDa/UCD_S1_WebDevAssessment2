function getFile(url) {
    "use strict";
    var js = new XMLHttpRequest();
    js.open("GET", url, false);
    js.send();
    return js.responseText;
  }