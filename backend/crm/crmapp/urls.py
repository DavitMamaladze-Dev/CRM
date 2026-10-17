from rest_framework.routers import DefaultRouter
from .views import ContactViewSet,DealViewSet,ActivityViewSet,TaskViewSet


router = DefaultRouter()

router.register('tasks',TaskViewSet)
router.register('deals',DealViewSet)
router.register('activities',ActivityViewSet)
router.register('contacts',ContactViewSet)

urlpatterns = router.urls