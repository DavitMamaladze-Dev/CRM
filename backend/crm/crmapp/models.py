from django.db import models

class Contact(models.Model):
    SOURCE_CHOICES = [
        ('other', 'Other'),
        ('website', 'Website'),
        ('referral', 'Referral'),
        ('cold_outreach', 'Cold Outreach'),

    ]
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=20 , blank=True)
    company = models.CharField(max_length=150, blank=True)
    source = models.CharField(choices=SOURCE_CHOICES, max_length=150, default='other')
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Deal(models.Model):
    STAGE_CHOICES = [
        ('new' , 'New'),
        ('contacted' , 'Contacted'),
        ('proposal_sent' , 'Proposal Sent'),
        ('negotiation' , 'Negotiation'),
        ('won' , 'Won'),
        ('lost' , 'Lost'),
    ]

    contact = models.ForeignKey(Contact, on_delete=models.CASCADE , related_name='deals')
    title = models.CharField(max_length=200)
    value = models.DecimalField(max_digits=10, decimal_places=2 , default=0)
    stage = models.CharField(choices=STAGE_CHOICES, max_length=150, default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']


    def __str__(self):
        return f"{self.title} ({self.get_stage_display()})"


class Activity(models.Model):
    TYPE_CHOICES = [
        ('call', 'Call'),
        ('email', 'Email'),
        ('meeting', 'Meeting'),
        ('note' , 'Note'),
    ]

    deal = models.ForeignKey(Deal, on_delete=models.CASCADE , related_name='activities')
    type = models.CharField(choices=TYPE_CHOICES, max_length=150, default='note')
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Activities'



    def __str__(self):
        return f"{self.get_type_display()} on {self.deal}"




class Task(models.Model):
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE , related_name='tasks')
    title = models.CharField(max_length=200)
    due_date = models.DateField(null=True, blank=True)
    is_done = models.BooleanField(default=False)

    class Meta:
        ordering = ['due_date']

    def __str__(self):
        return self.title





























