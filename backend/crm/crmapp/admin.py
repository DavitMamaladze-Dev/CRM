from django.contrib import admin
from rest_framework import viewsets

from crmapp.models import Contact, Activity , Task , Deal

# Register your models here.


admin.site.register(Contact)
admin.site.register(Task)
admin.site.register(Activity)
admin.site.register(Deal)