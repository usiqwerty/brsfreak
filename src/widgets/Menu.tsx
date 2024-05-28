import {useNavigate} from "react-router-dom";
import React from "react";
import {Rating} from "../tools/Rating";

function Menu({treeData, selectSubject, importFile, createSubject=undefined, save=undefined, saveFile=undefined}: {
    treeData: Rating[],
    selectSubject: (e: any) => any,
    importFile: (e: any) => any
    createSubject?: (() => any) | undefined,
    save?: (() => any) | undefined,
    saveFile?: ((data: Rating[]) => any) | undefined,


}) {
    const navigate = useNavigate();
    return <div id={"menu"}>
        <select id={"subject_select"} onChange={(e) => selectSubject(e)}>
            {treeData.map((each, index) => <option value={index} key={index}>{each.name}</option>)}
        </select>
        {
            createSubject != undefined && saveFile!=undefined?
                <>
                    <button onClick={createSubject}>Добавить предмет</button>
                    <button onClick={save}>Сохранить на сервер</button>
                    <button onClick={() => saveFile(treeData)}>Экспорт в файл...</button>
                </> : ''
        }
        <button id={'import-btn'}>
        <label htmlFor="fileimport" className="btn">Загрузить файл...</label>
            <input id={"fileimport"} type={"file"} onChange={(e) => importFile(e)}/>
        </button>
        {
            createSubject == undefined ?
                <button onClick={() => navigate("/editor")}>
                    Редактировать
                </button>
                :
                <button onClick={() => navigate("/")}>
                    Просмотр
                </button>
        }

    </div>;
}

export default Menu;