import os

from django.db import models
from django.forms import ModelForm
from imagekit.models.fields import ImageSpecField
from imagekit.processors import ResizeToFit
from imagekit.processors import Crop


def cache_to_thumb(instance, path, specname, extension):
    filename = os.path.basename(instance.original_image.name)
    return "photos/processed/" + specname + "/" + os.path.splitext(filename)[0] + ".jpg"

def getCrop(instance, file):
  print(vars(instance))
  scale = min(instance.orig_width, instance.orig_height) / 180.0;
  theWidth = round(instance.width * scale);
  theHeight = round(instance.height * scale);
  theX = -1 * round(instance.xCorner * scale);
  theY = -1 * round(instance.yCorner * scale);
  return [Crop(width=theWidth, height=theHeight, x=theX, y=theY)]

# Create your models here.
class DealPhoto(models.Model):
    orig_width = models.IntegerField()
    orig_height = models.IntegerField()
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

    def save(self, *args, **kwargs):
        super(DealPhoto, self).save(*args, **kwargs)

        test = DealPhoto.objects.all()[DealPhoto.objects.count() - 1]
        test.cropped.width
        test.api_large.width
        test.api_small.width

class DealPhotoForm(ModelForm):
    class Meta:
        model = DealPhoto
