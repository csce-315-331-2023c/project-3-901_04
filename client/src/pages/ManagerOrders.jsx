import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import axios from 'axios';
import '../styles/ManagerOrders.css'

function ManagerOrders() {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [fetchedOrders, setFetchedOrders] = useState([]);
    const [currentOrderContents, setCurrentOrderContents] = useState([]);
    const [currentOrderMetaData, setCurrentOrderMetaData] = useState([]);

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        //console.log(startDate);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        //console.log(endDate);
    };

    function fetchOrders() {

        const backendURL = process.env.NODE_ENV === 'production'
        ? 'https://mos-irish-server-901-04.vercel.app/api/managerOrders'
        : 'http://localhost:3001/api/managerOrders';
        console.log("Attempting to fetch orders from " + startDate + " to " + endDate);
        const fetchOrders = async () => {
          try {
            const ordersQuery = await axios.get(backendURL, {
                params: {
                    startTime: startDate,
                    endTime: endDate
                },
            });

            setFetchedOrders(ordersQuery.data.orders);
            console.log(ordersQuery.data.orders);

          } catch (error) {
            console.error('Fetch Orders error', error);
          }
        };
        fetchOrders();
    };

    function displayOrderContents(orderId) {
        console.log("Fetching the order and meta data of order #" + orderId);
        const backendURL = process.env.NODE_ENV === 'production'
        ? 'https://mos-irish-server-901-04.vercel.app/api/orderContents'
        : 'http://localhost:3001/api/orderContents';
        const fetchOrderData = async () => {
          try {
            const orderContentQuery = await axios.get(backendURL, {
                params: {
                    id: orderId
                },
            });

            setCurrentOrderMetaData(orderContentQuery.data.orderMetaData);
            console.log(orderContentQuery.data.orderMetaData);

            setCurrentOrderContents(orderContentQuery.data.orderContents);
            console.log(orderContentQuery.data.orderContents);

          } catch (error) {
            console.error('Order Content Query error', error);
          }
        };
        fetchOrderData();
    };

    return (
        <div>
            <div className='ordersLink'><Link to="/manager"><b>Return to Manager</b></Link></div>
            <div className='managerOrders'>
                <div className='MOleftPanel'>
                    <div className='dateInputContainer'>
                        <p className='managerReportsPar'>Start Date</p>
                        <input
                            type="datetime-local"
                            id="dateTimeInput"
                            name="dateTimeInput"
                            //value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div className='dateInputContainer'>
                        <p className='managerReportsPar'>End Date</p>
                        <input
                            type="datetime-local"
                            id="dateTimeInput"
                            name="dateTimeInput"
                            //value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </div>
                    <div className="generateButtonContainer">
                        <Button className="generateButton" onClick={fetchOrders} variant="contained">
                            Submit
                        </Button>
                    </div>
                </div>    
                <div className='MOcenterPanel'>
                {fetchedOrders.map((order) => (
                    <Button onClick={() => displayOrderContents(order.id)} variant="outlined" className="managerMenuButton" key={order}>
                        {order.order_timestamp + ' | ' + order.customer_name}
                    </Button>
                ))}
                    
                </div>
                <div className='MOrightPanel-Container'>
                    <div className='MOrightPanel-top'>
                        <table>
                            <thead>
                                <tr>
                                <th>Cashier</th>
                                <th>Total</th>
                                <th>Table</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrderMetaData.map((row) => (
                                <tr>
                                    <td className='metaDataItem'>{currentOrderMetaData[0].employee_name}</td>
                                    <td className='metaDataItem'>${currentOrderMetaData[0].price_total}</td>
                                    <td className='metaDataItem'>{currentOrderMetaData[0].table_num == 0 ? (
                                        'TO-GO'
                                    ) : (
                                        currentOrderMetaData[0].table_num
                                    )}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='MOrightPanel-bottom'>
                        <table>
                            <thead>
                                <tr>
                                <th>Item</th>
                                <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrderContents.map((row) => (
                                <tr key={row.item_name}>
                                    <td>{row.item_name}</td>
                                    <td>{row.item_count}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManagerOrders