
import './App.css'
import { BrowserRouter as Router , Routes ,Route } from 'react-router'
import ViewUI from './Components/pages/ViewUI'
import StreamUI from './Components/pages/StreamUI'

function App() {
 

  return (
    <>
    <Router>
      <Routes>

     
      <Route path="/" element={<ViewUI/>} />
      <Route path='/stream' element={<StreamUI/>}></Route>

      </Routes>
  

    </Router>
     </>
  )
}

export default App
