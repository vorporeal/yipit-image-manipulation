import os

from django.db import models
from django.forms import ModelForm
from django.core.files.storage import default_storage
from django.db.models.signals import post_save
from imagekit.models.fields import ImageSpecField
from imagekit.processors import ResizeToFit
from imagekit.processors import Crop


def cache_to_thumb(instance, path, specname, extension):
    filename = os.path.basename(instance.original_image.name)
    return "photos/processed/" + specname + "/" + os.path.splitext(filename)[0] + ".jpg"

def getCrop(instance, file):
    print(vars(instance))
    theWidth = instance.width
    theHeight = instance.height
    theX = -1 * instance.xCorner
    theY = -1 * instance.yCorner
    return [Crop(width=theWidth, height=theHeight, x=theX, y=theY)]

def post_save_receiver(sender, instance=None, created=False, raw=False, **kwargs):
    instance.cropped.width
    instance.api_large.width
    instance.api_small.width

# Create your models here.
class DealPhoto(models.Model):
    width = models.IntegerField()
    height = models.IntegerField()
    xCorner = models.IntegerField()
    yCorner = models.IntegerField()

    original_image = models.ImageField(upload_to='photos')
    
    cropped = ImageSpecField(processors = getCrop,
        image_field='original_image', format='JPEG',
        cache_to=cache_to_thumb, options={'quality': 90})
    api_large = ImageSpecField([ResizeToFit(width=372)],
        image_field='cropped', format='JPEG',
        cache_to=cache_to_thumb, options={'quality': 90})
    api_small = ImageSpecField([ResizeToFit(width=212)],
        image_field='cropped', format='JPEG',
        cache_to=cache_to_thumb, options={'quality': 90})

post_save.connect(post_save_receiver, sender=DealPhoto)

class DealPhotoForm(ModelForm):
    class Meta:
        model = DealPhoto
