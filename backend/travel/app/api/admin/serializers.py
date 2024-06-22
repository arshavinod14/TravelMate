from rest_framework import serializers
from app.models import *
from datetime import datetime


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "id",
            "email",
            "phone",
            "first_name",
            "last_name",
            "is_active",
            "is_superuser",
        ]

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description'] 