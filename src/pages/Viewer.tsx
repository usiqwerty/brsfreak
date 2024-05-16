import React, {useEffect, useMemo, useState} from "react";
import {Rating} from "../Rating";
import {fetchRating, parse} from "../api";
import {BRSRating} from "../widgets/BRSRating";
import JobViewer from "../widgets/JobViewer";
import jobViewer from "../widgets/JobViewer";
import ViewerMenu from "../widgets/ViewerMenu";

function Viewer() {
    const [treeData, setTreeData] = useState([] as Rating[]);
    const [subjectIndex, setSubjectIndex] = useState(0)
    const [target_brs, setTarget_brs] = useState(80);
    const [job, setJob] = useState(100)

    const importFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const text = (e.target!.result)
            if (typeof text === 'string') {
                const d = JSON.parse(text).map((item: Rating) => {
                    return parse(item)
                })
                setTreeData(d);
                localStorage.setItem('brs-tree', JSON.stringify(d));
                alert("File imported and saved to local storage");
            } else
                alert('Something went wrong')
        };
        let fi = (e.target as HTMLInputElement);
        reader.readAsText(fi.files![0]);

    }
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
    return <>
        <ViewerMenu  importFile={importFile} selectSubject={selectSubject} treeData={treeData}/>
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
            <JobViewer rating={treeData[subjectIndex]} target={target_brs} />
        </div>
    </>;
}

export default Viewer;