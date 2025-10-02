"""Serializers for catalog models."""
from __future__ import annotations

from typing import Any, Dict

from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Expose products including upload or link based imagery."""

    price = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    primary_image_url = serializers.CharField(read_only=True)
    image_upload = serializers.ImageField(write_only=True, required=False, allow_null=True, source="image")

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "price",
            "image",
            "image_url",
            "image_upload",
            "primary_image_url",
            "active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {"slug": {"required": False}, "image": {"read_only": True}}

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        data = super().validate(attrs)
        image = data.get("image") or getattr(self.instance, "image", None)
        image_url = data.get("image_url") if "image_url" in data else getattr(self.instance, "image_url", "")
        if image and image_url:
            raise serializers.ValidationError("Please supply either an image upload or an image URL, not both.")
        if not image and not image_url:
            raise serializers.ValidationError("Provide either an image upload or an image URL.")
        return data

    def create(self, validated_data: Dict[str, Any]) -> Product:
        return Product.objects.create(**validated_data)

    def update(self, instance: Product, validated_data: Dict[str, Any]) -> Product:
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
