(function () {

  // 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=ea3c5487667edfd733b6e2166b57d22c&tags=america&format=json&nojsoncallback=1'
  var baseUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&';
  var apiKey = 'api_key=ea3c5487667edfd733b6e2166b57d22c&';
  var query = 'tags=beachview&'; 
  var endUrl = 'format=json&nojsoncallback=1';

  var LBX = {
    currImg : null,
    listImgs : [],
    url : baseUrl + apiKey + query + endUrl
  };

  var lib = {
    ajax: {
      xhr: function() {
        var instance = new XMLHttpRequest();
        return instance;
      },
      getJson: function(url, callback) {
        console.log(url);
        var xhttp = this.xhr();
        xhttp.open('GET', url, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
          if(xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
            callback(xhttp.responseText);
          };
        }
      }
    }
  };

  var getFlickrData = function(data) {
    var dataObj = JSON.parse(data);
    console.log(dataObj);
    var dataArr = dataObj.photos.photo;
    var imgObjArr = [];
    var len = (dataArr.length > 12)? 12 : dataArr.length;
    for (var i = 0; i < len; i++) {
      var farmId = dataArr[i].farm;
      var serverId = dataArr[i].server;
      var id = dataArr[i].id;
      var secret = dataArr[i].secret;
      var imgUrl = 'https://farm' + 
                           farmId + 
                           '.staticflickr.com/' + 
                           serverId + '/' +
                           id + '_' + secret + '.jpg';
      imgObjArr.push({"photo": dataArr[i], "url": imgUrl});
    }
    insertNewImgs(imgObjArr);
  };

  var removeAllImgs = function() {
    var ul = document.getElementById("portfolio");
    ul.innerHTML = "";
    LBX.currImg = null;
    LBX.listImgs = [];
  };

  var insertNewImgs = function(urls) {
    var ul = document.getElementById("portfolio");
    for(var i = 0; i < urls.length; i++) {
      var title = urls[i].photo.title;
      var url = urls[i].url;
      var li = document.createElement("li");
      var a = document.createElement("a");
      var img = document.createElement("img");
      img.height = "300";
      img.width = "400"
      img.setAttribute("src", url);
      img.setAttribute("title",title);
      img.setAttribute("id", i+1);
      a.setAttribute("title", title);
      a.appendChild(img); 
      li.appendChild(a);
      ul.appendChild(li);
      LBX.listImgs.push(img);
    }
    closeEventsListen();
  }

  var addEvent = function (ele, event, callback, capture) {
    if (ele.addEventListener) {
        ele.addEventListener(event, callback, capture || false);
    } else if (ele.attachEvent) {
        ele.attachEvent('on' + event, callback);
    }
  }

  var addClasses = function(ele, classes) {
    for (var i = 0; i < classes.length; i++) {
      ele.classList += ' ' + classes[i];
    }
  }

  var insertImgContent = function(src, title, id, len) {

    var imgTag = '<img class="lbx-img" src=' + src + ' style="max-height: 418px;">';
    var figCaptionTag = '<figcaption><div class="lbx-bottom-bar"><div class="lbx-title">' +
                        title + '</div><div class="lbx-counter">' + id + ' of ' + len + '</div></div></figcaption>';
    var figure = document.querySelector('figure');
    figure.innerHTML = imgTag + figCaptionTag;
  }

  var unwrap = function (wrapper) {
      // place childNodes in document fragment
      var docFrag = document.createDocumentFragment();
      while (wrapper.firstChild) {
          var child = wrapper.removeChild(wrapper.firstChild);
          docFrag.appendChild(child);
      }

      // replace wrapper with document fragment
      wrapper.parentNode.replaceChild(docFrag, wrapper);
  }

  var insertTemplate = function() {
    var open =  '<div class="lbx-bg lbx-ready"></div>' +
                '<div class="lbx-wrap lbx-gallery lbx-close-btn-in lbx-auto-cursor lbx-ready" tabindex="-1" style="overflow-x: hidden; overflow-y: auto;">' +
                  '<div class="lbx-container lbx-s-ready lbx-image-holder">' +
                    '<div class="lbx-content">' +
                      '<div class="lbx-figure">' +
                        '<button title="Close (Esc)" type="button" class="lbx-close">×</button>' +
                        '<figure>';
    var close =         '</figure>' +
                      '</div>' +
                    '</div>' +
                    '<div class="lbx-preloader">Loading...</div>' +
                    '<button title="Previous (Left arrow key)" type="button" class="lbx-arrow lbx-arrow-left lbx-prevent-close"></button>' +
                    '<button title="Next (Right arrow key)" type="button" class="lbx-arrow lbx-arrow-right lbx-prevent-close"></button>' +
                  '</div>' +
                '</div>';
    var temp = document.createElement('div');
    temp.id = "temp";
    temp.innerHTML = open + close;
    document.body.insertBefore(temp, document.body.firstChild);
    unwrap(document.querySelector('#temp'));
  }

  var findPosition = function(ele) {
        var position = 0;
        var currentNode = ele;
        var parentNode = currentNode.parentNode;
        var firstNode = currentNode.parentNode.firstChild;
        while (firstNode.nodeType != 1) {
          parentNode.removeChild(firstNode);
          firstNode = parentNode.firstChild;
        }
        while(firstNode != currentNode) {
            if (currentNode.nodeType == 1) {
              position++;
            }
            currentNode = currentNode.previousSibling;
        }
        return position;
  }

  var goPrev = function() {
    var len = LBX.listImgs.length;
    var id = LBX.currImg.id - 0;
    var index = (id == 1) ? len : id - 1;
    var img = LBX.listImgs[index-1];
    insertImgContent(img.src, img.title, img.id, len);
    LBX.currImg = img;
  }

  var goNext = function() {
    var len = LBX.listImgs.length;
    var id = LBX.currImg.id - 0;
    var index = (id == len) ? 1 : id + 1;
    var img = LBX.listImgs[index-1];
    console.log(len);
    insertImgContent(img.src, img.title, img.id, len);
    LBX.currImg = img;    
  }

  var closeImg = function() {
    document.body.removeChild(document.body.firstChild);
    document.body.removeChild(document.body.firstChild);
  }

  var clickLightBox= function (event) {
    console.log(event);
    var leftButton = document.querySelector('button.lbx-arrow-left');
    var rightButton = document.querySelector('button.lbx-arrow-right');
    var clickedPart = event.target.nodeName;
    var className = event.target.className;
    if (clickedPart === "IMG" || 
       (clickedPart === "DIV" && 
        (className === "lbx-bottom-bar" || className === "lbx-title" || className === "lbx-counter"))) {
    } else if (clickedPart === "BUTTON" && className === "lbx-arrow lbx-arrow-left lbx-prevent-close"){
      goPrev();
    } else if (clickedPart === "BUTTON" && className === "lbx-arrow lbx-arrow-right lbx-prevent-close"){
      goNext();
    }else {
      closeImg();
    }
  }

  var openEventsListen = function () {
    var container = document.querySelector('div.lbx-container');
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 37: // left key
                goPrev();
                break;
            case 39: // right key
                goNext();
                break;
            case 27:
                closeImg();
                break;
        }
    };
    addEvent(container, 'click', clickLightBox, false);
  }

  var loadImgs = function() {
    removeAllImgs();
    lib.ajax.getJson(LBX.url, getFlickrData);
  }

  var getNewImgs = function(searchQuery) {
    query = 'tags=' + searchQuery + '&';
    LBX.url = baseUrl + apiKey + query + endUrl;
    console.log("before add new imgs: ", LBX.listImgs);
    loadImgs();
    console.log("after add new imgs: ", LBX.listImgs);
  }

  var closeEventsListen = function() {
    console.log(LBX.listImgs);
     var ul = document.getElementsByTagName('ul')[0];
     for (var i = 0; i < ul.children.length; i++) {
        var li = ul.children[i];
        addEvent(li, 'click', function (event) {
          var src = event.target.currentSrc;
          var title = this.firstChild.title;
          console.log(event);
          var id = event.target.id; 
          insertTemplate();
          insertImgContent(src,title,id,LBX.listImgs.length);
          LBX.currImg = event.target;
          openEventsListen();
        }, false);
     }
  }

  var init = function () {
    console.log("Initializing...");
    loadImgs();
    var searchButton = document.querySelector('input.button[type="submit"]');
    addEvent(searchButton, 'click', function (event) {
      var searchQuery = document.querySelector('input[type="search"]').value;
      getNewImgs(searchQuery);
    }, false);
  }

  document.addEventListener('DOMContentLoaded', function(){ 
     init();
  }, false);


  // https://farm1.staticflickr.com/2/1418878_1e92283336_m.jpg
  /*lib.ajax.getJson(url, getFlickrData);*/
  // document.addEventListener('DOMContentLoaded', function(){ 
  //removeAllImgs();
  // }, false);
})();
