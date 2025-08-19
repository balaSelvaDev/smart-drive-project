import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../core/services/admin-service/user-module/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent {

  userForm!: FormGroup;
  profileImageFile: File | null = null;
  drivingLicenseImageFile: File | null = null;
  idProofFiles: File[] = [];
  idProofRemoveBtn: boolean = false;

  // Extract PROFILE imageUrl safely
  profileImageUrl: string | null = null;
  drivingLicenseImageUrl: string | null = null;
  idProofTypeImageUrl: string | null = null;

  constructor(private userService: UserService, private router: Router,
    private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute
  ) {

  }

  userId!: string;

  drivingLicenseImageFlag: boolean = false;
  idProofTypeFlag: boolean = false;

  ngOnInit(): void {
    this.userForm = new FormGroup({
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
      idProofTypeImageFileName: new FormControl('')
    });
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    // Option 2: Subscribe to changes (useful if the route can change while the component is active)
    // this.route.paramMap.subscribe(params => {
    //   this.userId = params.get('userId')!;
    // });
    this.fetchUsersById(this.userId);
  }

  onSubmit(): void {
    console.log(this.userForm.value);
    if (this.userForm.valid) {
      console.log('Form is valid, submitting data...');
      const payload = this.userForm.value;
      console.log('Payload:', payload);

      const formData = new FormData();

      // Add profile image
      if (this.profileImageFile) {
        // formData.append('profileImage', this.profileImageFile);
        formData.append('profileImage', this.profileImageFile, this.profileImageFile.name);
      }
      console.log("this.profileImageFile: ", this.profileImageFile);

      if (this.drivingLicenseImageFile) {
        formData.append('drivingLicenseImage', this.drivingLicenseImageFile, this.drivingLicenseImageFile.name);
      }

      // Add Aadhaar/ID proof files
      this.idProofFiles.forEach(file => {
        formData.append('idProofFiles', file, file.name); // multiple with same name
      });
      formData.append('firstName', this.userForm.get('firstName')?.value);
      formData.append('lastName', this.userForm.get('lastName')?.value);
      formData.append('email', this.userForm.get('email')?.value);
      formData.append('drivingLicenseNumber', this.userForm.get('drivingLicenseNumber')?.value);
      formData.append('phoneNumber', this.userForm.get('phoneNumber')?.value);
      formData.append('idProofType', this.userForm.get('idProofType')?.value);
      formData.append('idProofNumber', this.userForm.get('idProofNumber')?.value);
      formData.append('addressLine1', this.userForm.get('addressLine1')?.value);
      formData.append('addressLine2', this.userForm.get('addressLine2')?.value);
      formData.append('pincode', this.userForm.get('pincode')?.value);
      formData.append('taluk', this.userForm.get('taluk')?.value);
      formData.append('district', this.userForm.get('district')?.value);
      formData.append('state', this.userForm.get('state')?.value);
      formData.append('country', this.userForm.get('country')?.value);
      formData.append('fatherName', this.userForm.get('fatherName')?.value);
      formData.append('motherName', this.userForm.get('motherName')?.value);
      formData.append('nomineeName', this.userForm.get('nomineeName')?.value);
      formData.append('nomineeRelation', this.userForm.get('nomineeRelation')?.value);
      formData.append('nomineePhone', this.userForm.get('nomineePhone')?.value);
      formData.append('occupation', this.userForm.get('occupation')?.value);
      formData.append('companyName', this.userForm.get('companyName')?.value);
      formData.append('alternatePhoneNumber', this.userForm.get('alternatePhoneNumber')?.value);

      console.log('FormData:', formData);
      this.userService.addUserByAdmin(formData).subscribe({
        next: (res) => {
          console.log('User added successfully', res);
          this.router.navigate(['/get-user']); // Navigate to the user list page
        },
        error: (err) => {
          console.error('Failed to add user', err);
        },
      });
    } else {
      console.log("error, please check required fields...")
      this.userForm.markAllAsTouched(); // Highlight all errors
    }
  }
  profileImage: string = 'assets/default_profile_img.png';

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // 
  onProfileImageChange(event: any) {
    if (event.target.files.length === 0) {
      return; // No file selected
    }
    if (event.target.files && event.target.files[0]) {
      this.profileImageFile = event.target.files[0];
      console.log('Selected profile image:', this.profileImageFile);
    }
    // Read the file and set the profileImage for preview
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onDrivingLicenseImageChange(event: any) {
    this.drivingLicenseImageFile = event.target.files[0];
    this.drivingLicenseImageFlag = true;
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.drivingLicenseImageUrl = null;
      const fileName = input.files[0].name;
      this.userForm.controls['drivingLicenseImageFileName'].setValue(fileName);
      console.log('Selected file name:', fileName);
    }
  }

  onIdProofFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.idProofFiles = [];
      this.idProofFiles.push(file);
      this.idProofRemoveBtn = true;
      //
      this.idProofTypeFlag = true;
      const input = event.target as HTMLInputElement;

      if (input.files && input.files.length > 0) {
        this.idProofTypeImageUrl = null;
        const fileName = input.files[0].name;
        this.userForm.controls['idProofTypeImageFileName'].setValue(fileName);
        console.log('Selected file name:', fileName);
      }
    }
  }

  removeIdProofFile(index: number, idProofType: HTMLInputElement) {
    this.idProofFiles.splice(index, 1);
    idProofType.value = ''; // ✅ resets the input field
    this.idProofTypeFlag = false;
    this.idProofFiles = [];
    this.userForm.controls['idProofTypeImageFileName'].setValue("");
  }

  getPincodeDetails() {
    const pincode = this.userForm.get('pincode')?.value;
    if (pincode) {
      this.userService.getPincodeDetails(pincode).subscribe({
        next: (res) => {
          console.log('Pincode details:', res);
          // Handle the response as needed
          this.userForm.controls['taluk'].setValue(res.data.taluk);
          this.userForm.controls['district'].setValue(res.data.district_name);
          this.userForm.controls['state'].setValue(res.data.state_name);
          this.userForm.controls['country'].setValue("India");
        },
        error: (err) => {
          console.error('Error fetching pincode details:', err);
        }
      });
    }
  }

  clearLocationFields(pincode: string) {
    if (pincode === "") {
      this.userForm.controls["taluk"].setValue("");
      this.userForm.controls["district"].setValue("");
      this.userForm.controls["state"].setValue("");
      this.userForm.controls["country"].setValue("");
    }
  }

  fetchUsersById(userId: String): void {
    this.userService.getUsersById(userId).subscribe(response => {
      console.log(response);
      this.userForm.controls["firstName"].setValue(response.userDetailsResponseDTO.firstName);
      this.userForm.controls["lastName"].setValue(response.userDetailsResponseDTO.lastName);
      this.userForm.controls["email"].setValue(response.userDetailsResponseDTO.email);
      this.userForm.controls["phoneNumber"].setValue(response.userDetailsResponseDTO.phoneNumber);

      this.userForm.controls["addressLine1"].setValue(response.userKycDetailsResponseDTO.addressLine1);
      this.userForm.controls["addressLine2"].setValue(response.userKycDetailsResponseDTO.addressLine2);
      this.userForm.controls["alternatePhoneNumber"].setValue(response.userKycDetailsResponseDTO.alternatePhoneNumber);
      this.userForm.controls["companyName"].setValue(response.userKycDetailsResponseDTO.companyName);

      this.userForm.controls["country"].setValue(response.userKycDetailsResponseDTO.country);
      this.userForm.controls["district"].setValue(response.userKycDetailsResponseDTO.district);
      this.userForm.controls["drivingLicenseNumber"].setValue(response.userKycDetailsResponseDTO.drivingLicenseNumber);
      this.userForm.controls["fatherName"].setValue(response.userKycDetailsResponseDTO.fatherName);

      this.userForm.controls["idProofNumber"].setValue(response.userKycDetailsResponseDTO.idProofNumber);
      this.userForm.controls["idProofType"].setValue(response.userKycDetailsResponseDTO.idProofType);
      this.userForm.controls["motherName"].setValue(response.userKycDetailsResponseDTO.motherName);
      this.userForm.controls["nomineeName"].setValue(response.userKycDetailsResponseDTO.nomineeName);

      this.userForm.controls["nomineePhone"].setValue(response.userKycDetailsResponseDTO.nomineePhone);
      this.userForm.controls["nomineeRelation"].setValue(response.userKycDetailsResponseDTO.nomineeRelation);
      this.userForm.controls["occupation"].setValue(response.userKycDetailsResponseDTO.occupation);
      this.userForm.controls["pincode"].setValue(response.userKycDetailsResponseDTO.pincode);

      this.userForm.controls["state"].setValue(response.userKycDetailsResponseDTO.state);
      this.userForm.controls["taluk"].setValue(response.userKycDetailsResponseDTO.taluk);



      if (response.userKycImageResponseDTO?.PROFILE?.length > 0) {
        this.profileImageUrl = response.userKycImageResponseDTO.PROFILE[0].imageUrl;
      }

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
          this.idProofFiles.push(response.userKycImageResponseDTO?.PASSPORT);
        }
        if (response.userKycImageResponseDTO?.AADHAAR) {
          this.idProofTypeImageUrl = response.userKycImageResponseDTO.AADHAAR[0].imageUrl;
          this.userForm.controls['idProofTypeImageFileName'].setValue(response.userKycImageResponseDTO.AADHAAR[0].originalFileName);
          this.idProofFiles.push(response.userKycImageResponseDTO?.PASSPORT);
        }
        if (response.userKycImageResponseDTO?.PASSPORT) {
          this.idProofTypeImageUrl = response.userKycImageResponseDTO.PASSPORT[0].imageUrl;
          this.userForm.controls['idProofTypeImageFileName'].setValue(response.userKycImageResponseDTO.PASSPORT[0].originalFileName);
          this.idProofFiles.push(response.userKycImageResponseDTO?.PASSPORT);
        }
        this.idProofTypeFlag = true;
        this.idProofRemoveBtn = true;
      }

      console.log("Profile Image URL:", this.profileImageUrl);
      this.profileImage = this.profileImageUrl || 'assets/default_profile_img.png';

    });
  }

  viewImage(profileImageUrl: any) {
    if (this.drivingLicenseImageUrl && this.drivingLicenseImageUrl != null) {
      window.open(this.drivingLicenseImageUrl, '_blank');
    }
    // const imageUrl = profileImageUrl;
    // if (profileImageUrl) {
    //   window.open(profileImageUrl, '_blank');
    // }
  }

  openFileDialog(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  clearDrivingLicenseImage(drivingLicenseImage: HTMLInputElement) {
    // this.images[index].file = null;
    drivingLicenseImage.value = ''; // ✅ resets the input field
    this.drivingLicenseImageFlag = false;
    this.drivingLicenseImageFile = null;
    this.userForm.controls['drivingLicenseImageFileName'].setValue("");
  }

  viewDrivingLicenseImage(event: any) {
    if (this.drivingLicenseImageFlag && this.drivingLicenseImageFile != null) {
      const file = this.drivingLicenseImageFile;
      if (file) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      }
    }
    if (this.drivingLicenseImageFlag && this.drivingLicenseImageUrl && this.drivingLicenseImageUrl != null) {
      window.open(this.drivingLicenseImageUrl, '_blank');
    }
  }

  viewIdProofFileImage(i: number, event: any) {
    if (this.idProofTypeFlag && this.idProofFiles[i]) {
      const file = this.idProofFiles[i];
      if (file) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      }
    }
    if (this.idProofTypeImageUrl && this.idProofTypeImageUrl && this.idProofTypeImageUrl != null) {
      window.open(this.idProofTypeImageUrl, '_blank');
    }
  }

}
