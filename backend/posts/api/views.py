from rest_framework import viewsets, status, serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.decorators import action
# from django.conf import settings
# from xendit import Xendit
from django.utils.timezone import now
from datetime import datetime
from ..models import Owner, BoardingHouse, Room, Tenant, Guardian, Transaction
from .serializers import OwnerSerializer, BoardingHouseSerializer, RoomSerializer, TenantSerializer, GuardianSerializer, TransactionSerializer

class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer

class BoardingHouseViewSet(viewsets.ModelViewSet):
    queryset = BoardingHouse.objects.all()
    serializer_class = BoardingHouseSerializer

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def create(self, request, *args, **kwargs):
        if isinstance(request.data, list):  # Check if the data is a list (bulk create)
            serializers = [self.get_serializer(data=item) for item in request.data]
            for serializer in serializers:
                serializer.is_valid(raise_exception=True)
            self.perform_bulk_create(serializers)
            return Response([serializer.data for serializer in serializers], status=status.HTTP_201_CREATED)
        else:  # Single object creation
            return super().create(request, *args, **kwargs)

    def perform_bulk_create(self, serializers):
        rooms = [serializer.save() for serializer in serializers]
        
class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Update payment status after any update
        instance.update_payment_status()

        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='payment-status')
    def payment_status(self, request, pk=None):
        tenant = self.get_object()
        tenant.update_payment_status()  # Ensure the payment status is up-to-date
        return Response(tenant.payment_status)

    @action(detail=True, methods=['post'])
    def update_payment_status(self, request, pk=None):
        tenant = self.get_object()
        data = request.data
        tenant.payment_status.update(data)
        tenant.save()
        return Response({'status': 'Payment status updated'})

    @action(detail=False, methods=['get'], url_path='room/(?P<room_id>\d+)')
    def tenants_by_room(self, request, room_id=None):
        """Get all tenants assigned to a specific room."""
        if room_id is not None:
            tenants = self.queryset.filter(assigned_room_id=room_id)
            serializer = self.get_serializer(tenants, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Room ID is required."}, status=status.HTTP_400_BAD_REQUEST)


class GuardianViewSet(viewsets.ModelViewSet):
    queryset = Guardian.objects.all()
    serializer_class = GuardianSerializer

     # Custom action to get guardian by tenant ID
    def guardian_list(request):
        tenant_id = request.GET.get('tenant')
        guardians = get_list_or_404(Guardian, tenant_id=tenant_id)
        serializer = GuardianSerializer(guardians, many=True)
        return Response(serializer.data)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        tenant_id = self.request.query_params.get('tenantId')
        if tenant_id:
            return Transaction.objects.filter(tenant_id=tenant_id)
        return Transaction.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()  # Make a mutable copy of request.dat

        # Convert 'transaction_date' to the actual transaction date (e.g., today)
        if 'transaction_date' in data:
            try:
                data['transaction_date'] = datetime.strptime(data['transaction_date'], '%d-%m-%Y').date()
            except ValueError:
                data['transaction_date'] = datetime.now().date()
        else:
            data['transaction_date'] = datetime.now().date()

        # Ensure 'transaction_time' is set to the current time if not provided
        if 'transaction_time' in data:
            try:
                data['transaction_time'] = datetime.strptime(data['transaction_time'], '%H:%M:%S').time()
            except ValueError:
                data['transaction_time'] = datetime.now().time()
        else:
            data['transaction_time'] = datetime.now().time()

    # Ensure 'month_paid_for' and 'year_paid_for' are taken from request
        if 'month_paid_for' not in data:
            data['month_paid_for'] = datetime.now().month  # Set default if missing
        if 'year_paid_for' not in data:
            data['year_paid_for'] = datetime.now().year  # Set default if missing


        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            # Save the transaction
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DashboardDataViewSet(viewsets.ViewSet):
    def list(self, request):
        current_month = now().month
        current_year = now().year
        
        total_tenants = Tenant.objects.count()
        paid_tenants = Transaction.objects.filter(
            is_paid=True,
            transaction_date__month=current_month,
            transaction_date__year=current_year
        ).count()
        unpaid_tenants = total_tenants - paid_tenants

        data = {
            'total_tenants': total_tenants,
            'paid_tenants': paid_tenants,
            'unpaid_tenants': unpaid_tenants
        }
        return Response(data)


# # Initialize Xendit client
# xendit = Xendit(api_key=settings.XENDIT_SECRET_API_KEY)

# class GCashPaymentViewSet(viewsets.ViewSet):
#     @action(detail=False, methods=['post'], url_path='create-gcash-payment')
#     def create_gcash_payment(self, request):
#         try:
#             amount = request.data['amount']
#             tenant_id = request.data['tenant_id']
#             email = request.data['email']
            
#             # Create the payment via Xendit
#             gcash_payment = xendit.Invoice.create(
#                 external_id=f"invoice_{tenant_id}",
#                 amount=amount,
#                 payer_email=email,
#                 description=f"Payment for tenant {tenant_id}",
#                 payment_methods=["GCASH"],
#             )
            
#             # Save the transaction with Xendit invoice ID
#             transaction = Transaction(
#                 tenant_id=tenant_id,
#                 amount_paid=amount,
#                 payment_method='GCASH',
#                 month_paid_for=datetime.now().month,
#                 year_paid_for=datetime.now().year,
#                 xendit_invoice_id=gcash_payment['id']
#             )
#             transaction.save()
            
#             return Response(gcash_payment, status=status.HTTP_201_CREATED)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# class XenditWebhookViewSet(viewsets.ViewSet):
#     @action(detail=False, methods=['post'], url_path='xendit-webhook')
#     def xendit_webhook(self, request):
#         try:
#             data = request.data
#             invoice_id = data.get('id')
#             status = data.get('status')
            
#             # Update the transaction based on the webhook data
#             if status == 'PAID':
#                 transaction = Transaction.objects.filter(xendit_invoice_id=invoice_id).first()
#                 if transaction:
#                     transaction.is_paid = True
#                     transaction.save()
                    
#             return Response({"message": "Webhook received"}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



