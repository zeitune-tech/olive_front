
import { Routes } from '@angular/router';
import { AuthSignInComponent } from './sign-in/sign-in.component';
import { AuthForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const authRoutes: Routes = [
    {
        path: 'sign-in', 
        component: AuthSignInComponent,
    },
    {
        path: 'forgot-password',
        component: AuthForgotPasswordComponent
    }
]