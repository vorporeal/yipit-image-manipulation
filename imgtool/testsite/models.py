from django.db import models
from imagekit.models.fields import ImageSpecField
from imagekit.processors import ResizeToFit

def get_thumb_processors(instance, file):
    pass

# Create your models here.
class DealPhoto(models.Model):
    original_image = models.ImageField(upload_to='photos')
    api_large = ImageSpecField([ResizeToFit(width=372)],
            image_field='original_image', format='JPEG', options={'quality': 90})
    api_small = ImageSpecField([ResizeToFit(width=212)],
            image_field='original_image', format='JPEG', options={'quality': 90})
