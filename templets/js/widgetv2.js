var _proactive_settings;
var _widget_settings;
var _attr_key;
var chatSessionThreads = [];
var proactiveChatThreads = [];
var _cur_proactive_id = 0;

/* for typing*/

var LoadSessionChats = function () {
    IMILiveChat.getChatThreadSessions();
    var widgetData = JSON.parse(localStorage.getItem("style_" + IMIGeneral.getDomain()));
    if (chatSessionThreads != null && chatSessionThreads.length > 0) {
        $("#chatthreads").html('');
        $.each(chatSessionThreads, function (key, item) {
            try {
                badgeCount = "";
                badgeCount = IMIGeneral.getLocal(localStorage.getItem("browserfingerprint") + "_" + item.threadid + "_unreadcount");
                if (badgeCount == undefined || badgeCount == null || badgeCount == "null" || badgeCount == "0") {
                    badgeCount = "<span class='badge' style='display:none;'>" + badgeCount + "</span>";
                } else {
                    badgeCount = "<span class='badge'>" + badgeCount + "</span>";
                }
                var tmpl = "<a class='thread' id='{4}' onclick='ShowChatMessages(this)' data-proactive-id='0' date-position='{7}' href=\"#\"><div class='left'><h3><span class='agent-name'>{0}</span></h3><p class=\"{6}\">{5} {1}</p></div>" +
                    "<div class='right'><span class='time'>{2}</span>{3}</div></a>";
                if (item.CHATTYPE == "MO") {
                    var motmpl = tmpl;
                    motmpl = motmpl.replace("{0}", (item.agentid == undefined || item.agentid == "" || item.agentid == null) ? 'New Conversation' : item.agentid).replace("{1}", item.msg.length > 60 ? item.msg.substr(0, 62) + "..." : item.msg).replace("{4}", item.threadid).replace("{3}", badgeCount).replace("{2}", IMIGeneral.timeDifference(item.msgdate));
                    motmpl = motmpl.replace("{5}", "You:").replace("{6}", "yourmsg").replace('{7}', item.msgdate);
                    $("#chatthreads").append(motmpl);
                } else {
                    var mttmpl = tmpl;
                    mttmpl = mttmpl.replace("{0}", (item.agentid == undefined || item.agentid == "" || item.agentid == null) ? 'New Conversation' : item.agentid).replace("{1}", item.msg.length > 75 ? item.msg.substr(0, 72) + "..." : item.msg).replace("{4}", item.threadid).replace("{3}", badgeCount).replace("{2}", IMIGeneral.timeDifference(item.msgdate));
                    mttmpl = mttmpl.replace("{5}", "").replace("{6}", "").replace('{7}', item.msgdate);
                    $("#chatthreads").append(mttmpl);
                }
            } catch (e) { }
        });
        $("#chatthreads").sortDivs();
        IMILiveChat.setWidgetbuttonStyle(true);
    } else {
        $("#chatthreads").html('');
        IMILiveChat.setWidgetbuttonStyle(false);
    }
};

var LoadPrevChats = function () {
    try {

        if (_widget_settings.showprevhist == 0) {
            LoadSessionChats();
            return;
        }
        // if (IMILiveChat.getCurrentThreadId() == null) { $('#start-chat').html("Start Conversation"); return; } commmeted this line bcz while loading after reopen browser second time threadid will not be there
        var browserfingerprint = localStorage.getItem("browserfingerprint");
        browserfingerprint = (browserfingerprint == undefined || browserfingerprint == "") ? "" : localStorage.getItem("browserfingerprint");
        var postData = "teamappid=" + IMILiveChat.clientId() + "&email=" + browserfingerprint + "&browserfingerprint=" + browserfingerprint + "&appid=" + IMILiveChat.appId() + "&threadid=" + IMILiveChat.getCurrentThreadId() + "&hostname=" + sessionStorage.getItem("parenthostname");
        var profileAPI = IMIGeneral.profileUrl() + "profile/GetChatThreads?" + postData;
        //var profileAPI = IMIGeneral.domainName() + "/Handlers/ICWUpload.ashx?action=getchatthread";
        $.ajax({
            url: profileAPI,
            type: "GET",
            data: "",
            //dataType: "jsonp",
            contentType: "text/plain",
            success: function (data) {
                var jData = $.parseJSON(data);
                var widgetData = JSON.parse(localStorage.getItem("style_" + IMIGeneral.getDomain()));
                if (jData != null && jData.length > 0) {

                    $("#chatthreads").html('');
                    var badgeCount = "";

                    $.each(jData, function (key, item) {
                        try {
                            badgeCount = "";
                            badgeCount = IMIGeneral.getLocal(localStorage.getItem("browserfingerprint") + "_" + item.FILTER + "_unreadcount");
                            if (badgeCount == undefined || badgeCount == null || badgeCount == "null" || badgeCount == "0") {
                                badgeCount = "<span class='badge' style='display:none;'>" + badgeCount + "</span>";
                            } else {
                                badgeCount = "<span class='badge'>" + badgeCount + "</span>";
                            }
                            var tmpl = "<a class='thread' id='{4}' onclick='ShowChatMessages(this)' date-position='{7}' data-proactive-id='{8}' href=\"#\"><div class='left'><h3><span class='agent-name'>{0}</span></h3><p class=\"{6}\">{5} {1}</p></div>" +
                                "<div class='right'><span class='time'>{2}</span>{3}</div></a>";

                            if (item.CHATTYPE == "MO") {
                                var motmpl = tmpl.replace("{8}", item.proactive_id);
                                motmpl = motmpl.replace("{0}", (item.AGENTID == undefined || item.AGENTID == "" || item.AGENTID == null) ? 'New Conversation' : item.AGENTID).replace("{1}", item.MSG.length > 60 ? item.MSG.substr(0, 62) + "..." : item.MSG).replace("{4}", item.FILTER).replace("{3}", badgeCount).replace("{2}", IMIGeneral.timeDifference(item.MSGDATE));
                                motmpl = motmpl.replace("{5}", "You:").replace("{6}", "yourmsg").replace('{7}', item.MSGDATE);
                                $("#chatthreads").append(motmpl);
                            } else {
                                var mttmpl = tmpl.replace("{8}", item.proactive_id);
                                mttmpl = mttmpl.replace("{0}", (item.AGENTID == undefined || item.AGENTID == "" || item.AGENTID == null) ? 'New Conversation' : item.AGENTID).replace("{1}", item.MSG.length > 75 ? item.MSG.substr(0, 72) + "..." : item.MSG).replace("{4}", item.FILTER).replace("{3}", badgeCount).replace("{2}", IMIGeneral.timeDifference(item.MSGDATE));
                                mttmpl = mttmpl.replace("{5}", "").replace("{6}", "").replace('{7}', item.MSGDATE);
                                $("#chatthreads").append(mttmpl);
                            }

                        } catch (e) { }
                    });
                    $("#chatthreads").sortDivs();
                    IMILiveChat.setWidgetbuttonStyle(true);
                } else {
                    $("#chatthreads").html('');
                    IMILiveChat.setWidgetbuttonStyle(false);
                }
            },
            error: function (jqXHR, textStatus) {
                try {
                    console.log(jqXHR);
                } catch (e) { }
            }
        });
    } catch (e) {

        //alert(e);
    }
};

(function ($) {
    $.fn.extend({
        donetyping: function (callback, timeout) {
            timeout = timeout || 1e3; // 1 second default timeout
            var timeoutReference,
                doneTyping = function (el) {
                    if (!timeoutReference)
                        return;
                    timeoutReference = null;
                    callback.call(el);
                };
            return this.each(function (i, el) {
                var $el = $(el);
                // Chrome Fix (Use keyup over keypress to detect backspace)
                // thank you @palerdot
                $el.on('keyup keypress paste', function (e) {
                    // This catches the backspace button in chrome, but also prevents
                    // the event from triggering too preemptively. Without this line,
                    // using tab/shift+tab will make the focused element fire the callback.
                    if (e.type == 'keyup' && e.keyCode != 8)
                        return;

                    // Check if timeout has been set. If it has, "reset" the clock and
                    // start over again.
                    if (timeoutReference)
                        clearTimeout(timeoutReference);
                    timeoutReference = setTimeout(function () {
                        // if we made it here, our timeout has elapsed. Fire the
                        // callback
                        doneTyping(el);
                    }, timeout);
                }).on('blur', function () {
                    // If we can, fire the event since we're leaving the field
                    doneTyping(el);
                });
            });
        }
    });
})(jQuery);
jQuery.fn.sortDivs = function sortDivs() {
    //    $("> div", this[0]).sort(dec_sort).appendTo(this[0]);

    //     function dec_sort(a, b) {
    //         return ($(b).data("position")) > ($(a).data("position")) ? 1 : -1;
    //     }

    var board = $("#chatthreads");
    var boards = board.children('.thread').detach().get();


    boards.sort(function (a, b) {
        return new Date($(b).attr('date-position')) - new Date($(a).attr('date-position'));

    });

    board.append(boards);
};

var mtcolor = '';
var mocolor = '';
var mtTcolor = '';
var moTcolor = '';
var PreChatIconColor = '';
var threadid = "";
var wcindiflag = true;
var counter = 0;
var topic = "imichat";
var lightness1;
var lightness2;
var lightness3;
var lightness4;
var lightness;
var saturation;
var hue;
var timer = null;
var IMILiveChat = function () {
    var widget_setttings = JSON.parse(localStorage.getItem("style_" + IMIGeneral.getDomain()));
    var ApplyStyles = function (msg) {
        var color = "";
        try {
            if (msg == null) return;
            $("#divloader").show();
            $("#chatwindow").hide();

            if (msg != '' && msg != undefined && msg != null) {
                try {
                    msg = $.parseJSON(msg);
                    if (msg.isforceturnoff === 1 && msg.forceturnoff_hide === 1)
                    { return; }
                    IMIGeneral.setSession("appid", msg.appid);
                    IMIGeneral.setSession("appkey", msg.clientkey);
                    localStorage.setItem(msg.appid + "_usergroup_id", msg.groupid);
                    if (msg.survey_fields.length > 0) {
                        IMIGeneral.setSession("hasprechatform", "1");
                    } else {
                        IMIGeneral.setSession("hasprechatform", "0");
                    }

                    color = msg.widgetcolor;
                    r = parseInt(color.substr(1, 2), 16);
                    g = parseInt(color.substr(3, 2), 16);
                    b = parseInt(color.substr(5, 2), 16);
                    hue = IMIGeneral.rgbToHsl(r, g, b)[0] * 360;
                    saturation = IMIGeneral.rgbToHsl(r, g, b)[1] * 100;
                    lightness = IMIGeneral.rgbToHsl(r, g, b)[2] * 100;

                    lightness1 = lightness + 5;
                    lightness2 = 95;
                    lightness3 = 99;
                    lightness4 = lightness - 10;
                    if (lightness > 80) {
                        $(".mtcolor,.mocolor,.btn-togo,.icon-tickicon,.btn-secondary").css("color", "#333333");
                        $(".btn-togo").css("-webkit-text-fill-color", "#333333");
                        PreChatIconColor = "#333333";
                        mtTcolor = "#333333";
                        moTcolor = "#333333";
                        // document.getElementsByClassName('widget-icon')[0].style.color="#333333"
                        $("#chatpageheading,#smallchatpageheading,#headerdesc,#smallheaderdesc,#aSend i,#headertypicallyrply,#addClass,#start-chat,#backicon,#minbutton,#dLabel,#btnsend").css("color", "#333333");
                        $('.editor-paperclip i,.wdt-emoji-picker i').css("color", "#333333");
                    } else {
                        $(".mtcolor,.mocolor,.btn-togo,.icon-tickicon").css("color", "#ffffff");
                        $(".btn-togo").css("-webkit-text-fill-color", "#ffffff");
                        $('.btn-secondary').css('color', color);
                        PreChatIconColor = "#ffffff";
                        mtTcolor = "#ffffff";
                        moTcolor = "#ffffff";
                        //document.getElementsByClassName('widget-icon')[0].style.color="#ffffff"
                        $("#chatpageheading,#smallchatpageheading,#headerdesc,#smallheaderdesc,#aSend i,#headertypicallyrply,#addClass,#start-chat,#backicon,#minbutton,#dLabel,#btnsend").css("color", "#ffffff");
                        $('.editor-paperclip i,.wdt-emoji-picker i').css("color", color);
                    }
                    $('#divhead1').css({
                        'background-image': 'linear-gradient(to bottom,' + color + ' 0%, hsl(' + hue + ',' + saturation + '%,' + lightness1 + '%) 100%)'
                    });
                    $('#divhead1').css({
                        'background-image': '-webkit-linear-gradient(bottom,' + color + ' 0%, hsl(' + hue + ',' + saturation + '%,' + lightness1 + '%) 100%)'
                    });
                    $(".chatwindow").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness3 + "%)");
                    $("#dLabel .dropdown-menu").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness3 + "%)");
                    $(".widgetstarticon label").css("background", color);
                    $(".mtcolor").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)");
                    mtcolor = "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)";
                    $(".mocolor").css("background", "hsl(" + hue + "," + saturation + "%," + lightness2 + "%)");
                    mocolor = "hsl(" + hue + "," + saturation + "%," + lightness2 + "%)";
                    if (msg.logo_path != null && msg.logo_path != '') {
                        $("#widgetlogo").attr("src", msg.logo_path);
                    } else {
                        $("#widgetlogo").hide();
                        $(".big").css("height", "100px");

                        $("#chatthreads").css("height", "calc(100% - 185px)");
                    }

                    $("#start-chat,.imichatwidget-body .modal-footer .btn-primary").css("background-color", color);

                    $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
                    $(".agentimage>span").css("background", mocolor);

                    //$('#aSendicon').css("background", "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)");
                    $('#aSendicon').css("background", color);
                    $('#start-chat').text(msg.buttontext);
                    $('#start-chat').attr('data-text', msg.buttontext);
                    $("#start-chat").css("background-color", color);
                    $("#start-chat").hover(function () {
                        $("#start-chat").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness4 + "%)");
                    }).mouseout(function () {
                        $("#start-chat").css("background-color", color);
                    });
                    $(".btn-togo").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)");
                    $(".widgetalerts").css("background-color", "hsl(" + hue + "," + saturation + "%," + lightness3 + "%)");
                    $(".nitesh-chat-box").css("border-top-color", "hsl(" + hue + "," + saturation + "%," + lightness1 + "%)");
                    $('#chatpageheading,#smallchatpageheading').text(msg.name);
                    $('#headerdesc,#smallheaderdescwhennotypically').text(msg.bylinetext);
                    if (msg.widget_visible_type != undefined && msg.widget_visible_type != null && msg.widget_visible_type == "2") {
                        $('.ooomsg-chat-div').css('display', 'block');
                        $('#oooMsg').text(msg.outofoffice);
                    }
                    $('#start-chat').html('');
                    if (msg.agent_avail === 0 && msg.isforceturnoff != 1) {
                        IMILiveChat.setWidgetbuttonStyle(true);
                    } else {
                        $("#headertypicallyrply").css('display', 'block');
                        IMILiveChat.setWidgetbuttonStyle(true);
                    }
                    if (msg.isemojienable == true) {
                        IMIGeneral.setSession('hdnisemojienable', '1');
                    } else {
                        IMIGeneral.setSession('hdnisemojienable', '0');
                    }
                    if (msg.isattachmentenabled == true) {
                        IMIGeneral.setSession('hdnisattachmentenable', '1');
                        $("#ico_attachment").show();
                    } else {
                        IMIGeneral.setSession('hdnisattachmentenable', '0');
                        $("#ico_attachment").hide();
                    }
                    if (msg.isbackgroundenable == true) {
                        $("#chatwindow").css('background', "url('images/web-chat-bg.svg')");
                    } else {
                        $("#chatwindow").css("background", "none !important");
                    }

                    if (msg.waittime == null || msg.waittime == undefined || msg.waittime == '') {
                        $('#typicallyrply').css('display', 'none');
                        $('#icwagenthdr').removeClass('goup');
                    } else {
                        $('#typicallyrply').text(msg[0].waittime);
                        $('#icwagenthdr').addClass('goup');
                    }
                    if (msg.wt_type_enabled) {

                        if (msg.wt_type === 1) {
                            $("#headertypicallyrply").text("Typically replies in few minutes");
                            $("#smallheaderdesc").text("Typically replies in few minutes");
                        } else if (msg.wt_type === 2) {
                            $("#headertypicallyrply").text("Typically replies in few hours");
                            $("#smallheaderdesc").text("Typically replies in few hours");
                        } else if (msg.wt_type === 3) {
                            $("#headertypicallyrply").text("Typically replies in a day");
                            $("#smallheaderdesc").text("Typically replies in a day");
                        }
                    } else {
                        $("#headertypicallyrply,#smallheaderdesc").css('display', 'none');
                        $('#smallheaderdescwhennotypically').css('display', 'block');
                    }

                } catch (ex) { }
                try {
                    pathArray = window.location.host.split('.');
                    var arrLength = pathArray.length;
                    var domainName = pathArray.slice(arrLength - 2, arrLength).join('.');
                    document.domain = domainName;
                } catch (e) { }

            } else {
                $('#start-chat').css('background-color', '');
                $('new-conversation').prop("disabled", true);
            }
            $("#divloader").hide();
            $("#chatwindow").show();
            var ismobile = '0';
            var niAgt = navigator.userAgent;
            if ((niAgt.indexOf("Mobile")) != -1) {
                ismobile = '1';
            }
            checklogo();
            IMILiveChat.hideCloseButton(0, ismobile);
            LoadPrevChats();
            ////removed code here 3.7.1 
            ////IMILiveChat.registerRTM(function () {

            console.log('widget initialized');
            ////});
            IMILiveChat.loadPlugins(color);

        } catch (e1) {
        }
        var KeyValuePair = {
            "IP": "",
            "City": "",
            "Country": ""
        };
        if (msg != null) {
            if (msg.ip_stack_data != null) {
                KeyValuePair = {
                    "IP": msg.ip_stack_data.ip,
                    "City": msg.ip_stack_data.city == null ? "" : msg.ip_stack_data.city,
                    "Country": msg.ip_stack_data.country_name == null ? "" : msg.ip_stack_data.country_name
                };
            }
        }
        IMIGeneral.storeLocal('custom-profile-params', KeyValuePair);
    };
    var CreateThread = function (type, callback) {
        var messaging = IMI.ICMessaging.getInstance();
        var createThreadCallBack = {
            onSuccess: function (thread) {
                $("#start-chat").removeAttr("disabled");
                $("#start-chat").attr("title", "");
                $("#start-chat").html("New Conversation");
                $("#start-chat").removeClass("btn-disabled");
                if (thread) {
                    threadid = thread.getId();
                    if (type == "newchat") {
                        IMILiveChat.setCurrentThreadId(threadid);
                        $("#chat").show();
                        $("#chat_submit_box").show();
                        $("#chatthreads").hide();
                        $(".new-conversation").hide();
                        $("#dLabel").show();
                        $("#backicon").show();
                        $("#icwdivcarea").html('');
                        $("#icwmsg").focus();
                        $('#opttranscript').show();
                        $('#ico_attachment').hide();
                        $('.wdt-emoji-picker').hide();
                        window.parent.postMessage({
                            key: 'imichat_hasinitconvexist',
                            value: '1',
                            action: 'setsession'
                        }, "*");
                        welcomeTextDisplay();
                    } else if (type === "proactive") {
                        if (callback !== undefined) {
                            callback(threadid);
                        }
                    } else if (type === "pre_chat") {
                        if (callback !== undefined) {
                            IMILiveChat.setCurrentThreadId(threadid);
                            $("#chat").show();
                            $("#chatthreads").hide();
                            $(".new-conversation").hide();
                            $("#dLabel").show();
                            $("#backicon").show();
                            $("#icwdivcarea").html('');
                            $("#icwmsg").focus();
                            $('#ico_attachment').hide();
                            $('.wdt-emoji-picker').hide();
                            //$('#opttranscript').show();
                            if (($('.big').is(':visible') == true) && ($('.imiwidget-clientlogo').is(':visible') == false)) {
                                $('#chat').css('height', 'calc(100% - {0}px)'.format(75));
                            } else if (($('.big').is(':visible') == true) && ($('.imiwidget-clientlogo').is(':visible') == true)) {
                                $('#chat').css('height', 'calc(100% - {0}px)'.format(120));
                            } else {
                                $('#chat').css('height', 'calc(100% - {0}px)'.format(10));
                            }
                            $("#chat_submit_box").hide();
                            callback(threadid);
                        }
                    }
                } else {
                    console.log("failed to CreateThread:");
                }
            },
            onFailure: function () {
                $("#start-chat").removeAttr("disabled");
                $("#start-chat").attr("title", "");
                $("#start-chat").html("New Conversation");
                $("#start-chat").removeClass("btn-disabled");
                $('#opttranscript').hide();
                console.log("failed to CreateThread:");
            }
        };
        var threadObj = new IMI.ICThread();
        threadObj.setTitle(IMILiveChat.newThreadName());
        threadObj.setType(IMI.ICThreadType.Conversation);
        //  console.log(threadObj);
        messaging.createThread(threadObj, createThreadCallBack);
    };
    var RegisterRTM = function (callback) {
        var config = new IMI.ICConfig(IMILiveChat.appId(), IMILiveChat.appkey());
        IMI.IMIconnect.startup(config);
        var check_register = IMIGeneral.getSession("appid") + "_REG_" + IMILiveChat.getBrowserFingerprint();
        var userId = IMILiveChat.getBrowserFingerprint();
        /*To register New user*/
        if (localStorage.getItem(check_register + "_is_rtm_registered") != 1) {
            var regcallback = {
                onSuccess: function (msg) {
                    var messaging = IMI.ICMessaging.getInstance();
                    messaging.connect();
                    CheckDisConnects();
                    localStorage.setItem(check_register + "_is_rtm_registered", 1);
                    if (callback !== undefined) {
                        callback();
                    }

                    fecthTopics();
                    //ReciveMsg();
                },
                onFailure: function (err) {
                    console.log(err);
                }
            };
            var deviceId = "";
            deviceId = IMI.ICDeviceProfile.getDefaultDeviceId();
            deviceProfile = new IMI.ICDeviceProfile(deviceId, userId);
            IMI.IMIconnect.register(deviceProfile, regcallback);
        }
            /*Already register one and check for connected or not*/
        else {
            try {
                var messaging = IMI.ICMessaging.getInstance();
                if (!messaging.isConnected()) {
                    messaging.connect();
                }
                ReciveMsg();
                CheckDisConnects();
            }
            catch (e) {
                console.log('Exception on reconnecting');
            }

            if (callback !== undefined) {
                callback();
            }
        }
    };
    var ReciveMsg = function () {
        var messaging1 = IMI.ICMessaging.getInstance();
        var icMsgRecrCallback = new IMI.ICMessagingReceiver();
        icMsgRecrCallback.onConnectionStatusChanged = function (status) {
        };
        icMsgRecrCallback.onMessageReceived = function (icMessage) {
            // console.log(icMessage.getType());
            if (icMessage.getType() === "Message") {

                try {
                    if (icMessage.extras != null && icMessage.getMessage() == "widget forceturnoff" && icMessage.extras.isfroceturnoff != undefined) {
                        if (icMessage.extras.isfroceturnoff != undefined && icMessage.extras.websiteid == _widget_settings.website_id) {

                            var websiteid = icMessage.extras.websiteid;
                            var froceturnoffmsg = icMessage.extras.froceturnoffmsg;
                            var isfroceturnoff = icMessage.extras.isfroceturnoff;
                            var publishdate = icMessage.extras.publishdate;
                            var timdiff = IMIGeneral.timeDifferenceInSeconds(publishdate);



                            // alert(timdiff);
                            if (timdiff < 30) {
                                _widget_settings.forceturnoff_message = froceturnoffmsg;
                                _widget_settings.isforceturnoff = parseInt(isfroceturnoff);

                                if (_widget_settings.isforceturnoff == 1 || _widget_settings.agent_avail === 0) {
                                    if (_widget_settings.isforceturnoff == 1) {
                                        $('#oooMsg').text(_widget_settings.forceturnoff_message);
                                        $('.ooomsg-chat-div').css('display', 'block');
                                    }

                                    // $('#chat_submit_box').css('display', 'none');
                                    $('#start-chat').html("No agents are available");
                                    $("#start-chat").attr("disabled", "disabled");
                                    $("#start-chat").addClass("btn-disabled");
                                    $("#start-chat").attr("onclick", "#");

                                }
                                else {

                                    $('.ooomsg-chat-div').css('display', 'none');
                                    $("#start-chat").removeAttr("disabled");
                                    $("#start-chat").removeClass("btn-disabled");
                                    $("#start-chat").attr("title", "");
                                    $("#start-chat").html("New Conversation");
                                    $("#start-chat").attr("onclick", "IMILiveChat.startchat()");
                                    if ($("#chat").is(':visible')) {
                                        $("#chat_submit_box").show();
                                    }
                                    //$('#oooMsg').text(msg.froceturnoffmsg);
                                }
                                if (_widget_settings.isforceturnoff != 1) {
                                    if (_widget_settings.widget_visible_type != undefined && _widget_settings.widget_visible_type != null && _widget_settings.widget_visible_type == "2") {
                                        $('.ooomsg-chat-div').css('display', 'block');
                                        $('#oooMsg').text(_widget_settings.outofoffice);
                                    }
                                }
                                //makechanges
                            }
                            return;
                        }
                    }
                }
                catch (e) { console.log("error in check topic brodcast message:" + e.message); }
            }
            // alert(icMessage.getMessage());
            // return;
            if (icMessage.extras.customtags.broadcast_info !== undefined) {
                localStorage.setItem('broadcast_info_{0}'.format(icMessage.thread.id), icMessage.extras.customtags.broadcast_info);
            }

            if (icMessage.extras != null && icMessage.extras.customtags.browserfingerprint != localStorage.getItem("browserfingerprint")) {
                console.log("diff browser id");
                return;
            }
            // console.log("onMessageReceived::histid->" + icMessage.extras.customtags.historyid + "::Transid->" + icMessage.transactionId);
            if (icMessage.thread.id == IMILiveChat.getCurrentThreadId()) {
                // console.log("read message from icMessage obj");
                //  console.log(icMessage.userId);
                //console.log(icMessage.getMessage());
                // console.log(icMessage.getMedia());
                // console.log(icMessage.getType());
                var submited_dt = IMILiveChat.convertToUTCTime(icMessage.submittedAt);
                if (icMessage.extras.ts != undefined) {
                    if (icMessage.extras.ts.trim().length > 0)
                        submited_dt = icMessage.extras.ts.trim();
                }
                if (icMessage.extras != null && icMessage.extras.customtags != null && icMessage.extras.customtags.quick_replies != null) {

                    IMILiveChat.bindQuickReplies(icMessage.extras.customtags.quick_replies, icMessage.transactionId, icMessage.extras.customtags.historyid,false, submited_dt, true);
                    return;
                }
                if (icMessage.getType() === IMI.ICMessageType.Republish) {
                    var thread = icMessage.getThread() || {};
                    if (icMessage.getMessage().indexOf("$$$$$ILOG$$$$$|") === 0) {
                        //closed
                        IMILiveChat.bindIlogMsg(icMessage.getMessage(), "MSG", true, submited_dt, true);

                    } else if (icMessage.getMessage() === "$$$$CLOSECHAT$$$$") {
                        //closed
                        IMILiveChat.bindCloseMsg("Close", "MSG", false, submited_dt);

                    } else {
                        if (icMessage.getMedia()) {
                            var html = [];
                            var media = icMessage.getMedia();
                            for (var i = 0; i < media.length; i++) {
                                var m = media[i];
                                var contentType = m.getContentType();
                                var url = m.getURL();
                                IMILiveChat.bindMT("attachment|||" + contentType + "|||" + url, IMIGeneral.getUserTimezoneDateTime(icMessage.submittedAt), icMessage.transactionId, false, icMessage.extras.customtags.agent, icMessage.extras.customtags.historyid, submited_dt, true);

                            }
                            // if ($("#dicw_" + message.getTransactionId()).length === 0) {
                            if (document.getElementById("dicw_" + icMessage.getTransactionId()) == null) {
                                IMILiveChat.bindMT(icMessage.getMessage(), IMIGeneral.getUserTimezoneDateTime(icMessage.submittedAt), icMessage.transactionId, false, icMessage.extras.customtags.agent, icMessage.extras.customtags.historyid, submited_dt, true);
                            }
                        } else {
                            //if ($("#dicw_" + message.getTransactionId()).length === 0) {
                            if (document.getElementById("dicw_" + icMessage.getTransactionId()) == null) {
                                IMILiveChat.bindMT(icMessage.getMessage(), IMIGeneral.getUserTimezoneDateTime(icMessage.submittedAt), icMessage.transactionId, false, icMessage.extras.customtags.agent, icMessage.extras.customtags.historyid, submited_dt, true);
                            }
                        }
                    }
                } else {
                    try {
                        // if (icMessage.userId == IMILiveChat.getUserId()) {
                        var agentid = icMessage.extras.customtags.agent;
                        var teamname = IMIGeneral.getSession("teamname");
                        if (icMessage.extras.customtags.teamname != null) {
                            teamname = icMessage.extras.customtags.teamname;
                        }
                        if (agentid.length > 0) {
                            if ($("#hdnicwagent").val() != agentid) {
                                IMILiveChat.bindMsg(agentid, "MSG", teamname, false, submited_dt);
                                $("#icwagenthdr").html("<span class=\"icon-headset\"></span> " + agentid);
                                $("#hdnicwagent").val(agentid);
                                $("#opttranscript").show();
                            }
                        }
                        //  }
                    } catch (e) { }
                    try {
                        if (icMessage.getMedia() != null || icMessage.getMedia() != undefined) {
                            var fileList = icMessage.getMedia();
                            for (var x = 0; x < fileList.length; x++) {
                                var fi = fileList[x];
                                IMILiveChat.bindMO("attachment|||" + fi.getContentType() + "|||" + fi.getURL(), IMIGeneral.getUserCtime(), x + icMessage.transactionId, false, icMessage.extras.customtags.agent, icMessage.extras.customtags.historyid, submited_dt, true);

                            }
                        }
                    } catch (e) { }
                    if (icMessage.getMessage().indexOf("$$$$$ILOG$$$$$|") === 0) {
                        IMILiveChat.bindIlogMsg(icMessage.getMessage(), "MSG", true, submited_dt, true);
                    } else if (icMessage.getMessage() == "$$$$$TYPING$$$$$") {
                        if (icMessage.extras.customtags.typing == "typing_on") {
                            IMILiveChat.bindTypingMO("typing_on", false);

                        }

                    } else {
                        IMILiveChat.bindMO(icMessage.getMessage(), IMIGeneral.getUserCtime(), icMessage.transactionId, false, icMessage.extras.customtags.agent, icMessage.extras.customtags.historyid, submited_dt, true);
                    }

                    var callback = {
                        onSuccess: function () {
                            //console.log("dr:success");

                        },
                        onFailure: function (errormsg) {
                            console.log("bindmtdr:failed ");
                        }

                    };
                }
                if (icMessage.getMessage() != "$$$$$TYPING$$$$$" && icMessage.getMessage().indexOf("$$$$$ILOG$$$$$|") === -1 &&
                    icMessage.getMessage() != "$$$$CLOSECHAT$$$$") {
                    IMILiveChat.updateChatThreadSessionMsg(IMILiveChat.getCurrentThreadId(), icMessage.getMessage(), icMessage.extras.customtags.agent, "MT");
                }
            } else {
                if (icMessage.getType() != IMI.ICMessageType.Republish && icMessage.getMessage().indexOf("$$$$$ILOG$$$$$|") != 0 && icMessage.getMessage() != "$$$$$TYPING$$$$$") {
                    IMILiveChat.updateChatThreadSessionMsg(icMessage.thread.id, icMessage.getMessage(), icMessage.extras.customtags.agent, "MT");
                    IMILiveChat.SetThreadCount(icMessage.thread.id);
                }
            }
            if (icMessage.getType() != IMI.ICMessageType.Republish && icMessage.getMessage().indexOf("$$$$$ILOG$$$$$|") != 0 && icMessage.getMessage() != "$$$$$TYPING$$$$$") {
                window.parent.postMessage({
                    height: 3,
                    action: 'badgecount',
                    msg: icMessage.getMessage(),
                    dt: IMIGeneral.getUserCtime(),
                    fingerprint: localStorage.getItem("browserfingerprint"),
                    msgtransid: icMessage.transactionId,
                    threadid: icMessage.thread.id,
                    msg_from: icMessage.extras.customtags.agent
                }, "*");
            }
        };
        messaging1.setICMessagingReceiver(icMsgRecrCallback);
    };
    var startTime = function () {
        if (counter == 10) {
            setTimeout(function () { $(".divtypingindicator").remove(); }, 2000);
            clearInterval(tt);
        } else {
            counter++;
        }
    };
    var onFirstMsgSent = function (is_chat_opened, status) {
        if (is_chat_opened === undefined || !is_chat_opened) {
            IMILiveChat.updateChatThreadSessionMsg(IMILiveChat.getCurrentThreadId(), sessionStorage.getItem("tempsendmsg"), "", "MO");
        }
    };
    var sendQuickreply = function (ctrl) {
        $("#sendloading").css("display", "block");
        $("#aSend").css("display", "none");
        var txtmsg = $.trim($(ctrl).text());
        try { txtmsg = $(ctrl).find("span").text(); } catch (e) { }
        if (txtmsg != '') {
            var messaging = IMI.ICMessaging.getInstance();
            var message = new IMI.ICMessage();
            message.setMessage(txtmsg);
            var thread = new IMI.ICThread();
            thread.setId(IMILiveChat.getCurrentThreadId());
            thread.setTitle(IMILiveChat.getCurrentThreadName());
            thread.setType(IMI.ICThreadType.Conversation);
            message.setThread(thread);

            try {
                var appid = IMILiveChat.clientId();
                var a = document.createElement('a');
                a.href = window.document.referrer;

                var jobj = {
                    "browserfingerprint": localStorage.getItem("browserfingerprint"),
                };
                jobj.Webpage = window.document.referrer.match(/[^\/]+$/) !== null ? window.document.referrer.match(/[^\/]+$/)[0] : '';
                jobj.Website = a.hostname;
                // var widgetsetttings = JSON.parse(localStorage.getItem("style_" + IMIGeneral.getDomain()));
                var msg_left_length = $("#icwdivcarea div[class*='chat_message_left']").length;
                var msg_right_length = $("#icwdivcarea div[class*='chat_message_right']").length;
                if ((msg_left_length == 0 && msg_right_length == 0) ||
                    (msg_left_length == 1 && msg_right_length == 0)) {
                    jobj.customprofileparams = IMIGeneral.getLocal('custom-profile-params');
                }
                if ((msg_left_length == 0 && msg_right_length == 0) || (msg_left_length == 1 && msg_right_length == 0)) {
                    jobj.hasprechatform = IMIGeneral.getSession("hasprechatform");
                    jobj["Initiated from URL"] = window.document.referrer;
                    jobj.initiatedon = window.document.referrer.match(/[^\/]+$/) !== null ? window.document.referrer.match(/[^\/]+$/)[0] : '';
                    jobj.website_id = _widget_settings.website_id;
                    jobj["Browser language"] = (navigator.language || navigator.userLanguage);
                }
                var requestid = $(ctrl).parents("span.quickreplymsg").parent().attr("data-requestid");
                var quick_reply_response = { "request_identifier": requestid }
                quick_reply_response.options = [{ "title": txtmsg }]
                jobj.quick_reply_response = JSON.stringify(quick_reply_response);
                message.setExtras(jobj);
                //console.log(message);                
            } catch (e) {
                console.log(e.message);
            }

            var callback = {
                onSuccess: function (msg, resp_obj) {
                    $('#chat_submit_box').show();
                    try {
                        $('.submit_message').css('height', '100%');
                        calcchatheight();
                    } catch (c) { }

                    $(ctrl).parents("span.quickreplymsg").parent().remove();
                    localStorage.setItem(IMILiveChat.getCurrentThreadId() + "_quickreply", false);
                    $('#chat_submit_box').show();
                    $("#aSend").css('display', 'table');
                    $("#sendloading").css("display", "none");
                    $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
                    if ($("#icwdivcarea").text() == "" && IMIGeneral.getSession("hasprechatform") != "1") {
                        IMILiveChat.addChatThreadSession(IMILiveChat.getCurrentThreadId(), txtmsg, "", "MO");
                    }

                    var submited_dt = IMILiveChat.getCurrentUTCdate();
                    if (resp_obj != undefined && resp_obj.created_on != undefined) {
                        submited_dt = resp_obj.created_on.replace('T', ' ').replace('Z', '');
                    }
                    IMILiveChat.bindMT(txtmsg, IMIGeneral.getUserCtime(), new Date().getTime(), false, '', new Date().getTime(), submited_dt,true);

                    $("#icwmsg").val("");
                    wcindiflag = true;
                    if (localStorage.getItem('repeat_customer') === null) {
                        localStorage.setItem('repeat_customer', true);
                        window.parent.postMessage({
                            action: "repeat_customer",
                            repeat_customer: true
                        }, "*");
                    }
                    $("#icwmsg").keyup();
                    onFirstMsgSent();

                    if ($('#icwdivcarea').is(':visible') && !$('#ico_attachment').is(':visible')) {

                        $('#chat_submit_box').show();

                        if (IMIGeneral.getSession('hdnisemojienable') == "1") {
                            $(".wdt-emoji-picker").css("display", "block");
                        } else {
                            $(".wdt-emoji-picker").css("display", "none");
                        }
                        if (IMIGeneral.getSession('hdnisattachmentenable') == "1") {
                            $('#ico_attachment').show();
                        } else {
                            $('#ico_attachment').hide();
                        }
                        $('#icwmsg').focus();
                    }
                },
                onFailure: function (errormsg) {
                    $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
                    $("#icweMsg").html("failed to send message");
                    console.log("failed to send message");
                    console.log(errormsg);
                    $("#aSend").css('display', 'table');
                    $("#sendloading").css("display", "none");
                }

            };
            // console.log(messaging.isConnected());
            // console.log("message:" + txtmsg);
            // console.log(message);
            //console.log(message);
            if (message.extras == undefined) {
                $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
                $("#icweMsg").html("failed to send message");
                $("#aSend").css('display', 'table');
                $("#sendloading").css("display", "none");
                return;
            }
            clearTimeout(timer);
            messaging.publishMessage(message, callback);
        } else {
            $("#icweMsg").html("failed to send message");
        }

    };
    var SendMessage = function () {
        if ($.trim($("#icwmsg").val()) == "") {
            $("#icweMsg").html("Please enter message");
            return;
        } else {
            $("#icweMsg").html("");
        }
        $("#sendloading").css("display", "block");
        $("#aSend").css("display", "none");

        validDomain = "true";
        sessionStorage.setItem("tempsendmsg", $("#icwmsg").val().trim());
        $("#icwmsg").val("");
        var txtmsg = sessionStorage.getItem("tempsendmsg");
        if (txtmsg != '') {
            var messaging = IMI.ICMessaging.getInstance();
            var message = new IMI.ICMessage();
            message.setMessage(txtmsg);
            var thread = new IMI.ICThread();
            thread.setId(IMILiveChat.getCurrentThreadId());
            thread.setTitle(IMILiveChat.getCurrentThreadName());
            thread.setType(IMI.ICThreadType.Conversation);
            message.setThread(thread);

            try {
                var appid = IMILiveChat.clientId();
                var a = document.createElement('a');
                a.href = window.document.referrer;

                var jobj = {
                    "browserfingerprint": localStorage.getItem("browserfingerprint"),
                    "proactive_id": _cur_proactive_id
                };

                ////jobj.Webpage = window.document.referrer.match(/[^\/]+$/) !== null ? window.document.referrer.match(/[^\/]+$/)[0] : '';
                jobj.Webpage = document.URL !== null ? document.URL : '';
                jobj.Website = a.hostname;
                // var widgetsetttings = JSON.parse(localStorage.getItem("style_" + IMIGeneral.getDomain()));
                var msg_left_length = $("#icwdivcarea div[class*='chat_message_left']").length;
                var msg_right_length = $("#icwdivcarea div[class*='chat_message_right']").length;
                if ((msg_left_length == 0 && msg_right_length == 0) ||
                    (msg_left_length == 1 && msg_right_length == 0)) {
                    jobj.customprofileparams = IMIGeneral.getLocal('custom-profile-params');
                }
                if ((msg_left_length == 0 && msg_right_length == 0) || (msg_left_length == 1 && msg_right_length == 0)) {
                    jobj.hasprechatform = IMIGeneral.getSession("hasprechatform");
                    jobj["Initiated from URL"] = window.document.referrer;
                    jobj.initiatedon = window.document.referrer.match(/[^\/]+$/) !== null ? window.document.referrer.match(/[^\/]+$/)[0] : '';
                    jobj.website_id = _widget_settings.website_id;
                    jobj["Browser language"] = (navigator.language || navigator.userLanguage);
                    if (IMILiveChat.getChatCustomFeilds()) {
                        jobj.custom_chat_attr = IMILiveChat.getChatCustomFeilds();
                    }
                }

                message.setExtras(jobj);
                //console.log(message);                
            } catch (e) {
                console.log(e.message);
            }

            var callback = {
                onSuccess: function (msg, resp_obj) {
                    // console.log("message sent");
                    try {
                        $('.submit_message').css('height', '100%');
                        calcchatheight();
                    } catch (c) { }

                    $("#aSend").css('display', 'table');
                    $("#sendloading").css("display", "none");
                    $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
                    if ($("#icwdivcarea").text() == "" && IMIGeneral.getSession("hasprechatform") != "1") {
                        IMILiveChat.addChatThreadSession(IMILiveChat.getCurrentThreadId(), txtmsg, "", "MO");
                    }
                    var submited_dt = IMILiveChat.getCurrentUTCdate();
                    if (resp_obj != undefined && resp_obj.created_on != undefined) {
                        submited_dt = resp_obj.created_on.replace('T', ' ').replace('Z', '');
                    }
                    IMILiveChat.bindMT(txtmsg, IMIGeneral.getUserCtime(), new Date().getTime(), false, '', new Date().getTime(), submited_dt,true);

                    $("#icwmsg").val("");
                    wcindiflag = true;
                    if (localStorage.getItem('repeat_customer') === null) {
                        localStorage.setItem('repeat_customer', true);
                        window.parent.postMessage({
                            action: "repeat_customer",
                            repeat_customer: true
                        }, "*");
                    }
                    $("#icwmsg").keyup();
                    onFirstMsgSent();

                    if ($('#icwdivcarea').is(':visible') && !$('#ico_attachment').is(':visible')) {

                        $('#chat_submit_box').show();
                        // $('#ico_attachment').show(); 

                        if (IMIGeneral.getSession('hdnisemojienable') == "1") {
                            $(".wdt-emoji-picker").css("display", "block");
                        } else {
                            $(".wdt-emoji-picker").css("display", "none");
                        }
                        if (IMIGeneral.getSession('hdnisattachmentenable') == "1") {
                            $('#ico_attachment').show();
                        } else {
                            $('#ico_attachment').hide();
                        }
                        $('#icwmsg').focus();
                    }
                },
                onFailure: function (errormsg) {
                    $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
                    $("#icweMsg").html("failed to send message");
                    console.log("failed to send message");
                    console.log(errormsg);
                    $("#aSend").css('display', 'table');
                    $("#sendloading").css("display", "none");
                }

            };
            // console.log(messaging.isConnected());
            // console.log("message:" + txtmsg);
            // console.log(message);
            //console.log(message);
            if (message.extras == undefined) {
                $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
                $("#icweMsg").html("failed to send message");
                $("#aSend").css('display', 'table');
                $("#sendloading").css("display", "none");
                return;
            }
            clearTimeout(timer);
            messaging.publishMessage(message, callback);
        } else {
            $("#icweMsg").html("failed to send message");
        }

    };
    var SendFile = function (url, type) {

        //  if ($.trim($("#icwmsg").val()) == "") { $("#icweMsg").html("Please enter message"); return; } else { $("#icweMsg").html(""); }
        var messaging = IMI.ICMessaging.getInstance();
        //  console.log(messaging);
        var message = new IMI.ICMessage();
        // message.setMessage("attachment");
        var attachements = [];
        var media = new IMI.ICMediaFile();
        media.contentType = type;
        media.url = url;
        attachements.push(media);
        //message.setMedia = attachements;
        message.setMedia(attachements);
        //  message.setTopic(IMILiveChat.getTopic());

        var thread = new IMI.ICThread();
        thread.setId(IMILiveChat.getCurrentThreadId());
        thread.setTitle(IMILiveChat.getCurrentThreadName());
        thread.setType(IMI.ICThreadType.Conversation);
        message.setThread(thread);

        var callback = {
            onSuccess: function (msg, resp_obj) {
                var submited_dt = IMILiveChat.getCurrentUTCdate();
                if (resp_obj != undefined && resp_obj.created_on != undefined) {
                    submited_dt = resp_obj.created_on.replace('T', ' ').replace('Z', '');
                }

                // console.log("message sent");
                IMILiveChat.bindMT("attachment|||" + type + "|||" + url, IMIGeneral.getUserCtime(), new Date().getTime(), false, '', new Date().getTime(), submited_dt,true);
                $("#icwmsg").val("");
                $("#icweMsg").html("");
            },
            onFailure: function (errormsg) {
                $("#icweMsg").html("failed to send message");
                console.log("failed to send message");
                console.log(errormsg);
            }

        };
        //g(messaging.isConnected());
        try {
            var appid = IMILiveChat.clientId();
            var a = document.createElement('a');
            a.href = window.document.referrer;

            var jobj = {
                // "name": IMIGeneral.getSession(appid + "_name"),
                //"Webpage": window.document.referrer.match(/[^\/]+$/)!==null?  window.document.referrer.match(/[^\/]+$/)[0]:'';,
                //"Website": a.hostname,
                // "mobileno": IMIGeneral.getSession(appid + "_mobile"),
                //"emailid": IMIGeneral.getSession(appid + "_email"),
                "browserfingerprint": localStorage.getItem("browserfingerprint"),
                // "customprofileparams": IMIGeneral.getLocal('custom-profile-params'),
                // "hasprechatform": IMIGeneral.getSession("hasprechatform"),
                //"website_id": widget_setttings.website_id

            };
            jobj.Webpage = window.document.referrer.match(/[^\/]+$/) !== null ? window.document.referrer.match(/[^\/]+$/)[0] : '';
            jobj.Website = a.hostname;
            //var widgetsetttings = JSON.parse(localStorage.getItem("style_" + IMIGeneral.getDomain()));
            if ($("#icwdivcarea").html() == '') {
                jobj.customprofileparams = IMIGeneral.getLocal('custom-profile-params');
                jobj.hasprechatform = IMIGeneral.getSession("hasprechatform");
                jobj["Initiated from URL"] = window.document.referrer;
                jobj.initiatedon = window.document.referrer.match(/[^\/]+$/) !== null ? window.document.referrer.match(/[^\/]+$/)[0] : '';
                jobj.website_id = _widget_settings.website_id;
                jobj["Browser language"] = (navigator.language || navigator.userLanguage);
            }
            message.setExtras(jobj);
            // console.log(message);
        } catch (e) {
            console.log(e.message);
        }
        if (message.extras == undefined) {
            $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
            $("#icweMsg").html("failed to send message");

            return;
        }
        messaging.publishMessage(message, callback);
    };
    var Confirm = function () {
        try {
            $("#divmodalbody").html('');
            $("#divmodalbody").append("<p>Are you sure you want to end this chat?</p>");
            $("#divtscriptfooter").css("display", "block");
            $('#emailtranscript').modal();

        } catch (e) { }
    };
    var CloseChat = function () {
        try {
            $("#start-chat").removeAttr("disabled");
            $("#start-chat").removeClass("btn-disabled");
            $("#start-chat").attr("title", "");
            $("#start-chat").html("New Conversation");
            $('#emailtranscript').modal('hide');
            if ($(".wdt-emoji-picker").hasClass("wdt-emoji-picker-open")) {
                $(".wdt-emoji-picker").removeClass("wdt-emoji-picker-open");
                $(".wdt-emoji-popup").removeClass("open");
                $(".icon-happy").removeClass("active");
                $(".error").html("");
            }
            $('.submit_message').css('height', '100%');
            headerscrollforme();
            calcchatheight();

        } catch (y) { }
        var messaging = IMI.ICMessaging.getInstance();
        // console.log(messaging);
        var message = new IMI.ICMessage();
        message.setMessage("$$$$CLOSECHAT$$$$");

        //message.setTopic(IMILiveChat.getTopic());
        var thread = new IMI.ICThread();
        thread.setId(IMILiveChat.getCurrentThreadId());
        thread.setTitle(IMILiveChat.getCurrentThreadName());
        // thread.setStreamName(IMILiveChat.getTopic());
        thread.setType(IMI.ICThreadType.Conversation);
        message.setThread(thread);
        var jobj = {
            "browserfingerprint": localStorage.getItem("browserfingerprint"),
        };
        message.setExtras(jobj);

        var callback = {
            onSuccess: function (msg, resp_obj) {
                clearSurveyTimer();
                var lcStyle = IMIGeneral.getLocal("style_" + IMIGeneral.getDomain());
                lcStyle = $.parseJSON(lcStyle);
                $("#chatpageheading,#smallchatpageheading").text(lcStyle.name);
                var submited_dt = IMILiveChat.getCurrentUTCdate();
                if (resp_obj != undefined && resp_obj.created_on != undefined) {
                    submited_dt = resp_obj.created_on.replace('T', ' ').replace('Z', '');
                }

                //console.log("close message sent");
                IMILiveChat.bindMT($("#icwmsg").val(), IMIGeneral.getUserCtime(), new Date().getTime(), false, '', new Date().getTime(), submited_dt,true);
                $('#hdnicwagent').val('');
                $("#icwmsg").val("");
                $(".error").html("");
                IMILiveChat.setCurrentThreadId(''); //3.7.1 
                LoadPrevChats();
                $("#chat").hide();
                $("#chat_submit_box").hide();
                $("#chatthreads").show();
                $("#new-conversation").show();
                $("#dLabel").hide();
                $("#backicon").hide();
                checklogo();
                /*
                 //var startbuttontext = IMILiveChat.getSession("buttontext");
                 $("#start-chat").text($('#start-chat').attr('data-text'));
                 IMILiveChat.clearSession();
                 sessionStorage.setItem("data-bind", IMILiveChat.getQueryString(location.href, "id"));
                 sessionStorage.setItem("data-org", IMILiveChat.getQueryString(location.href, "org"));
                 $('.chatwindow2').fadeToggle(200, 'linear');
                 $('.open-btn').addClass('close-btn');
                 $('.chatwindow1').show();
                 $('.chatwindow2').hide();
                 $("#addClass").addClass('state1');
                 $("#addClass").removeClass('state2');
     
                 IMILiveChat.deleteCookie(IMILiveChat.clientId() + "_username");
                 IMILiveChat.deleteCookie(IMILiveChat.clientId() + "_email");
                 IMILiveChat.deleteCookie(IMILiveChat.clientId() + "_mobno");*/

            },
            onFailure: function (errormsg) {
                console.log("failed to close chat");
                console.log(errormsg);
                //var startbuttontext = IMILiveChat.getSession("buttontext");
                $("#start-chat").text($('#start-chat').attr('data-text'));
            }
        };
        if (message.extras == undefined) {
            console.log("failed to close chat");
            $("#start-chat").text($('#start-chat').attr('data-text'));
            return;
        }
        //   console.log(messaging.isConnected());
        messaging.publishMessage(message, callback);
    };
    var GetWCPreviousHistory = function () {
        try {
            // 

            $('#icwdivcarea').append('<div class="convwindowloader"><img src="images/wcindicator.gif"></div>');
            IMILiveChat.setWidgetbuttonStyle();
            var browserfingerprint = localStorage.getItem("browserfingerprint");
            browserfingerprint = (browserfingerprint == undefined || browserfingerprint == "") ? "" : localStorage.getItem("browserfingerprint");
            var postData = "teamappid=" + IMILiveChat.clientId() + "&email=" + browserfingerprint + "&browserfingerprint=" + browserfingerprint + "&appid=" + IMILiveChat.appId() + "&threadid=" + IMILiveChat.getCurrentThreadId() + "&proactive_id=" + _cur_proactive_id;

            var validateAPI = IMIGeneral.profileUrl() + "profile/GetPreviousChatHistory?" + postData;
            $.ajax({
                url: validateAPI,
                type: "GET",
                data: {},
                success: function (data) {
                    IMILiveChat.setWidgetbuttonStyle();
                    if (data != null && data.length > 0) {
                        IMIGeneral.storeLocal(localStorage.getItem("browserfingerprint") + "_" + IMILiveChat.getCurrentThreadId() + "_unreadcount", 0);
                        var status = '0';
                        data = $.parseJSON(data);
                        $.each(data, function (key) {
                            try {
                                var message = data[key];
                               // console.log("GetWCPreviousHistory::histid->" + message.HISTORYID + "::Transid->" + message.TRANSACTIONID);
                                if ($("div[data-hist='" + message.HISTORYID + "']").length == 0) {
                                    status = message.status;
                                    if (message.ALIASFILTER == localStorage.getItem("browserfingerprint")) {
                                        if (message.CHATTYPE == "MO") {
                                            if (message.CONTENTTYPE != "" && message.PATH != "") {
                                                IMILiveChat.bindMT("attachment|||" + message.CONTENTTYPE + "|||" + message.PATH, IMIGeneral.getUserTimezoneDateTime(message.DATE_CREATE), message.TRANSACTIONID, false, message.fullname, message.HISTORYID, message.date_arrival.replace('T', ' '));
                                            }
                                            IMILiveChat.bindMT(message.MSG, IMIGeneral.getUserTimezoneDateTime(message.DATE_CREATE), message.TRANSACTIONID, false, message.fullname, message.HISTORYID, message.date_arrival.replace('T', ' '));
                                        }
                                        if (message.CHATTYPE == "MT" || message.CHATTYPE == "OO" || message.CHATTYPE == "AR") {
                                            if (message.ACTION_TEMPLATE_ID == "9" && message.MSG_JSON != null) {
                                                var found = data.filter(function (item) { return item.CHATTYPE === 'MO' && item.REQUEST_IDENTIFIER == message.REQUEST_IDENTIFIER; });
                                                if (found[0] == undefined) {
                                                    IMILiveChat.bindQuickReplies($.parseJSON(message.MSG_JSON), message.TRANSACTIONID, message.historyid, false,message.date_arrival.replace('T', ' '));
                                                }
                                            }
                                            else {
                                                if (message.CONTENTTYPE != "" && message.PATH != "") {
                                                    IMILiveChat.bindMO("attachment|||" + message.CONTENTTYPE + "|||" + message.PATH, IMIGeneral.getUserTimezoneDateTime(message.DATE_CREATE), message.TRANSACTIONID, false, message.fullname, message.HISTORYID, message.date_arrival.replace('T', ' '));
                                                }
                                                IMILiveChat.bindMO(message.MSG, IMIGeneral.getUserTimezoneDateTime(message.DATE_CREATE), message.TRANSACTIONID, false, message.fullname, message.HISTORYID, message.date_arrival.replace('T', ' '));
                                            }
                                        }
                                        if (message.CHATTYPE == "ILOG") {
                                            // if (message.CONTENTTYPE != "" && message.PATH != "") {
                                            IMILiveChat.bindIlogMsg(message.MSG, IMIGeneral.getUserTimezoneDateTime(message.DATE_CREATE), false, message.date_arrival.replace('T', ' '));
                                            // IMILiveChat.bindMO("attachment|||" + message.CONTENTTYPE + "|||" + message.PATH, IMILiveChat.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                            // }
                                            //IMILiveChat.bindMO(message.MSG, IMILiveChat.getUserTimezoneDateTime(message.DATE_CREATE), message.HISTORYID, false);
                                        }
                                    }
                                }
                            } catch (e) { }
                        });
                        //
                        if (status < 6) {
                            onFirstMsgSent(true, status);
                        }
                        //IMILiveChat.setWidgetbuttonStyle();
                        $(".convwindowloader").remove();
                        if (localStorage.getItem(IMILiveChat.getCurrentThreadId() + "_quickreply") == true) {
                            $("#chat_submit_box").hide();
                        }
                        return;
                    }

                    if ($(".convwindowloader").length > 0) { $(".convwindowloader").remove(); }

                    IMILiveChat.getChatThreadSessions();
                    var current_thread = chatSessionThreads.filter(function (x) {
                        return x.threadid === IMILiveChat.getCurrentThreadId();
                    })[0];

                    if (current_thread !== undefined) {
                        IMILiveChat.bindMT(current_thread.msg, IMIGeneral.getUserTimezoneDateTime(current_thread.msgdate), '', false, current_thread.agentid, new Date().getTime(), message.DATE_CREATE);
                    }
                    if (localStorage.getItem(IMILiveChat.getCurrentThreadId() + "_quickreply") == true) {
                        $("#chat_submit_box").hide();
                    }

                },
                error: function (data) {
                    console.log(data);
                    $(".convwindowloader").remove();
                    ////alert(data);
                    return data;
                }

            });
        } catch (e) { }
    };
    var GetStyles = function (attrkey, hostname) {
        try {
            var cmsg = '';
            if ((localStorage.getItem("settings_refresh_timeout") === undefined || localStorage.getItem("settings_refresh_timeout") === null || isNaN(parseInt(localStorage.getItem("settings_refresh_timeout"))) || IMIGeneral.ticks() > parseInt(localStorage.getItem("settings_refresh_timeout"))) || localStorage.getItem("style_" + IMIGeneral.getDomain()) === null) {
                _attr_key = attrkey;
                localStorage.setItem('service_key', "3f64052c-30c3-11ea-afcd-0610d74d64fc");
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        cmsg = this.responseText;
                        if (cmsg != "null") {
                            BindWidgetSettings(cmsg, attrkey, hostname);
                            if (_widget_settings.isemojienable) {
                                IMILiveChat.GetEmojis();
                            }
                            else {
                                $('#ico_emoji').hide();
                            }
                        }
                    }
                };
                var url = IMIGeneral.profileUrl() + "livechats/" + attrkey + "/settings?host=" + hostname + "&$callback=?";
                xhttp.open("GET", url, true);
                xhttp.send();
            }
            else {
                cmsg = localStorage.getItem("style_" + IMIGeneral.getDomain());
                if (cmsg != null) {
                    BindWidgetSettings(cmsg, attrkey, hostname);
                    GetWidgetAccessbility(function () {
                        if (_widget_settings.isforceturnoff === 1 || _widget_settings.agent_avail === 0) {
                            if (_widget_settings.isforceturnoff === 1) {
                                $('#oooMsg').text(_widget_settings.forceturnoff_message);
                                $('.ooomsg-chat-div').css('display', 'block');
                            }
                            $('#start-chat').html("No agents are available");
                            $("#start-chat").attr("disabled", "disabled");
                            $("#start-chat").addClass("btn-disabled");
                            $("#start-chat").attr("onclick", "#");
                            return;
                        }
                        else {
                            $('.ooomsg-chat-div').css('display', 'none');
                            $("#start-chat").removeAttr("disabled");
                            $("#start-chat").removeClass("btn-disabled");
                            $("#start-chat").attr("title", "");
                            $("#start-chat").html("New Conversation");
                            $("#start-chat").attr("onclick", "IMILiveChat.startchat()");
                            if ($("#chat").is(':visible')) {
                                $("#chat_submit_box").show();
                            }
                        }
                        if (_widget_settings.isforceturnoff != 1) {
                            if (_widget_settings.widget_visible_type != undefined && _widget_settings.widget_visible_type != null && _widget_settings.widget_visible_type == "2") {
                                $('.ooomsg-chat-div').css('display', 'block');
                                $('#oooMsg').text(_widget_settings.outofoffice);
                            }
                        }
                        if (localStorage.getItem(widget_setttings.appid + "_" + _widget_settings.groupid + "_emojis") != null) {
                            var emojidata = localStorage.getItem(widget_setttings.appid + "_" + _widget_settings.groupid + "_emojis");
                            ////emojidata = JSON.parse(emojidata);
                            ////for (i = 0; i < emojidata.length; i++) {
                            ////    $(".emoji-content").append("<span id=" + emojidata[i].ID + " alt=" + emojidata[i].SYMBOL + " title=" + emojidata[i].DESCRIPTION + " onclick=\"IMILiveChat.sendemoji('" + emojidata[i].SYMBOL + "')\">" + emojidata[i].SYMBOL + "</span>")
                            ////}
                            IMILiveChat.bindemoji(emojidata, widget_setttings);
                        }

                    });
                }
            }
        } catch (e) {
            console.log(e.msg);
        }
    };
    var GetWidgetAccessbility = function (callback) {
        try {
            hostname = sessionStorage.getItem("parenthostname");
            attrkey = localStorage.getItem('service_key');
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var cmsg = this.responseText;
                    if (cmsg != "null") {
                        var _ws_accessibiltiy = JSON.parse(cmsg);
                        _widget_settings.outofoffice = _ws_accessibiltiy.outofoffice;
                        _widget_settings.agent_avail = _ws_accessibiltiy.agent_avail;
                        _widget_settings.isforceturnoff = _ws_accessibiltiy.isforceturnoff;
                        _widget_settings.forceturnoff_hide = _ws_accessibiltiy.forceturnoff_hide;
                        _widget_settings.forceturnoff_message = _ws_accessibiltiy.forceturnoff_message;
                        _widget_settings.widget_visible_type = _ws_accessibiltiy.widget_visible_type;
                        if (_ws_accessibiltiy.agent_avail === 0) {
                            $("#chat_submit_box").hide();
                        }
                        callback();
                    }
                }
            };
            var url = IMIGeneral.profileUrl() + "livechats/" + attrkey + "/settings/accessibility?host=" + hostname + "&$callback=?";
            xhttp.open("GET", url, true);
            xhttp.send();
        } catch (e) {
            console.log(e.msg);
        }
    };
    var setwcindicator_old = function (sender_action) {
        try {
            if ($.trim($("#icwmsg").val()) == "") {
                return;
            }
            var postData = "hostname=" + IMIGeneral.getDomain() + "&teamappid=" + IMILiveChat.clientId() + "&browserfingerprint=" + localStorage.getItem("browserfingerprint") + "&istyping=" + sender_action + "&appid=" + IMILiveChat.appId() + "&threadid=" + IMILiveChat.getCurrentThreadId();
            var validateAPI = IMIGeneral.profileUrl() + "profile/GetTypingIndicator?" + postData + "&$callback=?";
            $.ajax({
                url: validateAPI,
                type: "POST",
                data: {},
                dataType: "jsonp",
                jsonp: "$callback",
                success: function (data) {
                    // console.log("sending typing indicator success:" + data);
                    //return data;
                },
                error: function (data) {
                    console.log(data);
                    //alert(data);
                    return data;
                }

            });
        } catch (e) { }
    };
    var chattranscriptmail = function () {
        try {
            var browserfingerprint = localStorage.getItem("browserfingerprint");
            browserfingerprint = (browserfingerprint == undefined || browserfingerprint == "") ? "" : localStorage.getItem("browserfingerprint");
            // var postData = "teamappid=" +localStorage.getItem("data-bind") + "&email=" + browserfingerprint + "&browserfingerprint=" + browserfingerprint + "&appid=" +localStorage.getItem("data-bind")  ;//+ "&threadid=" + IMILiveChat.getThreadid();
            // var postData = "teamappid=" + IMILiveChat.clientId() + "&email=" + browserfingerprint + "&browserfingerprint=" + browserfingerprint + "&appid=" + IMILiveChat.appId() + "&threadid=" + IMILiveChat.getCurrentThreadId();
            var emailName = IMILiveChat.getCurrentThreadId() + "_Email";
            var email = localStorage.getItem('email-id-{0}'.format(IMILiveChat.getCurrentThreadId()));

            var profileAPI = IMIGeneral.profileUrl() + "profile/ChatTranscript?teamappid=" + IMILiveChat.appId() +
                "&email=" + email +
                "&transcriptemail=" + email +
                "&emailname=" + emailName +
                "&emailvalue=" + email +
                "&threadid=" + IMILiveChat.getCurrentThreadId() +
                "&aliasfilter=" + browserfingerprint +
                "&chattranscript=?";

            //console.log(profileAPI);

            $.ajax({
                url: profileAPI,
                type: "POST",
                data: {},
                dataType: "jsonp",
                contentType: "text/plain",
                async: false,
                success: function (data) {
                    //console.log("success:" + data);
                    //return data;
                },
                error: function (jqXHR, textStatus) {
                    try {
                        console.log(jqXHR);
                        //alert(data);
                    } catch (e) { }
                }
            });
        } catch (e) { }
    };
    var setwcindicator = function (sender_action) {
        var txtmsg = $("#icwmsg").val().trim();
        if (txtmsg != '') {
            var messaging = IMI.ICMessaging.getInstance();
            var message = new IMI.ICMessage();
            message.setMessage("typing_indicator");
            var thread = new IMI.ICThread();
            thread.setId(IMILiveChat.getCurrentThreadId());
            thread.setTitle(IMILiveChat.getCurrentThreadName());

            if (sender_action.toLowerCase() == 'typing_on') {
                thread.setType("TypingStart");
                //// message.setPayloadtype("typingStart");
            }

            if (sender_action.toLowerCase() == 'typing_off') {
                thread.setType("TypingStop");
                //// message.setPayloadtype("typingStop");
            }
            message.setThread(thread);

            try {
                var appid = IMILiveChat.clientId();
                var a = document.createElement('a');
                a.href = window.document.referrer;
                var jobj = {
                    "browserfingerprint": localStorage.getItem("browserfingerprint"),
                    "broadcast_info": localStorage.getItem('broadcast_info_{0}'.format(IMILiveChat.getCurrentThreadId()))
                };
                jobj.Webpage = window.document.referrer.match(/[^\/]+$/) !== null ? window.document.referrer.match(/[^\/]+$/)[0] : '';
                jobj.Website = a.hostname;
                message.setExtras(jobj);
            } catch (e) {
                console.log(e.message);
            }

            var callback = {
                onSuccess: function (msg) {
                },
                onFailure: function (errormsg) {
                    // $("#icwmsg").val(sessionStorage.getItem("tempsendmsg"));
                    // $("#icweMsg").html("failed to send message");
                    console.log("failed to send message");
                    console.log(errormsg);
                    // $("#aSend").css('display', 'table');
                    // $("#sendloading").css("display", "none");
                }
            };
            messaging.publishMessage(message, callback);
        } else {
            $("#icweMsg").html("");
        }
    };
    var fecthTopics = function () {
        var messaging = IMI.ICMessaging.getInstance();
        var topicCallback = {
            onSuccess: function (topics) {
                var html = [];
                var flag = false;
                html.push("<option value=''></option>");
                if (topics && topics.length > 0) {
                    for (var stInd = 0; stInd < topics.length; stInd++) {
                        var strObj = topics[stInd];
                        if (strObj.getName() == "imichat") {
                            flag = true;
                            subscribeTopic(strObj.getId());
                        }
                    }
                }
                if (!flag) {
                    ReciveMsg();
                    console.log("error to get topics");
                }
            },
            onFailure: function (error) {
                console.log("failed to get topics:");
            }
        };
        try {
            messaging.fetchTopics(0, topicCallback);
        } catch (error) {
            //alert("Failed to fetch " + (error.description || ""));
        }
    };
    var subscribeTopic = function (topicId) {
        var messaging = IMI.ICMessaging.getInstance();
        var subscribeCallback = {
            onSuccess: function (substatus) {
                ReciveMsg();
                //alert("User successfully subcribed to a topic.");
            },
            onFailure: function (error) {
                // alert("Failed  subcribed to a topic.");
                //  handleFailure(error);
            }

        };
        try {
            messaging.subscribeTopic(topicId, subscribeCallback);
        } catch (error) {
            // alert("Failed to subscribeTopic " + (error.description || ""));

        }
    };
    var SetWidgetbuttonStyle = function (hasChats) {


        if (_widget_settings.agent_avail === 0 || _widget_settings.isforceturnoff == 1) {
            if (_widget_settings.isforceturnoff == 1) {
                $('#oooMsg').text(_widget_settings.forceturnoff_message);
                $('.ooomsg-chat-div').css('display', 'block');
            }
            $('#start-chat').html("No agents are available");
            $("#start-chat").attr("disabled", "disabled");
            $("#start-chat").addClass("btn-disabled");
            $("#start-chat").attr("onclick", "#");
            if ($("#chat").is(':visible')) {
                $("#chat_submit_box").hide();
            }
        }
        else {
            $("#start-chat").removeAttr("disabled");
            $("#start-chat").attr("title", "");
            $("#start-chat").removeClass("btn-disabled");
            if (hasChats) {
                $('#start-chat').html("New Conversation");
            }
            else {
                $('#start-chat').html("Start Conversation");
            }
            $("#start-chat").attr("onclick", "IMILiveChat.startchat()");

            if ($("#chat").is(':visible')) {
                $("#chat_submit_box").show();
            }
        }
        if (_widget_settings.isforceturnoff != 1) {
            if (_widget_settings.widget_visible_type != undefined && _widget_settings.widget_visible_type != null && _widget_settings.widget_visible_type == "2") {
                $('.ooomsg-chat-div').css('display', 'block');
                $('#oooMsg').text(_widget_settings.outofoffice);
            }
        }

    };
    var BindWidgetSettings = function (cmsg, attrkey, hostname) {
        window.parent.postMessage({
            message: cmsg,
            action: 'loadstyles'
        }, "*");

        _widget_settings = JSON.parse(cmsg);
        /*Saving settings refresh time in local cache*/
        if (localStorage.getItem("settings_refresh_timeout") === null || localStorage.getItem("settings_refresh_timeout") === undefined || isNaN(parseInt(localStorage.getItem("settings_refresh_timeout"))) || (IMIGeneral.ticks() > parseInt(localStorage.getItem("settings_refresh_timeout")))) {
            var refresh_date = new Date();
            refresh_date.setMinutes(refresh_date.getMinutes() + _widget_settings.settings_refresh_timeout);
            var refresh_time = refresh_date.getTime();
            localStorage.setItem("settings_refresh_timeout", refresh_time);
        }

        if (_widget_settings.isforceturnoff == 1 && _widget_settings.forceturnoff_hide == 1) {
            cmsg = null;
            _widget_settings = null;
            return;
        }

        localStorage.setItem("style_" + IMIGeneral.getDomain(), cmsg);

        ApplyStyles(cmsg);
    };
    var sort_li_asc = function (a, b) {
        try {
            // if (moment(t.systemposition)._d >= moment($(dv_msg).attr('data-position'))._d)
            return moment($(b).data('position'))._d < moment($(a).data('position'))._d ? 1 : -1;
        }
        catch (e) { return 1; }
    };
    var GetEmojis = function () {
        try {
            var widget_setttings = JSON.parse(localStorage.getItem("style_" + IMIGeneral.getDomain()));
            var groupid = localStorage.getItem(widget_setttings.appid + "_usergroup_id");
            var postData = "groupid=" + groupid;
            var validateAPI = IMIGeneral.profileUrl() + "livechats/getemojis?" + postData;
            $.ajax({
                url: validateAPI,
                type: "GET",
                data: {},
                success: function (data) {
                    IMILiveChat.bindemoji(data, widget_setttings);
                },
                error: function (data) {
                    console.log(data);
                    $(".convwindowloader").remove();
                    return data;
                }
            });
        } catch (e) { }
    };
    var OpenEmoji = function () {
        $('.emoji-popup').toggleClass('open');
        $(".icon-happy").toggleClass("active");
        $('.emoji-popup.open').css('height', 275 + 'px');
        if ($('.nitesh-chat-box').height() > 60 || $('#chat').height() < 430) {
            $('.emoji-popup.open').css('height', $('#chat').height() - 60 + 'px');
            $(".emoji-popup.open").css("bottom", $(".nitesh-chat-box").height());
        }
    }
    var sendemoji = function (data) {
        $("#icwmsg").val($("#icwmsg").val() + data);
        if ($(".emoji-popup").hasClass("open")) {
            $(".emoji-popup").removeClass("open");
            $(".wdt-emoji-popup").removeClass("open");
            $(".icon-happy").removeClass("active");
            if ($('#aSend').hasClass('disable')) {
                $('#aSend').removeClass('disable');
            }
        }
    }
    var bindemoji = function (data, settings) {
        try {
            emojidata = JSON.parse(data);
            localStorage.setItem(settings.appid + "_" + settings.groupid + "_emojis", JSON.stringify(emojidata));
            for (i = 0; i < emojidata.length; i++) {
                $(".emoji-content").append("<span alt=" + emojidata[i].SYMBOL + " title='" + emojidata[i].DESC + "' onclick=\"IMILiveChat.sendemoji('" + emojidata[i].SYMBOL + "')\">" + emojidata[i].SYMBOL + "</span>")
            }
        }
        catch (e) { }
    };
    return {
        init: function () {

            $("#divloader").show();
            $("#chatwindow").hide();
            var browserName = IMIGeneral.getBrowserName();

            if (browserName != "chrome" && browserName != "firefox" &&
                browserName != "safari" && browserName != "edge" &&
                browserName != "ie" && browserName != "opera") {

                if (!IMIGeneral.detectIE() && !IMIGeneral.detectIOS()) {
                    $("body").html("<i class='fa fa-info-circle'></i><p class ='anothererror'>This browser is not supported. Kindly use Chrome/Firefox</p>");
                    return;
                }
            }
            //IMIGeneral.clearSession();
            sessionStorage.setItem("data-bind", IMIGeneral.getQueryString(location.href, "id"));
            sessionStorage.setItem("data-org", IMIGeneral.getQueryString(location.href, "org"));
            $("#icworg").html("<br>with " + IMILiveChat.orgName());
            $("#divicwmaincontainer").show();
            $("#icworganization").html(decodeURIComponent(IMIGeneral.getQueryString(location.href, "org")));
            $("#icwagenthdr").html(IMIGeneral.getQueryString(location.href, "org"));
            $("#icwmsg").keydown(function (e) {

                var charCode = (e.which) ? e.which : e.keyCode;
                if (charCode == 13) {
                    e.preventDefault();
                    e.stopPropagation();
                    $('#aSend').click();
                }
            });
            $("#icwmsg").keyup(function (e) {
                var charCode = (e.which) ? e.which : e.keyCode;
                if ($(this).val().trim() === '' && !$('#aSend').hasClass('disable')) {
                    $('#aSend').addClass('disable');
                    return true;
                }
                if ($(this).val().trim() !== '' && $('#aSend').hasClass('disable')) {
                    $('#aSend').removeClass('disable');
                }
                return true;
            });
            $("#icwmsg").keypress(function (e) {
                IMILiveChat.wcindicator(e, this);
            });

            ////$('#icwmsg').donetyping(function () {
            ////    IMILiveChat.wcindicatorclear();
            ////}, 10000);

            $("#opttranscript").click(function () {
                IMILiveChat.sendtranscript();
            });
            /*for identifying unique chats*/
            try {
                if (localStorage.getItem("browserfingerprint") == null || localStorage.getItem("browserfingerprint") == undefined || localStorage.getItem("browserfingerprint") == "") {
                    localStorage.setItem("browserfingerprint", IMIGeneral.getUniqueID());

                    window.parent.postMessage({
                        key: 'fingerprint',
                        value: localStorage.getItem("browserfingerprint"),
                        action: 'setlocal'
                    }, "*");
                    IMIGeneral.setSession(IMILiveChat.clientId() + "_email", localStorage.getItem("browserfingerprint").toLowerCase());
                }
            } catch (e) {
                console.log("##error::" + e.message);
            }

            $("#txtEmail").focus(function () {
                $("#txtEmail").removeClass("error-txtbox");
                $("#spnEmail").hide();
            });

            // 

            // ApplyStyles(localStorage.getItem("style_" + IMIGeneral.getHostName()));

            $('.chatwindow1').show();
            $('.chatwindow2').hide();
            // CreateThread();
            if ($('#chatthreads').css('display') !== 'none') {
                setInterval(function () {
                    IMILiveChat.updateTimer();
                }, 10000);
            }
        },
        clientId: function () {
            try {
                return sessionStorage.getItem("data-bind");
            } catch (e) { }
        },
        orgName: function () {
            try {
                return sessionStorage.getItem("data-org");
            } catch (e) { }
        },
        appId: function () {
            try {
                return sessionStorage.getItem("appid");
            } catch (e) {
                return "";
            }
        },
        appkey: function () {
            try {
                return sessionStorage.getItem("appkey");
            } catch (e) {
                return "";
            }
        },
        getBrowserFingerprint: function () {
            return localStorage.getItem("browserfingerprint");
        },
        wcindicator: function (e, ctrl) {
            var length = $(ctrl).val().length + 1;
            if (length > 0 && length % 5 === 0) {
                setwcindicator("typing_on");
                if (timer !== undefined) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    IMILiveChat.wcindicatorclear();
                }, 10000);
            }
        },
        wcindicatorclear: function () {
            setwcindicator("typing_off");
        },
        sendtranscript: function () {

            var emailId = localStorage.getItem('email-id-{0}'.format(IMILiveChat.getCurrentThreadId()));
            if (emailId != null && emailId != undefined) {
                IMILiveChat.sendtranscriptmail();

            } else {
                $("#sendemailtranscript").modal();
            }
        },
        sendtranscriptmail: function () {
            if ($("#sendemailtranscript").css("display") === "block") {
                if ($("#txtEmail").val().trim() == '') {
                    //  IMIGeneral.showToolTip('#txtEmail', 'Please Enter EmailId', 'bottom');
                    $("#txtEmail").addClass("error-txtbox");
                    $("#spnEmail").text("Please Enter EmailId");
                    $("#spnEmail").show();
                    return;
                }

                if (IMIGeneral.validateEmail($("#txtEmail").val().trim())) {
                    $("#sendemailtranscript").modal('hide');
                    localStorage.setItem('email-id-{0}'.format(IMILiveChat.getCurrentThreadId()), $("#txtEmail").val().trim());
                    setTimeout(function () {
                        chattranscriptmail();
                    }, 500);

                    //$("#txtEmail").val('');                                                        
                } else {
                    $("#txtEmail").addClass("error-txtbox");
                    $("#spnEmail").text("Invalid EmailId");
                    $("#spnEmail").show();
                    return;
                }
            } else {
                chattranscriptmail();
            }

        },
        getCurrentThreadId: function () {
            return IMIGeneral.getSession(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_" + IMIGeneral.getHostName());

        },
        setCurrentThreadId: function (threadId) {
            //
            //return  IMIGeneral.setSession(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_"+IMIGeneral.getHostName(),threadId);
            sessionStorage.setItem(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_" + IMIGeneral.getHostName(), threadId);
        },
        setCurrentThreadName: function (threadName) {
            // IMIGeneral.setSession(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_"+IMIGeneral.getHostName()+"_name",threadName);
            sessionStorage.setItem(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_" + IMIGeneral.getHostName() + "_name", threadName);
        },
        getCurrentThreadName: function () {
            return IMIGeneral.getSession(IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_" + IMIGeneral.getHostName() + "_name");
        },
        newThreadName: function () {
            var threadName = IMILiveChat.getBrowserFingerprint() + "_" + IMILiveChat.clientId() + "_" + IMIGeneral.getHostName() + "_" + IMIGeneral.ticks();
            IMILiveChat.setCurrentThreadName(threadName);
            return threadName;
        },
        registerRTM: function (callback) {
            RegisterRTM(callback);
        },
        startchat: function () {
            ////$("#chatthreads").append("<div class=\"loadingoverlay\"></div>");
            ///$("#start-chat").attr("disabled", "disabled");
            ///$("#start-chat").addClass("btn-disabled");
            $("#start-chat").html("Loading...");
            GetWidgetAccessbility(function () {
                if (_widget_settings.isforceturnoff === 1 || _widget_settings.agent_avail === 0) {
                    if (_widget_settings.isforceturnoff === 1) {
                        $('#oooMsg').text(_widget_settings.forceturnoff_message);
                        $('.ooomsg-chat-div').css('display', 'block');
                    }
                    $('#start-chat').html("No agents are available");
                    $("#start-chat").attr("disabled", "disabled");
                    $("#start-chat").addClass("btn-disabled");
                    $("#start-chat").attr("onclick", "#");
                    return;
                }
                else {
                    $('.ooomsg-chat-div').css('display', 'none');
                    $("#start-chat").removeAttr("disabled");
                    $("#start-chat").removeClass("btn-disabled");
                    $("#start-chat").attr("title", "");
                    ////$("#start-chat").html("New Conversation");
                    $("#start-chat").attr("onclick", "IMILiveChat.startchat()");
                    if ($("#chat").is(':visible')) {
                        $("#chat_submit_box").show();
                    }
                }
                if (_widget_settings.isforceturnoff != 1) {
                    if (_widget_settings.widget_visible_type != undefined && _widget_settings.widget_visible_type != null && _widget_settings.widget_visible_type == "2") {
                        $('.ooomsg-chat-div').css('display', 'block');
                        $('#oooMsg').text(_widget_settings.outofoffice);
                    }
                }

                if (_widget_settings.survey_fields.length > 0) {
                    IMILiveChat.createThread('pre_chat', function (thread_id) {
                        startPrechatSurvey();
                    });
                    return;
                }

                if (!$('#aSend').hasClass('disable')) {
                    $('#aSend').addClass('disable');
                }
                $('#hdnicwagent').val('');
                IMILiveChat.createThread("newchat");
            });
        },
        send: function (el) {
            try {
                if ($(".wdt-emoji-picker").hasClass("wdt-emoji-picker-open")) {
                    $(".wdt-emoji-picker").removeClass("wdt-emoji-picker-open");
                    $(".wdt-emoji-popup").removeClass("open");
                    $(".icon-happy").removeClass("active");

                }
            } catch (y) { }
            if ($('#{0}'.format(el.id)).hasClass('disable')) {
                return;
            }
            SendMessage();
        },
        getThreadid: function () {
            return threadid;
        },
        getUserId: function () {
            return sessionStorage.getItem(IMILiveChat.clientId() + "_email");
        },
        createThread: function (type, callback) {
            return CreateThread(type, callback);
        },
        loadPrevChats: function () {
            LoadPrevChats();
        },
        getWCPreviousHistory: function () {

            GetWCPreviousHistory();
        },
        bindMO: function (msg, dt, transid, isPrepend, agentid, historyid, submited_dt, mo_notify) {
            $(".divtypingindicator").remove();
            ////setTimeout(function () { $(".divtypingindicator").remove(); }, 2000);
            if (msg != "" && msg != undefined && msg != null && msg != "null") {
                if ($("div[data-hist='" + historyid + "']").length == 0) {
                    if (msg == "$$$$$TYPING$$$$$") {
                        return;
                    }
                    var emojisingle = " ";
                    if (msg.indexOf("attachment|||") == 0) {
                        var fileData = msg.split("|||");
                        IMILiveChat.bindFile(fileData[1], fileData[2], "MO", dt, transid, isPrepend, historyid, submited_dt);
                    } else {
                        msg = Encoder.htmlEncode(msg);
                        ////if (msg.split(':').length > 1) {
                        ////    try {
                        ////        var last = msg.lastIndexOf(":");
                        ////        var tempmsg = msg.substr(msg.indexOf(":") + 1, msg.lastIndexOf(":"));

                        ////        if ((tempmsg.indexOf(":") + 1) == last) {
                        ////            if (msg.lastIndexOf(":") + 1 == tempmsg.indexOf(":") + 1)
                        ////                emojisingle = "emojisingle";
                        ////        }
                        ////    } catch (x) { }
                        ////}
                        ////msg = IMIGeneral.replaceurlintext(msg);
                        ////try {
                        ////    msg = wdtEmojiBundle.render(msg);
                        ////} catch (e) { }
                        if (Encoder.isSingleEmoji(msg)) {
                            emojisingle = "emojisingle";
                        }
                        if (agentid != null && agentid != '') {
                            agentid = agentid.charAt(0);

                        } else {
                            agentid = "A";
                        }
                        // if ($("#dicw_" + transid).length == 0) {
                        if ($("#dicw_" + transid).length == 0) {
                            var moTmpl = "<div class=\"chat_message_wrapper msgsort chat_message_left\" data-position=\"" + submited_dt + "\" data-trans=\"" + transid + "\" id=\"dicw_" + transid + "\" data-hist=\"" + historyid + "\"><ul class=\"chat_message " + emojisingle + "\">" +
                                "<li class='agentimage'><span>" + agentid + "</span></li><li  class='mocolor'><p>" + msg + "</p></li><span class=\"chat_message_time\"><span class=\"text\">Received</span>" +
                                //IMIGeneral.getUserTimezoneDateTime(dt)
                                dt + "</span></ul></div>";

                            if (isPrepend)
                                $("#icwdivcarea").prepend(moTmpl);
                            else {
                                if (mo_notify) {
                                    var msg_list = $('#icwdivcarea div.msgsort');
                                    if (msg_list.length > 0) {
                                        for (var i = msg_list.length - 1; i >= 0; i--) {
                                            var dv_msg = msg_list[i];

                                            if (moment(submited_dt)._d >= moment($(dv_msg).attr('data-position'))._d) {

                                                if (i < msg_list.length - 1) {
                                                   
                                                    $(moTmpl).insertAfter(dv_msg);
                                                    $("#icwdivcarea").find("#dicw_" + transid).slideDown(2000);
                                                }
                                                else {
                                                    $("#icwdivcarea").append(moTmpl);
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        $("#icwdivcarea").append(moTmpl);
                                    }
                                }
                                else {
                                    $("#icwdivcarea").append(moTmpl);
                                }
                            }

                            // $("#icwdivcarea").prepend(moTmpl);
                            //$("#icwdivcarea div.msgsort").sort(sort_li_asc).appendTo("#icwdivcarea");
                            $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
                        }
                        $('.mocolor').css('background', mocolor);
                        $('.agentimage>span').css('background', mocolor);

                    }
                }
            }
            setTimeout(function () {
                calcchatheight();
                $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
            }, 500);
        },
        bindTypingMO: function (msg, isPrepend) {
            try {
                if (msg != "" && msg != undefined && msg != null && msg != null && msg.length > 0) {
                    if (msg == "$$$$$TYPING$$$$$") {
                        return;
                    }

                    if (msg == "typing_on") {
                        var moTmpl = "<div class=\"chat_message_wrapper divtypingindicator\"><ul class=\"chat_message\"><li class=\"mocolor\" style=\"background-color:" + mocolor + "\"><p><img src=\'images/wcindicator.gif'\"></img></p></li></ul></div>";
                        //$(".divtypingindicator").remove();
                        //
                        if (isPrepend) { // $("#icwdivcarea").prepend(moTmpl);
                            ($(".divtypingindicator").is(":visible")) ? " " : $("#icwdivcarea").prepend(moTmpl);
                        }
                        else {
                            // $("#icwdivcarea").append(moTmpl);
                            ($(".divtypingindicator").is(":visible")) ? " " : $("#icwdivcarea").append(moTmpl);
                        }
                        clearTimeout(counter);
                        counter = setTimeout(function () { $(".divtypingindicator").remove(); }, 10000);
                    }
                    //else if (msg == "typing_off") {
                    //    //$(".divtypingindicator").remove();
                    //    setTimeout(function () { $(".divtypingindicator").remove(); }, 2000);
                    //}
                    $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
                }
            } catch (ex) { }
        },
        bindMT: function (msg, dt, transid, isPrepend, agentid, historyid, submited_dt, mo_notify) {

            if (msg != "" && msg != undefined && msg != null && msg != "null") {
                if ($("div[data-hist='" + historyid + "']").length == 0) {
                    var oldMsg = msg;
                    //$(".divtypingindicator").remove();
                    setTimeout(function () { $(".divtypingindicator").remove(); }, 2000);
                    try {
                        if (transid.indexOf("|") > 0) {
                            transid = transid.split('|')[0];
                        }
                    } catch (e) { }
                    if (msg.indexOf("attachment|||") == 0) {
                        var fileData = msg.split("|||");
                        IMILiveChat.bindFile(fileData[1], fileData[2], "MT", dt, transid, isPrepend, historyid, submited_dt);
                        $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
                    } else {
                        msg = Encoder.htmlEncode(msg);

                        var emojisingle = " ";
                        /////var temp = msg;
                        ////var count = 0;
                        ////if (msg.split(':').length > 1 || msg.split('<').length > 1 || msg.split(')').length > 1 || msg.split(';').length > 1) {
                        ////    try {

                        ////        var icons = IMILiveChat.emojiIcons();
                        ////        msg.replace(/[:;83B>^)*@$&I\]|\-_(=o)pPxXDyOCcb:)]+/g, function (match) {
                        ////            typeof icons[match] != 'undefined' ? count = IMILiveChat.getCount(match, msg, count) : null;
                        ////        });
                        ////        if (count == 1)
                        ////            emojisingle = "emojisingle";
                        ////    } catch (y) { }

                        ////}
                        ////if (count == 0 || count == undefined) {
                        ////    try {
                        ////        var last = msg.lastIndexOf(":");
                        ////        var tempmsg = msg.substr(msg.indexOf(":") + 1, msg.lastIndexOf(":"));
                        ////        if ((tempmsg.indexOf(":") + 1) == last) {
                        ////            if (msg.lastIndexOf(":") + 1 == temp.length)
                        ////                emojisingle = "emojisingle";
                        ////        }
                        ////    } catch (x) { }
                        ////}

                        ////msg = IMIGeneral.replaceurlintext(msg);
                        ////if (IMIGeneral.getSession('hdnisemojienable') == "1") {
                        ////    try {
                        ////        msg = wdtEmojiBundle.render(msg);
                        ////    } catch (e) { }
                        ////} else {
                        ////    emojisingle = "";
                        ////}

                        ////if (count == 0 || count == undefined) {
                        ////    if (oldMsg == Encoder.htmlDecode(msg)) {
                        ////        emojisingle = "";
                        ////    }
                        ////}

                        // if ($("#dicw_" + transid).length == 0) {
                        if (Encoder.isSingleEmoji(msg)) {
                            emojisingle = "emojisingle";
                        }
                        if ($("#dicw_" + transid).length == 0) {
                            var mtTmpl = "<div class=\"chat_message_wrapper  msgsort chat_message_right\" data-position=\"" + submited_dt + "\" id=\"dicw_" + transid + "\"  data-trans=\"" + transid + "\"  data-hist=\"" + historyid + "\"  ><ul class=\"chat_message " + emojisingle + "\"><li class=\"mtcolor\"><p>" + msg + "</p></li><span class=\"chat_message_time\"><span class=\"text\">Sent</span>" + dt + "</span></ul></div>";
                            if (isPrepend)
                                $("#icwdivcarea").prepend(mtTmpl);
                            else {
                                if (mo_notify) {
                                    var msg_list = $('#icwdivcarea div.msgsort');
                                    if (msg_list.length > 0) {
                                        for (var i = msg_list.length - 1; i >= 0; i--) {
                                            var dv_msg = msg_list[i];

                                            if (moment(submited_dt)._d >= moment($(dv_msg).attr('data-position'))._d) {

                                                if (i < msg_list.length - 1) {
                                                    $(mtTmpl).insertAfter(dv_msg);
                                                    $("#icwdivcarea").find("#dicw_" + transid).slideDown(2000);
                                                }
                                                else {
                                                    $("#icwdivcarea").append(mtTmpl);
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        $("#icwdivcarea").append(mtTmpl);
                                    }
                                }
                                else {
                                    $("#icwdivcarea").append(mtTmpl); 
                                }
                            }
                            //$("#icwdivcarea").append(mtTmpl);

                           // $("#icwdivcarea div.msgsort").sort(sort_li_asc).appendTo("#icwdivcarea");
                            //$('.chat_message_right').fadeIn("slow", function () {
                            //$(".chat_message p").slideDown("200", "swing")
                            //});

                            $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
                            $('.mtcolor').css('background', mtcolor);
                            if (mtcolor != '')
                                $('.mtcolor').css('color', mtTcolor);
                            // if (localStorage.getItem("tsemail") == IMILiveChat.getUserId()) {
                            //     $("#opttranscript").css("display", "block");
                            // }
                        }
                    }
                    //disable the click of your clickable area
                    $(".dz-hidden-input").prop("disabled", true);
                }
            }
        },
        bindFile: function (contentType, url, msgType, dt, transid, isPrepend, historyid, submited_dt, mo_notify) {
            try {
                if (url != "") {
                    var uploadMsg = "";
                    if (msgType == "MO") {
                        var cntType = url.substr(url.lastIndexOf(".") + 1);

                        if (cntType == "jpg" || cntType == "gif" || cntType == "png") {
                            contentType = "image";
                        } else {
                            contentType = "file";
                        }
                        try {
                            url = url.replace(/\\/g, "/");
                            uploadMsg = url.substr(url.lastIndexOf("/") + 1, url.length);
                        } catch (x) { }
                        var moTmpl = "";
                        //if ($("#dicw_" + transid + "_" + uploadMsg).length == 0) {
                        if (document.getElementById("dicw_" + transid + "_" + uploadMsg) == null) {
                            //For binding files and restricting duplicate records
                            historyid = "img_" + historyid;
                            if (contentType == "image") {
                                moTmpl = "<div class=\"chat_message_wrapper msgsort chat_message_left\" data-position=\"" + submited_dt + "\"  id=\"dicw_" + transid + "_" + uploadMsg + "\"  data-trans=\"" + transid + "\" data-hist=\"" + historyid + "\"><ul class=\"chat_message attachimage\"><li><a onclick=\"IMILiveChat.checkFileExist('" + url + "')\" class=\"image-a\"> <img src=\"" + url + "\" onerror=\"this.src='" + IMIGeneral.domainName() + "/images/noimagefound.png';\"><span class=\"icon-dwnimg\"></span></a>" + "</li><span class=\"chat_message_time\"><span class=\"text\">Received</span>" + dt + "</span></ul></div>";
                            } else {
                                moTmpl = "<div class=\"chat_message_wrapper msgsort chat_message_left\" data-position=\"" + submited_dt + "\"  id=\"dicw_" + transid + "_" + uploadMsg + "\" data-trans=\"" + transid + "\" data-hist=\"" + historyid + "\"><ul class=\"chat_message\"><li style=background:" + mocolor + "><a onclick=\"IMILiveChat.checkFileExist('" + url + "')\" class=\"image-file\"> <span class=\"file-name\">" + uploadMsg + "</span></a></li>" + "<span class=\"chat_message_time\"><span class=\"text\">Received</span>" + dt + "</span></ul></div>";
                            }
                            if (isPrepend)
                                $("#icwdivcarea").prepend(moTmpl);
                            else {
                                if (mo_notify) {
                                    var msg_list = $('#icwdivcarea div.msgsort');
                                    if (msg_list.length > 0) {
                                        for (var i = msg_list.length - 1; i >= 0; i--) {
                                            var dv_msg = msg_list[i];

                                            if (moment(submited_dt)._d >= moment($(dv_msg).attr('data-position'))._d) {

                                                if (i < msg_list.length - 1) {
                                                    $(moTmpl).insertAfter(dv_msg);
                                                    $("#icwdivcarea").find("#dicw_" + transid + "_" + uploadMsg).slideDown(2000);
                                                }
                                                else {
                                                    $("#icwdivcarea").append(moTmpl);
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        $("#icwdivcarea").append(moTmpl);
                                    }
                                }
                                else {
                                    $("#icwdivcarea").append(moTmpl);
                                }
                                //$("#icwdivcarea").append(moTmpl);
                            }
                           // $("#icwdivcarea div.msgsort").sort(sort_li_asc).appendTo("#icwdivcarea");
                            $('#chat').scrollTop($('#chat')[0].scrollHeight);
                        }
                    }
                    if (msgType == "MT") {
                        try {
                            uploadMsg = url.substr(url.lastIndexOf("/") + 1, url.length);
                            uploadMsg = uploadMsg.substr(uploadMsg.indexOf("_") + 1, uploadMsg.length);
                        } catch (x) { }
                        var mtTmpl = "";
                        if (document.getElementById("dicw_" + transid + "_" + uploadMsg) == null) {
                            historyid = "img_" + historyid;
                            if (contentType == "image") {
                                mtTmpl = "<div class=\"chat_message_wrapper  msgsort chat_message_right\"  data-position=\"" + submited_dt + "\"  id=\"dicw_" + transid + "_" + uploadMsg + "\" data-trans=\"" + transid + "\" data-hist=\"" + historyid + "\"><ul class=\"chat_message attachimage\"><li><a onclick=\"IMILiveChat.checkFileExist('" + url + "')\" class=\"image-a\"> <img src=\"" + url + "\"  onerror=\"this.src='" + IMIGeneral.domainName() + "/images/noimagefound.png';\"><span class=\"icon-dwnimg\"></span></a></li>" + "<span class=\"chat_message_time\"><span class=\"text\">Sent</span>" + dt + "</span></ul></div>";
                            } else {
                                mtTmpl = "<div class=\"chat_message_wrapper msgsort chat_message_right\" data-position=\"" + submited_dt + "\"  id=\"dicw_" + transid + "_" + uploadMsg + "\"  data-trans=\"" + transid + "\" data-hist=\"" + historyid + "\"><ul class=\"chat_message\"><li  style=background:" + mtcolor + "><a onclick=\"IMILiveChat.checkFileExist('" + url + "')\" class=\"image-file\"> <span class=\"file-name\">" + uploadMsg + "</span></a></li>" + "<span class=\"chat_message_time\"><span class=\"text\">Sent</span>" + dt + "</span></ul></div>";
                            }
                            //$("#icwdivcarea").append(mtTmpl);
                            if (isPrepend)
                                $("#icwdivcarea").prepend(mtTmpl);
                            else {
                                //$("#icwdivcarea").append(mtTmpl);
                                if (mo_notify) {
                                    var msg_list = $('#icwdivcarea div.msgsort');
                                    if (msg_list.length > 0) {
                                        for (var i = msg_list.length - 1; i >= 0; i--) {
                                            var dv_msg = msg_list[i];

                                            if (moment(submited_dt)._d >= moment($(dv_msg).attr('data-position'))._d) {

                                                if (i < msg_list.length - 1) {
                                                    $(mtTmpl).insertAfter(dv_msg);
                                                    $("#icwdivcarea").find("#dicw_" + transid + "_" + uploadMsg).slideDown(2000);
                                                }
                                                else {
                                                    $("#icwdivcarea").append(mtTmpl);
                                                }
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        $("#icwdivcarea").append(mtTmpl);
                                    }
                                }
                                else {
                                    $("#icwdivcarea").append(mtTmpl);
                                }
                            }

                            //$("#icwdivcarea div.msgsort").sort(sort_li_asc).appendTo("#icwdivcarea");
                            $('#chat').scrollTop($('#chat')[0].scrollHeight);
                        }
                    }
                }
                setTimeout(function () {
                    calcchatheight();
                    $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
                }, 800);
            } catch (e) { }
        },
        checkFileExist: function (filelink) {
            $.ajax({
                type: "POST",
                url: IMIGeneral.domainName() + "/Handlers/ICWUpload.ashx?action=checkattachment",
                data: "filelink=" + filelink,
                async: false,
                success: function (msg) {
                    if (msg == "1")
                        window.open(filelink);

                    else
                        window.open(IMIGeneral.domainName() + "404.htm");
                },
                error: function (xhr, err, thrownError) {
                    console.log("error in checking file existence:" + err);
                }
            });
        },
        bindMsg: function (msg, type, teamname, isPrepend, submited_dt, mo_notify) {
            if (submited_dt == undefined) {
                submited_dt = IMILiveChat.getCurrentUTCdate();
            }
            var transid = moment().unix();
            submited_dt = moment(submited_dt).add(moment.duration(-2, 'milliseconds')).format('YYYY-MM-DD HH:mm:ss.SSS');
            var mtTmpl = "<div id=\"dicw_" + transid + "\" class=\"widgetalerts msgsort\" data-position=\"" + submited_dt + "\"  style=\"background-color:  hsl(" + hue + "," + saturation + "%," + lightness3 + "%)\"><span class=\"servicemsg\"> You are now chatting with <span class=\"serviceuser\">" + msg + "</span> from " + teamname + " </span></div>";
            // IMIwidget.getSession("teamname") + " --</span>";
            if (isPrepend) {
                $("#icwdivcarea").prepend(mtTmpl);
            } else {
                // $("#icwdivcarea").append(mtTmpl);
                if (mo_notify) {
                    var msg_list = $('#icwdivcarea div.msgsort');
                    if (msg_list.length > 0) {
                        for (var i = msg_list.length - 1; i >= 0; i--) {
                            var dv_msg = msg_list[i];

                            if (moment(submited_dt)._d >= moment($(dv_msg).attr('data-position'))._d) {

                                if (i < msg_list.length - 1) {
                                    $(mtTmpl).insertAfter(dv_msg);
                                    $("#icwdivcarea").find("#dicw_" + transid).slideDown(2000);
                                }
                                else {
                                    $("#icwdivcarea").append(mtTmpl);
                                }
                                break;
                            }
                        }
                    }
                    else {
                        $("#icwdivcarea").append(mtTmpl);
                    }
                }
                else {
                    $("#icwdivcarea").append(mtTmpl);
                }
            }
            //  $("#icwdivcarea").append(mtTmpl); 

            //$("#icwdivcarea div.msgsort").sort(sort_li_asc).appendTo("#icwdivcarea");

            $('#chat').scrollTop($('#chat')[0].scrollHeight);
            $("#chatpageheading,#smallchatpageheading").text(msg);
            $("#headertypicallyrply,#smallheaderdesc").css("display", "none");
            $("#smallheaderdescwhennotypically").css("display", "block");
            //$("#typicallyrply").css("display", "none");
            $('#icwagenthdr').removeClass('goup');
        },
        bindQuickReplies: function (quickreply, transid, historyid, isPrepend, submited_dt, mo_notify) {
            if ($("div[data-hist='" + historyid + "']").length == 0) {
                var mtTmpl = "<div class=\"chat_message_wrapper msgsort chat_message_left\"  data-position=\"" + submited_dt + "\" data-requestid=\"" + quickreply.request_identifier + "\" data-trans=\"" + transid + "\" id=\"dicw_" + transid + "\" data-hist=\"" + historyid + "\"><span class=\"quickreplymsg\"> {0} </span></div>";
                var x = "";
                $.each(quickreply.options, function (key, item) {
                    var quickyreplytitle = item.title;
                    try {
                        ////if (IMIGeneral.getSession('hdnisemojienable') == "1") {
                        ////    item.title = wdtEmojiBundle.render(item.title);
                        ////}
                        ////else {
                        item.title = Encoder.htmlEncode(item.title);
                        ////}
                    } catch (e) { }

                    x = x + "<button class=\"quickreply\" style=\"border-color:" + mtcolor + "; color:" + mtcolor + "\"  onmouseout='IMILiveChat.applyQuickreplyMouseOut(this);'  onmouseover='IMILiveChat.applyQuickreplyHover(this);' onclick='IMILiveChat.sendQuickreply(this)'>" + item.title + "<span style='display:none'>" + Encoder.htmlEncode(quickyreplytitle) + "</span></button>";
                });
                mtTmpl = mtTmpl.replace("{0}", x);
                if (isPrepend) {
                    $("#icwdivcarea").prepend(mtTmpl);
                }
                else {
                    // $("#icwdivcarea").append(mtTmpl);
                    if (mo_notify) {
                        var msg_list = $('#icwdivcarea div.msgsort');
                        if (msg_list.length > 0) {
                            for (var i = msg_list.length - 1; i >= 0; i--) {
                                var dv_msg = msg_list[i];

                                if (moment(submited_dt)._d >= moment($(dv_msg).attr('data-position'))._d) {

                                    if (i < msg_list.length - 1) {
                                        $(mtTmpl).insertAfter(dv_msg);
                                        $("#icwdivcarea").find("#dicw_" + transid).slideDown(2000);
                                    }
                                    else {
                                        $("#icwdivcarea").append(mtTmpl);
                                    }
                                    break;
                                }
                            }
                        }
                        else {
                            $("#icwdivcarea").append(mtTmpl);
                        }
                    }
                    else {
                        $("#icwdivcarea").append(mtTmpl);
                    }
                }

               // $("#icwdivcarea div.msgsort").sort(sort_li_asc).appendTo("#icwdivcarea");
                setTimeout(function () {
                    calcchatheight();
                    $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
                }, 100);
                localStorage.setItem(IMILiveChat.getCurrentThreadId() + "_quickreply", true);
                $('#chat_submit_box').hide();
            }
        },
        bindIlogMsg: function (msg, type, isPrepend, submited_dt, mo_notify) {
            if (submited_dt == undefined) {
                submited_dt = IMILiveChat.getCurrentUTCdate();
            }
            var logMsg = msg.split('|');
            var transid = moment().unix();
            var mtTmpl = "<div class=\"widgetalerts msgsort\" id=\"dicw_" + transid + "\"   data-position=\"" + submited_dt + "\" style=\"background-color:  hsl(" + hue + "," + saturation + "%," + lightness3 + "%)\"><span class=\"servicemsg\"> " + logMsg[1] + " </span></div>";
            // IMIwidget.getSession("teamname") + " --</span>";
            if (isPrepend) {

                if (logMsg[1].toLowerCase() == 'new chat created') {
                } else {
                    $("#icwdivcarea").prepend(mtTmpl);
                }
            } else {
                if (logMsg[1] != 'New chat created') {
                    //$("#icwdivcarea").append(mtTmpl);
                    if (mo_notify) {
                        var msg_list = $('#icwdivcarea div.msgsort');
                        if (msg_list.length > 0) {
                            for (var i = msg_list.length - 1; i >= 0; i--) {
                                var dv_msg = msg_list[i];

                                if (moment(submited_dt)._d >= moment($(dv_msg).attr('data-position'))._d)

                                    if (i < msg_list.length - 1) {
                                        $(mtTmpl).insertAfter(dv_msg);

                                        $("#icwdivcarea").find("#dicw_" + transid).slideDown(2000);
                                    }
                                    else {
                                        $("#icwdivcarea").append(mtTmpl);
                                    }
                                break;
                            }
                        }
                    }
                    else {
                        $("#icwdivcarea").append(mtTmpl);
                    }
                }
                else {
                    $("#icwdivcarea").append(mtTmpl);
                }
            }

          //  $("#icwdivcarea div.msgsort").sort(sort_li_asc).appendTo("#icwdivcarea");
            //  $("#icwdivcarea").append(mtTmpl);
            $('#chat').scrollTop($('#chat')[0].scrollHeight);

        },
        loadPlugins: function (color) {
            ////alert($('#hdnisemojienable').val() );

            if (IMIGeneral.getSession('hdnisemojienable') == "1") {
                $(".wdt-emoji-popup").css("display", "block");
                ////wdtEmojiBundle.defaults.type = 'emojione';
                ////wdtEmojiBundle.defaults.emojiSheets.emojione = IMIGeneral.emojiImageURL();
                $("#icwmsg").addClass("wdt-emoji-bundle-enabled");
                ////wdtEmojiBundle.init('.wdt-emoji-bundle-enabled');
                $(".icon-happy").blur(function () {
                    // //alert(1);
                });
                //emojis end
                $(".wdt-emoji-picker .icon-happy").css("color", color);
            } else {
                if ($(".wdt-emoji-picker").hasClass("wdt-emoji-picker-open")) {
                    $(".wdt-emoji-picker").removeClass("wdt-emoji-picker-open");
                    $(".wdt-emoji-popup").removeClass("open");
                    $(".icon-happy").removeClass("active");
                    $(".error").html("");
                }
            }
            if (IMIGeneral.getSession('hdnisattachmentenable') == "1") {
                $('#ico_attachment').show();
            } else {
                $('#ico_attachment').hide();
            }
            //DropZone starts
            //if ($("#chat").hasClass("dz-clickable"))
            //    return;
            Dropzone.autoDiscover = false;
            $("#chat").dropzone({
                maxFilesize: 10,
                url: IMIGeneral.domainName() + "/Handlers/ICWUpload.ashx?action=senduploadfile",
                dictResponseError: 'Error uploading file!',
                acceptedFiles: ".jpg,.jpeg,.gif,.png,.mp4,.mp3,.pdf,.docx,.doc,.xls,.xlsx,.csv,.ppt,.pptx,.wav",
                dictFileTooBig: 'File is bigger than 10MB.',
                uploadMultiple: false,
                withCredentials: false,
                maxFiles: 1,
                previewsContainer: '#icwdivcarea',
                thumbnailWidth: null,
                thumbnailHeight: null,
                init: function () { },
                success: function (file, response) {
                    var outval = response.split('|');
                    try {
                        SendFile(outval[0], outval[1]);
                    } catch (x) { }
                    this.removeFile(file);
                },
                error: function (file, response) {
                    $("#icweMsg").text(response);
                    this.removeFile(file);
                }
            });
            $(".dz-hidden-input").prop("disabled", true);
            //DropZone END

            //Emojis start

        },
        confirm: function () {
            Confirm();
        },
        close: function () {
            CloseChat();
        },
        emojiIcons: function () {
            var icons = {
                "<3": "heart",
                ":o)": "monkey_face",
                ":*": "kiss",
                ":-*": "kiss",
                "</3": "broken_heart",
                "=)": "smiley",
                "=-)": "smiley",
                "C:": "smile",
                "c:": "smile",
                ":D": "smile",
                ":-D": "smile",
                ":>": "laughing",
                ":->": "laughing",
                ";)": "wink",
                ";-)": "wink",
                "8)": "sunglasses",
                ":|": "neutral_face",
                ":-|": "neutral_face",
                ":\\": "confused",
                ":-\\": "confused",
                ":/": "confused",
                ":-/": "confused",
                ":p": "stuck_out_tongue",
                ":-p": "stuck_out_tongue",
                ":P": "stuck_out_tongue",
                ":-P": "stuck_out_tongue",
                ":b": "stuck_out_tongue",
                ":-b": "stuck_out_tongue",
                ";p": "stuck_out_tongue_winking_eye",
                ";-p": "stuck_out_tongue_winking_eye",
                ";b": "stuck_out_tongue_winking_eye",
                ";-b": "stuck_out_tongue_winking_eye",
                ";P": "stuck_out_tongue_winking_eye",
                ";-P": "stuck_out_tongue_winking_eye",
                "):": "disappointed",
                ":(": "disappointed",
                ":-(": "disappointed",
                ">:(": "angry",
                ">:-(": "angry",
                ":'(": "cry",
                "D:": "anguished",
                ":o": "open_mouth",
                ":-o": "open_mouth",
                ":O": "open_mouth",
                ":-O": "open_mouth",
                ":)": "slightly_smiling_face",
                "(:": "slightly_smiling_face",
                ":-)": "slightly_smiling_face"
            };
            return icons;
        },
        moveback: function () {

            clearSurveyTimer();
            var lcStyle = IMIGeneral.getLocal("style_" + IMIGeneral.getDomain());
            lcStyle = $.parseJSON(lcStyle);
            $("#chatpageheading,#smallchatpageheading").text(lcStyle.name);

            if ($("span.wdt-emoji-picker").hasClass("wdt-emoji-picker-open")) {
                $("span.wdt-emoji-picker").removeClass("wdt-emoji-picker-open");
                $("div.wdt-emoji-popup").removeClass("open");
            }
            $('#hdnicwagent').val('');
            $("#icwmsg").val("");
            $(".error").html("");
            IMILiveChat.setCurrentThreadId(''); //3.7.1 changes
            LoadPrevChats();
            $("#chat").hide();
            $("#chat_submit_box").hide();
            $("#chatthreads").show();
            $(".new-conversation").show();

            $("#dLabel").hide();
            $("#backicon").hide();

            if (_widget_settings.agent_avail === 0 || _widget_settings.isforceturnoff == 1) {
                if (_widget_settings.isforceturnoff == 1) {
                    $('#oooMsg').text(_widget_settings.forceturnoff_message);
                    $('.ooomsg-chat-div').css('display', 'block');
                }
                $('#start-chat').html("No agents are available");
                $("#start-chat").attr("disabled", "disabled");
                $("#start-chat").addClass("btn-disabled");
                $("#start-chat").attr("onclick", "#");
                if ($("#chat").is(':visible')) {
                    $("#chat_submit_box").hide();
                }
            }
            else {
                $('#oooMsg').text("");
                $("#start-chat").removeAttr("disabled");
                $("#start-chat").removeClass("btn-disabled");
                $("#start-chat").attr("onclick", "IMILiveChat.startchat()");
                $('.ooomsg-chat-div').css('display', 'none');
            }

            if (_widget_settings.isforceturnoff != 1) {
                if (_widget_settings.widget_visible_type != undefined && _widget_settings.widget_visible_type != null && _widget_settings.widget_visible_type == "2") {
                    $('.ooomsg-chat-div').css('display', 'block');
                    $('#oooMsg').text(_widget_settings.outofoffice);
                }
            }

            /* $("#headerdesc").text(localStorage.getItem("headerdesc"));*/
            if ($(".small").is(":visible") == true) {
                // $(".small").hide();
                // $(".big").show();
                $('.big').css("opacity", "1");
                $('.small').css("opacity", "0");
                $(".big").css("opacity", "1");
            }
            $('.big').css("opacity", "1");
            checklogo();
            try {
                $('.submit_message').css('height', '100%');
                calcchatheight();
            } catch (c) { }

            if ($(".emoji-popup").hasClass("open")) {
                $(".emoji-popup").removeClass("open");
                $(".wdt-emoji-popup").removeClass("open");
                $(".icon-happy").removeClass("active");
                if ($('#aSend').hasClass('disable')) {
                    $('#aSend').removeClass('disable');
                }
            }
        },
        minWindow: function () {
            window.parent.postMessage({
                action: "chatswitchicon"
            }, "*");
        },
        SetThreadCount: function (threadid) {
            var threadMsgCount = IMIGeneral.getLocal(localStorage.getItem("browserfingerprint") + "_" + threadid + "_unreadcount");
            if (threadMsgCount == null || threadMsgCount == undefined || threadMsgCount == "null") {
                threadMsgCount = 0;
            }
            IMIGeneral.storeLocal(localStorage.getItem("browserfingerprint") + "_" + threadid + "_unreadcount", parseInt(threadMsgCount) + 1);
            $("#" + threadid).find(".badge").text(parseInt(threadMsgCount) + 1).show();
            $("#" + threadid).attr("date-position", IMIGeneral.getCurrentUTCtime().toISOString());
            $("#" + threadid).find(".time").text(IMIGeneral.timeDifference(IMIGeneral.getCurrentUTCtime()));
            $("#chatthreads").sortDivs();

        },
        hideCloseButton: function (msgwidth, chatmobile) {
            msgwidth = window.outerWidth;
            msginnerwidth = window.outerWidth;
            if (chatmobile == "1") {
                msgwidth = window.innerWidth;
            }
            if (msgwidth < 720 || msginnerwidth < 497) {
                $("#minbutton").show();
                // $("#minbutton").attr("onclick", "IMILiveChat.minWindow()");
                $("body").addClass("widgetmobile");
            } else {
                $("#minbutton").hide();
                // $("#minbutton").attr("onclick", "");
                $("body").removeClass("widgetmobile");
            }

        },
        showFileUpload: function () {
            $(".dz-hidden-input").prop("disabled", false);
            $('#chat').click();

        },
        getStyles: function (attrkey, host) {
            sessionStorage.setItem("parenthostname", host);
            GetStyles(attrkey, host);
        },
        getProactiveSettings: function (attrkey, host, callback) {
            var url = IMIGeneral.profileUrl() + "livechats/" + attrkey + "/proactive/settings?host=" + host;
            $.get(url, function (data) {
                if (data !== null) {
                    _proactive_settings = data;
                }
                if (callback !== undefined) {
                    callback();
                }
            });
        },
        triggerProactiveMessaging: function (proactive_id, thread_id) {
            var proactive = _proactive_settings.filter(function (x) {
                return x.id === proactive_id;
            })[0];

            var widget_setttings = JSON.parse(localStorage.getItem("style_" + IMIGeneral.getDomain()));
            var browser_fingerprint = localStorage.getItem("browserfingerprint");
            var url = IMIGeneral.profileUrl() + "livechats/" + _attr_key + "/proactives/" + proactive_id + "/trigger?host=" + IMIGeneral.getDomain();
            $.ajax({
                url: url,
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({
                    "app_id": widget_setttings.appid,
                    "website_id": widget_setttings.website_id,
                    "browser_fingerprint": browser_fingerprint,
                    "theread_id": thread_id,
                    "msg_from": proactive.msg_from,
                    "msg": proactive.msg,
                    "team_id": proactive.assign_info_teamid
                }),
                async: true,
                success: function (data) {
                    if (data !== null) {
                        if (data.status) {
                            window.parent.postMessage({
                                message: {
                                    data: {
                                        height: 3,
                                        status: data.status,
                                        proactive_id: proactive.id,
                                        msg_from: proactive.msg_from,
                                        msg: proactive.msg,
                                        badge_type: proactive.badge_type,
                                        dt: IMIGeneral.getUserCtime(),
                                        fingerprint: browser_fingerprint,
                                        msgtransid: IMIGeneral.ticks(),
                                        threadid: thread_id
                                    }
                                },
                                action: 'show_proactive_message'
                            }, "*");
                            IMILiveChat.addChatThreadSession(thread_id, proactive.msg, proactive.msg_from, "MT");
                            IMILiveChat.addProactiveChats(thread_id, proactive.msg, proactive.msg_from, "MT", proactive_id);
                            IMILiveChat.updateProactiveMetrics(proactive.id, 1);
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Error: " + errorThrown);
                }
            });
        },
        updateProactiveMetrics: function (proactive_id, metric_id) {
            if (metric_id === 2) {
                var replied_proactive_ids = [];
                if (localStorage.getItem('replied_proactive_ids') != null) {
                    replied_proactive_ids = JSON.parse(localStorage.getItem('replied_proactive_ids'));
                }
                if (replied_proactive_ids.some(function (x) {
                        return x === proactive_id
                })) {
                    return;
                }
            }

            var proactive = _proactive_settings.filter(function (x) {
                return x.id === proactive_id;
            })[0];

            var widget_setttings = JSON.parse(localStorage.getItem("style_" + IMIGeneral.getDomain()));
            var browser_fingerprint = localStorage.getItem("browserfingerprint");
            var url = IMIGeneral.profileUrl() + "livechats/" + _attr_key + "/proactives/" + proactive_id + "/metrics/" + metric_id + "?host=" + IMIGeneral.getDomain();
            // console.log(url);
            $.ajax({
                url: url,
                type: 'POST',
                contentType: "application/json",
                data: {},
                async: true,
                success: function (data) {
                    if (metric_id === 2) {
                        replied_proactive_ids.push(proactive_id);

                        localStorage.setItem('replied_proactive_ids', JSON.stringify(replied_proactive_ids));
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("Error: " + errorThrown);
                }
            });
        },
        getChatThreadSessions: function () {
            try {
                if (sessionStorage.getItem(IMIGeneral.getSession("appid") + "_chatthreads")) {
                    chatSessionThreads = [];
                    var temp = $.parseJSON(sessionStorage.getItem(IMIGeneral.getSession("appid") + "_chatthreads"));
                    for (var i = 0; i < temp.length; i++) {
                        chatSessionThreads.push(temp[i]);
                    }
                }
            } catch (e) {

            }
            return chatSessionThreads;
        },
        addChatThreadSession: function (threadid, msg, agentid, msgtype) {
            try {
                var item = {};
                item.threadid = threadid;
                item.msg = msg;
                item.agentid = agentid;
                item.CHATTYPE = msgtype;
                item.msgdate = IMIGeneral.getCurrentUTCtime().toISOString();
                chatSessionThreads.push(item);
                sessionStorage.setItem(IMIGeneral.getSession("appid") + "_chatthreads", JSON.stringify(chatSessionThreads));
            } catch (e) { }
        },
        addProactiveChats: function (threadid, msg, agentid, msgtype, proactive_id) {
            try {
                var item = {};
                item.threadid = threadid;
                item.msg = msg;
                item.agentid = agentid;
                item.CHATTYPE = msgtype;
                item.msgdate = IMIGeneral.getCurrentUTCtime().toISOString();
                item.proactive_id = proactive_id;
                proactiveChatThreads.push(item);
                localStorage.setItem(IMIGeneral.getSession("appid") + "_proactive_threads", JSON.stringify(proactiveChatThreads));
            } catch (e) { }
        },
        updateChatThreadSessionMsg: function (threadid, msg, agentid, msgtype) {
            try {
                //  chatSessionThreads = sessionStorage.getItem(IMIGeneral.getSession("appid") + "_chatthreads") || [];
                // chatSessionThreads = JSON.parse(chatSessionThreads);
                var flag = false;
                for (var i = 0; i < chatSessionThreads.length; i++) {
                    if (chatSessionThreads[i].threadid === threadid) {
                        chatSessionThreads[i].msg = msg;
                        chatSessionThreads[i].agentid = chatSessionThreads[i].agentid != "" ? chatSessionThreads[i].agentid : agentid;
                        chatSessionThreads[i].CHATTYPE = msgtype;
                        chatSessionThreads[i].msgdate = IMIGeneral.getCurrentUTCtime().toISOString();
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    IMILiveChat.addChatThreadSession(threadid, msg, agentid, msgtype);
                }
                else {
                    sessionStorage.setItem(IMIGeneral.getSession("appid") + "_chatthreads", JSON.stringify(chatSessionThreads));
                }
            } catch (e) { }
        },
        updateTimer: function () {
            try {
                $("#chatthreads").find("div.thread").each(function () {
                    if ($(this).attr("date-position") != undefined && $(this).attr("date-position") != "") {
                        //IMIGeneral.timeDifference($(this).attr("data-position"));
                        $(this).find(".time").text(IMIGeneral.timeDifference($(this).attr("date-position")));
                    }
                });
            } catch (e) { }
        },
        processAbandonedChats: function (is_reloaded, is_closechat) {

            var browser_fingerprint = localStorage.getItem("browserfingerprint");
            var service_key = localStorage.getItem('service_key');
            if (browser_fingerprint === null || service_key === null) {
                return;
            }
            var url = IMIGeneral.profileUrl() + "livechats/" + service_key + "/customers/" + browser_fingerprint + "/abandoned?host=" + IMIGeneral.getDomain();
            // console.log(url);
            $.ajax({
                url: url,
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({
                    "is_reloaded": is_reloaded,
                    "is_closechat": is_closechat
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
        sendConnectionLostLog: function (connection_status) {
            var browser_fingerprint = localStorage.getItem("browserfingerprint");
            var service_key = localStorage.getItem('service_key');
            if (browser_fingerprint === null || service_key === null) {
                return;
            }
            var url = IMIGeneral.profileUrl() + "livechats/" + service_key + "/customers/" + browser_fingerprint + "/connectionlost?host=" + IMIGeneral.getDomain();
            // console.log(url);
            $.ajax({
                url: url,
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({
                    "connection_status": connection_status
                }),
                async: false,
                success: function (data) {
                  //  console.log('success');
                    sessionStorage.removeItem("chat_lastdisconnect_sent");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    console.log("Error: " + errorThrown);
                    sessionStorage.setItem("chat_lastdisconnect_sent", "N");
                }
            });
        },
        browserClosed: function (is_reloaded) {
            var browser_fingerprint = localStorage.getItem("browserfingerprint");
            var service_key = localStorage.getItem('service_key');
            if (browser_fingerprint === null || service_key === null) {
                return;
            }
            var url = IMIGeneral.profileUrl() + "livechats/" + service_key + "/customers/" + browser_fingerprint + "/browserclosed?host=" + IMIGeneral.getDomain();
            // console.log(url);
            $.ajax({
                url: url,
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({
                    "is_reloaded": is_reloaded
                }),
                async: false,
                success: function (data) {
                   // console.log('success');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {

                    console.log("Error: " + errorThrown);
                }
            });
        },
        setWidgetbuttonStyle: function (hasChats) {
            SetWidgetbuttonStyle(hasChats);
        },
        sendQuickreply: function (ctrl) {
            sendQuickreply(ctrl);
        },
        applyQuickreplyHover: function (ctrl) {
            if (lightness > 80) {

                $(ctrl).css("color", "#333333");
                $(ctrl).css("background-color", mtcolor);

            } else {
                $(ctrl).css("color", "#ffffff");
                $(ctrl).css("background-color", mtcolor);

            }

        },
        applyQuickreplyMouseOut: function (ctrl) {

            $(ctrl).css("color", mtcolor);
            $(ctrl).css("background-color", '#ffffff');
        },
        getCurrentUTCdate: function () {
            return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
            /* var curtime = new Date();
             var month = (parseInt(curtime.getUTCMonth()) + 1);
             if (month < 10) {
                 month = "0" + month;
             }
             var min = curtime.getUTCMinutes();
             if (min < 10) {
                 min = "0" + min;
             }
             var sec = curtime.getUTCSeconds();
             if (sec < 10) {
                 sec = "0" + sec;
             }
             return curtime.getUTCFullYear() + "-" + month + "-" + curtime.getUTCDate() + " " + curtime.getUTCHours() + ":" + min + ":" + sec + ".001";
             */
        },
        convertToUTCTime: function (msgTime) {
            msgTime = moment(msgTime).local();
            msgTime = moment.utc(msgTime).format('YYYY-MM-DD HH:mm:ss.SSS');
            return msgTime;
            /* msgTime = new Date(msgTime);
             var month = (parseInt(msgTime.getUTCMonth()) + 1);
             if (month < 10) {
                 month = "0" + month;
             }
             var min = msgTime.getUTCMinutes();
             if (min < 10) {
                 min = "0" + min;
             }
             var sec = msgTime.getUTCSeconds();
             if (sec < 10) {
                 sec = "0" + sec;
             }
             return msgTime.getUTCFullYear() + "-" + month + "-" + msgTime.getUTCDate() + " " + msgTime.getUTCHours() + ":" + min + ":" + sec + ".001";
             */
        },
        GetEmojis: function () {
            GetEmojis();
        },
        OpenEmoji: function () {
            OpenEmoji();
        },
        sendemoji: function (data) {
            sendemoji(data);
        },
        bindemoji: function (data, setttings) {
            bindemoji(data, setttings);
        },
        modifyChatCustomFields: function (type, data) {
            var customchatfields = null;
            try {
                var jsonData = $.parseJSON(data);
                if (jsonData == undefined || jsonData.custom_chat_fields == undefined) {
                    console.log('invalid json data- custom fields:' + data);
                    return false;
                }
            }
            catch (e) {
                console.log('invalid json data:' + data);
                return false;
            }
            if (type = 'add') {
                var jsonData = $.parseJSON(data);
                if (jsonData != undefined && jsonData.custom_chat_fields != undefined) {
                    customchatfields = jsonData.custom_chat_fields;
                }
                else {
                    return false;
                }
            }
            else {
                /* if (IMILiveChat.getChatCustomFeilds()) {
                     customchatfields = $.parseJSON(IMILiveChat.getChatCustomFeilds());
                 }
                 */
                var updateData = $.parseJSON(data);
                if (updateData != undefined && updateData.custom_chat_fields != undefined) {
                    /* $.each(updateData, function (key, val) {
                         customchatfields[key] = val;
                     });
                     */
                    customchatfields = updateData.custom_chat_fields;
                }
                else {
                    return false;
                }
            }
            sessionStorage.setItem('imichat_custom_chat_fields', JSON.stringify(customchatfields));
            return true;
        },
        getChatCustomFeilds: function () {
            return sessionStorage.getItem('imichat_custom_chat_fields');
        }
    };
}(jQuery);
//IMILiveChat.init();
function jsonPcallback(msg) {
    try {
        if (msg != '' && msg != undefined) {
            var jData = msg;
            if (jData != null) {
                if (jData.statusCode == "2400") {
                    var appData = jData.response.data;
                    if (appData == null || appData == undefined)
                        appData = jData.response;
                    var appid = appData.appid;
                    if (appid != "" && appid != undefined) {
                        IMIGeneral.setSession("appid", appid);
                        IMIGeneral.setSession("appkey", appData.clientkey);
                        IMIGeneral.setSession("teamname", appData.teamname);
                        $("#icworganization").html(appData.oraganization);
                        IMILiveChat.registerRTM();
                        ////alert($('.wdt-emoji-picker').length);

                        /* if (localStorage.getItem("tsemail") != IMILiveChat.browserfingerprint()) {
                             $('#opttranscript').css("display", "none");
                         }*/
                    } else {
                        // IMILiveChat.startErrMsg("unable to register");
                        $("#start-chat").attr('disabled', false);
                        $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
                    }
                } else if (jData.statusCode == "2401") {
                    //IMILiveChat.startErrMsg("You are not authorized to use this service.");
                    $("#start-chat").attr('disabled', false);
                    $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
                } else {
                    //IMILiveChat.startErrMsg("unable to register");
                    $("#start-chat").attr('disabled', false);
                    $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
                }

            } else {
                // IMILiveChat.startErrMsg("unable to register");
                $("#start-chat").attr('disabled', false);
                $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
            }

        } else {
            // IMILiveChat.startErrMsg("unable to register");
            $("#start-chat").attr('disabled', false);
            $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
        }
    } catch (e1) {
        // IMILiveChat.startErrMsg("unable to connect");
        $("#start-chat").attr('disabled', false);
        $('#start-chat').attr('onClick', 'IMILiveChat.startchat()');
    }
}

function chattranscript(msg) {
    try {

        if (msg != '' && msg != undefined) {
            $("#txtEmail").val('');
            $("#sendemailtranscript").modal("hide");
            $("#divtscriptfooter").css("display", "none");
            $("#divmodalbody").html('');
            if (msg == "1") {
                $("#divmodalbody").append("<p>Chat transcript will be sent to " + localStorage.getItem('email-id-{0}'.format(IMILiveChat.getCurrentThreadId())) + " once the chat is closed by the agent</p>");
                $("#emailtranscript").modal();
            } else if (msg == "2") {
                $("#divmodalbody").append("<p>New Chat: Transcripts can be requested on chats that hold atleast one message.</p>");
                $("#emailtranscript").modal();
            } else if (msg == "3") {

                $("#divmodalbody").append("<p>RTF: Email Transcript cannot be sent if Right to be Forgotten has been invoked. Please contact your agent for further assistance.</p>");
                $("#emailtranscript").modal();
            } else if (msg == "10" || msg == "11") {
                $("#divmodalbody").append("<p>Unable to process your request. Please contact your agent for further assistance.</p>");
                $("#emailtranscript").modal();
            } else if (msg == "0") {
                $("#divmodalbody").append("<p>Chat transcript will be sent to " + localStorage.getItem('email-id-{0}'.format(IMILiveChat.getCurrentThreadId())) + "</p>");
                $("#emailtranscript").modal();
            }
            sessionStorage.setItem("tscriptemail", msg);
        } else {

        }
    } catch (e1) {

    }

}

function ShowChatMessages(ctrl) {
    $('#hdnicwagent').val('');
    LoadChat($(ctrl).attr("id"), parseInt($(ctrl).attr("data-proactive-id")));

    if ($('#' + $(ctrl).attr("id") + ' .agent-name').text() !== 'New Conversation') {
        $("#chatpageheading,#smallchatpageheading").text($('#' + $(ctrl).attr("id") + ' .agent-name').text());
        $("#hdnicwagent").val($('#' + $(ctrl).attr("id") + ' .agent-name').text());
    }
    document.getElementById("chat").scroll();
    setTimeout(function () {
        calcchatheight();
        $('#icwdivcarea').scrollTop($('#icwdivcarea')[0].scrollHeight);
    }, 100);
}

function LoadChat(threadid, proactive_id) {
    if (proactive_id !== undefined && proactive_id > 0) {
        _cur_proactive_id = proactive_id;
        IMILiveChat.updateProactiveMetrics(proactive_id, 2);
    }
    else {
        _cur_proactive_id = 0;
    }

    //
    $('#icwdivcarea').html('');
    // $('#ico_attachment').show();
    if (_widget_settings.isemojienable) {
        $('.wdt-emoji-picker').show();
    }
    if (_widget_settings.isattachmentenabled) {
        $('#ico_attachment').show();
    } else {
        $('#ico_attachment').hide();
    }
    $("#chat_submit_box").hide();
    $("#chat").show();
    //
    IMILiveChat.setCurrentThreadId(threadid);
    IMILiveChat.getWCPreviousHistory();

    if (!$('#aSend').hasClass('disable')) {
        $('#aSend').addClass('disable');
    }
    // $("#chat_submit_box").show();
    $("#dLabel").show();
    $("#backicon").show();
    $("#chatthreads").hide();
    $("#new-conversation").hide();
    $('#icwmsg').focus();
    $("#opttranscript").show();
}

window.addEventListener('message', function (event) {
    switch (event.data.action) {
        case 'trigger_pro_messaging':
            IMILiveChat.registerRTM(function () {
                IMILiveChat.createThread('proactive', function (thread_id) {
                    IMILiveChat.triggerProactiveMessaging(event.data.proactive_id, thread_id);
                })
            });
            //IMILiveChat.registerRTM();
            //IMILiveChat.createThread('proactive', function (thread_id) {
            //    IMILiveChat.triggerProactiveMessaging(event.data.proactive_id, thread_id);
            //});

            break;
        case 'proactive-manager-loaded':
            _attr_key = event.data.attrkey;
            if (_widget_settings != null && _widget_settings.enable_proactive) {
                IMILiveChat.getProactiveSettings(event.data.attrkey, event.data.host, function () {
                    setTimeout(function () {
                        window.parent.postMessage({
                            message: _proactive_settings,
                            action: 'proactive_settings'
                        }, "*");
                    }, 300);
                });
            }
            break;
        case 'repeat_customer':
            localStorage.setItem('repeat_customer', event.data.repeat_customer);
            break;
        case 'showiframe':
            LoadPrevChats();
            break;
        case 'register_rtm':
            IMILiveChat.registerRTM();
            break;
        case 'imichat_custom_chat_fields':
            if (IMILiveChat.modifyChatCustomFields(event.data.type, event.data.data)) {
                setTimeout(function () {
                    window.parent.postMessage({
                        
                        type: event.data.type,
                        response: "success",
                        action: 'imichat_custom_chat_fields'
                    }, "*");
                }, 300);
            }
            else {
                setTimeout(function () {
                    window.parent.postMessage({
                      
                        type: event.data.type,
                        response:"error",
                        action: 'imichat_custom_chat_fields'
                    }, "*");
                }, 300);
            }
            break;
    }
});
/*
Abandone chat processing functionality will best work if timespan between multiple refresh is more than 2 second.
Time span less than 2 second can result in to wrong abandone chats processing.
This is a technical limitation.
*/
var abandone_chats = true;

window.addEventListener("beforeunload", function (e) {
    abandone_chats = true;
    //IMILiveChat.processAbandonedChats(false, true);
});

/* Dissconnect Issue */

function CheckDisConnects() {
    setInterval(function () { CheckIsconnected() }, 10000)
}
function CheckIsconnected() {
    var messaging = IMI.ICMessaging.getInstance();

    if (!messaging.isConnected()) {

        if (sessionStorage.getItem("chat_lastdisconnect_sent") != "N") {
            var currTime = new Date().getTime();
            isConnectionOpened = messaging.isConnected();
            var lastupdatedtimestamp = sessionStorage.getItem("chat_lastdisconnect");
            if (lastupdatedtimestamp == null || lastupdatedtimestamp == "null" || lastupdatedtimestamp == undefined) {
                sessionStorage.setItem("chat_lastdisconnect", currTime);
            }
            else {
                if (lastupdatedtimestamp !== null && !isConnectionOpened) {
                    var timeDiff = currTime - lastupdatedtimestamp;
                    if ((timeDiff <= 60000)) {//is less than 1 minutes
                        //throw IMI.ICErrorCodes.ConnectionAlreadyExists;
                        //call api
                        IMILiveChat.sendConnectionLostLog();
                        sessionStorage.removeItem("chat_lastdisconnect");
                    }
                    else if (timeDiff > 60000) {
                        sessionStorage.setItem("chat_lastdisconnect", currTime);
                    }
                }
            }
        }
    }
    else {
        //connected
        if (sessionStorage.getItem("chat_lastdisconnect_sent") == "N") {
            IMILiveChat.sendConnectionLostLog();
            sessionStorage.removeItem("chat_lastdisconnect");
        }
    }
}