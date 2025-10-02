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
