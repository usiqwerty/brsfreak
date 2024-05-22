import {Calendar} from "@natscale/react-calendar";
import React, {useState} from "react";
import "../css/attendance.css";
// import '@natscale/react-calendar/dist/main.css';

import {Rating} from "../tools/Rating";

function AttendanceEditor({onEdit, node}: { onEdit: any, node: Rating }) {
    const [dates, setDates] = useState([...node.attended]);

    // @ts-ignore
    const size: number= "auto";
    return <div id={"attendance"}>
        <Calendar onChange={v => {
            setDates(v as Date[]);
            onEdit(v)
        }}
                  isMultiSelector={true}
                  value={dates}
                  size={size}
        />
    </div>
}

export default AttendanceEditor;