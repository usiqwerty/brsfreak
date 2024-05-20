import {Rating} from "./Rating";
import React from "react";
import {parse} from "./api";

export async function importFile(e: React.ChangeEvent<HTMLInputElement>, setTreeData: any) {
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

export function saveToLocalStorage(treeData: Rating[]) {
    console.log(treeData);
    localStorage.setItem('brs-tree', JSON.stringify(treeData));
    // console.log(find_attendance_node(treeData[subjectIndex]));
}

export async function saveFile(data: object) {
    let blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    const a = document.createElement('a');
    a.download = 'brs-export.json';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
        setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
}