import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/admin-service/user-module/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css'
})
export class UserAddComponent {

  userForm!: FormGroup;
  profileImageFile: File | null = null;
  drivingLicenseImageFile: File | null = null;
  drivingLicenseImageFlag: boolean = false;
  idProofTypeFlag: boolean = false;
  idProofFiles: File[] = [];
  idProofRemoveBtn: boolean = false;

  constructor(private userService: UserService, private router: Router,
    private fb: FormBuilder, private http: HttpClient
  ) {

  }

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
      this.uploadImages(formData);
      this.userService.addUserByAdmin(formData).subscribe({
        next: (res) => {
          console.log('User added successfully', res);
          this.router.navigate(['/admin/get-user']);
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
      const fileName = input.files[0].name;
      this.userForm.controls['drivingLicenseImageFileName'].setValue(fileName);
      console.log('Selected file name:', fileName);
    }
  }

  viewDrivingLicenseImage(event: any) {
    if (this.drivingLicenseImageFlag) {
      const file = this.drivingLicenseImageFile;
      if (file) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      }
    }
  }

  clearDrivingLicenseImage(drivingLicenseImage: HTMLInputElement) {
    // this.images[index].file = null;
    drivingLicenseImage.value = ''; // ✅ resets the input field
    this.drivingLicenseImageFlag = false;
    this.drivingLicenseImageFile = null;
    this.userForm.controls['drivingLicenseImageFileName'].setValue("");
  }

  viewIdProofFileImage(i: number, event: any) {
    if (this.idProofTypeFlag) {
      const file = this.idProofFiles[i];
      if (file) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      }
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
        const fileName = input.files[0].name;
        this.userForm.controls['idProofTypeImageFileName'].setValue(fileName);
        console.log('Selected file name:', fileName);
      }
    }
  }

  removeIdProofFile(index: number, idProofType: HTMLInputElement) {
    this.idProofFiles.splice(index, 1);
    idProofType.value = ''; // ✅ resets the input field
    this.drivingLicenseImageFlag = false;
    this.drivingLicenseImageFile = null;
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

  uploadImages(formData: FormData) {
    // const formData = new FormData();

    // this.idProofFiles.forEach((imgObj, i) => {
    //   if (imgObj) {
    //     formData.append('images', imgObj);
    //     console.log(`Image ${i + 1}:`, imgObj.name);
    //   }
    // });

    console.log('--- FormData Contents ---');
    if (formData && typeof (formData as any).entries === 'function') {
      for (const pair of (formData as any).entries()) {
        console.log(pair[0], pair[1]);
      }
    } else {
      console.warn('FormData.entries() is not supported in this environment');
    }
  }

  openFileDialog(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

}
