import { Course } from '../../models/courses/course';

export class NewCourse implements Course {
  constructor(
    public name: string,
    public content: string,
    public authorId: string,
    public startDate: string,
    public endDate: string,
    public price: number,
    public certificate: boolean,
    public image: string,
    public isActive?: boolean,
    public likes?: number,
  ) {
    this.name = name;
    this.content = content;
    this.authorId = authorId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.price = price;
    this.certificate = certificate;
    this.image = image ? image : './assets/courses/course.png';
    this.isActive = true;
    this.likes = 0;
  }

}
