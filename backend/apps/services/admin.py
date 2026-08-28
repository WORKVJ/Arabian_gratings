from django.contrib import admin
from .models import Service
from apps.utils_admin import SuperuserOnlyAdmin

@admin.register(Service)
class ServiceAdmin(SuperuserOnlyAdmin):
    list_display = ("name", "slug", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
