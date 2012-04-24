Make sure that Yipit's django-imagekit fork is added to your PYTHONPATH.
For example:

    $ PYTHONPATH=$PYTHONPATH:/u/dfstern/course/cs132/django-imagekit ./manage.py test

would run the manage.py script, and try to test the codebase.

In addition, for the static data to be properly served, either this folder should be located at:

    ~/course/cs132/yipit

or you should modify the settings.py file.
