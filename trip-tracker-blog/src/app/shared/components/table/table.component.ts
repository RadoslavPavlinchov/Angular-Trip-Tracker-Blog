import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PostService } from '../../../components/posts/post.service';
import { PostI } from '../../models/post.interface';

import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { ModalComponent } from "./../modal/modal.component";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['titlePost', 'tagsPost', 'actions'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private postService: PostService, public dialog: MatDialog) { }

  ngOnInit() {
    this.postService.getAllPosts().subscribe(posts => (this.dataSource.data = posts))
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onEditPost(post: PostI) {
    this.openDialog(post);
    console.log('Edit post', post);

  }

  onDeletePost(post: PostI) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No, cancel!',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonColor: '#3085d6',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.value) {
        this.postService.deletePostById(post).then(() => {
          Swal.fire('Deleted!', 'Your post has been deleted.', 'success')
        }).catch((error) => {
          Swal.fire('Cancelled', 'Your post is safe :)', 'error');
        });
      }
    });
  }

  onNewPost() {
    this.openDialog();
  }

  openDialog(post?: PostI): void {
    const config = {
      data: {
        message: post ? 'Edit Post' : 'New Post',
        content: post
      }
    }
    const dialogRef = this.dialog.open(ModalComponent, config);
    dialogRef.afterClosed().subscribe(res => {
      console.log(`Dialog result ${res}`);
    })
  }

}