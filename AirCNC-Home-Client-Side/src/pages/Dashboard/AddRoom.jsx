import React, { useContext, useState } from 'react';
import AddRoomForm from '../../components/Forms/AddRoomForm';
import { imageUpload } from '../../api/imageUpload';
import { AuthContext } from '../../providers/AuthProvider';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddRoom = () => {
     const navigate = useNavigate()
     const { user } = useContext(AuthContext)
     const [loading, setLoading] = useState(false);
     const [uploadButtonText, setUploadButtonText] = useState("Upload Image");
     const [dates, setDates] = useState(
          {
               startDate: new Date(),
               endDate: new Date(),
               key: 'selection',
          }
     )
     const handleSubmit = (event) => {
          event.preventDefault();
          setLoading(true)
          const location = event.target.location.value;
          const title = event.target.title.value;
          const from = dates.startDate;
          const to = dates.endDate;
          const price = event.target.price.value;
          const total_guest = event.target.total_guest.value;
          const bedrooms = event.target.bedrooms.value;
          const bathrooms = event.target.bathrooms.value;
          const description = event.target.description.value;
          const category = event.target.category.value;
          const image = event.target.image.files[0];

          // upload image 
          imageUpload(image)
               .then(data => {
                    const roomData = {
                         image: data.data.display_url,
                         location,
                         title,
                         from,
                         to,
                         price,
                         total_guest,
                         bedrooms,
                         bathrooms,
                         description,
                         category,
                         host: {
                              name: user?.displayName,
                              image: user?.photoURL,
                              email: user?.email,
                         },

                    }
                    fetch('https://air-cnc-home-server-side.vercel.app/rooms', {
                         method: 'POST',
                         headers: {
                           'content-type': 'application/json'
                         },
                         body: JSON.stringify(roomData)
                       })
                       .then(res => res.json())
                       .then(() => {
                         toast.success('Room Add successful')
                         navigate('/')
                       })
                       .catch(err => {
                         setLoading(false)
                         console.log(err.message)
                         toast.error(err.message)
                       })
                    setLoading(false)
               })
               .catch(error => {
                    setLoading(false)
               })
     }
     const handleImageChange = (image) => {
          setUploadButtonText(image?.name)
     }

     const handleDates = (ranges)=>{
          setDates(ranges?.selection)
     }
     return (
          <div>
               <AddRoomForm
                    handleSubmit={handleSubmit}
                    loading={loading}
                    handleImageChange={handleImageChange}
                    uploadButtonText={uploadButtonText}
                    dates={dates}
                    handleDates={handleDates}
               ></AddRoomForm>
          </div>
     );
};

export default AddRoom;