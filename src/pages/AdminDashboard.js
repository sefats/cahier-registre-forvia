import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import VisitsChart from "../components/VisitsChart";
import VisitorMemberComparisonChart from "../components/VisitorMemberComparisonChart";
import MonthlyStatsChart from "../components/MonthlyStatsChart";
import MonthlyVisitorsByOfficeChart from "../components/MonthlyVisitorsByOfficeChart";
import TotalVisitorsByOfficePieChart from "../components/TotalVisitorsByOfficePieChart";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [visitors, setVisitors] = useState([]);
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("startTime");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [selectedCompany] = useState("all");
  const [selectedTitle] = useState("all");
  const [selectedContactPerson] = useState("all");
  const [monthlyVisitorsByOfficeData, setMonthlyVisitorsByOfficeData] =
    useState([]);
  const [totalVisitorsByOfficeData, setTotalVisitorsByOfficeData] = useState(
    []
  );

  useEffect(() => {
    fetchVisitors();
    fetchMembers();
  }, []);

  const fetchVisitors = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/visitors");
      const data = await response.json();
      setVisitors(data.map((visitor) => ({ ...visitor, type: "visitor" })));
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/members");
      const data = await response.json();
      setMembers(data.map((member) => ({ ...member, type: "member" })));
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const handleDeleteVisitor = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/visitors/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setVisitors(visitors.filter((visitor) => visitor.id !== id));
        setShowDeletePopup(false);
      } else {
        console.error("Failed to delete visitor");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/members/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMembers(members.filter((member) => member.id !== id));
        setShowDeletePopup(false);
      } else {
        console.error("Failed to delete member");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const compareValues = (a, b, field) => {
    if (a[field] < b[field]) return sortOrder === "asc" ? -1 : 1;
    if (a[field] > b[field]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  };

  const compareDates = (a, b, field) => {
    return sortOrder === "asc"
      ? new Date(a[field]) - new Date(b[field])
      : new Date(b[field]) - new Date(a[field]);
  };

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCompany === "all" || visitor.entreprise === selectedCompany) &&
      (selectedContactPerson === "all" ||
        visitor.contactPerson === selectedContactPerson)
  );

  const filteredMembers = members.filter(
    (member) =>
      member.sn.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTitle === "all" || member.title === selectedTitle)
  );

  const combinedData = [...filteredVisitors, ...filteredMembers];

  const sortedData = [...combinedData].sort((a, b) => {
    return sortField === "startTime" || sortField === "endTime"
      ? compareDates(a, b, sortField)
      : compareValues(a, b, sortField);
  });

  const displayData =
    filter === "visitors"
      ? sortedData.filter((data) => data.type === "visitor")
      : filter === "members"
      ? sortedData.filter((data) => data.type === "member")
      : sortedData;

  const handleDeleteClick = (entry) => {
    setDeleteTarget(entry);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (deleteTarget.type === "visitor") {
      handleDeleteVisitor(deleteTarget.id);
    } else {
      handleDeleteMember(deleteTarget.id);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteTarget(null);
  };

  // Helper function to get the week number of a given date
  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Prepare data for charts
  const prepareWeeklyVisitsData = () => {
    const weekCounts = {};
    let dataSource =
      filter === "visitors"
        ? visitors
        : filter === "members"
        ? members
        : [...visitors, ...members];

    dataSource.forEach((entry) => {
      const week = getWeekNumber(new Date(entry.startTime));
      weekCounts[week] = (weekCounts[week] || 0) + 1;
    });

    const sortedWeeks = Object.keys(weekCounts).sort((a, b) => a - b);
    const labels = sortedWeeks.map((week) => `Semaine ${week}`);
    const data = sortedWeeks.map((week) => weekCounts[week]);

    return {
      labels,
      datasets: [
        {
          label: "Visites",
          data,
          backgroundColor: ["rgba(75, 192, 192, 0.2)"],
          borderColor: ["rgba(75, 192, 192, 1)"],
          borderWidth: 1,
        },
      ],
    };
  };

  const prepareVisitorMemberComparisonData = () => {
    const visitorCount = filter !== "members" ? visitors.length : 0;
    const memberCount = filter !== "visitors" ? members.length : 0;

    return {
      labels: ["Visiteurs externes", "Employés"],
      datasets: [
        {
          data: [visitorCount, memberCount],
          backgroundColor: ["#FF6384", "#36A2EB"],
        },
      ],
    };
  };

  const prepareMonthlyStats = () => {
    const monthCounts = {};
    let dataSource =
      filter === "visitors"
        ? visitors
        : filter === "members"
        ? members
        : [...visitors, ...members];

    dataSource.forEach((entry) => {
      const month = new Date(entry.startTime).getMonth();
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthCounts).sort((a, b) => a - b);
    const labels = sortedMonths.map((month) =>
      new Date(0, month).toLocaleString("fr-FR", { month: "long" })
    );
    const data = sortedMonths.map((month) => monthCounts[month]);

    return {
      labels,
      datasets: [
        {
          label: "Visites par mois",
          data,
          backgroundColor: ["rgba(75, 192, 192, 0.2)"],
          borderColor: ["rgba(75, 192, 192, 1)"],
          borderWidth: 1,
        },
      ],
    };
  };

  const weeklyVisitsData = prepareWeeklyVisitsData();
  const visitorMemberComparisonData = prepareVisitorMemberComparisonData();
  const monthlyStatsData = prepareMonthlyStats();

  const prepareMonthlyVisitorsByOfficeData = () => {
    const monthOfficeCounts = {};

    members.forEach((member) => {
      const month = new Date(member.startTime).toLocaleString("default", {
        month: "long",
      });
      const office = member.office;

      if (!monthOfficeCounts[month]) {
        monthOfficeCounts[month] = {};
      }
      if (!monthOfficeCounts[month][office]) {
        monthOfficeCounts[month][office] = 0;
      }
      monthOfficeCounts[month][office]++;
    });

    const sortedMonths = Object.keys(monthOfficeCounts).sort(
      (a, b) => new Date(`01 ${a} 2000`) - new Date(`01 ${b} 2000`)
    );

    const labels = sortedMonths;
    const datasets = [];

    // Generate dynamic colors for offices
    const officeColors = {};

    Object.keys(monthOfficeCounts).forEach((month) => {
      Object.keys(monthOfficeCounts[month]).forEach((office, index) => {
        if (!officeColors[office]) {
          const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, 0.2)`;
          officeColors[office] = color;
        }
      });
    });

    // Prepare datasets for each office
    Object.keys(officeColors).forEach((office) => {
      const data = sortedMonths.map(
        (month) => monthOfficeCounts[month][office] || 0
      );
      datasets.push({
        label: office,
        data,
        backgroundColor: officeColors[office],
        borderColor: officeColors[office].replace("0.2", "1"),
        borderWidth: 1,
      });
    });

    return {
      labels,
      datasets,
    };
  };

  const prepareTotalVisitorsByOfficeData = () => {
    const officeCounts = {};

    members.forEach((member) => {
      const office = member.office;
      officeCounts[office] = (officeCounts[office] || 0) + 1;
    });

    const labels = Object.keys(officeCounts);
    const data = labels.map((office) => officeCounts[office]);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const handleStatisticsToggle = (e) => {
    setShowStatistics(e.target.checked);
    if (!e.target.checked) {
      setMonthlyVisitorsByOfficeData([]);
      setTotalVisitorsByOfficeData([]);
    } else {
      setMonthlyVisitorsByOfficeData(prepareMonthlyVisitorsByOfficeData());
      setTotalVisitorsByOfficeData(prepareTotalVisitorsByOfficeData());
    }
  };

  return (
    <div className="admin-dashboard-container">
      <Navbar />
      <div className="nav-divider"></div>
      <h2 className="title">{t("admin_dashboard")}</h2>
      <div className="filter-container">
        <select onChange={handleFilterChange} value={filter}>
          <option value="all">{t("all")}</option>
          <option value="visitors">{t("visitor")}</option>
          <option value="members">{t("employé")}</option>
        </select>
        {!showStatistics && (
          <input
            type="text"
            placeholder={t("search") + " " + t("name")}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        )}
        <label className="statistics-toggle">
          <input
            type="checkbox"
            checked={showStatistics}
            onChange={handleStatisticsToggle}
          />
          {t("statistiques")}
        </label>
      </div>
      {showStatistics ? (
        <div className="charts-container">
          <VisitsChart data={weeklyVisitsData} />
          <VisitorMemberComparisonChart data={visitorMemberComparisonData} />
          <MonthlyStatsChart data={monthlyStatsData} />
          <MonthlyVisitorsByOfficeChart
            data={monthlyVisitorsByOfficeData}
            title="Visiteurs mensuels par bureau"
          />
          <TotalVisitorsByOfficePieChart
            data={totalVisitorsByOfficeData}
            title="Total visiteurs par bureau (en pie chart)"
          />
        </div>
      ) : (
        <table className="visits-table">
          <thead>
            <tr>
              <th onClick={() => handleSortChange("name")}>{t("name")}</th>
              <th onClick={() => handleSortChange("firstname")}>
                {t("firstname")}
              </th>
              {filter !== "members" && (
                <th onClick={() => handleSortChange("email")}>{t("email")}</th>
              )}
              <th onClick={() => handleSortChange("phone")}>{t("phone")}</th>
              {filter !== "members" && (
                <th onClick={() => handleSortChange("company")}>
                  {t("company")}
                </th>
              )}
              {filter !== "visitors" && (
                <th onClick={() => handleSortChange("title")}>{t("poste")}</th>
              )}
              {filter !== "visitors" && (
                <th onClick={() => handleSortChange("office")}>
                  {t("office")}
                </th>
              )}
              <th onClick={() => handleSortChange("contactPerson")}>
                {t("contact_person")}
              </th>
              <th onClick={() => handleSortChange("startTime")}>
                {t("start_time")}
              </th>
              <th onClick={() => handleSortChange("endTime")}>
                {t("end_time")}
              </th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name || entry.sn}</td>
                <td>{entry.firstname || entry.givenName}</td>
                {filter !== "members" && <td>{entry.email || entry.mail}</td>}
                <td>{entry.phone}</td>
                {filter !== "members" && <td>{entry.entreprise}</td>}
                {filter !== "visitors" && <td>{entry.title}</td>}
                {filter !== "visitors" && <td>{entry.office}</td>}
                <td>{entry.contactPerson}</td>
                <td>
                  {new Date(entry.startTime).toLocaleString("fr-FR", {
                    hour12: false,
                  })}
                </td>
                <td>
                  {new Date(entry.endTime).toLocaleString("fr-FR", {
                    hour12: false,
                  })}
                </td>
                <td className="actions">
                  <button onClick={() => handleDeleteClick(entry)}>
                    {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showDeletePopup && (
        <div className="delete-popup">
          <p>{t("delete_confirmation")}</p>
          <button onClick={confirmDelete}>{t("yes")}</button>
          <button onClick={cancelDelete}>{t("no")}</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
