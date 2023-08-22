import React from 'react'
import Calender from '../Rooms/Calender'
import Button from '../Button/Button'

const RoomReservation = ({ roomData }) => {
  console.log(roomData);
  const { price } = roomData
  return (
    <div className='bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden'>
      <div className='flex flex-row items-center gap-1 p-4'>
        <div className='text-2xl font-semibold'>$ {price}</div>
        <div className='font-light text-neutral-600 ms-2'>night</div>
      </div>
      <hr />
      <div className=' flex justify-center'>

        <Calender />
      </div>
      <hr />
      <div className='p-4'>
        <Button label='Reserve' />
      </div>
      <hr />
      <div className='p-4 flex flex-row items-center justify-between font-semibold text-lg'>
        <div>Total</div>
        <div>$ {price + 10} </div>
      </div>
    </div>
  )
}

export default RoomReservation

