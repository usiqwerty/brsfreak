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

import React, {useEffect, useMemo, useState} from 'react';
import Editor from "./pages/Editor";
import {Route, Routes} from "react-router-dom";
import "./css/style.css";
import Viewer from "./pages/Viewer";
import Login from "./pages/Login";
import {Rating} from "./tools/Rating";
import {fetchRating} from "./tools/api";
import {saveToServer} from "./tools/storage";

const App = () => {

    const [treeData, setTreeData] = useState([] as Rating[]);
    const [subjectIndex, setSubjectIndex] = useState(0);
    const [job, setJob] = useState(100);
    const [target_brs, setTarget_brs] = useState(80);
    const [password, setPassword] = useState(null! as string);
    const [username, setUsername] = useState(null! as string);

    useEffect(() => {
        if (subjectIndex < treeData.length)
            setJob(Math.min(target_brs - treeData[subjectIndex].value(), treeData[subjectIndex].free()));
    }, [subjectIndex, target_brs, treeData]);

    useMemo(async () => {
        const pass = localStorage.getItem("brsfreak-pass")!;
        const new_username = localStorage.getItem("brsfreak-username")!;
        setPassword(pass);
        setUsername(new_username);
        setTreeData(await fetchRating(1000, new_username, pass));
    }, []);
    if (localStorage.getItem("brsfreak-pass") == null)
        return <Login/>

    return (
        <>
            <header id={"main-header"}>
                <h1>brsfreak</h1>
                <p>Калькулятор для балльно-рейтинговой системы</p>
            </header>
            <Routes>
                <Route path={'/editor'}
                       element={<Editor job={job}
                                        saveToServer={() => saveToServer(treeData, username, password)}
                                        setSubjectIndex={setSubjectIndex}
                                        setTarget_brs={setTarget_brs}
                                        setTreeData={setTreeData}
                                        subjectIndex={subjectIndex}
                                        target_brs={target_brs}
                                        treeData={treeData} />}>

                </Route>
                <Route path={'/'}
                       element={<Viewer job={job}
                                        saveToServer={() => saveToServer(treeData, username, password)}
                                        setSubjectIndex={setSubjectIndex}
                                        setTarget_brs={setTarget_brs}
                                        setTreeData={setTreeData}
                                        subjectIndex={subjectIndex}
                                        target_brs={target_brs}
                                        treeData={treeData} />}>

                </Route>
            </Routes>

        </>
    );
};

export default App;
