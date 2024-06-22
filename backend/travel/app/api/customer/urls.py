from django.urls import path
from app.api.customer.views import *
urlpatterns = [

    path("customer/register",registerView.as_view()),
    path('customer/login', loginView.as_view()),
    path('customer/get/<int:id>',GetCustomer.as_view()),
    path('customer/change_password/<int:id>',ChangePasswordView.as_view()),
    path('customer/update/<int:id>',UpdateView.as_view()),
    path('customer/delete/<int:id>',DeleteView.as_view()),
    path('customer/booking',CreateBooking.as_view()),
    path('customer/bookings/<int:id>',GetBookings.as_view()),
    path('customer/bookings/cancel/<int:booking_id>',CancelBooking.as_view()),
    path('customer/contact-us',ContactUs.as_view()),
    path('customer/logout',LogoutView.as_view()),
    path('customer/process-payment', ProcessPaymentView.as_view(), name='process_payment'),
    path('customer/booking_Details/<int:booking_id>', GetBookingDetails.as_view()),
    path('customer/add-review/', AddReview.as_view(), name='review'),
    path('customer/view-review/<int:package_id>', ViewReview.as_view()),
    path('customer/view-reviews/', AllReviews.as_view()),

    #path('notifications', Notifications.as_view(), name='notifications'),


]