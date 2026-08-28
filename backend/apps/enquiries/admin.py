from django.contrib import admin
from .models import ContactEnquiry, QuoteRequest, QuoteAttachment
from apps.utils_admin import SuperuserOnlyAdmin

class QuoteAttachmentInline(admin.TabularInline):
    model = QuoteAttachment
    extra = 1

@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(SuperuserOnlyAdmin):
    list_display = ("name", "email", "phone", "company", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("name", "email", "phone", "company", "message")
    list_editable = ("status",)

@admin.register(QuoteRequest)
class QuoteRequestAdmin(SuperuserOnlyAdmin):
    list_display = ("id", "name", "company", "email", "phone", "product", "material", "quantity", "status", "created_at")
    list_filter = ("status", "product", "material", "created_at")
    search_fields = ("name", "company", "email", "phone", "product", "project_requirements")
    list_editable = ("status",)
    inlines = [QuoteAttachmentInline]
