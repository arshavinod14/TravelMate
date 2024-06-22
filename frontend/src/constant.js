//customer
export const LOGIN = "api/customer/login";
export const REGISTER = "api/customer/register";
export const LOGOUT = "api/customer/logout";
export const GET_CUSTOMER = "api/customer/get/"
export const CHANGE_PASSWORD = "api/customer/change_password/:id";

export const BOOKING = "api/customer/booking";
export const GET_BOOKINGS = "api/customer/bookings/:id"
export const FETCH_BOOKINGS = "api/admin/fetch_bookings";
export const GET_BOOKING_DETAILS = "api/customer/booking_Details/:id"
export const CANCEL_BOOKING = "api/customer/bookings/cancel/:id";
export const CONTACT_US = "api/customer/contact-us";
export const PAYMENT = "api/customer/process-payment";

//agent
export const AGENT_LOGIN = "api/agent/login";
export const AGENT_REGISTER = "api/agent/register";
export const AGENT_LOGOUT = "api/agent/logout";
export const AGENT_ID_DETAILS = "api/agent/get/:id"
export const AGENT_PACKAGES = "api/agent/viewAgentPackages/:id"
export const AGENT_BOOKINGS = "api/agent/viewBookings/:id"
export const AGENT_APPROVE_DECLINE = "api/agent/:agentId/bookings/:bookingId";
export const AGENT_CHANGE_PASSWORD = "api/agent/changePassword/:id";
//admin
export const ADMIN_LOGIN = "api/admin/login";
export const ADMIN_USERS = "api/admin/userlist";
export const ADMIN_AGENTS = "api/admin/agentlist";
export const ADMIN_LOGOUT = "api/admin/logout";


export const ADD_DESTINATION = "api/admin/add_destination";
export const EDIT_DESTINATION = `api/admin/edit_destination/:id`;
export const DELETE_DESTINATION = "api/admin/delete_destination/:id";

export const USER_COUNT = "api/admin/user-count";
export const AGENT_COUNT = "api/admin/agent-count";
export const PACKAGE_COUNT = "api/admin/package-count";


export const DESTINATION = "api/destination/fetch";

export const PACKAGE = "api/package/fetchpackage";
export const ADD_PACKAGE = "api/agent/addpackage";
export const EDIT_PACKAGE = "api/agent/editpackage/:id";
export const DELETE_PACKAGE = "api/agent/deletepackage/:id";

export const FETCH_CATEGORY = "api/admin/fetchCategory";
export const ADD_CATEGORY = "api/admin/add_category/";
export const EDIT_CATEGORY = "api/admin/edit_category/:id";
export const DELETE_CATEGORY = "api/admin/delete_category/:id";

export const ADD_ACTIVITIES = "api/agent/addactivity/:id";
export const VIEW_ACTIVITIES = "api/agent/viewActivity/:id";


export const VIEW_REVIEWS = "api/customer/view-review/:id";
export const ADD_REVIEWS = "api/customer/add-review/";
export const VIEW_ALL_REVIEWS = "api/customer/view-reviews";


export const BOOKING_TRENDS = "api/admin/bookingTrendsView";
export const POPULAR_DESTINATIONS = "api/admin/popularDestinationsView";
export const REVENUE_TRENDS = "api/admin/revenueTrendsView"
export const CATEGORY_DISTRIBUTION = "api/admin/categoryDistribution";

export const AGENT_POPULAR_DESTINATIONS = "api/agent/popularDestinations/:id";
export const AGENT_REVENUE = "api/agent/agentRevenue/:id";
export const AGENT_CATEGORY_DISTRIBUTION="api/agent/category-distributions/:id"


