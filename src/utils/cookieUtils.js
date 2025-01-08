export const setCookie = (name, value, options = {}) => {
  let cookieString = `${name}=${encodeURIComponent(value)};`;

  if (options.path) {
    cookieString += `path=${options.path};`;
  }

  if (options.expires) {
    cookieString += `expires=${options.expires.toUTCString()};`;
  }

  if (options.secure) {
    cookieString += 'secure;';
  }

  if (options.sameSite) {
    cookieString += `samesite=${options.sameSite};`;
  }

  document.cookie = cookieString;
};

// 쿠키 읽기 함수
export const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

// 쿠키 삭제 함수
export const deleteCookie = (name, options = {}) => {
  setCookie(name, '', { ...options, expires: new Date(0) });
};