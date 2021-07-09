import { Component, OnInit, Input } from '@angular/core';
import { IPost, IUser } from 'src/app/models';
import { PostService, UserService } from 'src/app/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';

@Component({
  selector: 'app-posts',
  templateUrl: 'posts.component.html',
})
export class PostsComponent implements OnInit {
  @Input() inputUserId: number = null;

  usersList: IUser[];
  postsList: IPost[];
  public errorMsg: string = null;
  public isloading = false;
  public isloadingForm = false;

  constructor(
    private userService: UserService,
    private postService: PostService,
    private formBuilder: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.isloading = true;
    if (this.inputUserId) {
      this.postService.getPostsByUser(this.inputUserId).subscribe(
        (posts) => {
          this.postsList = posts;
          this.isloading = false;
        },
        (err) => {
          this.errorMsg = err;
          this.isloading = false;
        }
      );
    } else {
      this.userService.getUsers().subscribe(
        (users) => {
          this.usersList = users;
          this.postService.getPosts().subscribe(
            (posts) => {
              posts.forEach((e) => {
                e.userName = this.usersList.find((x) => x.id == e.userId).name;
              });
              this.postsList = posts;
              this.isloading = false;
            },
            (err) => {
              this.errorMsg = err;
              this.isloading = false;
            }
          );
        },
        (err) => {
          this.errorMsg = err;
          this.isloading = false;
        }
      );
    }

    this.postForm = this.formBuilder.group(this.userDefault());
  }

  deletePost(id: number) {
    this.isloading = true;
    this.message.loading('deleting post...', { nzDuration: 0 });
    this.postService.deletePost(id).subscribe(
      (res) => {
        let updatePost = this.postsList.find((x) => x.id == id);
        let index = this.postsList.indexOf(updatePost);
        if (index !== -1) {
          this.postsList.splice(index, 1);
          this.postsList = [...this.postsList];
          this.isloading = false;
          this.message.remove();
          this.message.success('deleted', { nzDuration: 1000 });
        }
      },
      (err) => {
        this.errorMsg = err;
        this.isloading = false;
        this.message.remove();
        this.message.error('failed', { nzDuration: 2000 });
      }
    );
  }

  //#region Form Modal

  postForm: FormGroup;

  get posts() {
    return this.postForm.get('posts') as FormArray;
  }

  addPost() {
    this.posts.push(
      this.formBuilder.group({
        id: [null],
        userId: [null, Validators.required],
        title: [null, Validators.required],
        body: [null, Validators.required],
      })
    );
  }
  removePost(index) {
    this.posts.removeAt(index);
  }

  isVisible = false;
  isEditMode = false;
  selectedPost: IPost = null;

  showModal(id: number | null): void {
    this.addPost();
    if (id !== null) {
      this.isloadingForm = true;
      this.isVisible = true;
      this.isEditMode = true;
      this.postService.getPost(id).subscribe(
        (res) => {
          this.isloadingForm = false;
          this.postForm.setValue({
            posts: [
              {
                id: res.id,
                userId: res.userId,
                title: res.title,
                body: res.body,
              },
            ],
          });
        },
        (err) => {
          this.isloadingForm = false;
          this.errorMsg = err;
          this.isVisible = false;
          this.isEditMode = false;
        }
      );
    } else {
      this.isVisible = true;
      this.isEditMode = false;
    }
  }

  handleOk(): void {
    this.updateTreeValidity(this.postForm);

    if (this.postForm.invalid) {
      return;
    }

    this.isloadingForm = true;
    if (this.isEditMode) {
      this.message.loading('updating post...', { nzDuration: 0 });
      let forEditData = this.postForm.value.posts[0] as IPost;
      this.updatePost(forEditData);
      for (let index = 1; index < this.postForm.value.posts.length; index++) {
        this.createPost(this.postForm.value.posts[index]);
      }
    } else {
      this.message.loading('creating post...', { nzDuration: 0 });
      this.postForm.value.posts.forEach((data: IPost, idx, array) => {
        this.createPost(data);
      });
    }
  }

  private updatePost(data: IPost) {
    this.postService.updatePost(data).subscribe(
      (res) => {
        if (this.inputUserId == null) {
          res.userName = this.usersList.find((x) => x.id == res.userId).name;
        }
        let updatePost = this.postsList.find((x) => x.id == res.id);
        let index = this.postsList.indexOf(updatePost);
        this.postsList[index] = res;
        this.postsList = [...this.postsList];
        this.resetForm();
        this.message.remove();
        this.message.success('post updated', { nzDuration: 1000 });
        this.isVisible = false;
        this.isEditMode = false;
        this.isloadingForm = false;
      },
      (err) => {
        this.errorMsg = err;
        this.message.remove();
        this.message.error('failed', { nzDuration: 2000 });
      }
    );
  }
  private createPost(data: IPost) {
    this.postService.createPost(data).subscribe(
      (res) => {
        if (this.inputUserId == null) {
          res.userName = this.usersList.find((x) => x.id == res.userId).name;
        }
        this.postsList.push(res);
        this.postsList = [...this.postsList];
        this.resetForm();
        this.isVisible = false;
        this.isEditMode = false;
        this.isloadingForm = false;
        this.message.remove();
        this.message.success('post created', { nzDuration: 1000 });
      },
      (err) => {
        this.errorMsg = err;
        this.message.remove();
        this.message.error('failed', { nzDuration: 2000 });
      }
    );
  }

  private userDefault() {
    return {
      posts: this.formBuilder.array([]),
    };
  }

  handleCancel(): void {
    this.resetForm();
    this.isVisible = false;
    this.isEditMode = false;
    this.isloadingForm = false;
  }

  resetForm() {
    let count = this.posts.controls.length;
    for (let index = 0; index < count; index++) {
      this.posts.removeAt(0);
    }
  }

  // for all controls in all levels...
  updateTreeValidity(group: FormGroup | FormArray): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];

      if (
        abstractControl instanceof FormGroup ||
        abstractControl instanceof FormArray
      ) {
        this.updateTreeValidity(abstractControl);
      } else {
        abstractControl.markAsDirty();
        abstractControl.updateValueAndValidity();
      }
    });
  }

  //#endregion
}
