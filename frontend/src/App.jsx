import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { useRef } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

function App() {

  const reportRef = useRef();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [isRegister, setIsRegister] = useState(false);

  const [user, setUser] = useState(null);

  const [message, setMessage] = useState("");

  const [chatHistory, setChatHistory] = useState([]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [allLogs, setAllLogs] = useState([]);

  const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#9333ea",
  "#0891b2"
];

  const [productivity, setProductivity] = useState({});

  const [issues, setIssues] = useState({});

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {

    try {

      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8000/login",
        {
          name,
          password
        }
      );

      setUser(res.data);

    } catch (error) {

      alert("Login Failed");

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const handleRegister = async () => {

    try {

      await axios.post(
        "http://127.0.0.1:8000/register",
        {
          name,
          password,
          role
        }
      );

      alert("Registration Successful");

      setIsRegister(false);

    } catch (error) {

      alert("Registration Failed");

      console.log(error);

    }
  };

  const submitLog = async () => {

    if (!message.trim()) return;

    const userMessage = {
      type: "user",
      text: message
    };

    setChatHistory((prev) => [
      ...prev,
      userMessage
    ]);

    try {

      const res = await axios.post(
        "http://127.0.0.1:8000/ai-submit-log",
        {
          employee_id: user.user_id,
          message: message
        }
      );

      const data = res.data.structured_data;

      const aiMessage = {
        type: "ai",
        text:
`Task: ${data.task}
Hours: ${data.hours}
Issue: ${data.issue}
Status: ${data.status}`
      };

      setChatHistory((prev) => [
        ...prev,
        aiMessage
      ]);

      setMessage("");

    } catch (error) {

      console.log(error);

      alert("Error submitting log");

    }
  };

  const fetchEmployeeLogs = async () => {

    try {

      const res = await axios.get(
        `http://127.0.0.1:8000/employee-logs/${user.user_id}`
      );

      const logs = res.data;

      let formattedChats = [];

      logs.forEach((log) => {

        formattedChats.push({
          type: "user",
          text: log.task
        });

        formattedChats.push({
          type: "ai",
          text:
`Task: ${log.task}
Hours: ${log.hours}
Issue: ${log.issue}
Status: ${log.status}`
        });

      });

      setChatHistory(formattedChats);

    } catch (error) {

      console.log(error);

    }
  };

  const fetchManagerData = async () => {

    try {

      const logsRes = await axios.get(
        "http://127.0.0.1:8000/all-logs"
      );

      setAllLogs(logsRes.data);

      const prodRes = await axios.get(
        "http://127.0.0.1:8000/productivity-summary"
      );

      setProductivity(prodRes.data);

      const issueRes = await axios.get(
        "http://127.0.0.1:8000/issue-summary"
      );

      setIssues(issueRes.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {

    if (user && user.role === "employee") {

      fetchEmployeeLogs();

    }

  }, [user]);

  useEffect(() => {

    if (user && user.role === "manager") {

      fetchManagerData();

    }

  }, [user]);

  const productivityData = Object.entries(productivity).map(
  ([employee, hours]) => ({
    employee: `Emp ${employee}`,
    hours: Number(hours)
  })
);
  const issueData = Object.entries(issues).map(
  ([issue, count]) => ({
    name: issue,
    value: Number(count)
  })
);

const exportPDF = async () => {

  try {

    const dataUrl = await toPng(reportRef.current);

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;
    const imgHeight = 250;

    pdf.addImage(
      dataUrl,
      "PNG",
      10,
      10,
      imgWidth,
      imgHeight
    );

    pdf.save("AI_WorkLog_Report.pdf");

  } catch (error) {

    console.error(error);

    alert("PDF Export Failed");

  }

};
  if (!user) {

    return (

      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="bg-white w-[350px] p-8 rounded-2xl shadow-xl">

          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
            AI WorkLog
          </h1>

          <input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
          />

          {isRegister && (

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-3 rounded-lg mb-4"
            >

              <option value="employee">
                Employee
              </option>

              <option value="manager">
                Manager
              </option>

            </select>

          )}

          {isRegister ? (

            <button
              onClick={handleRegister}
              className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
            >
              Register
            </button>

          ) : (

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Loading..." : "Login"}
            </button>

          )}

          <button
            onClick={() => setIsRegister(!isRegister)}
            className="w-full mt-4 text-blue-600"
          >

            {isRegister
              ? "Already have an account? Login"
              : "Create New Account"}

          </button>

        </div>

      </div>
    );
  }

  if (user && user.role === "manager") {

    return (

      <div
            id="manager-report"
            ref={reportRef}
            className="min-h-screen bg-gray-100 p-6"
          >

        <div className="flex justify-between items-center mb-8"
            >

          <h1 className="text-4xl font-bold text-blue-600">
            Manager Dashboard
          </h1>

          <button
            onClick={() => setUser(null)}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>

          <button
            onClick={exportPDF}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 ml-4"
          >
            Export PDF
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">
              Total Logs
            </h2>

            <p className="text-4xl font-bold mt-3">
              {allLogs.length}
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">
              Employees
            </h2>

            <p className="text-4xl font-bold mt-3">
              {Object.keys(productivity).length}
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-gray-500">
              Issues Reported
            </h2>

            <p className="text-4xl font-bold mt-3">
              {Object.keys(issues).length}
            </p>

          </div>

        </div>

        <div className="grid grid-cols-2 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-2xl font-semibold mb-4">
              Productivity Summary
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <BarChart data={productivityData}>

                <XAxis
                      dataKey="employee"
                      label={{
                        value: "Employees",
                        position: "insideBottom",
                        offset: -2
                      }}
                    />

                    <YAxis
                      label={{
                        value: "Hours Worked",
                        angle: -90,
                        position: "insideLeft"
                      }}
                    />

                <Tooltip />

                <Bar dataKey="hours">

                    {productivityData.map((entry, index) => (

                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />

                    ))}

                  </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-2xl font-semibold mb-4">
              Issue Analysis
            </h2>

            <ResponsiveContainer width="100%" height={300}>

              <PieChart>

               <Pie
                       data={issueData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >

                      {issueData.map((entry, index) => (

                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />

                      ))}

                    </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>
                    <p className="text-center mt-4 text-gray-600">
              Issues Reported
            </p>

          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow mt-6">

          <h2 className="text-2xl font-semibold mb-4">
            Recent Employee Logs
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-gray-100">

                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Task</th>
                  <th className="p-3 text-left">Hours</th>
                  <th className="p-3 text-left">Status</th>

                </tr>

              </thead>

              <tbody>

                {allLogs.map((log, index) => (

                  <tr key={index} className="border-b">

                    <td className="p-3">
                      {log.employee_name}
                    </td>

                    <td className="p-3">
                      {log.task}
                    </td>

                    <td className="p-3">
                      {log.hours}
                    </td>

                    <td className="p-3">
                      {log.status}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 flex">

      <div className="w-[250px] bg-white shadow-lg p-5 flex flex-col justify-between">

        <div>

          <h1 className="text-2xl font-bold text-blue-600 mb-10">
            AI WorkLog
          </h1>

          <div className="space-y-4">

            <button
              onClick={() => setActiveTab("dashboard")}
              className={
                activeTab === "dashboard"
                  ? "w-full bg-blue-100 text-blue-700 p-3 rounded-lg text-left"
                  : "w-full bg-gray-100 p-3 rounded-lg text-left"
              }
            >
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab("history")}
              className={
                activeTab === "history"
                  ? "w-full bg-blue-100 text-blue-700 p-3 rounded-lg text-left"
                  : "w-full bg-gray-100 p-3 rounded-lg text-left"
              }
            >
              Work History
            </button>

          </div>

        </div>

        <button
          onClick={() => setUser(null)}
          className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </div>

      <div className="flex-1 flex flex-col">

        <div className="bg-white shadow p-5">

          <h2 className="text-2xl font-semibold">
            Employee AI Assistant
          </h2>

          <p className="text-gray-500 mt-1">
            Welcome, {name}
          </p>

        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {activeTab === "dashboard" ? (

            <div className="space-y-4">

              {chatHistory.map((chat, index) => (

                <div
                  key={index}
                  className={
                    chat.type === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >

                  <div
                    className={
                      chat.type === "user"
                        ? "bg-blue-600 text-white p-4 rounded-2xl max-w-[500px] whitespace-pre-line"
                        : "bg-white p-4 rounded-2xl shadow max-w-[500px] whitespace-pre-line"
                    }
                  >

                    {chat.text}

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div>

              <h2 className="text-3xl font-bold mb-6">
                Work History
              </h2>

              <div className="space-y-4">

                {chatHistory
                  .filter((chat) => chat.type === "ai")
                  .map((chat, index) => (

                    <div
                      key={index}
                      className="bg-white p-5 rounded-2xl shadow"
                    >

                      <pre className="whitespace-pre-wrap font-sans">
                        {chat.text}
                      </pre>

                    </div>

                  ))}

              </div>

            </div>

          )}

        </div>

        <div className="bg-white p-5 border-t flex gap-3">

          <textarea
            placeholder="Describe your work today..."
            className="flex-1 border rounded-xl p-4 resize-none"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={submitLog}
            className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;