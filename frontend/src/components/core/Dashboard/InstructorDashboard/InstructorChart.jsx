import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useState } from 'react';
import { useEffect } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const InstructorChart = ({ dashboardData }) => {
  const [currentChart, setCurrentChart] = useState("students");
  const [studentsPieColors, setStudentsPieColors] = useState([]);
  const [incomePieColors, setIncomePieColors] = useState([]);

  // Generate n random colors
  const generateRandomColors = (n) => {
    let colors = [];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const color = `rgb(${r}, ${g}, ${b})`;
      colors.push(color);
    }
    return colors;
  }


  const studentsPieData = {
    labels: dashboardData.coursesWithStats.map((courseWithStats) => courseWithStats.course.title),
    datasets: [
      {
        label: "# of Enrolled Students",
        data: dashboardData.coursesWithStats.map((courseWithStats) => courseWithStats.stats.totalStudents),
        backgroundColor: studentsPieColors,
        borderColor: studentsPieColors,
        borderWidth: 1,
      }
    ]
  }

  const incomePieData = {
    labels: dashboardData.coursesWithStats.map((courseWithStats) => courseWithStats.course.title),
    datasets: [
      {
        label: "Total Rupees Earned",
        data: dashboardData.coursesWithStats.map((courseWithStats) => courseWithStats.stats.totalIncome),
        backgroundColor: incomePieColors,
        borderColor: incomePieColors,
        borderWidth: 1,
      }
    ]
  }

  const options = {
    maintainAspectRatio: false,
  }

  // Set random colors once so that, colors changes only when window refresh
  useEffect(() => {
    setStudentsPieColors(generateRandomColors(dashboardData.totalPublishedCourses))
    setIncomePieColors(generateRandomColors(dashboardData.totalPublishedCourses))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  return (
    <div className='bg-richblack-800 h-full rounded-md p-6 flex flex-col flex-1 gap-y-4 '>
      <p className='text-lg text-richblack-5 font-bold' >Visualize</p>

      <div className='space-x-4 font-semibold' >
        <button
          className={`py-1 px-3 rounded-sm transition-all duration-200
          ${currentChart === "students" ? "bg-richblack-700 text-yellow-50" : "text-yellow-400"}
          `}
          onClick={() => setCurrentChart("students")}
        >
          Students
        </button>

        <button
          className={`py-1 px-3 rounded-sm transition-all duration-200
          ${currentChart === "income" ? "bg-richblack-700 text-yellow-50" : "text-yellow-400"}
          `}
          onClick={() => setCurrentChart("income")}
        >
          Income
        </button>
      </div>

      <div className='w-full h-full mx-auto' >
        <Pie
          height={"300px"}
          data={currentChart === "students" ? studentsPieData : incomePieData}
          options={options}
        />
      </div>
    </div>
  )
}

export default InstructorChart
