function isChecked(){
    console.log("hello")
    if (option4.checked) {
        document.getElementById("from").disabled = false;
        document.getElementById("to").disabled = false;
    }
    
    else if (!option4.checked) {
        document.getElementById("from").disabled = true;
        document.getElementById("to").disabled = true;
    }
}