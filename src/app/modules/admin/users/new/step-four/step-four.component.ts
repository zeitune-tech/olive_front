import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from "@angular/forms";
import { Profile } from "@core/services/auth/profile/profile.interface";
import { ProfileService } from "@core/services/auth/profile/profile.service";
import { Subject, takeUntil } from "rxjs";
import { StepperDataService } from "../form.service";

@Component({
    selector: 'new-user-step-four',
    templateUrl: './step-four.component.html'
})
export class StepFourComponent implements OnInit { 

    @Output() formReady = new EventEmitter<UntypedFormGroup>();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    formGroup!: UntypedFormGroup;
    profiles: Profile[] = [];
    filteredProfiles: Profile[] = [];

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _stepperDataService: StepperDataService,
        private _profileService: ProfileService

    ) {
        this.formGroup = this._formBuilder.group({
            profiles: [[], Validators.required],
        });
        this._profileService.profiles$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((profiles) => {
            this.profiles = profiles;
            this.filteredProfiles = profiles;
        });

        this._stepperDataService.level$.subscribe((level) => {
            console.log(level);
            this.filteredProfiles = this.profiles.filter((profile) => {
                return profile.level === level;
            });
        })
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