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

import React, {useEffect, useMemo, useState} from "react";
import {Rating} from "../tools/Rating";
import {fetchRating} from "../tools/api";
import JobViewer from "../widgets/JobViewer";
import ViewerMenu from "../widgets/ViewerMenu";
import AttendanceEditor from "../widgets/AttendanceEditor";
import {importFile, saveToServer} from "../tools/storage";
import {find_attendance_node, handleSetField} from "../tools/editor";


function Viewer() {
    const [treeData, setTreeData] = useState([] as Rating[]);
    const [subjectIndex, setSubjectIndex] = useState(0)
    const [target_brs, setTarget_brs] = useState(80);
    const [job, setJob] = useState(100)
    const [password, setPassword] = useState(null! as string);

    function selectSubject(e: any) {
        setSubjectIndex(Number.parseInt(e.target.value));
    }

    useEffect(() => {
        if (subjectIndex < treeData.length)
            setJob(Math.min(target_brs - treeData[subjectIndex].value(), treeData[subjectIndex].free()));
    }, [subjectIndex, target_brs, treeData]);
    useMemo(async () => {
        const pass = localStorage.getItem("brsfreak-pass")!;
        setPassword(pass);
        setTreeData(await fetchRating(1000, pass));
    }, []);

    if (treeData[subjectIndex] === undefined)
        return <ViewerMenu importFile={(event: any) => importFile(event, setTreeData)}
                           selectSubject={selectSubject}
                           treeData={treeData}/>
    const attendance_node = find_attendance_node(treeData[subjectIndex]);
    return <>
        <ViewerMenu importFile={(event: any) => importFile(event, setTreeData)}
                    selectSubject={selectSubject}
                    treeData={treeData}/>
        <div id={"target-input"}>
                <span>
                    Цель <input size={3} name={"target_brs"} onChange={(e) => {
                    setTarget_brs(Number.parseInt(e.target.value))
                }} value={target_brs}/>
                </span>
            <span>
                    Необходимо ещё набрать {job}

                </span>
            {job + treeData[subjectIndex].value() < target_brs ?
                <span id={'warning'}>Внимание, цель слишком высокая! Максимально возможный
                        балл: <b>{job + treeData[subjectIndex].value()}</b></span> : <></>}
        </div>

        <div id={"viewer-container"}>
            <JobViewer rating={treeData[subjectIndex]} target={target_brs}/>
            {attendance_node ?
                <AttendanceEditor onEdit={(dates: any) => {
                    handleSetField('attended', dates, attendance_node, treeData[subjectIndex].subratings, setTreeData, treeData);
                    saveToServer(treeData, password)
                }
                }
                                  node={attendance_node}
                /> :
                ""}

        </div>
    </>;
}

export default Viewer;