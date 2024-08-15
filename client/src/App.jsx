import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState("")

  const handleSubmit = (e)=>{
    e.preventDefault()

  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" value={message} onChange={(e)=> setMessage(e.target.value)}/>
        <button>submit</button>
      </form>
    </>
  )
}

export default App
