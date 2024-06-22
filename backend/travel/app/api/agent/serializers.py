from rest_framework import serializers
from app.models import *
from django.contrib.auth.hashers import make_password



class AgentRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id', 'first_name', 'last_name', 'phone','email','password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        
        if password is not None:
            # Hash the password manually
            instance.password = make_password(password)
        
        instance.save()
        return instance



class AgentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Agent
        fields = ( 'id','first_name', 'last_name','email', 'phone')


# class ActivitySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Activity
#         fields = '__all__'