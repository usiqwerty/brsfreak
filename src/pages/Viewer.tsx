import React, {useEffect, useMemo, useState} from "react";
import {Rating} from "../Rating";
import {fetchRating, find_attendance_node, handleSetField, importFile, parse, saveToLocalStorage} from "../api";
import JobViewer from "../widgets/JobViewer";
import ViewerMenu from "../widgets/ViewerMenu";
import Attendance from "../widgets/Attendance";


function Viewer() {
    const [treeData, setTreeData] = useState([] as Rating[]);
    const [subjectIndex, setSubjectIndex] = useState(0)
    const [target_brs, setTarget_brs] = useState(80);
    const [job, setJob] = useState(100)



    function selectSubject(e: any) {
        setSubjectIndex(Number.parseInt(e.target.value));
    }

    useEffect(() => {
        setJob(Math.min(target_brs - treeData[subjectIndex].value(), treeData[subjectIndex].free()));

    }, [subjectIndex, target_brs, treeData]);
    useMemo(() => {
        setTreeData(fetchRating(1000));
    }, []);

    if (treeData[subjectIndex] === undefined)
        return <></>
    const attendance_node = find_attendance_node(treeData[subjectIndex]);
    return <>
        <ViewerMenu importFile={(event: any)=>importFile(event, setTreeData)}
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
            {attendance_node?
                <Attendance onEdit={(dates: any)=> {
                    handleSetField('attended', dates, attendance_node, treeData[subjectIndex].subratings, setTreeData, treeData);
                    saveToLocalStorage(treeData)
                }
                }
                            node={attendance_node}
                />:
                ""}

        </div>
    </>;
}

export default Viewer;