import React from "react";
import {Rating} from "../Rating";

function ViewerMenu({treeData, selectSubject, importFile}: {
    treeData: Rating[],
    selectSubject: any,
    importFile: any
}) {
    return <div id={"menu"}>
        <select onChange={(e) => selectSubject(e)}>
            {treeData.map((each, index) => <option value={index} key={index}>{each.name}</option>)}
        </select>
        <button id={'import-btn'}>
            <label htmlFor="fileimport" className="btn">Загрузить файл...</label>
            <input id={"fileimport"} type={"file"} onChange={(e) => importFile(e)}/>
        </button>

    </div>
}

export default ViewerMenu;