from rest_framework import mixins, viewsets
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    get -> list -> Queryset
    get -> retrive -> product instance detail view
    post -> create -> new instance
    put -> update
    patch -> partial update
    delete -> destroy
    """

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk' # default
    

class ProductGenericViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
    ):
    """
    get -> list -> Queryset
    get -> retrive -> product instance detail view
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'pk' # default

# product_list_view = ProductGenericViewSet.as_view('get': 'list')
# product_detail_view = ProductGenericViewSet.as_view('get': 'retrieve')