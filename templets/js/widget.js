var _domain_name;
var _attr_key ;
var _IMIchat_IsValidNavigation;
var _IMIchat_callback_dic = {};

    // localStorage.;
    function getItems(){
    localStorage.setItem('value1', 'true');
    localStorage.setItem("service_keyjjjj","70003df6-33d8-11ea-afcd-0610d74d64fc")
    var val1 = localStorage.getItem('value1');
    console.log(val1)
    }
    getItems()

var IMIChatInit = function () {
    var buttonType = "type1";
    var domainname = "";
    var ticks = new Date().getTime();
    var fingerprint = null;
    try {
        fingerprint = localStorage.getItem("fingerprint");
    } catch (e) { }
       //var domainUrl = "http://widget.imichat.co";
    var domainUrl = "https://media.imi.chat";
    const _skey = "70003df6-33d8-11ea-afcd-0610d74d64fc";
    return {
        domainName: function () {
            return "./js/widgetv2.js";
        },
        init: function () {
            try {
                _IMIchat_IsValidNavigation = false;
                _attr_key = "70003df6-33d8-11ea-afcd-0610d74d64fc";

                var body = document.getElementsByTagName('body')[0];

                var script = document.currentScript || (function () {
                    var scripts = document.getElementsByTagName('script');
                    return scripts[scripts.length - 1];
                })();
                var fullUrl = script.src;
                domainname = fullUrl.substring(0, fullUrl.lastIndexOf("/"));
                _domain_name = domainname = domainname.substring(0, domainname.lastIndexOf("/"));

                var generalscript = document.createElement('script');
                // + "/js/imichatgeneral.js"
                generalscript.src = this.domainName() ;
                generalscript.type = 'text/javascript';
                body.appendChild(generalscript);
                generalscript.addEventListener('load', function (event) {
                    var docwidth = window.outerWidth; //window.innerWidth;//screen.width; //document.body.clientWidth;

                    document.getElementById("divicw").innerHTML = "<link rel=\"stylesheet\" href=\"" + "http://clientservices-onefinestay.herokuapp.com" + "/css/chat-widget.css?id=" + ticks + "\" />" +
                        "<style>.imichat-fullscreen-modal{width:0px;height:0px;position:fixed;border: 0px;}.imichat-fullscreen-modal.imichat-open{width:100%;height:100%;top: 0;bottom: 0;left: 0;right: 0;z-index: 9999999999999999999999;}</style>" +
                        "<iframe class=\"chatbutton\" id=\"imi-chatbutton\" title=\"Livechat launcher icon\" name=\"Livechat launcher icon\"></iframe>" +
                        "<div class=\"main-unreadchat-cont\"><iframe class=\"chatunread-frame\"  id=\"chatunread-frame\" allowtransparency=\"true\" title=\"Unread Messages\" name=\"Unread Messages\"></iframe></div>" +
                        "<div class=\"main-chat-cont\" id=\"divchatmain\" style=\"display:none;\"> <div class=\"main-chat-cont-sub\">" +
                        "<iframe class=\"chatwindow-frame\" onload=\"IMIChatInit.onIframeLoad()\" allowfullscreen id=\"divchataside\"  src=\"./widgetv2.js"  + "/widgetloader.html?docwidth=" + docwidth + "&id=" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "&org=" + document.getElementById("divicw").getAttribute("data-org") + "\" title=\"Chat Conversation Window\" name=\"Conversation Window\" role=\"complementary\"></iframe>" +
                        "</div></div>" +
                        "<iframe allowfullscreen class=\"imichat-fullscreen-modal\" id=\"imichat-fullscreen-modal\"src=\"./widgetv2.js" + "/centerpagepost.html\" title=\"Chat Full Screen Priority message\"></iframe>";

                    window.addEventListener("resize", function () {
                        IMIChatInit.resize();
                    });

                    window.addEventListener('message', function (event) {
                        try {
                            if (event.data.action != null) {
                                if (event.data.action == 'openchat') {
                                    IMIChatInit.openchat(event);
                                }
                                if (event.data.action == 'badgecount') {
                                    IMIChatInit.badgecount(event);
                                }
                                if (event.data.action == 'chatswitchicon') {
                                    IMIChatInit.chatswitchicon(); //event
                                }
                                if (event.data.action == 'imichat_custom_chat_fields') {
                                    if (event.data.type = 'add') {
                                        if (_IMIchat_callback_dic['imichat-widget:custom_chat_fields_init'] !== undefined) {
                                            _IMIchat_callback_dic['imichat-widget:custom_chat_fields_init'](event.data.response);
                                        }
                                    }
                                    else if (event.data.type = 'update') {
                                        if (_IMIchat_callback_dic['imichat-widget:custom_chat_fields_update'] !== undefined) {
                                            _IMIchat_callback_dic['imichat-widget:custom_chat_fields_update'](event.data.response);
                                        }
                                    }//event
                                }
                                if (event.data.action == 'loadstyles') {
                                    IMIChatInit.loadwidgetStyles(event.data.message);

                                    IMIChatInit.loadJQuery(_domain_name, function () {
                                        IMIChatInit.LaunchProactiveMsgManager(_domain_name, function () {
                                        });
                                        IMIChatInit.handleAbandonedChats();
                                    });

                                    try {
                                        if (event.data.message != null) {
                                            if (_IMIchat_callback_dic['imichat-widget:ready'] !== undefined) {
                                                _IMIchat_callback_dic['imichat-widget:ready'](_attr_key);
                                                console.log("imichat-widget:ready fired");
                                            }

                                            //eval('imichatWidgetLoaded();');
                                            if (_IMIchat_callback_dic['imichat-widget:custom_chat_fields_init'] !== undefined) {
                                                _IMIchat_callback_dic['imichat-widget:custom_chat_fields_init']();
                                            }

                                        }
                                    } catch (e) {
                                    }
                                }
                                if (event.data.action == 'closemodelpopup') {
                                    document.getElementById('imichat-fullscreen-modal').className = 'imichat-fullscreen-modal';
                                }
                                if (event.data.action == 'setsession') {
                                    sessionStorage.setItem(event.data.key, event.data.value);
                                }
                                if (event.data.action == 'setlocal') {
                                    localStorage.setItem(event.data.key, event.data.value);
                                }
                            }
                        } catch (e) { }

                        function bindEvent(element, eventName, eventHandler) {
                            if (element.addEventListener) {
                                element.addEventListener(eventName, eventHandler, false);
                            } else if (element.attachEvent) {
                                element.attachEvent('on' + eventName, eventHandler);
                            }
                        }
                    });
                });
            } catch (e) {
                console.log("LaunchProactiveMsgManager:" + e.msg);
            }
        },
        onIframeLoad: function () {
            try {
                var destination = document.getElementById('divchataside').contentWindow;
                msg = {
                    "action": "getstyle",
                    "attrkey": "70003df6-33d8-11ea-afcd-0610d74d64fc",
                    "host": window.location.hostname
                };
                destination.postMessage(JSON.stringify(msg), domainUrl);
            } catch (e) { }
        },
        loadwidgetStyles: function (msg) {
            try {
                if (msg != '' && msg != undefined && msg != null && msg != 'null') {
                    msg = JSON.parse(msg);
                    buttonType = msg.button_shape;
                    var color = "#ffffff";
                    var lightness1 = 0;
                    var lightness = 0;
                    try {
                        var widgcolor = msg.widgetcolor;
                        r = parseInt(widgcolor.substr(1, 2), 16);
                        g = parseInt(widgcolor.substr(3, 2), 16);
                        b = parseInt(widgcolor.substr(5, 2), 16);
                        hue = IMIGeneral.rgbToHsl(r, g, b)[0] * 360;
                        saturation = IMIGeneral.rgbToHsl(r, g, b)[1] * 100;
                        lightness = IMIGeneral.rgbToHsl(r, g, b)[2] * 100;

                        lightness1 = lightness + 10;
                        lightness2 = 95;
                        var lightness3 = 98;
                        var lightness4 = lightness + 10;
                        if (lightness > 80) {
                            color = "#333333";
                        }
                    } catch (e1) { }

                    var badgecount = " <span class=\"badge\" id=\"chattotalbadge\" {0}>{1}</span> ";
                    if (localStorage.getItem(fingerprint + "_" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "_badgecount") != null) {
                        var count = localStorage.getItem(fingerprint + "_" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "_badgecount");
                        if (count > 0) {
                            badgecount = badgecount.replace("{0}", "style=\"display:block;\"").replace("{1}", count);
                        } else {
                            badgecount = badgecount.replace("{0}", "style=\"display:none;\"").replace("{1}", "");
                        }
                    } else {
                        badgecount = badgecount.replace("{0}", "style=\"display:none;\"").replace("{1}", "");
                    }
                    var doc = document.getElementById('imi-chatbutton').contentWindow.document;
                    doc.open();
                    /*  doc.write("<style> .open-btn span {position: absolute;width: 21px;height: 21px;top: 0;bottom: 0;left: 0;right: 0;margin: auto;}"+
            ".open-btn{border-radius:50%;color:#ffffff!important;text-align:center;background-color:#00b0f0;border:0 solid #cdcdcd;display:block;margin:0 0 0;text-decoration:none!important;font-family:imichat-icomoon;text-transform:none;height:60px;width:60px;position:fixed;bottom:10px;right:10px;font-size:18px;box-shadow:0 1px 2px 0 rgba(0,0,0,.2);z-index:9999999}"+
            ".open-btn .icon-headset:before{content:\"\\e905\"}.open-btn.close-btn .icon-headset:before{content:\"\\e90a\"}.open-btn span{position:absolute;width:21px;height:21px;top:0;bottom:0;left:0;right:0;margin:auto}</style>"+*/
                    doc.write("<link rel=\"stylesheet\" href=\"" + IMIGeneral.domainName() + "/css/style.css?id=" + IMIGeneral.ticks() + "\" />" +
                        "<link rel=\"stylesheet\" href=\"" + IMIGeneral.domainName() + "/css/chat-widget-frame.css?id=" + IMIGeneral.ticks() + "\" />" +
                        "<button class=\"open-btn state1 " + buttonType + "\" id=\"addClass\" onclick=\"parent.IMIChatInit.chatswitchicon()\" title=\"Chat button\" role=button aria-label=\"Start web chat\" href=\"#void\">" + badgecount + "<span class=\"widget-icon\"></span></span></button><script>" +
                        "document.getElementById(\"addClass\").style.color ='" + color + "';" +
                        "document.getElementById(\"addClass\").style.backgroundColor ='" + msg.widgetcolor + "';" +
                        "document.getElementById(\"addClass\").style.display = 'block';</script>");
                    doc.close();
                    /* for test */
                    var doc1 = document.getElementById('chatunread-frame').contentWindow.document;
                    doc1.open();
                    doc1.write("<link rel=\"stylesheet\" href=\"" + IMIGeneral.domainName() + "/css/previewstyle.css?id=" + IMIGeneral.ticks() + "\" />" +
                        "<style>div.msg{background-color:" + "hsl(" + hue + "," + saturation + "%," + lightness2 + "%)" + ";color:#333!important;} div.msg::after,div.msg::before{content:'';border: solid transparent;border-color: rgba(194, 225, 245, 0);border-top-color: " + "hsl(" + hue + "," + saturation + "%," + lightness2 + "%)" + ";} .imichatpreview-msg-clearbtn{color:" + "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)" + ";} </style><html class=\"imichatmsgpreview\"><a class=\"imichatpreview-msg-clearbtn\" id=\"ancclearcards\" onclick=\"parent.IMIChatInit.clearmsgcards()\" style=\"display:none\">x</a><div id=\"msg-list\" syle=\"height:7px\"></div>" +
                        //"<script>function openchat(threadid){window.parent.IMIChatInit.postMessage({ action: 'openchat',threadid:threadid}, '*');}</script>" +
                        "</html>");
                    doc1.close();
                    IMIGeneral.storeLocal("style_" + window.location.hostname, msg);
                    document.getElementById('chatbutton').style.display = "block";
                } else {
                    document.getElementById("divicw").innerHTML = '';
                }
            } catch (e1) { }
        },

        chatswitchicon: function (type) {
            console.log("Chatswitchicon::" + type);
            try {
                if (type === undefined || type == 1 || type == 0) {
                    var destination = document.getElementById('divchataside').contentWindow;
                    msg = {
                        "action": "register_rtm",
                        "host": window.location.hostname
                    };
                    destination.postMessage(msg, domainUrl);
                }

                /*type=1-max and 0- min */
                var isMobile = "0";
                // if (window.innerWidth > 768) { //     document.getElementById('divchatmain').className = 'main-chat-cont';
                // } else { //     document.getElementById('divchatmain').className = 'main-chat-cont chatmobile';
                //     isMobile="1";
                // }
                if ((navigator.userAgent.indexOf("Mobile")) != -1) {
                    isMobile = "1";
                }
                sessionStorage.setItem("data-bind", document.getElementById("divicw").getAttribute("data-bind"));
                sessionStorage.setItem("data-org", document.getElementById("divicw").getAttribute("data-org"));
                var iframe = document.getElementById('imi-chatbutton');
                if (iframe == null || iframe == undefined) return;
                var innerDoc = iframe.contentDocument || iframe.contentWindow.document;

                //Open Widget
                if (document.getElementById("divchatmain").style.display === 'none' && (type == 1 || type == 2 || type == undefined)) {
                    document.getElementById("divchatmain").style.display = "block";
                    IMIGeneral.checkmobile();
                    //if ((window.outerWidth < 497) && (document.documentElement.classList.contains('imichatmobile-active') == false) && document.getElementById("divchatmain").style.display == "block") {
                    var className = " " + document.documentElement.className + " ";
                    if ((window.outerWidth < 700) && (" " + className + " ").replace(/[\n\t]/g, " ").indexOf("imichatmobile-active") > -1 && document.getElementById("divchatmain").style.display == "block") {
                        // if((document.documentElement.classList.value.split(/\s+|\./).filter(word => word === 'imichatmobile-active').length==1) == false){
                        document.documentElement.classList.remove("imichatmobile-active");
                        document.documentElement.className = document.documentElement.className + " imichatmobile-active";
                        // }
                    } else {
                        document.documentElement.className = document.documentElement.className.replace(' imichatmobile-active', '');
                    }
                    document.getElementById('chatunread-frame').style.display = "none";
                    innerDoc.getElementById("addClass").setAttribute("class", "open-btn state1 " + buttonType + " close-btn");
                    innerDoc.getElementById("addClass").setAttribute("aria-label", "Close web chat");
                    document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").style.display = "none";
                    document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").innerText = "";
                    localStorage.setItem(fingerprint + "_" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "_badgecount", 0);
                    localStorage.setItem(fingerprint + "_" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "_cardcount", 0);
                    IMIChatInit.clearmsgcards();
                    // if (IMIGeneral.getBrowserName() == "safari") {
                    // if (IMIGeneral.detectIOS()) {
                    // document.body.classList.add('chatnoscroll');
                    // }
                    // }
                    if (type === undefined) {
                        var destination = document.getElementById('divchataside').contentWindow;
                        msg = {
                            "action": "showiframe",
                            "host": window.location.hostname,
                            "chatmobile": isMobile
                        };
                        destination.postMessage(msg, domainUrl);
                    }

                    return;
                }
                //Close Widget
                if (document.getElementById("divchatmain").style.display === 'block' && (type == 0 || type == 2 || type == undefined)) {
                    document.documentElement.className = document.documentElement.className.replace(' imichatmobile-active', '');
                    //document.body.classList.remove('chatnoscroll');
                    document.getElementById("divchatmain").style.display = "none";
                    innerDoc.getElementById("addClass").setAttribute("class", "open-btn state " + buttonType);
                    document.getElementById('chatunread-frame').style.display = "block";
                    localStorage.setItem(fingerprint + "_" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "_cardcount", 0);
                    return;
                }
                //var iframeEl = document.getElementById("divchataside");
                // Make sure you are sending a string, and to stringify JSON
                // iframeEl.contentWindow.postMessage("hello", '*');
                return;
            } catch (e) {
                console.log("LaunchProactiveMsgManager:" + e.msg);
            }
        },
        clearmsgcards: function () {
            document.getElementById('chatunread-frame').contentWindow.document.getElementById("msg-list").innerHTML = "";
            document.getElementById('chatunread-frame').contentWindow.document.getElementById("ancclearcards").style.display = "none";
            //document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").style.display = "none";
            //document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").innerText == "";
            localStorage.setItem(fingerprint + "_" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "_cardcount", 0);
        },
        openchat: function (event) {
            document.getElementById('imichat-fullscreen-modal').className = 'imichat-fullscreen-modal';
            var destination = document.getElementById('divchataside').contentWindow;
            destination.postMessage({
                action: 'openchat',
                threadid: event.data.threadid,
                proactive_id: event.data.proactive_id
            }, '*');
            parent.IMIChatInit.chatswitchicon(2);
        },
        badgecount: function (event) {
            try {
                if (document.getElementById("divchatmain").style.display === 'none') {
                    var count = document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").innerText;
                    if (count == 0 || count == "") {
                        count = 1;
                    } else {
                        count = parseInt(count) + 1;
                    }
                    var duplicate = 0;
                    var innerDivs;
                    var innerDivsCount = 0;
                    var refChild;
                    IMIChatInit.clearmsgcards();
                    var containerDiv = document.getElementById('chatunread-frame').contentWindow.document.getElementById("msg-list");
                    if (count > 1) {
                        innerDivs = containerDiv.getElementsByClassName("msg");
                        if (innerDivs != undefined) {
                            innerDivsCount = innerDivs.length;
                            for (var i = 0; i < innerDivs.length; i++) {
                                if ("msg_" + event.data.msgtransid == innerDivs[i].id) {
                                    duplicate = 1;
                                }
                            }
                            refChild = innerDivs[0];
                        }
                    }
                    var cardcount;
                    var checkbadgecount;
                    if (innerDivs == undefined) {
                        localStorage.setItem(event.data.fingerprint + "_" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "_cardcount", 1);
                    }
                    document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").style.display = "block";

                    if (duplicate == 0) {
                        if (parseInt(innerDivsCount) == 5) {
                            containerDiv.removeChild(document.getElementById('chatunread-frame').contentWindow.document.getElementsByClassName('msg')[4]);
                            containerDiv.removeChild(document.getElementById('chatunread-frame').contentWindow.document.getElementsByClassName('msgclear')[4]);
                            innerDivsCount = innerDivsCount - 1;
                        }
                        if ((parseInt(innerDivsCount) < 1 &&
                                event.data.badge_type === undefined) || event.data.badge_type === 2 || event.data.badge_type === 3) {
                            var node = document.createElement("div");
                            var node1 = document.createElement("div");
                            var textnode = document.createTextNode(event.data.msg);
                            if (textnode.data.length > 45) {
                                if (event.data.badge_type === undefined || event.data.badge_type === 2) {
                                    textnode.data = textnode.data.substr(0, 45) + "...";
                                } else {
                                    textnode.data = textnode.data;
                                }
                            }
                            node.className = "msg";
                            node.style = "cursor:pointer;";
                            node1.className = "msgclear";
                            node.id = "msg_" + event.data.msgtransid; // Create a text node
                            node1.id = "msgclear_" + event.data.msgtransid;
                            node1.style = "clear:both;";
                            node.addEventListener("click", function () {
                                window.parent.postMessage({
                                    action: 'openchat',
                                    threadid: event.data.threadid,
                                    proactive_id: event.data.proactive_id
                                }, '*');
                            });

                            if (event.data.msg_from !== undefined && event.data.msg_from !== "") {
                                var span = document.createElement("span");
                                //var span
                                span.innerHTML = '<span class=\"msg-header\">' + event.data.msg_from + ':</span>';
                                node.appendChild(span);
                            } else if (event.data.msg_from === undefined || event.data.msg_from == "") {
                                var span = document.createElement("span");
                                //var span
                                span.innerHTML = '<span class=\"msg-header\">New Conversation:</span>';
                                node.appendChild(span);
                            }

                            node.appendChild(textnode);
                            var height = document.getElementsByClassName('main-unreadchat-cont')[0].style.height;
                            if (height == "") {
                                height = 70;
                            }
                            if (innerDivsCount == 0) {
                                height = document.getElementsByClassName('main-unreadchat-cont')[0].style.height = "150px";
                            }
                                /* else if (innerDivsCount == 2) {
                                     height = document.getElementsByClassName('main-unreadchat-cont')[0].style.height = "150px";
                                 }
                                  else if (innerDivsCount > 2) {*/
                            else {
                                document.getElementsByClassName('main-unreadchat-cont')[0].style.height = parseInt(height) + 60 + "px";
                            }

                            var referenceNode = document.getElementById('chatunread-frame').contentWindow.document.getElementById("msg-list"); // document.querySelector('#some-element');
                            if (innerDivsCount == 0) {
                                referenceNode.appendChild(node);
                                referenceNode.appendChild(node1);
                            } else {
                                referenceNode.insertBefore(node, refChild);
                                referenceNode.insertBefore(node1, refChild);
                                if ((window.innerHeight + 100) < (document.getElementsByClassName("main-unreadchat-cont")[0].style.height)) {
                                    var frame = document.getElementById('chatunread-frame');
                                    var c = frame.contentDocument || frame.contentWindow.document;
                                    c.getElementsByTagName("body")[0].offsetHeight = '80%';
                                    c.getElementsByTagName("body")[0].style.overflow = "auto";
                                }
                            }
                            if (event.data.badge_type === 3) {
                                document.getElementsByClassName("main-unreadchat-cont")[0].style.height = "100%";
                                var frame = document.getElementById('chatunread-frame');
                                var c = frame.contentDocument || frame.contentWindow.document;
                                c.getElementsByClassName("msg")[0].style.maxHeight = "unset";
                                var frameheight = c.getElementsByTagName("body")[0].offsetHeight;
                                document.getElementsByClassName("main-unreadchat-cont")[0].style.height = frameheight + "px";
                            }
                        } else if (event.data.badge_type === 4) {
                            var fullscreen_modal = document.getElementById('imichat-fullscreen-modal');
                            fullscreen_modal.className = 'imichat-fullscreen-modal imichat-open';
                            fullscreen_modal.contentWindow.postMessage({
                                action: 'bind_data',
                                proactive_id: event.data.proactive_id,
                                threadid: event.data.threadid,
                                msg_from: event.data.msg_from,
                                msg: event.data.msg
                            }, "*");
                        }
                        cardcount = parseInt(localStorage.getItem(event.data.fingerprint + "_" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "_cardcount")) + 1;
                        localStorage.setItem(event.data.fingerprint + "_" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "_cardcount", cardcount);
                        localStorage.setItem("fingerprint", event.data.fingerprint);

                        localStorage.setItem(event.data.fingerprint + "_" + "70003df6-33d8-11ea-afcd-0610d74d64fc" + "_badgecount", count);
                        document.getElementById('imi-chatbutton').contentWindow.document.getElementById("chattotalbadge").innerText = count;
                    }

                    document.getElementById('chatunread-frame').contentWindow.document.getElementById("ancclearcards").style.display =
                        (event.data.badge_type === undefined || (event.data.badge_type === 2 || event.data.badge_type === 3)) ? "block" : "none";
                }
            } catch (e) {
                console.log("badgecount:" + e.msg);
            }
        },
        resize: function () {
            try {
                var destination = document.getElementById('divchataside').contentWindow;
                destination.postMessage({
                    action: 'resize',
                    width: window.outerWidth //window.innerWidth//screen.width // document.body.clientWidth
                }, "*");
                IMIGeneral.checkmobile();
            } catch (e) { }
        },
        LaunchProactiveMsgManager: function (domainName, callback) {
            try {
                if (!JSON.parse(localStorage.getItem("style_" + window.location.hostname)).enable_proactive) {
                    callback();
                    return;
                }
                var body = document.getElementsByTagName('body')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = domainName + '/js/proactive-msg-manager.js';
                body.appendChild(script);

                script.addEventListener('load', function (event) {
                    console.log('proactive manager loaded;');

                    var destination = document.getElementById('divchataside').contentWindow;
                    destination.postMessage({
                        action: 'proactive-manager-loaded',
                        attrkey: "70003df6-33d8-11ea-afcd-0610d74d64fc",
                        host: window.location.hostname
                    }, "*");

                    callback();
                });
            } catch (e) {
                console.log("LaunchProactiveMsgManager:" + e.msg);
            }
        },
        processAbandonedChats: function () {
            var browser_fingerprint = localStorage.getItem("fingerprint");
            var url = IMIGeneral.profileUrl() + "livechats/" + _attr_key + "/customers/" + browser_fingerprint + "/abandoned?host=" + IMIGeneral.getDomain();
            //console.log(url);
            jQuery.ajax({
                url: url,
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({
					"is_reloaded": false,
                    "is_closechat": true
				}),
                async: false,
                success: function (data) {
                    console.log('success');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Error: " + errorThrown);
                }
            });
        },
        handleAbandonedChats: function () {
            // Attach the event keypress to exclude the F5 refresh
            jQuery(window).on('keypress', function (e) {
                if (e.keyCode == 116) {
                    _IMIchat_IsValidNavigation = true;
                }
            });

            window.addEventListener("beforeunload", function (e) {
                if (_IMIchat_IsValidNavigation !==undefined && !_IMIchat_IsValidNavigation) {
                    IMIChatInit.processAbandonedChats();
                }
            });
        },
        loadJQuery: function (domainName, callback) {
            if (typeof (jQuery) !== 'undefined') {
                callback();
                return;
            }
            var body = document.getElementsByTagName('body')[0];
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = domainName + '/js/jquery-3.1.1.js';
            body.appendChild(script);
            script.addEventListener('load', function (event) {
                callback();
            });
            return;
        },
        on: function (func_name, callback) {
            if (typeof callback != 'function') {
                console.error('function was expected.');
                return;
            }

            switch (func_name) {
                case 'imichat-widget:ready':
                    _IMIchat_callback_dic['imichat-widget:ready'] = callback;
                    break;
            }
        },
        checklocalStorage: function () {
            var test = 'test';
            try {
                localStorage.setItem(test, test);
                localStorage.removeItem(test);
                return true;
            } catch (e) {
                return false;
            }
        }
    };
}();
if (IMIChatInit.checklocalStorage()) {
    IMIChatInit.init();
	
} else {
    console.log("Local storage not supported");
	document.getElementById("divicw").innerHTML = "<link rel=\"stylesheet\" href=\"" + IMIChatInit.domainName() + "/css/chat-widget.css?id=" + new Date().getTime() + "\" /><div class=\"cookie-error\"><a class=\"close-alert\" onclick=\"script:document.getElementById('divicw').style.display = 'none';\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"14\" height=\"14\" viewBox=\"0 0 14 14\"><g fill=\"#979797\" fill-rule=\"evenodd\"><path d=\"M.404.44a1.002 1.002 0 0 1 1.418 0l11.86 11.86a1.002 1.002 0 1 1-1.418 1.418L.404 1.858a1.002 1.002 0 0 1 0-1.418z\"></path>\n        <path d=\"M13.682.44a1.002 1.002 0 0 1 0 1.418l-11.86 11.86A1.002 1.002 0 1 1 .404 12.3L12.264.44a1.002 1.002 0 0 1 1.418 0z\"></path>\n    </g>\n</svg></a><img src=\"" + IMIChatInit.domainName() + "/images/cookies.svg\" class=\"cookie-img\"><span class=\"cookie-header\">Error:<br/> Cookies Disabled</span><div class=\"clearfix\"></div><p class=\"cookie-text\">We use cookies to enable best chat experience. Follow <a target=\"_blank\" href=\"https://s3-eu-west-1.amazonaws.com/live.chat/settings/Livechat+Browser+Limitation.pdf\">these directions</a> to re-enable cookies specific to your browser type or re-open this website in a cookie-enabled browser.</p></div>";
 
}
var imichatwidget = {
    // get hasInitiatedConversation() {
    //     if (sessionStorage.getItem("imichat_hasinitconvexist") == null)
    //         return false;
    //     if (sessionStorage.getItem("imichat_hasinitconvexist") == "1") {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // },
    hasInitiatedChat: function () {
        if (sessionStorage.getItem("imichat_hasinitconvexist") == null)
            return false;
        if (sessionStorage.getItem("imichat_hasinitconvexist") == "1") {
            return true;
        } else {
            return false;
        }
    },
    show: function () {
        //$("#divicw").show();return;
        document.getElementById("divicw").style.display = 'block';
    },
    hide: function () {
        // $("#divicw").hide();return;
        document.getElementById("divicw").style.display = 'none';
    },

    /* test:function()
     {
         if(sessionStorage.getItem("imichat_hasinitconvexist")==null)
         return false;
         if(sessionStorage.getItem("imichat_hasinitconvexist")=="1")
         {
         return true;
         }
         else
         {
             return false;
         }
     },*/
    maximizeWindow: function () {
        IMIChatInit.chatswitchicon(1);
        IMIChatInit.resize();
        return;
    },
    minimizeWindow: function () {
        return IMIChatInit.chatswitchicon(0);
    },
    init: function (jsondata, callback) {

        if (typeof callback != 'function') {
            console.error('function was expected.');
            return;
        }

        var destination = document.getElementById('divchataside').contentWindow;

        destination.postMessage({
            action: 'imichat_custom_chat_fields',
            data: jsondata,
            type: 'add'
        }, '*');

        _IMIchat_callback_dic['imichat-widget:custom_chat_fields_init'] = callback;

    },
    update: function (jsondata, callback) {

        if (typeof callback != 'function') {
            console.error('function was expected.');
            return;
        }

        var destination = document.getElementById('divchataside').contentWindow;
        destination.postMessage({
            action: 'imichat_custom_chat_fields',
            data: jsondata,
            type: 'update'
        }, '*');

        _IMIchat_callback_dic['imichat-widget:custom_chat_fields_update'] = callback;

    },
    on: function (func_name, callback) {
        if (typeof callback != 'function') {
            console.error('function was expected.');
            return;
        }

        switch (func_name) {
            case 'imichat-widget:ready':
                _IMIchat_callback_dic['imichat-widget:ready'] = callback;
                break;
        }
    }
};
/*
function imichatWidgetLoaded(){imi
    imichatwidget.maximizeWindow();
}*/