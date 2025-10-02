"""API views for managing orders."""
from __future__ import annotations

from rest_framework import mixins, status, viewsets
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer


class OrderViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Expose read/write operations for orders."""

    serializer_class = OrderSerializer
    lookup_field = "pk"
    queryset = Order.objects.prefetch_related("order_items__product__product_images")

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        read_serializer = self.get_serializer(order)
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
