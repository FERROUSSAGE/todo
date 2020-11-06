'use strict';

class Todo {

    constructor(form, input, todoList, todoCompleted){
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
        this.todoContainer = document.querySelector('.todo-container'),
        this.requestID;
    }


    addToStorage(){
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render(){
        
        this.todoCompleted.textContent = '';
        this.todoList.textContent = '';
        this.todoData.forEach(this.createElement, this);
        this.addToStorage();

    }

    createElement(todo){
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.style.opacity = 1;
        li.dataset.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-edit"></button>
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);

        if(!todo.completed){
            this.todoList.append(li);
        } else {
            this.todoCompleted.append(li);
        }
    }

    generateKey(){
        let a = Math.floor(Math.random() * 256),
        b = Math.floor(Math.random() * 256),
        c = Math.floor(Math.random() * 256);
    
        return `${a.toString(16)}${b.toString(16)}${c.toString(16)}`;
    }


    animate(target, cb) {
        let value = parseFloat(target.style.opacity);
        this.requestID = setInterval(() => {
            if(value <= 0){
                clearInterval(this.requestID);
                cb.call(this, target);
            }
            value -= 0.1;
            target.style.opacity = value;
        }, 50);
    }

    deleteItem(target){
        this.todoData.forEach((item) => {
            if(item.key === target.dataset.key){
                this.todoData.delete(item.key);
                this.addToStorage();
                this.render();
            }
        });
    }

    completedItem(target){
        this.todoData.forEach((item) => {
            if(item.key === target.dataset.key){
                this.todoData.set(item.key, {
                    'value': item.value,
                    'completed': !item.completed,
                    'key': item.key
                });
                this.addToStorage();
                this.render();
            }
        });
    }

    editItem(target){
        this.todoData.forEach((item) => {
            if(item.key === target.dataset.key){
                this.todoData.set(item.key, {
                    'value': target.children[0].textContent,
                    'completed': item.completed,
                    'key': item.key
                });
                this.addToStorage();
                this.render();
            }
        });
    }

    handler(){

        this.todoContainer.addEventListener('click', (event) => {

            const target = event.target;
            if(target.matches('.todo-remove')){
                this.animate(target.parentNode.parentNode, this.deleteItem)
            }
            if(target.matches('.todo-complete')){
                this.animate(target.parentNode.parentNode, this.completedItem);
            }
            if(target.matches('.todo-edit')){
                const li = target.parentNode.parentNode;
                li.setAttribute('contenteditable', 'true');

                li.addEventListener('blur', () => {
                    this.editItem(li);
                });
            }
        });

    }

    addTodo(event){
        event.preventDefault();

        if(this.input.value.trim() !== ''){
            const newTodo = {
                'value': this.input.value,
                'completed': false,
                'key': this.generateKey()
            };

            this.todoData.set(newTodo.key, newTodo);
            this.render();

            this.input.value = '';
        } else {
            alert("Поле должно быть заполнено!");
        }
    }

    init() {
        this.input.required = true;
        this.render();
        this.handler();
        this.form.addEventListener('submit', this.addTodo.bind(this));
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();