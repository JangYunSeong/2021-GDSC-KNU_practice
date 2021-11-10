const promise = new Promise((x,y,resolve,reject) => {
    if(x>0 && y>0){
        resolve({
            perimeter : (x,y) => 2 *(x + y),
            area : (x,y) => x*y
        });
    }
    else{
        reject("Rectangel dimensiongs should be greater than zero : l = " + x +" and b = " + y);
    }   
})

module.exports = promise;