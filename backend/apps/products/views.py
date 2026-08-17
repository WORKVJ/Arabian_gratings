import django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from .models import ProductCategory, Product
from .serializers import (
    ProductCategorySerializer, ProductListSerializer, ProductDetailSerializer
)

class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')

    class Meta:
        model = Product
        fields = ['category', 'is_featured']

class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.filter(is_active=True).select_related('image')
    serializer_class = ProductCategorySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('product_images__media', 'documents')
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'short_description', 'description']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
