from django.contrib import admin
from .models import Industry
from apps.utils_admin import SuperuserOnlyAdmin

@admin.register(Industry)
class IndustryAdmin(SuperuserOnlyAdmin):
    list_display = ("name", "slug", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "short_description")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("related_products",)
