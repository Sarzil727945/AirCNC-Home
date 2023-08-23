import React, { useContext, useState } from 'react'
import Calender from '../Rooms/Calender'
import Button from '../Button/Button'
import { AuthContext } from '../../providers/AuthProvider'
import BookingModal from '../Modal/BookingModal'
import formatDistance from 'date-fns/formatDistance'

const RoomReservation = ({ roomData }) => {
  const { price, location } = roomData;
  const { user, role, setRole } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)

  const totalNight = +(formatDistance(new Date(roomData?.to), new Date(roomData?.from)).split(' ')[0])

  const [value, setValue] = useState({
    startDate: new Date(roomData?.from),
    endDate: new Date(roomData?.to),
    key: 'selection',
  })
  const handleSelect = (ranges) => {
    setValue({ ...value })
  }

  const [bookingInfo, setBookingInfo] = useState({
    guest: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    host: roomData?.host?.email,
    location: location,
    price: price,
  })

  return (
    <div className='bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden'>
      <div className='flex flex-row items-center gap-1 p-4'>
        <div className='text-2xl font-semibold'>$ {price}</div>
        <div className='font-light text-neutral-600 ms-2'>night</div>
      </div>
      <hr />
      <div className=' flex justify-center'>

        <Calender value={value} handleSelect={handleSelect} />
      </div>
      <hr />
      <div className='p-4'>
        <Button onClick={() => setIsOpen(true)} disabled={roomData?.host?.email === user?.email} label='Reserve' />
      </div>
      <hr />
      <div className='p-4 flex flex-row items-center justify-between font-semibold text-lg'>
        <div>Total</div>
        <div>$ {+price * totalNight} </div>
      </div>

      {/* <BookingModal
      isOpen={isOpen}
      ></BookingModal> */}
    </div>
  )
}

export default RoomReservation

