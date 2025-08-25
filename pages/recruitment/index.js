import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import withAuth from "@/components/withAuth";
import FilterDropdown from "@/components/recruitments/FilterDropdown";

// Ensure all required components are registered
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const convertToCSV = (data) => {
    const header = "Name,Email,RegNo,PhoneNo,Year,Degree,Domain,Status\n";
    const rows = data.map((row) => {
        return `${row.name},${row.email},${row.registrationNumber},${row.phone},${row.year},${row.degreeWithBranch},${row.domain},${row.status}`;
    });
    return header + rows.join("\n");
};

const Recruitment = () => {
    const [recruitmentData, setRecruitmentData] = useState([]);
    const [filteredRecruitmentData, setFilteredRecruitmentData] = useState([]);
    const [activeFilters, setActiveFilters] = useState({});
    const [showTable, setShowTable] = useState(false);
    const [showMoreAnalytics, setShowMoreAnalytics] = useState(false);
    const [domains, setDomains] = useState({});
    const [firstYearCount, setFirstYearCount] = useState(0);
    const [secondYearCount, setSecondYearCount] = useState(0);
    const [yearDomainData, setYearDomainData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/v1/recruitment");
                const data = response.data.data;
                setRecruitmentData(data);
                setFilteredRecruitmentData(data);
                processDomains(data);
            } catch (error) {
                console.error("Error fetching recruitment data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [activeFilters]);

    const handleDownloadCSV = () => {
        if (filteredRecruitmentData.length > 0) {
            const csv = convertToCSV(filteredRecruitmentData);
            const blob = new Blob([csv], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `recruitmentData.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.warn("No participants to download.");
        }
    };


    const processDomains = (data) => {
        const domainCount = {};
        const yearDomainData = {
            Technical: { firstYear: 0, secondYear: 0 },
            Creative: { firstYear: 0, secondYear: 0 },
            Corporate: { firstYear: 0, secondYear: 0 }
        };

        let firstYear = 0;
        let secondYear = 0;

        data.forEach((item) => {
            // Normalize year data
            const year = item.year.toLowerCase().includes('1st') || item.year.toLowerCase().includes('1') ? '1st' : '2nd';
            const yearKey = year === "1st" ? "firstYear" : "secondYear";

            // Count domain occurrences
            const domain = item.domain;
            domainCount[domain] = (domainCount[domain] || 0) + 1;

            // Count year-wise domain data
            if (yearDomainData[domain]) {
                yearDomainData[domain][yearKey] += 1;
            }

            // Count total years
            if (year === "1st") firstYear++;
            else if (year === "2nd") secondYear++;
        });

        setDomains(domainCount);
        setFirstYearCount(firstYear);
        setSecondYearCount(secondYear);
        setYearDomainData(yearDomainData);
    };

    const handleShowTable = () => {
        setShowTable(!showTable);
    };

    const handleShowMoreAnalytics = () => {
        setShowMoreAnalytics(!showMoreAnalytics);
    };

    // Define the yearWiseDomainChartData properly
    const yearWiseDomainChartData = {
        labels: ["Technical", "Creative", "Corporate"],
        datasets: [
            {
                label: '1st Year',
                data: [
                    yearDomainData.Technical?.firstYear || 0,
                    yearDomainData.Creative?.firstYear || 0,
                    yearDomainData.Corporate?.firstYear || 0
                ],
                backgroundColor: '#36A2EB'
            },
            {
                label: '2nd Year',
                data: [
                    yearDomainData.Technical?.secondYear || 0,
                    yearDomainData.Creative?.secondYear || 0,
                    yearDomainData.Corporate?.secondYear || 0
                ],
                backgroundColor: '#F4CE14'
            }
        ]
    };

    const totalRegistrations = recruitmentData.length;

    const domainChartData = {
        labels: Object.keys(domains),
        datasets: [{
            label: 'Number of Registrations',
            data: Object.values(domains),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }],
    };

    const getStatusStyle = (status) => {
        if (status === "taskSubmitted") return { color: "#FF9800" }; // Orange text
        if (status === "interviewShortlisted") return { backgroundColor: "#FFEB3B", fontWeight: "bold" }; // Yellow background, bold text
        if (status === "onboarding") return { backgroundColor: "#4CAF50", fontWeight: "900" }; // Green + Extra Bold text
        return {};
    };

    const applyFilters = () => {
        let filteredData = recruitmentData;

        // Apply domain filters (Technical, Creative, Corporate)
        if (activeFilters.Technical || activeFilters.Creative || activeFilters.Corporate) {
            filteredData = filteredData.filter((record) => {
                if (activeFilters.Technical && record.domain === 'Technical') return true;
                if (activeFilters.Creative && record.domain === 'Creative') return true;
                if (activeFilters.Corporate && record.domain === 'Corporate') return true;
                return false;
            });
        }

        // Apply task shortlisted filter
        if (activeFilters.taskSubmitted) {
            filteredData = filteredData.filter((record) => record.status === "taskSubmitted");
        }

        // Apply interview shortlisted filter
        if (activeFilters.interviewShortlisted) {
            filteredData = filteredData.filter((record) => record.status === "interviewShortlisted");
        }

        // Apply Onboarding shortlisted filter
        if (activeFilters.onboarding) {
            filteredData = filteredData.filter((record) => record.status === "onboarding");
        }

        setFilteredRecruitmentData(filteredData);  // Update the filtered data
    };

    // Handle filter change from the dropdown
    const handleFilterChange = (filters) => {
        setActiveFilters(filters);  // Update the active filters state
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Recruitment Data Statistics</h1>
            <div className="text-lg font-bold mb-4 text-center">
                Total Registrations: <span className="text-xl">{totalRegistrations}</span>
            </div>
            <div className="flex justify-center flex-row gap-10">
                <div className="text-lg mb-4 text-center">
                    First Year: <span className="text-xl">{firstYearCount}</span>
                </div>
                <div className="text-lg mb-4 text-center">
                    Second Year: <span className="text-xl">{secondYearCount}</span>
                </div>
            </div>
            <div className=" flex justify-center h-96">
                <Pie data={domainChartData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>

            <div className="flex justify-center gap-8 mb-5 mt-8">
                <button
                    onClick={handleShowMoreAnalytics}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    {showMoreAnalytics ? "Hide More Analytics" : "Show More Analytics"}
                </button>

                <button
                    onClick={handleShowTable}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {showTable ? "Hide Records" : "Show Records"}
                </button>
            </div>
            {showMoreAnalytics && (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-5">
                    <div className="shadow-lg p-4">
                        <h3 className="text-lg font-semibold mb-2 text-center">Year-wise Domain Distribution</h3>
                        <div style={{ height: '600px', width: '100%' }}>
                            <Bar
                                data={yearWiseDomainChartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: { stacked: false },
                                        y: { stacked: false, beginAtZero: true }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {showTable && (
                <div className="overflow-x-auto">
                    <div className="flex flex-row gap-4">
                        <FilterDropdown onFilterChange={handleFilterChange} />

                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4"
                            onClick={handleDownloadCSV}
                        >
                            DOWNLOAD CSV
                        </button>
                    </div>
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100 dark:text-black">
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Email</th>
                                <th className="border border-gray-300 px-4 py-2">Registration Number</th>
                                <th className="border border-gray-300 px-4 py-2">Phone</th>
                                <th className="border border-gray-300 px-4 py-2">Year</th>
                                <th className="border border-gray-300 px-4 py-2">Degree & Branch</th>
                                <th className="border border-gray-300 px-4 py-2">Domain</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecruitmentData.map((record) => (
                                <tr key={record._id}>
                                    <td className="border border-gray-300 px-4 py-2">{record.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.email}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.registrationNumber}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.phone}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.year}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.degreeWithBranch}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.domain}</td>
                                    <td className="border border-gray-300 px-4 py-2" style={getStatusStyle(record.status)}>{record.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div >
    );
};

export default withAuth(Recruitment);