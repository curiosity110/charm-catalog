<<<<<<< HEAD
from rest_framework import viewsets, mixins, permissions
from .models import Product, Order
from .serializers import ProductSerializer, OrderCreateSerializer

class ProductViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Product.objects.filter(published=True).order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    lookup_value_regex = r"[\w-]+"

class OrderViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.AllowAny]
=======
"""API views for catalog resources."""
from __future__ import annotations

from django.db.models import Q
from rest_framework import mixins, status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """Provide list/detail/create/update operations for products."""

    serializer_class = ProductSerializer
    lookup_field = "slug"

    def get_queryset(self):  # type: ignore[override]
        queryset = Product.objects.prefetch_related("product_images")
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(description__icontains=search))
        return queryset.order_by("-created_at")

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        read_serializer = self.get_serializer(product)
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request: Request, *args, **kwargs) -> Response:
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        read_serializer = self.get_serializer(product)
        return Response(read_serializer.data)
>>>>>>> 80097028cee9b05ba55382110b7ad61ae605bbf3
