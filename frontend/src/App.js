import './App.css';
import {Route, Routes} from 'react-router-dom';
import LoginPage from './Pages/LoginPage.js';
import StudentDashboard from './Pages/StudentDashboard.js';
import CoordinatorDashboard from './Pages/CoordinatorDashboard.js';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/studentDashboard/*" element={<StudentDashboard/>}/>
        <Route path="/coordinatorDashboard/*" element={<CoordinatorDashboard/>}/>
      </Routes>
    </div>
  );
}

export default App;
