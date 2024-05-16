import "../css/jobs.css";
type JobTask = { name: string, amount: number };

function Task({task}: {task:JobTask}){
    return <div className={"job-task"}>
        <span>{task.name}</span>
        <span>{task.amount}</span>
    </div>
}
export default Task;