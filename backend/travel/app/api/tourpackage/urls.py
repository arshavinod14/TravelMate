from django.urls import path
from app.api.tourpackage.views import *

urlpatterns = [
    path("package/fetchpackage",getPackage.as_view())
]