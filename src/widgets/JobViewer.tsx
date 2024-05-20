import {Rating} from "../tools/Rating";
import {useEffect, useState} from "react";
import Task from "./Task";
import "../css/syle.css";
import "../css/mobile.css";

type JobTask = { name: string, amount: number, parent: string | null };

function flatten_jobs(rating: Rating, rating_job: number, parent: string | null): JobTask[] {
    if (rating.subratings.length === 0) {
        if (rating_job)
            return [{name: rating.name, amount: rating_job, parent: parent}]
        else
            return []
    }
    let result: JobTask[] = [];


    for (const sub of rating.subratings) {
        const sub_job = rating.free() ? rating_job * sub.free() / rating.free() : 0;
        flatten_jobs(sub, sub_job, rating.name).forEach(item => result.push(item));
    }
    return result;
}

function JobViewer({rating, target}: { rating: Rating, target: number }) {
    const job = Math.min(target - rating.value(), rating.free());
    const [tasks, setTasks] = useState([] as JobTask[]);

    useEffect(() => {
        setTasks(flatten_jobs(rating, job, null));
    }, [job, rating]);

    return <div id={"job-viewer"}>
        {tasks.map((task) =>
            <Task task={task} key={task.name + task.parent}/>
        )}
    </div>
}

export default JobViewer;