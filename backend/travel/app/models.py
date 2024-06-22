from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone


class AccountManager(BaseUserManager):
    def create_user(self, email,password=None):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        email = email.lower()

        user = self.model(
            email=email,
            # first_name=first_name,
            # last_name = last_name,
            # phone = phone
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email,  password=None):
        user = self.create_user(email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class Account(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    phone = models.CharField(max_length=20,default='')
    #image = models.ImageField(upload_to="images/", default="profile-img.jpg")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  

    objects = AccountManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Agent(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20,default='')
    company = models.CharField(max_length=255,null=True, blank=True)
    address = models.CharField(max_length=255,null=True, blank=True)
    password = models.CharField(max_length=128)
    email = models.EmailField(max_length=255, unique=True)
    image = models.ImageField(upload_to="images/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)



    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Destination(models.Model):
    destination_name = models.CharField(max_length=225)
    description = models.TextField()
    image = models.ImageField(upload_to="images/destination/")

    def __str__(self):
        return self.destination_name
    
class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
    

class Activity(models.Model):
    day = models.PositiveIntegerField()
    description = models.TextField()
    activity_package = models.ForeignKey('Package', on_delete=models.CASCADE, related_name='package_activities', default=None)

    def __str__(self):
        return f'Day{self.day}:{self.description}'


    

class Package(models.Model):
    agent_id = models.ForeignKey(Agent,on_delete=models.CASCADE,default=None)
    destination_id = models.ForeignKey(Destination,on_delete=models.CASCADE,default=None, null=True, blank=True)
    package_name = models.CharField(max_length=100)
    description = models.TextField()
    # start_date = models.DateField()
    # end_date = models.DateField()
    duration = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10,decimal_places=2)
    image = models.ImageField(upload_to="images/packages/",default=None,null=True, blank=True)
    is_top_package = models.BooleanField(default=False) 
    category = models.ForeignKey(Category, on_delete=models.CASCADE, default=None, null=True, blank=True)
    #activities = models.ManyToManyField('Activity')


    def __str__(self):
        return self.package_name
    
class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
    )
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='bookings')
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='bookings')
    booking_date = models.DateTimeField(auto_now_add=True)
    num_travelers = models.PositiveIntegerField(default=1)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f'Booking #{self.id} for {self.package.package_name} by {self.customer.email}'


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Review(models.Model):
    RATING_CHOICES = (
        (1, '1 Star'),
        (2, '2 Stars'),
        (3, '3 Stars'),
        (4, '4 Stars'),
        (5, '5 Stars'),
    )

    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user}\'s review for {self.package.package_name}'


class Notification(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.message