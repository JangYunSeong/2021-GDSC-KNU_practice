var rect = require('./rectangle')

function solveRect(l,b){
    console.log("Solving for rectangle with l : " + l + " and b = "+b);

    rect
        .then((message) => {
            console.log(message.area(l,b)),
            console.log(message.perimeter(l,b));
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(()=>{
            console.log('무조건');
        })
};

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
