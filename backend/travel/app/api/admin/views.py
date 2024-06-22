from app.api.destination.serializers import DestinationSerializer
from app.api.agent.serializers import AgentSerializer
from app.api.customer.serializers import CustomerSerializer,BookingSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import authenticate
from rest_framework import permissions, status
from .serializers import *
import jwt
from django.db.models import Count,Sum
from django.utils import timezone
from datetime import timedelta


class AdminLogin(APIView):
    def post(self, request):
        data = request.data
        email = data["email"]
        password = data["password"]
        user = authenticate(email=email, password=password)

        if user is not None and user.is_superuser:
            # Generate JWT token with user's email and role
            payload = {
                "email": user.email,
                "role": "admin"  # Include user's role here
            }
            token = jwt.encode(payload, "secret", algorithm="HS256")

            # Return token in response
            return Response({
                "status": "success",
                "message": "Successfully logged in",
                "token": token
            })
        else:
            return Response({
                "status": "error",
                "message": "Invalid email or password"
            })
        

class UserListView(APIView):
    def get(self, request):
        user = Account.objects.exclude(is_superuser=True)
        user_count = Account.objects.filter(is_superuser=False).count()
        serializer = CustomerSerializer(user, many=True)
        data = {
            'user': serializer.data,
            'count': user_count
        }
        return Response(data, status=status.HTTP_200_OK)


class AgentListView(APIView):
    def get(self,request):
        user = Agent.objects.all()
        agent_count = Agent.objects.count()
        serializer = AgentSerializer(user, many=True)
        data = {
            'agent':serializer.data,
            'count':agent_count
        }
        return Response(data,status=status.HTTP_200_OK) 



class AddDestination(APIView):
    def post(self, request):
        serializer = DestinationSerializer(data = request.data)
        print("serializer of destination:",serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
class EditDestination(APIView):
    def put(self, request, id):
        try:
            destination = Destination.objects.get(pk=id)
            print("destination from fun:", id)
        except Destination.DoesNotExist:
            return Response({'error': 'Destination does not exist'}, status=status.HTTP_404_NOT_FOUND)
        serializer = DestinationSerializer(destination, data=request.data)
        print("serializer of destination:", serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        print("error:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteDestination(APIView):
    def delete(self, request, id):
        try:
            destination = Destination.objects.get(pk=id)
        except Destination.DoesNotExist:
            return Response({'error': 'Destination does not exist'}, status=status.HTTP_404_NOT_FOUND)

        destination.delete()  # Delete the destination object
        return Response({'success':'Destination successfully deleted'}, status=status.HTTP_204_NO_CONTENT) 
    
        
class FetchCategory(APIView):
    def get(self, request):
        cat = Category.objects.all()
        serializer = CategorySerializer(cat,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
class AddCategory(APIView):
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EditCategory(APIView):   
    def put(self, request, id):
            category = Category.objects.get(pk=id)
            if not category:
                return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = CategorySerializer(category, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteCategory(APIView):
    def delete(self, request, id):
        try:
            category = Category.objects.get(pk=id)
        except Destination.DoesNotExist:
            return Response({'error': 'Category does not exist'}, status=status.HTTP_404_NOT_FOUND)

        category.delete() 
        return Response({'success':'Category successfully deleted'}, status=status.HTTP_204_NO_CONTENT) 
    
class FetchBookings(APIView):
    def get(self, request):
        bookings = Booking.objects.all()
        booking_count = bookings.count()  # Count the number of bookings
        serializer = BookingSerializer(bookings, many=True)
        data = {
            'bookings': serializer.data,
            'count': booking_count
        }
        return Response(data, status=status.HTTP_200_OK)


class PackagesCountView(APIView):
    def get(self, request):
        packages_count = Package.objects.count()
        return Response({'package_count':packages_count})
    


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt_access')
        response.data = {
            'message':'success'
        }

        return response
    
class BookingTrendsView(APIView):
    def get(self, request, *args, **kwargs):
        last_month = timezone.now() - timedelta(days=30)
        bookings = Booking.objects.filter(booking_date__gte=last_month).extra({'day': "date(booking_date)"}).values('day').annotate(count=Count('id')).order_by('day')
        return Response(bookings)

class PopularDestinationsView(APIView):
    def get(self, request, *args, **kwargs):
        destinations = Booking.objects.values('package__destination_id__destination_name').annotate(count=Count('id')).order_by('-count')[:10]
        return Response(destinations)

class RevenueTrendsView(APIView):
    def get(self, request, *args, **kwargs):
        last_month = timezone.now() - timedelta(days=30)
        revenue = Booking.objects.filter(booking_date__gte=last_month).extra({'day': "date(booking_date)"}).values('day').annotate(total_revenue=Sum('total_cost')).order_by('day')
        return Response(revenue)

class CategoryDistributionView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        category_data = []

        for category in categories:
            # Count the number of bookings for packages in this category
            count = Booking.objects.filter(package__category=category).count()
            category_data.append({'name': category.name, 'count': count})

        return Response(category_data)