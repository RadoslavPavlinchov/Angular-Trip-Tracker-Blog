import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostI } from "../../../shared/models/post.interface";
import { PostService } from "../post.service";

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {

  image: any;

  constructor(private postService: PostService) { }

  public newPostForm = new FormGroup({
    titlePost: new FormControl('', Validators.required),
    contentPost: new FormControl('', Validators.required),
    tagsPost: new FormControl('', Validators.required),
    imagePost: new FormControl('', Validators.required)
  })

  ngOnInit() {
  }

  addNewPost(data: PostI) {
    this.postService.preAddAndUpdatePost(data, this.image);
  }

  imageHandler(ev: any): void {
    this.image = ev.target.files[0];
  }

}
