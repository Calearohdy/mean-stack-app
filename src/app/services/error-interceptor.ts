import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorModalComponent } from '../modals/error-modal/error-modal.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    /**
     * Middleware to grab any outgoing requests and provide
     * additional error handling to the SPA so the user
     * can be shown useful information on the issue
     */
    constructor(private dialog: MatDialog) {}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req) // pipe - creating stream
            .pipe(catchError((error: HttpErrorResponse) => {
                let errorMessage = 'An unknown error occured';
                if (error.error.message) {
                    errorMessage = error.error.message;
                }
                this.dialog.open(ErrorModalComponent, {data: {message: errorMessage}});
                return throwError(error);
            })
        );
    }
}
