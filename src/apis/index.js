import axios from 'axios';
import { API_ROOT } from '~/utils/constants';

export const fetchBoardDetailsAPI = async (id) => {
  try {
    const response = await axios.get(`${API_ROOT}/boards/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
