import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleBookingsTrends, handleCategoryDistribution, handleFetchAgents, handleFetchBookings, handleFetchingUsers, handlePopularDestinations, handleRevenueTrends, handleUserCount } from "../../redux/reducers/admin/adminReducer";
import { instance } from "../../redux/api/axios";
import { PACKAGE_COUNT} from "../../constant";
import { Line, Bar,Pie} from 'react-chartjs-2';
import 'chart.js/auto'; // Import chart.js


export default function AdminDashboard() {
  const dispatch = useDispatch()

  const [packageCount,setPackageCount] = useState(0)
  const bookings = useSelector((state) => state.admin.booking); 
  const users = useSelector((s) => s.admin?.users);
  const agents = useSelector(s => s.admin?.agents);
  const [bookingsTrends, setBookingsTrends] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(()=>{
    dispatch(handleFetchBookings())
    dispatch(handleFetchingUsers())
    dispatch(handleFetchAgents())
    
      dispatch(handleBookingsTrends())
        .then((data) => setBookingsTrends(data.payload))
        .catch((error) => console.error('Error fetching bookings trends:', error));
    
      dispatch(handlePopularDestinations())
        .then((data) => setPopularDestinations(data.payload))
        .catch((error) => console.error('Error fetching popular destinations:', error));
    
      dispatch(handleRevenueTrends())
        .then((data) => setRevenueTrends(data.payload))
        .catch((error) => console.error('Error fetching revenue trends:', error));
      
      dispatch(handleCategoryDistribution())
        .then((data) => setCategoryData(data.payload))
        .catch((error) => console.error('Error fetching category:', error));
  
},[dispatch])


  console.log("bookings trends dashboard:",bookingsTrends)
  console.log("popular trends dashboard:",popularDestinations)
  console.log("revenue trends dashboard:",revenueTrends)
  console.log("category dashboard:",categoryData)
  


  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        const response = await instance.get(PACKAGE_COUNT);
        console.log("response from :",response)
        setPackageCount(response.data.package_count);
      } catch (error) {
        console.error('Error fetching package count:', error);
      }
    };
    fetchPackageData();
  }, []);

  
  

  return (
    <div className=" min-h-screen">
    <div className="container mx-auto px-6 py-8 shadow-lg">
        <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>

        <div className="mt-4">
          <div className="flex flex-wrap ">
            <div className="w-full  md:w-1/5">
              <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                  <svg
                    className="h-8 w-8 text-white"
                    viewBox="0 0 28 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>

              
                <div className="mx-2">
                  <h4 className="text-2xl font-semibold text-gray-700">
                    {users?.count}
                  </h4>
                  <div className="text-gray-500">Users</div>
                </div>
                
              </div>
            </div>

            <div className="w-full px-2 md:w-1/5">
              <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3 rounded-full bg-indigo-600 bg-opacity-75">
                  <svg
                    className="h-8 w-8 text-white"
                    viewBox="0 0 28 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>

                

                <div className="mx-2">
                  <h4 className="text-2xl font-semibold text-gray-700">
                    {agents.count}
                  </h4>
                  <div className="text-gray-500">Agents</div>
                </div>
                
              </div>
            </div>


            <div className="w-full md:w-1/5">
              <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                  <svg
                    className="h-8 w-8 text-white"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>

                <div className="mx-2">
                  <h4 className="text-2xl font-semibold text-gray-700">
                  {packageCount === null ? "Loading..." : packageCount}
                  </h4>
                  <div className="text-gray-500">Total Packages</div>
                </div>
              </div>
            </div>

            <div className="w-full px-2 md:w-1/5 ">
              <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-white">
                <div className="p-3 rounded-full bg-pink-600 bg-opacity-75">
                  <svg
                    className="h-8 w-8 text-white"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.99998 11.2H21L22.4 23.8H5.59998L6.99998 11.2Z"
                      fill="currentColor"
                    ></path>
                    <path d="M9.79999 8.4C9.79999 6.08041 11.6804 4.2 14 4.2C16.3196 4.2 18.2 6.08041 18.2 8.4V12.6C18.2 14.9197 16.3196 16.8 14 16.8C11.6804 16.8 9.79999 14.9197 9.79999 12.6V8.4Z"></path>
                  </svg>
                </div>

                <div className=" mx-2">
                  <h4 className="text-2xl font-semibold text-gray-700">
                    {bookings?.count}
                  </h4>
                  <div className="text-gray-500">Total Bookings</div>
                </div>
              </div>
            </div>
          </div>
        </div>

       

        <div className="flex flex-wrap mt-8 bg-white shadow-sm rounded-md p-2 ">
  <div className="w-full max-w-xl ">
    <h2>Booking Trends Over Time</h2>
    <Line
      data={{
        labels: bookingsTrends.map(trend => trend.day),
        datasets: [
          {
            label: 'Bookings',
            data: bookingsTrends.map(trend => trend.count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      }}
    />
  </div>

  <div className="w-full max-w-xl mt-2">
    <h2>Most Booked Destinations</h2>
    <Bar
      data={{
        labels: popularDestinations.map(dest => dest.package__destination_id__destination_name),
        datasets: [
          {
            label: 'Visitors',
            data: popularDestinations.map(dest => dest.count),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      }}
      options={{
        indexAxis: 'y', // This line makes the bar chart horizontal
      }}
    />
  </div>

  <div className="w-full max-w-xl mt-2">
    <h2>Revenue trends over time</h2>
    <Line
      data={{
        labels: revenueTrends.map(trend => trend.day),
        datasets: [
          {
            label: 'Revenue',
            data: revenueTrends.map(trend => trend.total_revenue),
            fill: true, // This fills the area under the line
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Area fill color
            borderColor: 'rgba(255, 99, 132, 1)', // Line color
            borderWidth: 1,
          },
        ],
      }}
    />
  </div>

  <div className="w-full max-w-xl mt-2">
      <h2>Popular Categories</h2>
            <Pie
              data={{
                labels: categoryData.map((item) => item.name),
                datasets: [
                  {
                    label: 'Number of Packages',
                    data: categoryData.map((item) => item.count),
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            
              height={150}
              width={150}
            />
          </div>

</div>

      </div>
    </div>
  );
}
