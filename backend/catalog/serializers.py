from rest_framework import serializers
from .models import Product, Order, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ("id","slug","title","description","price_cents","created_at")

class OrderItemCreateSerializer(serializers.ModelSerializer):
    product = serializers.UUIDField()
    class Meta:
        model = OrderItem
        fields = ("product","quantity")

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)
    class Meta:
        model = Order
        fields = ("customer_name","phone","address","note","items")
    def create(self, validated_data):
        items = validated_data.pop("items")
        order = Order.objects.create(**validated_data, payment_method="COD", status="new")
        total = 0
        from .models import Product
        errors = []
        for it in items:
            try:
                p = Product.objects.get(id=it["product"], published=True)
            except Product.DoesNotExist:
                errors.append({"product": f"Invalid product ID {it['product']}"})
                continue
            try:
                qty = int(it.get("quantity", 1))
            except (TypeError, ValueError):
                errors.append({"quantity": "Quantity must be an integer."})
                continue
            if qty <= 0:
                errors.append({"quantity": "Quantity must be greater than zero."})
                continue
            line = p.price_cents * qty
            total += line
            OrderItem.objects.create(
                order=order,
                product=p,
                quantity=qty,
                price_cents=p.price_cents,
            )
        if errors:
            order.delete()
            raise serializers.ValidationError({"items": errors})
        order.total_cents = total
        order.save()
        return order
