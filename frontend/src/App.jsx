import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/test").
    then((res) => res.text()).
    then((data)=> setMessage(data)).
    catch((err) => console.log(err))
  });
      
  return (
    <div>{message}</div>
  )
}

export default App
