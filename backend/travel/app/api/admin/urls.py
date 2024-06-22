from django.urls import path
from app.api.admin.views import *
urlpatterns = [
    path('admin/login', AdminLogin.as_view()),
    path('admin/userlist', UserListView.as_view()),
    path('admin/agentlist', AgentListView.as_view()),
    path('admin/add_destination', AddDestination.as_view()),
    path('admin/edit_destination/<int:id>', EditDestination.as_view()),
    path('admin/delete_destination/<int:id>', DeleteDestination.as_view()),
    path('admin/logout', LogoutView.as_view()),
    path('admin/package-count/', PackagesCountView.as_view(), name='package-count'),
    path('admin/fetchCategory/', FetchCategory.as_view(), name='fetchCategory'),
    path('admin/add_category/', AddCategory.as_view(), name='add-category'),
    path('admin/edit_category/<int:id>',EditCategory.as_view(), name='edit-category'),
    path('admin/delete_category/<int:id>', DeleteCategory.as_view(), name='delete-category'),
    path('admin/fetch_bookings',FetchBookings.as_view(), name='fetch-bookings'),
    path('admin/bookingTrendsView', BookingTrendsView.as_view()),
    path('admin/popularDestinationsView', PopularDestinationsView.as_view()),
    path('admin/revenueTrendsView', RevenueTrendsView.as_view()),
    path('admin/categoryDistribution',CategoryDistributionView.as_view()),
]
