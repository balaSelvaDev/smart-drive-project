
export class ConfirmBookingData {
    userId!: number;
    vehicleId!: number;
    drivingLicenseNumber!: string;
    startDate!: string;
    endDate!: string;
    pickupLocation!: string;
    dropLocation!: string;
    paymentMode!: string;
    bookingType!: string;

    distanceKm!: string;
    tripAmt!: number;
    convenienceAmt!: number;
    refundableAmt!: number;
    totalAmount!: number;

    brandName!: string;
    vehicleModelName!: string;
    paymentStatus!: string;
    paymentReference!: string;
    discountAmount!: string;
    clientLocationId!: number;
    isClientLocationRequired!: boolean;
}
