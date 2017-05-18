from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
from django.apps import apps


# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wikigenomes.settings')

app = Celery('wikigenomes')

# Using a string here means the worker don't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()
app.conf.task_serializer = 'json'


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))


app.conf.beat_schedule = {
    'weekly-genome-operations': {
        'task': 'wiki.tasks.get_wd_genome_data',
        'schedule': crontab(hour=0, minute=5, day_of_week=6),
        'args': ()
    },
    'weekly-feature-operations': {
        'task': 'wiki.tasks.get_wd_features',
        'schedule': crontab(hour=0, minute=25, day_of_week=6),
        'args': ()
    },
    'weekly-update-orthologues': {
        'task': 'wiki.tasks.update_orthologues',
        'schedule': 10.0,
        'args': ()
    }
}








