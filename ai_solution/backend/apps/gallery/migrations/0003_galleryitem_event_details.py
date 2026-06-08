from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0002_galleryitem_is_upcoming'),
    ]

    operations = [
        migrations.AddField(
            model_name='galleryitem',
            name='start_time',
            field=models.TimeField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='galleryitem',
            name='end_time',
            field=models.TimeField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='galleryitem',
            name='organizer',
            field=models.CharField(max_length=200, blank=True),
        ),
        migrations.AddField(
            model_name='galleryitem',
            name='website_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='galleryitem',
            name='participants_count',
            field=models.PositiveIntegerField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='galleryitem',
            name='speakers',
            field=models.TextField(blank=True, help_text='One speaker per line: Name, Title'),
        ),
        migrations.AddField(
            model_name='galleryitem',
            name='guests',
            field=models.TextField(blank=True, help_text='One guest per line: Name, Role'),
        ),
        migrations.AddField(
            model_name='galleryitem',
            name='agenda',
            field=models.TextField(blank=True, help_text='One agenda item per line: HH:MM - Description'),
        ),
    ]
