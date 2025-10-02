from django import forms
from .models import Product

class CheckoutForm(forms.Form):
    customer_name = forms.CharField(max_length=120, label="Full name")
    phone = forms.CharField(max_length=50)
    address = forms.CharField(max_length=300)
    note = forms.CharField(widget=forms.Textarea, required=False)
    product = forms.ModelChoiceField(queryset=Product.objects.filter(published=True))
    quantity = forms.IntegerField(min_value=1, initial=1)
