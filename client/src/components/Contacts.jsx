import React, { useEffect, useState } from 'react'
import ContactItem from './ContactItem'

const Contacts = () => {
    const [contacts, setContacts] = useState([])

    const getAllchats = async()=>{

    }

    useEffect(() => {
      getAllchats()
    
     
    }, [])
    
  return (
    <div>
        {contacts.length !==0 ?(
            <div>
                {contacts.map((item)=>{

                    return <ContactItem gi/>
                })}
            </div> 
            )
            :
            (
            <div>Add new contacts</div>
            )}
    </div>
  )
}

export default Contacts