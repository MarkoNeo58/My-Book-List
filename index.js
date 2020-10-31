// create book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// display books
class UI {
    // method that displays books from local storage
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book) => { UI.addBookToList(book) });

    }

    // method that adds the book to the list (in table)
    static addBookToList(book) {
        const list = document.querySelector("#book-list");

        //creating new row for book data
        const row = document.createElement("tr");

        //changing the row
        row.innerHTML = `
            <th>${book.title}</th>
            <th>${book.author}</th>
            <th>${book.isbn}</th>
            <th><a href="#" class="btn btn-danger btn-sm delete">X</a></th>
        `;

        //appending row to the list
        list.appendChild(row);
    }

    //clearing fields
    static clearFileds() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }

    //remove book
    static removeBook(element) {
        if(element.classList.contains("delete")){
            element.parentElement.parentElement.remove();
        }
    }

    //validation message
    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.innerHTML = message;
        document.querySelector("#form").insertAdjacentElement("beforebegin", div);
        // remove div after few seconds
        setTimeout(()=>{
            div.remove();
        }, 2500);
    }
}

// local storage
class Store {
    //getting books
    static getBooks() {
        let books;
        //checking if there is books item in local storage
        if(localStorage.getItem("books") === null){
            //if not create empty array
            books = [];
        } else {
            // else store that item in books variable
            books = JSON.parse(localStorage.getItem("books"));
        }
        // return updated variable
        return books;
    }

    //add book in local storage
    static addBook(book) {
        //get books from getBooks method
        const books = Store.getBooks();
        //add new object in array
        books.push(book);
        //convert to one big string and add to local storage
        localStorage.setItem("books", JSON.stringify(books));
    }

    //remove book local storage
    static removeBook(isbn) {
        //get books from getBooks method
        const books = Store.getBooks();
        //check for the maching isbn
        books.forEach((e, index) => {
            if(e.isbn === isbn){
                books.splice(index, 1);
            }
        });
        //reset local storage
        localStorage.setItem("books", JSON.stringify(books));
    }
}


//////// EVENTS

//Event that displays books on load
document.addEventListener("DOMContentLoaded", UI.displayBooks());

// Event that adds the book in table
document.querySelector("#form").addEventListener("submit", (e) => {
    // preventing page reloading
    e.preventDefault();
    
    //  get values from form
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    //Check if all inputs are filled
    if(title === "" || author === "" || isbn === ""){
        UI.showAlert("Please fill all fields", "danger")
    } else {
        // instantiate book
        const book = new Book(title, author, isbn);
        
        //add book to list
        UI.addBookToList(book);
        
        //add book to local storage
        Store.addBook(book);
        
        //show message
        UI.showAlert("Book Added", "success");

        //clearing inputs
        UI.clearFileds();
    }
});

//Event that removes books
document.querySelector("#book-list").addEventListener("click",(e) => {
    //remove from UI
    UI.removeBook(e.target);
    console.log()
    //remove from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    //show message
    UI.showAlert("Book Removed", "success");
});

