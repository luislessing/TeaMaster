import P, { app as C, BrowserWindow as G } from "electron";
import ue from "path";
import { fileURLToPath as le } from "url";
import ae from "events";
var j = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, q = {}, M = { exports: {} }, V = {};
Object.defineProperty(V, "__esModule", { value: !0 });
const S = (i, c) => `${i.id}-${c}`;
class fe {
  constructor() {
    this.nextId = 0, this.storage = {}, this.owners = {}, this.electronIds = /* @__PURE__ */ new WeakMap();
  }
  // Register a new object and return its assigned ID. If the object is already
  // registered then the already assigned ID would be returned.
  add(c, l, a) {
    const u = this.saveToStorage(a), f = S(c, l);
    let d = this.owners[f];
    return d || (d = this.owners[f] = /* @__PURE__ */ new Map(), this.registerDeleteListener(c, l)), d.has(u) || (d.set(u, 0), this.storage[u].count++), d.set(u, d.get(u) + 1), u;
  }
  // Get an object according to its ID.
  get(c) {
    const l = this.storage[c];
    if (l != null)
      return l.object;
  }
  // Dereference an object according to its ID.
  // Note that an object may be double-freed (cleared when page is reloaded, and
  // then garbage collected in old page).
  remove(c, l, a) {
    const u = S(c, l), f = this.owners[u];
    if (f && f.has(a)) {
      const d = f.get(a) - 1;
      d <= 0 ? (f.delete(a), this.dereference(a)) : f.set(a, d);
    }
  }
  // Clear all references to objects refrenced by the WebContents.
  clear(c, l) {
    const a = S(c, l), u = this.owners[a];
    if (u) {
      for (const f of u.keys())
        this.dereference(f);
      delete this.owners[a];
    }
  }
  // Saves the object into storage and assigns an ID for it.
  saveToStorage(c) {
    let l = this.electronIds.get(c);
    return l || (l = ++this.nextId, this.storage[l] = {
      count: 0,
      object: c
    }, this.electronIds.set(c, l)), l;
  }
  // Dereference the object from store.
  dereference(c) {
    const l = this.storage[c];
    l != null && (l.count -= 1, l.count === 0 && (this.electronIds.delete(l.object), delete this.storage[c]));
  }
  // Clear the storage when renderer process is destroyed.
  registerDeleteListener(c, l) {
    const a = l.split("-")[0], u = (f, d) => {
      d && d.toString() === a && (c.removeListener("render-view-deleted", u), this.clear(c, l));
    };
    c.on("render-view-deleted", u);
  }
}
V.default = new fe();
var g = {};
Object.defineProperty(g, "__esModule", { value: !0 });
g.deserialize = g.serialize = g.isSerializableObject = g.isPromise = void 0;
const de = P;
function Ee(i) {
  return i && i.then && i.then instanceof Function && i.constructor && i.constructor.reject && i.constructor.reject instanceof Function && i.constructor.resolve && i.constructor.resolve instanceof Function;
}
g.isPromise = Ee;
const me = [
  Boolean,
  Number,
  String,
  Date,
  Error,
  RegExp,
  ArrayBuffer
];
function I(i) {
  return i === null || ArrayBuffer.isView(i) || me.some((c) => i instanceof c);
}
g.isSerializableObject = I;
const K = function(i, c) {
  const a = Object.entries(i).map(([u, f]) => [u, c(f)]);
  return Object.fromEntries(a);
};
function be(i) {
  const c = [], l = i.getScaleFactors();
  if (l.length === 1) {
    const a = l[0], u = i.getSize(a), f = i.toBitmap({ scaleFactor: a });
    c.push({ scaleFactor: a, size: u, buffer: f });
  } else
    for (const a of l) {
      const u = i.getSize(a), f = i.toDataURL({ scaleFactor: a });
      c.push({ scaleFactor: a, size: u, dataURL: f });
    }
  return { __ELECTRON_SERIALIZED_NativeImage__: !0, representations: c };
}
function ge(i) {
  const c = de.nativeImage.createEmpty();
  if (i.representations.length === 1) {
    const { buffer: l, size: a, scaleFactor: u } = i.representations[0], { width: f, height: d } = a;
    c.addRepresentation({ buffer: l, scaleFactor: u, width: f, height: d });
  } else
    for (const l of i.representations) {
      const { dataURL: a, size: u, scaleFactor: f } = l, { width: d, height: z } = u;
      c.addRepresentation({ dataURL: a, scaleFactor: f, width: d, height: z });
    }
  return c;
}
function W(i) {
  return i && i.constructor && i.constructor.name === "NativeImage" ? be(i) : Array.isArray(i) ? i.map(W) : I(i) ? i : i instanceof Object ? K(i, W) : i;
}
g.serialize = W;
function L(i) {
  return i && i.__ELECTRON_SERIALIZED_NativeImage__ ? ge(i) : Array.isArray(i) ? i.map(L) : I(i) ? i : i instanceof Object ? K(i, L) : i;
}
g.deserialize = L;
var B = {};
Object.defineProperty(B, "__esModule", { value: !0 });
B.getElectronBinding = void 0;
const Re = (i) => process._linkedBinding ? process._linkedBinding("electron_common_" + i) : process.electronBinding ? process.electronBinding(i) : null;
B.getElectronBinding = Re;
M.exports;
(function(i, c) {
  var l = j && j.__importDefault || function(e) {
    return e && e.__esModule ? e : { default: e };
  };
  Object.defineProperty(c, "__esModule", { value: !0 }), c.initialize = c.isInitialized = c.enable = c.isRemoteModuleEnabled = void 0;
  const a = ae, u = l(V), f = g, d = P, z = B, { Promise: Z } = j, H = z.getElectronBinding("v8_util"), Q = (() => {
    var e, r;
    const t = Number((r = (e = process.versions.electron) === null || e === void 0 ? void 0 : e.split(".")) === null || r === void 0 ? void 0 : r[0]);
    return Number.isNaN(t) || t < 14;
  })(), J = [
    "length",
    "name",
    "arguments",
    "caller",
    "prototype"
  ], O = /* @__PURE__ */ new Map(), Y = new FinalizationRegistry((e) => {
    const r = e.id[0] + "~" + e.id[1], t = O.get(r);
    if (t !== void 0 && t.deref() === void 0 && (O.delete(r), !e.webContents.isDestroyed()))
      try {
        e.webContents.sendToFrame(e.frameId, "REMOTE_RENDERER_RELEASE_CALLBACK", e.id[0], e.id[1]);
      } catch (o) {
        console.warn(`sendToFrame() failed: ${o}`);
      }
  });
  function A(e) {
    const r = e[0] + "~" + e[1], t = O.get(r);
    if (t !== void 0) {
      const o = t.deref();
      if (o !== void 0)
        return o;
    }
  }
  function x(e, r, t, o) {
    const n = new WeakRef(o), s = e[0] + "~" + e[1];
    return O.set(s, n), Y.register(o, {
      id: e,
      webContents: r,
      frameId: t
    }), o;
  }
  const k = /* @__PURE__ */ new WeakMap(), F = function(e) {
    let r = Object.getOwnPropertyNames(e);
    return typeof e == "function" && (r = r.filter((t) => !J.includes(t))), r.map((t) => {
      const o = Object.getOwnPropertyDescriptor(e, t);
      let n, s = !1;
      return o.get === void 0 && typeof e[t] == "function" ? n = "method" : ((o.set || o.writable) && (s = !0), n = "get"), { name: t, enumerable: o.enumerable, writable: s, type: n };
    });
  }, N = function(e) {
    const r = Object.getPrototypeOf(e);
    return r === null || r === Object.prototype ? null : {
      members: F(r),
      proto: N(r)
    };
  }, m = function(e, r, t, o = !1) {
    let n;
    switch (typeof t) {
      case "object":
        t instanceof Buffer ? n = "buffer" : t && t.constructor && t.constructor.name === "NativeImage" ? n = "nativeimage" : Array.isArray(t) ? n = "array" : t instanceof Error ? n = "error" : f.isSerializableObject(t) ? n = "value" : f.isPromise(t) ? n = "promise" : Object.prototype.hasOwnProperty.call(t, "callee") && t.length != null ? n = "array" : o && H.getHiddenValue(t, "simple") ? n = "value" : n = "object";
        break;
      case "function":
        n = "function";
        break;
      default:
        n = "value";
        break;
    }
    return n === "array" ? {
      type: n,
      members: t.map((s) => m(e, r, s, o))
    } : n === "nativeimage" ? { type: n, value: f.serialize(t) } : n === "object" || n === "function" ? {
      type: n,
      name: t.constructor ? t.constructor.name : "",
      // Reference the original value if it's an object, because when it's
      // passed to renderer we would assume the renderer keeps a reference of
      // it.
      id: u.default.add(e, r, t),
      members: F(t),
      proto: N(t)
    } : n === "buffer" ? { type: n, value: t } : n === "promise" ? (t.then(function() {
    }, function() {
    }), {
      type: n,
      then: m(e, r, function(s, E) {
        t.then(s, E);
      })
    }) : n === "error" ? {
      type: n,
      value: t,
      members: Object.keys(t).map((s) => ({
        name: s,
        value: m(e, r, t[s])
      }))
    } : {
      type: "value",
      value: t
    };
  }, _ = function(e) {
    const r = new Error(e);
    throw r.code = "EBADRPC", r.errno = -72, r;
  }, U = (e, r) => {
    let o = `Attempting to call a function in a renderer window that has been closed or released.
Function provided here: ${k.get(r)}`;
    if (e instanceof a.EventEmitter) {
      const n = e.eventNames().filter((s) => e.listeners(s).includes(r));
      n.length > 0 && (o += `
Remote event names: ${n.join(", ")}`, n.forEach((s) => {
        e.removeListener(s, r);
      }));
    }
    console.warn(o);
  }, ee = (e, r) => new Proxy(Object, {
    get(t, o, n) {
      return o === "name" ? r : Reflect.get(t, o, n);
    }
  }), h = function(e, r, t, o) {
    const n = function(s) {
      switch (s.type) {
        case "nativeimage":
          return f.deserialize(s.value);
        case "value":
          return s.value;
        case "remote-object":
          return u.default.get(s.id);
        case "array":
          return h(e, r, t, s.value);
        case "buffer":
          return Buffer.from(s.value.buffer, s.value.byteOffset, s.value.byteLength);
        case "promise":
          return Z.resolve({
            then: n(s.then)
          });
        case "object": {
          const E = s.name !== "Object" ? /* @__PURE__ */ Object.create({
            constructor: ee(Object, s.name)
          }) : {};
          for (const { name: R, value: p } of s.members)
            E[R] = n(p);
          return E;
        }
        case "function-with-return-value": {
          const E = n(s.value);
          return function() {
            return E;
          };
        }
        case "function": {
          const E = [t, s.id], R = A(E);
          if (R !== void 0)
            return R;
          const p = function(...se) {
            let D = !1;
            if (!e.isDestroyed())
              try {
                D = e.sendToFrame(r, "REMOTE_RENDERER_CALLBACK", t, s.id, m(e, t, se)) !== !1;
              } catch (ce) {
                console.warn(`sendToFrame() failed: ${ce}`);
              }
            D || U(this, p);
          };
          return k.set(p, s.location), Object.defineProperty(p, "length", { value: s.length }), x(E, e, r, p), p;
        }
        default:
          throw new TypeError(`Unknown type: ${s.type}`);
      }
    };
    return o.map(n);
  }, te = function(e) {
    const r = e.getLastWebPreferences() || {};
    return r.enableRemoteModule != null ? !!r.enableRemoteModule : !1;
  }, T = /* @__PURE__ */ new WeakMap(), ne = function(e) {
    return Q && !T.has(e) && T.set(e, te(e)), T.get(e);
  };
  c.isRemoteModuleEnabled = ne;
  function re(e) {
    T.set(e, !0);
  }
  c.enable = re;
  const b = function(e, r) {
    d.ipcMain.on(e, (t, o, ...n) => {
      let s;
      if (!c.isRemoteModuleEnabled(t.sender)) {
        t.returnValue = {
          type: "exception",
          value: m(t.sender, o, new Error('@electron/remote is disabled for this WebContents. Call require("@electron/remote/main").enable(webContents) to enable it.'))
        };
        return;
      }
      try {
        s = r(t, o, ...n);
      } catch (E) {
        s = {
          type: "exception",
          value: m(t.sender, o, E)
        };
      }
      s !== void 0 && (t.returnValue = s);
    });
  }, w = function(e, r, ...t) {
    const o = { sender: e, returnValue: void 0, defaultPrevented: !1 };
    return d.app.emit(r, o, e, ...t), e.emit(r, o, ...t), o;
  }, y = function(e, r, t) {
    t && console.warn(`WebContents (${e.id}): ${r}`, t);
  };
  let $ = !1;
  function oe() {
    return $;
  }
  c.isInitialized = oe;
  function ie() {
    if ($)
      throw new Error("@electron/remote has already been initialized");
    $ = !0, b("REMOTE_BROWSER_WRONG_CONTEXT_ERROR", function(e, r, t, o) {
      const s = A([t, o]);
      s !== void 0 && U(e.sender, s);
    }), b("REMOTE_BROWSER_REQUIRE", function(e, r, t, o) {
      y(e.sender, `remote.require('${t}')`, o);
      const n = w(e.sender, "remote-require", t);
      if (n.returnValue === void 0) {
        if (n.defaultPrevented)
          throw new Error(`Blocked remote.require('${t}')`);
        if (process.mainModule)
          n.returnValue = process.mainModule.require(t);
        else {
          let s = i;
          for (; s.parent; )
            s = s.parent;
          n.returnValue = s.require(t);
        }
      }
      return m(e.sender, r, n.returnValue);
    }), b("REMOTE_BROWSER_GET_BUILTIN", function(e, r, t, o) {
      y(e.sender, `remote.getBuiltin('${t}')`, o);
      const n = w(e.sender, "remote-get-builtin", t);
      if (n.returnValue === void 0) {
        if (n.defaultPrevented)
          throw new Error(`Blocked remote.getBuiltin('${t}')`);
        n.returnValue = P[t];
      }
      return m(e.sender, r, n.returnValue);
    }), b("REMOTE_BROWSER_GET_GLOBAL", function(e, r, t, o) {
      y(e.sender, `remote.getGlobal('${t}')`, o);
      const n = w(e.sender, "remote-get-global", t);
      if (n.returnValue === void 0) {
        if (n.defaultPrevented)
          throw new Error(`Blocked remote.getGlobal('${t}')`);
        n.returnValue = j[t];
      }
      return m(e.sender, r, n.returnValue);
    }), b("REMOTE_BROWSER_GET_CURRENT_WINDOW", function(e, r, t) {
      y(e.sender, "remote.getCurrentWindow()", t);
      const o = w(e.sender, "remote-get-current-window");
      if (o.returnValue === void 0) {
        if (o.defaultPrevented)
          throw new Error("Blocked remote.getCurrentWindow()");
        o.returnValue = e.sender.getOwnerBrowserWindow();
      }
      return m(e.sender, r, o.returnValue);
    }), b("REMOTE_BROWSER_GET_CURRENT_WEB_CONTENTS", function(e, r, t) {
      y(e.sender, "remote.getCurrentWebContents()", t);
      const o = w(e.sender, "remote-get-current-web-contents");
      if (o.returnValue === void 0) {
        if (o.defaultPrevented)
          throw new Error("Blocked remote.getCurrentWebContents()");
        o.returnValue = e.sender;
      }
      return m(e.sender, r, o.returnValue);
    }), b("REMOTE_BROWSER_CONSTRUCTOR", function(e, r, t, o) {
      o = h(e.sender, e.frameId, r, o);
      const n = u.default.get(t);
      return n == null && _(`Cannot call constructor on missing remote object ${t}`), m(e.sender, r, new n(...o));
    }), b("REMOTE_BROWSER_FUNCTION_CALL", function(e, r, t, o) {
      o = h(e.sender, e.frameId, r, o);
      const n = u.default.get(t);
      n == null && _(`Cannot call function on missing remote object ${t}`);
      try {
        return m(e.sender, r, n(...o), !0);
      } catch (s) {
        const E = new Error(`Could not call remote function '${n.name || "anonymous"}'. Check that the function signature is correct. Underlying error: ${s}
` + (s instanceof Error ? `Underlying stack: ${s.stack}
` : ""));
        throw E.cause = s, E;
      }
    }), b("REMOTE_BROWSER_MEMBER_CONSTRUCTOR", function(e, r, t, o, n) {
      n = h(e.sender, e.frameId, r, n);
      const s = u.default.get(t);
      return s == null && _(`Cannot call constructor '${o}' on missing remote object ${t}`), m(e.sender, r, new s[o](...n));
    }), b("REMOTE_BROWSER_MEMBER_CALL", function(e, r, t, o, n) {
      n = h(e.sender, e.frameId, r, n);
      const s = u.default.get(t);
      s == null && _(`Cannot call method '${o}' on missing remote object ${t}`);
      try {
        return m(e.sender, r, s[o](...n), !0);
      } catch (E) {
        const R = new Error(`Could not call remote method '${o}'. Check that the method signature is correct. Underlying error: ${E}` + (E instanceof Error ? `Underlying stack: ${E.stack}
` : ""));
        throw R.cause = E, R;
      }
    }), b("REMOTE_BROWSER_MEMBER_SET", function(e, r, t, o, n) {
      n = h(e.sender, e.frameId, r, n);
      const s = u.default.get(t);
      return s == null && _(`Cannot set property '${o}' on missing remote object ${t}`), s[o] = n[0], null;
    }), b("REMOTE_BROWSER_MEMBER_GET", function(e, r, t, o) {
      const n = u.default.get(t);
      return n == null && _(`Cannot get property '${o}' on missing remote object ${t}`), m(e.sender, r, n[o]);
    }), b("REMOTE_BROWSER_DEREFERENCE", function(e, r, t) {
      u.default.remove(e.sender, r, t);
    }), b("REMOTE_BROWSER_CONTEXT_RELEASE", (e, r) => (u.default.clear(e.sender, r), null));
  }
  c.initialize = ie;
})(M, M.exports);
var pe = M.exports;
(function(i) {
  Object.defineProperty(i, "__esModule", { value: !0 }), i.enable = i.isInitialized = i.initialize = void 0;
  var c = pe;
  Object.defineProperty(i, "initialize", { enumerable: !0, get: function() {
    return c.initialize;
  } }), Object.defineProperty(i, "isInitialized", { enumerable: !0, get: function() {
    return c.isInitialized;
  } }), Object.defineProperty(i, "enable", { enumerable: !0, get: function() {
    return c.enable;
  } });
})(q);
var v = q;
v.initialize();
const _e = le(import.meta.url);
ue.dirname(_e);
function X() {
  const i = new G({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: !0,
      contextIsolation: !1
    }
  });
  v.enable(i.webContents), i.webContents.openDevTools(), process.env.VITE_DEV_SERVER_URL ? i.loadURL(process.env.VITE_DEV_SERVER_URL) : i.loadFile("dist/index.html");
}
C.whenReady().then(X);
C.on("window-all-closed", () => {
  process.platform !== "darwin" && C.quit();
});
C.on("activate", () => {
  G.getAllWindows().length === 0 && X();
});
