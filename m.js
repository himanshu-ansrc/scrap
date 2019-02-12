/*! memeful 27-08-2018 */ ! function() {
    if (Object.defineProperty && Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(Element.prototype, "textContent") && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
        var a = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
        Object.defineProperty(Element.prototype, "textContent", {
            get: function() {
                return a.get.call(this)
            },
            set: function(b) {
                return a.set.call(this, b)
            }
        })
    }
}();
var memeful = memeful || {};
! function(a) {
    memeful.localStorage = memeful.localStorage || {}, memeful.localStorage.set = function(a, b, c) {
        if ("undefined" != typeof Storage && JSON && "undefined" != typeof JSON.stringify) try {
            var d = "memeful:ls:" + a,
                e = "memeful:ls:" + a + ":ts",
                f = (new Date).getTime(),
                g = f + 1e3 * c;
            localStorage.setItem(d, JSON.stringify(b)), localStorage.setItem(e, g)
        } catch (h) {
            console.log("error")
        }
    }, memeful.localStorage.get = function(a) {
        if ("undefined" != typeof Storage && JSON && "undefined" != typeof JSON.parse) try {
            var b = "memeful:ls:" + a,
                c = "memeful:ls:" + a + ":ts",
                d = localStorage.getItem(c),
                e = localStorage.getItem(b);
            if (d && e) {
                var f = (new Date).getTime();
                if (+d > f) return JSON.parse(e)
            }
        } catch (g) {
            console.log("error")
        }
        return !1
    }
}(jQuery);
var GA = {
        track: function(a, b, c, d) {
            try {
                if (void 0 == d && (d = 1), ga("send", "event", a, b, c, d), window._ga && window._ga instanceof Array)
                    for (var e = 0; e < window._ga.length; e++) {
                        var f = window._ga[e];
                        ga(f + ".send", "event", a, b, c, d)
                    }
            } catch (g) {}
        }
    },
    memeful = memeful || {};
! function(a) {
    memeful.filterTemplates = function(b, c) {
        var d = [];
        return c = c.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "\\$&"), a.each(b, function(a, b) {
            name = b.get("name"), -1 != name.search(new RegExp(c, "i")) ? d.push(b) : "string" == typeof b.get("tag") && -1 != b.get("tag").search(new RegExp(c, "i")) && d.push(b)
        }), d
    }
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.uaHelper = memeful.uaHelper || {}, memeful.uaHelper.isIE = function() {
        return -1 != navigator.userAgent.indexOf("MSIE")
    }
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.ApiResponse = Backbone.Model.extend({
        defaults: function() {
            return {}
        }
    })
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.Template = Backbone.Model.extend({
        defaults: function() {
            return {}
        }
    })
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.ApiResponses = Backbone.Collection.extend({})
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.TemplateList = Backbone.Collection.extend({
        model: memeful.Template,
        comparator: function(a) {
            return -a.get("count")
        },
        adminMode: !1,
        setAdminMode: function() {
            this.adminMode = !0
        },
        getTemplates: function() {
            if (this.adminMode) var b = memeful.param.api + "admin/api/all";
            else {
                var b = memeful.param.api + "api/all",
                    c = memeful.localStorage.get("apiall");
                if (c) return void this.apiObjToTemplates(c)
            }
            that = this, a.ajax({
                crossDomain: !0,
                type: "GET",
                url: b,
                dataType: "json"
            }).done(function(a) {
                a.data && (that.adminMode || memeful.localStorage.set("apiall", a.data, 300), that.apiObjToTemplates(a.data))
            }).fail(function(a, b, c) {
                console.log("unexpected error: " + b + ", " + c)
            })
        },
        apiObjToTemplates: function(b) {
            var c = [];
            a.each(b, function(a, b) {
                template = new memeful.Template(b), c.push(template)
            }), this.reset(c)
        }
    })
}(jQuery);
var memeful = memeful || {};
! function() {
    "use strict";
    memeful.AppRouter = Backbone.Router.extend({
        routes: {
            generator: "index",
            "edit/:seo": "editTemplate",
            "edit/:id/:seo": "editMemeWithId",
            "*default": "default"
        },
        index: function() {
            memeful.app.render()
        },
        editTemplate: function(a) {},
        editMemeWithId: function(a, b) {},
        "default": function() {}
    })
}();
var memeful = memeful || {};
! function(a) {
    memeful.AdminAppView = Backbone.View.extend({
        el: a("#meme-content"),
        currentPaginationLimit: 40,
        perPaginationCount: 20,
        shownItemsCount: 0,
        shownItems: {},
        template: function() {
            return ""
        },
        templateIDsPassedSearch: !1,
        events: {
            "click .sort-btn": "sortButtonHandler"
        },
        initialize: function() {
            this.listenTo(this.collection, "reset", this.addAll), this.listenTo(this.collection, "sort", this.addAll), this.collection.setAdminMode(), this.collection.getTemplates()
        },
        render: function() {
            a("#jsid-adminview-template").length && (this.template = _.template(a("#jsid-adminview-template").html())), this.$el.html(this.template()), this.addAll(), _.bindAll(this, "scrollHandler"), a(window).scroll(this.scrollHandler)
        },
        sortButtonHandler: function(b) {
            a(".btn-primary").removeClass("btn-primary");
            var c = a(b.target);
            c.hasClass("sort-btn") || (c = c.parents(".sort-btn")), c.addClass("btn-primary"), c.hasClass("sort-alpha") ? this.collection.comparator = "name" : this.collection.comparator = function(a) {
                return -a.get("count")
            }, this.collection.sort()
        },
        scrollHandler: function(b) {
            var c = a(window).scrollTop(),
                d = a(window).height(),
                e = a(document).height();
            c + d >= e - d / 2 && (this.currentPaginationLimit += this.perPaginationCount, this.addMore())
        },
        addOne: function(a) {
            if (this.shownItemsCount <= this.currentPaginationLimit) {
                var b = a.get("id");
                if (this.shownItems[b]) return;
                if (this.templateIDsPassedSearch && !this.templateIDsPassedSearch[b]) return;
                this.shownItems[b] = !0, this.shownItemsCount++;
                var c = new memeful.TemplateView({
                    model: a
                });
                c.setAdminMode(), this.$("#jsid-templates-list").append(c.render().el)
            }
        },
        addMore: function() {
            this.collection.each(this.addOne, this)
        },
        addAll: function() {
            this.$("#jsid-templates-list").empty(), this.shownItemsCount = 0, this.shownItems = {}, this.collection.each(this.addOne, this)
        },
        performSearch: function(b) {
            var c = memeful.filterTemplates(this.collection.models, b),
                d = {};
            a.each(c, function(a, b) {
                d[b.get("id")] = !0
            }), this.templateIDsPassedSearch = d, this.addAll()
        },
        resetSearch: function() {
            this.templateIDsPassedSearch = !1
        }
    })
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.AppView = Backbone.View.extend({
        el: a("#meme-content"),
        currentPaginationLimit: 40,
        perPaginationCount: 20,
        shownItemsCount: 0,
        shownItems: {},
        mode: "all",
        template: function() {
            return ""
        },
        isBrowserVisible: !1,
        templateIDsPassedSearch: !1,
        collectionDoneFetching: !1,
        events: {
            "click #meme-nav-all": "filterClickHandler",
            "click #meme-nav-new": "filterClickHandler"
        },
        initialize: function() {
            this.listenTo(this.collection, "reset", this.collectionResetHandler), _.bindAll(this, "editRouteHandler"), _.bindAll(this, "editRouteHandler2Param"), memeful.router.on("route:editTemplate", this.editRouteHandler), memeful.router.on("route:editMemeWithId", this.editRouteHandler2Param), this.collection.getTemplates(), this.setUpFileUploadListeners()
        },
        editRouteHandler: function(a) {
            this.openEditorViewBySeo(a)
        },
        editRouteHandler2Param: function(a, b) {
            this.openEditorViewBySeo(b)
        },
        render: function() {
            memeful.modelFromView = !1, a("#jsid-appview-template").length && (this.template = _.template(a("#jsid-appview-template").html())), this.$el.html(this.template({
                filterTemplateMode: "all"
            })), this.isBrowserVisible = !0, this.addAll(), _.bindAll(this, "scrollHandler"), a(window).scroll(this.scrollHandler)
        },
        collectionResetHandler: function() {
            this.collectionDoneFetching = !0, this.addAll()
        },
        filterClickHandler: function(b) {
            var c = a(b.target);
            if (c.hasClass("badge-template-filter-all")) var d = "all";
            else {
                if (!c.hasClass("badge-template-filter-new")) return;
                var d = "new"
            }
            if (this.mode != d) {
                switch (this.mode = d, this.mode) {
                    case "new":
                        a("#meme-nav-new").addClass("selected"), a("#meme-nav-all").removeClass("selected");
                        break;
                    default:
                    case "all":
                        a("#meme-nav-all").addClass("selected"), a("#meme-nav-new").removeClass("selected")
                }
                this.addAll()
            }
        },
        scrollHandler: function(b) {
            var c = a(window).scrollTop(),
                d = a(window).height(),
                e = a(document).height();
            c + d >= e - d / 2 && (this.currentPaginationLimit += this.perPaginationCount, this.addMore())
        },
        addOne: function(a) {
            if (this.isBrowserVisible && this.shownItemsCount <= this.currentPaginationLimit) {
                var b = a.get("id");
                if (this.shownItems[b]) return;
                if ("new" == this.mode && !a.get("isNew")) return;
                if (this.templateIDsPassedSearch && !this.templateIDsPassedSearch[b]) return;
                this.shownItems[b] = !0, this.shownItemsCount++;
                var c = new memeful.TemplateView({
                    model: a
                });
                this.$("#jsid-templates-list").append(c.render().el)
            }
        },
        addMore: function() {
            this.collection.each(this.addOne, this), this.memeListItemsChangedHelper()
        },
        addAll: function() {
            this.$("#jsid-templates-list").empty(), this.shownItemsCount = 0, this.shownItems = {}, this.collection.each(this.addOne, this), this.memeListItemsChangedHelper()
        },
        memeListItemsChangedHelper: function() {
            this.collectionDoneFetching && (0 == this.shownItemsCount ? this.$(".badge-zero-template-message").removeClass("hidden") : this.$(".badge-zero-template-message").addClass("hidden"))
        },
        openEditorViewByModel: function(a) {
            this.isBrowserVisible = !1;
            var b = null;
            "undefined" != typeof a.get && (b = a.get("seo")), b ? memeful.router.navigate("edit/" + b) : memeful.router.navigate("generator"), memeful.editor && memeful.editor.destory(), memeful.editor = new memeful.EditorView({
                model: a
            })
        },
        openEditorViewBySeo: function(a) {
            if (memeful.modelFromView && memeful.modelFromView.seo == a) {
                var b = new memeful.Template(memeful.modelFromView);
                return void this.openEditorViewByModel(b)
            }
            var c = this.collection.findWhere({
                seo: a
            });
            return c ? void this.openEditorViewByModel(c) : void memeful.router.navigate("")
        },
        openEditorViewByUpload: function(a) {
            var b = {
                "image/png": !0,
                "image/jpeg": !0,
                "image/gif": !0
            };
            try {
                var c = a.size / 1024 / 1024;
                if (c > 4) return void alert("Sorry, file size is too large, please upload a smaller image.")
            } catch (d) {
                return
            }
            var e = this;
            if (b[a.type] === !0) {
                var f = new FileReader;
                f.onload = function(a) {
                    var b = {
                        get: function() {
                            return !1
                        },
                        file: a.target.result,
                        local: !0
                    };
                    e.openEditorViewByModel(b)
                }, f.readAsDataURL(a)
            } else alert("Sorry, file type is not supported.")
        },
        performSearch: function(b) {
            var c = memeful.filterTemplates(this.collection.models, b),
                d = {};
            a.each(c, function(a, b) {
                d[b.get("id")] = !0
            }), this.templateIDsPassedSearch = d, this.isBrowserVisible ? this.addAll() : this.render()
        },
        resetSearch: function() {
            this.templateIDsPassedSearch = !1
        },
        setUpFileUploadListeners: function() {
            var b = this;
            a("#meme-editor-file").on("change", function(a) {
                b.openEditorViewByUpload(a.target.files[0])
            });
            var c = {
                filereader: "undefined" != typeof FileReader,
                dnd: "draggable" in document.createElement("span")
            };
            if (c.dnd) {
                var d = !1,
                    e = !1;
                document.body.ondragover = function() {
                    return e ? void 0 : (a("#drop-file-mask").addClass("dragging"), d && clearTimeout(d), d = setTimeout(function() {
                        a("#drop-file-mask").removeClass("dragging")
                    }, 1e3), !1)
                }, document.body.ondragstart = function(a) {
                    e = !0
                }, document.body.ondragend = function() {
                    return e ? void(e = !1) : (a("#drop-file-mask").removeClass("dragging"), !1)
                }, document.body.ondrop = function(c) {
                    return e ? void(e = !1) : (a("#drop-file-mask").removeClass("dragging"), c.preventDefault(), void b.openEditorViewByUpload(c.dataTransfer.files[0]))
                }
            }
        }
    })
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.BodyView = Backbone.View.extend({
        el: a("body"),
        events: {
            click: "clickHandler"
        },
        clickHandler: function(b) {
            var c = a(b.target),
                d = [];
            if (d = c.hasClass("badge-close-group-root") ? c : c.parents(".badge-close-group-root"), d.length) {
                var e = d.attr("data-close-group-class");
                e && a(".badge-close-when-others-clicked").each(function(b, c) {
                    a(c).hasClass(e) || a(c).addClass("hide")
                })
            } else a(".badge-close-when-others-clicked").addClass("hide")
        }
    })
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.EditorView = Backbone.View.extend({
        el: a("#meme-content"),
        model: memeful.Template,
        memeEditorTemplate: null,
        imageDataUrl: null,
        textType: {
            top: "t1",
            bottom: "t2"
        },
        currentTopText: "",
        currentBottomText: "",
        fontSizeFactors: {
            text1: 1,
            text2: 1
        },
        events: {
            "keyup #meme-editor-text1": "topTextChanged",
            "keyup #meme-editor-text2": "bottomTextChanged",
            "click #meme-editor-text1-increase-font-size": "increaseTopFontSize",
            "click #meme-editor-text2-increase-font-size": "increaseBottomFontSize",
            "click #meme-editor-text1-decrease-font-size": "decreaseTopFontSize",
            "click #meme-editor-text2-decrease-font-size": "decreaseBottomFontSize",
            "click #meme-editor-submit": "submitMeme"
        },
        initialize: function() {
            this.memeEditorTemplate = _.template(a("#jsid-meme-editor-template").html()), _.bindAll(this, "renderCanvasWithImage"), this.image = new Image, this.$el.empty(), this.render()
        },
        destory: function() {
            this.undelegateEvents(), this.$el.empty()
        },
        render: function() {
            return this.$el.html(this.memeEditorTemplate()), this.canvas = this.$("#meme-editor-canvas"), this.model.get("name") ? (document.title = this.model.get("name") + " Â· Memeful", this.$("#jsid-editor-title").html(this.model.get("name"))) : this.$("#jsid-editor-title").html("New Image"), document.body.scrollTop = 0, this.$("#meme-editor-text1") && this.$("#meme-editor-text1").focus(), this.model.local ? (this.image.onload = this.renderCanvasWithImage, void(this.image.src = this.model.file)) : (this.image.setAttribute("crossOrigin", "anonymous"), memeful.uaHelper.isIE() ? this.image.src = document.location.origin + "/ie/:id".replace(":id", this.model.get("id")) : this.image.src = this.model.get("file") + "?o=" + encodeURIComponent(document.location.origin), this.model.get("prefill_text1") && (this.currentTopText = this.model.get("prefill_text1"), this.$("#meme-editor-text1").val(this.currentTopText)), this.model.get("prefill_text2") && (this.currentBottomText = this.model.get("prefill_text2"), this.$("#meme-editor-text2").val(this.currentBottomText)), void(this.image.onload = this.renderCanvasWithImage))
        },
        submitMeme: function(b) {
            b.preventDefault(), b.stopPropagation();
            var c = a(b.target);
            c.addClass("loading"), c.prop("disabled", !0), this.drawCanvas(!1);
            var d = {
                template_title: this.model.get("name"),
                template_id: this.model.get("id"),
                data: this.canvas[0].toDataURL("image/jpeg"),
                top: this.$("#meme-editor-text1").val().trim(),
                bottom: this.$("#meme-editor-text2").val().trim()
            };
            a.ajax({
                type: "POST",
                url: "/upload",
                data: d,
                dataType: "json"
            }).done(function(a) {
                console.log(a), a.template_id, a.share_url ? document.location.href = a.share_url : document.location.href = "/generator"
            }).fail(function(a, b) {
                console.log("unexpected error on uploading image: " + b)
            })
        },
        topTextChanged: function(a) {
            this.currentTopText = this.$("#meme-editor-text1").val(), this.drawCanvas(!0)
        },
        bottomTextChanged: function(a) {
            this.currentBottomText = this.$("#meme-editor-text2").val(), this.drawCanvas(!0)
        },
        increaseTopFontSize: function(a) {
            a.preventDefault(), a.stopPropagation(), this.changeFontSizeHelper(this.textType.top, .1), this.drawCanvas(!0)
        },
        increaseBottomFontSize: function(a) {
            a.preventDefault(), a.stopPropagation(), this.changeFontSizeHelper(this.textType.bottom, .1), this.drawCanvas(!0)
        },
        decreaseTopFontSize: function(a) {
            a.preventDefault(), a.stopPropagation(), this.changeFontSizeHelper(this.textType.top, -.1), this.drawCanvas(!0)
        },
        decreaseBottomFontSize: function(a) {
            a.preventDefault(), a.stopPropagation(), this.changeFontSizeHelper(this.textType.bottom, -.1), this.drawCanvas(!0)
        },
        changeFontSizeHelper: function(a, b) {
            if (a == this.textType.top) {
                var c = this.fontSizeFactors.text1;
                c + b >= .1 && (this.fontSizeFactors.text1 = c + b)
            } else if (a == this.textType.bottom) {
                var c = this.fontSizeFactors.text2;
                c + b >= .1 && (this.fontSizeFactors.text2 = c + b)
            }
        },
        renderCanvasWithImage: function() {
            var a = this.canvas[0],
                b = 600;
            a.width = b, a.height = this.image.height * b / this.image.width;
            try {
                a.toDataURL()
            } catch (c) {
                return this.image.src = document.location.origin + "/ie/:id".replace(":id", this.model.get("id")), !1
            }
            var d = a.getContext("2d");
            d.fillStyle = "white", d.strokeStyle = "black", d.lineWidth = 4, d.textAlign = "center";
            var e = a.height / 8;
            d.font = e + "px Impact Web, Impact", d.miterLimit = 2, this.drawCanvas(!0)
        },
        drawCanvas: function(a) {
            this.drawImage();
            var b = this.currentTopText,
                c = this.currentBottomText;
            a && "" == b && (b = "top text"), a && "" == c && (c = "bottom text"), this.drawText(b, this.textType.top), this.drawText(c, this.textType.bottom)
        },
        drawImage: function() {
            var a = this.canvas[0];
            a.getContext("2d").drawImage(this.image, 0, 0, a.width, a.height)
        },
        drawText: function(a, b, c, d) {
            a = a.toUpperCase();
            var e = this.canvas[0],
                f = e.getContext("2d");
            b = b || this.textType.top;
            var g = .06,
                h = .0798,
                i = 20,
                j = 10,
                k = d;
            if (!k) {
                var l = e.width * h;
                b == this.textType.top ? k = l * this.fontSizeFactors.text1 : b == this.textType.bottom && (k = l * this.fontSizeFactors.text2)
            }
            f.font = k + "px Impact Web, Impact", f.miterLimit = 2;
            for (var m = e.width / 2, n = a.split(" "), o = n[0], p = 0; p < n.length; p++) o = n[p].length > o.length ? n[p] : o;
            var q = !1;
            if (!d && f.measureText(o).width > e.width - 36) {
                for (var p = h; p >= g; p = .9 * p)
                    if (k = .9 * k, f.font = k + "px Impact Web, Impact", f.measureText(o).width < e.width - 36) {
                        q = !0;
                        break
                    }
            } else q = d ? !1 : !0;
            if (c = "undefined" == typeof c ? k + j : c, b === this.textType.bottom && (c = e.height - i), f.measureText(a).width > e.width - 36) {
                var r = n.length;
                if (b === this.textType.top) {
                    for (var p = r, s = []; p--;) {
                        var t = n.slice(0, p).join(" ");
                        if (-1 != t.indexOf("\n")) {
                            for (var u = a.split("\n"), v = 0; v < u.length; v++) s = s.concat(this.getLines_(u[v].split(" "), e, f));
                            n = n.slice(p, n.length - (u.length - 1)), p = n.length - (u.length - 1)
                        } else f.measureText(t).width <= e.width - 36 ? (s.push(t), n = n.slice(p, r), p = r = n.length + 1, a = n.slice(0, p).join(" ")) : 1 == p && n.length > 0 && (s.push(t), n = n.slice(p, n.length), p = n.length + 1);
                        if (0 == t.length || 0 == n.length) break
                    }
                    if (s.length > 1) return void this.drawLines(s, b, m, e, f, j, i, k)
                } else if (b === this.textType.bottom) {
                    for (var p = r, s = []; p--;) {
                        var t = n.slice(0, p).join(" ");
                        if (-1 != t.indexOf("\n")) {
                            for (var u = a.split("\n"), v = 0; v < u.length; v++) s = s.concat(this.getLines_(u[v].split(" "), e, f));
                            n = n.slice(p, n.length - (u.length - 1)), p = n.length - (u.length - 1)
                        } else f.measureText(t).width <= e.width - 36 ? (s.push(t), n = n.slice(p, r), p = r = n.length + 1, a = n.slice(0, p).join(" ")) : 1 == p && n.length > 0 && (s.push(t), n = n.slice(p, n.length), p = n.length + 1);
                        if (0 == t.length || 0 == n.length) break
                    }
                    if (s.length > 1) return void this.drawLines(s, b, m, e, f, j, i, k)
                }
            }
            var u = a.split("\n");
            this.drawLines(u, b, m, e, f, j, i, k)
        },
        drawLines: function(a, b, c, d, e, f, g, h) {
            for (var i = 0; i < a.length; i++) {
                b === this.textType.top && (y = f + (i + 1) * h), b === this.textType.bottom && (y = d.height - g - Math.max(0, a.length - i - 1) * h);
                var j = a[i].trim(),
                    k = 2 * Math.round(.9 * d.width / 2);
                e.strokeText(j, c, y, k), e.fillText(j, c, y, .9 * d.width)
            }
        },
        getLines_: function(a, b, c) {
            var d = a.length,
                e = a.length,
                f = [],
                g = a.join(" ");
            if (1 == d || c.measureText(g).width <= b.width - 36) return f.push(g), f;
            for (; e--;) {
                var h = a.slice(0, e).join(" ");
                if (c.measureText(h).width <= b.width - 36 ? (f.push(h), a = a.slice(e, d), e = d = a.length + 1, g = a.slice(0, e).join(" ")) : 1 == e && a.length > 0 && (f.push(h), a = a.slice(e, a.length), e = a.length + 1), 0 == h.length || 0 == a.length) break
            }
            return f
        }
    })
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.HeaderBarView = Backbone.View.extend({
        el: a("#jsid-header-bar"),
        events: {
            "click #jsid-btn-get-app": "openGetAppMenu",
            "click #jsid-btn-contact-us": "openContactMenu"
        },
        openGetAppMenu: function() {
            this.$("#jsid-get-app").toggleClass("hide")
        },
        openContactMenu: function() {
            this.$("#jsid-contact-us").toggleClass("hide")
        }
    })
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.MiscView = Backbone.View.extend({
        el: a("body"),
        events: {
            "click #field-share-link": "highlightText"
        },
        highlightText: function(b) {
            var c = a(b.target);
            c.focus(), c.select()
        }
    })
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.SearchView = Backbone.View.extend({
        el: a("#search-div"),
        suggest_num: 4,
        box_height: 4,
        selectedPosition: -1,
        suggestionTemplate: null,
        emptySuggestionTemplate: null,
        currentResults: [],
        adminMode: !1,
        events: {
            "click #search-submit": "triggerSearchPage",
            "keyup #search-text": "updateOnKeyUp",
            "focus #search-text": "focusTextBox",
            "blur #search-text": "close",
            "keydown #search-text": "ignoreSomeKeys",
            "keypress #search-text": "ignoreSomeKeys",
            blur: "close"
        },
        initialize: function() {
            this.suggestionTemplate = _.template(a("#jsid-search-suggestion-template").html()), this.emptySuggestionTemplate = _.template(a("#jsid-search-no-suggestion-template").html())
        },
        focusTextBox: function(a) {
            this.$("#search-text").val() && this.$("#search-suggest").removeClass("hide"), this.$("#search-div").addClass("selected")
        },
        close: function(a) {
            a.target && "search-submit" == a.target.id && this.$("#search-suggest").addClass("hide"), this.$("#search-div").removeClass("selected")
        },
        ignoreSomeKeys: function(a) {
            38 == a.keyCode || 40 == a.keyCode ? a.preventDefault() : memeful.uaHelper.isIE() && 13 == a.keyCode && a.preventDefault()
        },
        setAdminMode: function() {
            this.adminMode = !0
        },
        triggerSearchPage: function() {
            this.$("#search-text").val() && (memeful.app.performSearch(this.$("#search-text").val()), this.$("#search-suggest").addClass("hide"))
        },
        updateOnKeyUp: function(b) {
            switch (b.keyCode) {
                case 13:
                    -1 == this.selectedPosition ? this.triggerSearchPage() : (memeful.modelFromView = !1, this.$("#search-list-id-" + this.selectedPosition).click());
                    break;
                case 38:
                case 40:
                    var c, d = this.selectedPosition;
                    c = 38 == b.keyCode ? -1 == d ? this.box_height - 1 : d - 1 : d + 1 > this.box_height - 1 ? -1 : d + 1, this.$("#search-list-id-" + d).removeClass("selected"), this.$("#search-list-id-" + c).addClass("selected"), this.selectedPosition = c;
                    break;
                default:
                    if (!this.$("#search-text").val()) return void this.$("#search-suggest").addClass("hide");
                    var e = memeful.filterTemplates(this.collection.models, this.$("#search-text").val()),
                        f = Math.min(e.length, this.suggest_num);
                    if (this.box_height = f, 0 == this.box_height) this.$("#jsid-search-suggest-list").html(this.emptySuggestionTemplate());
                    else {
                        var g = "";
                        this.currentResults = [];
                        for (var h = 0; f > h; h++) modelJson = e[h].toJSON(), modelJson.searchBoxIndex = h, g += this.suggestionTemplate(modelJson), this.currentResults.push(e[h]);
                        this.$("#jsid-search-suggest-list").html(g);
                        var i = this;
                        this.adminMode ? this.$(".badge-search-suggestion-item").on("click", function(b) {
                            b.preventDefault();
                            var c = a(b.target);
                            c.attr("href") || (c = c.parents("a")), location.href = c.attr("href")
                        }) : this.$(".badge-search-suggestion-item").on("click", function(b) {
                            b.preventDefault();
                            var c = a(b.target);
                            c.attr("id") && 0 == c.attr("id").indexOf("search-list-id-") || (c = c.parents("a"));
                            var d = +c.attr("id").replace("search-list-id-", "");
                            i.currentResults[d] && (i.$("#search-suggest").addClass("hide"), memeful.app.openEditorViewByModel(i.currentResults[d]))
                        })
                    }
                    this.$("#search-suggest").removeClass("hide")
            }
        }
    })
}(jQuery);
var memeful = memeful || {};
! function(a) {
    memeful.TemplateView = Backbone.View.extend({
        tagName: "li",
        template: function() {
            return ""
        },
        adminMode: !1,
        events: {
            click: "clicked"
        },
        initialize: function() {
            a("#jsid-template-template").length && (this.template = _.template(a("#jsid-template-template").html())), this.listenTo(this.model, "change", this.render), this.listenTo(this.model, "destroy", this.remove)
        },
        setAdminMode: function() {
            this.adminMode = !0, a("#jsid-admin-template-template").length && (this.template = _.template(a("#jsid-admin-template-template").html()))
        },
        render: function() {
            return this.$el.html(this.template(this.model.toJSON())), this.adminMode && (this.$el.addClass("meme-admin-library-meme"), this.model.get("isTrademarkSafe") && this.$el.addClass("highlight")), this
        },
        clicked: function(b) {
            if (this.adminMode) {
                if ("A" != b.target.nodeName.toUpperCase() && "INPUT" != b.target.nodeName.toUpperCase()) {
                    b.preventDefault(), console.log(b.target.nodeName);
                    var c = a(b.target).parents(".meme-admin-library-meme"),
                        d = c.find("input[name='trademarkSave[]']");
                    d.prop("checked", !d.prop("checked")), c.toggleClass("highlight")
                }
            } else b.preventDefault(), memeful.app.openEditorViewByModel(this.model)
        }
    })
}(jQuery);
var memeful = memeful || {};
$(function() {
    memeful.modelFromView = memeful.modelFromView || {}, memeful.templates = new memeful.TemplateList, memeful.searchView = new memeful.SearchView({
        collection: memeful.templates
    }), new memeful.HeaderBarView, new memeful.BodyView, new memeful.MiscView, memeful.router = new memeful.AppRouter, memeful.app = new memeful.AppView({
        collection: memeful.templates
    }), Backbone.history.start({
        pushState: !0,
        hashChange: !1
    })
});
