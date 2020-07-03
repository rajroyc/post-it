import { Observable, Observer, of } from 'rxjs';
import { FormControl } from '@angular/forms';

/*
  Objective of this function is to be an custom, asynchronous formControl Validator.
  To be asynchronous, this function will return a Promise/Observable
  The generic type of the Promise/Observable is an object:
  { [key: string]: any }  --> the notation means that the object can have any number of keys of type string
  and the corresponding value of that key can be of any type
*/
export const mimeType = (control: FormControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  const file = control.value as File;
  const fileReader = new FileReader();

  /*
    Since we have to return an Observable, we need to create an Observable first.
    If we already had a stream/array of concrete values available, we would have created
    a new Observable using the syntax: return from(values), or, return of(value);

    But our Observable here is a custom logic that determines the payload of the Observable
    The create method takes a Observer of generic type as input. The generic type is the same type of the
    payload which this Observable if finally required to return
  */
  const frObs = Observable.create((observer: Observer<{ [key: string]: any }>) => {
    console.log('Type of image value:');
    console.log(control.value);
    console.log(typeof(control.value));

    if (typeof(control.value) === 'string') {
      console.log('Detected an imapge path');
      return of(null);
    }
    fileReader.addEventListener('loadend', () => {
      /*
        when the file is read as an ArrayBuffer, we can store the metadata and the contents of the
        file as an 8bit unsigned array, i.e. the file information, contents will be broken down
        every 8 bits and loaded on to an array. Every cell of the array will have 8 unsigned bits of the
        file information.

        The mime type related information can be extracted from the first 5 cells of this array,
        i.e the first 40 unsigned bits can be parsed to identify the mietype of the file
      */
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }

      let isValid = false;

      switch (header) {
        case '89504e47':
          isValid = true;
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
          isValid = true;
          break;
        default:
          isValid = false; // or you can use blob.type as fallback
          break;
      }

      if (isValid) {
        // form control validator should return null if the validation was successful
        observer.next(null);
      } else {
        // on unsuccessful validation, return the custom object which was specified as the generic return type
        observer.next({ invalidMimeType: true, validatorName: 'MimeTypeValidator' });
      }

      // complete the observer in order to let the subscriber know that asynchronous processing is completed
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });

  // return the Observable
  return frObs;
};
