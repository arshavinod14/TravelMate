from django.urls import path
from app.api.destination.views import *

urlpatterns = [
    path("destination/fetch",DestinationGetView.as_view())
]