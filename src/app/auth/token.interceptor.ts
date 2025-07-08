import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('access');
  if (token) {
    const cloned = request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(request);
};
