const LIMIT_OF_DIGITS = 10;

let operator = function( operation, num1, num2){
    switch(operation){
        case "/":
            if(num2 == 0)
                return NaN;
            
            return (num1)/(num2);
        case "x":
            return (num1)*(num2);
        case "-":
            return (num1)-(num2);
        case "+": 
            return (num1)+(num2);
       
        default:
            return NaN;

    }
}
let controller = {
    num1 : NaN,
    nextOperation : "",
    newNumberInputed : false,
    callOperation : function(currentNum,operation){   
        if(!this.num1){
            this.num1 = parseFloat(currentNum);
        }
        else if(this.newNumberInputed){
            this.num1 = operator(this.nextOperation, this.num1, parseFloat(currentNum));
        }
        this.newNumberInputed = false;
        this.nextOperation = operation;        
        return this.num1;
    },
    clear : function(){
        this.num1 = NaN;
        this.newNumberInputed = false;
        this.operation = "";
    },
    callEqual(currentNum){
        if(!this.num1 || !this.newNumberInputed)
            return currentNum;
        let result = operator(this.nextOperation, this.num1, parseFloat(currentNum));
        this.clear();
        return result;
    }

}

let display = {
    content : "0",
    representationObject : document.querySelector("#display"),
    inputDigit: function(digit){
        if(!digit){
            this.placehold("ERROR");
            this.clear();
        }
        else if(this.content.length == 1 && this.content == "0" && digit != ".")
            this.content = digit;
        else if(this.content.length < LIMIT_OF_DIGITS)
            this.content = this.content.concat(digit);
    },
    removeDigit : function(){
        if(this.content.length > 1)
            this.content = this.content.slice(0,this.content.length-1);
        else
            this.clear();
    },
    clear : function(){
        this.content = "0";
    },
    refresh : function(){
        this.representationObject.textContent = this.content;
    },
    placehold(placeHolder){
        this.representationObject.textContent = placeHolder;
    },
}

let digits = document.querySelectorAll(".digit");
digits.forEach((digit)=>{
    digit.addEventListener("click",()=>{
        display.inputDigit(digit.textContent);
        display.refresh();
        controller.newNumberInputed = true;
        if(digit.textContent == "."){
            digit.disabled = true;
        }
    });
});

document.querySelector("#backspace").addEventListener("click",()=>{
    display.removeDigit();
    display.refresh();
});

document.querySelector("#clear").addEventListener("click",()=>{
    display.clear();
    controller.clear();
    display.refresh();
});

document.querySelectorAll(".operation").forEach((operation)=>{
        operation.addEventListener("click", ()=>{
        display.placehold(`${controller.callOperation(display.content, operation.textContent)}`);
        display.clear(); // It's set the result only as a placeholder, and the user should input new numbers to remove the place holder
        document.querySelector("#dot").disabled = false; 
    });
});
document.querySelector("#equal").addEventListener("click",()=>{
    display.content = `${controller.callEqual(display.content)}`;
    display.refresh();
    document.querySelector("#dot").disabled = false; 
});