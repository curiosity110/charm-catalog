"""Serializers for catalog models."""
from __future__ import annotations

from typing import Any, Dict

from rest_framework import serializers

from .models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    """Expose a single product image entry."""

    url = serializers.CharField(write_only=True, required=False, allow_blank=True)
    upload = serializers.ImageField(write_only=True, required=False, allow_null=True, source="image")

    class Meta:
        model = ProductImage
        fields = [
            "id",
            "url",
            "upload",
            "is_primary",
            "sort_order",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def validate(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        url = attrs.pop("url", "")
        image = attrs.get("image")
        if not url and not image:
            raise serializers.ValidationError("Provide either a URL or an uploaded image file.")
        if url:
            attrs["image_url"] = url
        return attrs

    def to_representation(self, instance: ProductImage) -> Dict[str, Any]:
        representation = super().to_representation(instance)
        representation["url"] = instance.url
        representation.pop("upload", None)
        representation["product_id"] = str(instance.product_id)
        return representation


class ProductSerializer(serializers.ModelSerializer):
    """Expose products along with nested image metadata."""

    product_images = ProductImageSerializer(many=True, required=False)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "price_cents",
            "active",
            "created_at",
            "updated_at",
            "product_images",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
        extra_kwargs = {"slug": {"required": False}}

    def create(self, validated_data: Dict[str, Any]) -> Product:
        images_data = validated_data.pop("product_images", [])
        product = Product.objects.create(**validated_data)
        self._sync_images(product, images_data)
        return product

    def update(self, instance: Product, validated_data: Dict[str, Any]) -> Product:
        images_data = validated_data.pop("product_images", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if images_data is not None:
            instance.product_images.all().delete()
            self._sync_images(instance, images_data)
        return instance

    def _sync_images(self, product: Product, images_data: list[Dict[str, Any]]) -> None:
        for index, image_data in enumerate(images_data):
            payload = dict(image_data)
            payload.setdefault("sort_order", index)
            payload.setdefault("is_primary", index == 0)
            ProductImage.objects.create(product=product, **payload)
