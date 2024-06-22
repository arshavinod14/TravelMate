from rest_framework.views import APIView
from rest_framework.response import Response
from app.models import *
from app.api.tourpackage.serializers import *

class getPackage(APIView):
    def get(self, request):
        package = Package.objects.all()
        serializer = PackageSerializer(package,many=True)
        return Response({"status":"Success","message":"Packaged fetch successfully","data":serializer.data})


