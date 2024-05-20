import {BRSRating} from "../widgets/BRSRating";
import React, {useEffect, useMemo, useState} from "react";
import {Rating} from "../Rating";
import {fetchRating, find_attendance_node, handleSetField, importFile, saveFile, saveToLocalStorage} from "../api";

import "../css/syle.css";
import EditorMenu from "../widgets/EditorMenu";

let data = [] as Rating[];

function Editor() {
    const [treeData, setTreeData] = useState(data);
    const [subjectIndex, setSubjectIndex] = useState(0)
    const [target_brs, setTarget_brs] = useState(80);
    const [job, setJob] = useState(100)

    function createSubject() {
        treeData.push(new Rating("Новый предмет", 1))
        setTreeData([...treeData]);
    }

    function selectSubject(e: any) {
        setSubjectIndex(Number.parseInt(e.target.value));
    }

    const handleDelete = (nodeToDelete: Rating) => {
        remove(treeData, nodeToDelete);
        setTreeData([...treeData]);

    };


    const handleAddChild = (parentNode: Rating) => {
        const newNode = new Rating('Новый элемент', 1); //{name: 'Новый элемент', children: []};
        parentNode.subratings.push(newNode);
        setTreeData([...treeData]); // Создаем новый объект массива, чтобы React обнаружил изменения
    };

    function remove(tree: Rating[], nodeToDelete: Rating) {
        tree.forEach((sub) => {
            if (sub === nodeToDelete) {
                const idx = tree.indexOf(sub);
                if (idx > -1) {
                    tree.splice(idx, 1);
                }
            } else {
                remove(sub.subratings, nodeToDelete);
            }
        })
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
        <EditorMenu createSubject={createSubject}
                    importFile={(event:any) =>importFile(event, setTreeData)}
                    save={()=> {
                        saveToLocalStorage(treeData);
                        alert("Saved");
                    }}
                    saveFile={saveFile}
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

        <div id={"ratings-container"}>
            <BRSRating
                key={subjectIndex}
                node={treeData[subjectIndex]}
                onAddChild={handleAddChild}
                onDelete={handleDelete}
                onEdit={(field:string, value:boolean, node:Rating, root= treeData)=>handleSetField(field, value, node, root, setTreeData, treeData)}
                job={job}
            />
        </div>
    </>;
}

export default Editor;