import { useDispatch, useSelector } from "react-redux";
import { updateTask, deleteTask } from "../features/taskSlice";


export default function TaskBoard({ projectId }) {
  const { list } = useSelector((s) => s.tasks);
  const dispatch = useDispatch();

  const handleStatusChange = (task, newStatus) => {
    dispatch(updateTask({ id: task._id, data: { status: newStatus } }));
  };

  return (
    <div className="task-board">
      {["todo", "in-progress", "done"].map((status) => (
        <div key={status} className="task-column">
          <h3>{status.toUpperCase()}</h3>
          {list.filter((t) => t.status === status).map((task) => (
            <div key={task._id} className="task-card">
              <p>{task.title}</p>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task, e.target.value)}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button onClick={() => dispatch(deleteTask(task._id))}>❌</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
