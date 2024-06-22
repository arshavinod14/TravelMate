from app.models import Destination
from rest_framework.views import APIView
from rest_framework.response import Response
from app.api.destination.serializers import * 

class DestinationGetView(APIView):
    def get(self,request):
        dest = Destination.objects.all()
        serializer = DestinationSerializer(dest,many=True)
        return Response({"status":"success","message":"Destination has been fetched","data":serializer.data})
