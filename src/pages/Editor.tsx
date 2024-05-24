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

import {BRSRating} from "../widgets/BRSRating";
import React, {useEffect, useMemo, useState} from "react";
import {Rating} from "../tools/Rating";
import {fetchRating} from "../tools/api";

import "../css/syle.css";
import EditorMenu from "../widgets/EditorMenu";
import {importFile, saveFile, saveToServer} from "../tools/storage";
import {handleSetField} from "../tools/editor";

let data = [] as Rating[];

function Editor() {
    const [treeData, setTreeData] = useState(data);
    const [subjectIndex, setSubjectIndex] = useState(0)
    const [target_brs, setTarget_brs] = useState(80);
    const [job, setJob] = useState(100)
    const [password, setPassword] = useState(null! as string);
    function createSubject() {
        treeData.push(new Rating("Новый предмет", 1));
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
        if (subjectIndex<treeData.length)
            setJob(Math.min(target_brs - treeData[subjectIndex].value(), treeData[subjectIndex].free()));

    }, [subjectIndex, target_brs, treeData]);
    useMemo(async () => {
        const pass = localStorage.getItem("brsfreak-pass")!;
        const username = localStorage.getItem("brsfreak-username")!;
        setPassword(pass);
        setTreeData(await fetchRating(1000, username, pass));
    }, []);

    if (treeData[subjectIndex] === undefined)
        return <EditorMenu createSubject={createSubject}
                           importFile={(event: any) => importFile(event, setTreeData)}
                           save={() => {
                               saveToServer(treeData, password);
                               alert("Saved");
                           }}
                           saveFile={saveFile}
                           selectSubject={selectSubject}
                           treeData={treeData}/>
        //return <>Произошла ошибка (данные предмета undefined)</>

    return <>
        <EditorMenu createSubject={createSubject}
                    importFile={(event: any) => importFile(event, setTreeData)}
                    save={() => {
                        saveToServer(treeData, password);
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
                onEdit={(field: string, value: boolean, node: Rating, root = treeData) =>
                    handleSetField(field, value, node, root, setTreeData, treeData)}
                job={job}
            />
        </div>
    </>;
}

export default Editor;