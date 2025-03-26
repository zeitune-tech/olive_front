import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { Profile } from "@core/services/profile/profile.interface";
import { ProfileService } from "@core/services/profile/profile.service";
import { UserService } from "@core/services/user/user.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: 'new-user-step-four',
    templateUrl: './step-four.component.html'
})
export class StepFourComponent implements OnInit { 

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    formGroup!: UntypedFormGroup;
    profiles: Profile[] = [];

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _profileService: ProfileService

    ) {
        this.formGroup = this._formBuilder.group({
            profiles: [[], Validators.required],
        });
        this._profileService.profiles$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((profiles) => {
            this.profiles = profiles;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    ngOnInit(): void {}

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Step one next
     */
    onNext(): void {
        this.formGroup.get('profileName')?.setValue(this.profiles.find(r => r.id === this.formGroup.get('profile')?.value)?.name);
        this.formReady.emit(this.formGroup);
    }
}