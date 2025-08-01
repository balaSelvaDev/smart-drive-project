import { Component } from '@angular/core';

@Component({
  selector: 'app-ky-details',
  templateUrl: './ky-details.component.html',
  styleUrl: './ky-details.component.css'
})
export class KyDetailsComponent {
  kyc = {
    profilePic: '',
    drivingLicenseNumber: '',
    idProofNumber: '',
    addressLine1: '',
    addressLine2: '',
    pincode: '',
    taluk: '',
    district: '',
    state: '',
    country: '',
    fatherName: '',
    motherName: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineePhone: '',
    occupation: '',
    companyName: '',
    alternatePhone: '',
    idProofType: 'AADHAAR'
  };

  profilePreview: string | ArrayBuffer | null = null;

  onProfilePicSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = e => this.profilePreview = reader.result;
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit() {
    alert('KYC Details saved successfully!');
    console.log(this.kyc);
  }
}
