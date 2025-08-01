import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'policy-form',
	templateUrl: './policy.component.html',
})
export class PolicyFormComponent implements OnInit {
	form!: FormGroup;

	@Output() next = new EventEmitter<FormGroup>();

	constructor(private fb: FormBuilder) { }

	ngOnInit(): void {
		this.form = this.fb.group({
			title: [''],
			lastName: ['', Validators.required],
			firstName: ['', Validators.required],
			idType: [''],
			idNumber: [''],
			birthDate: [null],
			address: [''],
			city: [''],
			socioProfessionalGroup: [''],
			profession: [''],
			quality: [''],
			companyName: [''],
			patent: [''],
			commercialRegister: [''],
			activity: [''],
			email: ['', [Validators.email]],
			phone: [''],
			mobile: ['']
		});

		this.form.patchValue({
			title: 'M.',
			lastName: 'NDIAYE',
			firstName: 'ALIOUNE',
			idType: 'CNI',
			idNumber: '1000123456789',
			birthDate: new Date('1985-06-15'),
			address: 'Rue 12 Médina',
			city: 'Dakar',
			socioProfessionalGroup: '',
			companyName: '',
			patent: '',
			commercialRegister: '',
			profession: 'Chauffeur',
			activity: 'Transport de personnes',
			email: 'alioune.ndiaye@email.com',
			quality: '',
			phone: '338010101',
			mobile: '770101010'
		});
	}

	goNext(): void {
		if (this.form.valid) {
			this.next.emit(this.form);
		} else {
			this.form.markAllAsTouched();
		}
	}
}
