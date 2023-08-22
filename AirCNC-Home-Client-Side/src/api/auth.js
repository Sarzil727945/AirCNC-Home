// user host 
export const becomeHost = (email) =>{
     const currentUser = {
          role: 'host',
     }
      fetch(`${import.meta.env.VITE_API_URL}/users/${email}`, {
          method: 'PUT',
          headers: {
               'content-type': 'application/json'
          },
          body: JSON.stringify(currentUser)
     })
     .then(res => res.json())
     .then(data=> {
          console.log(data);
     })
}

// user role 
export const getUserRole = async (email) => {
     const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${email}`)
     const user = await response.json()
     return user?.role;
}