import os

from django.db import models
from django.forms import ModelForm
from imagekit.models.fields import ImageSpecField
from imagekit.processors import ResizeToFit

def get_thumb_processors(instance, file):
    pass

def cache_to_thumb(instance, path, specname, extension):
    filename = os.path.basename(instance.original_image.name)
    return "photos/processed/" + specname + "/" + os.path.splitext(filename)[0] + ".jpg"

# Create your models here.
class DealPhoto(models.Model):
    original_image = models.ImageField(upload_to='photos')
    api_large = ImageSpecField([ResizeToFit(width=372)],
            image_field='original_image', format='JPEG',
            cache_to=cache_to_thumb, options={'quality': 90})
    api_small = ImageSpecField([ResizeToFit(width=212)],
            image_field='original_image', format='JPEG',
            cache_to=cache_to_thumb, options={'quality': 90})
    

    def save(self, *args, **kwargs):
        super(DealPhoto, self).save(*args, **kwargs)
        test = DealPhoto.objects.all()[DealPhoto.objects.count() - 1]
        test.api_large.width
        test.api_small.width

class DealPhotoForm(ModelForm):
    class Meta:
        model = DealPhoto
