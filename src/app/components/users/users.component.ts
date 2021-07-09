import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/models';
import { UserService } from 'src/app/services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
})
export class UsersComponent implements OnInit {
  usersList: IUser[];
  public selectedTabIndex = 0;
  public errorMsg: string = null;
  public isloading = false;
  public isloadingForm = false;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.isloading = true;
    this.userService.getUsers().subscribe(
      (res) => {
        this.usersList = res;
        this.isloading = false;
        this.message.remove();
      },
      (err) => {
        this.errorMsg = err;
        this.isloading = false;
        this.message.remove();
      }
    );

    this.userForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      address: this.formBuilder.group({
        street: [null, Validators.required],
        suite: [null, Validators.required],
        city: [null, Validators.required],
        zipcode: [null, Validators.required],
      }),
      phone: [null, Validators.required],
      website: [null, Validators.required],
      company: this.formBuilder.group({
        name: [null, Validators.required],
      }),
    });
  }

  deleteUser(id: number) {
    this.isloading = true;
    this.message.loading('deleting user...', { nzDuration: 0 });
    this.userService.deleteUser(id).subscribe(
      (res) => {
        let updateUser = this.usersList.find((x) => x.id == id);
        let index = this.usersList.indexOf(updateUser);
        if (index !== -1) {
          this.usersList.splice(index, 1);
          this.usersList = [...this.usersList];
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

  userForm: FormGroup;

  isVisible = false;
  isEditMode = false;
  selectedUser: IUser = null;

  showModal(id: number | null): void {
    if (id !== null) {
      this.isloadingForm = true;
      this.isVisible = true;
      this.isEditMode = true;
      this.userService.getUser(id).subscribe(
        (res) => {
          this.isloadingForm = false;
          this.userForm.setValue({
            id: res.id,
            name: res.name,
            username: res.username,
            email: res.email,
            address: {
              street: res.address.street,
              suite: res.address.suite,
              city: res.address.city,
              zipcode: res.address.zipcode,
            },
            phone: res.phone,
            website: res.website,
            company: {
              name: res.company.name,
            },
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
    for (const i in this.userForm.controls) {
      this.updateTreeValidity(this.userForm);
    }

    if (this.userForm.invalid) {
      this.selectedTabIndex = 0;
      return;
    }

    this.isloadingForm = true;
    if (this.isEditMode) {
      this.message.loading('updating user...', { nzDuration: 0 });
      let data = this.userForm.value as IUser;
      this.userService.updateUser(data).subscribe(
        (res) => {
          let updateUser = this.usersList.find((x) => x.id == res.id);
          let index = this.usersList.indexOf(updateUser);
          this.usersList[index] = res;
          this.usersList = [...this.usersList];
          this.message.remove();
          this.message.success('user updated', { nzDuration: 1000 });
          this.isloadingForm = false;
        },
        (err) => {
          this.errorMsg = err;
          this.message.remove();
          this.message.error('failed', { nzDuration: 2000 });
        }
      );
    } else {
      this.message.loading('creating user...', { nzDuration: 0 });
      let data = this.userForm.value as IUser;
      this.userService.createUser(data).subscribe(
        (res) => {
          this.usersList.push(res);
          this.usersList = [...this.usersList];
          this.isEditMode = true;
          this.isloadingForm = false;
          this.message.remove();
          this.message.success('user created', { nzDuration: 1000 });
        },
        (err) => {
          this.errorMsg = err;
          this.message.remove();
          this.message.error('failed', { nzDuration: 2000 });
        }
      );
    }
  }

  handleCancel(): void {
    this.userForm.reset();
    this.isVisible = false;
    this.isEditMode = false;
    this.isloadingForm = false;
    this.selectedTabIndex = 0;
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
