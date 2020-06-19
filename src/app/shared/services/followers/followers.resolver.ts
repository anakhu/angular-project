import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { FollowersService } from './followers.service';
import { Follower } from '../../models/followers/follower';
import { take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})

export class FollowersResolver implements Resolve<Follower[]> {
  constructor(private coursesService: FollowersService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Follower[]> {
    return this.coursesService.loadFollowers().pipe(take(1));
  }
}
