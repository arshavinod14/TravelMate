from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from app.api.tourpackage.serializers import PackageSerializer, ActivitySerializer
from app.api.customer.serializers import BookingSerializer
from .serializers import *
from app.models import Agent
import jwt
import datetime
from django.contrib.auth.hashers import make_password
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta


class registerView(APIView):
    def post(self, request):
        serializer = AgentRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class loginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        agent = Agent.objects.filter(email=email).first()
        
        if agent:
            if check_password(password, agent.password):
                payload = {
                    'id': agent.id,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                    'iat': datetime.datetime.utcnow()
                }
                token = jwt.encode(payload, 'secret', algorithm='HS256')
                response = Response({
                    "status": "success",
                    "message": "Successfully logged in",
                    'token': {"access": token}
                })
                response.set_cookie(key='jwt_access', value=token, httponly=True)
                return response
            else:
                return Response({"status": "error", "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"status": "error", "message": "User does not exist"}, status=status.HTTP_404_NOT_FOUND)


class GetAgent(APIView):
    def get(self, request, id):
        user = Agent.objects.get(id=id)
        serializer = AgentSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateAgent(APIView):
    def post(self, request, id):
        user = Agent.objects.get(id=id)
        serializer = AgentSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class DeleteAgent(APIView):
    def get(self, request, id):
        user = Agent.objects.get(id=id)
        user.delete()
        return Response({"message": "Agent deleted"}, status=status.HTTP_200_OK)


class PackagesList(APIView):
    def get(self, request, id):
        agent = Agent.objects.get(pk=id)
        package = Package.objects.all()
        serializers = PackageSerializer(package, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)


class AddPackage(APIView):
    def post(self, request):
        serializer = PackageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditPackage(APIView):
    def put(self, request, id):
        package = get_object_or_404(Package, pk=id)
        serializer = PackageSerializer(package, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    
class DeletePackage(APIView):
    def delete(self, request, id):
        package = get_object_or_404(Package, pk=id)
        package.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class AddActivity(APIView):
    def post(self, request, id):
        package = Package.objects.get(id=id)
        activities_data = request.data
        for key in activities_data.keys():
            if key.endswith('[day]'):
                index = key.split('[')[0]
                day = activities_data[f'{index}[day]']
                description = activities_data[f'{index}[description]']
                serializer = ActivitySerializer(data={'day': day, 'description': description})
                if serializer.is_valid():
                    serializer.save(activity_package=package)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response("Activities added successfully", status=status.HTTP_201_CREATED)


class ViewActivities(APIView):
    def get(self, request, id):
        try:
            package = Package.objects.get(id=id)
            activities = package.package_activities.all()
            serializer = ActivitySerializer(activities, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Package.DoesNotExist:
            return Response({'error': 'Package not found'}, status=status.HTTP_404_NOT_FOUND)
        
class GetAgentPackagesView(APIView):
    def get(self, request, id):
        try:
            agent = Agent.objects.get(id=id)
            packages = Package.objects.filter(agent_id=agent)
            package_count = packages.count()
            serializer = PackageSerializer(packages, many=True)
            response_data = {'packages': serializer.data, 'package_count': package_count}
            return Response(response_data)
        except Agent.DoesNotExist:
            return Response({"error": "Agent not found."}, status=404)

        
class GetAgentPackageBookings(APIView):
    def get(self, request, id):
        try:
            agent = Agent.objects.get(id=id)
            agent_packages = Package.objects.filter(agent_id=agent)
            agent_package_bookings = Booking.objects.filter(package__in=agent_packages)
            booking_count = agent_package_bookings.count()
            serializer = BookingSerializer(agent_package_bookings, many=True)
            response_data = {'bookings': serializer.data, 'booking_count': booking_count}
            return Response(response_data)
        except Agent.DoesNotExist:
            return Response({"error": "Agent not found."}, status=404)


class ApproveDeclineBookingView(APIView):
    def put(self, request, id, booking_id):
        try:
            agent = Agent.objects.get(id=id)
            agent_packages = Package.objects.filter(agent_id=agent)
            booking = Booking.objects.get(id=booking_id, package__in=agent_packages)
            action = request.data.get('action')

            if action == 'approve':
                booking.status = 'approved'
            elif action == 'decline':
                booking.status = 'declined'
            else:
                return Response({"error": "Invalid action."}, status=400)

            booking.save()
            serializer = BookingSerializer(booking)
            return Response(serializer.data)
        except (Agent.DoesNotExist, Booking.DoesNotExist):
            return Response({"error": "Agent or booking not found."}, status=404)
        

class ChangePasswordView(APIView):
    def put(self, request, id):
        try:
            user = Agent.objects.get(id=id)
        except Agent.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        old_password = request.data.get('old_password')
        new_password1 = request.data.get('new_password1')
        new_password2 = request.data.get('new_password2')

        if not check_password(old_password, user.password):
            return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)

        if new_password1 != new_password2:
            return Response({'new_password2': ['Passwords do not match.']}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password1) < 8:
            return Response({'new_password1': ['New password must be at least 8 characters long.']}, status=status.HTTP_400_BAD_REQUEST)

        hashed_password = make_password(new_password1)
        user.password = hashed_password
        user.save()

        return Response({'success': 'Password changed successfully.'}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt_access')
        response.data = {
            'message': 'success'
        }

        return response

    


class AgentPopularDestinationsView(APIView):
    def get(self, request, agent_id):
        destinations = Booking.objects.filter(package__agent_id=agent_id)\
                                    .values('package__destination_id__destination_name')\
                                    .annotate(count=Count('id'))\
                                    .order_by('-count')[:10]
        return Response(destinations)
    
class AgentRevenueTrendsView(APIView):
    def get(self, request, agent_id):
        last_month = timezone.now() - timedelta(days=30)
        revenue = Booking.objects.filter(package__agent_id=agent_id, booking_date__gte=last_month)\
                                .extra({'day': "date(booking_date)"})\
                                .values('day')\
                                .annotate(total_revenue=Sum('total_cost'))\
                                .order_by('day')
        return Response(revenue)
    

class AgentCategoryDistributionView(APIView):
    def get(self, request, agent_id):
        categories = Category.objects.all()
        category_data = []

        for category in categories:
            count = Booking.objects.filter(package__category=category, package__agent_id=agent_id).count()
            category_data.append({'name': category.name, 'count': count})

        return Response(category_data)
