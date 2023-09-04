import React, { useContext, useState } from 'react'
import Calender from '../Rooms/Calender'
import Button from '../Button/Button'
import { AuthContext } from '../../providers/AuthProvider'
import BookingModal from '../Modal/BookingModal'
import formatDistance from 'date-fns/formatDistance'
import { addBooking, getBookings, updateStatus } from '../../api/booking'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const RoomReservation = ({ roomData }) => {
  const { price, location } = roomData;
  const navigate = useNavigate()
  const { user, role, setRole } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(false)
  const closeModal = () => {
    setIsOpen(false)
  }

  const totalNight = +(formatDistance(new Date(roomData?.to), new Date(roomData?.from)).split(' ')[0])
  const totalPrice = +price * totalNight

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
    title: roomData?.title,
    host: roomData?.host?.email,
    location: location,
    price: totalPrice,
    to: value.endDate,
    from: value.startDate,
    roomID: roomData?._id,
    image: roomData?.photoURL,
  })

  const modalHandler = () => {
    addBooking(bookingInfo)
      .then(data => {
        toast.success('Booking successfully');
        navigate('/dashboard/my-bookings')
        updateStatus(roomData?._id, true)
          .then(data => {
            console.log(data);
          })
          .catch(err => {
            console.log(err);
            toast.error(err.message)
            closeModal()
          })
      })
    closeModal()
  }
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
        <Button onClick={() => setIsOpen(true)} disabled={roomData?.host?.email === user?.email || roomData.booked} label='Reserve' />
      </div>
      <hr />
      <div className='p-4 flex flex-row items-center justify-between font-semibold text-lg'>
        <div>Total</div>
        <div>$ {totalPrice} </div>
      </div>

      <BookingModal
        isOpen={isOpen}
        bookingInfo={bookingInfo}
        closeModal={closeModal}
        modalHandler={modalHandler}
      ></BookingModal>
    </div>
  )
}

export default RoomReservation

