import { AiOutlineMenu } from 'react-icons/ai'
import Avatar from './Avatar'
import { useCallback, useContext, useState } from 'react'
import { AuthContext } from '../../../providers/AuthProvider'
import { Link } from 'react-router-dom'
import HostModal from '../../Modal/HostRequestModal'
import { becomeHost } from '../../../api/auth'
import { toast } from 'react-hot-toast'

const MenuDropdown = () => {
  const { user, logOut, role, setRole } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const [modal, setModal] = useState(false)

  const modalHandler = (email) => {
    becomeHost(email)
    toast.success('Your are host now. Post Rooms !!')
    closeModal();
    setRole('host')
  }
  const closeModal = () => {
    setModal(false)
  }


  return (
    <div className='relative'>
      <div className='flex flex-row items-center gap-3'>
        {/* Aircnc btn */}
        <div className={role ? 'hidden md:block text-sm font-semibold    transition px-16 py-3' : 'hidden md:block text-sm font-semibold    transition'}>
          {
            !role && <button
              className='cursor-pointer rounded-full hover:bg-neutral-100 py-3 px-4'
              disabled={!user}
              onClick={() => setModal(true)}
            >AirCNC your home</button>
          }
        </div>
        {/* Dropdown btn */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className='p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
        >
          <AiOutlineMenu />
          <div className='hidden md:block'>
            <Avatar />
          </div>
        </div>
      </div>
      {isOpen && (
        <div className='absolute rounded-xl shadow-md w-[40vw] md:w-3/4 bg-white overflow-hidden right-0 top-12 text-sm'>
          <div className='flex flex-col cursor-pointer'>
            <Link
              to='/'
              className='block md:hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold'
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to='/dashboard'
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                >
                  Dashboard
                </Link>
                <div
                  onClick={() => {
                    setRole(null)
                    logOut()
                  }}
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold cursor-pointer'
                >
                  Logout
                </div>
              </>
            ) : (
              <>
                <Link
                  to='/login'
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                >
                  Login
                </Link>
                <Link
                  to='/signup'
                  className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <HostModal
        modalHandler={modalHandler}
        isOpen={modal}
        email={user?.email}
        closeModal={closeModal}
      ></HostModal>
    </div>
  )
}

export default MenuDropdown
