'use strict';

let todoControl = document.querySelector('.todo-control'),
    headerInput = document.querySelector('.header-input'),
    todoList = document.querySelector('.todo-list'),
    todoCompleted = document.querySelector('.todo-completed');


let todoData = [];

const saveData = function(value, bool){
    let data = [value, bool];

    localStorage.removeItem([value, !bool]);

    localStorage.setItem(data, JSON.stringify(data));
}

const getData = function(){

    for(let i = 0; i < localStorage.length; i++){

        let data = JSON.parse(localStorage.getItem(localStorage.key(i)));

        let newTodo = {
            'value': data[0],
            'completed': data[1]
        };

        todoData.push(newTodo);
    }

    console.log(todoData);
}

const render = function(){

    headerInput.value = '';
    todoList.textContent = '';
    todoCompleted.textContent = '';

    todoData.forEach(function(item, i){

        let li = document.createElement('li');
        li.classList.add('todo-item');

        li.innerHTML = `<span class="text-todo">${item.value}</span>` +
        `<div class="todo-buttons">` +
            `<button class="todo-remove"></button>` +
            `<button class="todo-complete"></button>` +
        `</div>`;

        if(item.completed){
            todoCompleted.append(li);
        } else{
            todoList.append(li);
        }

        let btnTodoComplete = li.querySelector('.todo-complete');
        let btnTodoRemove = li.querySelector('.todo-remove');

        btnTodoComplete.addEventListener('click', function(){
            item.completed = !item.completed;
            saveData(item.value, item.completed);
            render();
        })

        btnTodoRemove.addEventListener('click', function(){
            todoData.splice(i, 1);
            localStorage.removeItem(localStorage.key(i));
            render();
        });

    });

};

todoControl.addEventListener('submit', function(event){
    event.preventDefault();

    if(headerInput.value.trim() === ''){
        return;
    }

    let newTodo = {
        'value': headerInput.value,
        'completed': false
    };

    todoData.push(newTodo);

    saveData(headerInput.value, false);

    render();

});

getData();
render();