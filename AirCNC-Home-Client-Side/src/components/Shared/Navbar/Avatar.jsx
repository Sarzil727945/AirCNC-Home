import { useContext } from 'react'
import avatarImg from '../../../assets/images/placeholder.jpg'
import { AuthContext } from '../../../providers/AuthProvider'

const Avatar = () => {
  const { user } = useContext(AuthContext)
  return (
    <img
      className='rounded-full w-[33px] h-[33px]'
      src={user && user.photoURL ? user.photoURL : avatarImg}
      alt='profile'
    
    />
  )
}

export default Avatar
