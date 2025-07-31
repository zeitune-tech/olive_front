import { Component, Input } from '@angular/core';

@Component({
  selector: 'attestation-auto',
  templateUrl: './attestation-auto.component.html',
})
export class AttestationAutoComponent {
  @Input() policeNumber = '685-11000006';
  @Input() attestationNumber = 'SN0122NCHIR';
  @Input() immatriculation = 'AA749QS';
  @Input() marque = 'PEUGEOT';
  @Input() modele = '307';
  @Input() genre = 'VÉHICULE PARTICULIER';
  @Input() assure = 'ALIOUNE NDIAYE';
  @Input() dateDebut = '22-07-2024';
  @Input() dateFin = '21-01-2025 à 23:59';
  @Input() cleSecurite = '218075834284343506';
  @Input() categorie = 'Véhicule Particulier';
  @Input() nombrePlace = 5;
  @Input() puissanceFiscale = 6;
}