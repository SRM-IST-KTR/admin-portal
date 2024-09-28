import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import withAuth from "@/components/withAuth";
import FilterDropdown from "@/components/recruitments/FilterDropdown";

// Ensure all required components are registered
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const convertToCSV = (data) => {
    const header = "Name,Email,RegNo,PhoneNo,Year,Dept,Domain,Subdomain,Status\n";
    const rows = data.map((row) => {
        const domain = Object.keys(row.domain).join(", ");
        const subdomain = Object.values(row.domain).flat().join(", ");
        return `${row.name},${row.email},${row.regNo},${row.phoneNo},${row.year},${row.dept},${domain},${subdomain},${row.status}`;
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
    const [subDomains, setSubDomains] = useState({});
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
        const subDomainCount = {
            Technical: { firstYear: {}, secondYear: {} },
            Creatives: { firstYear: {}, secondYear: {} },
            Corporate: { firstYear: {}, secondYear: {} }
        };

        const yearDomainData = {
            Technical: { firstYear: 0, secondYear: 0 },
            Creatives: { firstYear: 0, secondYear: 0 },
            Corporate: { firstYear: 0, secondYear: 0 }
        };

        let firstYear = 0;
        let secondYear = 0;

        data.forEach((item) => {
            const yearKey = item.year === "1st" ? "firstYear" : "secondYear";

            const domainKeys = Object.keys(item.domain);
            domainKeys.forEach((domain) => {
                domainCount[domain] = (domainCount[domain] || 0) + 1;

                yearDomainData[domain][yearKey] += 1;

                item.domain[domain].forEach((subDomain) => {
                    subDomainCount[domain][yearKey][subDomain] =
                        (subDomainCount[domain][yearKey][subDomain] || 0) + 1;
                });
            });

            if (item.year === "1st") firstYear++;
            else if (item.year === "2nd") secondYear++;
        });

        setDomains(domainCount);
        setSubDomains(subDomainCount);  // Now subDomains contains separate year counts
        setFirstYearCount(firstYear);
        setSecondYearCount(secondYear);
        setYearDomainData(yearDomainData);  // Set year-wise domain data
    };

    const handleShowTable = () => {
        setShowTable(!showTable);
    };

    const handleShowMoreAnalytics = () => {
        setShowMoreAnalytics(!showMoreAnalytics);
    };

    // Define the yearWiseDomainChartData properly
    const yearWiseDomainChartData = {
        labels: ["Technical", "Creatives", "Corporate"],
        datasets: [
            {
                label: '1st Year',
                data: [
                    yearDomainData.Technical?.firstYear || 0,
                    yearDomainData.Creatives?.firstYear || 0,
                    yearDomainData.Corporate?.firstYear || 0
                ],
                backgroundColor: '#36A2EB'
            },
            {
                label: '2nd Year',
                data: [
                    yearDomainData.Technical?.secondYear || 0,
                    yearDomainData.Creatives?.secondYear || 0,
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
            backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384'],
        }],
    };

    // Ensure subDomains.Technical and other subDomains exist
    const technicalSubdomainByYearData = {
        labels: subDomains.Technical ? Object.keys(subDomains.Technical.firstYear || {}) : [], // Ensure subDomains.Technical exists
        datasets: [
            {
                label: '1st Year',
                data: subDomains.Technical ? Object.keys(subDomains.Technical.firstYear || {}).map(subdomain => subDomains.Technical.firstYear[subdomain] || 0) : [],
                backgroundColor: '#36BA98'
            },
            {
                label: '2nd Year',
                data: subDomains.Technical ? Object.keys(subDomains.Technical.secondYear || {}).map(subdomain => subDomains.Technical.secondYear[subdomain] || 0) : [],
                backgroundColor: '#E76F51'
            }
        ]
    };

    const creativeSubdomainByYearData = {
        labels: subDomains.Creatives ? Object.keys(subDomains.Creatives.firstYear || {}) : [], // Ensure subDomains.Creatives exists
        datasets: [
            {
                label: '1st Year',
                data: subDomains.Creatives ? Object.keys(subDomains.Creatives.firstYear || {}).map(subdomain => subDomains.Creatives.firstYear[subdomain] || 0) : [],
                backgroundColor: '#59D5E0'
            },
            {
                label: '2nd Year',
                data: subDomains.Creatives ? Object.keys(subDomains.Creatives.secondYear || {}).map(subdomain => subDomains.Creatives.secondYear[subdomain] || 0) : [],
                backgroundColor: '#FFA447'
            }
        ]
    };

    // Subdomain Distribution by domain only (not by year)
    const technicalSubDomainData = {
        labels: subDomains.Technical ? Object.keys(subDomains.Technical.firstYear || {}) : [],
        datasets: [{
            label: 'Technical Subdomain Distribution',
            data: subDomains.Technical ? Object.keys(subDomains.Technical.firstYear || {}).map(subdomain => (subDomains.Technical.firstYear[subdomain] || 0) + (subDomains.Technical.secondYear[subdomain] || 0)) : [],
            backgroundColor: '#36A2EB',
        }],
    };

    const creativeSubDomainData = {
        labels: subDomains.Creatives ? Object.keys(subDomains.Creatives.firstYear || {}) : [],
        datasets: [{
            label: 'Creative Subdomain Distribution',
            data: subDomains.Creatives ? Object.keys(subDomains.Creatives.firstYear || {}).map(subdomain => (subDomains.Creatives.firstYear[subdomain] || 0) + (subDomains.Creatives.secondYear[subdomain] || 0)) : [],
            backgroundColor: '#FFCE56',
        }],
    };

    const corporateSubDomainData = {
        labels: subDomains.Corporate ? Object.keys(subDomains.Corporate.firstYear || {}) : [],
        datasets: [{
            label: 'Corporate Subdomain Distribution',
            data: subDomains.Corporate ? Object.keys(subDomains.Corporate.firstYear || {}).map(subdomain => (subDomains.Corporate.firstYear[subdomain] || 0) + (subDomains.Corporate.secondYear[subdomain] || 0)) : [],
            backgroundColor: '#FF6384',
        }],
    };

    const applyFilters = () => {
        let filteredData = recruitmentData;

        // Apply domain filters (Technical, Creatives, Corporate)
        if (activeFilters.Technical || activeFilters.Creatives || activeFilters.Corporate) {
            filteredData = filteredData.filter((record) => {
                if (activeFilters.Technical && record.domain['Technical']) return true;
                if (activeFilters.Creatives && record.domain['Creatives']) return true;
                if (activeFilters.Corporate && record.domain['Corporate']) return true;
                return false;
            });
        }

        // Apply task shortlisted filter
        if (activeFilters.taskShortlisted) {
            filteredData = filteredData.filter((record) => record.status === "Task");
        }

        // Apply interview shortlisted filter
        if (activeFilters.interviewShortlisted) {
            filteredData = filteredData.filter((record) => record.status === "Interview");
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

            <h2 className="text-xl mb-2 mt-16">Subdomain Distribution</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="shadow-lg p-4">
                    <Bar data={technicalSubDomainData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
                </div>
                <div className="shadow-lg p-4">
                    <Bar data={creativeSubDomainData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
                </div>
                <div className="shadow-lg p-4">
                    <Bar data={corporateSubDomainData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
                </div>
            </div>

            <div className="flex justify-center gap-8 mb-5">
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                    <div className="shadow-lg p-4">
                        <Bar
                            data={yearWiseDomainChartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { stacked: true },
                                    y: { stacked: true, beginAtZero: true }
                                }
                            }}
                            height={200}
                        />
                    </div>

                    <div className="shadow-lg p-4">
                        <Bar
                            data={technicalSubdomainByYearData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { stacked: true },
                                    y: { stacked: true, beginAtZero: true }
                                }
                            }}
                            height={200}
                        />
                    </div>

                    <div className="shadow-lg p-4">
                        <Bar
                            data={creativeSubdomainByYearData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: { stacked: true },
                                    y: { stacked: true, beginAtZero: true }
                                }
                            }}
                            height={200}
                        />
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
                                <th className="border border-gray-300 px-4 py-2">Department</th>
                                <th className="border border-gray-300 px-4 py-2">Year</th>
                                <th className="border border-gray-300 px-4 py-2">Domain</th>
                                <th className="border border-gray-300 px-4 py-2">Subdomain</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecruitmentData.map((record) => (
                                <tr key={record._id}>
                                    <td className="border border-gray-300 px-4 py-2">{record.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.email}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.dept}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.year}</td>
                                    <td className="border border-gray-300 px-4 py-2">{Object.keys(record.domain).join(", ")}</td>
                                    <td className="border border-gray-300 px-4 py-2">{Object.values(record.domain).flat().join(", ")}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.status}</td>
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
