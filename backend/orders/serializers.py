"""Serializers for order management."""
from __future__ import annotations

from typing import Any, Dict

from rest_framework import serializers

from catalog.serializers import ProductSerializer
from catalog.models import Product
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    """Serialize order line items."""

    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "product_id",
            "quantity",
            "price_cents_at_purchase",
            "created_at",
        ]
        read_only_fields = ["id", "price_cents_at_purchase", "created_at", "product"]

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        quantity = attrs.get("quantity", 0)
        if quantity <= 0:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return attrs

    def to_representation(self, instance: OrderItem) -> Dict[str, Any]:
        representation = super().to_representation(instance)
        representation["product_id"] = str(instance.product_id)
        representation["order_id"] = str(instance.order_id)
        return representation


class OrderSerializer(serializers.ModelSerializer):
    """Serialize orders with nested items."""

    order_items = OrderItemSerializer(many=True, read_only=True)
    items = OrderItemSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer_name",
            "customer_phone",
            "customer_email",
            "customer_address",
            "payment_method",
            "status",
            "total_cents",
            "notes",
            "created_at",
            "updated_at",
            "order_items",
            "items",
        ]
        read_only_fields = ["id", "status", "total_cents", "created_at", "updated_at", "order_items"]

    def create(self, validated_data: Dict[str, Any]) -> Order:
        items_data = validated_data.pop("items", [])
        order = Order.objects.create(**validated_data)
        total_cents = 0

        for item_data in items_data:
            product_id = item_data.pop("product_id")
            product = Product.objects.filter(id=product_id, active=True).first()
            if not product:
                raise serializers.ValidationError({"items": "Product not found or inactive."})
            quantity = item_data["quantity"]
            price = product.price_cents
            total_cents += price * quantity
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price_cents_at_purchase=price,
            )

        if total_cents <= 0:
            raise serializers.ValidationError({"items": "At least one valid item is required."})

        order.total_cents = total_cents
        order.save(update_fields=["total_cents"])
        return order

    def to_representation(self, instance: Order) -> Dict[str, Any]:
        return super().to_representation(instance)
