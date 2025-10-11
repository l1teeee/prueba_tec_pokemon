import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormHeader } from './form-header/form-header';
import { Userinfo } from './user-info/user-info';
import { Imageupload } from './image-upload/image-upload';
import { Loading } from '@components/loading/loading';
import { UserData } from '@models/user-data.model';
import { UserDataService } from '@services/user-data.service';
import { PickPokemon } from '@components/form-user/pick-pokemon/pick-pokemon'

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [CommonModule, FormsModule, FormHeader, Userinfo, Loading, Imageupload, PickPokemon],
  templateUrl: './form-user.html',
  styleUrls: ['./form-user.scss'],
})
export class Formuser implements OnInit, OnDestroy {
  @ViewChild(Userinfo) userInfoComponent!: Userinfo;
  @ViewChild(PickPokemon) pickPokemonComponent!: PickPokemon;

  userData!: UserData;
  showImageValidation = false;
  showLoading = false;
  isRegistrationComplete = false;
  private subscription: Subscription = new Subscription();

  constructor(private userDataService: UserDataService) {}

  ngOnInit() {
    this.checkRegistrationStatus();

    this.subscription.add(
      this.userDataService.userData$.subscribe(data => {
        this.userData = data;
      })
    );

    this.userDataService.loadUserData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkRegistrationStatus() {
    const registerComplete = localStorage.getItem('registerComplete');
    this.isRegistrationComplete = registerComplete === 'true';
  }

  onImageChange(image: string | null) {
    this.userDataService.updateUserData({ imagen: image || '' });
    if (image) {
      this.showImageValidation = false;
    }
  }

  onFormDataChange(data: Partial<UserData>) {
    this.userDataService.updateUserData(data);
  }

  onPokemonLoadingChange(isLoading: boolean) {
    this.showLoading = isLoading;
  }



  onSubmit() {
    const isFormValid = this.userInfoComponent.validateAll();
    const hasImage = !!this.userData.imagen;

    if (!hasImage) {
      this.showImageValidation = true;
    }

    if (!isFormValid || !hasImage) {
      setTimeout(() => {
        if (!hasImage) {
          const imageError = document.querySelector('.error-banner-red');
          if (imageError) {
            imageError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          const firstError = document.querySelector('.error-message');
          if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }, 100);

      return;
    }

    const pokemonTeam = localStorage.getItem('pokemon-selected-team');
    const hasTeam = pokemonTeam && JSON.parse(pokemonTeam).length > 0;

    if (hasTeam) {
      localStorage.setItem('entrenadorComplete', 'true');
    }

    const completeUserData = {
      ...this.userData,
      registerComplete: true
    };

    const saved = this.userDataService.saveUserData(completeUserData);

    if (saved) {
      localStorage.setItem('registerComplete', 'true');
      this.showLoading = true;
      console.log('Datos guardados:', completeUserData);
    } else {
      alert('Error al guardar el perfil');
    }
  }

  onLoadingComplete() {
    this.showLoading = false;
    alert('Datos guardados exitosamente');
    window.location.reload();
    this.showImageValidation = false;
    this.isRegistrationComplete = true;
  }
}
