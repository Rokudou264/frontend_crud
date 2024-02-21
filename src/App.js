import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ShowUsers from './components/ShowUsers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ShowUsers></ShowUsers>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;