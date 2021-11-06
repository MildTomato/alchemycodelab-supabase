import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSupabase from "../hooks/useSupabase";
import { useUser } from "../lib/UserContext";

export default function Dashboard() {
  const router = useRouter();

  const [task, setTask] = useState("");
  const [taskData, setTaskData] = useState([]);
  const { user, session } = useUser();

  //   if (!session) router.push("/signin");

  async function handleLogout() {
    await useSupabase.auth.signOut();
    router.push("/signin");
  }

  async function fetchData() {
    const { data, error } = await useSupabase.from("tasks").select("*");
    if (error) {
      return alert(error.message);
    }
    setTaskData(data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function handleMakeTask() {
    const { data, error } = await useSupabase.from("tasks").insert([
      {
        user_id: user.id,
        task: task,
      },
    ]);
    if (error) {
      return alert(error.message);
    }
    console.log(data);
    setTask("");
    fetchData();
  }

  async function handleChecked(task) {
    console.log(task);
    const { data, error } = await useSupabase
      .from("tasks")
      .update({
        checked: !task.checked,
      })
      .eq("id", task.id);

    if (error) {
      return alert(error.message);
    }
    fetchData();
  }

  return (
    <>
      <h1>My to do app</h1>
      <div style={{ marginBottom: "32px" }}>
        <label htmlFor="task">Make task</label>
        <input
          name="task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleMakeTask}>Make task</button>
      </div>
      <div style={{ marginBottom: "32px" }}>
        {taskData.length <= 0 ? (
          <span>No tasks yet...</span>
        ) : (
          <>
            <small style={{ color: "gray" }}>Tasks to do:</small>
            <ol style={{ listStyle: "none", margin: "0px" }}>
              {taskData
                .filter((x) => !x.checked)
                .map((x) => {
                  return (
                    <li
                      style={{
                        display: "flex",
                        marginBottom: "8px",
                        marginLeft: "0px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={x.checked}
                        style={{ marginRight: "16px" }}
                        onChange={() => handleChecked(x)}
                      />
                      <div>{x.task}</div>
                    </li>
                  );
                })}
            </ol>
            <small style={{ color: "gray" }}>Done:</small>
            <ol style={{ listStyle: "none", margin: "0px", opacity: "50%" }}>
              {taskData
                .filter((x) => x.checked)
                .map((x) => {
                  return (
                    <li
                      style={{
                        display: "flex",
                        marginBottom: "8px",
                        marginLeft: "0px",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={x.checked}
                        style={{ marginRight: "16px" }}
                        onChange={() => handleChecked(x)}
                      />
                      <div>{x.task}</div>
                    </li>
                  );
                })}
            </ol>
          </>
        )}
      </div>
      <button onClick={handleLogout}>Log out</button>
      <div style={{ margin: "128px 0" }}></div>
      <div>
        <code>user</code>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
      <div>
        <code>session</code>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    </>
  );
}
