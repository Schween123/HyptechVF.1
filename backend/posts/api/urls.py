
from rest_framework.routers import DefaultRouter
from .views import OwnerViewSet, BoardingHouseViewSet, RoomViewSet, TenantViewSet, GuardianViewSet, TransactionViewSet, DashboardDataViewSet

router = DefaultRouter()
router.register(r'owner', OwnerViewSet)
router.register(r'boardinghouse', BoardingHouseViewSet)
router.register(r'rooms', RoomViewSet)
router.register(r'tenant', TenantViewSet)
router.register(r'guardian', GuardianViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'dashboard-data', DashboardDataViewSet, basename='dashboard-data')
# router.register(r'gcash-payment', GCashPaymentViewSet, basename='gcash-payment')
# router.register(r'xendit-webhook', XenditWebhookViewSet, basename='xendit-webhook')


urlpatterns = router.urls