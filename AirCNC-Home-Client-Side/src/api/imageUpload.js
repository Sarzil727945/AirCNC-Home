// image upload in ImgBB 
export const imageUpload = async (image) => {
     const formData = new FormData()
     formData.append('image', image)
     const img_hosting_url = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_Image_Upload_token
     }`;

     const response = await fetch(img_hosting_url, {
          method: 'POST',
          body: formData,
     })
     const data = await response.json()
     return data
}