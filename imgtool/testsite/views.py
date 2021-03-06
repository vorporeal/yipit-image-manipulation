from testsite.models import DealPhoto
from testsite.models import DealPhotoForm
 
from django.template import RequestContext
from django.shortcuts import render_to_response

def form(request):
  if request.method == 'POST':
    form = DealPhotoForm(request.POST, request.FILES)
    if form.is_valid():
      dealPhotoModel = form.save()
  else:
    form = DealPhotoForm()

  return render_to_response('form.html', {'form': form})
