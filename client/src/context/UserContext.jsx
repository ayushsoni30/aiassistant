
import React,{ useState , useEffect ,createContext} from 'react'
import axios from 'axios'
export const userDataContext = createContext()
const UserContext = ({children}) => {
    const serverUrl="http://localhost:8000"
    const [userData,setUserData]=useState(null)
    const handleCurrentUser=async()=>{
      try{
        const result = await axios.get(`${serverUrl}/api/user/current`, {withCredentials: true})
        console.log("Fetched current user data:", result.data);
        setUserData(result.data);
        console.log("Current user data:", result.data);
      }catch(err){
        console.error("Error fetching current user:");
        
      }
    }
    useEffect(()=>{
      handleCurrentUser()
   
    },[])
   
useEffect(()=>{
  console.log("User data in context:", userData);
},[userData]) 
    
    const value={
        serverUrl,
        userData
    }
  return (
    
        <userDataContext.Provider value={value}>
      {children}
      </userDataContext.Provider>
   
  )
}
export default UserContext
