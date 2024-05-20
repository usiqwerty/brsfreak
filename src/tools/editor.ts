import {Rating} from "./Rating";

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