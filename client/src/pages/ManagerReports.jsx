import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import '../styles/ManagerReports.css';
import '../styles/ManagerReports_HC.css';

function ManagerReports({ isHighContrast }) {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [productReport, setProductReport] = useState([]);
    const [salesReport, setSalesReport] = useState([]);
    const [excessReport, setExcessReport] = useState([]);
    const [restockReport, setRestockReport] = useState([]);
    const [WSTReport, setWSTReport] = useState([]);

    const [displayProductReport, setDisplayProductReport] = useState(false);
    const [displaySalesReport, setDisplaySalesReport] = useState(false);
    const [displayExcessReport, setDisplayExcessReport] = useState(false);
    const [displayRestockReport, setDisplayRestockReport] = useState(false);
    const [displayWSTReport, setDisplayWSTReport] = useState(false);

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        //console.log(startDate);
    }

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        //console.log(endDate);
    }

    function generateProductReport() {

        setDisplayProductReport(true);
        setDisplaySalesReport(false);
        setDisplayExcessReport(false);
        setDisplayRestockReport(false);
        setDisplayWSTReport(false);

        const backendURL = process.env.NODE_ENV === 'production'
        ? 'https://mos-irish-server-901-04.vercel.app/api/productReport'
        : 'http://localhost:3001/api/productReport';
        const fetchReportData = async () => {
          try {
            const reportQuery = await axios.get(backendURL, {
              params: {
                startTime: startDate,
                endTime: endDate
              },
            });

            setProductReport(reportQuery.data.productReport);
            console.log("Product Report from " + startDate + " to " + endDate + " successful.");
    
          } catch (error) {
            console.error('Product Report error', error);
            setDisplayProductReport(false);
          }
        };
        fetchReportData();
        
    }

    function generateSalesReport() {

        setDisplayProductReport(false);
        setDisplaySalesReport(true);
        setDisplayExcessReport(false);
        setDisplayRestockReport(false);
        setDisplayWSTReport(false);

        const backendURL = process.env.NODE_ENV === 'production'
        ? 'https://mos-irish-server-901-04.vercel.app/api/salesReport'
        : 'http://localhost:3001/api/salesReport';
        const fetchReportData = async () => {
          try {
            const reportQuery = await axios.get(backendURL, {
              params: {
                startTime: startDate,
                endTime: endDate
              },
            });

            setSalesReport(reportQuery.data.salesReport);
            console.log(reportQuery.data.salesReport);
            console.log("Sales Report from " + startDate + " to " + endDate + " successful.");
    
          } catch (error) {
            console.error('Sales Report error', error);
            setDisplaySalesReport(false);
          }
        };
        fetchReportData();
    }

    function generateExcessReport() {

        setDisplayProductReport(false);
        setDisplaySalesReport(false);
        setDisplayExcessReport(true);
        setDisplayRestockReport(false);
        setDisplayWSTReport(false);

        const backendURL = process.env.NODE_ENV === 'production'
        ? 'https://mos-irish-server-901-04.vercel.app/api/excessReport'
        : 'http://localhost:3001/api/excessReport';
        const fetchReportData = async () => {
          try {
            const reportQuery = await axios.get(backendURL, {
              params: {
                startTime: startDate
              },
            });

            setExcessReport(reportQuery.data.excessReport);
            console.log(reportQuery.data.excessReport);
            console.log("Excess Report from today to " + startDate + " successful.");
    
          } catch (error) {
            console.error('Report error', error);
            setDisplayExcessReport(false);
          }
        };
        fetchReportData();
    }

    function generateRestockReport() {

        setDisplayProductReport(false);
        setDisplaySalesReport(false);
        setDisplayExcessReport(false);
        setDisplayRestockReport(true);
        setDisplayWSTReport(false);

        const backendURL = process.env.NODE_ENV === 'production'
        ? 'https://mos-irish-server-901-04.vercel.app/api/restockReport'
        : 'http://localhost:3001/api/restockReport';
        fetch(backendURL) //backend url
            .then(res => res.json())
            .then(data => {
                setRestockReport(data.restockReport);
            });
    };

    function generateWSTReport() {

        setDisplayProductReport(false);
        setDisplaySalesReport(false);
        setDisplayExcessReport(false);
        setDisplayRestockReport(false);
        setDisplayWSTReport(true);

        const backendURL = process.env.NODE_ENV === 'production'
        ? 'https://mos-irish-server-901-04.vercel.app/api/WSTReport'
        : 'http://localhost:3001/api/WSTReport';
        const fetchReportData = async () => {
          try {
            const reportQuery = await axios.get(backendURL, {
              params: {
                startTime: startDate,
                endTime: endDate
              },
            });

            setWSTReport(reportQuery.data.WSTReport);
            console.log(reportQuery.data.WSTReport);
            console.log("What Sells Together Report from " + startDate + " to " + endDate + " successful.");

          } catch (error) {
            console.error('WST Report error', error);
            setDisplayWSTReport(false);
          }
        };
        fetchReportData();
    }

    return (
        <div>
            <div className={'reportsLink' + (isHighContrast ? "-HC" : "")}><Link to="/manager"><b>Return to Manager</b></Link></div>
            <div className={'managerReports' + (isHighContrast ? "-HC" : "")}>
                <div className={'MRleftPanel' + (isHighContrast ? "-HC" : "")}>
                    <div className={'dateInputContainer' + (isHighContrast ? "-HC" : "")}>
                        <p className={'managerReportsPar' + (isHighContrast ? "-HC" : "")}>Start Date</p>
                        <input
                            type="datetime-local"
                            id="dateTimeInput"
                            name="dateTimeInput"
                            //value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div className={'dateInputContainer' + (isHighContrast ? "-HC" : "")}>
                        <p className={'managerReportsPar' + (isHighContrast ? "-HC" : "")}>End Date</p>
                        <input
                            type="datetime-local"
                            id="dateTimeInput"
                            name="dateTimeInput"
                            //value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                    <div className={"reportButtonContainer" + (isHighContrast ? "-HC" : "")}>
                        <Button className={"reportButton" + (isHighContrast ? "-HC" : "")} onClick={generateProductReport} variant="contained" style={displayProductReport ? { backgroundColor: '#eef7ee', color: 'black' } : { backgroundColor: '#399f6f', color: 'white' }}>
                            Product Report
                        </Button>
                    </div>
                    <div className={"reportButtonContainer" + (isHighContrast ? "-HC" : "")}>
                        <Button className={"reportButton" + (isHighContrast ? "-HC" : "")} onClick={generateSalesReport} variant="contained" style={displaySalesReport ? { backgroundColor: '#eef7ee', color: 'black' } : { backgroundColor: '#399f6f', color: 'white' }}>
                            Sales Report
                        </Button>
                    </div>
                    <div className={"reportButtonContainer" + (isHighContrast ? "-HC" : "")}>
                        <Button className={"reportButton" + (isHighContrast ? "-HC" : "")} onClick={generateExcessReport} variant="contained" style={displayExcessReport ? { backgroundColor: '#eef7ee', color: 'black' } : { backgroundColor: '#399f6f', color: 'white' }}>
                            Excess Report
                        </Button>
                    </div>
                    <div className={"reportButtonContainer" + (isHighContrast ? "-HC" : "")}>
                        <Button className={"reportButton" + (isHighContrast ? "-HC" : "")} onClick={generateRestockReport} variant="contained" style={displayRestockReport ? { backgroundColor: '#eef7ee', color: 'black' } : { backgroundColor: '#399f6f', color: 'white' }}>
                            Restock Report
                        </Button>
                    </div>
                    <div className={"reportButtonContainer" + (isHighContrast ? "-HC" : "")}>
                        <Button className={"reportButton" + (isHighContrast ? "-HC" : "")} onClick={generateWSTReport} variant="contained" style={displayWSTReport ? { backgroundColor: '#eef7ee', color: 'black' } : { backgroundColor: '#399f6f', color: 'white' }}>
                            What Sells Together Report
                        </Button>
                    </div>
                </div>    
                <div className={'MRrightPanel' + (isHighContrast ? "-HC" : "")}>
                    {!displayProductReport && !displaySalesReport && !displayExcessReport && !displayRestockReport && !displayWSTReport && //DISPLAY NOTHING
                        <p className={"selectAReport" + (isHighContrast ? "-HC" : "")}>Select dates (if applicable) and select a report to generate a table</p>
                    }
                    {displayProductReport && !displaySalesReport && !displayExcessReport && !displayRestockReport && !displayWSTReport && //DISPLAY PRODUCT REPORT
                        <table>
                            <thead>
                                <tr>
                                <th>Day</th>
                                <th>Total Product</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productReport.map((row) => (
                                <tr key={row.day}>
                                    <td>{(row.day).split('T')[0]}</td>
                                    <td>{Math.round(row.total_sum * 100, 2) / 100}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                    {!displayProductReport && displaySalesReport && !displayExcessReport && !displayRestockReport && !displayWSTReport && //DISPLAY SALES REPORT
                        <table>
                            <thead>
                                <tr>
                                <th>Menu Item</th>
                                <th>Amount Sold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesReport.map((row) => (
                                <tr key={row.item_name}>
                                    <td>{row.item_name}</td>
                                    <td>{row.quantity}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                    {!displayProductReport && !displaySalesReport && displayExcessReport && !displayRestockReport && !displayWSTReport && //DISPLAY EXCESS REPORT
                        
                        <table>
                            <thead>
                                <tr>
                                <th>Inventory Item</th>
                                <th>Percentage Consumed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {excessReport.map((row) => (
                                <tr key={row.day}>
                                    <td>{row.inventory_name}</td>
                                    <td>{Math.round(row.percent_consumed * 100, 2) / 100}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>

                    }
                    {!displayProductReport && !displaySalesReport && !displayExcessReport && displayRestockReport && !displayWSTReport && //DISPLAY RESTOCK REPORT
                        <table>
                            <thead>
                                <tr>
                                <th>Inventory Item</th>
                                <th>Stock Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restockReport.map((row) => (
                                <tr key={row.item_name}>
                                    <td>{row.item_name}</td>
                                    <td>{row.stock}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                    {!displayProductReport && !displaySalesReport && !displayExcessReport && !displayRestockReport && displayWSTReport && //DISPLAY WST REPORT
                        <table>
                            <thead>
                                <tr>
                                <th>First Item</th>
                                <th>Second Item</th>
                                <th>Frequency of Pairing</th>
                                </tr>
                            </thead>
                            <tbody>
                                {WSTReport.map((row) => (
                                <tr key={row.entree_name + " " + row.drink_name}>
                                    <td>{row.entree_name}</td>
                                    <td>{row.drink_name}</td>
                                    <td>{row.pair_freq}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default ManagerReports