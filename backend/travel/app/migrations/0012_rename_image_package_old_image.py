# Generated by Django 4.2.4 on 2024-03-26 20:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_category_package_image_package_categories'),
    ]

    operations = [
        migrations.RenameField(
            model_name='package',
            old_name='image',
            new_name='old_image',
        ),
    ]