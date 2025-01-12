import { Helmet } from 'react-helmet-async'
import UserDataRow from '../../../components/Dashboard/TableRows/UserDataRow'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { AuthContext } from '../../../providers/AuthProvider'
// import useQuery from '@tanstack/react-query'
const ManageUsers = () => {
  const axiosSecure = useAxiosSecure()
  const {user} = useContext(AuthContext);
  console.log(user)
  const {data:users = []} = useQuery({
    queryKey:['users',user?.email],
    queryFn:async () => {
     const res = await axiosSecure.get(`/users/${user?.email}`)
      return res.data
    }
  })
console.log(users)
  return (
    <>
      <div className='container mx-auto px-4 sm:px-8'>
        <Helmet>
          <title>Manage Users</title>
        </Helmet>
        <div className='py-8'>
          <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
            <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
              <table className='min-w-full leading-normal'>
                <thead>
                  <tr>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Email
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Role
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Status
                    </th>

                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    users?.map(user => <UserDataRow key={user._id} user={user}/>)
                  }
                  
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManageUsers
