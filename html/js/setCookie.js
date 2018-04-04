/* setCookie.js
Sets a Cookie with the given name and value.
   name = Name of the cookie.
  value = Value of the cookie.
expires = Expiration date of the cookie. Default: end of current session.
   path = Path where the cookie is valid. Default: path of calling document.
 domain = Domain where the cookie is valid. Default: domain of calling document.
 secure = Boolean value indicating if the cookie transmission requires a secure transmission. Default: 0.
*/
function setCookie(name, value, expires, path, domain, secure) {
  document.cookie= name + "=" + escape(value) +
  ((expires) ? "; expires=" + expires.toGMTString() : "") +
  ((path) ? "; path=" + path : "") +
  ((domain) ? "; domain=" + domain : "") +
  ((secure) ? "; secure" : "");
}
