import './App.css';
import {Route, Routes, BrowserRouter} from  'react-router-dom';
import Home from './Home';
import Blogs from './Blogs';
import Nav from './Nav';
import Reg from './Reg';
import Booklist from './Booklist';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path= '/' element= {<Nav/>}>
        <Route path= '/home' index element={<Home/>}/>
        <Route path= '/reg' element={<Reg/>}/>
        <Route path= '/booklist' element={<Booklist/>}/>
        <Route path="*" element={<Blogs/>} />
      </Route>
    </Routes>
    </BrowserRouter>
    
  );
}