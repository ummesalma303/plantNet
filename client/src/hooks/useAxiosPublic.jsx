// import React from 'react';
// import PropTypes from 'prop-types';

import axios from "axios";

export const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  })
const useAxiosPublic = () => {
    return axiosPublic
};

// useAxiosPublic.propTypes = {
    
// };

export default useAxiosPublic;