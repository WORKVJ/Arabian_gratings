from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Industry
from .serializers import IndustrySerializer

class IndustryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Industry.objects.filter(is_active=True).prefetch_related('related_products').select_related('image')
    serializer_class = IndustrySerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
