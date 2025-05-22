import { Gender, MaritalStatus, LicenseCategory, EmploymentStatus } from "@core/enums";

export class Insured {
  id: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  gender: Gender;
  maritalStatus: MaritalStatus;
  address: string;
  city: string;
  postalCode: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseIssueDate: string;
  licenseCategory: LicenseCategory;
  registrationDate: string;
  profession: string;
  employmentStatus: EmploymentStatus;
  managementEntity: string;

  constructor(data: any) {
    this.id = data.id || '';
    this.lastName = data.lastName || '';
    this.firstName = data.firstName || '';
    this.birthDate = data.birthDate || '';
    this.gender = data.gender || '';
    this.maritalStatus = data.maritalStatus || '';
    this.address = data.address || '';
    this.city = data.city || '';
    this.postalCode = data.postalCode || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.licenseNumber = data.licenseNumber || '';
    this.licenseIssueDate = data.licenseIssueDate || '';
    this.licenseCategory = data.licenseCategory || '';
    this.registrationDate = data.registrationDate || '';
    this.profession = data.profession || '';
    this.employmentStatus = data.employmentStatus || '';
    this.managementEntity = data.managementEntity || '';
  }
}
