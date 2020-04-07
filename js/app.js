// Seleccionar elementos
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

//Nombres de las clases
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

//Variables 

let LIST, id;

//Obtener elemento del localstorage

let data = localStorage.getItem("TODO");

//Checkear que data no esté vacío
if(data){
    LIST = JSON.parse(data);
    id = LIST.length;//id = ultimo elemento de la lista
    loadList(LIST);//cargar lista a interface de usuario
}else{
    LIST = []
    , id = 0;
}

//Cargar items a interface de usuario
function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

//Limpiar local storage
clear.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
});

//Mostrar la fecha de hoy
const options = {weekday: 'long', day: 'numeric', month: 'long'};
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("es-ES", options);

//Agregar to-do

function addToDo(toDo, id, done, trash){

    if(trash){ return; }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `
                <li class="item">
                    <i class="fa ${DONE} co" job="complete" id="${id}"></i>
                    <p class="text ${LINE}">${toDo}</p>
                    <i class="fa fa-trash-o de" job="delete" id="${id}"></i>
                </li>
                `;

    const position = "beforeend";

    list.insertAdjacentHTML(position, item);

}

//Agregar item cuando el usuario presione "enter"

document.addEventListener("keyup", function(){
    if(event.keyCode == 13){
        const toDo = input.value;
    
        //si toDo no está vacío se agrega a la lista
        if(toDo){
            addToDo(toDo, id, false, false);

            LIST.push({
                name : toDo,
                id : id,
                done : false,
                trash : false
            });

            //Agregar elemento a localstorage
            localStorage.setItem("TODO", JSON.stringify(LIST));
            
            id++;
        }
        input.value = "";
    }
});

// Completar to-do
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

//Remover to do
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
}

//Seleccionar to-do's creados

list.addEventListener("click", function(event){
    const element = event.target; //retornar elemento clickeado de la lista
    const elementJob = element.attributes.job.value;// complete o delete
    
    if(elementJob == "complete"){
        completeToDo(element);
    }else if(elementJob == "delete"){
        removeToDo(element);
    }

    //Update lista en localstorage
    localStorage.setItem("TODO", JSON.stringify(LIST));
});