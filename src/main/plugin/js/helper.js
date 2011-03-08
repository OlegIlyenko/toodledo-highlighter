$(function() {
    chrome.extension.sendRequest({getStorage: true}, function(response) {
        var ls = response.ls
        var enabled = {all: ls["enabled-all"] == null || ls["enabled-all"] == undefined || ls["enabled-all"] == "true", layout: ls["enabled-layout"] == null || ls["enabled-layout"] == undefined || ls["enabled-layout"] == "true"}

        function setupPage() {
            addScript("Ajax.Responders.register({onComplete: function(obj) {if (!obj.url.match(/.*(set_cookie.php|get_contexts.php|get_tags.php)$/)) {var customEvent = document.createEvent('Event');customEvent.initEvent('ajaxRequest', true, true);$('ajaxInfo').dispatchEvent(customEvent)}}})")
        }

        function addScript(code) {
            var script = document.createElement( 'script' );
            script.type = 'text/javascript';
            script.innerHTML = code
            $(document.body).append(script );
        }

        function setupListener(listener) {
            $("<div id='ajaxInfo' />").css("display", "none").appendTo(document.body).bind("ajaxRequest", listener)
        }

        function doStuff() {
            ifEnabled(function (layout) {
                changeLook("con", "context", layout)
                changeLook("sat", "status", layout)
                changeLook("fol", "folder", layout)
                changeLook("gol", "goal", layout)
                changeLook("std", "startDate", layout)
                changeLook("due", "dueDate", layout)
                changeLook("rep", "repeat", layout)
                changeLook("len", "length", layout)
                changeLook("pri", "priority", layout)
                changeLook("tag", "tag", layout)

                if (layout) {
                    $(".dett:has(span[id^='tsk'])").addClass("taskHighlightedLayedout")
                }
            })
        }

        function changeLook(prefix, name, layout) {
            var back = ls[name + "-back"]
            var text = ls[name + "-text"]
            var show = ls[name + "-show"] == "true" ? true :(ls[name + "-show"] == "false" ? false : true)
            var prefix

            var css = {
                "background-color": "#" + back + " !important",
                color: "#" + text + " !important"
            }
            var cssSpan = {color: css.color}

            $("div.dets_top2 span[id^='" + prefix + "']:not(span[id^='lenx'])", "#tasks").addClass("highlightedTopSpan").css(css).map(function () {
                var parent$ = $(this).parent()
                $("span:contains('none'), span:contains('None'), span:contains('no date'), span:contains('No Folder'), span:contains('No Goal'), span:contains('No Context')", parent$)
                    .map(function () {
                        parent$.addClass("highlightNone")
                    })
            })

            $("div.dett:has(span[id^='" + prefix + "'])", "#tasks").each(function() {
                var dett$ = $(this)
                var span$ = $("span", dett$)

                span$.addClass("highlightedSpan" + (layout ? "-l" : "")).css(cssSpan)
                dett$.addClass("highlightedDiv" + (layout ? "-l" : "")).css(css)

                $("span:contains('none'), span:contains('None'), span:contains('no date'), span:contains('No Folder'), span:contains('No Goal'), span:contains('No Context')", dett$)
                    .map(function () {
                        dett$.addClass("highlightNone")
                    })

                if (show && layout) {
                    $(this).addClass("highlightedLayedout")
                } else {
                    if (layout) {
                        $(this).hide()
                    }
                }
            })
        }

        function ifEnabled(fn) {
            if (enabled.all) {
                fn(enabled.layout)
            }
        }

        setupListener(doStuff)
        setupPage()

        doStuff()
    })
})