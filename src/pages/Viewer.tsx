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

import React from "react";
import {Rating} from "../tools/Rating";
import JobViewer from "../widgets/JobViewer";
import AttendanceEditor from "../widgets/AttendanceEditor";
import {importFile} from "../tools/storage";
import {find_attendance_node, handleSetField} from "../tools/editor";
import Menu from "../widgets/Menu";


function Viewer({treeData, setTreeData, setSubjectIndex, subjectIndex, target_brs, setTarget_brs, job, saveToServer}: {
    treeData: Rating[],
    setTreeData: any,
    setSubjectIndex: any,
    subjectIndex: number,
    target_brs: any,
    setTarget_brs: any,
    job: number,
    saveToServer: any
}) {
    function selectSubject(e: any) {
        setSubjectIndex(Number.parseInt(e.target.value));
    }

    if (treeData[subjectIndex] === undefined)
        return <Menu importFile={(event: any) => importFile(event, setTreeData)}
                     selectSubject={selectSubject}
                     treeData={treeData}/>
    const attendance_node = find_attendance_node(treeData[subjectIndex]);
    return <>
        <Menu importFile={(event: any) => importFile(event, setTreeData)}
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
                    saveToServer();
                }
                }
                                  node={attendance_node}
                /> :
                ""}

        </div>
    </>;
}

export default Viewer;