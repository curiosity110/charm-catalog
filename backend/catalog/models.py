"""Database models for catalog content."""
from __future__ import annotations

import uuid
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify


class Product(models.Model):
    """A product that can be displayed and ordered from the catalog."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.00"))],
        default=Decimal("0.00"),
    )
    image = models.ImageField(upload_to="product_images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover - display helper
        return self.title

    def clean(self) -> None:
        super().clean()
        if not self.image and not self.image_url:
            raise ValidationError("Provide either an uploaded image or an image URL.")

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            base_slug = slugify(self.title) or uuid.uuid4().hex
            slug_candidate = base_slug
            counter = 1
            while Product.objects.filter(slug=slug_candidate).exclude(pk=self.pk).exists():
                slug_candidate = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug_candidate
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def primary_image_url(self) -> str:
        if self.image:
            return self.image.url
        return self.image_url
