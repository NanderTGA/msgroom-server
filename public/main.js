/* eslint-disable no-multi-assign */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
/* eslint-disable jsdoc/require-jsdoc */
/*! For license information please see main.js.LICENSE.txt */
(() => {
    var e = {
            617: () => {
                String.prototype.replaceAll ||
          (String.prototype.replaceAll = function (e, s) {
              return "[object regexp]" ===
              Object.prototype.toString.call(e).toLowerCase()
                  ? this.replace(e, s)
                  : this.replace(new RegExp(e, "g"), s);
          });
            },
            147: (e) => {
                "use strict";
                e.exports = JSON.parse(
                    "{\"name\":\"w96-winchat-server\",\"version\":\"1.1.0\",\"description\":\"\",\"main\":\"index.js\",\"scripts\":{\"test\":\"echo \\\"Error: no test specified\\\" && exit 1\",\"server\":\"node index.js\",\"build-ui\":\"webpack --config config/webpack.prod.js\",\"build-ui-dev\":\"webpack --config config/webpack.prod.js\"},\"private\":true,\"keywords\":[],\"author\":\"\",\"license\":\"ISC\",\"dependencies\":{\"cors\":\"^2.8.5\",\"emojibase\":\"^6.1.0\",\"emojibase-data\":\"^7.0.1\",\"express\":\"^4.17.1\",\"he\":\"^1.2.0\",\"ip6addr\":\"^0.2.5\",\"markdown-it\":\"^12.0.6\",\"markdown-it-block-image\":\"0.0.3\",\"socket.io\":\"^4.0.1\",\"sqlite3\":\"^4.2.0\",\"tor-test\":\"^0.2.1\"},\"devDependencies\":{\"webpack\":\"^5.76.2\",\"webpack-cli\":\"^5.0.1\"}}",
                );
            },
        },
        s = {};
    function t(n) {
        var o = s[n];
        if (void 0 !== o) return o.exports;
        var r = (s[n] = { exports: {} });
        return e[n](r, r.exports, t), r.exports;
    }
    (() => {
        "use strict";
        const e = {
            username   : "anon" + Math.floor(1e3 * Math.random()),
            user_id    : null,
            onlineUsers: [],
            blockedIds : [],
        };
        function s(s) {
            return e.onlineUsers.find((e) => e.id == s);
        }
        function n(s) {
            const t = s.id || s;
            return e.blockedIds.includes(t);
        }
        function o(e) {
            return null != s(e);
        }
        const r = {
            resolveUserById: s,
            blockUser      : function (t) {
                s(t) &&
          (e.blockedIds.includes(t) ||
            (e.user_id != t && e.blockedIds.push(t)));
            },
            isUserBlocked: n,
            userExists   : o,
            unblockUser  : function (s) {
                o(s) && n(s) && e.blockedIds.splice(e.blockedIds.indexOf(s), 1);
            },
            current: e,
        };
        let a;
        const l = {
                init: function () {
                    a = io();
                },
                get socket() {
                    return a;
                },
            },
            c = t(147),
            i = function (e) {
                return e
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            },
            d = function (e) {
                if (null == e)
                    return void C.error(
                        "No user ID specified to block. You can find user IDs with /list (NOT the username).",
                    );
                if (!r.userExists(e))
                    return void C.error(
                        "The specified user ID is not present in the current session!",
                    );
                if (r.isUserBlocked(e))
                    return void C.error("This user is already blocked.");
                if (e == r.current.user_id)
                    return void C.error(
                        "You cannot block yourself. If you wish to stop talking, just close the window.",
                    );
                r.blockUser(e);
                const s = r.resolveUserById(e);
                C.elements.messageBox.appendChild(
                    C.createSystemMessage(
                        "The user <span class=\"bold-noaa\">" +
              i(s.user) +
              "</span> is now blocked.",
                        "info",
                        !0,
                    ),
                ),
                C.elements.messageBox.scrollTo(0, C.elements.messageBox.scrollHeight);
            },
            m = function (e) {
                if (null == e)
                    return void C.error(
                        "No user ID specified to unblock. You can find user IDs with /list (NOT the username).",
                    );
                if (!r.userExists(e))
                    return void C.error(
                        "The specified user ID is not present in the current session!",
                    );
                if (!r.isUserBlocked(e))
                    return void C.error("This user is not blocked.");
                if (e == r.current.user_id) return void C.error("Oops :x");
                r.unblockUser(e);
                const s = r.resolveUserById(e);
                C.elements.messageBox.appendChild(
                    C.createSystemMessage(
                        "The user <span class=\"bold-noaa\">" +
              s.user +
              "</span> is now unblocked.",
                        "info",
                        !0,
                    ),
                ),
                C.elements.messageBox.scrollTo(0, C.elements.messageBox.scrollHeight);
            };
        let u = { processShortcodes: !0, processEmoticons: !0 };
        const p = function () {
                localStorage.setItem("config", JSON.stringify(u)),
                u.allowImages
                    ? document.body.classList.add("allow-images")
                    : document.body.classList.remove("allow-images");
            },
            g = function () {
                try {
                    let e = localStorage.getItem("config");
                    e
                        ? (u = { ...u, ...JSON.parse(e) })
                        : (localStorage.config = JSON.stringify(u));
                } catch (e) {
                    console.error(e);
                }
            },
            f = (e) => (u = e),
            h = () => u,
            x = {
                name       : "config",
                description: "Modifies your current chat configuration.",
                exec       : (e) => {
                    if (null == e[1] || "" == e[1].trim())
                        return (
                            C.elements.messageBox.appendChild(
                                C.createSystemMessage("Usage: /config <set/view>", "info", !1),
                            ),
                            void C.elements.messageBox.scrollTo(
                                0,
                                C.elements.messageBox.scrollHeight,
                            )
                        );
                    switch (e[1]) {
                        default:
                            C.elements.messageBox.appendChild(
                                C.createSystemMessage("Invalid subcommand!", "error", !1),
                            );
                            break;
                        case "view": {
                            let e = h();
                            const s = Object.keys(e);
                            let t = "Current MsgRoom Config:\n\n<div class=\"code-block\">";
                            for (let n of s)
                                t += `${n} [${i(typeof e[n])}] = ${i(`${e[n]}`)}\n`;
                            (t += "</div>"),
                            C.elements.messageBox.appendChild(
                                C.createSystemMessage(t, "info", !0),
                            );
                            break;
                        }
                        case "set": {
                            if (null == e[2] || "" == e[2].trim()) {
                                C.elements.messageBox.appendChild(
                                    C.createSystemMessage("Nothing to set!", "error", !1),
                                );
                                break;
                            }
                            if (null == e[3] || "" == e[3].trim()) {
                                C.elements.messageBox.appendChild(
                                    C.createSystemMessage("No value was specified!", "error", !1),
                                );
                                break;
                            }
                            const s = e[2].trim(),
                                t = e[3].trim();
                            let n = h();
                            /^\d*\.?\d*$/.test(t)
                                ? (n[s] = parseInt(t))
                                : /true|false/.test(t)
                                    ? (n[s] = "true" == t)
                                    : (n[s] = t),
                            f(n),
                            p(),
                            C.elements.messageBox.appendChild(
                                C.createSystemMessage(`${s} has been set to ${t}`, "info", !1),
                            );
                            break;
                        }
                    }
                    C.elements.messageBox.scrollTo(0, C.elements.messageBox.scrollHeight);
                },
            },
            b = [
                {
                    name       : "about",
                    description: "About MsgRoom.",
                    exec       : () => {
                        C.elements.messageBox.appendChild(
                            C.createSystemMessage(
                                `<span class="bold-noaa">Windows 96 chat (MsgRoom) v${c.version}</span><br><br>(C) Windows 96 Team 2022.<br><br>Report any bugs in our <a href="https://discord.gg/exjPuCV">Discord server</a> please.<br><br>`,
                                "info",
                                !0,
                            ),
                        ),
                        C.elements.messageBox.scrollTo(
                            0,
                            C.elements.messageBox.scrollHeight,
                        );
                    },
                },
                {
                    name       : "help",
                    description: "View a list of available commands.",
                    exec       : () => {
                        C.elements.messageBox.appendChild(
                            C.createSystemMessage(
                                "\n<span class=\"bold-noaa\" style=\"font-size: 36px;\">MsgRoom</span>\nwindows 96 public chat room - version 1.0\n\n<span class=\"bold-noaa\">Command help</span>\n\n/about - About MsgRoom.\n/block &lt;id&gt; - Block a user by ID.\n/clear - Clears the screen.\n/help - Views a list of available commands.\n/list - View online members (shows name + id).\n/unblock &lt;id&gt; - Unblock a user by ID.\n\n<span class=\"bold-noaa\">Keyboard shortcuts</span>\n\n[CTRL + L] => Clear chat.\n[TAB or ENTER] => Autocomplete a command in the input box.\n\n<span class=\"bold-noaa\">Other tips</span>\n- You can click your username in the bottom left corner to change your nickname.\n- Try inserting an emoji. It should render a platform agnostic emoji!\n- Markdown is supported.\n\n",
                                "info",
                                !0,
                            ),
                        ),
                        C.elements.messageBox.scrollTo(
                            0,
                            C.elements.messageBox.scrollHeight,
                        );
                    },
                },
                {
                    name       : "clear",
                    description: "Clear the chat log.",
                    exec       : () => {
                        (C.elements.messageBox.innerHTML = ""),
                        C.elements.messageBox.appendChild(
                            C.createSystemMessage(
                                "<i>The chat has been cleared.</i>",
                                "info",
                                !0,
                            ),
                        );
                    },
                },
                x,
                {
                    name       : "a",
                    hidden     : !0,
                    description: "Executes an admin action.",
                    exec       : (e) => {
                        l.socket.emit("admin-action", { args: e });
                    },
                },
                {
                    name       : "block",
                    description: "Blocks a user by ID. Use /list to retrieve user IDs.",
                    exec       : (e) => {
                        d(e[1]);
                    },
                },
                {
                    name: "unblock",
                    description:
            "Unblocks a blocked user by ID. Use /list to retrieve user IDs.",
                    exec: (e) => {
                        m(e[1]);
                    },
                },
                {
                    name       : "list",
                    description: "View online members",
                    exec       : () => {
                        let e = "";
                        r.current.onlineUsers.forEach((s) => {
                            e +=
                i(s.user) +
                " [source id: <code>" +
                s.id +
                "</code>] " +
                (r.current.blockedIds.includes(s.id)
                    ? " <span style=\"color: red;\" class=\"bold-noaa\">blocked</span>"
                    : "") +
                "\n";
                        }),
                        C.elements.messageBox.appendChild(
                            C.createSystemMessage(
                                "<span class=\"bold-noaa\">Online Users</span>\n        \n" +
                    e +
                    "\n",
                                "info",
                                !0,
                            ),
                        ),
                        C.elements.messageBox.scrollTo(
                            0,
                            C.elements.messageBox.scrollHeight,
                        );
                    },
                },
            ];
        b.sort(function (e, s) {
            return e.name > s.name ? 1 : e.name < s.name ? -1 : 0;
        });
        const y = {
            commands: b,
            process : function (e) {
                const s = e.substring(1).trim().split(" "),
                    t = b.find((e) => e.name == s[0]);
                t
                    ? t.exec(s)
                    : C.error(
                        "Command does not exist. Try /help for a list of commands.",
                    );
            },
        };
        function k() {
            document.querySelectorAll(".ctx-menu").forEach((e) => e.remove());
        }
        const B = {
                destroyAll: k,
                create    : function (e, s, t = []) {
                    k();
                    const n = document.createElement("div");
                    n.classList.add("ctx-menu");
                    for (let e of t) {
                        const s = document.createElement("div");
                        "normal" == e.type
                            ? (s.classList.add("item"),
                            (s.textContent = e.label),
                            s.addEventListener("click", (s) => {
                                s.stopPropagation();
                                try {
                                    e.onclick(s);
                                } catch (e) {
                                    console.error(e);
                                }
                                k();
                            }))
                            : "separator" == e.type && s.classList.add("sep"),
                        n.appendChild(s);
                    }
                    return (
                        document.body.appendChild(n),
                        (n.style.left = `${e}px`),
                        (n.style.top = `${s}px`),
                        n
                    );
                },
            },
            v = {
                userInput    : document.querySelector("input[type=\"text\"]"),
                messageBox   : document.querySelector(".messages"),
                membersBox   : document.querySelector(".members>.list"),
                nicknameLabel: document.querySelector(".nickname"),
                cmdBox       : null,
            };
        function w(e, s = "info", t = !1) {
            const n = I("System", e, t);
            return n.classList.add("system", s), n;
        }
        function I(e, s, t = !1) {
            const n = new Date().toLocaleString("en-US", {
                    hour  : "2-digit",
                    minute: "2-digit",
                    hour12: !0,
                }),
                o = document.createElement("div");
            o.classList.add("message");
            const r = document.createElement("div");
            r.classList.add("sig");
            const a = document.createElement("span");
            (a.innerText = n), a.classList.add("time"), r.appendChild(a);
            const l = document.createElement("span");
            l.classList.add("author"), (l.innerText = e), r.appendChild(l);
            const c = document.createElement("div");
            return (
                c.classList.add("content"),
                t ? (c.innerHTML = s) : (c.innerText = s),
                o.appendChild(r),
                o.appendChild(c),
                o
            );
        }
        function S(e) {
            return (
                (C.elements.userInput.value = C.elements.userInput.value.trim()),
                C.elements.cmdBox && C.elements.cmdBox.selectedItem
                    ? (e && e.preventDefault(),
                    void C.elements.cmdBox.selectedItem.onclick())
                    : C.elements.userInput.value.length > 2048
                        ? void alert("Message > 2048")
                        : C.elements.userInput.value.startsWith("/")
                            ? (y.process(C.elements.userInput.value),
                            void (C.elements.userInput.value = ""))
                            : void (
                                "" == C.elements.userInput.value.trim() ||
              C.elements.userInput.value.length > 2048 ||
              (l.socket.emit("message", {
                  type   : "text",
                  content: C.elements.userInput.value,
              }),
              (C.elements.userInput.value = ""))
                            )
            );
        }
        const C = {
            elements           : v,
            createSystemMessage: w,
            createMessage      : I,
            sendCurrentMessage : S,
            showMessageCtxMenu : function (e, s) {
                B.create(s.x, s.y, [
                    {
                        type   : "normal",
                        label  : r.isUserBlocked(e.id) ? "Unblock User" : "Block User",
                        onclick: () => {
                            r.isUserBlocked(e.id) ? m(e.id) : d(e.id);
                        },
                    },
                    { type: "separator" },
                    {
                        type   : "normal",
                        label  : "Copy ID",
                        onclick: async () => {
                            await navigator.clipboard.writeText(e.id);
                        },
                    },
                ]);
            },
            error: function (e) {
                v.messageBox.appendChild(
                    w("<span class=\"bold-noaa\">" + e + "</span>", "error", !0),
                ),
                v.messageBox.scrollTo(0, v.messageBox.scrollHeight);
            },
            renderCommandBox: function (e) {
                const s = v.userInput.getBoundingClientRect();
                v.cmdBox ||
          ((v.cmdBox = document.createElement("div")),
          v.cmdBox.classList.add("cmd-box"),
          (v.cmdBox.style.bottom = s.height + 10 + "px"),
          (v.cmdBox.style.left = s.left + "px"),
          document.body.appendChild(v.cmdBox)),
                (v.cmdBox.innerHTML = ""),
                y.commands.forEach((s) => {
                    if (!s.hidden && s.name.startsWith(e)) {
                        const e = (function (e, s) {
                            const t = document.createElement("div");
                            t.classList.add("item");
                            const n = document.createElement("span");
                            n.classList.add("name", "bold-noaa"), (n.innerText = "/" + e);
                            const o = document.createElement("span");
                            return (
                                o.classList.add("desc"),
                                (o.innerText = s),
                                t.appendChild(n),
                                t.appendChild(o),
                                t
                            );
                        })(s.name, s.description);
                        (e.onclick = () => {
                            (v.userInput.value = "/" + s.name + " "),
                            v.cmdBox && (v.cmdBox.remove(), (v.cmdBox = null));
                        }),
                        (e.onmouseenter = () => {
                            v.cmdBox
                                .querySelectorAll(".item.selected")
                                .forEach((e) => e.classList.remove("selected")),
                            (v.cmdBox.selectedItem = e);
                        }),
                        v.cmdBox.appendChild(e);
                    }
                }),
                v.cmdBox.childElementCount < 1
                    ? ((v.cmdBox.innerText = "No commands found."),
                    v.cmdBox.selectedItem &&
                v.cmdBox.selectedItem.classList.remove("selected"),
                    (v.cmdBox.selectedItem = null))
                    : ((v.cmdBox.selectedItem = v.cmdBox.children[0]),
                    v.cmdBox.children[0].classList.add("selected"));
            },
            applyTheme: function (e) {
                (
                    document.querySelector(".theme-css") ||
          (function () {
              const e = document.createElement("style");
              return (
                  e.classList.add("theme-css"), document.body.appendChild(e), e
              );
          })()
                ).innerHTML = e;
            },
            init: function () {
                (v.userInput = document.querySelector("input[type=\"text\"]")),
                (v.messageBox = document.querySelector(".messages")),
                (v.membersBox = document.querySelector(".members>.list")),
                (v.nicknameLabel = document.querySelector(".nickname")),
                document
                    .querySelector(".w96-button.send")
                    .addEventListener("click", () => S()),
                document.body.addEventListener("contextmenu", (e) => e.preventDefault(),
                ),
                document.body.addEventListener("click", () => B.destroyAll());
            },
        };
        let T;
        function L(e, s) {
            const t = document.createElement("button");
            return (
                t.addEventListener("click", () => {
                    T.querySelectorAll(".active").forEach((e) => e.classList.remove("active"),
                    ),
                    document
                        .querySelectorAll(".mob-tab-cnt")
                        .forEach((e) => e.classList.remove("mob-tab-cnt")),
                    t.classList.add("active"),
                    s();
                }),
                (t.textContent = e),
                T.appendChild(t),
                t
            );
        }
        const E = function () {
            (T = document.querySelector(".mob-tab-btns")),
            L("Chat", () => {}).classList.add("active"),
            L("Members", () => {
                document.querySelector(".members").classList.add("mob-tab-cnt");
            });
        };
        async function M(e, s = {}) {
            const { local: t = !1, version: n = "latest", cdnUrl: o, ...r } = s,
                a = (function (e, s, t) {
                    let n = `https://cdn.jsdelivr.net/npm/emojibase-data@${s}/${e}`;
                    return (
                        "function" == typeof t
                            ? (n = t(e, s))
                            : "string" == typeof t && (n = `${t}/${e}`),
                        n
                    );
                })(e, n, o),
                l = t ? localStorage : sessionStorage,
                c = `emojibase/${n}/${e}`,
                i = l.getItem(c);
            if (i) return Promise.resolve(JSON.parse(i));
            const d = await fetch(a, {
                credentials: "omit",
                mode       : "cors",
                redirect   : "error",
                ...r,
            });
            if (!d.ok) throw new Error("Failed to load Emojibase dataset.");
            const m = await d.json();
            try {
                l.setItem(c, JSON.stringify(m));
            } catch { /* empty */ }
            return m;
        }
        const U = { discord: "joypixels", slack: "iamcal" };
        new RegExp(`(-| )?(${/200D|FE0E|FE0F/g.source})`, "g");
        const j = { emojis: null, shortcodes: null };
        function D(e) {
            const s = [];
            let t = -1;
            for (; -1 !== (t = e.indexOf(":", t)); ) {
                let n = e.indexOf(":", t + 1);
                if (-1 === n) break;
                let o = e.substring(t + 1, n);
                if ("" == o.trim() || s.includes(o)) break;
                s.push(o), (t = n + 1);
            }
            return s;
        }
        function q(e) {
            let s = "string" == typeof j.shortcodes[e] ? j.shortcodes[e] : null;
            return s ? j.emojis.find((e) => e.hexcode == s).emoji : null;
        }
        const A = function (e) {
                let s = e;
                const t = D(e);
                for (let e of t) {
                    if (!/^\w+$/.test(e)) break;
                    let t = q(e);
                    t && (s = s.replaceAll(`:${e}:`, t));
                }
                return s;
            },
            O = async function () {
                console.log("Fetching emojis from database..."),
                (j.emojis = await M("en/data.json", { shortcodes: [ "github" ] })),
                (j.shortcodes = {});
                let e = await (async function (e, s, t) {
                    var n;
                    return M(
                        `${e}/shortcodes/${
                            null !== (n = U[s]) && void 0 !== n ? n : s
                        }.json`,
                        t,
                    );
                })("en", "cldr");
                for (let s in e) j.shortcodes[e[s].repeat(1)] = s.repeat(1);
                (e = null), (window.edb = j), console.log("Fetch complete!");
            };
        t(617);
        const $ = {
            pmOrigin:
        document.referrer ||
        "https://windows96.net",
            isWin96: !1,
            appPid : -1,
        };
        window.app = async function () {
            this._start ||
        (Object.defineProperty(this, "_start", { value: !0, writable: !1 }),
        C.init(),
        g(),
        p(),
        await O(),
        l.init(),
        null == localStorage.getItem("lastnick")
            ? ((r.current.username = prompt(
                "Enter username",
                r.current.username,
            )),
            (r.current.username && "" != r.current.username.trim()) ||
              (r.current.username = "anon" + Math.floor(1e3 * Math.random())))
            : (r.current.username = localStorage.getItem("lastnick")),
        console.log("Username is " + r.current.username),
        (C.elements.nicknameLabel.innerText = r.current.username),
        l.socket.on("auth-complete", function (e) {
            (r.current.user_id = e),
            (C.elements.userInput.onkeydown = (e) => {
                switch (e.key) {
                    case "l":
                        e.ctrlKey &&
                    (e.preventDefault(),
                    (C.elements.messageBox.innerHTML = ""),
                    C.elements.messageBox.appendChild(
                        C.createSystemMessage(
                            "<i>The chat has been cleared.</i>",
                            "info",
                            !0,
                        ),
                    ));
                        break;
                    case "Tab":
                        if (C.elements.cmdBox && C.elements.cmdBox.selectedItem)
                            return (
                                e.preventDefault(),
                                void C.elements.cmdBox.selectedItem.onclick()
                            );
                        break;
                    case "Enter":
                        C.sendCurrentMessage(e);
                        break;
                    case "ArrowDown":
                        if (!C.elements.cmdBox) break;
                        if (
                            (e.preventDefault(),
                            null == C.elements.cmdBox.selectedItem &&
                      C.elements.cmdBox.children.length > 0)
                        ) {
                            (C.elements.cmdBox.selectedItem =
                      C.elements.cmdBox.children[0]),
                            C.elements.cmdBox.selectedItem.classList.add("selected");
                            break;
                        }
                        var s = Array.prototype.slice.call(
                            C.elements.cmdBox.children,
                        );
                        let t = s.indexOf(C.elements.cmdBox.selectedItem) + 1;
                        if (null == s[t]) break;
                        C.elements.cmdBox.selectedItem.classList.remove("selected"),
                        (C.elements.cmdBox.selectedItem = s[t]),
                        C.elements.cmdBox.selectedItem.classList.add("selected");
                        break;
                    case "ArrowUp":
                        !(function () {
                            if (!C.elements.cmdBox) return;
                            if (
                                (e.preventDefault(),
                                null == C.elements.cmdBox.selectedItem &&
                        C.elements.cmdBox.children.length > 0)
                            )
                                return (
                                    (C.elements.cmdBox.selectedItem =
                          C.elements.cmdBox.children[
                              C.elements.cmdBox.children.length - 1
                          ]),
                                    void C.elements.cmdBox.selectedItem.classList.add(
                                        "selected",
                                    )
                                );
                            var s = Array.prototype.slice.call(
                                C.elements.cmdBox.children,
                            );
                            let t = s.indexOf(C.elements.cmdBox.selectedItem) - 1;
                            null != s[t] &&
                      (C.elements.cmdBox.selectedItem.classList.remove(
                          "selected",
                      ),
                      (C.elements.cmdBox.selectedItem = s[t]),
                      C.elements.cmdBox.selectedItem.classList.add("selected"));
                        })();
                }
            }),
            (C.elements.userInput.onkeyup = (e) => {
                if (C.elements.userInput.value.startsWith("/")) {
                    const s = C.elements.userInput.value.split(" "),
                        t = s[0].substring(1);
                    if (s.length < 2) {
                        if (C.elements.cmdBox) {
                            if ("ArrowUp" == e.key || "ArrowDown" == e.key)
                                return void e.preventDefault();
                            if ("Tab" == e.key) return void e.preventDefault();
                        }
                        C.renderCommandBox(t);
                    } else
                        C.elements.cmdBox &&
                    (C.elements.cmdBox.remove(), (C.elements.cmdBox = null));
                } else
                    C.elements.cmdBox &&
                  (C.elements.cmdBox.remove(), (C.elements.cmdBox = null));
            }),
            (C.elements.nicknameLabel.onclick = () => {
                if ($.isWin96)
                    return void window.parent.postMessage(
                        {
                            op  : "ifr-prompt",
                            args: [
                                "MsgRoom",
                                "Please choose a nick name:",
                                "",
                                "wui-nick-change",
                                window.location.href,
                                $.appPid,
                            ],
                        },
                        $.pmOrigin,
                    );
                const e = prompt("Enter a new username", "");
                "system" != e.trim().toLowerCase() && "" != e.trim()
                    ? e.length < 1
                        ? C.error("This nickname is too short.")
                        : e.length > 16
                            ? C.error("This nickname is too long.")
                            : ((C.elements.nicknameLabel.innerText = e),
                            localStorage.setItem("lastnick", e),
                            l.socket.emit("change-user", e))
                    : C.error("This nickname is not allowed.");
            }),
            l.socket.on("sys-message", function (e) {
                e &&
                (C.elements.messageBox.appendChild(
                    C.createSystemMessage(e.message, e.type, e.isHtml),
                ),
                C.elements.messageBox.scrollTo(
                    0,
                    C.elements.messageBox.scrollHeight,
                ));
            }),
            l.socket.on("message", function (e) {
                if (r.current.blockedIds.includes(e.id)) return;
                const s = r.current.onlineUsers.find(
                    (s) => s.session_id == e.session_id,
                );
                let t = `${e.content}`;
                h().processShortcodes && (t = A(t));
                const n = C.createMessage(e.user, t, !0);
                if (s.flags.includes("staff")) {
                    const e = n.querySelector(".sig"),
                        s = document.createElement("span");
                    s.classList.add("tag", "staff"),
                    (s.innerText = "staff"),
                    e.appendChild(s);
                }
                try {
                    n.querySelectorAll("strong").forEach((e) => {
                        n.style.color == e.style.color
                            ? (e.style.textShadow = "-1px 0 " + n.style.color)
                            : null != e.style.color &&
                      (e.style.textShadow = "-1px 0 " + e.style.color),
                        (e.style.letterSpacing = "1px"),
                        (e.style.marginLeft = "1px"),
                        (e.style.fontWeight = "100");
                    });
                } catch (e) {
                    console.error("Failed to format message: " + e);
                }
                n.addEventListener("contextmenu", (s) => {
                    s.preventDefault(), C.showMessageCtxMenu(e, s);
                });
                try {
                    n.querySelectorAll("a").forEach((e) => {
                        if ($.isWin96) {
                            const s = e.href.toString();
                            e.addEventListener("click", () => {
                                window.parent.postMessage(
                                    { op: "urlopen", args: [ s ] },
                                    $.pmOrigin,
                                );
                            }),
                            (e.href = "javascript:void(0)");
                        } else e.setAttribute("target", "_blank");
                    });
                } catch (e) {
                    console.error("Failed to register link handlers: " + e);
                }
                e.color &&
                ((n.querySelector(".author").style.backgroundColor = e.color),
                (n.querySelector(".content").style.color = e.color)),
                twemoji.parse(n.querySelector(".content"), {
                    folder: "svg",
                    ext   : ".svg",
                }),
                C.elements.messageBox.appendChild(n),
                C.elements.messageBox.scrollTo(
                    0,
                    C.elements.messageBox.scrollHeight,
                );
            }),
            l.socket.on("user-update", function (e) {
                switch (e.type) {
                    case "tag-add":
                        if (!e.tag) break;
                        const s = document.querySelector("div[uid=\"" + e.user + "\"]");
                        if (s && !s.querySelector(".tag." + e.tag)) {
                            const t = document.createElement("span");
                            t.classList.add("tag", e.tag),
                            (t.innerText = e.tagLabel || e.tag),
                            s.prepend(t);
                        }
                        const t = r.current.onlineUsers.findIndex(
                            (s) => s.session_id == e.user,
                        );
                        r.current.onlineUsers[t].flags.push(e.tag);
                }
            }),
            l.socket.on("user-leave", function (e) {
                C.elements.messageBox.appendChild(
                    C.createSystemMessage(
                        "<- User <span class=\"bold-noaa\">" +
                    i(e.user) +
                    "</span> left the chat :(",
                        "error",
                        !0,
                    ),
                ),
                C.elements.messageBox.scrollTo(
                    0,
                    C.elements.messageBox.scrollHeight,
                );
                const s = document.querySelector(
                        "div[uid=\"" + e.session_id + "\"]",
                    ),
                    t = r.current.onlineUsers.find(
                        (s) => s.session_id == e.session_id,
                    );
                t &&
                r.current.onlineUsers.splice(
                    r.current.onlineUsers.indexOf(t),
                    1,
                ),
                s && C.elements.membersBox.removeChild(s);
            }),
            l.socket.on("user-join", function (e) {
                const s = document.createElement("div");
                if (
                    (s.classList.add("member"),
                    (s.innerText = e.user),
                    (s.style.color = e.color),
                    s.setAttribute("uid", e.session_id),
                    e.flags.includes("staff"))
                ) {
                    const e = document.createElement("span");
                    e.classList.add("tag", "staff"),
                    (e.innerText = "staff"),
                    s.prepend(e);
                }
                C.elements.membersBox.appendChild(s),
                r.current.onlineUsers.push(e),
                C.elements.messageBox.appendChild(
                    C.createSystemMessage(
                        `-> User <span class="bold-noaa" style="color: ${i(
                            e.color,
                        )};">${i(e.user)}</span> joined the chat :D`,
                        "info",
                        !0,
                    ),
                ),
                C.elements.messageBox.scrollTo(
                    0,
                    C.elements.messageBox.scrollHeight,
                );
            }),
            l.socket.on("online", function (e) {
                e.forEach((e) => {
                    if (document.querySelector("div[uid=\"" + e.session_id + "\"]"))
                        return;
                    const s = document.createElement("div");
                    if (
                        (s.classList.add("member"),
                        (s.innerText = e.user),
                        (s.style.color = e.color),
                        s.setAttribute("uid", e.session_id),
                        C.elements.membersBox.appendChild(s),
                        e.flags.includes("staff"))
                    ) {
                        const e = document.createElement("span");
                        e.classList.add("tag", "staff"),
                        (e.innerText = "staff"),
                        s.prepend(e);
                    }
                }),
                (r.current.onlineUsers = e);
            }),
            l.socket.on("nick-changed", function (e) {
                const s = document.querySelector(
                    "div[uid=\"" + e.session_id + "\"]",
                );
                s && (s.innerText = e.newUser);
                const t = r.current.onlineUsers.find(
                    (s) => s.session_id == e.session_id,
                );
                if (t) {
                    const s = r.current.onlineUsers.indexOf(t);
                    (t.user = e.newUser), (r.current.onlineUsers[s] = t);
                }
                C.elements.messageBox.appendChild(
                    C.createSystemMessage(
                        "User <span class=\"bold-noaa\">" +
                    i(e.oldUser) +
                    "</span> changed their username to <span class=\"bold-noaa\">" +
                    i(e.newUser) +
                    "</span>",
                        "success",
                        !0,
                    ),
                ),
                C.elements.messageBox.scrollTo(
                    0,
                    C.elements.messageBox.scrollHeight,
                );
            }),
            l.socket.emit("online");
        }),
        l.socket.on("auth-error", function (e) {
            C.error("Authentication error: " + e.reason);
        }),
        l.socket.on("werror", function (e) {
            C.elements.messageBox.appendChild(
                C.createSystemMessage(
                    "<span class=\"bold-noaa\">" + e + "</span>",
                    "error",
                    !0,
                ),
            ),
            C.elements.messageBox.scrollTo(
                0,
                C.elements.messageBox.scrollHeight,
            );
        }),
        l.socket.emit("auth", { user: r.current.username }),
        E(),
        window.addEventListener("message", (e) => {
            const s = e.data;
            if (s.op)
                switch (s.op) {
                    case "w96-app-init":
                        s.args.disableWin96Detection
                            ? ($.isWin96 = !1)
                            : ($.isWin96 = !0),
                        ($.appPid = s.args.pid);
                        break;
                    case "wui-nick-change":
                        if (!s.args.value) return;
                        if (
                            "system" == s.args.value.trim().toLowerCase() ||
                  "" == s.args.value.trim()
                        )
                            return void C.error("This nickname is not allowed.");
                        if (s.args.value.length < 1)
                            return void C.error("This nickname is too short.");
                        if (s.args.value.length > 16)
                            return void C.error("This nickname is too long.");
                        (C.elements.nicknameLabel.innerText = s.args.value),
                        localStorage.setItem("lastnick", s.args.value),
                        l.socket.emit("change-user", s.args.value);
                        break;
                    case "wui-css-set":
                        if (!s.css) return;
                        C.applyTheme(s.css);
                        break;
                    case "wui-print-help":
                        C.elements.messageBox.appendChild(
                            C.createSystemMessage(
                                "\n<span class=\"bold-noaa\" style=\"font-size: 36px;\">[Help]</span>\n<span class=\"bold-noaa\">MsgRoom Help Documentation</span>\n\nWelcome to MsgRoom, a chat room for Windows 96.\n\nThe people here are real, so please do not spam and generally perform actions to annoy others.\n\n<span class=\"bold-noaa\">Some useful information</span>\n - Commands start with /\n - Emoji is supported, simply add an emoji and it will render properly.\n - Markdown is supported.\n - Your user is somewhat uniquely identified with a combination of random color and nickname.\n \n<span class=\"bold-noaa\">Things you should know</span>\n - Since users can embed links, do not open a link you don't trust.\n - If a user annoys you, simply run /list to get their user id and /block <id> to block them.\n - Bots are identified by a prefix (e.g. #)\n - If there is repeated abuse, contact us via Discord and we will assist you.",
                                "info",
                                !0,
                            ),
                        ),
                        C.elements.messageBox.scrollTo(
                            0,
                            C.elements.messageBox.scrollHeight,
                        );
                }
        }),
        (window.io = void 0));
        };
    })();
})();