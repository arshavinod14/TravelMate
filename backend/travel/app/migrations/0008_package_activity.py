# Generated by Django 4.2.4 on 2023-08-19 06:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_remove_package_agent_remove_package_destination_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Package',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('package_name', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('duration', models.PositiveIntegerField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('agent_id', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='app.agent')),
                ('destination_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.destination')),
            ],
        ),
        migrations.CreateModel(
            name='Activity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('day', models.PositiveIntegerField()),
                ('description', models.TextField()),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='activities', to='app.package')),
            ],
        ),
    ]