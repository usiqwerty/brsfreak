import {BRSRating} from "../widgets/BRSRating";
import React, {useEffect, useMemo, useState} from "react";
import {Rating} from "../Rating";
import {fetchRating, parse} from "../api";

import "../css/syle.css";
import EditorMenu from "../widgets/EditorMenu";

const saveFile = async (data: object) => {
    let blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    const a = document.createElement('a');
    a.download = 'brs-export.json';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
        setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
};
let data = [] as Rating[];


function Editor() {
    const [treeData, setTreeData] = useState(data);
    const [subjectIndex, setSubjectIndex] = useState(0)
    const [target_brs, setTarget_brs] = useState(80);
    const [job, setJob] = useState(100)


    function save() {
        localStorage.setItem('brs-tree', JSON.stringify(treeData));
        alert("Saved")
    }

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

    function handleSetField(field: string, value: any, node: Rating, root = treeData) {
        console.log(field, value, node);
        root.forEach((sub) => {
            if (sub === node) {
                switch (field) {
                    case "name": {
                        sub.name = value;
                        break;
                    }
                    case "weight": {
                        sub.weight = Number.parseFloat(value) || null!;
                        break;
                    }
                    case "self-val": {
                        sub.self_value =value? Number.parseInt(value) : null!;
                        break;
                    }
                    case "max-val": {
                        sub.self_maxval = Number.parseInt(value) || null!;
                        break;
                    }
                    case "self-banned": {
                        sub.self_banned = Number.parseInt(value) || null!;
                        break;
                    }
                    default: {
                        console.log(field, value, node);
                    }
                }
                setTreeData([...treeData])

            } else {
                handleSetField(field, value, node, sub.subratings);
            }
        })
    }

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
                alert("File imported");
            } else
                alert('Something went wrong')
        };
        let fi = (e.target as HTMLInputElement);
        reader.readAsText(fi.files![0])
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
        <EditorMenu createSubject={createSubject} importFile={importFile} save={save} saveFile={saveFile} selectSubject={selectSubject} treeData={treeData}/>
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
                onEdit={handleSetField}
                job={job}
            />
        </div>
    </>;
}

export default Editor;