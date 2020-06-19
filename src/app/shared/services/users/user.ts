import { User } from '../../models/user/user';

export class NewUser implements User {
  constructor(
    public id: string,
    public name: string,
    public country: { name: string; code: string; },
    public occupation: string,
    public isActive: true,
    public image: string,
  ) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.occupation = occupation;
    this.isActive = true;
    this.image = image ? image : './assets/user/userpic.png';
  }
}
