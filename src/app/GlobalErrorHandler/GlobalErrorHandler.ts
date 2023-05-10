import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(
        private router: Router,
    ) { }
    handleError(error: any): void {
        const chunkFailedMessage = /Loading chunk [\d]+ failed/;
        //console.log(error.message);
        if (chunkFailedMessage.test(error.message)) {
            var answer = confirm ("New Updates Available Please Reload or Clear Browser Cache...");
            if (answer) window.location.reload();
        }
    }
}