from django.contrib import admin
from django.utils.html import format_html
from .models import Media, ProductImage, Document, ProductCategory, Product

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ("title", "file", "alt_text", "image_preview", "created_at")
    search_fields = ("title", "alt_text")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.file:
            # Check if it's an image file
            ext = obj.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                return format_html('<img src="{}" width="80" style="border-radius: 4px;" />', obj.file.url)
        return "No Image Preview"
    image_preview.short_description = "Preview"

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "document_type", "file", "is_active", "created_at")
    list_filter = ("document_type", "is_active")
    search_fields = ("title", "description")

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "is_featured", "is_active", "created_at")
    list_filter = ("is_featured", "is_active", "category")
    search_fields = ("name", "short_description", "description")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline]
    filter_horizontal = ("documents",)
