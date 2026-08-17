from django.db import models

class SEOBaseModel(models.Model):
    seo_title = models.CharField(max_length=70, blank=True, null=True)
    seo_description = models.CharField(max_length=160, blank=True, null=True)
    canonical_url = models.URLField(blank=True, null=True, help_text="Override auto-generated canonical if required")
    og_title = models.CharField(max_length=70, blank=True, null=True)
    og_description = models.CharField(max_length=160, blank=True, null=True)
    og_image = models.ImageField(upload_to="seo_og/", blank=True, null=True)
    no_index = models.BooleanField(default=False)

    class Meta:
        abstract = True

class Media(models.Model):
    file = models.FileField(upload_to="uploads/%Y/%m/")
    alt_text = models.CharField(max_length=150, blank=True)
    title = models.CharField(max_length=150, blank=True)
    caption = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Media Library"

    def __str__(self):
        return self.title or self.file.name

class ProductImage(models.Model):
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name="product_images")
    media = models.ForeignKey(Media, on_delete=models.CASCADE)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]

class Document(models.Model):
    title = models.CharField(max_length=150)
    file = models.FileField(upload_to="documents/%Y/%m/")
    document_type = models.CharField(max_length=50, help_text="e.g., Catalog, Datasheet, Installation Guide")
    description = models.TextField(blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return f"{self.title} ({self.document_type})"

class ProductCategory(SEOBaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, db_index=True)
    description = models.TextField(blank=True)
    image = models.ForeignKey(Media, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        verbose_name_plural = "Product Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name

class Product(SEOBaseModel):
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True, db_index=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.PROTECT, related_name="products")
    short_description = models.TextField()
    description = models.TextField(help_text="Primary rich text or semantic HTML content")
    description_blocks = models.JSONField(
        default=list, 
        blank=True, 
        help_text="Structured block data for future drag-and-drop block editors (e.g. EditorJS layout)"
    )
    specifications = models.JSONField(default=dict, blank=True, help_text="Technical specifications attributes map")
    applications = models.TextField(blank=True)
    documents = models.ManyToManyField(Document, related_name="products", blank=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
