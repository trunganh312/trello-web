import axiosClient from './axiosClient';

const cardApi = {
  getAll(params) {
    const url = '/cards';
    return axiosClient.get(url, { params });
  },

  get(id) {
    const url = `/cards/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = '/cards';
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/cards/${data.id}`;
    return axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/cards/${id}`;
    return axiosClient.delete(url);
  }
};

export default cardApi;
