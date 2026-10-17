from rest_framework import serializers
from .models import Contact,Deal,Activity,Task

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id' , 'name' , 'email' , 'phone' , 'company' , 'source' , 'created_at']


class DealSerializer(serializers.ModelSerializer):

    contact_name = serializers.CharField(source='contact.name' , read_only=True)

    class Meta:
        model = Deal
        fields = ['id' , 'contact' , 'contact_name' , 'title' , 'value' ,
                  'stage' , 'created_at' , 'updated_at']


class ActivitySerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = ['id' , 'deal' , 'type' , 'description' , 'created_at']



class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'deal' , 'title' , 'due_date' , 'is_done']


