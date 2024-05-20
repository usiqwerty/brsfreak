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