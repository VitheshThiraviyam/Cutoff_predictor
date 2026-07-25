import React from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import PredictForm from './pages/Predictform'
import Colleges from './pages/Colleges'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/predict' element={<PredictForm/>}></Route>
        <Route path='/colleges' element={<Colleges />}></Route>
      </Routes>
    </div>
  )
}

export default App;
