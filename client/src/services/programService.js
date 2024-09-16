//client\src\services\programService.js
import axiosInstance from '../utils/axiosInstance';

const createProgram = async (programData) => {
  const response = await axiosInstance.post('/programs', programData);
  return response.data;
};

const duplicateProgram = async (programId) => {
  const response = await axiosInstance.post(`/programs/${programId}/duplicate`);
  return response.data;
};

const deleteProgram = async (programId) => {
  const response = await axiosInstance.delete(`/programs/${programId}`);
  return response.data;
};

const fetchPrograms = async () => {
  const response = await axiosInstance.get('/programs');
  return response.data || [];
};

const fetchProgramById = async (programId) => {
  const response = await axiosInstance.get(`/programs/${programId}`);
  return response.data;
};

const updateProgram = async (programId, programData) => {
  const response = await axiosInstance.put(`/programs/${programId}`, programData);
  return response.data;
};

export {
  createProgram,
  duplicateProgram,
  deleteProgram,
  fetchPrograms,
  fetchProgramById,
  updateProgram,
};
