import axiosClient from './axiosClient';

const boardApi = {
  getAll(params) {
    const url = '/boards';
    return axiosClient.get(url, { params });
  },

  get(id) {
    const url = `/boards/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/boards';
    return axiosClient.post(url, data);
  },

  update(data, id) {
    const url = `/boards/${data._id}`;
    return axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/boards/${id}`;
    return axiosClient.delete(url);
  },

  // API support cho việc kéo thả card sang column khác
  moveCardDifferentColumn(data) {
    const url = `/boards/support/move_card_different_column`;
    return axiosClient.patch(url, data);
  }
};

export default boardApi;
