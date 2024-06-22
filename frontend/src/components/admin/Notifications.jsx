import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleNotifications } from '../../redux/reducers/user/userReducer';



const notifications = [
  {
    type: 'info',
    title: 'Wrapped Bitcoin is now listed on Unity Exchange',
    description: 'With our newest listing, we\'re welcoming Wrapped Bitcoin (wBTC) to our DeFi Innovation Zone! You can now deposit...',
    time: '24m ago',
  },
  {
    type: 'success',
    title: 'Airdrop BCHA - 0.25118470 Your airdrop for Nov 15, 2020.',
    description: 'With our newest listing, we\'re welcoming Wrapped Bitcoin (wBTC) to our DeFi Innovation Zone! You can now deposit...',
    time: '24m ago',
  },
  {
    type: 'info',
    title: 'CyberVeinToken is Now Available on Unity Exchange',
    description: 'With our newest listing, we\'re welcoming Wrapped Bitcoin (wBTC) to our DeFi Innovation Zone! You can now deposit...',
    time: '21m ago',
  },
  // Add more notifications here...
];

const Notification = ({ type, title, description, time }) => {
   

  return (
    <div className={`p-4 mb-4 rounded-lg shadow-md ${getNotificationStyles(type)}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getNotificationIcon(type)}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          <p className="mt-1 text-xs text-gray-400">{time}</p>
        </div>
      </div>
    </div>
  );
};

const getNotificationStyles = (type) => {
  switch (type) {
    case 'info':
      return 'bg-blue-100 border border-blue-300';
    case 'success':
      return 'bg-green-100 border border-green-300';
    case 'warning':
      return 'bg-yellow-100 border border-yellow-300';
    case 'error':
      return 'bg-red-100 border border-red-300';
    default:
      return 'bg-gray-100 border border-gray-300';
  }
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'info':
      return (
        <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 18h.01M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9 9-4.03 9-9z" />
        </svg>
      );
    case 'success':
      return (
        <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'warning':
      return (
        <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 18h.01M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9 9-4.03 9-9z" />
        </svg>
      );
    case 'error':
      return (
        <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    default:
      return (
        <svg className="h-6 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      );
  }
};

function Notifications() {
  return (
    <div className="min-h-screen w-screen  bg-gray-100">
      <div className=" container mx-auto md:w-2/3 px-6 py-8 ml-28">
       
        <div className="flex flex-wrap mt-8 bg-white shadow-sm rounded-md p-6">
          <h1 className="text-2xl font-bold mb-4">Notifications</h1>
          <div className="w-full">
            {notifications.map((notification, index) => (
              <Notification
                key={index}
                type={notification.type}
                title={notification.title}
                description={notification.description}
                time={notification.time}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
