/*module.exports = {
    createUrl: function(page, filters) {
      const API_PATH = process.env.API_PATH;
      let apiUrl = `${API_PATH}/users?page[offset]=${page}`;
      if (filters.name) {
        apiUrl += `&filter[name]=${filters.name}`;
      }
      return apiUrl;
    },
  };*/

  function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }

  module.exports.isEmptyObject = isEmptyObject;