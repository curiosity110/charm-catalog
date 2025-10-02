"""Database models for catalog content."""
from __future__ import annotations

import uuid
from typing import Optional

from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify


class Product(models.Model):
    """A product that can be displayed and ordered from the catalog."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    price_cents = models.PositiveIntegerField()
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover - display helper
        return self.title

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            base_slug = slugify(self.title) or uuid.uuid4().hex
            slug_candidate = base_slug
            counter = 1
            while Product.objects.filter(slug=slug_candidate).exclude(pk=self.pk).exists():
                slug_candidate = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug_candidate
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    """Image metadata associated with a product."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, related_name="product_images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="product_images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    is_primary = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_primary", "sort_order", "created_at"]

    def __str__(self) -> str:  # pragma: no cover - display helper
        return f"Image for {self.product.title}"

    def clean(self) -> None:
        super().clean()
        if not self.image and not self.image_url:
            raise ValidationError("Provide either an uploaded image or an image URL.")

    @property
    def url(self) -> Optional[str]:
        if self.image:
            return self.image.url
        return self.image_url or None
