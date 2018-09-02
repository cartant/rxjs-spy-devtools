import { Injectable } from '@angular/core';
import { CONTENT_MESSAGE, MESSAGE_REQUEST } from '@devtools/constants';
import { isBatch, isBroadcast, isPostRequest, isPostResponse } from '@devtools/guards';
import { Broadcast, DeckStats, Message, Notification, Post, Request, Response } from '@devtools/interfaces';
import { Observable } from 'rxjs';
import { concatMap, filter, map, merge, share, take } from 'rxjs/operators';
import { ChromeService } from '../chrome';

@Injectable()
export class SpyService {

  public batchedMessages: Observable<Message>;
  public deckStats: Observable<DeckStats>;
  public notifications: Observable<Notification>;
  public posts: Observable<Post>;
  public requests: Observable<Post & Request>;
  public responses: Observable<Post & Response>;
  public snapshotHints: Observable<Message>;

  constructor(private _chromeService: ChromeService) {
    this.posts = _chromeService.posts.pipe(
      filter(post => post.postType === CONTENT_MESSAGE),
      share()
    );
    this.batchedMessages = this.posts.pipe(
      filter(isBatch),
      concatMap(message => message.messages)
    );
    this.deckStats = this.posts.pipe(
      merge(this.batchedMessages),
      filter(isBroadcast),
      filter(message => message.broadcastType === 'deck-stats'),
      map(message => message.stats as DeckStats),
      share()
    );
    this.notifications = this.posts.pipe(
      merge(this.batchedMessages),
      filter(isBroadcast),
      filter(message => message.broadcastType === 'notification'),
      map(message => message.notification as Notification),
      share()
    );
    this.requests = this.posts.pipe(
      filter(isPostRequest),
      share()
    );
    this.responses = this.posts.pipe(
      filter(isPostResponse),
      share()
    );
    this.snapshotHints = this.posts.pipe(
      merge(this.batchedMessages),
      filter(isBroadcast),
      filter(message => message.broadcastType === 'snapshot-hint'),
      share()
    );
  }

  post(message: Message): Post {
    return this._chromeService.post(message);
  }

  request(request: { [key: string]: any; requestType: string }): Observable<Post & Response> {
    const message = { ...request, messageType: MESSAGE_REQUEST };
    const { postId } = this.post(message);
    return this.responses.pipe(
      filter(response => response.request.postId === postId),
      take(1)
    );
  }
}
