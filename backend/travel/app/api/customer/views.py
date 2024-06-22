from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from app.models import *
import jwt
import datetime
from django.core.exceptions import ObjectDoesNotExist

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
import stripe

from django.conf import settings
stripe.api_key = settings.STRIPE_SECRET_KEY

from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from jwt.exceptions import InvalidTokenError




User = get_user_model()




class registerView(APIView):

    def post(self, request):
        serializer = CustomerRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)




class loginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')


        customer = Account.objects.filter(email=email).first()
        if customer and not customer.is_staff:
        
            if customer.check_password(password):
                payload = {
                    'id': customer.id,
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                    'iat': datetime.datetime.utcnow()
                }
                token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')  
                response = Response({
                    "status": "success",
                    "message": "Successfully logged in",
                    'token': {
                        "access": token
                    }
                })
                response.set_cookie(key='jwt_access', value=token, httponly=True)
                return response
            else:
                # Password is incorrect
                return Response({"status": "error", "message": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            # User is not found or is an admin
            return Response({"status": "error", "message": "User not found or unauthorized"}, status=status.HTTP_404_NOT_FOUND)


class GetCustomer(APIView):
    
    def get(self, request,id):
        print("Request user:", request.user)
        print(id)
        user = Account.objects.get(id=id)
        serializer = CustomerSerializer(user,many=False)
        return Response(serializer.data,status=status.HTTP_200_OK)




class UpdateView(APIView):
    def put(self, request, id):
        try:
            user = Account.objects.get(id=id)
        except ObjectDoesNotExist:
            return Response("User not found", status=status.HTTP_404_NOT_FOUND)
        
        serializer = CustomerSerializer(user, data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(f"An error occurred: {e}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    
class DeleteView(APIView):
    def get(self,request, id):
        user = Account.objects.get(id=id)
        user.delete()
        return Response({"message": "success"}, status = status.HTTP_200_OK)
    

class ChangePasswordView(APIView):
    def put(self, request,id):
        print("change password id: ",id)
        try:
            user = Account.objects.get(id=id)
        except Account.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        old_password = request.data.get('old_password')
        print("old_password: ",old_password)
        new_password1 = request.data.get('new_password1')
        print("new_password1: ",new_password1)
        new_password2 = request.data.get('new_password2')
        print("new_password2: ",new_password2)

        if not check_password(old_password, user.password):
            return Response({'old_password': ['Wrong password.']}, status=status.HTTP_400_BAD_REQUEST)

        if new_password1 != new_password2:
            return Response({'new_password2': ['Passwords do not match.']}, status=status.HTTP_400_BAD_REQUEST)

        if len(new_password1) < 8:
            return Response({'new_password1': ['New password must be at least 8 characters long.']}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password1)
        user.save()

        return Response({'success': 'Password changed successfully.'}, status=status.HTTP_200_OK)
    
class CreateBooking(APIView):
    def post(self, request):
        serializer = BookingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetBookings(APIView):
    def get(self, request, id):
        print("Headers: %s", request.headers)
        print("Request user:", request.user)
        print("User authenticated:", request.user.is_authenticated)
        user = Account.objects.get(id=id)
        bookings = user.bookings.all()
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)

class CancelBooking(APIView):      
    def put(self,request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
            if booking.status == 'pending':
                booking.status = 'cancelled'
                booking.save()
                return Response({'message': 'Booking cancelled successfully'})
            else:
                return Response({'error': 'Cannot cancel booking. Invalid status'}, status=400)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)
        

class ContactUs(APIView):
    def post(self, request):
        try:
            name = request.data.get('name')
            email = request.data.get('email')
            message = request.data.get('message')

            if not name or not email or not message:
                return Response({'error': 'Name, email, and message are required'}, status=status.HTTP_400_BAD_REQUEST)
            
            contact_message = ContactMessage.objects.create(name=name, email=email, message=message)
            
            data = {
                'success': True,
                'message': 'Your message has been received. We will get back to you soon.'
            }
            return Response(data, status=status.HTTP_201_CREATED)
        except Exception as e:
            error_message = str(e)
            return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt_access')
        response.data = {
            'message':'success'
        }
        return response

class GetBookingDetails(APIView):
    def get(self, request, booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
            serializer = BookingSerializer(booking)
            return Response(serializer.data)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)



class ProcessPaymentView(APIView):
    def post(self, request):
        data = request.data
        booking_id = data.get('bookingId')
        
        try:
            booking = Booking.objects.get(id=booking_id)
            package_name = booking.package.package_name
            package_description = booking.package.description
            package_image_url = request.build_absolute_uri(booking.package.image.url) if booking.package.image else None
            total_cost = booking.total_cost
            currency = 'inr'
            success_url = settings.SITE_URL + 'invoice?bookingId=' + str(booking_id) + '&session_id={CHECKOUT_SESSION_ID}'
            cancel_url = settings.SITE_URL + '?canceled=true'

            unit_amount = int(total_cost * 100)
            
            auth_header = request.headers.get('Authorization')
            customer_email = None
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split()[1]
                try:
                    payload = jwt.decode(token, 'secret', algorithms=["HS256"])
                    user_id = payload.get('id')
                    print("User ID:", user_id)  


                    try:
                        account = Account.objects.get(id=user_id)
                        customer_email = account.email
                        print("Customer email:", customer_email) 
                    except Account.DoesNotExist:
                        print("Account not found for user ID:", user_id)
                except InvalidTokenError as e:
                    print('Invalid token:', e)
            else:
                print('No token found in headers')

            validator = URLValidator()
            if package_image_url:
                try:
                    validator(package_image_url)
                except ValidationError:
                    package_image_url = None

            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price_data': {
                        'currency': currency,
                        'product_data': {
                            'name': package_name,
                            'description': package_description,
                            'images': [package_image_url] if package_image_url else [],
                        },
                        'unit_amount': unit_amount,
                    },
                    'quantity': 1,
                }],
                mode='payment',
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    'booking_id': booking_id,
                    'package_name': package_name,
                
                },
                billing_address_collection='required',
                shipping_address_collection={
                    'allowed_countries': ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'JP', 'AU'] 
                },
                customer_email=customer_email,
            )
            
            booking.is_paid = True
            booking.save()

            print("sessions created:", session)
            return Response({'sessionId': session.id})
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:

            print(f"Error creating Stripe session: {str(e)}")
            return Response({'error': 'Failed to create Stripe session'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class AddReview(APIView):
    def post(self, request):
        print("hello fromm add review")
        serializer = ReviewSerializer(data=request.data)
        print("serializer:",serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ViewReview(APIView):
    def get(self, request, package_id):
        print("hello from review")
        try:
            reviews = Review.objects.filter(package_id=package_id)
            serializer = ReviewSerializer(reviews, many=True)
            return Response(serializer.data)
        except Review.DoesNotExist:
            return Response({'error': 'Reviews for the specified package ID do not exist'}, status=status.HTTP_404_NOT_FOUND)

class AllReviews(APIView):
    
    def get(self, request):
        print("checking:",request.user)
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
# from rest_framework.permissions import IsAuthenticated


# class Notifications(APIView):
#     permission_classes = (IsAuthenticated,) 


#     def get(self, request):
#         print("Request user:", request.user)
#         print("User authenticated:", request.user.is_authenticated)
#         notifications = Notification.objects.filter(user=request.user)
#         serializer = NotificationSerializer(notifications, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
