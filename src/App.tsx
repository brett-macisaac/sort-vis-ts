import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sort from './pages/sort/Sort.js';
import { ThemeProvider } from "./standard_ui/standard_ui.js";
import { WindowSizeProvider } from "./standard_ui/standard_ui.js";

import './standard_ui/standard_ui.css';

function App() 
{

    return (
        <ThemeProvider>
        <WindowSizeProvider>

            <Router>
                <Routes>
                    <Route
                        path = { "/" }
                        element = { <Sort /> }
                    />
                </Routes>
            </Router>

        </WindowSizeProvider>
        </ThemeProvider>
    );
}

export default App
