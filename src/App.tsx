/*
*    BRSfreak - калькулятор баллов для ВУЗа
*    Copyright (C) 2024  usiqwerty
*
*    BRSfreak is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    BRSfreak is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with this program.  If not, see <https://www.gnu.org/licenses/>.
* */

import React from 'react';
import Editor from "./pages/Editor";
import {Route, Routes} from "react-router-dom";
import "./css/syle.css";
import Viewer from "./pages/Viewer";

const App = () => {
    return (
        <>
            <header id={"main-header"}>
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
