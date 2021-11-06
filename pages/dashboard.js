import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { useUser } from "../lib/UserContext";

export default function Dashboard() {
  const router = useRouter();

  const [task, setTask] = useState("");
  const [taskData, setTaskData] = useState([]);
  const { user, session } = useUser();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/signin");
  }

  /*
   * fetchData()
   *
   * This is where we select all rows from a table called 'tasks'.
   *
   * Notice that we use * in the select(), we are basically doing the same as running SQL
   * on our database, like: `select * from public.tasks`
   *
   * We are going to return all the rows from the table, although row level security(RLS)
   * might be enforced to make sure we only return the rows that our user is allowed to select.
   *
   * https://supabase.io/docs/reference/javascript/select
   *
   */
  async function fetchData() {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) {
      console.error(error);
      return alert(error.message);
    }
    setTaskData(data);
  }

  /*
   * handleInsertTask()
   *
   * This is where we insert 1 row to the table called 'tasks'.
   *
   * Notice that we are inserting an array of objects, although we are only inserting one in this example,
   * but you can insert as many rows as you like at once.
   *
   * https://supabase.io/docs/reference/javascript/select
   *
   * Once we have inserted a task, we set the task state to an empty string
   * and then we also run fetchData() to refetch all the tasks again, this time, with the new task you've inserted.
   *
   * hint: Another possible way of doing this is using the `data` variable from the insert,
   * which will be an array of what you just inserted, you could use that to mutate the taskData state.
   *
   */
  async function handleInsertTask() {
    const { data, error } = await supabase.from("tasks").insert([
      {
        user_id: user.id,
        task: task,
      },
    ]);
    if (error) {
      console.error(error);
      return alert(error.message);
    }
    console.log(data);
    setTask("");
    fetchData();
  }

  /*
   * handleChecked()
   *
   * This is where we update 1 row, which we've filtered using EQ.
   *
   * Notice there are 2 things happening here.
   * We are updating rows in our `tasks` table to have a new value for `checked` column,
   * but we also additionally use .eq() at the end of the update().
   * We are basically saying, update rows, but only ones which pass this eq() rule.
   *
   * In this example we are checking that the id of rows in the `tasks` table,
   * equals that of the id of the task we are checking on/off in our client.
   *
   * https://supabase.io/docs/reference/javascript/update
   * https://supabase.io/docs/reference/javascript/eq
   *
   * Then, once we have inserted a task, we set the `task` useState to an empty string (to reset the input value)
   * and then we also run fetchData() to refetch all the tasks again, this time, with the new task you've inserted.
   *
   * hint: Another possible way of doing this is using the `data` variable from the insert,
   * which will be an array of what you just inserted; you could use that to mutate the taskData state.
   *
   */
  async function handleChecked(task) {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        checked: !task.checked,
      })
      .eq("id", task.id);

    if (error) {
      console.error(error);
      return alert(error.message);
    }
    fetchData();
  }

  /*
   * run fetchData first to populate the page
   */
  useEffect(() => {
    fetchData();
  }, []);

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
        <button onClick={handleInsertTask}>Make task</button>
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
