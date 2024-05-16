import React from 'react';
import Editor from "./pages/Editor";
import {Route, Routes} from "react-router-dom";
import "./css/syle.css";
import Viewer from "./pages/Viewer";

const App = () => {
    return (
        <>
            <header>
                <h1>brsfreak</h1>
                <p>Калькулятор для балльно-рейтинговой системы</p>
            </header>
            <Routes>
                <Route path={'/editor'} element={<Editor/>}></Route>
                <Route path={'/'} element={<Viewer />}></Route>
            </Routes>

        </>
    );
};

export default App;
