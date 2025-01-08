export const clearAllStorage = () => {
  // 로컬 스토리지 초기화
  localStorage.clear();

  // 세션 스토리지 초기화
  sessionStorage.clear();

  // 쿠키 초기화
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    const [name] = cookie.split("=");
    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}