import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Recruitment = () => {
    const [recruitmentData, setRecruitmentData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [domains, setDomains] = useState({});
    const [subDomains, setSubDomains] = useState({});
    const [firstYearCount, setFirstYearCount] = useState(0);
    const [secondYearCount, setSecondYearCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/v1/recruitment");
                const data = response.data.data;

                setRecruitmentData(data);
                processDomains(data);
            } catch (error) {
                console.error("Error fetching recruitment data:", error);
            }
        };

        fetchData();
    }, []);

    const processDomains = (data) => {
        const domainCount = {};
        const subDomainCount = {
            Technical: {},
            Creatives: {},
            Corporate: {}
        };

        let firstYear = 0;
        let secondYear = 0;

        data.forEach((item) => {
            const domainKeys = Object.keys(item.domain);
            domainKeys.forEach((domain) => {
                domainCount[domain] = (domainCount[domain] || 0) + 1;

                item.domain[domain].forEach((subDomain) => {
                    subDomainCount[domain][subDomain] = (subDomainCount[domain][subDomain] || 0) + 1;
                });
            });

            // Increment the year counts based on the year property as a string
            if (item.year === "1st") firstYear++;
            else if (item.year === "2nd") secondYear++;
        });

        setDomains(domainCount);
        setSubDomains(subDomainCount);
        setFirstYearCount(firstYear);
        setSecondYearCount(secondYear);
    };


    const handleShowTable = () => {
        setShowTable(!showTable);
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

    const technicalSubDomainData = {
        labels: subDomains.Technical ? Object.keys(subDomains.Technical) : [],
        datasets: [{
            label: 'Technical Subdomain Distribution',
            data: subDomains.Technical ? Object.values(subDomains.Technical) : [],
            backgroundColor: '#36A2EB',
        }],
    };

    const creativeSubDomainData = {
        labels: subDomains.Creatives ? Object.keys(subDomains.Creatives) : [],
        datasets: [{
            label: 'Creative Subdomain Distribution',
            data: subDomains.Creatives ? Object.values(subDomains.Creatives) : [],
            backgroundColor: '#FFCE56',
        }],
    };

    const corporateSubDomainData = {
        labels: subDomains.Corporate ? Object.keys(subDomains.Corporate) : [],
        datasets: [{
            label: 'Corporate Subdomain Distribution',
            data: subDomains.Corporate ? Object.values(subDomains.Corporate) : [],
            backgroundColor: '#FF6384',
        }],
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
            <button
                onClick={handleShowTable}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-5"
            >
                {showTable ? "Hide Records" : "Show Records"}
            </button>
            {showTable && (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                <th className="border border-gray-300 px-4 py-2">Department</th>
                                <th className="border border-gray-300 px-4 py-2">Year</th>
                                <th className="border border-gray-300 px-4 py-2">Domain</th>
                                <th className="border border-gray-300 px-4 py-2">Subdomain</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recruitmentData.map((record) => (
                                <tr key={record._id}>
                                    <td className="border border-gray-300 px-4 py-2">{record.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.dept}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.year}</td>
                                    <td className="border border-gray-300 px-4 py-2">{Object.keys(record.domain).join(", ")}</td>
                                    <td className="border border-gray-300 px-4 py-2">{record.domain[Object.keys(record.domain)[0]].join(", ")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </div>
    );
};

export default Recruitment;
