import React from "react";
import {Rating} from "../Rating";
import {useNavigate} from "react-router-dom";

function EditorMenu({treeData, createSubject, save, saveFile, selectSubject, importFile}: {
    treeData: Rating[],
    createSubject: any,
    save: any,
    saveFile: any,
    selectSubject: any,
    importFile: any
}) {
    const navigate= useNavigate();
    return <div id={"menu"}>
        <select onChange={(e) => selectSubject(e)}>
            {treeData.map((each, index) => <option value={index} key={index}>{each.name}</option>)}
        </select>
        <button onClick={createSubject}>Добавить предмет</button>
        <button onClick={save}>Сохранить</button>
        <button onClick={() => saveFile(treeData)}>Экспорт в файл...</button>
        <button id={'import-btn'}>
            <label htmlFor="fileimport" className="btn">Загрузить файл...</label>
            <input id={"fileimport"} type={"file"} onChange={(e) => importFile(e)}/>
        </button>
        <button onClick={()=>navigate("/")}>
            Просмотр
        </button>
    </div>;
}

export default EditorMenu;