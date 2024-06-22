from django.urls import path
from app.api.agent.views import *
urlpatterns = [

    path("agent/register", registerView.as_view()),
    path('agent/login', loginView.as_view()),
    path('agent/get/<int:id>', GetAgent.as_view()),
    path('agent/update/<int:id>', UpdateAgent.as_view()),
    path('agent/delete/<int:id>', DeleteAgent.as_view()),
    path('agent/addpackage', AddPackage.as_view()),
    path('agent/addactivity/<int:id>', AddActivity.as_view()),
    path('agent/editpackage/<int:id>', EditPackage.as_view()),
    path('agent/deletepackage/<int:id>', DeletePackage.as_view()),
    path('agent/packageslist/<int:id>',PackagesList.as_view()),
    path('agent/viewActivity/<int:id>',ViewActivities.as_view()),
    path('agent/viewBookings/<int:id>',GetAgentPackageBookings.as_view()),
    path('agent/<int:id>/bookings/<int:booking_id>/', ApproveDeclineBookingView.as_view(), name='approve_decline_booking'),
    path('agent/viewAgentPackages/<int:id>',GetAgentPackagesView.as_view()),
    path('agent/changePassword/<int:id>',ChangePasswordView.as_view()),
    path('agent/logout',LogoutView.as_view()),

    
    path('agent/popularDestinations/<int:agent_id>',AgentPopularDestinationsView.as_view()),
    path('agent/agentRevenue/<int:agent_id>',AgentRevenueTrendsView.as_view()),
    path('agent/category-distributions/<int:agent_id>',AgentCategoryDistributionView.as_view())
]
