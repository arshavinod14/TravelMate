# Generated by Django 4.2.4 on 2024-03-27 17:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0015_remove_package_categories_package_category'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='package',
            name='end_date',
        ),
        migrations.RemoveField(
            model_name='package',
            name='start_date',
        ),
    ]