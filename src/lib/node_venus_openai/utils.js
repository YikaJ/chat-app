/**
 * 给query排序
 * @param {string} query queryString
 */
export function orderQuery(query = '') {
  const params = {};
  query.split('&').forEach(param => {
    if (!param) {
      return;
    }
    const [key, val] = param.split('=');
    params[key] = val;
  });
  const sortedList = Object.entries(params).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  return sortedList.map(([key, val]) => `${key}=${val}`).join('&');
}