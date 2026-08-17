from django.contrib import admin
from .models import Solution

@admin.register(Solution)
class SolutionAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("related_products", "related_industries")
