// import React from 'react';
// import PropTypes from 'prop-types';

import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
    const {user} = useContext(AuthContext);
    console.log(user?.email)
    const axiosSecure = useAxiosSecure()
    const {data:role = [],isLoading} = useQuery({
        queryKey:['role',user?.email],
        queryFn:async () => {
         const res = await axiosSecure.get(`/users/role/${user?.email}`)
          return res.data
        }
      })
    //   console.log(role.role)
    return [role?.role,isLoading]
};

// useRole.propTypes = {
    
// };

export default useRole;