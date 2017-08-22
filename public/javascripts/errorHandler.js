 // (function ($) {
            jQuery.extend({
                handleError: function (s, xhr, status, e) {
                    if (s.error) {
                        s.error.call(s.context || s, xhr, status, e);
                    }
                    if (s.global) {
                        (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [xhr, s, e]);
                    }
                },
                httpData: function (xhr, type, s) {
                    var ct = xhr.getResponseHeader("content-type"),
            xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
            data = xml ? xhr.responseXML : xhr.responseText;
                    if (xml && data.documentElement.tagName == "parsererror")
                        throw "parsererror";
                    if (s && s.dataFilter)
                        data = s.dataFilter(data, type);
                    if (typeof data === "string") {
                        if (type == "script")
                            jQuery.globalEval(data);
                        if (type == "json")
                            data = window["eval"]("(" + data + ")");
                    }
                    return data;
                }
            });
// });