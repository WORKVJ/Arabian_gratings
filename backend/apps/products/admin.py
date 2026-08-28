from django.contrib import admin
from django.utils.html import format_html
from .models import Media, ProductImage, ProductSpecification, Document, ProductCategory, Product
from apps.utils_admin import SuperuserOnlyAdmin


# ─────────────────────────────────────────────
# Media
# ─────────────────────────────────────────────

@admin.register(Media)
class MediaAdmin(SuperuserOnlyAdmin):
    list_display = ("title", "alt_text", "image_preview", "created_at")
    search_fields = ("title", "alt_text")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.file:
            ext = obj.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                return format_html('<img src="{}" width="80" style="border-radius:4px;" />', obj.file.url)
        return "No Preview"
    image_preview.short_description = "Preview"


# ─────────────────────────────────────────────
# Documents
# ─────────────────────────────────────────────

@admin.register(Document)
class DocumentAdmin(SuperuserOnlyAdmin):
    list_display = ("title", "document_type", "is_active", "sort_order", "created_at")
    list_filter = ("document_type", "is_active")
    search_fields = ("title", "description")
    list_editable = ("sort_order", "is_active")


# ─────────────────────────────────────────────
# Product Category
# ─────────────────────────────────────────────

@admin.register(ProductCategory)
class ProductCategoryAdmin(SuperuserOnlyAdmin):
    list_display = ("name", "slug", "sort_order", "is_active", "product_count_display")
    list_filter = ("is_active",)
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("sort_order", "is_active")
    fieldsets = (
        ("Category Info", {
            "fields": ("name", "slug", "sort_order", "is_active", "image", "short_description", "description")
        }),
        ("SEO", {
            "classes": ("collapse",),
            "fields": ("seo_title", "seo_description", "canonical_url", "og_title", "og_description", "og_image", "no_index")
        }),
    )

    def product_count_display(self, obj):
        count = obj.products.filter(is_active=True).count()
        return format_html('<span style="font-weight:600;">{}</span>', count)
    product_count_display.short_description = "Products"


# ─────────────────────────────────────────────
# Inlines for Product
# ─────────────────────────────────────────────

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("media", "alt_text", "caption", "sort_order", "is_primary", "image_preview")
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        if obj.media and obj.media.file:
            ext = obj.media.file.name.split('.')[-1].lower()
            if ext in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                return format_html('<img src="{}" width="60" style="border-radius:2px;" />', obj.media.file.url)
        return "—"
    image_preview.short_description = "Preview"


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 3
    fields = ("name", "value", "sort_order")
    ordering = ("sort_order",)
    verbose_name = "Specification Row"
    verbose_name_plural = "Technical Specifications"


# ─────────────────────────────────────────────
# Product
# ─────────────────────────────────────────────

@admin.register(Product)
class ProductAdmin(SuperuserOnlyAdmin):
    list_display = ("name", "category", "product_code", "material", "is_featured", "is_active", "sort_order", "created_at")
    list_filter = ("is_featured", "is_active", "category")
    search_fields = ("name", "short_description", "description", "product_code")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("sort_order", "is_featured", "is_active")
    filter_horizontal = ("documents", "related_products")
    inlines = [ProductImageInline, ProductSpecificationInline]
    save_on_top = True

    fieldsets = (
        ("Product Identity", {
            "fields": ("category", "name", "slug", "product_code", "sort_order", "is_active", "is_featured")
        }),
        ("Content", {
            "fields": ("short_description", "description", "description_blocks")
        }),
        ("Key Technical Summary (Hero Strip)", {
            "description": "These values appear in the hero spec strip on the product detail page.",
            "fields": ("material", "finish", "standard")
        }),
        ("Applications & Features", {
            "fields": ("applications", "features")
        }),
        ("Legacy Specifications (JSON)", {
            "classes": ("collapse",),
            "description": "Use the inline rows below for specifications. This JSON field is for legacy/bulk data.",
            "fields": ("specifications",)
        }),
        ("FAQ", {
            "classes": ("collapse",),
            "description": 'Format: [{"question": "...", "answer": "..."}]',
            "fields": ("faq",)
        }),
        ("Documents & Relations", {
            "fields": ("documents", "related_products")
        }),
        ("SEO", {
            "classes": ("collapse",),
            "fields": ("seo_title", "seo_description", "canonical_url", "meta_keywords",
                       "og_title", "og_description", "og_image", "no_index")
        }),
    )
