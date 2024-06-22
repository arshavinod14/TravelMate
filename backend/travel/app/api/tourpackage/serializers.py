from rest_framework import serializers
from app.models import *

class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ['id','agent_id', 'destination_id', 'package_name', 'description', 'duration', 'price', 'image', 'is_top_package', 'category']





class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'day', 'description', 'activity_package']

    # def create(self, validated_data):
    #     package_id = self.context.get('package_id')
    #     package = Package.objects.get(pk=package_id)
    #     activity = Activity.objects.create(
    #         day=validated_data['day'],
    #         description=validated_data['description'],
    #         activity_package=package
    #     )
    #     return activity
