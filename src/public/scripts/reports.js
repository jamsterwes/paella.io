function isChecked(){
    console.log("hello")
    if (option1.checked) {
        document.getElementById("b-option1").classList.add("active")
        document.getElementById("b-option2").classList.remove("active")
        document.getElementById("b-option3").classList.remove("active")
        document.getElementById("b-option4").classList.remove("active")
    }
    else if (option2.checked) {
        document.getElementById("b-option1").classList.remove("active")
        document.getElementById("b-option2").classList.add("active")
        document.getElementById("b-option3").classList.remove("active")
        document.getElementById("b-option4").classList.remove("active")
    }
    else if (option3.checked) {
        document.getElementById("b-option1").classList.remove("active")
        document.getElementById("b-option2").classList.remove("active")
        document.getElementById("b-option3").classList.add("active")
        document.getElementById("b-option4").classList.remove("active")
    }
    if (option4.checked) {
        document.getElementById("b-option1").classList.remove("active")
        document.getElementById("b-option2").classList.remove("active")
        document.getElementById("b-option3").classList.remove("active")
        document.getElementById("b-option4").classList.add("active")

        document.getElementById("from").disabled = false;
        document.getElementById("to").disabled = false;
    }
    
    else if (!option4.checked) {
        document.getElementById("from").disabled = true;
        document.getElementById("to").disabled = true;
    }
}