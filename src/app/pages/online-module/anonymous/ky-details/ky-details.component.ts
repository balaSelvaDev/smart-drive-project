import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/admin-service/user-module/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../../../../shared/service/auth-service.service';

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
    idProofType: 'AADHAAR',
    drivingLicenseImageFileName: '',
    idProofTypeImageFileName: ''
  };

  profilePreview: string | ArrayBuffer | null = null;

  constructor(private userService: UserService, private router: Router,
    private http: HttpClient, private route: ActivatedRoute,
    public authService: AuthServiceService
  ) {

  }

  // 
  userForm!: FormGroup;

  // Extract PROFILE imageUrl safely
  profileImageUrl: string | null = null;
  drivingLicenseImageUrl: string | null = null;
  idProofTypeImageUrl: any | null = null;

  drivingLicenseImageFlag: boolean = false;
  idProofTypeFlag: boolean = false;

  idProofFiles: File[] = [];

  imageKeyName: (string | null)[] = [];
  savedIdProofFileName: string | null = null;

  profileImageFile: File | null = null;
  profileImage: string = 'assets/default_profile_img.png';
  idProofRemoveBtn: boolean = false;

  user: any = null;

  ngOnInit(): void {
    this.userForm = new FormGroup({
      userId: new FormControl('', [Validators.required]),
      kycId: new FormControl('', [Validators.required]),

      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      drivingLicenseNumber: new FormControl('', [Validators.required]),
      phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      idProofType: new FormControl('AADHAAR', [Validators.required]),
      idProofNumber: new FormControl(''),
      addressLine1: new FormControl(''),
      addressLine2: new FormControl(''),
      pincode: new FormControl(''),
      taluk: new FormControl(''),
      district: new FormControl(''),
      state: new FormControl(''),
      country: new FormControl(''),
      fatherName: new FormControl(''),
      motherName: new FormControl(''),


      nomineeName: new FormControl(''),
      nomineeRelation: new FormControl(''),
      nomineePhone: new FormControl(''),
      occupation: new FormControl(''),
      companyName: new FormControl(''),
      alternatePhoneNumber: new FormControl(''),

      drivingLicenseImageFileName: new FormControl(''),
      idProofTypeImageFileName: new FormControl(''),

      userListIsStatus: new FormControl('')
    });
    this.authService.user$.subscribe(u => {
      this.user = u;
    });
    this.fetchUsersById(this.user.userId);
    // this.fetchUsersById('118');
  }

  fetchUsersById(userId: String): void {
    this.userService.getUsersById(userId).subscribe(response => {
      console.log(response);

      this.userForm.controls["userId"].setValue(response.userDetailsResponseDTO.userId);

      this.userForm.controls["firstName"].setValue(response.userDetailsResponseDTO.firstName);
      this.userForm.controls["lastName"].setValue(response.userDetailsResponseDTO.lastName);
      this.userForm.controls["email"].setValue(response.userDetailsResponseDTO.email);
      this.userForm.controls["phoneNumber"].setValue(response.userDetailsResponseDTO.phoneNumber);

      if (response.userKycDetailsResponseDTO !== null) {

        if (response.userKycImageResponseDTO?.DRIVING_LICENSE?.length > 0) {
          this.drivingLicenseImageUrl = response.userKycImageResponseDTO.DRIVING_LICENSE[0].imageUrl;
          this.userForm.controls['drivingLicenseImageFileName'].setValue(response.userKycImageResponseDTO.DRIVING_LICENSE[0].originalFileName);
          this.drivingLicenseImageFlag = true;
        }

        if (response.userKycImageResponseDTO?.PAN_CARD?.length > 0 ||
          response.userKycImageResponseDTO?.AADHAAR?.length > 0 ||
          response.userKycImageResponseDTO?.PASSPORT?.length > 0
        ) {
          this.idProofFiles = [];
          if (response.userKycImageResponseDTO?.PAN_CARD) {
            this.idProofTypeImageUrl = response.userKycImageResponseDTO.PAN_CARD[0].imageUrl;
            this.userForm.controls['idProofTypeImageFileName'].setValue(response.userKycImageResponseDTO.PAN_CARD[0].originalFileName);
            // this.idProofTypeImageUrl = (response.userKycImageResponseDTO?.PASSPORT);
            this.savedIdProofFileName = "PAN_CARD";
          }
          if (response.userKycImageResponseDTO?.AADHAAR) {
            this.idProofTypeImageUrl = response.userKycImageResponseDTO.AADHAAR[0].imageUrl;
            this.userForm.controls['idProofTypeImageFileName'].setValue(response.userKycImageResponseDTO.AADHAAR[0].originalFileName);
            // this.idProofTypeImageUrl = (response.userKycImageResponseDTO?.PASSPORT);
            this.savedIdProofFileName = "AADHAAR";
          }
          if (response.userKycImageResponseDTO?.PASSPORT) {
            this.idProofTypeImageUrl = response.userKycImageResponseDTO.PASSPORT[0].imageUrl;
            this.userForm.controls['idProofTypeImageFileName'].setValue(response.userKycImageResponseDTO.PASSPORT[0].originalFileName);
            // this.idProofTypeImageUrl = (response.userKycImageResponseDTO?.PASSPORT);
            this.savedIdProofFileName = "PASSPORT";
          }
          console.log("ID Proof Type Image URL:", this.idProofTypeImageUrl);
          // Create a dummy File object
          let dummyFile = new File([new Blob(['dummy content'], { type: 'text/plain' })], 'dummy.txt');

          // Add the dummy file to the array
          this.idProofFiles.push(dummyFile);
          this.idProofTypeFlag = true;
          this.idProofRemoveBtn = true;
        }

        this.kyc = {
          profilePic: response.userKycDetailsResponseDTO.profilePic,
          drivingLicenseNumber: response.userKycDetailsResponseDTO.drivingLicenseNumber,
          idProofNumber: response.userKycDetailsResponseDTO.idProofNumber,
          addressLine1: response.userKycDetailsResponseDTO.addressLine1,
          addressLine2: response.userKycDetailsResponseDTO.addressLine2,
          pincode: response.userKycDetailsResponseDTO.pincode,
          taluk: response.userKycDetailsResponseDTO.taluk,
          district: response.userKycDetailsResponseDTO.district,
          state: response.userKycDetailsResponseDTO.state,
          country: response.userKycDetailsResponseDTO.country,
          fatherName: response.userKycDetailsResponseDTO.fatherName,
          motherName: response.userKycDetailsResponseDTO.motherName,
          nomineeName: response.userKycDetailsResponseDTO.nomineeName,
          nomineeRelation: response.userKycDetailsResponseDTO.nomineeRelation,
          nomineePhone: response.userKycDetailsResponseDTO.nomineePhone,
          occupation: response.userKycDetailsResponseDTO.occupation,
          companyName: response.userKycDetailsResponseDTO.companyName,
          alternatePhone: response.userKycDetailsResponseDTO.alternatePhone,
          idProofType: 'AADHAAR',
          drivingLicenseImageFileName: response.userKycImageResponseDTO.DRIVING_LICENSE[0].originalFileName,
          idProofTypeImageFileName: this.userForm.controls['idProofTypeImageFileName'].value
        }
      } else {
        alert("KYC details not found");
      }
      // if (response.userKycImageResponseDTO?.PROFILE?.length > 0) {
      //   this.profileImageUrl = response.userKycImageResponseDTO.PROFILE[0].imageUrl;
      // }


      // console.log("Profile Image URL:", this.profileImageUrl);
      // this.profileImage = this.profileImageUrl || 'assets/default_profile_img.png';

    });
  }

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

  editUser() {
    this.router.navigate(['/customer/profile/edit-kyc-details']); // pass ID in URL
  }

}
