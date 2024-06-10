import React from 'react';
import { BrowserRouter as Router, Routes,Route} from 'react-router-dom';
import AuthPage from './components/Auth/AuthPage';
import HomePage from './components/Home/HomePage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/Contexts/AuthContext';
import SingleBoardPage from './components/Home/SingleBoardPage';



const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
            <Routes>
                    <Route path="/" element={<AuthPage />} />
                    <Route element={<PrivateRoute />}>
                        <Route path="/home" element={<HomePage />} />
                    </Route>
                    {/* <Route element={<PrivateRoute />}> */}
                      <Route path="/board/:boardId" element={<SingleBoardPage />} />
                    {/* </Route> */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
