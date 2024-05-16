import React from "react";
import {Rating} from "../Rating";
import {useNavigate} from "react-router-dom";

function ViewerMenu({treeData, selectSubject, importFile}: {
    treeData: Rating[],
    selectSubject: any,
    importFile: any
}) {
    const navigate= useNavigate();
    return <div id={"menu"}>
        <select onChange={(e) => selectSubject(e)}>
            {treeData.map((each, index) => <option value={index} key={index}>{each.name}</option>)}
        </select>
        <button id={'import-btn'}>
            <label htmlFor="fileimport" className="btn">Загрузить файл...</label>
            <input id={"fileimport"} type={"file"} onChange={(e) => importFile(e)}/>
        </button>
        <button onClick={()=>navigate("/editor")}>
            Редактировать
        </button>
    </div>
}

export default ViewerMenu;