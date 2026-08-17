from rest_framework import serializers
from .models import Media, Document, ProductCategory, Product, ProductImage

class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = ['id', 'file', 'alt_text', 'title', 'caption', 'created_at']

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'document_type', 'description', 'sort_order', 'is_active']

class ProductCategorySerializer(serializers.ModelSerializer):
    image = MediaSerializer(read_only=True)
    
    class Meta:
        model = ProductCategory
        fields = [
            'id', 'name', 'slug', 'description', 'image', 'is_active',
            'seo_title', 'seo_description', 'canonical_url', 'og_title', 'og_description', 'og_image', 'no_index'
        ]

class ProductImageSerializer(serializers.ModelSerializer):
    media = MediaSerializer(read_only=True)
    
    class Meta:
        model = ProductImage
        fields = ['id', 'media', 'sort_order']

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category_name', 'category_slug', 
            'short_description', 'is_featured', 'is_active', 'created_at'
        ]

class ProductDetailSerializer(serializers.ModelSerializer):
    category = ProductCategorySerializer(read_only=True)
    product_images = ProductImageSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'short_description', 'description', 
            'description_blocks', 'specifications', 'applications', 'product_images', 
            'documents', 'is_featured', 'is_active', 'created_at', 'updated_at',
            'seo_title', 'seo_description', 'canonical_url', 'og_title', 'og_description', 'og_image', 'no_index'
        ]
