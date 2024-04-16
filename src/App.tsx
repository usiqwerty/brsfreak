import React, {useEffect, useMemo, useState} from 'react';
import {BRSRating} from "./widgets/BRSRating";
import {Rating} from "./Rating";
import {fetchRating} from "./api";
import "./css/syle.css";
// Пример данных дерева
let data = [] as Rating[];


// Использование редактора дерева
const App = () => {
    const [treeData, setTreeData] = useState(data);
    const [subjectIndex, setSubjectIndex] = useState(0)
    const [target_brs, setTarget_brs] = useState(80);
    const [job, setJob] = useState(100)

    useMemo(() => {
        setTreeData(fetchRating(1000));
    }, []);

    const handleAddChild = (parentNode: Rating) => {
        const newNode = new Rating( 'Новый элемент', 1); //{name: 'Новый элемент', children: []};
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


    const handleDelete = (nodeToDelete: Rating) => {
        remove(treeData, nodeToDelete);
        setTreeData([...treeData]);

    };

    function handleSetField(field:string, value:any, node:Rating, root= treeData){
        console.log(field, value, node);
        root.forEach((sub) => {
            if (sub === node) {
                switch (field) {
                    case "name": {
                        sub.name = value;
                        break;
                    }
                    case "weight":{
                        sub.weight = Number.parseFloat(value) ||null!;
                        break;
                    }
                    case "self-val":{
                        sub.self_value = Number.parseInt(value) || null! ;
                        break;
                    }
                    case "max-val":{
                        sub.self_maxval = Number.parseInt(value) || null! ;
                        break;
                    }
                    case "self-banned":{
                        sub.self_banned = Number.parseInt(value) || null! ;
                        break;
                    }
                    default:
                    {
                        console.log(field, value, node);
                    }
                }
                setTreeData([...treeData])

            } else {
                handleSetField(field, value, node, sub.subratings);
            }
        })
    }
    function save(){
        localStorage.setItem('brs-tree', JSON.stringify(treeData));
        alert("Saved")
    }
    function createSubject(){
        treeData.push(new Rating("Новый предмет", 1))
        setTreeData([...treeData]);
    }

    function selectSubject(e:any){
        setSubjectIndex(Number.parseInt(e.target.value));
    }

    useEffect(() => {
        setJob(Math.min (target_brs - treeData[subjectIndex].value(), treeData[subjectIndex].free()));

    }, [subjectIndex, target_brs, treeData]);
    if (treeData[subjectIndex] === undefined)
        return <></>

    return (
        <div>
            <div>
                <select onChange={(e)=>selectSubject(e)}>
                    {treeData.map((each, index)=><option value={index}>{each.name}</option>)}
                </select>
                <button onClick={createSubject}>Добавить предмет</button>
                <button onClick={save}>Save</button>
            </div>

            <div>
                Цель <input name={"target_brs"} onChange={(e)=>{setTarget_brs(Number.parseInt(e.target.value))}} value={target_brs}/><br />
                Необходимо ещё набрать {job}
                {job+treeData[subjectIndex].value()<target_brs?
                    <p>Внимание! Максимально возможный балл <b>{job+treeData[subjectIndex].value()}</b></p>:<></>}
            </div>
            <div id={"ratings-container"}>
                <BRSRating
                    key={subjectIndex}
                    node={treeData[subjectIndex]}
                    onAddChild={handleAddChild}
                    onDelete={handleDelete}
                    onEdit={handleSetField}
                    job = {job}
                />
            </div>
        </div>
    );
};

export default App;