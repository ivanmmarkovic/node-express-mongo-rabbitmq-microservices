

export function handleErrors(error) {
    let status = 500;
    let message = 'Internal server error';
    
    if(error.message.indexOf('dup key') != -1){
        let key = error.message.substring(error.message.lastIndexOf('{') + 1, error.message.lastIndexOf(':')).trim();
        status = 400;
        message = `Duplicate key ${key}`;
    }
    if(error.message.indexOf('required') != -1){
        let key = error.message.substring(error.message.indexOf('`') + 1, error.message.lastIndexOf('`'));
        status = 400;
        message = `Required field ${key}`;
    }
    if(error.message == 'Not found'){
        status = 404;
        message = 'Not found';
    }

    return [status, message];
}


