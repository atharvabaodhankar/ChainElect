import React from 'react'
import Homepage from './pages/Homepage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
const App = () => {
  return (
    <div>
      <Routes>
              <Route path='/' element={<Homepage />} />
              <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  )
}

export default App