import { DateRange } from 'react-date-range'

const DatePicker = ({ value, handleSelect }) => {
  return (
    <DateRange
      rangeColors={['#F43F5E']}
      ranges={[value]}
      onChange={handleSelect}
      date={new Date()}
      direction='vertical'
      showDateDisplay={false}
      minDate={value?.startData}
      maxDate={value?.endData}
      />
  )
}

export default DatePicker
