import { Upload } from './upload.interface';

class UploadedImage implements Upload {
  $key: string;
  file: File;
  name: string;
  url: string;
  progress: number;
  createdAt: string;

  constructor(file: File) {
    this.file = file;
  }
}
