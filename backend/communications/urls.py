"""URL routes for communications endpoints."""
from __future__ import annotations

from rest_framework.routers import DefaultRouter

from .views import ContactRequestViewSet

router = DefaultRouter()
router.register(r"contact-requests", ContactRequestViewSet, basename="contact-request")

urlpatterns = router.urls
