# import jwt
# from django.conf import settings
# from rest_framework import authentication, exceptions
# from app.models import *  # Ensure this import is correct

# class JWTAuthentication(authentication.BaseAuthentication):

#     def authenticate(self, request):
#         auth = request.headers.get('Authorization')
#         if not auth:
#             return None

#         if auth.split()[0].lower() != 'bearer':
#             return None

#         token = auth.split()[1]

#         try:
#             payload = jwt.decode(token, 'secret', algorithms=['HS256'])
#         except jwt.ExpiredSignatureError:
#             raise exceptions.AuthenticationFailed('Token has expired')
#         except jwt.DecodeError:
#             raise exceptions.AuthenticationFailed('Error decoding token')

#         try:
#             user = Account.objects.get(id=payload['id'])
#         except Account.DoesNotExist:
#             raise exceptions.AuthenticationFailed('No user matching this token was found')

#         return (user, token)
