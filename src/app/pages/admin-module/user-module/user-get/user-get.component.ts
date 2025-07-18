import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-get',
  templateUrl: './user-get.component.html',
  styleUrl: './user-get.component.css'
})
export class UserGetComponent {

  constructor(private router: Router) { }

  navigateToAddUser() {
    this.router.navigate(['/admin/add-user']); // absolute navigation
  }

  images: { file: File | null }[] = [{ file: null }];

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.images[index].file = file;
    }
  }

  addImageField() {
    this.images.push({ file: null });
  }

  removeField(index: number) {
    if (this.images.length > 1) {
      this.images.splice(index, 1);
    }
  }

  uploadImages() {
    const formData = new FormData();

    this.images.forEach((imgObj, i) => {
      if (imgObj.file) {
        // Use a consistent key or index-based key if backend expects it
        formData.append('images', imgObj.file);
        console.log(`Image ${i + 1}:`, imgObj.file.name);
      }
    });

    // Debug: log keys and values in FormData
    console.log('--- FormData Contents ---');
    if (formData && typeof (formData as any).entries === 'function') {
      for (const pair of (formData as any).entries()) {
        console.log(pair[0], pair[1]);
      }
    } else {
      console.warn('FormData.entries() is not supported in this environment');
    }

    // TODO: send formData using HttpClient POST
    // this.http.post('your-backend-url', formData).subscribe(...)
  }

  clearImage(index: number, fileInput: HTMLInputElement) {
    this.images[index].file = null;
    fileInput.value = ''; // ✅ resets the input field
  }

}
