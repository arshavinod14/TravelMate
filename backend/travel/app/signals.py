# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import Package, Notification
# from django.contrib.auth import get_user_model


# from app.models import *

# @receiver(post_save, sender=Package)
# def create_notification(sender, instance, created, **kwargs):
#     if created:
#         # Notify all users
#         for user in Account.objects.all():
#             print("user",user)
#             Notification.objects.create(
#                 user=user,
#                 message=f'New package added for destination {instance.destination.destination_name}'
#             )
        
#         # Notify admin
#         admin_users = Account.objects.filter(is_staff=True)
#         for admin in admin_users:
#             Notification.objects.create(
#                 user=admin,
#                 message=f'Agent {instance.agent.first_name} {instance.agent.last_name} added a new package for destination {instance.destination.destination_name}'
#             )

# # 