import {Rating} from "./Rating";
import React from "react";

function parse_attended(attended: string[]):Date[]{
    if (attended===undefined)
        return [];
    let res = [] as Date[];
    for (const date of attended){
        res.push(new Date(date));
    }
    return res;
}
export function parse(json: Rating): Rating {
    // @ts-ignore
    let x = new Rating(json.name, json.weight, json.self_maxval, json.self_value, json.self_banned, parse_attended(json.attended as string[]), json.attendable);

    x.subratings = json.subratings.map((each: Rating) => parse(each));
    return x;
}

export function fetchRating(discipline_id: number): Rating[] {
    if (localStorage.getItem('brs-tree') !== null) {
        let json = JSON.parse(localStorage.getItem('brs-tree')!) as [];
        return json.map((item) => {
            return parse(item)
        });
    } else {
        let x = new Rating("root", 1);
        return [x];
    }
}

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

export function handleSetField(field: string, value: any, node: Rating, root: Rating[], setTreeData: any, treeData: Rating[]) { //root= = treeData
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
                    sub.self_value = value ? Number.parseInt(value) : null!;
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
                case "attendable": {
                    sub.attendable = value;
                    break;
                }
                case "attended": {
                    sub.attended = value;
                    sub.self_value = sub.attended.length;
                    console.log(sub.name, sub.self_value);
                    break;
                }
                default: {
                    console.log(field, value, node);
                }
            }
            setTreeData([...treeData])

        } else {
            handleSetField(field, value, node, sub.subratings, setTreeData, treeData);
        }
    })
}

export function find_attendance_node(root: Rating): Rating | null {
    // console.log("check_att", root.name, root.attendable)
    if (root.attendable)
        return root;

    for (const child of root.subratings) {
        const ans = find_attendance_node(child);
        if (ans === null)
            continue;
        else
            return ans;
    }
    return null;
}
export function saveToLocalStorage(treeData: Rating[]) {
    console.log(treeData);
    localStorage.setItem('brs-tree', JSON.stringify(treeData));
    // console.log(find_attendance_node(treeData[subjectIndex]));
}

export async function saveFile (data: object){
    let blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    const a = document.createElement('a');
    a.download = 'brs-export.json';
    a.href = URL.createObjectURL(blob);
    a.addEventListener('click', (e) => {
        setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
}