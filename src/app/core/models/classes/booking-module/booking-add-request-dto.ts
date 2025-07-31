import { BookingStatus } from "../../../../shared/enum/booking-status";
import { CancelledBy } from "../../../../shared/enum/cancelled-by";
import { PaymentMode } from "../../../../shared/enum/payment-mode";
import { PaymentStatus } from "../../../../shared/enum/payment-status";

export class BookingAddRequestDTO {

    userId: number;
    vehicleId: number;

    bookingReference: string;

    startDate: string;
    endDate: string;

    pickupLocation: string;
    dropLocation: string;

    status: BookingStatus;
    paymentMode: PaymentMode;
    paymentReference: string;
    paymentStatus: PaymentStatus;

    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    bookingType: string;

    cancellationReason: string;
    cancelledBy: CancelledBy;
    cancellationDate: string;

}
