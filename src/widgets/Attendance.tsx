import {Calendar} from "@natscale/react-calendar";
import React, {useState} from "react";
import "../css/attendance.css";
import '@natscale/react-calendar/dist/main.css';

import {Rating} from "../Rating";

function Attendance({onEdit, node}: { onEdit: any, node: Rating }) {
    const [dates, setDates] = useState([...node.attended]);
    console.log(node);
    return <div id={"attendance"}>
        <Calendar onChange={v => {
            setDates(v as Date[]);
            onEdit(v);
        }}
                  isMultiSelector={true}
                  value={dates}
        />
    </div>
}

export default Attendance;