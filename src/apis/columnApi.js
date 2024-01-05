import axiosClient from './axiosClient';

const columnApi = {
  getAll(params) {
    const url = '/columns';
    return axiosClient.get(url, { params });
  },

  get(id) {
    const url = `/columns/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/columns';
    return axiosClient.post(url, data);
  },

  update(data, columnId) {
    const url = `/columns/${columnId}`;
    return axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/columns/${id}`;
    return axiosClient.delete(url);
  }
};

export default columnApi;
